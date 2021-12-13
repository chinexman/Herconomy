import React, {useEffect} from 'react';

import axios from 'axios';
import {Container, Avatar, SizedBox, ImageWrap, TouchWrap, scaleFont, InputWrap, ScrollArea} from '@burgeon8interactive/bi-react-library';
import moment from 'moment';
import numeral from 'numeral';
import {AppPageBack, H1, P, H2, LocalAvatar, CommentBoxTemplate,TouchFeedback} from '../../../../components/component';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useStoreState, useStoreActions} from 'easy-peasy';
import Colors from '../../../../helpers/colors';
import {FlatList, ActivityIndicator, Keyboard} from 'react-native';
import {shareDetails, storeData} from '../../../../helpers/functions';
import {Like, Unlike, PostComment, PostReply, ReloadFeeds, ReportPost, DeletePost} from '../../../../helpers/global_sockets';
import {ToastShort, ToastLong, SentenceCase} from '../../../../helpers/utils';

import {apiFunctions} from '../../../../helpers/api';
import {useFocusEffect} from '@react-navigation/native';
import { FONTSIZE } from '../../../../helpers/constants';

const ComponentInput = props => (
  <>
    <Container direction="row" verticalAlignment="center" paddingBottom={7} borderColor="#dfdfdf" borderBottomWidth={4} marginBottom={2}>
      {props.userD.photo ? <Avatar backgroundColor="#efefef" size={10} url={props.userD.photo} /> : <LocalAvatar size={9} />}
      <Container flex={1} marginLeft={2}>
        <InputWrap
          value={props.value}
          onChangeText={props.onChangeText}
          multiline={true}
          maxHeight={20}
          widthPercent="100%"
          heightPercent="30%"
          paddingLeft={2}
          paddingTop={1}
          paddingBottom={1}
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
    </Container>
  </>
);

/* ANCHOR CommentBoxTemplate */
const CommentBox = ({item, type, likeDislike, updatingCommentLike, updatingReplyLike, userD, postId}) => {
  const {newReply, feedsUpdate} = useStoreActions(actions => ({
    newReply: actions.community.newReply,
    feedsUpdate: actions.community.feedsUpdate,
  }));

  const [toggleReply, setToggleReply] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [newMessage, setNewMessage] = React.useState('');

  const toggleReplyClick = async () => {
    setToggleReply(!toggleReply);
  };

  const submitReply = async () => {
    let cleanMessage = newMessage.trim();

    if (cleanMessage === '') {
      return;
    }

    setSubmitting(true);
    Keyboard.dismiss();
    let fd = {
      body: cleanMessage,
      comment_id: item.id,
    };

    await PostReply(fd);
    setSubmitting(false);
    setNewMessage('');
    toggleReplyClick();
  };

  const onClicked = el => {
    likeDislike(el, type);
  };

  return (
    <>
      <Container direction="row" borderColor="#dfdfdf" borderBottomWidth={4} marginBottom={2}>
        <Container marginRight={2} horizontalAlignment="flex-start">
          {item.user.photo ? <Avatar backgroundColor="#efefef" size={10} url={item.user.photo} /> : <LocalAvatar size={10} />}
        </Container>

        <>
          <Container widthPercent="86%">
            <Container paddingLeft={1} borderRadius={10} padding={2} backgroundColor={Colors.offWhite} flex={1}>
              <H1 fontSize={10}>
                {item.user.first_name} {item.user.last_name}
              </H1>

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
              <P fontSize={9}>
                  {item && item.created_at ? moment(item.created_at, 'YYYY-MM-DDTHH:mm:ss.SSS')
                .local()
                .fromNow() : null}
              </P>

              <SizedBox width={4} />

              {updatingCommentLike ? <ActivityIndicator size="small" /> : null}
              <TouchFeedback paddingBottom={2} paddingRight={2} onPress={() => onClicked(item)}>
                <H2 fontSize={9}>{item.likes.filter(ell => ell.id === userD.id).length > 0 ? 'Unlike' : 'Like'}</H2>
              </TouchFeedback>

              <P fontSize={8} color={Colors.greyBase900}>
                {numeral(item.likes.length).format('0,0')}
              </P>

              <SizedBox width={4} />

              <TouchFeedback paddingBottom={2} paddingRight={2} onPress={toggleReplyClick}>
                <H2 fontSize={9}>Reply</H2>
              </TouchFeedback>
            </Container>

            <SizedBox height={1.5} />
            {item.replies.map((el, i) => (
              <CommentBoxTemplate item={el} key={i} type="reply" likeDislike={likeDislike} updatingReplyLike={updatingReplyLike} />
            ))}

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
          </Container>
        </>
      </Container>
    </>
  );
};

const FeedActions = props => {
  const {userD, token} = useStoreState(state => ({
    userD: state.userDetails.user,
    token: state.userDetails.token,
  }));


  const [report, setReport] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [newMessage, setNewMessage] = React.useState('');
  const [post, setPost] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [comments, setComments] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const index = props.route.params.item;
  const {feeds_data
  } = useStoreState(state => ({
    feeds_data : state.community.feeds_data,
  }));
  const {updateFeedData} = useStoreActions(action=>(
    {
      updateFeedData : action.community.updateFeedData
    }
  ))
  const makeReport = () => {
    setReport(prevState => !prevState);
  };

  const submitReport = async () => {
    let cleanMessage = newMessage.trim();

    if (cleanMessage === '') {
      return;
    }
    setSubmitting(true);
    Keyboard.dismiss();
    let fd = {
      id: post.id,
      post_type: 'post',
      complain: cleanMessage,
      token : global.token
    };
    await ReportPost(fd);

    setSubmitting(false);
    setNewMessage('');
    makeReport();

    // alert('thank you for your report ');
    ToastLong('Post Reported!, thank you');
    // props.navigation.goBack();
  };

  const handleDelete = async () => {
    let index = props.route.params.item_index;
    setLoading(true);
    let fd = {
      content_type: 'post',
      id: post.id,
      token : global.token
    };

    await DeletePost(fd);
    feeds_data.splice(index,1)
    updateFeedData(feeds_data);
    setTimeout(() => {
      setLoading(false);
      props.navigation.goBack();
      ToastShort('Post Deleted');
    }, 1500);
  };

  const block = async userInfo => {
    setLoading(true);

    let fd = {
      user_id: userInfo.id,
    };

    apiFunctions
      .blockUser(token, fd)
      .then(res => {
        setTimeout(() => {
          setLoading(false);
          ToastLong(`The user ${userInfo.first_name} has been blocked.`);
          props.navigation.goBack();
        }, 1500);
      })
      .catch(err => {
        setLoading(false);
        ToastLong('Connection Error. Please try again later');
      });
    // await blockUser(fd);
  };

  const loadFeedsDetails = React.useCallback(() => {
    const item = props.route.params.item;
    setPost(item ? item.post : null);
    setUser(item ? item.post.user : null);
    setComments(item ? item.post.comments : []);
  });

  useEffect(() => {
    loadFeedsDetails()
    storeData("loadFirstFeeds",false);
  }, [loadFeedsDetails]);

  return (
    <AppPageBack {...props} title="Post">
      <SizedBox height={4} />
      {post && user ? (
        <ScrollArea>
          <Container direction="row" paddingTop={4}>
            <Container horizontalAlignment="flex-start">
              {user.photo ? <Avatar backgroundColor="#efefef" size={10} url={user.photo} /> : <LocalAvatar size={10} />}
            </Container>

            <Container paddingLeft={3}>
              <H1 fontSize={10}>
                {user.first_name} {user.last_name}
              </H1>
              <P fontSize={6}>
                {moment(post.created_at, 'YYYY-MM-DDTHH:mm:ss.SSS')
                  .local()
                  .fromNow()}
              </P>
            </Container>
          </Container>

          <SizedBox height={2} />

          <P fontSize={FONTSIZE.medium}>{post.body ? SentenceCase(post.body) : null}</P>

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
            // borderBottomWidth={0.6}
            borderBottomWidth={0}
            borderColor={Colors.greyBase900}
            paddingBottom={2}
            marginBottom={2}>
          </Container>
          {userD.id === user.id ? (
            <Container
              direction="row"
              verticalAlignment="center"
              horizontalAlignment="space-between"
              borderBottomWidth={0.6}
              borderColor={Colors.greyBase900}
              paddingBottom={2}
              marginBottom={2}>
              <TouchFeedback onPress={() => handleDelete()}>
                <Container padding={1.5} direction="row">
                  <AntDesign Icon name="delete" color="red" size={scaleFont(20)} />
                  <Container paddingLeft={1.5}>
                    <H1 fontSize={10} color="red">
                      Delete
                    </H1>
                  </Container>
                </Container>
              </TouchFeedback>
            </Container>
          ) : (
            <>
              <Container
                direction="row"
                verticalAlignment="center"
                horizontalAlignment="space-between"
                borderBottomWidth={0.6}
                borderColor={Colors.greyBase900}
                paddingBottom={2}
                marginBottom={2}>
                <TouchFeedback onPress={() => makeReport()}>
                  <Container padding={1.5} direction="row">
                    <Ionicons Icon name="ios-alert" color="red" size={scaleFont(20)} />
                    <Container paddingLeft={1.5}>
                      <H1 fontSize={10}>Report Post</H1>
                    </Container>
                  </Container>
                </TouchFeedback>
              </Container>

              <Container
                direction="row"
                verticalAlignment="center"
                horizontalAlignment="space-between"
                borderBottomWidth={0.6}
                borderColor={Colors.greyBase900}
                paddingBottom={2}
                marginBottom={5}>
                <TouchFeedback onPress={() => block(user)}>
                  <Container padding={1.5} direction="row">
                    <Ionicons Icon name="ios-remove-circle-outline" color="red" size={scaleFont(20)} />
                    <Container paddingLeft={1.5}>
                      <H1 fontSize={10}>Block User</H1>
                    </Container>
                  </Container>
                </TouchFeedback>
              </Container>
            </>
          )}
          {loading && <ActivityIndicator size="large" />}

          {/* Report Input Section */}
          {report && (
            <ComponentInput
              userD={userD}
              submitting={submitting}
              value={newMessage}
              onChangeText={text => setNewMessage(text)}
              onSubmitIt={() => submitReport()}
              placeholder="Write a reason for your report"
            />
          )}
          {/* ANCHOR - COMMENTS BOX */}
        </ScrollArea>
      ) : null}
    </AppPageBack>
  );
};

export default FeedActions;
