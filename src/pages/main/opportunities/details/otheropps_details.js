import React,{useState,useEffect} from 'react';
import {
  Page,
  Container,
  TouchWrap,
  SizedBox,
  scaleFont,
  Rounded,
  ImageWrap
} from '@burgeon8interactive/bi-react-library';
import {Button,TouchFeedback} from '../../../../components/component';
import Colors from '../../../../helpers/colors';
import Feather from 'react-native-vector-icons/Feather';
import {OtherOppsDetailsTabScreen} from '../../../../helpers/route';
import {apiFunctions} from '../../../../helpers/api';
import {ToastShort, ToastLong} from '../../../../helpers/utils';
import {ActivityIndicator,TouchableOpacity, Linking} from 'react-native';
import {useStoreState,useStoreActions} from 'easy-peasy';
import {addEventToCalendar} from '../../../../helpers/add_to_calendar';
import moment from 'moment';

const OtherOppsDetails = ({navigation,route}) => {
  
  let {opportunity,tabname,showButtons,notification_id} = route.params;
  const {token,seen_notifications} = useStoreState(state => ({
    token: state.userDetails.token,
    token : state.userDetails.token,
    seen_notifications : state.notification.seen_notifications
  }));
  const navigateTo = tabname === 'loans' || tabname === 'grants' || tabname === 'scholarships' ? "FundApplication" : "JobApplication";
  const likeUnlikeOpportunity = async () => {
    try{
      let oppGroup = tabname === 'jobs' ? 'jobs' : 'scholarships';
      if(tabname === 'loans' || tabname === 'grants'){
          oppGroup = 'funds';
      }
      let res = isLoved ? await apiFunctions.unlikeOppOperation(token,new_opp.id,oppGroup) :
       await apiFunctions.likeOppOperation(token,new_opp.id,oppGroup);
      setLoved(res.liked);
      setLoading(false);
    }catch(error){
      ToastShort("Please check your internet and try again");
    }
  }
  const new_opp = opportunity.oppo !== undefined ? opportunity.oppo :  opportunity;
  const {updateSeen} = useStoreActions(actions => ({
    updateSeen : actions.notification.updateSeen
  }));
  const [isLoved,setLoved] = useState(new_opp.liked);
  const [isLoading,setLoading] = useState(false);

  useEffect(()=>{
    if(notification_id){
      apiFunctions.markAsSeen(token,notification_id);
    }
    if(notification_id && seen_notifications && !seen_notifications.includes(notification_id)){
      global.tot_notifications = global.tot_notifications - 1;
      let notification = [...seen_notifications,notification_id]
      updateSeen(notification)
    }
  },[])

  return (
    <Page barIconColor="light" backgroundColor={Colors.primary}>
      <Container paddingHorizontal={6} paddingTop={6} direction="row" verticalAlignment="center">
        <TouchFeedback paddingRight={5} paddingTop={1.5} paddingBottom={1.5} onPress={() => navigation.goBack()}>
          <Feather Icon name="chevron-left" size={scaleFont(25)} color="#fff" />
        </TouchFeedback>
      </Container>
      <SizedBox height={8} />
      <Container backgroundColor={Colors.white} flex={1} borderTopLeftRadius={50} borderTopRightRadius={50}>
        <Container horizontalAlignment="center" flex={1}>
          <Rounded size={45} radius={5} position="absolute" marginTop={-14}>
            <ImageWrap backgroundColor="#efefef" borderRadius={10} elevation={5} 
            url={new_opp.banner ? new_opp.banner : new_opp.logo} flex={1} fit="cover"/>
          </Rounded>
          <SizedBox height={13} />
          <Container flex={1} widthPercent="100%" paddingHorizontal={6}>
              <SizedBox height={5} />
              <OtherOppsDetailsTabScreen tabname={tabname}/>

              {
                  showButtons && (
                    <Container direction="row" padding={5} horizontalAlignment="center">
                    <TouchFeedback
                    onPress={()=>{
                      likeUnlikeOpportunity()
                    }}
                    >
                       <Container 
                        paddingVertical={2.3} 
                        borderWidth={2} 
                        borderColor={Colors.lightGrey}
                        padding={4}
                        borderRadius={5}
                      >
                       {
                          isLoved && !isLoading && (
                            <ImageWrap width={6} height={3}  source={require('../../../../../assets/img/icons/love.png')} fit="contain" />
                          ) 
                        }
                        {
                          !isLoved && !isLoading &&(
                            <Feather Icon name="heart" size={scaleFont(18)} color={Colors.primary} />
                          )
                        }
                        {
                          isLoading &&(
                            <ActivityIndicator size="small" color={Colors.primary}  />
                          )
                        }
                       </Container>
                     </TouchFeedback>
                     <SizedBox width={3}/>
                     <TouchFeedback
                    onPress={()=>{
                      addEventToCalendar(
                        new_opp.title,
                        moment.utc(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                        moment.utc(new Date(new_opp.end_date)).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                        new_opp.description ? new_opp.description : new_opp.eligibility
                      )
                    }}
                    >
                       <Container 
                        paddingVertical={2.3} 
                        borderWidth={2} 
                        borderColor={Colors.lightGrey}
                        padding={4}
                        borderRadius={5}
                      >
                        <Feather Icon name="calendar" size={scaleFont(16)} color={Colors.primary} />
                       </Container>
                     </TouchFeedback>
                     <SizedBox width={3}/>
                    {
                      new_opp.inapp ? (
                          <Button title="APPLY"
                            backgroundColor={Colors.primary} 
                            borderColor={Colors.primary}
                            widthPercent="50%"
                            borderRadius={5}
                            onPress={()=>navigation.navigate(navigateTo,{new_opp,tabname})}
                          />
                      ):(
                        <Button title="APPLY"
                            backgroundColor={Colors.primary} 
                            borderColor={Colors.primary}
                            widthPercent="50%"
                            borderRadius={5}
                            onPress={()=>new_opp.link ? Linking.openURL(new_opp.link) : ToastLong("Invalid link provided")}
                          />
                      )
                    }
                  </Container>

                  )
              }
          </Container>
        </Container>
      </Container>
    </Page>
  );
};

export default OtherOppsDetails;
