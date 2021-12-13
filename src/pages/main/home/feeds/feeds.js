import React, {useEffect,useState} from 'react';

import {Container, TouchWrap, SizedBox, scaleFont, Avatar, ImageWrap} from '@burgeon8interactive/bi-react-library';
import {H1, H2, P, LocalAvatar, CommentBoxTemplate,PostsPlaceholder, TouchFeedback} from '../../../../components/component';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import numeral from 'numeral';
import Colors from '../../../../helpers/colors';
import {Capitalize, SentenceCase, ToastLong, ToastShort} from '../../../../helpers/utils';
import {apiFunctions} from '../../../../helpers/api';
import {shareDetails, getData, storeData} from '../../../../helpers/functions';
import {Verify} from '../../../../components/verify';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Like, Unlike, subscribe, loadFeedData,setGlobalPost} from '../../../../helpers/global_sockets';
import Entypo from 'react-native-vector-icons/Entypo';
import {FlatList} from 'react-native';
import {useStoreActions,useStoreState} from 'easy-peasy';
import { FullImageModal } from '../../../../components/image_modal';
import {Question} from '../../../../components/question';
import { Alert,ActivityIndicator } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import UsersList from '../../../../components/users_lists';
import { FONTSIZE, Version_Number } from '../../../../helpers/constants';


export const FeedBox = ({item, props,index,data_length,more,setMore,ReloadFeeds,getMoreFeeds}) => {
  const navigation = useNavigation()
  const {userD} = useStoreState(state => ({
    userD: state.userDetails.user,
  }));
  const [show,setShow] = useState(false)
  const [current_image,setCurrentImage] = useState(null);
  const [likes,setLikes] = useState([]);

  const {updateResult} = useStoreActions(action=>(
    {
      updateResult : action.resultModel.updateResult,
    }
  ))
  let is_icebreaker = item.is_icebreaker;
  let post = item ? item.post : null;
  let user = post ? post.user : null;
  const likeDislike = async (el, path) => {
    let isLiked = el.likes.filter(ell => ell.id === userD.id).length > 0;
    let data = {
      "feeds" : [{id: item.id}]
    }
    if(isLiked || likes.includes(el.id) === true){
      setLikes([])
      Unlike(path, el.id,index)
    }else{
      // timeout = setTimeout(()=>{
      //   let old_likes = [likes].filter(lk=>post.id == lk)
      //   setLikes([...old_likes])
      //   ToastLong("Network Error! Please try again")
      // },15000)
      post && post.id ? setLikes([...likes,post.id]) : null;
      Like(path, el.id,index);
    }

  };
  if(!post || !user) return(<></>)
  return (
    <>
          {
          index === 3  && userD && (userD.bio === null || moment(userD.date_modified).add(3,'months').weeks() < moment(userD.date_modified).weeks())  ? (
            
            <Container borderColor={Colors.line} borderBottomWidth={8} paddingHorizontal={6} paddingVertical={2}>
                <TouchFeedback
                    onPress={()=>navigation.navigate("ProfileEdit")}>
                    <Container direction="row" horizontalAlignment="space-between"
                      verticalAlignment="center"
                      paddingVertical={5}
                    >
                      <Container widthPercent="15%">
                        <Avatar 
                          backgroundColor={Colors.primary}
                        />
                      </Container>
                      <Container widthPercent="80%">
                        <H1 textAlign="center">
                          {userD.bio === null ? 'Tell us about yourself. Add a mini Bio.' : 'Keep your profile updated. Click to let us know what’s new'}
                        </H1>
                      </Container>
                    </Container>
              </TouchFeedback>
            </Container>
          ) : null
        }
         {
           index === 1 ? (
            <UsersList {... props} />
           ) : null
         }
        <Container borderColor={Colors.line} borderBottomWidth={8} paddingHorizontal={6} paddingVertical={2}>
          {
          item.is_question ? (
            <Question item={item} from_feed={true} 
              index={index}
              props={props} comments={
                item.is_question.posted_admin && item.is_question.posted_admin[0] && item.is_question.posted_admin[0].comments.result ? 
                item.is_question.posted_admin[0].comments.result : []
              } 
            />
          ) : (
            <Container borderColor={post.content_type === "sponsor" ? Colors.primary : ""} 
              borderWidth={post.content_type === "sponsor" ? 2 : 0} 
              paddingHorizontal={post.content_type === "sponsor" ? 6 : 0} paddingVertical={post.content_type === "sponsor" ? 2 : 0}
            >
              <Container
                position="absolute"
                style={{right:10,top:8}}
              >
                  <TouchFeedback onPress={() => {
                    if(post.holder){
                      return
                    }
                    //navigation.navigate('FeedActions', item.id)
                    navigation.navigate('FeedActions', {item,item_index : index})
                  }}>
                    <Container verticalAlignment="center" padding={1.5}>
                      <Entypo Icon name="dots-three-horizontal" color={Colors.greyBase900} size={scaleFont(20)} />
                    </Container>
                  </TouchFeedback>
              </Container>
              <SizedBox height={1} />
              {
                post.content_type !== "sponsor" ? (
                  <Container direction="row">
                    <Container width={15} horizontalAlignment="flex-start" marginTop={1}>
                      {user && user.photo ? 
                          (
                            <TouchFeedback onPress={()=>{
                              if(post.holder){
                                return
                              }
                              setShow(true)
                              setCurrentImage(user.photo)
                            }}>
                              <Avatar backgroundColor="#efefef" size={10} url={user.photo} />
                            </TouchFeedback>
                          ) : 
                          (
                            <TouchFeedback onPress={()=>{
                              if(post.holder){
                                return
                              }
                              setShow(true)
                              setCurrentImage(null)
                            }}>
                              <LocalAvatar size={10} />
                            </TouchFeedback>
                          )
                        }
                      </Container>
                    <Container paddingLeft={2.5}>
                      {item.topic || item.is_icebreaker ? (
                        <Container direction="row" verticalAlignment="center" wrap="wrap">
                          <H1 fontSize={10}>
                            {user && user.first_name ? Capitalize(user.first_name) : ""} {user && user.last_name ? Capitalize(user.last_name) : null}
                          </H1>
                          <SizedBox width={1} />
                          <Ionicons Icon name="ios-play" />
                          <SizedBox width={1} />
                          <Container paddingRight={10}>
                            <H1 fontSize={10}> { item.is_icebreaker ? item.is_icebreaker.body : item.topic.title} </H1>
                          </Container>
                        </Container>
                      ) : (
                          <TouchFeedback borderBottomWidth={0.3} borderBottomColor={Colors.line}
                            onPress={()=>{
                              if(post.holder){
                                return
                              }
                              updateResult(user);
                              navigation.navigate('Profile',{
                                  member_info:user
                              })
                            }}
                          >
                            <Container direction="row">
                              <H1 fontSize={8} color={post.holder ? Colors.fadedText : null}>
                                {user && user.first_name ? Capitalize(user.first_name) : null} {user && user.last_name ? Capitalize(user.last_name) : null}
                              </H1>
                              <SizedBox width={1} />
                              {
                                userD.id === user.id || user.status ? (
                                  <Avatar backgroundColor={Colors.primary} 
                                    size={1.5}
                                  />
                                ) : (
                                  <Avatar backgroundColor={Colors.lightGrey} 
                                    size={1.5}
                                  />
                                )
                              }
                            </Container>
                          </TouchFeedback>
                      )}
                      <SizedBox height={1}/>
                      <P fontSize={FONTSIZE.small} color={post.holder ? Colors.fadedText : null}>
                          {post && post.created_at ? moment(post.created_at, 'YYYY-MM-DDTHH:mm:ss.SSS')
                            .local()
                            .fromNow() : null}
                      </P>
                    </Container>
                  </Container>
                ) : (
                  <Container paddingLeft={3} marginBottom={2}>
                    <H1>Sponsored!</H1>
                  </Container>
                )
              }
              {
                    show && (
                      <FullImageModal setShow={setShow} image={current_image} />
                    )
                  }
              <Container direction="row" verticalAlignment="flex-start">
                {/**ANCHOR SIDE ICONS */}
              {
                post.content_type !== "sponsor" && ( <Container width={15} horizontalAlignment="center" />)
              }
                <Container paddingLeft={3} paddingRight={2} flex={1}
                >
                  {
                    <Container borderColor="#efefef" borderBottomWidth={0} paddingBottom={1}
                    >
                      {post.body ? <P fontSize={FONTSIZE.medium} color={post.holder ? Colors.fadedText : null}>{post.body ? SentenceCase(post.body) : null} </P> : null}
                      {
                        post.holder ? (
                          <Container horizontalAlignment="flex-end">
                              <ActivityIndicator size={15} color={Colors.button}/>
                          </Container>
                        ) : null
                      }
                      {post.file ? (
                        <TouchFeedback
                          onPress={()=>{
                            if(post.holder){
                              return
                            }
                            setShow(true)
                            setCurrentImage(post.file)
                          }}
                        >
                          <Container marginTop={1}>
                            <ImageWrap height={18} borderRadius={10} backgroundColor="#efefef" url={post.file} fit="cover" />
                          </Container>
                        </TouchFeedback>
                        
                      ) : null}
                    </Container>
                  }
      
                  {/**ANCHOR BOTTOM ICONS */}
                  <Container
                    borderColor="#efefef"
                    borderBottomWidth={0}
                    paddingBottom={0}
                    direction="row"
                    horizontalAlignment="space-between"
                    verticalAlignment="center">
                    <TouchFeedback onPress={() => {
                      if(post.holder){
                        return
                      }
                      navigation.navigate('FeedDetails', {main_feed_id : item.id,post_index : index})
                    }}>
                      <Container direction="row" verticalAlignment="center">
                        <Feather Icon name="message-circle" color={Colors.greyBase900} size={scaleFont(15)} />
                        <SizedBox width={1} />
                        <P color={Colors.greyBase900} fontSize={8}>
                                {numeral(post.comments && post.comments.result 
                              && post.comments.result.length ? post.comments.result.length : post.comment ? post.comment.length : 0
                            ).format('0,0')}
                        </P>
                      </Container>
                    </TouchFeedback>
                    <Container direction="row" verticalAlignment="center">
                      <TouchFeedback paddingRight={2} onPress={() => {
                        if(post.holder){
                          return
                        }
                        likeDislike(post, 'post')
                      }} padding={1.5}>
                        <Container direction="row" verticalAlignment="center">
                          {userD && post.likes.filter(el => el.id === userD.id).length > 0  || likes.includes(post.id) !== false ? (
                            <Ionicons Icon name="ios-heart" color="red" size={scaleFont(15)} />
                          ) : (
                            <Feather Icon name="heart" color={Colors.greyBase900} size={scaleFont(15)} />
                          )}
                        </Container>
                      </TouchFeedback>
                      <TouchFeedback onPress={()=>{
                          if(!post.likes.length){
                            return;
                          }
                          navigation.navigate("PostLikes",post.likes);
                        }}>
                          {/* numeral(props.likes && props.likes.includes(post.id) === true ? post.likes.length + 1 : post.likes.length).format('0 a') */}
                            <P fontSize={8} color={Colors.greyBase900}>
                              Liked by {numeral(post && post.likes ? post.likes.length : 0).format('0 a')}
                            </P>
                        </TouchFeedback>
                    </Container>
                    <TouchFeedback onPress={() => {
                      if(post.holder){
                        return
                      }
                      shareDetails({message: post.body,user : `${user ? user.first_name : ""} ${user ? user.last_name : ""}`,time : `[ ${moment(post.created_at).format('MMM DD YYYY')} at ${moment(post.created).format('h:mm:ss a')} ]`})
                    }}>
                      <Container direction="row" verticalAlignment="center" padding={1.5}>
                        <Feather Icon name="share-2" color={Colors.greyBase900} size={scaleFont(15)} />
                      </Container>
                    </TouchFeedback>
                  </Container>
                  {post.comments && post.comments.result && post.comments.result.length > 0 && post.comments.result.slice(0, 1).map((el, i) => (
                    <Container marginTop={1} key={i}>
                      <CommentBoxTemplate item={el} key={i} post={item} likeDislike={likeDislike} type="comment" props={props}/>
                    </Container>
                  ))}
                  {post.comment && post.comment.length > 0 && post.comment.slice(0, 1).map((el, i) => (
                    <Container marginTop={1} key={i}>
                      <CommentBoxTemplate item={el} key={i} post={item} likeDislike={likeDislike} type="comment" props={props}/>
                    </Container>
                  ))}
                </Container>
              </Container>
            </Container>
          )
        }
      </Container>
      {
        index === (data_length - 1) ? (
          <TouchFeedback onPress={async ()=>{
                if(more) return
                let feeds_page_num = await getData('feeds_page_num');
                // (feeds_page_num - 1) * 10
                // let data = {
                //   "feeds" : [{id: feeds_data.length > 0 ? feeds_data[(feeds_page_num - 1) * 10].id : 'e5e46d00-c5bb-438c-ac76-1ad0ad1fe840'}]
                // }
                setMore(true);
                //setData(data);
                getMoreFeeds(feeds_page_num + 1);
              }
          }>
            <Container 
              horizontalAlignment="center" 
              // borderColor={Colors.line} borderBottomWidth={8} 
              paddingHorizontal={6} paddingVertical={2}
            >
              {
                  !more ? (
                    <P>See More</P>
                  ) : <ActivityIndicator size={scaleFont(10)} color={Colors.primary}/>
              }
            </Container>
          </TouchFeedback>
        ) : null
      }
    </>
  );
};

const Feeds = props => {
  const navigation = useNavigation();
  const {token, user,feeds_holders,feeds_data,
    answered_breakers
  } = useStoreState(state => ({
    token: state.userDetails.token,
    user: state.userDetails.user,
    feeds_holders : state.community.feeds_holders,
    feeds_data : state.community.feeds_data,
    answered_breakers: state.community.answered_breakers,
  }));
  const {updateUser,updateFeedHolders,updateFeedData} = useStoreActions(action=>(
    {
      updateUser : action.userDetails.updateUser,
      updateFeedHolders : action.community.updateFeedHolders,
      updateFeedData : action.community.updateFeedData
    }
  ))
  const [loading, setLoading] = React.useState(true);
  const [feeds, setFeeds] = React.useState([]);
  const [counter, setCounter] = React.useState(0);
  const [show,setShow] = useState(false)
  const [current_image,setCurrentImage] = useState(null);
  const [more,setMore] = useState(false);
  const [cancelling,setCancel] = useState(false);
  const [data,setData] = useState({
    "feeds" : [{id: null}]
  });

  const loadFeeds = () => {
    if (feeds_data.length < 1) {
      return setLoading(true);
    }
  };
  let timeout;
  const feedsListener = () => {
    global.socket.off('get_all_feeds').on('get_all_feeds', async ({res}) => {
      if(res.message) return
      let glo_feeds = await getData("feeds");
      glo_feeds = glo_feeds ? glo_feeds : [];
      storeData('feeds_page_num',Number(res.page));
      global.feeds = res.page == 1 ? [...res.result] : 
      [...glo_feeds,...res.result].slice(0,Number(res.page) * 10);
      updateFeedHolders([])
      updateFeedData(global.feeds);
      storeData('feeds', global.feeds);
      setMore(false);
    });
  }

  const ReloadFeeds = async (page_num = 1) => {
    
    global.socket.emit('get_all_feeds', {page : page_num,token : global.token}, async (res) => {});
  };

  const [is_sending,setSending] = useState(false);
  const resendVerification = async () => {
    setSending(true)
    let res = await apiFunctions.onboarding1(token,user.id,{'onboarded':1});
    if(res.is_email_verified){
      storeData('user',res);
      return updateUser(res);
    }
    let fd = {email: user.email};
    apiFunctions
      .resendVerification(fd)
      .then(res => {
        setSending(false)
        Alert.alert('Herconomy','Verification Email Sent');
      })
      .catch(err => {setSending(false)});
  };

  const getMoreFeeds = async (page_num) => {
    try{
      let res =  await apiFunctions.getFeeds(token,Number(page_num));
      let glo_feeds = await getData("feeds");
      glo_feeds = glo_feeds ? glo_feeds : [];
      storeData('feeds_page_num',Number(res.page));
      global.feeds = res.page == 1 ? [...res.result] : 
      [...glo_feeds,...res.result].slice(0,Number(res.page) * 10);
      updateFeedHolders([])
      updateFeedData(global.feeds);
      storeData('feeds', global.feeds);
      setMore(false);
    }catch(err){
      setMore(false)
    }
  }

  useEffect(() => {
    feedsListener()
    ReloadFeeds();
  }, []);
  
  return (
    <>
      <Container backgroundColor={Colors.white} flex={1}>
        {/* ANCHOR  GO TO POST */}
        {user && user.is_email_verified === false && <Verify onPress={() => resendVerification()} is_sending={is_sending}/>}
        {
          show && (
            <FullImageModal setShow={setShow} image={current_image} />
          )
        }
        
        {props.iceBreakerQuestion.filter(item=>(
          !answered_breakers.includes(item.id)
        )).map((el, i) => (
                <Container
                  direction="row"
                  verticalAlignment="flex-start"
                  paddingTop={1.5}
                  borderColor={Colors.line}
                  borderBottomWidth={8}
                  paddingBottom={2}
                  key={i}
                  paddingHorizontal={6}>
                  <Container width={15} horizontalAlignment="flex-start">
                    {user && user.photo ? 
                      <TouchFeedback onPress={()=>{
                        setShow(true)
                        setCurrentImage(user.photo)
                      }}>
                        <Avatar backgroundColor="#efefef" size={10} url={user.photo} />
                      </TouchFeedback> : (
                        <TouchFeedback onPress={()=>{
                          setShow(true)
                          setCurrentImage(null)
                        }}>
                          <LocalAvatar size={10} />
                        </TouchFeedback>
                      )}
                  </Container>
                  <Container flex={1}>
                    <P>
                      <H1 textAlign="left"> Icebreaker Question: </H1> {el.body}
                    </P>
                    <SizedBox height={1} />
                    <Container horizontalAlignment="flex-end" direction="row">
                      <Container marginRight={2} verticalAlignment="center">
                        <TouchFeedback onPress={()=>{
                            setCancel(true);
                            apiFunctions
                            .newFeedPost(token, {"ignored" : 'ignored'},`/icebreakers/${el.id}/post/`).then(res=>{
                              props.setIceBreakerQuestion([])
                              setCancel(false);
                            }).catch(error=>{
                              setCancel(false);
                              ToastShort("Network Error! Check internet and retry");
                            })
                        }}>
                          {
                            cancelling ? (
                              <ActivityIndicator size={scaleFont(10)} color={Colors.button} />
                            ) : (
                              <P>Cancel</P>
                            )
                          }
                        </TouchFeedback>
                      </Container>
                      <TouchFeedback width={25} onPress={() => navigation.navigate('FeedPost', el)}>
                        <Container borderRadius={5} backgroundColor={Colors.primary} horizontalAlignment="center" paddingVertical={1.5}>
                          <H1 fontSize={FONTSIZE.medium} color="#fff">
                            Respond
                          </H1>
                        </Container>
                      </TouchFeedback>
                    </Container>
                  </Container>
                </Container>
              ))}
        {
          props.iceBreakerQuestion.filter(item=>(
            !answered_breakers.includes(item.id)
          )).length === 0 && user && user.is_email_verified !== false && props.que &&
          props.que[0] && props.que[0].commented_on && props.que[0].commented_on.length === 0 &&
            props.que.filter(q=>!props.dismisedQue.includes(q.id)).slice(0,1).map((item,index)=>(
            <Container paddingHorizontal={5} marginTop={3} key={index}>
              <TouchFeedback
                onPress={async ()=>{
                  props.setDismissedQue(item.id);
                  await setData('dismissed',item.id);
                }}
              >
                <Container 
                  horizontalAlignment="flex-end"
                >
                  <Feather name="x" size={14}/>
                </Container>
              </TouchFeedback>
              <Question item={item} from_feed={false} props={props} 
                comments={
                  item.is_question && item.post && item.post.comments && item.post.comments.result && Array.isArray(item.post.comments.result)
                  ? item.post.comments.result : []
                }
                index={index}
              />
            </Container>
          ))
        }
        {
          feeds_data.length === 0 && feeds_holders.length === 0 ? (
            <PostsPlaceholder />
          ) : null
        }
        <FlatList
          showsVerticalScrollIndicator={false}
          data={[...feeds_holders,...feeds_data]}
          extraData={counter}
          renderItem={({item, index}) => <FeedBox item={item} props={props} index={index} token={token} key={index} 
            data_length={[...feeds_holders,...feeds_data].length} more={more} setMore={setMore}
            ReloadFeeds={ReloadFeeds}
            timeout={timeout}
            getMoreFeeds={getMoreFeeds}
          />}
          keyExtractor={item => item.id && item.id.toString()}
          refreshing={loading && (!feeds_data.length && !feeds_holders.length) ? true : false}
          onRefresh={ async ()=>{
            if(user && !user.is_email_verified){
              let res = await apiFunctions.onboarding1(token,user.id,{'onboarded':1});
              storeData('user',res);
              updateUser(res);
            }
            ReloadFeeds()
          }}
          //onEndReached={}
          //onEndReachedThreshold={200}
          removeClippedSubviews={true}
          maxToRenderPerBatch={20}
          updateCellsBatchingPeriod={20}
          initialNumToRender={4}
          shouldComponentUpdate={()=>{
            return false
          }}
        />
        {/* {
          more && (
            <ActivityIndicator size="small" color={Colors.primary} />
          )
        } */}
      </Container>
    </>
  );
};
export default Feeds;
