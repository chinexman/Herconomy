import React from 'react';
import {AppPageTitle, H1, H2, P, LocalAvatar,TouchFeedback} from '../../../components/component';
import {Container, Page, TouchWrap, scaleFont, SizedBox, InputWrap, Avatar} from '@burgeon8interactive/bi-react-library';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../helpers/colors';
import {FlatList, Keyboard,ActivityIndicator} from 'react-native';
import {useStoreState,useStoreActions} from 'easy-peasy';
import {apiFunctions} from '../../../helpers/api';
import {ToastShort} from '../../../helpers/utils';
import {useNavigation} from '@react-navigation/native';
import {RequestMessages} from '../../../helpers/sockets';
import {Retry} from '../../../components/retry'
import { ReloadContactInfo } from '../../../helpers/global_sockets';
import { getData, storeData } from '../../../helpers/functions';
import { FONTSIZE } from '../../../helpers/constants';

const MessageBox = ({item, props}) => {
  const navigation = useNavigation();
  const {token,userD} = useStoreState(state => ({
    token : state.userDetails.token,
    userD : state.userDetails.user
  }));
  const [loading,setLoading] = React.useState(false);
  const senMessageRequest = async () => {
    try{
      ToastShort('Sending Chat Request . . .');
      setLoading(true);
      Keyboard.dismiss();
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
      console.log("contact>>>>",contact)
      if(!contact){
        await storeData("contact_info",data);
        await RequestMessages(fd);
        //ReloadContactInfo();
        return props.navigation.navigate('Chat');
      }
      contact.sorted_contacts = [...contact.sorted_contacts,fdata];
      await storeData("contact_info",contact);
      await RequestMessages(fd);
      //ReloadContactInfo();
      props.navigation.navigate('Chat');
    }catch(error){
      console.log("err",error)
      setLoading(false);
      ToastShort('Network Error. Please retry');
    }
  };

  return (
    <TouchFeedback paddingHorizontal={5} paddingVertical={1.5} onPress={()=>{
      if(loading) return;
      senMessageRequest()
    }}>
      <Container direction="row" marginTop={2} verticalAlignment="center">
        <>
          {item.photo ? <Avatar size={9} backgroundColor="#dfdfdf" url={item.photo} /> : <LocalAvatar size={9} />}
          <Container marginLeft={4} flex={1}>
            <H2 fontSize={FONTSIZE.medium}>
              {item.first_name} {item.last_name}
            </H2>
          </Container>

          <Container paddingVertical={1.5}>
            <Feather Icon name="message-circle" size={scaleFont(22)} />
          </Container>
        </>
      </Container>
    </TouchFeedback>
  );
};

const MessageSearch = props => {
  const inputRef = React.useRef(null);
  const [searching, setSearching] = React.useState(false);
  const [keyword, setKeyword] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [contactList, setContactList] = React.useState([]);
  const {token,retry,funcCall} = useStoreState(state => ({
    token : state.userDetails.token,
    retry : state.retryModel.retry,
    funcCall : state.retryModel.funcCall
  }));
  const {updateFunc,updateRetry} = useStoreActions(action=>(
    {
      updateFunc : action.retryModel.updateFunc,
      updateRetry : action.retryModel.updateRetry
    }
  ))
  const [loading, setLoading] = React.useState(true);
  const [members, setMembers] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [searchPage, setSearchPage] = React.useState(1);

  const searchKeyword = (text, num) => {
    setKeyword(text);
    if (text.length > 0) {
      setSearching(true);
      setRefreshing(true);
      //updateRetry(false);
      //updateFunc(searchKeyword);
      let pg = num || 1;
      apiFunctions
        .searchPaidMembers(token, text, pg)
        .then(res => {
          if (res.result.length < 1) {
            return ToastShort('No user found');
          }
          console.log("searchPaidMembers",res)
          let member_list = [...contactList, ...res.result].slice(0,pg * 10)
          pg === 1 ? setContactList([...res.result]) : setContactList(member_list);
          setSearchPage(pg + 1);
        })
        .catch(err => {
            setLoading(false);
            //updateRetry(true);
          }
        );
      setRefreshing(false);
    } else {
      setSearching(false);
    }
  };

  if (props.route.params === 'profile') {
    let {profile} = props.route.params;
    setTimeout(() => {
      setMembers([profile]);
      isSubscribed = false;
    }, 500);
  }

  const getMembers = async num => {
    try {
      setLoading(true);
      updateRetry(false);
      updateFunc(getMembers);
      let pg = num || 1;
      let res = await apiFunctions.paidMembers(token, pg);
      console.log("paidMember>>",res)
      let member_list = [...members, ...res.result].slice(0,pg * 10);
       pg === 1 ? setMembers([...res.result]) : setMembers(member_list);
      setPage(pg + 1);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      updateRetry(true);
    }
  };

  React.useEffect(()=>{
    inputRef.current.focus();
    getMembers(1);
  },[retry]);

  return (
    <Page barIconColor="light" backgroundColor={Colors.primary}>
      <Container paddingHorizontal={6} paddingTop={6} direction="row" horizontalAlignment="flex-start" verticalAlignment="center">
        <TouchFeedback paddingRight={3} onPress={() => props.navigation.goBack()}>
          <Feather Icon name="chevron-left" size={scaleFont(25)} color="#fff" />
        </TouchFeedback>

        <H1 color="#fff" fontSize={18}>
          New Chat
        </H1>
      </Container>

      <SizedBox height={6} />

      <Container backgroundColor={Colors.white} flex={1}>
        {/* ANCHOR - Search*/}
        <Container width={88} marginHorizontal={6} marginTop={-3}>
          <InputWrap
            refValue={inputRef}
            placeholder="Search to start new chat"
            backgroundColor="#fff"
            flex={1}
            elevation={10}
            paddingTop={2}
            paddingBottom={2}
            paddingLeft={5}
            borderRadius={50}
            value={keyword}
            onChangeText={text => searchKeyword(text, 1)}
          />
        </Container>

        {/* ANCHOR - CONTENT */}
        <Container marginTop={1.5} marginBottom={4}>

          <FlatList
            data={keyword.length > 0 ? contactList : members}
            extraData={keyword.length > 0 ? contactList : members}
            renderItem={({item,index}) => <MessageBox item={item} props={props} index={index}/>}
            refreshing={refreshing}
            onRefresh={() => (searching ? searchKeyword(keyword, 1) : getMembers(1))}
            onEndReachedThreshold={0.3}
            onEndReached={() => (!searching ? getMembers(page) : searchKeyword(keyword, searchPage))}
          />
          {loading && <ActivityIndicator size="large" color={Colors.primary} />}
        </Container>
      </Container>
      {
        retry ? (
          <Retry funcCall={funcCall} param={keyword.length > 0 ? [keyword, searchPage] : [page]}/>
        ) : null
      }
    </Page>
  );
};

export default MessageSearch;
