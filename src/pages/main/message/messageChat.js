import React from 'react';
import {ActivityIndicator, ScrollView, Keyboard} from 'react-native';
import {H2, P, LocalAvatar, AppPageBack, ChatLoader, BoxLoader,TouchFeedback} from '../../../components/component';
import {
  SizedBox,
  TouchWrap,
  scaleFont,
  Container,
  Avatar,
  InputWrap,
  ImageWrap,
  SlideTransition,
} from '@burgeon8interactive/bi-react-library';

import Colors from '../../../helpers/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
/* import Fontisto from 'react-native-vector-icons/Fontisto';
import DocumentPicker from 'react-native-document-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; */
import {useStoreState} from 'easy-peasy';
import {} from '../../../helpers/utils';
import {SendMessages, GetMessages, ReadMessage} from '../../../helpers/global_sockets';
import {storeData, getData} from '../../../helpers/functions';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FONTSIZE } from '../../../helpers/constants';

/**ANCHOR ChatBox */

const ChatBox = ({item}) => {

  const {user} = useStoreState(state => ({
    user: state.userDetails.user,
  }));

  const isUser = user.id === item.sender.id;
  let config = {};
  isUser
    ? (config = {
        transition: 0,
        boxAlignment: 'flex-end',
        backgroundColor: Colors.primaryFaded,
        direction: 'row-reverse',
        nameTextDirection: 'right',
        nameTextColor: Colors.chatTitleText,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 20,
        messageColor: Colors.greyBase30,
        timestampColor: Colors.greyBase90,
        fontSize: 10,
        showIcon: true,
      })
    : (config = {
        transition: 0,
        boxAlignment: 'flex-start',
        backgroundColor: '#fff',
        direction: 'row',
        nameTextDirection: 'left',
        nameTextColor: Colors.chatTitleText,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 0,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 15,
        messageColor: Colors.greyBase,
        timestampColor: Colors.greyBase90,
        fontSize: 10,
        showIcon: false,
      });

  return (
    <>
      <SlideTransition from={config.transition} duration={250}>
        <Container horizontalAlignment={config.boxAlignment} padding={1}>
          <Container direction={config.direction}>
            <TouchFeedback>
              {item.sender.photo ? (
                <Avatar url={item.sender.photo} size={6} backgroundColor={config.backgroundColor} elevation={1} />
              ) : (
                <LocalAvatar size={6} />
              )}
              {item.sender.status ? (
                                  <Avatar backgroundColor={Colors.primary} 
                                    size={1.5}
                                  />
                                ) : (
                                  <Avatar backgroundColor={Colors.lightGrey} 
                                    size={1.5}
                                  />
                                )
                              }
            </TouchFeedback>

            <SizedBox width={1} />

            <Container maxWidth="75%">
              {/*   <H1 fontSize={8} textAlign={config.nameTextDirection} color={config.nameTextColor}>
                {item.sender.first_name} {item.sender.last_name}
              </H1>
              <SizedBox height={0.5} /> */}

              <Container
                widthPercent="auto"
                horizontalAlignment="flex-start"
                backgroundColor={config.backgroundColor}
                paddingHorizontal={4}
                paddingVertical={0.5}
                borderTopRightRadius={config.borderTopRightRadius}
                borderTopLeftRadius={config.borderTopLeftRadius}
                borderBottomRightRadius={config.borderBottomRightRadius}
                borderBottomLeftRadius={config.borderBottomLeftRadius}>
                {item.body !== '' ? (
                  <TouchFeedback>
                    <H2 fontSize={config.fontSize} color={config.messageColor}>
                      {item.body}
                    </H2>
                  </TouchFeedback>
                ) : null}

                {item.file !== null ? (
                  <Container>
                    <TouchFeedback>
                      <ImageWrap url={item.file} width={20} height={10} fit="cover" />
                    </TouchFeedback>
                  </Container>
                ) : null}

                <SizedBox height={0.5} />
                <Container selfAlignment="flex-end" verticalAlignment="center" direction="row">
                  <P fontSize={5} color={config.timestampColor}>
                    {moment(item.created_at)
                      .local()
                      .format('hh:mm:ss a')}
                  </P>
                </Container>
              </Container>
            </Container>
          </Container>
        </Container>
      </SlideTransition>
    </>
  );
};

const MessageHeader = ({section,loading,msg_len,index}) => {
  let dateChecker = val => {
    let today = moment().format('YYYY-MM-DD');
    let checkToday = moment(val)
      .local()
      .isSame(today);
    let checkYesterday = moment(val).isSame(today);
    if (checkToday) {
      return 'Today';
    } else if (checkYesterday) {
      return 'Yesterday';
    } else {
      return moment(val)
        .local()
        .format('LL');
    }
  };

  return (
    <>
      <Container marginVertical={1} verticalAlignment="center" horizontalAlignment="center">
        <Container backgroundColor={Colors.white} padding={1.5} borderRadius={5} width={30}>
          <H2 textAlign="center" fontSize={6} color={Colors.greyBase300}>
            {dateChecker(section.title)}
          </H2>
        </Container>
      </Container>
      {section.data.map((el, i) => (
        <ChatBox item={el} key={i} />
      ))}
      {/* {
        (msg_len - 1) === index && loading ? (
          <ChatLoader />
        ) : null
      } */}
    </>
  );
};

const MessageChat = props => {
  const data = props.route.params;

  const {userD} = useStoreState(state => ({
    userD: state.userDetails.user,
    token: state.userDetails.token,
  }));

  const [isSending, setIsSending] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [file, setFile] = React.useState('');
  const [fileMeta, setFileMeta] = React.useState('');
  const [messages, setMessages] = React.useState([]);
  const scrollViewRef = React.useRef();
  const [loading,setLoading] = React.useState(true);
  const [placeholder,setPlaceHolder] = React.useState([]);

  const sendChat = async () => {
    let cleanMessage = message.trim();
    if (cleanMessage === '') {
      return;
    }

    setIsSending(true);
    const payLoad = {
      to_user: data.id,
      body: cleanMessage,
      token : global.token,
    };

    let msg = {
      message_id: `5185332c-235d-4687-a699-660d2c7d362c|6284da70-3049-4f65-a439-0a7018397f59-${Math.random()}`,
      sender: userD,
      receiver: data,
      body: cleanMessage,
      file: null,
      created_at: moment.utc(new Date()).local().format(),
      id: 58,
      timestamp: moment.utc(new Date()).local().format(),
    }
    let holder = [...placeholder,msg];
    setPlaceHolder(holder);
    setMessage('');
    let msgs = await getData(`msg_${data.id}`);
    msgs = msgs && msgs.length > 0 ? msgs : [];
    reArrangeData([...msgs,...holder]);
    SendMessages(payLoad);
    setIsSending(false);
  };

  const updateRead = () => {
    ReadMessage({user_id: data.id,token : global.token});
  };

  const loadMessage = async () => {
    let msg = await getData(`msg_${data.id}`);
    reArrangeData(msg);
  };

  const reArrangeData = data => {
    if(!data) return;
    let res = data.filter(msg=>msg.body);
    res.forEach((el, i) => {
      res[i].id = 0 + i;
      res[i].timestamp = el.created_at.split('T')[0];
    });
    res.sort((a, b) => a.created_at.localeCompare(b.created_at));

    const DATA = Object.values(
      res.reduce((acc, item) => {
        if (!acc[item.timestamp]) {
          acc[item.timestamp] = {
            title: item.timestamp,
            id: item.id,
            data: [],
          };
        }
        acc[item.timestamp].data.push(item);
        return acc;
      }, {}),
    );
    DATA.length ? setLoading(false) : null;
    setMessages([...DATA]);
  };

  React.useEffect(() => {
    loadMessage();
    global.socket.off(`get_messages_${data.id}|${userD.id}`).on(`get_messages_${data.id}|${userD.id}`, ({res}) => {
      let msgData = res.data ? res.data : res;
      reArrangeData(msgData);
      setPlaceHolder([]);
      storeData(`msg_${data.id}`, msgData);
      setLoading(false)
      scrollViewRef.current.scrollToEnd();
      updateRead();
    });

    setTimeout(() => {
      GetMessages({to_user: data.id,token : global.token});
    }, 50);

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => scrollViewRef.current.scrollToEnd());
    return () => {
      keyboardDidShowListener.remove();
      global.socket.off(`get_messages_${data.id}|${userD.id}`);
    };
  }, []);

  return (
    <AppPageBack
      title={`${data.first_name} ${data.last_name}`}
      paddingHorizontal={0.01}
      {...props}
      avatar={data.photo ? <Avatar url={data.photo} size={10} elevation={5} /> : <LocalAvatar size={10} />}>
      <SizedBox height={6} />
      <Container flex={1} paddingHorizontal={4}>
        <ScrollView ref={scrollViewRef} onContentSizeChange={() => {
            scrollViewRef.current.scrollToEnd()
          }
        }
        showsVerticalScrollIndicator={false}
        >
          {messages.map((el, i) => {
            return <MessageHeader section={el} userData={data} key={i} msg_len={messages.length} loading={loading} index={i}/>
          })}
          { loading ? 
            [..."12345"].map((item,index)=>(
              <BoxLoader key={index}/>
            )) : null
          }
        </ScrollView>
      </Container>

      <SizedBox height={2} />
      <Container>
        <Container direction="row" backgroundColor="#fff" paddingHorizontal={4} verticalAlignment="center">
          <InputWrap
            value={message}
            onChangeText={msg => setMessage(msg)}
            flex={1}
            width={71}
            autoCorrect={true}
            placeholder="Type a message . . ."
            fontSize={FONTSIZE.medium}
            backgroundColor={Colors.chatBar}
            color={Colors.chatText}
            multiline={true}
            maxHeight={15}
          />
          <Container marginLeft="10">
            <TouchFeedback onPress={sendChat}>
              <Container>
                <Ionicons Icon name="ios-paper-plane" size={scaleFont(25)} color={Colors.button} />
              </Container>
            </TouchFeedback>
          </Container>
        </Container>
      </Container>
    </AppPageBack>
  );
};

export default MessageChat;
