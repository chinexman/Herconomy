import React, {useEffect,useState} from 'react';
import {Container, Avatar, SizedBox, ImageWrap, TouchWrap, scaleFont, InputWrap, ScrollArea} from '@burgeon8interactive/bi-react-library';
import moment from 'moment';
import numeral from 'numeral';
import {AppPageBack, H1, P, H2, LocalAvatar, CommentBoxTemplate, TouchFeedback} from '../../../../components/component';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useStoreState, useStoreActions, action} from 'easy-peasy';
import Colors from '../../../../helpers/colors';
import {FlatList, ActivityIndicator, Keyboard} from 'react-native';
/* import {Like, Unlike, PostComment, PostReply} from '../../../../helpers/sockets'; */
import {shareDetails, storeData} from '../../../../helpers/functions';
import {Like, Unlike, PostComment, PostReply} from '../../../../helpers/global_sockets';
import {FullImageModal} from '../../../../components/image_modal';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import { apiFunctions } from '../../../../helpers/api';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SentenceCase, ToastLong } from '../../../../helpers/utils';
import { FONTSIZE } from '../../../../helpers/constants';


const ComponentInput = props => {
  const [show,setShow] = useState(false)
  const [current_image,setCurrentImage] = useState(null);
  return(
    <>
      <Container direction="row" verticalAlignment="center" paddingBottom={2} borderColor="#dfdfdf" borderBottomWidth={4} marginBottom={2}>

        {props.userD.photo ? 
          <TouchFeedback onPress={()=>{
            setShow(true)
            setCurrentImage(user.photo)
          }}>
            <Avatar backgroundColor="#efefef" size={10} url={props.userD.photo} />
          </TouchFeedback> : (
          <TouchFeedback onPress={()=>{
            setShow(true)
            setCurrentImage(null)
          }}>
            <LocalAvatar size={9} />
          </TouchFeedback>
        )}
        <Container flex={1} marginLeft={2}>
          <InputWrap
            value={props.value}
            onChangeText={props.onChangeText}
            multiline={true}
            maxHeight={20}
            widthPercent="100%"
            paddingLeft={2}
            borderWidth={0.6}
            borderColor={Colors.greyBase900}
            placeholder={props.placeholder}
            backgroundColor="#fff"
            borderRadius={5}
          />
        </Container>
        {props.submitting ? (
          <ActivityIndicator size="large" />
        ) : (
          <TouchFeedback paddingLeft={2} onPress={props.onSubmitIt}>
            <Feather Icon name="send" size={scaleFont(20)} color={Colors.greyBase300} />
          </TouchFeedback>
        )}
        {
          show && <FullImageModal setShow={setShow} image={current_image} />
        }
      </Container>
    </>
  )
};

/* ANCHOR CommentBoxTemplate */
const CommentBox = ({item, type, likeDislike, updatingCommentLike, updatingReplyLike, userD, postId,feed_id,placeholder,setActions,actions,props,timeout,comment_index}) => {
  const {newReply, feedsUpdate,updateResult} = useStoreActions(actions => ({
    newReply: actions.community.newReply,
    feedsUpdate: actions.community.feedsUpdate,
    updateResult:actions.resultModel.updateResult
  }));
  const navigation = useNavigation();
  const [toggleReply, setToggleReply] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [newMessage, setNewMessage] = React.useState('');
  const [show,setShow] = useState(false)
  const [current_image,setCurrentImage] = useState(null);
  const toggleReplyClick = async () => {
    setToggleReply(!toggleReply);
  };
  const submitReply = async () => {
    try{
      let cleanMessage = newMessage.trim();
      if (cleanMessage === '') {
        return;
      }
      let {post_index} = props.route.params;
      let p_index = post_index !== undefined ? post_index : null;
      setSubmitting(true);
      Keyboard.dismiss();
      let fd = {
        body: cleanMessage,
        comment_id: item.id,
        token : global.token,
        post_index : p_index,
        comment_index
      };
      let data = {
        "feeds" : [
          {"id" : feed_id ,"posts": [{"id" : postId,"comments" : [{"id" : item.id}]}]}
        ]
      }
      let reply = {
        id: "8eccc688-68f5-4167-beeb-92248f7493a8",
        user: userD,
        body: fd.body,
        file: null,
        content_type: "feed",
        number_of_likes: 0,
        likes: [],
        created_at: moment(new Date()).format(),
        flag: "allowed",
        reported: false
      }
      let action = {
        type : "reply",
        path : "reply",
        id : fd.comment_id,
        data : reply
      }
      setActions([action,...actions]);
      await PostReply(fd);
      setSubmitting(false);
      setNewMessage('');
      toggleReplyClick();
      // timeout = setTimeout(()=>{
      //   let acts = actions.filter((act)=>act.id === action.id);
      //   setActions(acts)
      //   setNewMessage(cleanMessage);
      //   setToggleReply(true);
      //   ToastLong("Couldn't react to this post. Please try again")
      // },15000)
    }catch(error){
    }
  };
  
  const onClicked = el => {
    likeDislike(el, type,timeout,comment_index);
  };

  return (
    <>
      <Container direction="row" borderColor="#dfdfdf" borderBottomWidth={4} marginBottom={2}>
        <Container marginRight={2} horizontalAlignment="flex-start">
          {
            show && <FullImageModal setShow={setShow} image={current_image} />
          }
          {item.user.photo ? 
              <TouchFeedback onPress={()=>{
                if(placeholder){
                  return;
                }
                setShow(true)
                setCurrentImage(item.user.photo)
              }}>
                <Avatar backgroundColor="#efefef" size={10} url={item.user.photo} />
              </TouchFeedback> : (
                <TouchFeedback onPress={()=>{
                  if(placeholder){
                    return;
                  }
                  setShow(true)
                  setCurrentImage(null)
                }}>
                  <LocalAvatar size={10} />
                </TouchFeedback>
              )}
        </Container>

        <>
          <Container widthPercent="86%">
            <Container paddingLeft={1} borderRadius={10} padding={2} backgroundColor={Colors.offWhite} flex={1}>
              <Container direction="row">
                <TouchFeedback 
                  borderBottomColor={Colors.black}
                  borderBottomWidth={0.1}
                  onPress={()=>{
                    if(placeholder){
                      return
                    }
                    updateResult(item.user);
                    navigation.navigate('Profile',{
                        member_info:item.user
                    })
                }}>
                  
                  <Container direction="row">
                            <H1 fontSize={10}>
                              {item.user.first_name} {item.user.last_name}
                            </H1>
                              <SizedBox width={1} />
                              {
                                item.user.status ? (
                                  <Avatar backgroundColor={Colors.primary} 
                                    size={1.5}
                                  />
                                ) : (
                                  <Avatar backgroundColor={Colors.greyBase300} 
                                    size={1.5}
                                  />
                                )
                              }
                            </Container>
                </TouchFeedback>
                <SizedBox width={5} />
                {
                  placeholder ? (
                    <ActivityIndicator size={15} color={Colors.button}/>
                  ) : null
                }
              </Container>

              <SizedBox height={0.5} />

              <P fontSize={FONTSIZE.medium}>{item.body}</P>

              {item.file ? (
                <>
                  <SizedBox height={2} />
                  <ImageWrap height={25} borderRadius={10} backgroundColor="#efefef" url={item.file} fit="contain" />
                </>
              ) : null}
            </Container>

            <SizedBox height={1} />

            <Container direction="row">
              <P fontSize={9} color={placeholder ? Colors.fadedText : null}>
                  {item && item.created_at ? moment(item.created_at, 'YYYY-MM-DDTHH:mm:ss.SSS')
                .local()
                .fromNow() : null}
              </P>

              <SizedBox width={4} />

              {updatingCommentLike ? <ActivityIndicator size="small" /> : null}
              <TouchFeedback paddingBottom={2} paddingRight={2} onPress={() => {
                if(placeholder){
                  return;
                }
                onClicked(item,"comment",timeout)
              }}>
                <H2 fontSize={9} color={placeholder ? Colors.fadedText : null}>
                  { 
                    (item.likes.filter(el => el.id === userD.id).length > 0 &&
                    (actions.filter((act)=>act.type === "Unlike" && act.path === "comment" && act.id  === item.id).length === 0 )) || 
                    (actions.filter((act)=>act.type === "Like" && act.path === "comment" && act.id  === item.id).length > 0 ) ? 'Unlike' : 'Like'
                  }
                </H2>
              </TouchFeedback>

              <P fontSize={8} color={placeholder ? Colors.fadedText : Colors.greyBase900}>
                {numeral(item.likes ? item.likes.length : 0).format('0,0')}
              </P>

              <SizedBox width={4} />

              <TouchFeedback paddingBottom={2} paddingRight={2} onPress={()=>{
                if(placeholder){
                  return;
                }
                toggleReplyClick()
              }}>
                <H2 fontSize={9} color={placeholder ? Colors.fadedText : null}>Reply</H2>
              </TouchFeedback>
            </Container>
            <SizedBox height={1.5} />
            <Container>
              {toggleReply ? (
                <ComponentInput
                  userD={userD}
                  submitting={submitting}
                  value={newMessage}
                  onChangeText={text => setNewMessage(text)}
                  onSubmitIt={submitReply}
                  placeholder="Write a reply"

                />
              ) : null}
            </Container>
            {
              actions.filter(act=>act.type === "reply" && act.id === item.id).map(item=>item.data).map((el,i)=>(
                <CommentBoxTemplate item={el} key={i} type="reply" likeDislike={likeDislike} updatingReplyLike={updatingReplyLike} 
                  placeholder={true}
                  props={props}
                />
              ))
            }
            {item.replies && item.replies.result.map((el, i) => (
              <CommentBoxTemplate item={el} key={i} type="reply" likeDislike={likeDislike} updatingReplyLike={updatingReplyLike} />
            ))}
          </Container>
        </>
      </Container>
    </>
  );
};

const FeedDetails = props => {

  const {userD,token,seen_notifications,feeds_data,current_feed} = useStoreState(state => ({
    userD: state.userDetails.user,
    token : state.userDetails.token,
    seen_notifications : state.notification.seen_notifications,
    feeds_data : state.community.feeds_data,
    current_feed : state.community.current_feed
  }));
  const {updateSeen,updateResult} = useStoreActions(actions => ({
    updateSeen : actions.notification.updateSeen,
    updateResult:actions.resultModel.updateResult
  }));
  const {notification_id,notifPost,que_item,feed_id,main_feed_id} = props.route.params;
  let f_data = main_feed_id ? feeds_data.filter(data=>data.id === main_feed_id)[0] : [];
  const [submitting, setSubmitting] = React.useState(false);
  const [newMessage, setNewMessage] = React.useState('');
  const [post, setPost] = React.useState(f_data.post ? f_data.post : []);
  const [user, setUser] = React.useState(f_data.post ? f_data.post.user : null);
  const [comments, setComments] = React.useState(f_data.post && f_data.post.comments && 
    f_data.post.comments.result ? f_data.post.comments.result : []);
  const [show,setShow] = useState(false)
  const [current_image,setCurrentImage] = useState(null);
  const [feed,setFeed] = useState(main_feed_id || feed_id);
  const [actions,setActions] = useState([]);

  const likeDislike = (el, path,timeout,comment_index = null) => {
    try{
    let {post_index} = props.route.params;
    let p_index = post_index !== undefined ? post_index : null;
      let action = {
        type : el.likes.filter(ell => ell.id === userD.id).length > 0 ? 'Unlike' : 'Like',
        path : path === "comment" ? "comment" : "post",
        id : path === "comment" ? el.id : post.id
      }
      let acts = actions.filter(act=>{
        return act.path !== action.path && act.id !== action.id
      });
      acts = [...acts,action];
      setActions(acts);
      let data = {feeds: [
        {	
          id: feed,
          posts : [
            {
              id : null,
              comments : [{id : null}]
            }
          ]
        }
      ]}
      if(path === 'comment'){
        data = {
          "feeds" : [
            {"id" : feed,"posts": [{"id" : post.id,"comments" : [{"id" : el.id}]}]}
          ]
        }
      }
      el.likes.filter(ell => ell.id === userD.id).length > 0 ? Unlike(path, el.id,p_index,comment_index) 
        : Like(path, el.id,p_index,comment_index);
      // setTimeout(()=>{
        
      // },300);
      // timeout = setTimeout(()=>{
      //   let acts = actions.filter(act=>{
      //     return act.path !== action.path && act.id !== action.id
      //   });
      //   setActions(acts);
      //   ToastLong("Could not react to this post.Please try again");
      // },15000)
    }catch(error){
      console.log("err.>>",error)
    }
  };

  const submitComment = async () => {
    let cleanMessage = newMessage.trim();
    let {post_index} = props.route.params;
    let p_index = post_index !== undefined ? post_index : null;
    if (cleanMessage === '') {
      return;
    }
    setSubmitting(true);
    Keyboard.dismiss();
    let fd = {
      post_id: post.id,
      body: cleanMessage,
      token : global.token,
      post_index : p_index,
      comment_index : null
    };
    let comment = {
      id: "9e5449d5-6ea3-4ae2-b878-3d3086adeead",
      file: null,
      body: fd.body,
      user: userD,
      created_at: moment(new Date()).format(),
      number_of_likes: 0,
      number_of_replies: 0,
      is_liked: false,
      reply: null,
      new: true,
      likes: []
    }
    let action = {
      type : "comment",
      path : "comment",
      id : comment.id,
      data : comment
    }
    setActions([action,...actions]);
    let data = {
      "feeds" : [
        {"id" : feed ,"posts": [{"id" : post.id,"comments" : [{"id" : null}]}]}
      ]
    }
    await PostComment(fd);
    setSubmitting(false);
    setNewMessage('');
    
    // timeout = setTimeout(()=>{
    //   let acts = actions.filter((act)=>act.id === action.id);
    //   setActions(acts)
    //   setNewMessage(cleanMessage);
    //   ToastLong("Couldn't react to this post. Please try again")
    // },15000)
  };

  
  let timeout;
  const loadFeedsDetails = async () => {
    //Takes care of when user coming from notifications 
    //clicks on a post which is not defined in global.feeds
    console.log("loadFeedsDetails",timeout);
    clearTimeout(timeout);
    if((global.the_post === null && notification_id) || (global.the_post === null && que_item)){
      global.the_post = notifPost || que_item.feed_obj.post;
    }
    if(notification_id || que_item){
      console.log("global.the_post",the_post)
      setActions([]);
      const thePost = global.the_post;
      let theUser = thePost.user;
      let theComments = thePost.comments;
      setFeed(feed_id || que_item.feed_id);
      setPost({...thePost});
      setUser(theUser);
      return setComments([...theComments.result]);
    }
    let f_data = main_feed_id ? feeds_data.filter(data=>data.id === main_feed_id)[0] : [];
    setActions([]);
    setPost(f_data.post ? f_data.post : []);
    setUser(f_data.post ? f_data.post.user : null);
    let comments = f_data && f_data.post && f_data.post.comments && f_data.post.comments.result ? 
    f_data.post.comments.result : f_data.post.comment ? f_data.post.comment : [];
    setComments(comments);
    global.the_post = null;
  };

  useFocusEffect(
    React.useCallback(() => {
      if(notification_id){
        apiFunctions.markAsSeen(token,notification_id);
      }
      if(notification_id && seen_notifications && !seen_notifications.includes(notification_id)){
        global.tot_notifications = global.tot_notifications - 1;
        updateSeen([...seen_notifications,notification_id])
      }
      return () => {
        global.the_post = null
      };
    }, [feeds_data]),
  );
  useEffect(() => {
    storeData("loadFirstFeeds",false);
    setActions([]);
    loadFeedsDetails();
  }, [current_feed,feeds_data]);
  return (
    <AppPageBack {...props} title="Comments">
      <SizedBox height={4} />
      {post && user ? (
        <ScrollArea>
          <Container direction="row" paddingTop={4}>
            <Container horizontalAlignment="flex-start">
            {user.photo ? 
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
            {
              show && <FullImageModal setShow={setShow} image={current_image} />
            }
            <Container paddingLeft={3}>
              <TouchFeedback onPress={()=>{
                    updateResult(user);
                    props.navigation.navigate('Profile',{
                        member_info: user
                    })
              }}>
                 <Container direction="row">
                  <H1 fontSize={10}>
                    {user && user.first_name} {user && user.last_name}
                  </H1>
                  <SizedBox width={1} />
                  {user.status ? (
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
              <P fontSize={6}>
              {post && post.created_at ? moment(post.created_at, 'YYYY-MM-DDTHH:mm:ss.SSS')
                .local()
                .fromNow() : null}
              </P>
            </Container>
          </Container>

          <SizedBox height={2} />

          <P fontSize={FONTSIZE.medium}>{post.body ? SentenceCase(post.body) : null}</P>

          {post.file ? (
            <>
              <SizedBox height={2} />
              <TouchFeedback onPress={()=>{
                setShow(true)
                setCurrentImage(post.file)
              }}>
                <ImageWrap height={20} borderRadius={10} backgroundColor="#efefef" url={post.file} fit="contain" />
              </TouchFeedback>
            </>
          ) : null}

          <SizedBox height={2} />

          <Container
            direction="row"
            verticalAlignment="center"
            horizontalAlignment="space-between"
            borderBottomWidth={0.6}
            borderColor={Colors.greyBase900}
            paddingBottom={2}
            marginBottom={2}>
              <TouchFeedback 
                onPress={()=>{
                  if(!post.likes.length){
                    return;
                  }
                  props.navigation.navigate("PostLikes",post.likes);
                }}
              >
                <Container direction="row" verticalAlignment="center">
                  {post.likes.slice(0, 4).map((el, i) => {
                    if (el.photo) {
                      return <Avatar url={el.photo} size={6} key={i} backgroundColor="#dfdfdf" />;
                    } else {
                      return <LocalAvatar size={7} marginLeft={-3} key={i} />;
                    }
                  })}

                  <SizedBox width={1} />
                  <P fontSize={8} color={Colors.greyBase900}>
                    Liked by {numeral(post.likes.length).format('0a')}
                  </P>
                </Container>
              </TouchFeedback>

            <Container direction="row">
              <TouchFeedback
                onPress={() => {
                  if(
                    actions.filter((act)=>act.type === "Unlike" && act.path === "post").length > 0 ||
                    actions.filter((act)=>act.type === "Like" && act.path === "post").length > 0
                  ){
                    return false;
                  }
                  likeDislike(post, 'post',timeout);
                }}>
                {(post.likes.filter(el => el.id === userD.id).length > 0 &&
                  (actions.filter((act)=>act.type === "Unlike" && act.path === "post").length === 0 )
                ) || 
                  (actions.filter((act)=>act.type === "Like" && act.path === "post").length > 0 ) ? (
                    <Container marginTop={1}>  
                      {
                        actions.filter((act)=>act.type === "Unlike" && act.path === "post").length > 0 ? (
                          <Container position="absolute">
                            <ActivityIndicator size={10} color={Colors.primary}/>
                          </Container>
                        ) : null
                      }
                      <Ionicons Icon name="ios-heart" color="red" size={scaleFont(FONTSIZE.social)} />
                    </Container>
                ) : (
                  <Container marginTop={1}>
                      {
                        actions.filter((act)=>act.type === "Unlike" && act.path === "post").length > 0 ? (
                          <Container position="absolute">
                            <ActivityIndicator size={13} color={Colors.primary}/>
                        </Container>
                        ) : null
                      }
                      <Feather Icon name="heart" color={Colors.greyBase900} size={scaleFont(FONTSIZE.social)} />
                  </Container>
                )}
              </TouchFeedback>

              <SizedBox width={3} />

              <TouchFeedback onPress={() => shareDetails({message: post.body})}>
                <Container padding={1.5}>
                  <Feather Icon name="share-2" color={Colors.greyBase900} size={scaleFont(FONTSIZE.social)} />
                </Container>
              </TouchFeedback>
            </Container>
          </Container>

          <ComponentInput
            userD={userD}
            submitting={submitting}
            value={newMessage}
            onChangeText={text => setNewMessage(text)}
            onSubmitIt={() => submitComment()}
            placeholder="Write a comment"
          />
          {/* ANCHOR - COMMENTS BOX */}
          {
            actions.filter(act=>act.type === "comment").map(item=>item.data).map((item,index)=>(
              <CommentBox item={item} props={props} feed_id={feed} postId={post.id} type="comment" likeDislike={likeDislike} userD={userD} key={index} 
                placeholder={true}
                comment_index={index}
                actions={actions}
                setActions={setActions}
                timeout={timeout}
              />
            ))
          }
          {comments && comments.map((item, i) => (
            <CommentBox 
              item={item} 
              props={props} 
              feed_id={feed} 
              postId={post.id} type="comment" 
              likeDislike={likeDislike} userD={userD} key={i} 
              actions={actions}
              comment_index={i}
              setActions={setActions}
              timeout={timeout}
            />
          ))}
        </ScrollArea>
      ) : null}
    </AppPageBack>
  );
};

export default FeedDetails;
