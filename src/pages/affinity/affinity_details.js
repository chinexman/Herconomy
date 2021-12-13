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
import {H1,H2,P,Button,TouchFeedback} from '../../components/component';
import Colors from '../../helpers/colors';
import Feather from 'react-native-vector-icons/Feather';
import {AffinityDetailsTabScreen} from '../../helpers/route';
import {addEventToCalendar} from '../../helpers/add_to_calendar';
import {Modal} from 'react-native';
import {apiFunctions} from '../../helpers/api';
import { Capitalize } from '../../helpers/utils';
import {useStoreState,useStoreActions} from 'easy-peasy';

const AffinityDetails = ({navigation,route}) => {
  const [showModal,setShowModal] = useState(false);
  const {data,notification_id} = route.params;
  const name =  data.name || data.partner.name;

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
            <ImageWrap backgroundColor="#efefef" borderRadius={10} elevation={5} url={data.header_image} flex={1} />
          </Rounded>
          <SizedBox height={16} />

          <Container flex={1} widthPercent="100%" paddingHorizontal={6}>
          <Container>
                {/* ANCHOR - PROFILE NAME */}

                <Container horizontalAlignment="center" verticalAlignment="center" borderBottomWidth={1} borderColor={Colors.line}>
                  <Container direction="row">
                    <Avatar 
                      url={data.logo_image}
                    />
                    <SizedBox width={3} />
                    <Container marginTop={1}>
                      <H1 fontSize={15}>
                        {name ? Capitalize(name) : ''}
                      </H1>
                    </Container>
                  </Container>
                  <SizedBox height={1.5}/>
                </Container>
                <SizedBox height={0.5} />
              </Container>
              <SizedBox height={5} />
              <AffinityDetailsTabScreen />
                <Container
                  paddingHorizontal={3}
                  paddingVertical={3}
                  horizontalAlignment="center"
                  verticalAlignment="center"
                >
                  
                  <TouchWrap onPress={()=>setShowModal(true)}>
                      <Container
                        borderBottomWidth={1}
                        borderColor={Colors.black}
                        widthPercent="70%"
                      >
                        <P textAlign="center">Terms and Conditions</P>
                      </Container>
                  </TouchWrap>


                  {
                    showModal && (
                      <Modal visible={showModal} transparent={true} statusBarTranslucent={true}>
                        <ScrollArea flexGrow={1}>
                          <Container flex={1} horizontalAlignment="center" verticalAlignment="center">
                            <Container backgroundColor={Colors.whiteBase} padding={10} borderRadius={10} 
                              widthPercent="90%"
                              borderColor={Colors.line} borderWidth={1}
                            >
                              <Container>
                                <TouchWrap onPress={()=>setShowModal(false)}>
                                  <Container horizontalAlignment="flex-end">
                                    <Feather name="x-circle" size={scaleFont(15)}/>
                                  </Container>
                                </TouchWrap>
                                <Container>
                                  <H1 fontSize={15}>Terms and Conditions</H1>
                                </Container>
                              </Container>
                              <SizedBox height={3}/>
                              <Container>
                                  <P>
                                     {data.tos}
                                  </P>
                              </Container>
                              <SizedBox height={5} />
                            </Container>
                          </Container>
                        </ScrollArea>
                    </Modal>
                    )
                  }
              </Container>
          </Container>
        </Container>
      </Container>
    </Page>
  );
};

export default AffinityDetails;
