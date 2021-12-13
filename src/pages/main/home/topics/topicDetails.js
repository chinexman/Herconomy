import React, {useState, useEffect} from 'react';
import {SizedBox, TouchWrap, Container, ScrollArea, Avatar} from '@burgeon8interactive/bi-react-library';
import {AppPageBack, H2, H1, P, PlainFeedBox, LocalAvatar,TouchFeedback, BoxLoader, ImageCardHolder} from '../../../../components/component';
import Colors from '../../../../helpers/colors';
import {useStoreState,useStoreActions} from 'easy-peasy';
import numeral from 'numeral';
import {getData, shareDetails, storeData} from '../../../../helpers/functions';
import {Like, ReloadGroups, Unlike} from '../../../../helpers/global_sockets';
import {ActivityIndicator} from 'react-native';
import moment from 'moment';
import { FONTSIZE } from '../../../../helpers/constants';

const TopicDetails = props => {
  const {userD,topics_holders,topic_data,current_topic_posts} = useStoreState(state => ({
    userD: state.userDetails.user,
    topics_holders : state.community.topics_holders,
    topic_data : state.community.topic_data,
    current_topic_posts : state.community.current_topic_posts
  }));

  const {updateTopicHolders,updateTopicData,updateCurTopicPosts} = useStoreActions(action=>({
    updateTopicHolders : action.community.updateTopicHolders,
    updateTopicData : action.community.updateTopicData,
    updateCurTopicPosts : action.community.updateCurTopicPosts
  }));

  const [data, setData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [likes,setLikes] = useState([]);
  const [posts,setPosts] = useState([]);
  const [fetch,setFetch] = useState(true)
  const [fetching,setFetching] = useState(true)

  const loadTopicDetails = async () => {
    try{
      let topic_update = await getData('topic_update');
      if(topic_update){
        updateTopicHolders([]);
        storeData('topic_update',false);
      }
      const index = await getData("current_topic_index");
      let topic = topic_data.filter(el => el.id === index)[0];
      setData({...topic});
    }catch(err){
      console.log("err>><<",err);
    }
  };

  const unFollowIt = async () => {
    try{
      setSubmitting(true);
    let fd = {topic_id: data.id,token : global.token,user_id : userD.id};
    global.socket.emit('unfollow_topic', fd, res => {
    });
    global.socket.off(`unfollow_topic_${userD.id}`).on(`unfollow_topic_${userD.id}`, ({res}) => {
      if(res.message) return
      var index = topic_data
        .map(function(e) {
          return e.id;
        })
        .indexOf(res.id);

      let arr = [...topic_data];
      arr[index] = res;
      updateTopicData([...arr]);
      storeData('topics',arr);
      ReloadGroups()
      props.navigation.goBack();
    });
    }catch(err){
    }
  };

  const likeDislike = async (el, path,post_index) => {
    let isLiked = el.likes.filter(ell => ell.id === userD.id).length > 0;
    let sub = {
      "topics" : [{'id': data.id}]
    }
    if(isLiked || likes.includes(el.id) === true){
      setLikes([])
      Unlike(path, el.id,post_index)
    }else{
      setLikes([...likes,el.id])
      Like(path, el.id,post_index);
    }
  };
  const loadTopicPosts = async () => {
    const index = await getData("current_topic_index")
    let posts = await getData(`topic-${index}`);
    if(posts){
      updateCurTopicPosts(posts);
      setFetch(false)
    }
    topicListener();
  }
  const topicListener = async () => {
    const index = await getData('current_topic_index')
    global.socket.off('get_topic_posts').on('get_topic_posts',async ({res})=>{
      if(res.message) return;
      console.log("topicListener",res)
      await storeData(`topic-${index}`,res)
      updateCurTopicPosts(res)
      setFetch(false)
      setFetching(false);
    })
    global.socket.emit('get_topic_posts',{topic_id : index,token : global.token})
  }
  useEffect(()=>{
    loadTopicPosts();
  },[])
  useEffect(() => {
    loadTopicDetails();
  }, [topic_data]);

  return (
    <AppPageBack {...props}>
      <SizedBox height={6} />
        <>
          <Container direction="row" verticalAlignment="center" horizontalAlignment="space-between">
            <Container>
              <H1 fontSize={FONTSIZE.page}>{data ? data.title : null}</H1>
              <P fontSize={FONTSIZE.medium} color={Colors.greyBase900}>
                {data && data.number_of_followers ? numeral(data.number_of_followers).format('0 a') : 0} 
                {data && data.number_of_followers > 1 ? 'Members' : 'Member'}
              </P>
            </Container>

            {submitting ? (
              <TouchFeedback>
                <Container
                  borderRadius={5}
                  padding={3}
                  verticalAlignment="center"
                  horizontalAlignment="center"
                  borderWidth={1}
                  borderColor={Colors.primary}
                  backgroundColor={Colors.primary}>
                  <ActivityIndicator size="small" color="#fff" />
                </Container>
              </TouchFeedback>
            ) : (
              <TouchFeedback onPress={() => unFollowIt(data)}>
                <Container
                  borderRadius={5}
                  padding={3}
                  verticalAlignment="center"
                  horizontalAlignment="center"
                  borderWidth={1}
                  borderColor={Colors.primary}
                  backgroundColor={data && data.is_follower ? Colors.primary : null}>
                  <H2 color={Colors.white} fontSize={10}>
                    Unfollow
                  </H2>
                </Container>
              </TouchFeedback>
            )}
          </Container>
          <SizedBox height={2} />

          {/* ANCHOR  GO TO POST */}
          <Container direction="row" verticalAlignment="center" borderColor={Colors.primary} borderBottomWidth={1} paddingBottom={2}>
            <Container width={15} horizontalAlignment="center">
              {userD.photo ? <Avatar backgroundColor="#efefef" size={10} url={userD.photo} /> : <LocalAvatar size={10} />}
            </Container>

            <Container paddingLeft={3} flex={1}>
              <TouchFeedback
                widthPercent="100%"
                paddingLeft={2}
                paddingVertical={2}
                backgroundColor={Colors.offWhite}
                borderRadius={5}
                onPress={() => props.navigation.navigate('NewTopicPost', {type: 'topic', value: data.title, id: data.id})}>
                <P fontSize={FONTSIZE.medium} color={Colors.greyBase600}>
                  Post to topics
                </P>
              </TouchFeedback>
            </Container>
          </Container>

          <SizedBox height={2} />

          <Container paddingBottom={2} flex={1}>
            <ScrollArea>
              {
                topics_holders.filter(post=>post.topic_id === data.id).map((holder,i)=>({
                    id : "a7429e31-6267-4d3e-9d08-c3d31ba134b9",
                    body : holder.body,
                    user: userD,
                    file: holder.file,
                    content_type: "topic",
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
                    <PlainFeedBox
                      key={i}
                      data={el}
                      userD={userD}
                      onPress={() => props.navigation.navigate('TopicDetailsPost', {mainId: data.id, itemId: el.id})}
                      onPressLD={() => likeDislike(el, 'post',i)}
                      onShare={() => shareDetails({message: el.body, file: el.file})}
                      likes={likes}
                      navigation={props.navigation}
                      placeholder={true}
                  />
                ))
              }
              {
               current_topic_posts.length > 0 && fetching && !fetch ? <BoxLoader /> : null
              }
              {
                fetch ? 
                <ImageCardHolder /> : null
              }
              {current_topic_posts.slice(0, 15).map((el, i) => (
                <PlainFeedBox
                  key={i}
                  data={el}
                  userD={userD}
                  onPress={() => props.navigation.navigate('TopicDetailsPost', {mainId: data.id, itemId: el.id, post_index : i})}
                  onPressLD={() => likeDislike(el, 'post',i)}
                  onShare={() => shareDetails({message: el.body, file: el.file})}
                  likes={likes}
                  navigation={props.navigation}
                />
              ))}
            </ScrollArea>
          </Container>
        </>
    </AppPageBack>
  );
};

export default TopicDetails;
