import React, {useState, useEffect} from 'react';
import {FlatList} from 'react-native';
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
  InputWrap,
} from '@burgeon8interactive/bi-react-library';
import {ActivityIndicator} from 'react-native';
import {H1, H2, P, LocalAvatar,TouchFeedback} from '../../../../../components/component';
import OppDetailsHeader from '../../../../../components/opp_details_header';
import {useStoreState, useStoreActions} from 'easy-peasy';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../../../helpers/colors';
import {apiFunctions} from '../../../../../helpers/api';
import {ToastLong, ToastShort} from '../../../../../helpers/utils';
import { getData, storeData } from '../../../../../helpers/functions';
import { ReloadGroups } from '../../../../../helpers/global_sockets';

const MemberBox = ({navigation, member, admins, token, groupID,grp_admins
  ,setAdmins,members,setMembers,setMembersHolder,membersHolder,index
}) => {
  const [loading, setLoading] = useState(false);
  const updateResult = useStoreActions(action => action.resultModel.updateResult);
  let admin = admins.includes(member.id);

  const makeAdmin = async () => {
    try {
      setLoading(true);
      let payload = {
        user_id: member.id,
      };
      let res = await apiFunctions.groupMakeAdmin(token, groupID, payload);
      setAdmins([...grp_admins,member.id]);
      setLoading(false);
      let fd = {"group_id" : groupID}
      ReloadGroups(fd);
    } catch (err) {
      setLoading(false);
    }
  };

  const remove = async () => {
    try {
      setLoading(true);
      let payload = {
        user_id: member.id,
      };
      let res = await apiFunctions.groupRemoveUser(token, groupID, payload);
      let filtered = members.filter(mem=>mem.id !== member.id);
      setMembers([...filtered]);
      setMembersHolder([...filtered]);
      storeData("members",filtered); 
      let fd = {"group_id" : groupID}
      ReloadGroups(fd);
      ToastLong('User Removed');
      setLoading(false);
    } catch (err) {
      ToastLong("Network Error! Please try again");
      setLoading(false);
    }
  };
  return (
    <TouchFeedback
        onPress={() => {
          updateResult(member);
          navigation.navigate('Profile', {
            member_info: member,
          });
        }}
      >
        <Container borderColor={Colors.line} borderTopWidth={1}>
          <Container paddingVertical={1} direction="row" key={member.id}>
            <Container padding={2} widthPercent="20%">
              {member.photo === null ? <LocalAvatar size={16} /> : <Avatar size={16} url={member.photo} backgroundColor={Colors.primary} />}
            </Container>
            <Container padding={2} marginRight={8} paddingRight={2}
              widthPercent="40%"
              paddingLeft={5}
            >
              <Container borderBottomWidth={0.1} borderBottomColor={Colors.line} marginBottom={1}>
                <H1>
                  {member.first_name} {member.last_name}
                </H1>
              </Container>
              {member.profession !== null && member.profession.length > 0 && (
                <>
                  <P color={Colors.otherText}>{member.profession}</P>
                  <SizedBox height={0.4} />
                </>
              )}
              {member.location !== null && member.location !== '0' && member.location !== '' && member.location.length > 0 && (
                <Container direction="row">
                  <Container paddingTop={0.5}>
                    <Feather name="map-pin" size={scaleFont(10)} color={Colors.black} />
                  </Container>
                  <SizedBox width={1} />
                  <P color={Colors.otherText}>{member.location}</P>
                </Container>
              )}
            </Container>
            <Container widthPercent="30%">
                  {admin ? (
                      <Container marginVertical={2}>
                          <TouchFeedback horizontalAlignment="center" disabled={true} onPress={() => {}}>
                              <Container
                                  marginTop={2}
                                  widthPercent={75}
                                  backgroundColor={Colors.primary}
                                  horizontalAlignment="center"
                                  padding={1}
                                  borderRadius={5}>
                                  {loading ? (
                                  <ActivityIndicator size="small" color="black" />
                                  ) : (
                                  <P color="white" fontSize={8}>
                                      Admin
                                  </P>
                                  )}
                              </Container>
                          </TouchFeedback>
                      </Container>
                  ) : (
                  <Container>
                      <TouchFeedback horizontalAlignment="center" onPress={remove}>
                      <Container marginTop={2} widthPercent={75} backgroundColor="black" horizontalAlignment="center" padding={1} borderRadius={5}>
                          {loading ? (
                          <ActivityIndicator size="small" color="white" />
                          ) : (
                          <P color="white" fontSize={8}>
                              Remove
                          </P>
                          )}
                      </Container>
                      </TouchFeedback>

                      <TouchFeedback horizontalAlignment="center" onPress={makeAdmin}>
                          <Container
                              marginTop={2}
                              widthPercent={100}
                              backgroundColor={Colors.lightGreen}
                              horizontalAlignment="center"
                              padding={1}
                              borderRadius={5}>
                              {loading ? (
                              <ActivityIndicator size="small" color="white" />
                              ) : (
                              <P color="white" fontSize={8}>
                                  Make Admin
                              </P>
                              )}
                          </Container>
                      </TouchFeedback>
                  </Container>
              )}
            </Container>
          </Container>
        </Container>
        {
          members.length - 1 === index ? (
            <SizedBox height={20} />
          ) : null
        }
    </TouchFeedback>
  );
};

const GroupAdmin = ({navigation, route}) => {
  const [membersHolder, setMembersHolder] = useState([]);
  const [members, setMembers] = useState([]);
  const [admins,setAdmins] = useState([]);
  const {groupInfo, token} = useStoreState(state => ({
    groupInfo: state.community.groupInfo,
    token: state.userDetails.token,
  }));
  const {data} = route.params;
  const getMembers = async () => {
      try{
        let members = await getData("members");
        setMembers(members);
        data && data.admins && setAdmins(data.admins);
        setMembersHolder(members);
      }catch(err){
      }
  }
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getMembers();
    });
    return unsubscribe;
    // eslint-disable-next-line
  }, [navigation]);

  const searchValue = value => {
    let filtered_members = membersHolder.filter(member => {
      return (
        member.first_name && member.first_name.toLowerCase().includes(value.toLowerCase()) ||
        member.last_name && member.last_name.toLowerCase().includes(value.toLowerCase()) ||
        member.profession && member.profession.toLowerCase().includes(value.toLowerCase()) ||
        member.location && member.location.toLowerCase().includes(value.toLowerCase())
      );
    });
    value.length === 0 ? setMembers(membersHolder) : setMembers(filtered_members);
  };
  let groupID = data.id;
  return (
    <Page barIconColor="light-content" backgroundColor={Colors.primary}>
      <Container paddingHorizontal={6} paddingTop={6} direction="row" horizontalAlignment="space-between" verticalAlignment="center">
        <Container direction="row" verticalAlignment="center">
          <TouchFeedback paddingRight={3} onPress={() => navigation.goBack()}>
            <Feather Icon name="chevron-left" size={scaleFont(25)} color="#fff" />
          </TouchFeedback>

          <H1 color="#fff" fontSize={18}>
            Admin
          </H1>
        </Container>
      </Container>

      <SizedBox height={6} />
      <Container flex={1} backgroundColor={Colors.white}>
        <Container direction="row" width="100%" marginHorizontal={6} marginTop={-3} horizontalAlignment="center">
          <InputWrap
            placeholder="Search"
            backgroundColor="#fff"
            flex={1}
            elevation={10}
            paddingTop={2}
            paddingBottom={2}
            paddingLeft={5}
            borderRadius={50}
            onChangeText={value => searchValue(value)}
            width={85}
          />
        </Container>
        <SizedBox height={2} />

        <TouchFeedback onPress={() => navigation.navigate('GroupRequests', {data})}>
          <Container paddingHorizontal={5}>
            <H2 color={Colors.links}>Requests</H2>
          </Container>
        </TouchFeedback>

        <SizedBox height={2} />

        <Container paddingHorizontal={5}>
            <Container paddingRight={2}>
              <FlatList
                data={members}
                keyExtractor={item => item.id.toString()}
                renderItem={({item, index}) => (
                  <MemberBox member={item} navigation={navigation} admins={admins} 
                    token={token} groupID={groupID} 
                    setAdmins={setAdmins}
                    grp_admins={admins}
                    members={members}
                    setMembers={setMembers}
                    setMembersHolder={setMembersHolder}
                    membersHolder={membersHolder}
                    key={index}
                    index={index}
                  />
                )}
                showsVerticalScrollIndicator={false}
              />
            </Container>
          </Container>
      </Container>
    </Page>
  );
};

export default GroupAdmin;