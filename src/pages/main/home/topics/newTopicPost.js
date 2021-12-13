import React, {useState} from 'react';
import {LocalAvatar, H1, H2, P, AppPageBack, fontSemi, CheckBok, HGrid, DropdownSmall, SwitchWrap, Button,TouchFeedback} from '../../../../components/component';
import {Container, TouchWrap, scaleFont, SizedBox, InputWrap, Avatar, SlideTransition, SlideTransitionCallback, ScrollArea, ImageWrap} from '@burgeon8interactive/bi-react-library';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../../helpers/colors';
import {useStoreState,useStoreActions} from 'easy-peasy';
import {Modal, ActivityIndicator} from 'react-native';
import {ToastShort} from '../../../../helpers/utils';
import {useNavigation} from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import {NewPost} from '../../../../helpers/sockets';
import { FONTSIZE } from '../../../../helpers/constants';

const NewTopicPost = props => {
  const navigation = useNavigation();
  const {userD, groups, topics,topics_holders} = useStoreState(state => ({
    userD: state.userDetails.user,
    groups: state.community.groups,
    topics: state.community.topics,
    topics_holders : state.community.topics_holders
  }));

  const {updateTopicHolders} = useStoreActions(action=>({
    updateTopicHolders : action.community.updateTopicHolders
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

  const init = () => {
    let params = props.route.params;

    if (params) {
      if (params.type === 'topic') {
        onChoose('topic');
        setTopicPlaceholder({name: params.value, id: params.id});
      }
    }
  };

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
      let newArray = topics.filter((el, i) => el.following);
      if (newArray.length > 0) {
        setListMap(newArray);
        setShowList(true);
      }
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
    if (cleanMessage === '') {
      return;
    }
    if (whereToPost === 'Topic' && topicPlaceholder.id !== '') {
      try {
        let fd  = fileMeta && fileMeta.length > 0 ? {body: cleanMessage, topic_id: topicPlaceholder.id, file: fileMeta,
          token : global.token, post_index : null, comment_index : null
        } : {body: cleanMessage, topic_id: topicPlaceholder.id,
          token : global.token,post_index : null, comment_index : null
        };
        await updateTopicHolders([fd,...topics_holders]);
        let res = await NewPost('topics', fd);
        setMessage('');
        navigation.navigate('TopicsDetails', topicPlaceholder.id)
      } catch (error) {
      }
    }

    if (whereToPost === 'Group' && groupPlaceholder.id !== '') {
      try {
        let fd = fileMeta && fileMeta.length > 0 ? {body: cleanMessage, topic_id: groupPlaceholder.id, file: fileMeta} : 
        {body: cleanMessage, topic_id: groupPlaceholder.id}
        let res = await NewPost('groups', fd);
        setMessage('');
        navigation.goBack();
      } catch (error) {
      }
    }

    if (whereToPost === 'Feed') {
      try {
        let fd = fileMeta && fileMeta.length > 0 ? {body: cleanMessage, file: fileMeta} : {body: cleanMessage};
        let res = await NewPost('feeds', fd);
        setMessage('');
        navigation.navigate('Home', {screen: 'Feed'});
      } catch (error) {
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

  React.useEffect(() => {
    init();
  }, []);

  return (
    <AppPageBack {...props} title="Add Post">
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
            <TouchFeedback flex={1} onPress={() => setShowModal(false)} />
            <SlideTransition direction="vertical" from={50} duration={250}>
              <Container backgroundColor="#fff" padding={8} borderTopLeftRadius={50} borderTopRightRadius={50} paddingTop={5}>
                <H2 fontSize={16}>Who can see this post ?</H2>

                <HGrid marginTop={3}>
                  <P fontSize={14}>Post to feed</P>
                  <CheckBok status={feed} onPress={() => onChoose('feed')} />
                </HGrid>

                <HGrid marginTop={3}>
                  <P fontSize={FONTSIZE.medium}>Group</P>
                  <CheckBok status={group} onPress={() => onChoose('group')} />
                </HGrid>

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

                <HGrid marginTop={3}>
                  <P fontSize={FONTSIZE.medium}>Topic</P>
                  <CheckBok status={topic} onPress={() => onChoose('topic')} />
                </HGrid>

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
          <Container flex={1} backgroundColor="#0009" paddingHorizontal={6}>
            <TouchFeedback flex={1} onPress={() => setShowList(!showList)} />

            <Container backgroundColor="#fff" padding={4}>
              <TouchFeedback borderBottomColor="#dfdfdf" borderBottomWidth={0.5} paddingVertical={2}>
                <H1>Select {whereToPost}</H1>
              </TouchFeedback>

              <ScrollArea>
                {listMap.map((el, i) => (
                  <TouchFeedback borderBottomColor="#dfdfdf" borderBottomWidth={0.5} paddingVertical={2} onPress={() => selectFromList(el)}>
                    {whereToPost === 'Group' || whereToPost === 'Groups' ? <P>{el.name}</P> : whereToPost === 'Topic' || whereToPost === 'Topics' ? <P>{el.title}</P> : null}
                  </TouchFeedback>
                ))}
              </ScrollArea>

              <Button title="Cancel" onPress={() => setShowList(false)} />
            </Container>

            <TouchFeedback flex={1} onPress={() => setShowList(!showList)} />
          </Container>
        )}
      </Modal>
    </AppPageBack>
  );
};

export default NewTopicPost;
