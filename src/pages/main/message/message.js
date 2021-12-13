import React, {useState,useEffect} from 'react';
import {AppPageTitle, H1, H2, P, LocalAvatar, Button,TouchFeedback, BoxLoader} from '../../../components/component';
import {Container, Page, TouchWrap, scaleFont, SizedBox, InputWrap, Avatar, Rounded} from '@burgeon8interactive/bi-react-library';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../helpers/colors';
import {ActivityIndicator, FlatList} from 'react-native';
import {useStoreState, useStoreActions} from 'easy-peasy';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import { ReloadContactInfo } from '../../../helpers/global_sockets';
import { FullImageModal } from '../../../components/image_modal';
import { ToastLong, ToastShort } from '../../../helpers/utils';
import { DeleteMessages, DeleteRequest } from '../../../helpers/sockets';
import { getData, storeData } from '../../../helpers/functions';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { apiFunctions } from '../../../helpers/api';
import { FONTSIZE } from '../../../helpers/constants';


const MessageBox = ({item,updateResult,props,setShow,setCurrentImage,cancelRequest,index,contacts}) => {
  const navigation = useNavigation();
  return (
    <Container marginTop={3} marginBottom={contacts.length == (index +1) ? 15 : 0} key={index}>
      {item.type === 'contact' ? (
        <TouchFeedback onPress={ async () => {
          if(!item || !item.user || !item.user.id) return
          let msgs = await getData(`msg_${item.user.id}`);
          msgs = msgs && msgs.length > 0 ? [...msgs,...item.unread_message] : item.unread_message;
          await storeData(`msg_${item.user.id}`,msgs)
          navigation.navigate('MessageChat', item.user)
        }}>
          <Container direction="row" verticalAlignment="center">
            {item.user.photo ? <Avatar size={9} backgroundColor="#dfdfdf" url={item.user.photo} /> : <LocalAvatar size={9} />}

            <Container marginLeft={4} flex={1}>
            <Container direction="row">
              <H1 fontSize={FONTSIZE.medium}>
                {item.user.first_name} {item.user.last_name}
              </H1>
                <SizedBox width={1} />
                {
                  item.user.status ? (
                    <Avatar backgroundColor={Colors.primary} 
                      size={1.5}
                    />
                  ) : (
                    <Avatar backgroundColor={Colors.lightGrey} 
                      size={1.5}
                    />
                  )
                }
              </Container>
              <P color={Colors.greyBase600} fontSize={8} numberOfLines={1}>
                {item.last_message.body}
              </P>
            </Container>
            {item && item.unread_message && item.unread_message.length > 0 ? (
              <Rounded size={5} backgroundColor={Colors.button}>
                <H2 color={Colors.buttonText} fontSize={5}>
                  {item.unread_message.length}
                </H2>
              </Rounded>
            ) : null}
          </Container>
        </TouchFeedback>
      ) : (
        <Container direction="row" verticalAlignment="center">
          {item.user.photo ? 
            (
              <TouchFeedback onPress={()=>{
                setShow(true)
                setCurrentImage(item.user.photo)
              }}>
                <Avatar backgroundColor="#efefef" size={10} url={item.user.photo} />
              </TouchFeedback>
            ) : 
            (
              <TouchFeedback onPress={()=>{
                setShow(true)
                setCurrentImage(null)
              }}>
                <LocalAvatar size={9} />
              </TouchFeedback>
            )
          }
          <Container direction="row" verticalAlignment="center" horizontalAlignment="space-between" marginLeft={4} flex={1}>
            <TouchWrap
              onPress={()=>{
                updateResult(item.user);
                navigation.navigate('Profile',{
                    member_info:item.user
                })
              }}
              widthPercent="55%"
            >
            <H2 fontSize={FONTSIZE.medium}>
              {item.user.first_name} {item.user.last_name}
            </H2>
          </TouchWrap>
            <Container widthPercent="20%">
              <H1 fontSize={6} color="red" numberOfLines={1}>
                Pending
              </H1>
            </Container>
            <SizedBox width={5}/>
            <TouchWrap widthPercent="20%"
              onPress={()=>cancelRequest(item.user.id,index)}
            >
              <H1 fontSize={6} color="red" numberOfLines={1}>
                Cancel
              </H1>
            </TouchWrap>
          </Container>
        </Container>
      )}
    </Container>
  );
};

const Message = props => {
  const [reload, setReload] = useState(true);
  const {userD, subscriptionStatus,contact_info,fetch_contact,
    seen_notifications
  } = useStoreState(state => ({
    userD: state.userDetails.user,
    subscriptionStatus: state.userDetails.subscriptionStatus,
    contact_info : state.community.contact_info,
    fetch_contact : state.community.fetch_contact,
    seen_notifications : state.notification.seen_notifications
  }));
  const [loading,setLoading] = useState(true);
  const {updateResult,updateContactInfo,updateSeen} = useStoreActions(action=>(
    {
      updateResult : action.resultModel.updateResult,
      updateContactInfo : action.community.updateContactInfo,
      updateSeen : action.notification.updateSeen
    }
  ))
  
  const [allContacts, setAllContacts] = useState(null);
  const [show,setShow] = useState(false)
  const [current_image,setCurrentImage] = useState(null);
  const [contacts,setContacts] = useState([]);
  const cancelRequest = async (user_id,index) =>{
    try{
      let fd = {
        user_id,
        token : global.token
      }
      let contact = await getData("contact_info");
      contact.sorted_contacts.splice(index,1);
      await storeData("contact_info",contact);
      setAllContacts(contact);
      setContacts(contact.sorted_contacts)
      await DeleteRequest(fd);
      //ReloadContactInfo();
      ToastShort('Pending request canceled');
    }catch(error){
      ToastLong("Network Error. Please try again")
    }
  }
  const notification_id = props.route && props.route.params ? 
  props.route.params.notification_id : null;
  const {_updateFetchContact} = useStoreActions(actions => ({
    _updateFetchContact : actions.community.updateFetchContact
  }));


  const getContacts = async () => {
    try{
      let res = await apiFunctions.getContacts(global.token);
        if(res.message || Array.isArray(res)) {
          await storeData("contact_info",null);
          updateContactInfo(null);
          _updateFetchContact(true)
          return
        }
        let data = res.data;
        let groupArray = [];
        if (data.sent_requests) {
          data.sent_requests.forEach(el => {
            el.type = 'pending';
            groupArray.push(el);
          });
        }
  
        if (data.contacts) {
          let sortedContactArray = data.contacts.sort((x, y) => {
            let a = x.user.first_name.toLowerCase();
            let b = y.user.first_name.toLowerCase();
            return a === b ? 0 : a > b ? 1 : -1;
          });
  
          sortedContactArray.forEach(el => {
            el.type = 'contact';
            groupArray.push(el);
          });
  
          data.sorted_contacts = groupArray;
        }
        await storeData("contact_info",data);
        setAllContacts(data);
        setContacts(data.sorted_contacts)
        setLoading(false);
        updateContactInfo({...data});
        _updateFetchContact(true)
    }catch(err){
    }
  }

  const loadContacts = async () => {
    try{
      let contact_info = await getData("contact_info");
      if(!contact_info) {
        setLoading(false);
        return
      };
      setAllContacts(contact_info);
      setContacts(contact_info.sorted_contacts)
      setLoading(false);
    }catch(err){
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadContacts()
      setTimeout(()=>{
        getContacts();
      },200)
      // eslint-disable-next-line
    }, []))
  
    useEffect(()=>{
      loadContacts();
    },[contact_info])
  useEffect(()=>{
    if(notification_id){
      apiFunctions.markAsSeen(token,notification_id);
    }
    apiFunctions.updateMsgNotification(token);
    if(notification_id  && seen_notifications && !seen_notifications.includes(notification_id)){
      global.tot_notifications = global.tot_notifications - 1;
      updateSeen([...seen_notifications,notification_id])
    }
    _updateFetchContact(false)
  },[])

  return (
    <>
      <Page barIconColor="light" backgroundColor={Colors.primary}>
        <Container paddingHorizontal={6} paddingTop={6} direction="row" horizontalAlignment="space-between">
          <TouchFeedback paddingRight={2} paddingBottom={2} paddingTop={2} onPress={() => props.navigation.goBack()}>
            <Feather Icon name="chevron-left" size={scaleFont(20)} color="#fff" />
          </TouchFeedback>

          <H1 color="#fff" fontSize={16}>
            Messages
          </H1>

          <TouchFeedback paddingLeft={3} paddingBottom={3} onPress={() => true ? props.navigation.navigate('MessageSearch') : props.navigation.navigate('Upgrade')}>
            <Feather Icon name="plus" size={scaleFont(25)} color="#fff" />
          </TouchFeedback>
        </Container>

        <SizedBox height={5} />
        <Container backgroundColor={Colors.white} flex={1} paddingHorizontal={6} borderTopLeftRadius={50} borderTopRightRadius={50}>
          {fetch_contact || allContacts ? (
            <>
              {allContacts && !loading ? (
                <Container flex={1} backgroundColor={Colors.white}>
                  <Container width={88} marginTop={-4}>
                    <InputWrap
                      placeholder="Search"
                      backgroundColor="#fff"
                      flex={1}
                      elevation={10}
                      paddingTop={2}
                      paddingLeft={5}
                      borderRadius={50}
                      onChangeText={(search)=>{
                        let filtered = allContacts && allContacts.sorted_contacts && Array.isArray(allContacts.sorted_contacts) ? allContacts.sorted_contacts.filter(contact=>{
                         return (contact.user && contact.user.first_name && contact.user.first_name.toLowerCase()
                          && contact.user.first_name.toLowerCase().includes(search.toLowerCase())
                          || contact.user && contact.user.first_name && 
                          contact.user.last_name.toLowerCase() &&
                          contact.user.last_name.toLowerCase().includes(search.toLowerCase()))
                        }) : []
                        search && search.trim() === "" ? setContacts(allContacts.sorted_contacts) 
                        : setContacts(filtered);
                      }}
                    />
                  </Container>

                  {/* ANCHOR - MESSAGE LIST */}
                  {(allContacts.received_requests && allContacts.received_requests.length > 0) || (allContacts.sorted_contacts && 
                  allContacts.sorted_contacts.length > 0) ? (
                    <Container marginTop={0}>
                      <SizedBox height={5}/>
                      {allContacts.received_requests.length > 0 ? (
                        <Container>
                          <TouchFeedback onPress={() => props.navigation.navigate('MessageRequest', allContacts.received_requests)}>
                            <H2 color={Colors.links}>
                              {allContacts.received_requests.length} Message{' '}
                              {allContacts.received_requests.length > 1 ? 'Requests' : 'Request'}
                            </H2>
                          </TouchFeedback>
                        </Container>
                      ) : null}
                      {
                        show && (
                          <FullImageModal setShow={setShow} image={current_image} />
                        )
                      }
                      {
                        !fetch_contact ? <BoxLoader /> : null
                      }
                      <FlatList
                        data={contacts}
                        renderItem={({item,index}) => <MessageBox item={item} updateResult={updateResult} 
                          setShow={setShow} setCurrentImage={setCurrentImage} show={show} 
                            props={props}
                            cancelRequest={cancelRequest}
                            index={index}
                            contacts={contacts}
                          />}
                          keyExtractor={item => item.user.id}
                          showsVerticalScrollIndicator={false}
                      />
                    </Container>
                  ) : (
                    <Container flex={1} verticalAlignment="center">
                      <H2 textAlign="center" fontSize={14}>
                        Click '+' above to search for a contact and start a conversation. They will need to accept your request to chat.
                      </H2>
                    </Container>
                  )}
                </Container>
              ) : null}
              {
                !allContacts && !fetch_contact ? (
                  <Container flex={1} verticalAlignment="center">
                    <H2 textAlign="center" fontSize={14}>
                      Click '+' above to search for a contact and start a conversation. They will need to accept your request to chat.
                    </H2>
                  </Container>
                  
                ) : null
              }
            </>
          ) : (
            <React.Fragment>
              {
                [..."12345"].map((item,index)=>(
                  <BoxLoader />
                ))
              }
            </React.Fragment>
          )}
        </Container>
      </Page>
    </>
  );
};

export default Message;
