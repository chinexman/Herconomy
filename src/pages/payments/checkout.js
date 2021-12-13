import React, {useState, useReducer,useEffect} from 'react';
import {AppPageBack, H1, H2, P, Button, Dropdown, ListWrapGeneral,TouchFeedback} from '../../components/component';
import {Container, SizedBox, ScrollArea, ImageWrap, TouchWrap, Avatar, Rounded} from '@burgeon8interactive/bi-react-library';
import Feather from 'react-native-vector-icons/Feather';
import {Modal, Alert} from 'react-native';
import Colors from '../../helpers/colors';
import numeral from 'numeral';
import {ModalWebView} from '../../helpers/paystack_webview';
import {apiFunctions} from '../../helpers/api';
import {useStoreState} from 'easy-peasy';
import { ToastLong,ToastShort } from '../../helpers/utils';
import axios from 'axios';

const Checkout = props => {
  const plan = props.route.params.details;

  const {userD,token} = useStoreState(state => ({
    token: state.userDetails.token,
    userD: state.userDetails.user
  }));

  const [loading, setLoading] = useState(false);
  const [selectOption, setSelectOption] = useState('');

  const goToPay = async () => {
    if (selectOption === '') {
      Alert.alert('AGS', 'Please select a payment option');
      return;
    }
    if(selectOption === 'paypal'){
      // setLoading(true);
       try{
         let fd = {
           'plan_id' : Number(plan.id),
           'payment_method' : 'paypal'
         }
         let res =  await apiFunctions.subTransaction(token,fd);
         return props.navigation.navigate("Webview",{url:res.paypal_url});
       }catch(error){
         setLoading(false);
         return ToastLong("Network Error! Please try again")
       }
     }

    try{
      setLoading(true);
      let fd = {
        'plan_id' : Number(plan.id)
      }
      let res =  await apiFunctions.subTransaction(token,fd);
      let data = {
        key : res.paystack_public_key,//pk_test_83607f8cf120e5cab090541076f62b683187af95
        email : userD.email,
        plan_id : plan.plan_id,
        amount : plan.amount,
        reference_id : res.data.reference_code,
      }
      setShowModal(true);
      setPayload(data);
    }catch(error){
      setLoading(false);
      return ToastShort('Connection Error. Please try again');
    }
  };

  const transactionHandler = async (data) => {
    setLoading(false);
    var webResponse = JSON.parse(data);
    setShowModal(false);
    switch (
      webResponse.message //i used paymentStatus here, it might be diff from yours. know the right one to use wen u log out webResponse
    ) {
      case 'USER_CANCELLED':
        {
          setPayload({});
          setPaypalLoad({});
          setLoading(false);
          setShowModal(false);
        }
        break;
      case 'Approved': {
        try {
          // verify the ref here by sending it back to the backend
          let fd = {
            reference_code : webResponse.reference
          }
          let response = await apiFunctions.confirmPayment(token,fd);
          setPayload({});
          setPaypalLoad({});
          props.navigation.navigate('Account');
          return Alert.alert('Herconomy','Payment was successful');
        } catch (error) {
          setPayload({});
          setPaypalLoad({});
          error.msg ? ToastLong('Herconomy',error.msg) : ToastLong("Opps! Network error. Please retry");
        }
      }
    }
  }
  const [payload,setPayload] = useState({});
  const [paypal_load,setPaypalLoad] = useState({})
  const [showModal,setShowModal] = useState(false);
  useEffect(()=>{

  },[loading]);

  return (
    <AppPageBack {...props}>
      <ScrollArea>
        <Container paddingTop={6} marginBottom={4} horizontalAlignment="center">
          <H1 fontSize={23}>Checkout</H1>
          <P fontSize={10} color={Colors.greyBase900}>
            Select one of the following methods
          </P>
        </Container>

        <Container marginTop={4} marginBottom={4}>
          <TouchFeedback onPress={() => setSelectOption('card')}>
            <Container
              direction="row"
              verticalAlignment="center"
              borderWidth={2}
              borderColor={selectOption === 'card' ? Colors.primary : '#dfdfdf'}
              paddingVertical={4}
              paddingHorizontal={5}
              borderRadius={10}>
              <Rounded size={4}>
                <ImageWrap source={require('../../../assets/img/icons/card.png')} />
              </Rounded>
              <SizedBox width={5} />
              <Container>
                <H1 fontSize={13}>Pay with Debit/Credit Card</H1>
                {/* <P fontSize={8}>som gist about card payment</P> */}
              </Container>
            </Container>
          </TouchFeedback>

          {
            Object.keys(payload).length > 0 && (<ModalWebView payload={payload} 
                isLoading={loading} 
                transactionHandler={transactionHandler} setLoading={setLoading}
                setShowModal={setShowModal}
                showModal={showModal}
                setPayload={setPayload}
                setPaypalLoad={setPaypalLoad}
              />)
          }

        </Container>

        <Container marginBottom={4}>
          <TouchFeedback onPress={() =>{ 
              setSelectOption('paypal')
            }}>
            <Container
              direction="row"
              verticalAlignment="center"
              borderWidth={2}
              borderColor={selectOption === 'paypal' ? Colors.primary : '#dfdfdf'}
              paddingVertical={4}
              paddingHorizontal={5}
              borderRadius={10}
              horizontalAlignment="center"  
            >
              <SizedBox width={5} />
              <Container>
                <H1 fontSize={13} textAlign="center">Pay with PayPal</H1>
              </Container>
            </Container>
          </TouchFeedback>

        </Container>

        <Button title="Proceed to Payment" loading={loading} onPress={goToPay} />
      </ScrollArea>
    </AppPageBack>
  );
};

export default Checkout;
