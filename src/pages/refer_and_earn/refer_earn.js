import React, { useEffect, useState } from 'react';
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
import {H1,H2,P,Button,Input,TouchFeedback, SavingsLoader} from '../../components/component';
import Colors from '../../helpers/colors';
import Feather from 'react-native-vector-icons/Feather';
import ReferEarn1 from '../../../assets/img/refer_earn1.png';
import {useStoreState} from 'easy-peasy';
import {ToastLong,ToastShort} from '../../helpers/utils';
import {ReferralForm} from '../../components/referral_program_form';
import {apiFunctions} from '../../helpers/api';
import {ActivityIndicator} from 'react-native';
import ReferralList from '../../components/referral_list';
const ReferEarn = ({navigation,route}) => {
  const {token} = useStoreState(state=>(
    {
      token : state.userDetails.token
    }
  ));
  const getAccountInfo = async ()=>{
    try{
      let res = await apiFunctions.getAccountInfo(token);
      setAccount(res);
      Object.values(res).length > 0 ? setShowReferrals(true) : setShowReferrals(false);
      setLoading(false);
    }catch(error){
      ToastLong(error.msg);
    }
  }
  const [isLoading,setLoading] = useState(true);
  const [account,setAccount] = useState();
  const [showReferrals,setShowReferrals] = useState(false);
  useEffect(()=>{
    const unsubscribe = navigation.addListener('focus', () => {
      getAccountInfo();
    });
    return unsubscribe;
  },[navigation]);
  return (
    <Page barIconColor="light" backgroundColor={showReferrals ? Colors.primary : Colors.white}>
      {
        !isLoading && showReferrals ?  (
            <ReferralList setShowReferrals={setShowReferrals} navigation={navigation} />
        ) : (
          <>
            <Container paddingHorizontal={6} paddingTop={6} direction="row" verticalAlignment="center">
              <TouchFeedback paddingRight={5} paddingTop={1.5} paddingBottom={1.5} onPress={() => !isLoading && Object.values(account).length === 0 ? navigation.openDrawer() : !showReferrals && !isLoading ? setShowReferrals(true) : setShowReferrals(false)}>
                <Feather Icon name={!isLoading && Object.values(account).length > 0 ? 'chevron-left' : 'menu'} size={scaleFont(25)} color={Colors.primary} />
              </TouchFeedback>
              <H1 color={Colors.primary}>Refer & Earn</H1>
            </Container>
            <SizedBox height={8} />
            <ScrollArea>
              {
                isLoading ? (
                  <SavingsLoader />
                ) : null
              }
              {
                !isLoading && Object.values(account).length > 0 && ( 
                  <ReferralForm title="Update Account" 
                    buttonText="Update" 
                    account={account} 
                    navigation={navigation}
                    setAccount={setAccount}
                  />
                )
              }
              {
                !isLoading && Object.values(account).length === 0 && (
                    <Container
                      horizontalAlignment="center"
                      verticalAlignment="center"
                    >
                      <Container widthPercent="70%">
                        <ImageWrap 
                          source={ReferEarn1}
                          height={40}
                        />
                      </Container>
                      <SizedBox height={5}/>
                      <Container
                        widthPercent="70%"
                        horizontalAlignment="center"
                      >
                        <H1 textAlign="center" fontSize={18}>Get the bag!</H1>
                        <SizedBox height={1}/>
                        <P textAlign="center">Sign up for the affiliate program and start making money</P>
                        <SizedBox height={5}/>
                        <Button title="Join the program" borderRadius={5}
                          onPress={()=>navigation.navigate('JoinReferralProgram')}
                        />
                      </Container>
                    </Container>
                )
              }
              </ScrollArea>
          </>
        )
      }
    </Page>
  );
};

export default ReferEarn;
