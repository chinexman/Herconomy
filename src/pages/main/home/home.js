import React, {useEffect,useState} from 'react';
import {useStoreState, useStoreActions} from 'easy-peasy';
import {Page, Container, TouchWrap, SizedBox, scaleFont} from '@burgeon8interactive/bi-react-library';
import {H1, H2,P, TouchFeedback} from '../../../components/component';
import Colors from '../../../helpers/colors';
import Feather from 'react-native-vector-icons/Feather';
import OneSignal from 'react-native-onesignal';
import {apiFunctions} from '../../../helpers/api';
import {useFocusEffect} from '@react-navigation/native';
import {storeData, getData} from '../../../helpers/functions';
import Feeds from './feeds/feeds';
import Topics from './topics/topic';
import Groups from './groups/group';
import { TouchableNativeFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import Notify from './notify';
import { FONTSIZE } from '../../../helpers/constants';

const Home = props => {
  const {user, token,msg_senders} = useStoreState(state => ({
    user: state.userDetails.user,
    token: state.userDetails.token,
    msg_senders : state.community.msg_senders
  }));

  const {_updateUser, _updateSubscriptionStatus} = useStoreActions(actions => ({
    _updateUser: actions.userDetails.updateUser,
    _updateSubscriptionStatus: actions.userDetails.updateSubscriptionStatus
  }));
  
  const [isLoading,setLoading] = useState(true);
  const [account,setAccount] = useState({});
  const [notification,setNotificaitions] = useState(0);
  const [senders,setSenders] = useState(null);
  const [dismisedQue,setDismissedQue] = useState([]);
  const [iceBreakerQuestion, setIceBreakerQuestion] = React.useState([]);
  const {updateTotNotification,updateSenders} = useStoreActions(action=>({
    updateTotNotification : action.notification.updateTotNotification,
    updateSenders : action.community.updateSenders
  }));
  const [current,setCurrent] = useState("Feed");
  const [notify_id,setNotify] = useState(null); 
  const [que,setQue] = useState([]);
  const onReceived = async (notification) => {
    getSenders();
  };

  const getSenders = () => {
    global.socket.off(`new_message_${user.id}`).on(`new_message_${user.id}`,  ({res}) =>{
      updateSenders(res);
    });
  }

  const loadIceBreakers = () => {
    apiFunctions
      .icebreakers(token)
      .then(res => {
        setIceBreakerQuestion([...res]);
      })
      .catch(err => {});
  };

  const onOpened = openResult => {
    if ((openResult && openResult.notification && openResult.notification.payload 
      && openResult.notification.payload.additionalData && 
      openResult.notification.payload.additionalData.load) && (
        openResult.notification.payload.additionalData.load === "You have a contact request" ||
        openResult.notification.payload.additionalData.load === "sent you a message"
      )
    ){
      return props.navigation.navigate("Chat");
    }
    if (openResult && openResult.notification && openResult.notification.payload 
        && openResult.notification.payload.additionalData && 
        openResult.notification.payload.additionalData.load
      ) {
      // props.navigation.navigate('Notify',{
      //   notification_id : 
      //   openResult.notification.payload.additionalData.load
      // });
      setNotify(openResult.notification.payload.additionalData.load)
    }
  };

  const onIds = device => {
    let fd = {
      notification_id: device.userId,
    };
    updateNotificationId(fd);
  };

  const getNotifications = async () => {
    try{
      apiFunctions.getNotifications(token,user.id,1).then((res)=>{
        updateTotNotification(res.results.no_of_unseen);
      });
    }catch(error){

    }
  }

  const updateNotificationId = async (fd) => {
    let data = Object.values(fd).length > 0 ? fd : {'onboarded':1}
    let res = await apiFunctions.onboarding1(token,user.id,data);
    _updateUser(res);
    storeData('user',res);
  };

  const getQuestions = async () =>{
    try{
      let res = await apiFunctions.getQuestions(token);
      let dismissed = await getData('dismissed');
      setDismissedQue(dismissed || []);
      setQue(res);
    }catch(error){  
    }
  }

  const checkSubscription = async () => {
    const res = apiFunctions.subscriptionStatus(token).then((res)=>{
      _updateSubscriptionStatus(res);
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      if(!notify_id){
        getNotifications();
        checkSubscription();
      }
      // eslint-disable-next-line
      return ()=>{
          getData("source").then((source)=>{
            source && source.cancel()
          })  
      }
    }, []),
  );

  useEffect(()=>{
    OneSignal.init('966e14a3-0f0a-4c35-8eb3-0e12324b3795', {
      kOSSettingsKeyAutoPrompt: false,
      kOSSettingsKeyInAppLaunchURL: false,
      kOSSettingsKeyInFocusDisplayOption: 2,
    });
    OneSignal.inFocusDisplaying(0);
    OneSignal.addEventListener('received', onReceived);
    OneSignal.addEventListener('opened', onOpened);
    OneSignal.addEventListener('ids', onIds);
    if(!notify_id){
      updateNotificationId({});
      loadIceBreakers();
      getQuestions() 
    }
  },[])

  return (
    <React.Fragment>
            {
              notify_id ? (
                  <Notify props={props} notification_id={notify_id} setNotify={setNotify}/>
              ) : (
                <Page backgroundColor={Colors.white} barColor={Colors.black} barIconColor="dark-content">
                  {/* <NewMessageSocket /> */}
                  {/* ANCHOR - HEADER */}
                  <Container height={5}
                    backgroundColor={Colors.black}
                    paddingVertical={2}
                  />
                <Container paddingHorizontal={6} paddingTop={1} backgroundColor={Colors.white} direction="row" horizontalAlignment="space-between">
                  <TouchFeedback paddingRight={2} paddingBottom={2} paddingTop={2} onPress={() => props.navigation.openDrawer()}>
                    <Feather Icon name="menu" size={scaleFont(FONTSIZE.menu)} color={Colors.primary} />
                  </TouchFeedback>
                  <Container direction="row" verticalAlignment="center">
                    <TouchFeedback paddingLeft={2} paddingBottom={2} paddingTop={2} onPress={() => props.navigation.navigate('Search')}>
                      <Feather Icon name="search" size={scaleFont(FONTSIZE.icon)} color={Colors.primary} />
                    </TouchFeedback>
                    <TouchWrap paddingLeft={2} paddingBottom={2} paddingTop={2} onPress={() => {
                      updateSenders(null);
                      props.navigation.navigate('Chat')
                    }}>
                      <Feather Icon name="send" size={scaleFont(FONTSIZE.icon)} color={Colors.primary} />
                      {
                        msg_senders && msg_senders.toString() ? (
                          <Container position="absolute" 
                            backgroundColor={"red"}
                            borderRadius={50}
                            padding={1}
                            width={msg_senders.toString().length > 2 ? 8 : 5.5}
                            marginTop={-1}
                            marginLeft={3}
                            horizontalAlignment="center"
                            verticalAlignment="center"
                          >
                            <H1 color={Colors.white} fontSize={4}>{
                              msg_senders.toString().length > 2 ? '99+' : msg_senders
                            }</H1>
                          </Container>
                        ) : null
                      }
                    </TouchWrap>
                  </Container>
                </Container>
                <Container backgroundColor={Colors.white} flex={1}>
                    <Topics />
                  {
                    <Container 
                      direction="row" 
                      backgroundColor={Colors.white} 
                      paddingHorizontal={6}
                      horizontalAlignment="space-between"
                    >
                      {["Feed","Groups"].map((el, i) => (
                        <Container
                          widthPercent="50%"
                          key={i}
                        >
                          <TouchableNativeFeedback
                            delayPressIn={0}
                            background={TouchableNativeFeedback.Ripple(null, true)}
                            onPress={() => {
                              setCurrent(el);
                            }}>
                            <Container
                              borderBottomWidth={el === current ? 3 : 5}
                              borderColor={el === current ? Colors.primary : Colors.white}
                              horizontalAlignment="center"
                              >
                              <H1 fontSize={10} color={el === current ? Colors.primary : Colors.text}>
                                {el}
                              </H1>
                            </Container>
                          </TouchableNativeFeedback>
                        </Container>
                      ))}
                    </Container>
                  }
                  {
                    current === "Feed" ? (
                      <Feeds page={current} 
                        iceBreakerQuestion={iceBreakerQuestion} 
                        setIceBreakerQuestion={setIceBreakerQuestion}
                        dismisedQue={dismisedQue}
                        setDismissedQue={setDismissedQue}
                        que={que}
                        setQue={setQue}
                      />
                    ) : (
                      <Groups page={current} />
                    )
                  }
                </Container>
              </Page> 
              )
            }
    </React.Fragment>  
  );
};

export default Home;
