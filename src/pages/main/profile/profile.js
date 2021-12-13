import React, {useEffect,useState} from 'react';
import {AppPageBack, H1, H2, P, TouchFeedback} from '../../../components/component';
import {FeedBox} from '../home/feeds/feeds';
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
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../helpers/colors';
import {useStoreState, useStoreActions} from 'easy-peasy';
import AboutMe from './aboutMe';
import MyPost from './myPost';
import {Linking} from 'react-native';
import {getData, storeData} from '../../../helpers/functions';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ReloadContactInfo } from '../../../helpers/global_sockets';
import { RequestMessages } from '../../../helpers/sockets';
import { ToastShort } from '../../../helpers/utils';
import { useFocusEffect } from '@react-navigation/core';
import { FONTSIZE } from '../../../helpers/constants';


const socials = [
  require('../../../../assets/img/icons/Facebook.png'),
  require('../../../../assets/img/icons/LinkedIn.png'),
  //require('../../../../assets/img/icons/Gmail.png'),
  require('../../../../assets/img/icons/Twitter.png'),
];

const Profile = props => {
  const {userD} = useStoreState(state => ({
    userD: state.userDetails.user,
  }));

  const {_updateUser} = useStoreActions(actions => ({
    _updateUser: actions.userDetails.updateUser,
  }));

  const [socialLinks, setSocialLinks] = React.useState([
    {icon: socials[0], link: "facebook_id"},
    {icon: socials[1], link: "linkedin_id"},
    //{icon: socials[2], link: "email"},
    {icon: socials[2], link: "twitter_id"},
  ]);
  const [friends,setFriends] = useState([])
  const socialClick = (index, type) => {
    let link = type === "email" ? userD.email : 
    type === "linkedin_id" ? userD.linkedin_id : 
    type === "facebook_id" ? userD.facebook_id : 
    type === "twitter_id" ? userD.twitter_id : null;
    link ? Linking.openURL(link) : null;
  };
  const [current,setCurrent] = React.useState("about");
  const about = props.route.params === undefined ? userD : props.route.params.member_info;
  const sendMessageRequest = async (item) => {
    try{
      ToastShort('Sending Chat Request . . .');
      let fd = {user_id: item.id,token : global.token};
      let contact = await getData("contact_info");
      let fdata = {
        user : item,
        type : "pending"
      }
      let data = {
        contacts: [],
        is_a_contact: false,
        is_a_request: false,
        messages : "",
        received_requests : [],
        sent_requests : [],
        un_read_messages : 0,
        user: userD,
        sorted_contacts : [fdata]
      }
      if(!contact){
        await storeData("contact_info",data);
        await RequestMessages(fd);
        ReloadContactInfo();
        return props.navigation.navigate('Chat');
      }
      contact.sorted_contacts = [...contact.sorted_contacts,fdata];
      await storeData("contact_info",contact);
      await RequestMessages(fd);
      ReloadContactInfo();
      props.navigation.navigate('Chat');
    }catch(error){
    }
  };
  useFocusEffect(
    React.useCallback(()=>{
      getFriends();
    },[])
  )
  const getFriends = async () => {
    try{
      let friends = await getData("contact_info");
      let friend_ids = friends && friends.sorted_contacts ? friends.sorted_contacts.map(item=>item.user.id) : []
      setFriends(friend_ids);
    }catch(err){
    }
  }
  
  useEffect(()=>{
    getFriends();
  },[])
  return (
    <Page barIconColor="light" backgroundColor={Colors.primary}>
      <Container paddingHorizontal={6} paddingTop={6} direction="row" verticalAlignment="center">
        <TouchFeedback paddingRight={7} paddingTop={3} paddingBottom={3} onPress={() => props.navigation.goBack()}>
          <Feather Icon name="chevron-left" size={scaleFont(25)} color="#fff" />
        </TouchFeedback>
        <H1 fontSize={16} color="#fff">
          Profile
        </H1>
      </Container>

      <SizedBox height={8} />
      {
        props.route.params === undefined && (
            <Container horizontalAlignment="flex-end" paddingRight={8} marginBottom={1}>
              <TouchFeedback 
                paddingRight={3} onPress={() => props.navigation.navigate('ProfileEdit')}>
                <Container direction="row">
                  <P fontSize={10} color={Colors.white}>Edit Profile</P>
                  <SizedBox width={2}/>
                  <Feather name="edit" size={scaleFont(15)} color={Colors.white}/>
                </Container>
              </TouchFeedback>
            </Container>
        ) 
      }
      <Container backgroundColor={Colors.white} flex={1} borderTopLeftRadius={50} borderTopRightRadius={50}>
      
        <Container horizontalAlignment="center" flex={1}>
          <Rounded size={20} radius={5} position="absolute" marginTop={-7}>
            <ImageWrap backgroundColor="#efefef" borderRadius={10} elevation={5} url={
                props.route.params === undefined ? userD.photo : props.route.params.member_info.photo
            } 
            height={15} fit="cover"/>
          </Rounded>
          <SizedBox height={7} />

          <Container flex={1} widthPercent="100%" paddingHorizontal={6}>
            <ScrollArea flexGrow={1}>
              <Container horizontalAlignment="center">
                {/* ANCHOR - PROFILE NAME */}

                <Container verticalAlignment="center" direction="row">
                  <H2 fontSize={FONTSIZE.page}>
                    {props.route.params === undefined ? userD.first_name : props.route.params.member_info.first_name} {props.route.params === undefined ? userD.last_name : props.route.params.member_info.last_name}
                  </H2>
                  <SizedBox width={2} />
                </Container>
                <SizedBox height={0.5} />

                <P fontSize={8} color={Colors.greyBase900}>
                  {props.route.params === undefined ? userD.job_title : props.route.params.member_info.job_title}
                  {" "}@{" "}
                  {props.route.params === undefined ? userD.company_name : props.route.params.member_info.company_name}
                </P>
                <SizedBox height={0.5} />

                <Container verticalAlignment="center" direction="row">
                  <Feather name="map-pin" size={scaleFont(10)} />
                  <SizedBox width={1} />
                  <H2 fontSize={FONTSIZE.medium}>{props.route.params === undefined ? userD.location != 0 ? userD.location : "" :
                   props.route.params.member_info.location !== 0 ? props.route.params.member_info.location : ""}</H2>
                </Container>

                <SizedBox width={3} />
                <H2 fontSize={FONTSIZE.medium}>{props.route.params === undefined ? userD.nationality : props.route.params.member_info.nationality}</H2>
              </Container>
              {console.log("friends>>",friends)}
              {props.route.params && props.route.params.member_info && props.route.params.member_info.id !==  userD.id &&
                !friends.includes(props.route.params.member_info.id)
              ? (
                <TouchFeedback
                  horizontalAlignment="center"
                  onPress={() => sendMessageRequest(props.route.params.member_info)}>
                  <Container
                    marginTop={2}
                    widthPercent="30%"
                    backgroundColor={Colors.primary}
                    horizontalAlignment="center"
                    padding={2}
                    borderRadius={5}>
                    <P color="white" fontSize={10}>
                      Say Hello
                    </P>
                  </Container>
                </TouchFeedback>
              ) : null}
              {/* ANCHOR - PROFILE ICONS */}
              {
                  props.route.params === undefined && (
                    <Container
                        horizontalAlignment="center"
                        verticalAlignment="center"
                        direction="row"
                        paddingVertical={1}
                        paddingBottom={2.5}
                        marginTop={2.5}
                        borderBottomWidth={1}
                        borderColor={Colors.line}>
                        {socialLinks.map((el, i) => (
                          <TouchFeedback key={i} onPress={() => socialClick(i, el.link)}>
                            <Rounded backgroundColor="#ededed" size={6} marginRight={1.5} marginLeft={1.5}>
                              <ImageWrap source={el.icon} height={3.5}/>
                            </Rounded>
                          </TouchFeedback>
                        ))}
                    </Container>
                  )
              }
              {/* ANCHOR - PROFILE DESC */}
              <Container
                horizontalAlignment="center"
                verticalAlignment="center"
                direction="row"
                paddingVertical={1}
                paddingBottom={2.5}
                marginTop={2.5}
                borderBottomWidth={1}
                borderColor={Colors.line}>
                <P textAlign="center" fontSize={FONTSIZE.medium} lineHeight={20} color={Colors.greyBase600}>
                  {props.route.params === undefined ? userD.bio : props.route.params.member_info.bio}
                </P>
              </Container>

              {/* ANCHOR - PROFILE TABS */}
              <SizedBox height={4} />
              <Container direction="row" 
                horizontalAlignment="space-between"
              >
                <Container widthPercent="50%"
                  borderBottomWidth={current === "about" ? 3 : 0}
                  borderColor={Colors.primary}
                >
                  <TouchFeedback onPress={()=>setCurrent("about")}>
                    <H1 
                      textAlign="center"
                      color={current === "about" ? Colors.primary : Colors.black}
                    >About Me</H1>
                  </TouchFeedback>
                </Container>
                <Container widthPercent="50%"
                    borderBottomWidth={current === "posts" ? 3 : 0}
                    borderColor={Colors.primary}
                >
                  <TouchFeedback onPress={()=>setCurrent("posts")}>
                    <H1 textAlign="center">Posts</H1>
                  </TouchFeedback>
                </Container>
              </Container>
              {
                current === "about" ? (
                  <AboutMe about_me={about}/>
                ) : (
                  <MyPost about_me={about}/>
                )
              }
              <SizedBox height={5} />
            </ScrollArea>
          </Container>
        </Container>
      </Container>
    </Page>
  );
};

export default Profile;
