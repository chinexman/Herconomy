import React, {useState, useEffect} from 'react';
import {FlatList, Modal} from 'react-native';
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
import {H1, H2, P, LocalAvatar,TouchFeedback} from '../../../../../../components/component';
import OppDetailsHeader from '../../../../../../components/opp_details_header';
import {useStoreState, useStoreActions} from 'easy-peasy';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../../../../helpers/colors';
import { useNavigation } from '@react-navigation/native';
import { getData,storeData } from '../../../../../../helpers/functions';
import { ReloadGroups } from '../../../../../../helpers/global_sockets';
import {ActivityIndicator} from 'react-native';
import {apiFunctions} from '../../../../../../helpers/api';
import {ToastLong, ToastShort} from '../../../../../../helpers/utils';

const MemberBox = ({navigation, member, admins, token, groupID,grp_admins
  ,setAdmins,members,setMembers,setMembersHolder,membersHolder,userD,index
}) => {
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const updateResult = useStoreActions(action => action.resultModel.updateResult);
  let admin = admins.includes(member.id);
  let is_admin = admins.includes(userD.id)
  const [menu,showMenu] = useState(false);
  const makeAdmin = async () => {
    try {
      if(loading){
        return
      }
      setLoading2(true);
      let payload = {
        user_id: member.id,
      };
      let res = await apiFunctions.groupMakeAdmin(token, groupID, payload);
      setAdmins([...grp_admins,member.id]);
      setLoading2(false);
      showMenu(false);
      let fd = {"group_id" : groupID,token : global.token}
      ReloadGroups(fd);
    } catch (err) {
      setLoading2(false);
    }
  };

  const remove = async () => {
    try {
      if(loading2){
        return
      }
      setLoading(true);
      let payload = {
        user_id: member.id,
      };
      let res = await apiFunctions.groupRemoveUser(token, groupID, payload);
      let filtered = membersHolder.filter(mem=>mem.id !== member.id);
      setMembers([...filtered]);
      setMembersHolder([...filtered]);
      storeData(`members-${groupID}`,filtered); 
      let fd = {"group_id" : groupID,token : global.token}
      ReloadGroups(fd);
      ToastLong('User Removed');
      showMenu(false);
      setLoading(false);
    } catch (err) {
      ToastLong("Network Error! Please try again");
      setLoading(false);
    }
  }
  return (
    <TouchWrap
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
              widthPercent={is_admin ? '40%' : '60%'}
              paddingLeft={5}
            >
              <Container borderBottomWidth={0.1} borderBottomColor={Colors.line} marginBottom={1}>
                <H1>
                  {member.first_name} {member.last_name}
                </H1>
              </Container>
              {member.profession && member.profession.length > 0 && (
                <>
                  <P color={Colors.otherText}>{member.profession}</P>
                  <SizedBox height={0.4} />
                </>
              )}
              {member.location && member.location !== '0' && member.location !== '' && member.location.length > 0 && (
                <Container direction="row">
                  <Container paddingTop={0.5}>
                    <Feather name="map-pin" size={scaleFont(10)} color={Colors.black} />
                  </Container>
                  <SizedBox width={1} />
                  <P color={Colors.otherText}>{member.location}</P>
                </Container>
              )}
            </Container>
            {
              is_admin ? (
                <Container widthPercent="30%">
                    {
                    is_admin && !admin ? (
                      <TouchWrap 
                        horizontalAlignment="center"
                        onPress={()=>{
                          showMenu(true)
                        }}
                      >
                        <Feather name="more-horizontal" color={Colors.black} size={scaleFont(10)}/>
                      </TouchWrap>
                    ) : null
                  }
                  {admin ? (
                    <Container marginVertical={2}>
                      <TouchWrap horizontalAlignment="center" disabled={true}>
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
                      </TouchWrap>
                    </Container>
                  ) : null}
            </Container>
              ) : null
            }
          </Container>
          <Modal visible={menu}>
          <Container flex={1} 
            verticalAlignment="center" backgroundColor="#0009"
            paddingHorizontal={10}
          >
            <Container horizontalAlignment="flex-end">
              <TouchWrap onPress={()=>showMenu(false)}>
                <Feather name="x" color={Colors.white} size={scaleFont(10)}/>
              </TouchWrap>
            </Container>
            <H1 color={Colors.white} textAlign="center">
              Make {`${member.first_name} ${member.last_name}`} an admin or remove them from group.
            </H1>
            <Container direction="row" horizontalAlignment="space-evenly" marginTop={3}>
              <TouchWrap onPress={remove}>
                <Container marginTop={2}  
                  backgroundColor="black" 
                  horizontalAlignment="center" 
                  padding={3} 
                  borderRadius={5}>
                  {loading && loading2 === false  ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <P color="white" fontSize={8}>
                      Remove
                    </P>
                  )}
                </Container>
              </TouchWrap>

              <TouchFeedback horizontalAlignment="center" onPress={makeAdmin}>
                <Container
                  marginTop={2}
                  backgroundColor={Colors.lightGreen}
                  horizontalAlignment="center"
                  padding={3}
                  borderRadius={5}>
                  {loading2 && loading ===  false ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <P color="white" fontSize={8}>
                      Make Admin
                    </P>
                  )}
                </Container>
              </TouchFeedback>
            </Container>
          </Container>
        </Modal>
        </Container>
        {
          members.length - 1 === index ? (
            <SizedBox height={20} />
          ) : null
        }
    </TouchWrap>
  );
};

const GroupMembers = ({data}) => {
  const navigation = useNavigation();
  const [membersHolder, setMembersHolder] = useState([]);
  const [members, setMembers] = useState([]);
  const [admins,setAdmins] = useState([]);
  const {groupInfo, token,userD} = useStoreState(state => ({
    groupInfo: state.community.groupInfo,
    token: state.userDetails.token,
    userD : state.userDetails.user
  }));
  const getMembers = async () => {
    let groups = await getData("groups");
    let index = groups.map(grp=>grp.id).indexOf(data.id);
    await storeData(`members-${data.id}`,groups[index].members);
    await storeData(`members-${data.id}`,groups[index].members);
    setAdmins(groups[index].admins);
    setMembers(groups[index].members);
    setMembersHolder(groups[index].members);
  }
  useEffect(() => {
    navigation.addListener("focus",()=>{
      getMembers()
    })
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
    <Container flex={1} backgroundColor={Colors.white}>
      <Container direction="row" width="100%" marginHorizontal={6} marginTop={2}>
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
          width={75}
        />
      </Container>
      <SizedBox height={0.5} />
      {
        admins.includes(userD.id) ? (
          <Container direction="row" horizontalAlignment="space-between" paddingRight={4}>
            <Container paddingHorizontal={5} marginTop={2} marginBottom={2}>
              <H2 color={Colors.links}>Members</H2>
            </Container>
            <TouchFeedback onPress={() => navigation.navigate('GroupRequests', {data})}>
              <Container paddingHorizontal={5} marginTop={2} marginBottom={2} 
              backgroundColor={Colors.primary} borderRadius={5} paddingVertical={0.5}>
                <P color="white" fontSize={8}>
                  Requests
                </P>
              </Container>
            </TouchFeedback>
          </Container>
        ) : null
      }
        <Container padding={2}>
          <Container paddingRight={2}>
            <FlatList
                data={members}
                keyExtractor={item => item.id.toString()}
                renderItem={({item, index}) => <MemberBox 
                key={index}
                member={item} navigation={navigation} 
                admins={admins} 
                token={token}  groupID={groupID} 
                setAdmins={setAdmins}
                grp_admins={admins}
                members={members}
                setMembers={setMembers}
                setMembersHolder={setMembersHolder}
                membersHolder={membersHolder}
                userD={userD} 
                index={index}
              />}
                showsVerticalScrollIndicator={false}
                
            />
          </Container>
        </Container>
    </Container>
  );
};

export default GroupMembers;