import React, {useState, useEffect} from 'react';
import {AppPageTitle, H1, H2, P, LocalAvatar, Button,TouchFeedback} from '../../components/component';
import {Container, Page, TouchWrap, scaleFont, SizedBox, InputWrap,
    ImageWrap,Avatar, Rounded, ScrollArea} from '@burgeon8interactive/bi-react-library';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../helpers/colors';
import {ModalWebView} from '../../helpers/paystack_webview';
import {apiFunctions} from '../../helpers/api';
import {useStoreState} from 'easy-peasy';
import {Alert} from 'react-native';
import numeral from 'numeral';
import {Capitalize} from '../../helpers/utils';
import {gold_plan_id,silver_plan_id} from '../../helpers/constants';
import {ToastShort} from '../../helpers/utils';

const GiftPayNow = props => {
  const {token} = useStoreState(state=>({
    token : state.userDetails.token
  }));
  const plan =  props.route.params.selected[0]
  const payNow = async () => {
    try{
      setLoading(true);
      if(isLoading){
        setLoading(false);
        return false;
      }
      let fd = {
        'email' : props.route.params.friend,
        'plan_id' : Number(plan.id)
      }
      let res =  await apiFunctions.giftSomeone(token,fd);
      let data = {
        key : res.paystack_public_key,//pk_test_83607f8cf120e5cab090541076f62b683187af95
        email : fd.email,
        amount : plan.amount,
        reference_id : res.data.reference_code || res.data.ref_code,
      }
      setShowModal(true);
      setPayload(data);
    }catch(error){
      setLoading(false);
      return ToastShort('Connection Error. Please try again');
    }
  }


  const transactionHandler = async (data) => {
    setLoading(false);
    var webResponse = JSON.parse(data);
    setShowModal(false);
    switch (
      webResponse.message //i used paymentStatus here, it might be diff from yours. know the right one to use wen u log out webResponse
    ) {
      case 'USER_CANCELLED':
        {
          setShowModal(false);
        }
        break;
      case 'Approved': {
        try {
          // verify the ref here by sending it back to the backend
          let fd = {
            reference_code : webResponse.reference
          }
          let response = await apiFunctions.confirmGifting(token,fd);
          props.navigation.navigate('Home');
          return Alert.alert('Herconomy',`An email has been sent to ${props.route.params.friend}  notifying her of your gift. Expect a thank you!`);
        } catch (error) {
          return ToastShort('Connection Error. Please try again');
        }
      }
    }
  }
  const [isLoading,setLoading] = useState(false);
  const [payload,setPayload] = useState({});
  const [showModal,setShowModal] = useState(false);
  return (
    <>
      <Page barIconColor="light" backgroundColor={Colors.primary}>
        <Container paddingHorizontal={6} paddingTop={6} direction="row" horizontalAlignment="space-between">
            <TouchFeedback paddingRight={2} paddingBottom={2} paddingTop={2} onPress={() => props.navigation.goBack()}>
            <Feather Icon name="chevron-left" size={scaleFont(20)} color="#fff" />
            </TouchFeedback>
        </Container>
        <SizedBox height={3} />
        <Container backgroundColor={Colors.white} flex={1} paddingHorizontal={6} borderTopLeftRadius={50} borderTopRightRadius={50}>
           <ScrollArea flexGrow={1}>
                <Container horizontalAlignment="center" verticalAlignment="center" padding={7}>
                    <H1 fontSize={20}>Transaction Summary</H1>
                </Container>
                <Container flex={1}>
                    <SizedBox height={10}/>
                    <P>Plan : {plan.id === gold_plan_id ? 'Gold Membership' : "Silver Membership"}</P>
                    <SizedBox height={1}/>
                    <P>Price : &#x20A6; {numeral(Number(plan.amount) /100).format('0,0')} / {plan.id === gold_plan_id ? 'year' : 'month'}</P>
                    <SizedBox height={10}/>
                    <Button title="Pay Now" borderRadius={5} onPress={payNow} loading={isLoading}/>
                </Container>
                {
                  Object.keys(payload).length > 0 && (<ModalWebView payload={payload} 
                      isLoading={isLoading} 
                      transactionHandler={transactionHandler} setLoading={setLoading}
                      isLoading={isLoading}
                      setShowModal={setShowModal}
                      showModal={showModal}
                    />)
                }
           </ScrollArea>
        </Container>
      </Page>
    </>
  );
};

export default GiftPayNow;
