import React, {useState, useEffect} from 'react';
import {H1, H2, P, ButtonInvert, Button, LocalAvatar,OtherFeedBox, PostsPlaceholder, TouchFeedback, BoxLoader} from '../../../../components/component';
import {Container, Page, TouchWrap, scaleFont, SizedBox, ImageWrap, Avatar, ScrollArea} from '@burgeon8interactive/bi-react-library';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from '../../../../helpers/colors';
import {useStoreState,useStoreActions} from 'easy-peasy';
//import {Like, Unlike} from '../../../../helpers/sockets';
import {Like, Unlike, ReloadGroups} from '../../../../helpers/global_sockets';
import { apiFunctions } from '../../../../helpers/api';
import { Retry } from '../../../../components/retry';
import moment from 'moment';
import { getData, storeData } from '../../../../helpers/functions';
import { ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FONTSIZE } from '../../../../helpers/constants';

const GroupDetails = props => {
  const index = props.route.params;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [groupPost, setGroupPost] = useState(null);
  const [likes, setLikes] = useState([]);
  const [unlike, setUnLike] = useState([]);
  const [is_member,setMembership] = useState(null);
  const [fetch,setFetch] = useState(true);
  
  const {updateGroupInfo,updateFunc,updateRetry,
    updateGroupHolders,updateGroupData,updateCurGrpPosts} = useStoreActions(actions =>({ 
    updateGroupInfo : actions.community.updateGroupInfo,
    updateFunc : actions.retryModel.updateFunc,
    updateRetry : actions.retryModel.updateRetry,
    updateGroupHolders : actions.community.updateGroupHolders,
    updateGroupData : actions.community.updateGroupData,
    updateCurGrpPosts : actions.community.updateCurGrpPosts
  }));

  const {user,token,retry,funcCall,group_holders,group_data,cur_grp_posts} = useStoreState(state => ({
    user: state.userDetails.user,
    token : state.userDetails.token,
    retry : state.retryModel.retry,
    funcCall : state.retryModel.funcCall,
    group_holders : state.community.group_holders,
    group_data : state.community.group_data,
    cur_grp_posts : state.community.cur_grp_posts
  }));

  const askJoinOrLeave = async (action = null) => {
    try{

      let index = props.route.params;
      setLoading(true);
      updateRetry(false);
      updateFunc(askJoinOrLeave); 
      let type = action === "join" ? "join" : "remove"; 
      if(action === "join" && data.closed === true){
        type = "create_request";
      }
      let res = await apiFunctions.joinGroups(token,index.id,type);
      res = type === "create_request" ? res.group : res;
      let grp_index = group_data.map(data=>data.id).indexOf(res.id)
      let arr = [...group_data];
      arr[grp_index] = res;
      await storeData('groups',arr);
      updateGroupData(arr);
      let fd = {"group_id" : index.id, token : global.token}
      ReloadGroups(fd);
      setLoading(false);
    }catch(error){
      updateFunc(askJoinOrLeave);
      updateRetry(true);
      setLoading(false);
    }
  };

  const likeDislike = async (el, path,i) => {
    let isLiked = el.likes.filter(ell => ell.id === user.id).length > 0;
    if(isLiked || likes.includes(el.id) === true){
      setLikes([]);
      Unlike(path, el.id)
    }else{
      setLikes([...likes,el.id])
      Like(path, el.id);
    }
    setTimeout(()=>{
      loadPostData()
    },200)
  };

  const loadPostData = async () => {
    let fd = {group_id: index.id,token : global.token};
    let grp_post = await getData(`grp_post-${fd.group_id}`);
    if(grp_post) {
      updateCurGrpPosts(grp_post);
      setGroupPost(grp_post);
    }
    ListenGroupPost(fd);
  };

  const loadGroupDetails = async () => {
    let group_data = await getData("groups");
    let theData = group_data.filter(el => el.id === index.id)[0];
    if(theData === undefined || !theData.admins){
      return;
    }
    let membership = is_member !== null ? is_member : theData.is_member;
    theData.is_member = membership;
    global.GroupPost = theData;
    setData(theData);
  };

  const ListenGroupPost = fd => {
    console.log("ListenGroupPost",fd,global.socket);
    global.socket.emit('get_group_posts', fd, res => {});
  };

  const CurrGrpPostListener = () => {
    global.socket.off(`get_group_posts_${index.id}`).on(`get_group_posts_${index.id}`,({res}) => {
      if(res.message) return
      storeData("group_update",true);
      storeData(`grp_post-${index.id}`,res);
      updateGroupHolders([]);
      updateCurGrpPosts(res);
      setGroupPost(res);
      setFetch(false);
    });
    global.socket.off(`post_to_group_${index.id}`).on(`post_to_group_${index.id}`,async ({res}) =>{
      if(res.message) return
      let grp_posts = await getData(`grp_post-${res.id}`);
      storeData("group_update",true);
      let data = [res.post,...grp_posts];
      storeData(`grp_post-${res.id}`,data);
      updateGroupHolders([]);
      updateCurGrpPosts(data);
      setGroupPost(data);
    });
  }

  useEffect(()=>{
    CurrGrpPostListener()
    loadPostData();
    updateRetry(false);
  },[])

  useEffect(() => {
    loadGroupDetails();
  }, [group_data]);

  const tab = [
    // {text: 'Joined', icon: 'check', nav: ''},
    {text: 'Events', icon: 'calendar', nav: 'MainGroupEvents'},
    {text: 'Description', icon: 'info', nav: 'GroupInfo'},
    {text: 'Rules', icon: 'check-circle', nav: 'GroupInfo'},
    {text: 'Members', icon: 'users', nav: 'GroupInfo'},

  ];

  let admin = data && data.admins ? data.admins.includes(user.id) : false;
  return (
    <Page barIconColor="light-content" backgroundColor={Colors.primary}>
      <Container paddingHorizontal={6} paddingTop={6} direction="row" horizontalAlignment="flex-start" verticalAlignment="center">
        <TouchFeedback onPress={() => {
          props.navigation.goBack()
        }}>
          <Feather Icon name="chevron-left" size={scaleFont(25)} color="#fff" />
        </TouchFeedback>
      </Container>

      <SizedBox height={12} />
      {data ? (
        <Container backgroundColor={Colors.white} flex={1} paddingHorizontal={6} borderTopLeftRadius={50} borderTopRightRadius={50}>
          {/* ANCHOR - Search*/}
          <Container position="absolute" width={70} marginHorizontal={15} marginTop={-10}>
            <ImageWrap height={20} backgroundColor="#dfdfdf" borderRadius={20} url={data.thumbnail} elevation={15} />
          </Container>

          {/* ANCHOR - CONTENT */}
          <Container marginTop={12} flex={1}>
            {!data.is_member ? (
              <>
                <H1 textAlign="center" fontSize={FONTSIZE.big}>
                  {data.name}
                </H1>
                <P textAlign="center" fontSize={FONTSIZE.medium} color={Colors.greyBase900}>
                  {data.members_count > 1 ? `${data.members_count} Members` : `${data.members_count} Member`}
                </P>

                <SizedBox height={2} />
                {data.request_status === 'pending' ? (
                  <ButtonInvert title="Request Pending" loading={loading} />
                ) : (
                  <Button title="Join Group" loading={loading} onPress={() => askJoinOrLeave("join")} />
                )}

                <SizedBox height={4} />

                <Container direction="row" horizontalAlignment="space-between">
                  <Feather Icon name={data.closed ? 'lock' : 'unlock'} size={scaleFont(FONTSIZE.icon)} />
                  <Container widthPercent="88%">
                    <H2 fontSize={FONTSIZE.semiBig}>{data.closed ? 'Closed' : 'Open'}</H2>
                    <P fontSize={FONTSIZE.medium}>{data.closed ? "This group requires approval from the admin to be a member. Click ‘Join Group’ to send a request." : "This group is open to all Herconomy members"}</P>
                  </Container>
                </Container>

                <SizedBox height={4} />

                <Container direction="row" horizontalAlignment="space-between">
                  <Feather Icon name="eye" size={scaleFont(FONTSIZE.icon)} />
                  <Container widthPercent="88%">
                    <H2 fontSize={FONTSIZE.semiBig}>Visible</H2>
                    <P fontSize={FONTSIZE.medium}>Only members can see who’s in the group and what they post</P>
                  </Container>
                </Container>

                <SizedBox height={4} />

                <Container direction="row" horizontalAlignment="space-between">
                  <Feather Icon name="info" size={scaleFont(FONTSIZE.icon)} />
                  <Container widthPercent="88%">
                    <H2 fontSize={FONTSIZE.semiBig}>About</H2>
                    <P fontSize={FONTSIZE.medium}>{data.description}</P>
                  </Container>
                </Container>
              </>
            ) : (
              <>
                <ScrollArea>
                  <Container paddingBottom={3}>
                    <H1 textAlign="center" fontSize={FONTSIZE.semiBig}>
                      {data.name}
                    </H1>

                    <SizedBox height={0.2} />

                    <P textAlign="center" fontSize={FONTSIZE.medium} color={Colors.greyBase900}>
                      {data.description}
                    </P>
                    

                    <SizedBox height={0.2} />
                    {
                      admin && (
                        <Container horizontalAlignment="center">
                          <Container
                            marginTop={2}
                            widthPercent="50%"
                            backgroundColor={Colors.primary}
                            horizontalAlignment="center"
                            padding={2}
                            borderRadius={5}>
                            <P color="white" fontSize={FONTSIZE.medium}>
                              You are an admin
                            </P>
                          </Container>
                        </Container>
                      )
                    }
                    
                    <SizedBox height={1} />
                    <ButtonInvert title="Leave Group" loading={loading} onPress={askJoinOrLeave} />
                  </Container>
                  {/* ANCHOR  GO TO POST */}
                  <Container
                    direction="row"
                    verticalAlignment="center"
                    borderColor={Colors.primary}
                    borderBottomWidth={1}
                    paddingBottom={2}>
                    <Container width={15} horizontalAlignment="flex-start">
                      {user.photo ? <Avatar backgroundColor="#efefef" size={10} url={user.photo} /> : <LocalAvatar size={10} />}
                    </Container>

                    <Container paddingLeft={3} flex={1}>
                      <TouchFeedback
                        widthPercent="100%"
                        paddingLeft={3}
                        paddingVertical={2}
                        backgroundColor={Colors.offWhite}
                        borderRadius={5}
                        onPress={() => props.navigation.navigate('NewGroupPost', {type: 'group', value: data.name, id: data.id})}>
                        <P fontSize={FONTSIZE.semiBig} color={Colors.greyBase600}>
                          Start a conversation
                        </P>
                      </TouchFeedback>
                    </Container>
                  </Container>

                  <Container
                    direction="row"
                    paddingVertical={1}
                    borderBottomWidth={0.5}
                    borderColor={Colors.greyBase900}
                    horizontalAlignment="space-evenly">
                    {tab.map((el, i) => (
                      <TouchFeedback
                        horizontalAlignment="center"
                        padding={1}
                        key={i}
                        onPress={ async () => {
                          el.nav !== '' && props.navigation.navigate(el.nav, {
                            data, groupPost,is_admin : admin,group_id : data.id,
                            tab_name : el.text,
                            data
                          });
                        }}>
                        <Feather Icon name={el.icon} size={scaleFont(FONTSIZE.icon)} />
                        <SizedBox height={0.5} />
                        <P fontSize={FONTSIZE.medium}>{el.text}</P>
                      </TouchFeedback>
                    ))}
                  </Container>
                        {console.log("groupDetails")}
                  {
                    group_holders && group_holders.length > 0 ? (
                      <Container>
                        {
                            group_holders.filter(post=>post.group_id === data.id).map(holder=>({
                              id : "a7429e31-6267-4d3e-9d08-c3d31ba134b9",
                              body : holder.body,
                              user: user,
                              file: holder.file,
                              content_type: "group",
                              allow_comments: true,
                              number_of_likes: 0,
                              number_of_comments: 0,
                              likes: [],
                              created_at: moment.utc(new Date()).local().format(),
                              comments: {count: 0, pages: 1, result: Array(0), page: 1},
                              flag: "allowed",
                              reported: false,
                              topic : data.id
                          })).map((el,i)=>(
                            <OtherFeedBox
                              key={i}
                              data={el}
                              userD={user}
                              onPress={() => props.navigation.navigate('GroupDetailsPost', {postId: el.id, groupId: index.id})}
                              onPressLD={() => likeDislike(el, 'post')}
                              likes={likes}
                              unlike={unlike}
                              navigation={props.navigation}
                              placeholder={true}
                            />
                        ))
                      }
                    </Container>
                    ) : null
                  }

                  {fetch && groupPost ? <BoxLoader /> : null}

                  {
                    (!groupPost || !groupPost.length) && !group_holders.length ? (
                      <PostsPlaceholder />
                    ) : null
                  }
                  {groupPost ? (
                    <Container paddingBottom={2} flex={1}>
                      {groupPost.slice(0, 15).map((el, i) => (
                        <OtherFeedBox
                          key={i}
                          data={el}
                          userD={user}
                          onPress={() => props.navigation.navigate('GroupDetailsPost', {postId: el.id, groupId: index.id,post_index : i})}
                          onPressLD={() => likeDislike(el, 'post',i)}
                          likes={likes}
                          unlike={unlike}
                          navigation={props.navigation}
                          post_index={i}
                        />
                      ))}
                    </Container>
                  ) : null}
                </ScrollArea>
              </>
            )}
          </Container>
        </Container>
      ) : null}
      {
          retry ? (
            <Retry funcCall={funcCall} param={[data && data.is_member ? "remove" : "join"]}/>
          ) : null
        }
    </Page>
  );
};

export default GroupDetails;
