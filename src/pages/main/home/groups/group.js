import React, {useState, useEffect, useCallback} from 'react';
import {
  Container,
  TouchWrap,
  SizedBox,
  Avatar,
  scaleFont,
  InputWrap,
  Height,
  Rounded,
  ImageWrap,
  ScrollAreaRefresh,
} from '@burgeon8interactive/bi-react-library';
import Colors from '../../../../helpers/colors';
import {useStoreActions, useStoreState} from 'easy-peasy';
import {ScrollView} from 'react-native';
import {LocalAvatar, H2, P, H1, Button, GrpPlaceholder, TouchFeedback} from '../../../../components/component';
import Feather from 'react-native-vector-icons/Feather';
import numeral from 'numeral';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {ReloadGroups} from '../../../../helpers/global_sockets';
import { apiFunctions } from '../../../../helpers/api';
import {Retry} from '../../../../components/retry';
import { storeData } from '../../../../helpers/functions';
import { FONTSIZE } from '../../../../helpers/constants';

export const TopicBoxOne = props => {
  let data = props.data;
  return (
    <>
      <TouchFeedback onPress={props.onPress}>
        <Container direction="row" horizontalAlignment="space-between" verticalAlignment="center">
          <Container direction="row" verticalAlignment="center" paddingVertical={1}>
            <Rounded size={8} backgroundColor="#dfdfdf" radius={5} elevation={1}>
              <ImageWrap url={data.thumbnail} borderRadius={8} height={5}/>
            </Rounded>

            <SizedBox width={5} />

            <Container>
              <H2 fontSize={FONTSIZE.medium}>{data.name}</H2>
              <P fontSize={FONTSIZE.small} color={Colors.greyBase600}>
                {numeral(data.members_count).format('0 a')} Members
              </P>
            </Container>
          </Container>
          <Feather Icons name="chevron-right" color={Colors.primary} size={scaleFont(FONTSIZE.icon)} />
        </Container>
      </TouchFeedback>
    </>
  );
};

export const TopicBoxTwo = props => {
  let data = props.data;

  return (
    <Container widthPercent="48%" marginRight={1}>
      <ImageWrap url={data.thumbnail} fit="cover" borderRadius={8} height={23} overlayColor="#00000099">
        {data.closed ||  !props.status ? (
          <Container position="absolute" widthPercent="100%" horizontalAlignment="flex-end" padding={4}>
            <Rounded>
              <Feather Icon name="lock" color="#fff" size={scaleFont(FONTSIZE.icon)} />
            </Rounded>
          </Container>
        ) : null}

        <Container horizontalAlignment="center" verticalAlignment="center" flex={1}>
          <H1 fontSize={FONTSIZE.semiBig} color="#fff" textAlign="center">
            {data.name}
          </H1>
          <P fontSize={FONTSIZE.medium} color="#fff">
            {data.members_count} Members
          </P>

          <SizedBox height={1} />
          <TouchFeedback
            backgroundColor={Colors.primary} 
            width={15} paddingVertical={1} borderRadius={5} 
            onPress={props.onPress}
          >
            <H1 textAlign="center" fontSize={FONTSIZE.medium} color="#fff">
              Join
            </H1>
          </TouchFeedback>
        </Container>
      </ImageWrap>
      <SizedBox height={2} />
    </Container>
  );
};

const Groups = props => {
  const navigation = useNavigation();
  const {userD, subscriptionStatus,token,group_data} = useStoreState(state => ({
    userD: state.userDetails.user,
    token: state.userDetails.token,
    subscriptionStatus: state.userDetails.subscriptionStatus,
    group_data : state.community.group_data
  }));

  const {updateGroupData
  } = useStoreActions(action=>({
    updateGroupData : action.community.updateGroupData
  }));

  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [otherGroups, setOtherGroups] = useState([]);
  const [pendingGroups, setPendingGroups] = useState([]);
  const [clicksUpgrade,setClicksUpgrade] = useState(false);
  const [suggested,setSuggested] = useState([]);
  const [retry,setRetry] = useState(false);
  
  const loadGroups = () => {
    if (group_data && group_data.length < 1) {
      setLoading(true);
    } else {
      setLoading(false);
      setGroups(group_data);
      let myGroupsData = group_data.filter(el => el.is_member === true);
      let otherGroupsData = group_data.filter(el => el.is_member === false && el.request_status === 'no request');
      let pendingGroupsData = group_data.filter(el => el.is_member === false && el.request_status === 'pending');

      setMyGroups(myGroupsData);
      setOtherGroups(otherGroupsData);
      setPendingGroups(pendingGroupsData);
    }
  };

  const suggestedGroups = async () =>{
      try{
        setLoading(true);
        setRetry(false)
        let res = await apiFunctions.getSuggestedGroups(token);
        setSuggested(res);
      }catch(error){
        setLoading(false);
        setRetry(true);
      }
  }

  const refreshData = () =>{
    suggestedGroups();
    loadGroups();
  }

  useEffect(() => {
    //ToastLong('Updating Groups . . .');
    loadGroups();
  }, [group_data]);

  return (
    <>

      <Container backgroundColor={Colors.white} flex={1} paddingHorizontal={6} paddingTop={1}>
        {
          myGroups.length === 0 ? (
            <GrpPlaceholder />
          ) : null
        }
        {
          true ? (
            <Container verticalAlignment="flex-start">
            <ScrollAreaRefresh 
              refreshing={loading}
              onRefresh={()=>{
                ReloadGroups();
                suggestedGroups();
                loadGroups();
              }}
            >
              <>
                {myGroups.length > 0 ? (
                  <>
                    <H2 fontSize={FONTSIZE.big} color={Colors.greyBase300}>
                      My Groups
                    </H2>
                    <SizedBox height={2} />

                    {myGroups.map((el, i) => {
                      return (
                        <TopicBoxOne
                          data={el}
                          onPress={() => {
                            navigation.navigate('GroupDetails', {id: el.id, is_member: el.is_member,data:el})
                          }}
                          key={i}
                        />
                      );
                    })}

                    <Container height={0.1} backgroundColor={Colors.primary} marginVertical={2} />
                  </>
                ) : null}
                {pendingGroups.length > 0 ? (
                  <>
                    <H2 fontSize={FONTSIZE.medium} color={Colors.greyBase300}>
                      Pending Request
                    </H2>

                    <SizedBox height={2} />

                    {pendingGroups.map((el, i) => {
                      return (
                        <TopicBoxOne
                          data={el}
                          onPress={() => {
                            navigation.navigate('GroupDetails', {id: el.id, is_member: el.is_member,data:el})
                          }}
                          key={i}
                        />
                      );
                    })}
                    <Container height={0.1} backgroundColor={Colors.primary} marginVertical={2} />
                  </>
                ) : null}


                {suggested.length > 0 ? (
                  <>
                    <H2 fontSize={FONTSIZE.medium} color={Colors.greyBase300}>
                      Based on your interests
                    </H2>
                    <SizedBox height={2} />
                    <ScrollView horizontal={false} showsHorizontalScrollIndicator={false}>
                      <Container direction="row" wrap="wrap">
                          {suggested.slice(0, 5).map((el, i) => {
                            return (
                              <TopicBoxTwo
                                data={el}
                                onPress={() => {
                                  navigation.navigate('GroupDetails', {id: el.id, is_member: el.is_member,data : el})
                                }}
                                key={i}
                                status={true}
                              />
                            );
                          })}
                      </Container>
                    </ScrollView>
                  </>
                ) : null}

                {otherGroups.length > 0 ? (
                  <>
                    <H2 fontSize={FONTSIZE.semiBig} color={Colors.greyBase300}>
                      All Groups
                    </H2>

                    <SizedBox height={2} />
                    <ScrollView horizontal={false} showsHorizontalScrollIndicator={false}>
                      <Container direction="row" wrap="wrap">
                          {otherGroups.map((el, i) => {
                            return (
                              <TopicBoxTwo
                                data={el}
                                onPress={() => {
                                  navigation.navigate('GroupDetails', {id: el.id, is_member: el.is_member,data : el})
                                }}
                                key={i}
                                status={true}
                              />
                            );
                          })}
                      </Container>
                    </ScrollView>
                  </>
                ) : null}

                <SizedBox height={2} />
                <SizedBox height={2} />
              </>
            </ScrollAreaRefresh>
          </Container>
          ) : (
            <Container paddingHorizontal={6} flex={1} verticalAlignment="center">
              <TouchFeedback onPress={()=>setClicksUpgrade(false)}>
                <H2 textAlign="right">x</H2>
              </TouchFeedback>
              <SizedBox height={3}/>
              <Container horizontalAlignment="center">
                <P color="#0008" textAlign="center" fontSize={FONTSIZE.medium} lineHeight={scaleFont(13)}>
                  Upgrade to a premium plan to unlock access to Groups. Groups allow you to start and join conversations with like-minded women who share the same goals and/or interests.
                </P>
                <SizedBox height={4} />
                <Button title="Upgrade Now" onPress={()=>navigation.navigate('Upgrade')} />
              </Container>
            </Container>
          )
        }
        {console.log("<<-- grp-rendering -->>>",)}
        </Container>
        {
            retry ? (
                <Retry funcCall={refreshData} param={[]} />
            ) : null
        }
    </>
  );
};

export default Groups;
