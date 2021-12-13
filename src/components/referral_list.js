import React, { useEffect,useState } from 'react';
import {
  Page,
  Container,
  TouchWrap,
  SizedBox,
  scaleFont,
} from '@burgeon8interactive/bi-react-library';
import {H1,H2,P,Button,Input,TouchFeedback} from '../components/component';
import Colors from '../helpers/colors';
import Feather from 'react-native-vector-icons/Feather';
import {FlatList, ActivityIndicator} from 'react-native';
import {apiFunctions} from '../helpers/api';
import {useStoreState} from 'easy-peasy';
import { ToastLong, Capitalize } from '../helpers/utils';
import numeral from 'numeral';

const ReferralList = ({navigation,setShowReferrals}) => {
  const {token} = useStoreState(state => ({
    token: state.userDetails.token
  }));
  const [isLoading,setLoading] = useState(true);

  const getReferralInfo = async () => {
    try{
      setLoading(true);
      let res = await apiFunctions.getReferralInfo(token);
      let earnings = res.filter(referred=>referred.amount_paid)
        .map(referred=> referred.amount_paid);
      let totalEarned =  earnings.length > 0 ? earnings.reduce((a,b)=>Number(a)+ Number(b)) : 0;
      let totalReferred = res.length;
      setTotalReferred(totalReferred);
      setTotalEarned(totalEarned);
      setReferrals(res);
      return setLoading(false);
    }catch(error){
      console.log("err",error)
      setLoading(false);
      ToastLong(error.msg);
    }
  }
  const [totalEarned,setTotalEarned] = useState(0);
  const [totalReferred,setTotalReferred] = useState(0);
  const [referrals,setReferrals] = useState([]);
  useEffect(()=>{
    getReferralInfo();
  },[

  ]);

   return(
      <>
        <Container paddingHorizontal={6} paddingTop={6} direction="row" verticalAlignment="center" horizontalAlignment="space-between">
        <TouchFeedback paddingRight={5} paddingTop={1.5} paddingBottom={1.5} onPress={() => navigation.goBack()}>
          <Feather Icon name="chevron-left" size={scaleFont(25)} color="#fff" />
        </TouchFeedback>
        <TouchFeedback onPress={()=>setShowReferrals ? setShowReferrals(false) : navigation.navigate('ReferEarn')}>
          <Feather name="settings" size={scaleFont(18)} color={Colors.white} />
        </TouchFeedback>
      </Container>
      <SizedBox height={4}/>
      <Container paddingHorizontal={7} horizontalAlignment="center">
          <H1 fontSize={26} color={Colors.white}>&#x20A6;{numeral(totalEarned).format('0,0.00')}</H1>
          <P color={Colors.white}>Total Earnings</P>
          <Container direction="row" marginTop={1}>
              <P fontSize={10} color={Colors.white}>Total Referred:</P>
              <H1 fontSize={10} color={Colors.white}> {totalReferred}</H1>
          </Container>
      </Container>
      <SizedBox height={4}/>
      <Container backgroundColor={Colors.white} flex={1} borderTopLeftRadius={50} borderTopRightRadius={50}>
        <TouchWrap
          onPress={()=>navigation.navigate('ReferFriend')}
        >
            <Container
            backgroundColor={Colors.button}
            borderRadius={50}
            widthPercent="20%"
            padding={5.5}
            marginLeft={73}
            marginTop={-5}
            horizontalAlignment="center"
            >
            <Feather Icon name="plus" size={scaleFont(30)} color="#fff" />
            </Container>
        </TouchWrap>


      <Container horizontalAlignment="center" flex={1}>
          <SizedBox height={5} />
          <Container flex={1} widthPercent="100%" paddingHorizontal={6}>
              <Container paddingHorizontal={3}>
                  <H1 fontSize={20}>
                    My Referrals
                  </H1>
              </Container>
              <SizedBox height={3} />
              {
                isLoading && (
                  <Container flex={1} verticalAlignment="center" horizontalAlignment="center">
                      <ActivityIndicator size="large" color={Colors.primary} />
                  </Container>
                )
              }
              {
                !isLoading && (
                  <FlatList 
                    data={referrals} 
                    extraData={referrals} 
                    keyExtractor={referral => referral.email} 
                  renderItem={({item, index}) => {
                    return(
                      <Container paddingVertical={2}
                        paddingHorizontal={3}
                        direction="row"
                        key={index}
                      >
                        <Container widthPercent="55%">
                          <P fontSize={15}>{item.first_name && Capitalize(item.first_name)} {item.last_name && Capitalize(item.last_name)}</P>
                        </Container>
                        <Container widthPercent="25%"
                          verticalAlignment="center"
                          horizontalAlignment="center"
                        >
                          {console.log("ite<<<MMM",item.amount_paid)}
                          <P fontSize={8} marginTop={4}>&#x20A6;{item.amount_paid !== null ? numeral(item.amount_paid).format('0,0.00') : 
                          '0.00'}</P>
                        </Container>
                        <Container widthPercent="20%"
                          verticalAlignment="center"
                          horizontalAlignment="center"
                        >
                          <P fontSize={8} 
                            color={item.paid_out_to_referred !== null ? Colors.lightGreen : 'red'}
                          >{item.paid_out_to_referred !== null ? 'Paid' : 'Pending'}</P>
                        </Container>
                      </Container>
                    )
                  }} 
                showsVerticalScrollIndicator={false}
              />
                )
              }
          </Container>
        </Container>


      </Container>
    </>
   )

}
export default ReferralList;