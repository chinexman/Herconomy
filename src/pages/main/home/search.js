import React, {useState, useEffect} from 'react';
import {AppPageTitle, H1, H2, P,Button, LocalAvatar, TouchFeedback} from '../../../components/component';
import {Container, Page, TouchWrap, scaleFont, SizedBox, InputWrap, Avatar} from '@burgeon8interactive/bi-react-library';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../helpers/colors';
import {FlatList} from 'react-native-gesture-handler';
import {apiFunctions} from '../../../helpers/api';
import {ActivityIndicator} from 'react-native';
import {useStoreActions,useStoreState} from 'easy-peasy';
import { ToastLong,ToastShort } from '../../../helpers/utils';
import { Retry } from '../../../components/retry';

const UserBox = ({navigation,member}) => {
  const updateResult = useStoreActions(action=>action.resultModel.updateResult)
  return(
      <TouchFeedback
        onPress={()=>{
          updateResult(member);
          navigation.navigate('Profile',{
            member_info:member
          })
        }}
      >
          <Container borderColor={Colors.line} borderTopWidth={1}>
              <Container padding={5} direction="row" key={member.id}>
                  <Container padding={2} widthPercent="30%">
                      {
                          member.photo === null ? 
                          <LocalAvatar size={17} /> : <Avatar size={17} url={member.photo} backgroundColor={Colors.primary} />
                      }
                  </Container>
                  <Container padding={2} marginRight={6} paddingRight={5} widthPercent="70%">
                      <Container
                         marginBottom={2}
                      >
                        <H1 numberOfLines={1}>{member.first_name} {member.last_name}</H1>
                      </Container>
                      {
                        member.profession !== null && member.profession.length > 0 && (
                          <>
                              <P color={Colors.otherText}>{member.profession}</P>
                              <SizedBox height={0.7} />
                          </>
                        )
                      }
                      {
                        member.location !== null && member.location.length > 0 && (
                          <Container direction="row">
                              <Container paddingTop={0.5}>
                                  <Feather name="map-pin" size={scaleFont(10)} color={Colors.black} />
                              </Container>
                              <SizedBox width={1} />
                            <P color={Colors.otherText}>{member.location}</P>
                          </Container>
                        )
                      }
                  </Container>
              </Container>
          </Container>
      </TouchFeedback>
  )
}
const Search = props => {

  const getMembersByFilter = async (sort, filter_name) => {
    try {
      setLoading(true);
      showRetry(false);
      setFilterBy(filter_name);
      let pg = filter_name === filter_by ? page : 1;
      let res = await apiFunctions.getMembers(token, sort, pg);
      console.log("getMembersByFilter",res,filter_name)
      setPage(pg + 1);
      if (filter_name === filter_by) {
        setMembers([...members, ...res.result]);
        // setHoldMembers([...members, ...res.result]);
      } else {
        setMembers(res.result);
        // setHoldMembers(res.result);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if(error.msg && error.msg.detail && error.msg.detail === "Invalid page."){
        showRetry(true);
        return;
      }
      showRetry(true);
    }
  };

  const token = useStoreState(state => state.userDetails.token);
  const inputRef = React.useRef(null);
  const [members, setMembers] = useState([]);
  const [hold_members, setHoldMembers] = useState([]);
  const [filter_by, setFilterBy] = useState('all');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [searching, setSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [contactList, setContactList] = useState([]);
  const [retry,showRetry] = useState(false);

  const searchKeyword = (text, num) => {
    setKeyword(text);
    if (text.length > 0) {
      showRetry(false);
      setSearching(true);
      setRefreshing(true);
      setLoading(true);
      let pg = num || 1;
      apiFunctions
        .searchUser(token, text, pg)
        .then(res => {
          setLoading(false);
          if (res.result.length < 1) {
            return ToastShort('No user found');
          }
          console.log("res><<<<",res,text);
          pg === 1 ? setContactList([...res.result]) : setContactList([...contactList, ...res.result]);
          setSearchPage(pg + 1);
        })
        .catch(error => {
          setLoading(false);
          if(error.msg && error.msg.msg && error.msg.msg.details && error.msg.msg.details === "Invalid page."){
            showRetry(false);
            return;
          }
          showRetry(true);
        });
      setRefreshing(false);
    } else {
      setSearching(false);
      setRefreshing(false);
      setLoading(false);
      setLoading(false);
    }
  };


  useEffect(()=>{
    const unsubscribe = props.navigation.addListener('focus', () => {
      getMembersByFilter('','all');
    });
    return unsubscribe;
  },[
    props.navigation
  ]);
  return (
    <Page barIconColor="light" backgroundColor={Colors.primary}>
      <Container paddingHorizontal={6} paddingTop={6} direction="row" horizontalAlignment="space-between" verticalAlignment="center">
        <Container direction="row" verticalAlignment="center">
          <TouchWrap paddingRight={3} onPress={() => props.navigation.goBack()}>
            <Feather Icon name="chevron-left" size={scaleFont(25)} color="#fff" />
          </TouchWrap>

          <H1 color="#fff" fontSize={18}>
            Search
          </H1>
        </Container>
      </Container>

      <SizedBox height={6} />

      <Container backgroundColor={Colors.white} flex={1} paddingHorizontal={6}>
        {/* ANCHOR - Search*/}
        <Container position="absolute" width={88} marginHorizontal={6} marginTop={-3}>
          <InputWrap
            refValue={inputRef}
            placeholder="By name, location, title"
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
        <Container marginTop={1} />
        <Container marginTop={10} widthPercent="100%">
            <Container direction="row" horizontalAlignment="space-between">
                <TouchWrap widthPercent="25%" onPress={()=>{
                  getMembersByFilter('','all');
                }}>
                  <Container backgroundColor={filter_by === 'all' ? Colors.primary : Colors.lightGrey} 
                      padding={2} marginRight={1.5} borderRadius={5}>
                      <H1 color={filter_by === 'all' ? Colors.white : Colors.black} textAlign="center" fontSize={scaleFont(4)}>All</H1>
                  </Container>
                </TouchWrap>
                <TouchWrap
                  onPress={()=>{
                    getMembersByFilter('newest','newest');
                  }}
                  widthPercent="25%"
                >
                  <Container backgroundColor={filter_by === 'newest' ? Colors.primary : Colors.lightGrey} 
                      padding={2} marginRight={1.5} borderRadius={5}>
                      <H1 color={filter_by === 'newest' ? Colors.white : Colors.black} textAlign="center" fontSize={scaleFont(4)}>Newest</H1>
                  </Container>
                </TouchWrap>
                <TouchWrap
                  onPress={()=>{
                    getMembersByFilter('top','top');
                  }}
                  widthPercent="25%"
                >
                  <Container backgroundColor={filter_by === 'top' ? Colors.primary : Colors.lightGrey} 
                  padding={2} marginRight={1.5} borderRadius={5}>
                      <H1 color={filter_by === 'top' ? Colors.white : Colors.black} textAlign="center" fontSize={scaleFont(4)}>Top</H1>
                  </Container>
                </TouchWrap>
                <TouchWrap
                  onPress={()=>{
                    getMembersByFilter('nearest','nearest');
                  }}
                  widthPercent="25%"
                >
                  <Container backgroundColor={filter_by === 'nearest' ? Colors.primary : Colors.lightGrey} 
                  padding={2} marginRight={1.5} borderRadius={5}>
                      <H1 color={filter_by === 'nearest' ? Colors.white : Colors.black} textAlign="center" fontSize={scaleFont(4)}>Nearest</H1>
                  </Container>
                </TouchWrap>
            </Container>
        </Container>
        <SizedBox height={5}/>
          {loading && (
            <Container paddingLeft={5}>
              <P color={Colors.black}>Loading ...</P>
             
              <SizedBox height={5} />
            </Container>)}
            <FlatList
              showsVerticalScrollIndicator={false}
              data={keyword.length > 0 ? contactList : members}
              extraData={keyword.length > 0 ? contactList : members}
              renderItem={({item, index}) => <UserBox member={item} {...props} />}
              keyExtractor={item => item.id}
              refreshing={loading}
              onRefresh={() => searching ? searchKeyword(keyword, 1) : getMembersByFilter(filter_by === 'all' ? '' : filter_by, filter_by)}
              onEndReached={() =>
                searching ? searchKeyword(keyword, searchPage) : getMembersByFilter(filter_by === 'all' ? '' : filter_by, filter_by)
              }
            />
      </Container>
      {
        retry ? (
          <Retry funcCall={searching ? searchKeyword : getMembersByFilter} 
            param={searching ? [keyword, searchPage] : [filter_by === 'all' ? '' : filter_by, filter_by]} 
          />
        ) : null
      }
    </Page>
  );
};

export default Search;
