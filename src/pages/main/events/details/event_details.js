import React,{useState,useEffect} from 'react';
import {
  Page,
  Container,
  TouchWrap,
  SizedBox,
  scaleFont,
  Rounded,
  ImageWrap,
  Avatar,
  ScrollArea,
} from '@burgeon8interactive/bi-react-library';
import {H1,H2,P,Button,TouchFeedback} from '../../../../components/component';
import Colors from '../../../../helpers/colors';
import Feather from 'react-native-vector-icons/Feather';
import LocationIcon from '../../../../../assets/img/icons/location.png';
import LovedIcon from '../../../../../assets/img/icons/love.png';
import SalaryIcon from '../../../../../assets/img/icons/salary.png';
import SandClockIcon from '../../../../../assets/img/icons/sand_clock.png';
import SuitcaseIcon from '../../../../../assets/img/icons/suitcase.png';
import CalendarIcon from '../../../../../assets/img/icons/calendar.png';
import {Capitalize,ToastShort,ToastLong} from '../../../../helpers/utils';
import moment from 'moment';
import {ActivityIndicator, Alert,Modal,Linking} from 'react-native';
import {useStoreState,useStoreActions} from 'easy-peasy';
import {apiFunctions} from '../../../../helpers/api';
import {addEventToCalendar} from '../../../../helpers/add_to_calendar';
import { FONTSIZE } from '../../../../helpers/constants';

const EventDetails = ({navigation,route}) => {
    const {token,userD} = useStoreState(state => ({
      token: state.userDetails.token,
      userD : state.userDetails.user,
      seen_notifications : state.notification.seen_notifications
    }));
    
    const {eventDetails,notification_id} = route.params;
    const tabName = route.params.tabName;
    const myEvents = route.params.myEvents || [];
    const [clicksReg,setClicks] = useState(false);
    const likeOrUnlikeEvent = async () => {
      try{
        setLoading(true);
        let action = isLoved ? 'unlike' : 'like';
        let res = await apiFunctions.likeOrUnlikeEvent(token,eventDetails.id,action);
        setLoved(res.liked);
        setLoading(false);
      }catch(error){
        ToastShort("Network error. Please retry");
      }
    }
    const [isLoved,setLoved] = useState(eventDetails.liked);
    const [isLoading,setLoading] = useState(false);
    const [btnLoading,setBtnLoading] = useState(false);

    const bookSeats = async () => {
      try{
        let is_registered = myEvents.filter(item=>item.event.id === eventDetails.id).length;

        if(!userD.is_email_verified){
          return Alert.alert('Herconomy','Glad you have come this far, you will need to verify your email to continue')
        }
        if(eventDetails.link && eventDetails.link.length > 1 && eventDetails.link !== "null"){
          return Linking.openURL(eventDetails.link);
        }
        if(eventDetails.registration_link && eventDetails.registration_link.length > 1 && eventDetails.registration_link !== "null"){
          return Linking.openURL(eventDetails.registration_link);
        }
        
        if(is_registered){
          return Alert.alert("Herconomy","You are already registered for this event")
        }

        if(!eventDetails.free && eventDetails.price > 0){
          return navigation.navigate('EventCart',{eventDetails});
        }
        setBtnLoading(true);
        let fd = {
          'units' : 1
        }
        await apiFunctions.bookSeat(token,eventDetails.id,'attend',fd);
        navigation.navigate('Events');
        return Alert.alert('Herconomy','Registration was successful');
      }catch(error){
        setBtnLoading(false);
        return Object.values(error.msg)[0] && Object.values(error.msg)[0][0] ? ToastShort(Object.values(error.msg)[0][0]) : ToastShort('Connection Error. Please try again');
      }
    }

    const {updateSeen} = useStoreActions(actions => ({
      updateSeen : actions.notification.updateSeen
    }));
  
    useEffect(()=>{
      if(notification_id){
        apiFunctions.markAsSeen(token,notification_id);
      }
      if(notification_id  && seen_notifications && !seen_notifications.includes(notification_id)){
        global.tot_notifications = global.tot_notifications - 1;
        updateSeen([...seen_notifications,notification_id])
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
            <ImageWrap backgroundColor="#efefef" borderRadius={10} elevation={5} url={eventDetails.banner} flex={1} />
          </Rounded>
          <SizedBox height={16} />

          <Container flex={1} widthPercent="100%" paddingHorizontal={6}>
                <Container>
                    <Container horizontalAlignment="center" verticalAlignment="center" borderBottomWidth={1} borderColor={Colors.line}>
                        <H1 fontSize={15}>
                            {eventDetails.title && Capitalize(eventDetails.title)}
                        </H1>
                        <SizedBox height={1.5}/>
                    </Container>
                    <SizedBox height={0.5} />
              </Container>
              <SizedBox height={5} />

            {/* Event Details */}
            {
              !clicksReg  && (
                <ScrollArea>
                  <Container direction="row" padding={3}>
                      <Container 
                      widthPercent="20%"
                      verticalAlignment="center"
                      horizontalAlignment="center"
                      >
                          <ImageWrap 
                          source={CalendarIcon}
                          height={3}
                          width={5}
                          />
                      </Container>
                      <Container>
                        <H1>{moment.utc(eventDetails.start_datetime).format('DD MMM YYYY')}</H1>
                        <SizedBox height={0.5}/>
                        <P>{moment.utc(eventDetails.start_datetime).format('ddd, h:mm:ss a')}</P>
                      </Container>
                  </Container>
                  <Container direction="row" padding={3}>
                      <Container 
                        widthPercent="20%"
                        verticalAlignment="center"
                        horizontalAlignment="center"
                      >
                        <ImageWrap 
                          source={LocationIcon}
                          height={3}
                          width={5}
                        />
                      </Container>
                      <Container>
                          <H1>{eventDetails.medium && Capitalize(eventDetails.medium)}</H1>
                          <SizedBox height={0.5}/>
                          {
                            eventDetails.registration_link && eventDetails.registration_link !== "null" ? (
                              <TouchFeedback onPress={()=>Linking.openURL(eventDetails.registration_link)}>
                                <Container direction="row">
                                  <Feather name="link" color={Colors.primary}/>
                                  <P>{eventDetails.registration_link}</P>
                                </Container>
                              </TouchFeedback>
                            ) : null
                          }
                          <P>{eventDetails.address && eventDetails.address !== "null" && Capitalize(eventDetails.address)}</P>
                      </Container>
                  </Container>
                  
                  <Container direction="row" padding={3}>
                  <Container 
                      widthPercent="20%"
                      verticalAlignment="center"
                      horizontalAlignment="center"
                      >
                        <ImageWrap 
                          source={SalaryIcon}
                          height={3}
                          width={5}
                        />
                      </Container>
                      <Container>
                        {
                          eventDetails.free ? (
                            <H1>FREE</H1>
                          ): (
                            <H1>&#x20A6;{Number(eventDetails.price).toLocaleString('en-US')}</H1>
                          )
                        }
                      </Container>
                  </Container>
      
                  <Container padding={3}>
                      <Container horizontalAlignment="center" verticalAlignment="center">
                      </Container>
                      <SizedBox height={0.5} />
                      <Container direction="row" padding={5}>
                          <Container widthPercent="20%">
                          </Container>
                          <Container paddingRight={7}>
                              <P>
                                  {eventDetails.description}	
                              </P>
                          </Container>
                      </Container>
                  </Container>
              </ScrollArea>
              )
            }
            {/* Event Details */}
            {
              clicksReg && (
                <Container paddingHorizontal={6} flex={1} verticalAlignment="center">
                    <TouchFeedback onPress={()=>setClicks(false)}>
                    <H2 textAlign="right">x</H2>
                    </TouchFeedback>
                    <SizedBox height={3}/>
                    <Container horizontalAlignment="center">
                      <H2 color="#0008" textAlign="center" fontSize={FONTSIZE.medium} lineHeight={scaleFont(13)}>
                         {
                           `You are about to register for the event "${eventDetails.title}"`
                         }
                      </H2>
                      <SizedBox height={4} />
                      <Button title="Register" onPress={()=>bookSeats()} loading={btnLoading} />
                    </Container>
                </Container>
              )
            }

  {
    tabName === 'upcomingEvents' && !clicksReg && eventDetails.status !== "close" ? (
        <Container horizontalAlignment={(eventDetails.registration_link && eventDetails.registration_link !== "null") ||
        (eventDetails.link && eventDetails.link !== "null") ? "space-between" : "space-evenly"} direction="row" padding={4}>
                    <Container 
                       width="18%" 
                        marginLeft={4}
                    >
                        <TouchFeedback
                          onPress={()=>likeOrUnlikeEvent()}
                        >
                            <Container
                                padding={2}
                                borderWidth={2} 
                                borderColor={Colors.line}
                                borderRadius={3}
                                horizontalAlignment="center"
                            >

                  {
                     isLoved && !isLoading && (
                        <ImageWrap
                          height={3}
                          source={LovedIcon}
                          fit="contain"
                        />
                     ) 
                   }
                   {
                     !isLoved && !isLoading &&(
                      <Feather Icon name="heart" size={scaleFont(18)} color={Colors.primary} />
                     )
                   }
                   {
                    isLoading && (
                      <ActivityIndicator size="small" color={Colors.primary}  />
                     )
                   }
                                
                                <P fontSize={1}>Interested</P>
                            </Container>
                        </TouchFeedback>
                    </Container>
                        {
                          (eventDetails.registration_link && eventDetails.registration_link !== "null") ||
                          (eventDetails.link && eventDetails.link !== "null")
                            ? (
                              <Container widthPercent="45%"
                              
                              >
                                <Button
                                    onPress={()=>setClicks(true)} 
                                    title={`${eventDetails.registration_link && eventDetails.registration_link !== "null" && eventDetails.free ? "JOIN EVENT" : "REGISTER"}`} borderRadius={4} backgroundColor={Colors.primary} borderColor={Colors.primary} 
                                      
                                />
                              </Container>
                          ) : null
                        }
                        <Container 
                            width="18%" 
                        >
                            <TouchFeedback
                              onPress={()=>addEventToCalendar(
                                eventDetails.title,
                                moment.utc(new Date(eventDetails.start_datetime)).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                                moment.utc(new Date(eventDetails.start_datetime)).add(10,'hour').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                                eventDetails.description
                              )}
                            >
                                <Container
                                    padding={1.6}
                                    borderWidth={2} 
                                    borderColor={Colors.line}
                                    borderRadius={3}
                                    horizontalAlignment="center"
                                >
                                    <Feather Icon name="calendar" size={scaleFont(20)} color={Colors.black} />
                                    <P fontSize={1}>Save to calendar</P>
                                </Container>
                            </TouchFeedback>
                        </Container>
                    </Container>
    ) : null
}

          




                
          </Container>
        </Container>










      </Container>
    </Page>
  );
};

export default EventDetails;
