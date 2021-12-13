import React, {useState, useEffect} from 'react';
import {Container, Page, TouchWrap, scaleFont, SizedBox, InputWrap,
    ImageWrap,Avatar, Rounded, ScrollArea} from '@burgeon8interactive/bi-react-library';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../helpers/colors';
import {SettingsTabScreen} from '../../helpers/route';
import { H1,LocalAvatar,TouchFeedback } from '../../components/component';
import { useStoreState } from 'easy-peasy';
import { FullImageModal } from '../../components/image_modal';
import { FONTSIZE } from '../../helpers/constants';


const Settings = props => {
  const [show,setShow] = useState(false)
  const [current_image,setCurrentImage] = useState(null);
  const {user} = useStoreState(state=>({
    user : state.userDetails.user
  }))

  const settings  = [
    {
      title : "Account",
      logo : "credit-card",
      navigation : "Account"
    },
    {
      title : "Password Reset",
      logo : "lock",
      navigation : "Reset"
    },
    {
      title : "Privacy",
      logo : "lock",
      navigation : "Privacy"
    },
    {
      title : "Notification Settings",
      logo : "bell",
      navigation : "SetNotification"
    },
  ]
    
  return (
    <>
      <Page barIconColor="light" backgroundColor={Colors.primary}>
        <Container paddingHorizontal={6} paddingTop={6} direction="row" horizontalAlignment="space-between">
            <TouchFeedback paddingRight={2} paddingBottom={2} paddingTop={2} onPress={() => props.navigation.openDrawer()}>
            <Feather Icon name="menu" size={scaleFont(FONTSIZE.menu)} color="#fff" />
            </TouchFeedback>
        </Container>
        <SizedBox height={3} />
        <Container backgroundColor={Colors.white} flex={1} paddingHorizontal={6} borderTopLeftRadius={50} borderTopRightRadius={50}>
            <SizedBox height={3}/>
            <ScrollArea flexGrow={1}>
                <Container direction="row" horizontalAlignment="flex-start" marginBottom={5}>
                  {user.photo ? 
                  <TouchFeedback onPress={()=>{
                    setShow(true)
                    setCurrentImage(user.photo)
                  }}>
                    <Avatar backgroundColor="#efefef" size={13} url={user.photo} />
                  </TouchFeedback> : (
                    <TouchFeedback onPress={()=>{
                      setShow(true)
                      setCurrentImage(null)
                    }}>
                      <LocalAvatar size={13} />
                    </TouchFeedback>
                  )}
                  <SizedBox width={3}/>
                  <Container marginTop={2}>
                    <H1 marginTop={5}>{user.first_name} {user.last_name}</H1>
                  </Container>
                </Container>
                {
                  show && (
                    <FullImageModal setShow={setShow} image={current_image} />
                  )
                }
                  {
                    settings.map((setting,index)=>(
                      <TouchFeedback onPress={()=>props.navigation.navigate(setting.navigation)} key={index}>
                          <Container paddingHorizontal={10} paddingVertical={4} 
                            borderColor={Colors.line} borderRadius={10}
                            borderWidth={1} marginBottom={3}
                          >
                            <Container key={index} direction="row">
                              <Container marginTop={0.3}>
                                <Feather name={setting.logo} size={scaleFont(15)} color={Colors.primary}/>
                              </Container>
                              <SizedBox width={3}/>
                              <H1>{setting.title}</H1>
                            </Container>
                          </Container>
                      </TouchFeedback>
                    ))
                  }
           </ScrollArea>
        </Container>
      </Page>
    </>
  );
};

export default Settings;
