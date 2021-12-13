import React, {useState} from 'react';
import {LocalAvatar, H1, H2, P, AppPageBack, fontSemi, CheckBok, HGrid, DropdownSmall, SwitchWrap, Button,TouchFeedback} from '../../../../components/component';
import {
  Container,
  Page,
  TouchWrap,
  scaleFont,
  SizedBox,
  InputWrap,
  Avatar,
  SlideTransition,
  SlideTransitionCallback,
  ScrollArea,
  ImageWrap,
} from '@burgeon8interactive/bi-react-library';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../../helpers/colors';
import {useStoreState, useStoreActions} from 'easy-peasy';
import {Modal, Keyboard, ActivityIndicator} from 'react-native';
import {ToastShort} from '../../../../helpers/utils';
import {useNavigation} from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import {apiFunctions} from '../../../../helpers/api';
import {storeData} from '../../../../helpers/functions';
import { FONTSIZE } from '../../../../helpers/constants';

//const configDetails = [{text: 'Post to feed', status: true}, {text: 'Group', status: false}, {text: 'Topic', status: false}];

const FeedPost = props => {
  const navigation = useNavigation();
  const {token, userD, groups, topics,answered_breakers} = useStoreState(state => ({
    token: state.userDetails.token,
    userD: state.userDetails.user,
    groups: state.community.groups,
    topics: state.community.topics,
    answered_breakers: state.community.answered_breakers,
  }));

  const {newFeedPost, groupsUpdate,
    topicsUpdate,updateAnsweredBreakers
  } = useStoreActions(actions => ({
    newFeedPost: actions.community.newFeedPost,
    FeedUpdate: actions.community.FeedUpdate,
    groupsUpdate: actions.community.groupsUpdate,
    topicsUpdate: actions.community.topicsUpdate,
    updateAnsweredBreakers : actions.community.updateAnsweredBreakers
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

  const submit = async () => {
    let cleanMessage = message.trim();
    let payload;

    if (cleanMessage === '' && file === '') {
      return;
    }

    Keyboard.dismiss();
   // setSending(true);

    payload = new FormData();
    payload.append('body', cleanMessage);
    payload.append('allow_comments', isEnabled);

    if(props.route.params && props.route.params.body){
      storeData('ice_question',props.route.params.body.toString())
    }

    if (file) {
      payload.append('file', {
        uri: fileMeta.uri,
        type: fileMeta.type,
        name: fileMeta.name,
      });
    }
    apiFunctions
      .ansIcebreakers(`/icebreakers/${props.route.params.id}/post/`, token, payload)
      .then(res => {
        updateAnsweredBreakers([...answered_breakers,props.route.params.id])
        ToastShort('Response Updated Successfully');
        navigation.goBack();
      })
      .catch(err => ToastShort(err.msg))
      .then(() => setSending(false));
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
          setFileMeta({
            uri: response.uri,
            type: response.type,
            name: response.fileName,
          });
        }
      } catch (error) {}
    });
  };

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

        {/* <DropdownSmall placeholder={whereToPost} width="30%" onPress={() => setShowModal(true)} /> */}
      </Container>

      <ScrollArea>
        <Container marginTop={5}>
          <H1>{props.route.params.body}</H1>
        </Container>

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
            placeholder="Enter Response . . ."
            fontSize={13}
            numberOfLines={4}
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

              <SizedBox width={2} />

              <TouchFeedback paddingVertical={2} paddingHorizontal={3} onPress={pickDocument}>
                <Feather Icon name="image" size={scaleFont(16)} />
              </TouchFeedback>
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
    </AppPageBack>
  );
};

export default FeedPost;
