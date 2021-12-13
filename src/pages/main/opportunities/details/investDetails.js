import React, { useEffect } from 'react';
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
import {InvestmentDetailsTabScreen} from '../../../../helpers/route';
import {addEventToCalendar} from '../../../../helpers/add_to_calendar';
import moment from 'moment';
import { Linking } from 'react-native';
import { ToastLong } from '../../../../helpers/utils';
import {apiFunctions} from '../../../../helpers/api';
import {useStoreState,useStoreActions} from 'easy-peasy'


const InvestDetails = ({navigation,route}) => {
  const {opportunity,notification_id} = route.params;
  const {token,seen_notifications} = useStoreState(state => ({
    token : state.userDetails.token,
    seen_notifications : state.notification.seen_notifications
  }));
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
      </Container>
      <SizedBox height={8} />

      <Container backgroundColor={Colors.white} flex={1} borderTopLeftRadius={50} borderTopRightRadius={50}>
        <Container horizontalAlignment="center" flex={1}>
        <Rounded size={45} radius={5} position="absolute" marginTop={-14}>
            <ImageWrap backgroundColor="#efefef" borderRadius={10} elevation={5} url={opportunity.logo} flex={1} />
          </Rounded>
          <SizedBox height={16} />

          <Container flex={1} widthPercent="100%" paddingHorizontal={6}>
            <Container>
                {/* ANCHOR - PROFILE NAME */}
                <Container horizontalAlignment="center" verticalAlignment="center" borderBottomWidth={1} borderColor={Colors.line}>
                  <H1 fontSize={15}>
                    {opportunity.title}
                  </H1>
                  <SizedBox height={1.5}/>
                </Container>
                <SizedBox height={0.5} />
            </Container>
              <SizedBox height={5} />
              <InvestmentDetailsTabScreen />
              <Container>
                {
                  opportunity.status === 'active' && (
                    <Container direction="row" padding={4}>
                        <Container widthPercent="70%">
                            <Button title={
                              opportunity.cta_title ? opportunity.cta_title.toString().toUpperCase() : 'INVEST'
                            } borderRadius={4} backgroundColor={Colors.lightGreen} borderColor={Colors.lightGreen} 
                              onPress={()=>{
                                if(opportunity.investment_type === "real estate" || 
                                  (opportunity.cta_link && 
                                    opportunity.cta_link.length > 0)){
                                  return opportunity.cta_link ? Linking.openURL(opportunity.cta_link) : 
                                  ToastLong("Invalid link provided");
                                }
                                navigation.navigate('BuyUnits',{investment:opportunity})
                              }}
                            />
                        </Container>
                        <Container width="20%" marginLeft={4}>
                          <TouchFeedback
                            onPress={()=>addEventToCalendar(
                              opportunity.title,
                              moment.utc(opportunity.start_date).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                              moment.utc(opportunity.end_date).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                              opportunity.description,
                            )}
                          >
                            <Container paddingRight={5} 
                              padding={2.5}
                              paddingLeft={4}
                              borderWidth={2} 
                              borderColor={Colors.line}
                              borderRadius={3}
                            >
                              <Feather Icon name="calendar" size={scaleFont(25)} color={Colors.black} />
                            </Container>
                          </TouchFeedback>
                        </Container>
                    </Container>
                  )
                }
              </Container>
          </Container>
        </Container>
      </Container>
    </Page>
  );
};

export default InvestDetails;
