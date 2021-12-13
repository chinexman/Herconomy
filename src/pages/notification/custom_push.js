import React,{useEffect} from 'react';
import {Container, SizedBox,InputWrap,scaleFont,TouchWrap,Page,ImageWrap} from '@burgeon8interactive/bi-react-library';
import Colors from '../../helpers/colors';
import {H2,P,TouchFeedback} from '../../components/component';
import Feather from 'react-native-vector-icons/Feather';
import { FlatList, Linking } from 'react-native';
// import Video from 'react-native-video';
import {StyleSheet,ActivityIndicator,Modal} from 'react-native';
import { apiFunctions } from '../../helpers/api';
import {useStoreState,useStoreActions} from 'easy-peasy';
import moment from 'moment';



const CustomPush = ({navigation,route}) => {
  const {token,seen_notifications} = useStoreState(state=>({
    token : state.userDetails.token,
    seen_notifications : state.notification.seen_notifications
  }));
  

  const {notification_id,item} = route.params;
  const {updateSeen} = useStoreActions(actions => ({
    updateSeen : actions.notification.updateSeen
  }));

  useEffect(()=>{
    if(notification_id){
      apiFunctions.markAsSeen(token,notification_id);
    }
    if(notification_id && seen_notifications && !seen_notifications.includes(notification_id)){
      global.tot_notifications = global.tot_notifications - 1;
      updateSeen([...seen_notifications,notification_id])
    }
  })
  return (
    <Page barIconColor="light" backgroundColor={Colors.primary}>
        <Container paddingHorizontal={6} paddingTop={6} direction="row" verticalAlignment="center">
            <TouchFeedback paddingRight={5} paddingTop={1.5} paddingBottom={1.5} onPress={() => navigation.goBack()}>
                <Feather Icon name="chevron-left" size={scaleFont(25)} color="#fff" /> 
            </TouchFeedback>
            <H2 fontSize={13} color={Colors.whiteBase}>
                {item.content} {'\n'}
                <P fontSize={8} color={Colors.white}>{moment.utc(item.created_at).format('DD MMM YYYY hh:mm a')}</P>
            </H2>
        </Container>
        <SizedBox height={1} />
        <Container flex={1} paddingHorizontal={6} backgroundColor={Colors.white}
          marginTop={2}
        >
            <SizedBox height={4} />
            <Container flex={1}>
                <P lineHeight={25}>
                    {item.actual_content}
                </P>
                {
                    item.action_id && item.action_id !== "#" && Linking.canOpenURL(item.action_id) ? (
                        <>
                        <SizedBox height={10}/>
                        <TouchFeedback onPress={()=>{
                            Linking.openURL(item.action_id);
                        }}>
                            <P>View More</P>
                        </TouchFeedback>
                        </>
                    ) : null
                }
            </Container>
            <SizedBox height={4} />
        </Container>
    </Page>
  )
};
export default CustomPush;
