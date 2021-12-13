import React, {useEffect} from 'react';
import {Container, Avatar, SizedBox, ImageWrap, TouchWrap, scaleFont, InputWrap, ScrollArea} from '@burgeon8interactive/bi-react-library';
import moment from 'moment';
import numeral from 'numeral';
import {AppPageBack, H1, P, H2, LocalAvatar, CommentBoxTemplate,TouchFeedback} from '../../../../components/component';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useStoreState, useStoreActions} from 'easy-peasy';
import Colors from '../../../../helpers/colors';
import {FlatList, ActivityIndicator, Keyboard} from 'react-native';
/* import {Like, Unlike, PostComment, PostReply} from '../../../../helpers/sockets'; */
import {getData, shareDetails, storeData} from '../../../../helpers/functions';
import {Like, Unlike, PostComment, PostReply,subscribe} from '../../../../helpers/global_sockets';
import {useFocusEffect} from '@react-navigation/native';
import { apiFunctions } from '../../../../helpers/api';
import { SentenceCase } from '../../../../helpers/utils';
import { FONTSIZE } from '../../../../helpers/constants';



const ComponentInput = props => (
  <>
    <Container direction="row" verticalAlignment="center" paddingBottom={2} borderColor="#dfdfdf" borderBottomWidth={4} marginBottom={2}>
      {props.userD.photo ? <Avatar backgroundColor="#efefef" size={10} url={props.userD.photo} /> : <LocalAvatar size={9} />}
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
          <Feather Icon name="send" size={scaleFont(FONTSIZE.icon)} color={Colors.greyBase300} />
        </TouchFeedback>
      )}
    </Container>
  </>
);

/* ANCHOR CommentBoxTemplate */
const CommentBox = ({param,item, type, likeDislike, updatingCommentLike, updatingReplyLike, userD, postId,
  placeholder,setActions,actions,props,comment_index}) => {
  const {updateResult} = useStoreActions(actions => ({
    newReply: actions.community.newReply,
    feedsUpdate: actions.community.feedsUpdate,
    updateResult: actions.resultModel.updateResult
  }));

  const [toggleReply, setToggleReply] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [newMessage, setNewMessage] = React.useState('');

  const toggleReplyClick = async () => {
    setToggleReply(!toggleReply);
  };

  const submitReply = async () => {
    try{
      let {post_index} = props.route.params;
      post_index = global.the_post ? -3 : post_index;
      let p_index = post_index !== undefined ? post_index : null;
      let cleanMessage = newMessage.trim();

      if (cleanMessage === '') {
        return;
      }
  
      setSubmitting(true);
      Keyboard.dismiss();
      let fd = {
        body: cleanMessage,
        comment_id: item.id,
        token : global.token,
        post_index : p_index,
        comment_index
      };
      let reply = {
        id: "8eccc688-68f5-4167-beeb-92248f7493a8",
        user: userD,
        body: fd.body,
        file: null,
        content_type: "feed",
        number_of_likes: 0,
        likes: [],
        created_at: moment.utc(new Date()).local().format(),
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
      let data = {
        "topics" : [
          {"id" : param.mainId ,"posts": [{"id" : param.itemId,"comments" : [{"id" : item.id}]}]}
        ]
      }
      await PostReply(fd);
      setSubmitting(false);
      setNewMessage('');
      toggleReplyClick();
    }catch(error){
      console.log("err",error)
    }
  };

  const onClicked = (el,type) => {
    likeDislike(el, type,comment_index);
  };

  return (
    <>
      <Container direction="row" borderColor="#dfdfdf" borderBottomWidth={4} marginBottom={2}>
        <Container marginRight={2} horizontalAlignment="flex-start">
          {item.user.photo ? <Avatar backgroundColor="#efefef" size={10} url={item.user.photo} /> : <LocalAvatar size={10} />}
        </Container>

        <>
          <Container widthPercent="86%">
            <Container paddingLeft={1} borderRadius={10} 
            padding={2} backgroundColor={Colors.offWhite} flex={1}>
              <Container direction="row">
                <TouchFeedback 
                  borderBottomColor={Colors.black}
                  borderBottomWidth={0.1}
                  onPress={ async ()=>{
                    if(placeholder){
                      return
                    }
                    await updateResult(item.user);
                    props.navigation.navigate('Profile', {
                      member_info: item.user,
                    });
                  }}
                >
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
                                  <Avatar backgroundColor={Colors.lightGrey} 
                                    size={1.5}
                                  />
                                )
                              }
                            </Container>
                </TouchFeedback>
              </Container>

              <SizedBox height={0.5} />
              <P fontSize={FONTSIZE.medium}>{item.body ? SentenceCase(item.body) : null}</P>
              {
                placeholder ? (
                  <Container horizontalAlignment="flex-end">
                      <ActivityIndicator size={15} color={Colors.button}/>
                  </Container>
                ) : null
              }
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
                  return
                }
                onClicked(item,"comment")
              }}>
                <H2 fontSize={9}
                  color={placeholder ? Colors.fadedText : null}
                >
                  { 
                    (item.likes.filter(el => el.id === userD.id).length > 0 &&
                    (actions.filter((act)=>act.type === "Unlike" && act.path === "comment" && act.id  === item.id).length === 0 )) || 
                    (actions.filter((act)=>act.type === "Like" && act.path === "comment" && act.id  === item.id).length > 0 ) ? 'Unlike' : 'Like'
                  }
                </H2>
              </TouchFeedback>

              <P fontSize={8} color={Colors.greyBase900} color={placeholder ? Colors.fadedText : null}>
                {numeral(item.likes.length).format('0a')}
              </P>

              <SizedBox width={4} />

              <TouchFeedback paddingBottom={2} paddingRight={2} onPress={()=>{
                if(placeholder){
                  return
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

const TopicDetailsPost = props => {
  const {userD,token,seen_notifications,topic_data,current_topic_posts} = useStoreState(state => ({
    userD: state.userDetails.user,
    token: state.userDetails.token,
    seen_notifications : state.notification.seen_notifications,
    topic_data : state.community.topic_data,
    current_topic_posts : state.community.current_topic_posts
  }));
  const {updateSeen,updateResult} = useStoreActions(actions => ({
    updateSeen : actions.notification.updateSeen,
    updateResult: actions.resultModel.updateResult
  }));
  const [submitting, setSubmitting] = React.useState(false);
  const [newMessage, setNewMessage] = React.useState('');
  const [post, setPost] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [comments, setComments] = React.useState([]);
  const [actions,setActions] = React.useState([]);
  const index = props.route.params;

  const likeDislike = (el, path,comment_index = null) => {
    let {post_index} = props.route.params
    post_index = global.the_post ? -3 : post_index;
    let action = {
      type : el.likes.filter(ell => ell.id === userD.id).length > 0 ? 'Unlike' : 'Like',
      path : path === "comment" ? "comment" : "post",
      id : el.id
    }
    let acts = actions.filter(act=>{
      return act.path !== action.path && act.id !== action.id
    });
    acts = [...acts,action];
    setActions(acts);
    let data = {
      topics: [
        {
          'id': index.mainId,
          'posts' : [{'id' : index.itemId}]
        }
      ]
    }
    if(path === 'comment'){
      data = {
        "topics" : [
          {"id" : index.mainId,"posts": [{"id" : index.itemId,"comments" : [{"id" : el.id}]}]}
        ]
      }
    }
    el.likes.filter(ell => ell.id === userD.id).length > 0 ? Unlike(path, el.id,post_index,comment_index) 
    : Like(path, el.id,post_index,comment_index);
  };

  const submitComment = async () => {
    let cleanMessage = newMessage.trim();
    let {post_index} = props.route.params;
    post_index = global.the_post ? -3 : post_index;
    let p_index = post_index !== undefined ? post_index : null
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
      "topics" : [
        {"id" : index.mainId ,"posts": [{"id" : post.id,"comments" : [{"id" : null}]}]}
      ]
    }
    await PostComment(fd);
    setSubmitting(false);
    setNewMessage('');
  };

  const loadPostDetails = async () => {
   try{
    const thePost = index.post_index !== null && index.post_index !== undefined  ? 
    current_topic_posts[index.post_index] : 
    current_topic_posts.length > 0 && global.the_post !== null ? 
    current_topic_posts[0] : index.thePost;
    if(global.the_post === null && index.thePost){
      global.the_post = index.thePost;
    }
    let update = await getData("topic_update");
    if(global.topic_update || update){
      global.topic_update = false;
      await storeData("topic_update",false);
      setActions([]);
    }
    let theUser = thePost.user;
    let theComments = thePost.comments && thePost.comments.result ? 
    thePost.comments.result : thePost.comment ? thePost.comment : []
    setPost({...thePost});
    setUser(theUser);
    setComments([...theComments]);
   }catch(error){
     console.log("err",error)
   }
  };

  useFocusEffect(
    React.useCallback(() => {
      if(index.notification_id){
        apiFunctions.markAsSeen(token,index.notification_id);
      }
      if(index.notification_id && seen_notifications && !seen_notifications.includes(index.notification_id)){
        global.tot_notifications = global.tot_notifications - 1;
        seen_notifications && updateSeen([...seen_notifications,index.notification_id])
      }
      return () => {
        global.the_post = null;
      };
    }, []),
  );

  useEffect(() => {
    loadPostDetails();
  }, [current_topic_posts]);

  return (
    <AppPageBack {...props} title="Comments">
      <SizedBox height={4} />
      {post && user ? (
        <ScrollArea>
          <Container direction="row" paddingTop={4}>
            <Container width={15} horizontalAlignment="center">
              {user.photo ? <Avatar backgroundColor="#efefef" size={10} url={user.photo} /> : <LocalAvatar size={10} />}
            </Container>

            <Container paddingLeft={1}>
              <TouchFeedback 
              borderBottomColor={Colors.black}
              borderBottomWidth={0.1}
              onPress={async ()=>{
                await updateResult(user);
                props.navigation.navigate('Profile', {
                  member_info: user,
                });
              }}>
                <Container direction="row">
                            <H1 fontSize={10}>
                              {user.first_name} {user.last_name}
                            </H1>
                              <SizedBox width={1} />
                              {
                                user.status ? (
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

          <P fontSize={FONTSIZE.medium}>{post && post.body ? SentenceCase(post.body) : null}</P>

          {post.file ? (
            <>
              <SizedBox height={2} />
              <ImageWrap height={20} borderRadius={10} backgroundColor="#efefef" url={post.file} fit="contain" />
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
                    likeDislike(post, 'post');
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
                        <Ionicons Icon name="ios-heart" color="red" size={scaleFont(20)} />
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
                        <Feather Icon name="heart" color={Colors.greyBase900} size={scaleFont(FONTSIZE.icon)} />
                    </Container>
                  )}
              </TouchFeedback>

              <SizedBox width={3} />

              <TouchFeedback onPress={() => shareDetails({message: post.body})}>
                <Container padding={1.5}>
                  <Feather Icon name="share-2" color={Colors.greyBase900} size={scaleFont(FONTSIZE.icon)} />
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
            actions.filter(act=>act.type === "comment").map(item=>item.data).map((item,i)=>(
              <CommentBox 
                param={index} item={item} props={props} postId={post.id} type="comment" likeDislike={likeDislike} userD={userD} key={i}
                placeholder={true}
                actions={actions}
                setActions={setActions}
                props={props}
                comment_index={i}
              />
            ))
          }
          {comments ?
            comments.map((item, i) => (
            <CommentBox 
              param={index} item={item} props={props} postId={post.id} 
              type="comment" likeDislike={likeDislike} userD={userD} key={i} 
              actions={actions}
              setActions={setActions}
              props={props}
              comment_index={i}
            />
          )) : null}
        </ScrollArea>
      ) : null}
    </AppPageBack>
  );
};

export default TopicDetailsPost;
