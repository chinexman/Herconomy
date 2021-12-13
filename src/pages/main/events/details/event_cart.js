import React,{useState,useEffect} from 'react';
import {
  Page,
  Container,
  TouchWrap,
  SizedBox,
  scaleFont
} from '@burgeon8interactive/bi-react-library';
import {H1,H2,P,Button,Input,TouchFeedback} from '../../../../components/component';
import Colors from '../../../../helpers/colors';
import Feather from 'react-native-vector-icons/Feather';
import {Capitalize,ToastShort,ToastLong} from '../../../../helpers/utils';
import moment from 'moment';
import { apiFunctions } from '../../../../helpers/api';
import { useStoreState } from 'easy-peasy';
import {ModalWebView} from '../../../../helpers/paystack_webview';
import { Alert } from 'react-native';

const EventCart = ({navigation,route}) => {
  
  const {eventDetails} = route.params;
  const {token,user} = useStoreState(state=>({
      token : state.userDetails.token,
      user : state.userDetails.user
    }))
  const computeSeatPrice = (value) => {
    setPrice(eventDetails.price * value);
    setSeatCount(value);
  }
  const bookSeats = async () => {
    try{

      if(!user.is_email_verified){
        return Alert.alert('Herconomy','Glad you have come this far, you will need to verify your email to continue')
      }
      
      setLoading(true);
      if(isLoading){
        setLoading(false);
        return false;
      }
      
      let action = price === 0 ? 'attend' : 'create_invoice';
      if(action === 'attend' && seatCount > 2){
        setLoading(false);
        return Alert.alert('Herconomy','Sorry! You can not book more than 2 seats');
      }
      if(seatCount < 1 || seatCount.length < 1){
        setLoading(false);
        return Alert.alert('Herconomy','Sorry! You must book at least a seat');
      }
      let fd = {
        'units' : seatCount
      }
      let res =  await apiFunctions.bookSeat(token,eventDetails.id,action,fd);
      if(action === 'attend'){
          navigation.navigate('Events');
          return Alert.alert('Herconomy','Application was successful');
      }
      /**
       * -- pop up paystack and send reference_id to it.
       * -- send the reference_id again to paystack and check for payment status
       */
      let data = {
        key : res.paystack_public_key,//pk_test_83607f8cf120e5cab090541076f62b683187af95
        email : user.email,
        amount : price * 100,
        reference_id : res.reference_code,
        firstname : user.first_name,
        lastname : user.last_name
      }
      setShowModal(true);
      setPayload(data);
    }catch(error){
      setLoading(false);
      return Object.values(error.msg)[0] && Object.values(error.msg)[0][0] ? ToastShort(Object.values(error.msg)[0][0]) : ToastShort('Connection Error. Please try again');
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
            reference : webResponse.reference,
            event_id : eventDetails.id
          }
          let response = await apiFunctions.payEvent(token,fd);
          navigation.navigate('Events');
          return Alert.alert('Herconomy','Payment was successful');
        } catch (error) {
          Alert.alert('Herconomy',error.msg);
        }
      }
    }
  }

  const [price,setPrice] = useState(eventDetails.price);
  const [isLoading,setLoading] = useState(false);
  const [seatCount,setSeatCount] = useState(0);
  const [payload,setPayload] = useState({});
  const [showModal,setShowModal] = useState(false);
  return (
    <Page barIconColor="light" backgroundColor={Colors.primary}>
      <Container paddingHorizontal={6} paddingTop={6} direction="row" verticalAlignment="center">
        <TouchFeedback paddingRight={5} paddingTop={1.5} paddingBottom={1.5} onPress={() => navigation.goBack()}>
          <Feather Icon name="chevron-left" size={scaleFont(25)} color="#fff" />
        </TouchFeedback>
      </Container>
      <SizedBox height={8} />
      <Container backgroundColor={Colors.white} flex={1} borderTopLeftRadius={50} borderTopRightRadius={50}>
      


      <Container horizontalAlignment="center" flex={1}>
          <SizedBox height={5} />

          <Container flex={1} widthPercent="100%" paddingHorizontal={6}>
                <Container>
                    <Container horizontalAlignment="center" verticalAlignment="center">
                        <H1 fontSize={20}>
                            Cart
                        </H1>
                        <SizedBox height={1.5}/>
                    </Container>
                    <SizedBox height={0.5} />
              </Container>
              <SizedBox height={5} />

              <Container direction="row">
                <Container widthPercent="60%">
                    <H2>{eventDetails.title ? Capitalize(eventDetails.title) : null}</H2>
                    <P color={Colors.lightGrey}
                      fontSize={7}
                    >{eventDetails.address ? Capitalize(eventDetails.address) : null}</P>
                    <P color={Colors.lightGrey}
                      fontSize={7}
                    >{eventDetails.start_datetime ? moment(eventDetails.start_datetime).format('ddd MM YYYY') : null}</P>
                </Container>
                <Container 
                widthPercent="15%"
                height={7}
                >
                    <Input
                      type="number-pad"
                      onChangeText={(value)=>computeSeatPrice(value)}
                    />
                </Container>
                <Container 
                widthPercent="25%"
                paddingTop={1}
                paddingLeft={3}
                >
                    <H1>&#x20A6;{Number(price).toLocaleString('en-US')}</H1>
                </Container>
              </Container>


            <SizedBox 
            height={20}
            />

                <Container>
                    <Container direction="row" 
                        borderTopWidth={1} borderColor={Colors.line}
                        paddingTop={3}
                    >
                        <Container widthPercent="50%">
                            <P textAlign="left">Total</P>
                        </Container>
                        <Container widthPercent="50%">
                            <H1 textAlign="right">&#x20A6;{Number(price).toLocaleString('en-US')}</H1>
                        </Container>
                    </Container>
                    <SizedBox height={2}/>
                    <Container direction="row" padding={4} horizontalAlignment="center">
                        <Container widthPercent="50%">
                            <Button title="PROCEED" borderRadius={4} backgroundColor={Colors.primary} 
                              borderColor={Colors.primary} 
                              onPress={()=>bookSeats()}
                              loading={isLoading}
                            />
                        </Container>
                    </Container>
                </Container>
          </Container>
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


      </Container>
    </Page>
  );
};

export default EventCart;
