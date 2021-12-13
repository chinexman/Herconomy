import React, {useState} from 'react';
import {LocalAvatar, H1, H2, P, AppPageBack, fontSemi, CheckBok, HGrid, DropdownSmall, SwitchWrap, Button, ListWrap,TouchFeedback} from '../../../components/component';
import {Container, TouchWrap, scaleFont, SizedBox, InputWrap, Avatar, SlideTransition, SlideTransitionCallback, ScrollArea, ImageWrap} from '@burgeon8interactive/bi-react-library';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../helpers/colors';
import {useStoreActions, useStoreState} from 'easy-peasy';
import {Modal, ActivityIndicator} from 'react-native';
import {SentenceCase, ToastShort} from '../../../helpers/utils';
import {useNavigation} from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import {NewPost, TopicSocket, GroupSocket} from '../../../helpers/sockets';
import moment from 'moment';
import { FONTSIZE } from '../../../helpers/constants';

const Post = props => {
  const navigation = useNavigation();
  const {userD, groups, myTopics} = useStoreState(state => ({
    userD: state.userDetails.user,
    groups: state.community.myGroups,
    myTopics: state.community.myTopics,
  }));

  const [feed, setFeed] = React.useState(true);
  const [group, setGroup] = React.useState(false);
  const [topic, setTopic] = React.useState(false);
  const [isEnabled, setIsEnabled] = React.useState(true);
  const [message, setMessage] = React.useState('');
  const [whereToPost, setWhereToPost] = React.useState('Feed');
  const [showList, setShowList] = React.useState(false);
  const [listMap, setListMap] = React.useState([]);
  const [showModal, setShowModal] = React.useState('false');
  const [sendingNow, setSending] = React.useState('false');
  const [file, setFile] = React.useState(null);
  const [fileMeta, setFileMeta] = React.useState(null);

  const [groupPlaceholder, setGroupPlaceholder] = useState({name: 'Select a Group', id: ''});
  const [topicPlaceholder, setTopicPlaceholder] = useState({name: 'Select a Topic', id: ''});

  const {updateFeedHolders} = useStoreActions(action=>({
    updateFeedHolders : action.community.updateFeedHolders
  }));
  const {feeds_holders} = useStoreState(state=>({
    feeds_holders : state.community.feeds_holders
  }))

  const onChoose = type => {
    setFeed(false);
    setGroup(false);
    setTopic(false);

    type === 'feed' ? setFeed(true) : type === 'group' ? setGroup(true) : type === 'topic' ? setTopic(true) : null;
    type === 'feed' ? setWhereToPost('Feed') : type === 'group' ? setWhereToPost('Group') : type === 'topic' ? setWhereToPost('Topic') : null;
  };

  const showListData = type => {
    if (type === 'group') {
      let newArray = groups.filter((el, i) => el.is_member);
      if (newArray.length > 0) {
        setListMap(newArray);
        setShowList(true);
      }
    }

    if (type === 'topic') {
      let myTopicsData = [];
      for (let i = 0; i < global.topics.length; i++) {
        let miniData = global.topics[i].followers.filter(ell => ell.id === userD.id);
        if (miniData.length > 0) {
          myTopicsData.push(global.topics[i]);
        }
      }
      setListMap(myTopicsData);
      setShowList(true);
    }
  };

  const selectFromList = el => {
    if (whereToPost === 'Group' || whereToPost === 'group') {
      setGroupPlaceholder({name: el.name, id: el.id});
    }

    if (whereToPost === 'Topic' || whereToPost === 'topic') {
      setTopicPlaceholder({name: el.title, id: el.id});
    }

    setShowList(false);
  };

  const submit = async () => {
    let cleanMessage = message.trim();
    if (cleanMessage === '' && fileMeta === '') {
      return;
    }

    if (whereToPost === 'Topic' && topicPlaceholder.id !== '') {
      try {
        let fd  = fileMeta && fileMeta.length > 0 ? {body: SentenceCase(cleanMessage), topic_id: topicPlaceholder.id, file: fileMeta} : {body: SentenceCase(cleanMessage), topic_id: topicPlaceholder.id};
        let res = await NewPost('topics', fd);
        setMessage('');
        navigation.navigate('Home', {screen: 'Topic'});
      } catch (error) {
      }
    }

    if (whereToPost === 'Group' && groupPlaceholder.id !== '') {
      try {
        let fd = fileMeta && fileMeta.length > 0 ? {body: cleanMessage, topic_id: groupPlaceholder.id, file: fileMeta} : 
        {body: cleanMessage, topic_id: groupPlaceholder.id}
        let res = await NewPost('groups', fd);
        setMessage('');
        navigation.navigate('Home', {screen: 'Topic'});
      } catch (error) {
      }
    }

    if (whereToPost === 'Feed') {
      let fd = fileMeta && fileMeta.length > 0 ? {body: SentenceCase(cleanMessage), file: fileMeta,
        token : global.token,
        post_index : null, comment_index  : null
      } : 
      {body: SentenceCase(cleanMessage),token : global.token, post_index : null, comment_index  : null};
      try {
        let res = await NewPost('feeds', fd);
        let holder = { 
          post : {
            id: "e5e46d00-c5bb-438c-ac76-1ad0ad1fe840",
            body: fd.body,
            user: userD,
            file: fd.file || null,
            content_type: "feed",
            allow_comments: false,
            number_of_likes: 0,
            number_of_comments: 0,
            likes: [],
            created_at: moment(new Date()).format(),
            comments: {count: 0, pages: 1, result: Array(0), page: 1},
            flag: "allowed",
            reported: false,
            is_icebreaker: null,
            is_question: null,
            holder : true
          }
        }
        await updateFeedHolders([holder,...feeds_holders]);
        setMessage('');
        setFile();
        setFileMeta('');
        setTimeout(() => navigation.navigate("Home"), 250);
      } catch (error) {
      }
    }
  };

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      setFile(res.uri);
      setFileMeta(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const pickCameraPicture = async () => {
    const options = {
      title: 'Select Profile PIcture',
    };
    ImagePicker.showImagePicker(options, response => {
      try {
        if (response.didCancel) {
          ToastShort('User cancelled image picker');
        } else if (response.error) {
          ToastShort(response.error);
        } else {
          setFile(response.uri);
          setFileMeta(`data:${response.type};base64,${response.data}`);
        }
      } catch (error) {}
    });
  };

  return (
    <AppPageBack {...props} title="Add Post">
      <GroupSocket />
      <TopicSocket />
      <Container direction="row" marginTop={4} verticalAlignment="center" horizontalAlignment="space-between">
        <Container direction="row" verticalAlignment="center">
          <Container marginRight={2}>{userD.photo ? <Avatar backgroundColor="#efefef" size={10} url={userD.photo} /> : <LocalAvatar size={10} />}</Container>

          <Container>
            <H1 fontSize={FONTSIZE.medium}>
              {userD.first_name} {userD.last_name}
            </H1>
          </Container>
        </Container>

        <DropdownSmall placeholder={whereToPost} width="30%" onPress={() => setShowModal(true)} />
      </Container>

      <ScrollArea>
        <Container marginTop={5}>
          {file ? (
            <>
              <ImageWrap height={15} url={file} fit="contain" />
              <SizedBox height={1} />
            </>
          ) : null}
          <InputWrap
            value={message}
            onChangeText={text => setMessage(text)}
            fontFamily={fontSemi}
            placeholder={file ? 'Enter Caption' : 'What is on your mind?'}
            fontSize={13}
            numberOfLines={file ? 3 : 6}
            multiline={true}
            maxHeight={100}
          />
          <Container height={0.05} backgroundColor={Colors.fadedText} />
          <Container direction="row" verticalAlignment="center" horizontalAlignment="space-between" 
          borderColor={Colors.black} 
          borderTopWidth={1}>
            <Container direction="row">
              <TouchFeedback paddingVertical={2} paddingHorizontal={3} onPress={pickCameraPicture}>
                <Feather Icon name="camera" size={scaleFont(16)} />
              </TouchFeedback>

              {/*  <SizedBox width={2} />

              <TouchFeedback paddingVertical={2} paddingHorizontal={3} onPress={pickDocument}>
                <Feather Icon name="image" size={scaleFont(16)} />
              </TouchFeedback> */}
            </Container>

            <Container>
              {sendingNow === true ? (
                <Container paddingHorizontal={4}>
                  <ActivityIndicator size="small" />
                </Container>
              ) : (
                <TouchFeedback paddingVertical={1.5} paddingHorizontal={4} onPress={submit}>
                  <Feather Icon name="send" size={scaleFont(16)} />
                </TouchFeedback>
              )}
            </Container>
          </Container>
        </Container>
      </ScrollArea>

      <Modal transparent={true} statusBarTranslucent={true} visible={showModal}>
        {!showList ? (
          <Container flex={1} backgroundColor="#0009" verticalAlignment="flex-end">
            <TouchWrap flex={1} onPress={() => setShowModal(false)} />
            <SlideTransition direction="vertical" from={50} duration={250}>
              <Container backgroundColor="#fff" padding={8} borderTopLeftRadius={50} borderTopRightRadius={50} paddingTop={5}>
                <H2 fontSize={16}>Who can see this post ?</H2>

                <SizedBox height={3} />

                <TouchFeedback onPress={() => onChoose('feed')}>
                  <HGrid>
                    <P fontSize={14}>Post to feed</P>
                    <CheckBok status={feed} />
                  </HGrid>
                </TouchFeedback>

                <SizedBox height={3} />

                <TouchFeedback onPress={() => onChoose('group')}>
                  <HGrid>
                    <P fontSize={FONTSIZE.medium}>Group</P>
                    <CheckBok status={group} onPress={() => onChoose('group')} />
                  </HGrid>
                </TouchFeedback>

                {group ? (
                  <SlideTransitionCallback from={1} duration={500} index={group}>
                    <SizedBox height={1} />
                    <DropdownSmall
                      width="50%"
                      placeholder={groupPlaceholder.name}
                      onPress={() => showListData('group')}
                      color={groupPlaceholder.name.includes('Select') ? Colors.greyBase900 : Colors.button}
                    />
                  </SlideTransitionCallback>
                ) : null}

                <SizedBox height={3} />

                <TouchFeedback onPress={() => onChoose('topic')}>
                  <HGrid>
                    <P fontSize={FONTSIZE.medium}>Topic</P>
                    <CheckBok status={topic} onPress={() => onChoose('topic')} />
                  </HGrid>
                </TouchFeedback>

                {topic ? (
                  <SlideTransitionCallback from={1} duration={500} index={topic}>
                    <SizedBox height={1} />
                    <DropdownSmall
                      width="50%"
                      placeholder={topicPlaceholder.name}
                      onPress={() => showListData('topic')}
                      color={topicPlaceholder.name.includes('Select') ? Colors.greyBase900 : Colors.button}
                    />
                  </SlideTransitionCallback>
                ) : null}

                <HGrid marginTop={3}>
                  <P fontSize={FONTSIZE.medium}>Allow comments?</P>
                  <SwitchWrap enabled={isEnabled} toggleSwitch={() => setIsEnabled(previousState => !previousState)} />
                </HGrid>
              </Container>
            </SlideTransition>
          </Container>
        ) : (
          <ListWrap onToggle={() => setShowList(!showList)} title={whereToPost} listMap={listMap} onHide={() => setShowList(false)} selectFromList={selectFromList} />
        )}
      </Modal>
    </AppPageBack>
  );
};

export default Post;
