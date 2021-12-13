import React,{useState, useEffect} from 'react';
import {
  Page,
  Container,
  TouchWrap,
  SizedBox,
  scaleFont
} from '@burgeon8interactive/bi-react-library';
import {H1,H2,P,Button,Input,CheckBok,TouchFeedback} from '../../../../../components/component';
import Colors from '../../../../../helpers/colors';
import Feather from 'react-native-vector-icons/Feather';
import {ToastLong,ToastShort, randomString} from '../../../../../helpers/utils';
import {ModalWebView} from '../../../../../helpers/paystack_webview';
import { apiFunctions } from '../../../../../helpers/api';
import { useStoreState } from 'easy-peasy';
import {Alert} from 'react-native';

const InvestmentCart = ({navigation,route}) => {
  const {investment,unit_count} = route.params;
  const {token,user} = useStoreState(state=>({
    token : state.userDetails.token,
    user : state.userDetails.user
  }))
  const [agree,setAgree] = useState(false);
  const processPayment = async () => {
    try{
        if(!agree){
          return Alert.alert('Herconomy','Please accept the terms before continuing')
        }
        if(isLoading){
          return false;
        }
        if(!user.is_email_verified){
            return Alert.alert('Herconomy','Glad you have come this far, you will need to verify your email to continue')
        }
        setPayload({});
        let fd  = {
          investment_id : investment.id,
          units : Number(unit_count),
          payment_type : 'card'
        }
        let action = '/investment/create_transaction/'; 
        let res1 = await apiFunctions.createTransaction(token,action,fd);
        let data = {
          key : res1.paystack_public_key,//pk_test_83607f8cf120e5cab090541076f62b683187af95
          email : user.email,
          amount : unit_count * investment.price * 100,
          reference_id : res1.reference_code,
          firstname : user.first_name,
          lastname : user.last_name
        }
        setShowModal(true);
        setPayload(data);
    }catch(error){
      Object.values(error.msg)[0] ? Object.values(error.msg)[0] : ToastShort('Connection Error. Please try again');
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
            investment_id : investment.id,
            reference : webResponse.reference
          }
          let response = await apiFunctions.payInvestment(token,fd);
          navigation.navigate('Oppo');
          Alert.alert('Herconomy','Payment was successful');
        } catch (error) {
          return Object.values(error.msg)[0] && Object.values(error.msg)[0][0] ? ToastShort(Object.values(error.msg)[0][0]) : Object.values(error.msg)[0] ? Object.values(error.msg)[0] : ToastShort('Connection Error. Please try again');
        }
      }
    }
  }

  const [isLoading,setLoading] = useState(false);
  const [unitCount,setUnitCount] = useState(unit_count);
  const [payload,setPayload] = useState({});
  const [showModal,setShowModal] = useState(false);
  const [reload,setReload] = useState(false);
  useEffect(()=>{
    
  },[]);
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
            <Container flex={1} widthPercent="100%" paddingHorizontal={10}>
                  <Container>
                      <Container horizontalAlignment="center" verticalAlignment="center">
                          <H1 fontSize={20}>
                              Transaction Summary
                          </H1>
                          <SizedBox height={1.5}/>
                      </Container>
                      <SizedBox height={0.5} />
                </Container>
                <SizedBox height={5} />

                <Container direction="row">
                  <Container widthPercent="85%" verticalAlignment="center">
                      <H2>Number of units</H2>
                  </Container>
                  <Container 
                      widthPercent="15%"
                      height={7}
                      verticalAlignment="center"
                      horizontalAlignment="center"
                  >
                      <P>{unitCount}</P>
                  </Container>
                </Container>
                <SizedBox height={5}/>
                <Container direction="row">
                  <Container widthPercent="70%" verticalAlignment="center">
                      <H1>Total</H1>
                  </Container>
                  <Container 
                      widthPercent="30%"
                      height={7}
                      verticalAlignment="center"
                      horizontalAlignment="center"
                  >
                      <P>&#x20A6;{Number(investment.price * unitCount).toLocaleString('en-US')}</P>
                  </Container>
                </Container>


                  <SizedBox height={10} />
                  <Container direction="row">
                    <Container widthPercent="10%">
                      <CheckBok onPress={() => setAgree(!agree)} status={agree} />
                    </Container>
                    <Container widthPercent="80%" verticalAlignment="center">
                      <P>I understand that this is a high risk investment, I accept the associated risk, and AGS is not liable for loss of investment capital or returns.</P>
                    </Container>
                  </Container>
                  
                  <SizedBox height={3} />
                  <Button title="PAY NOW" 
                    borderRadius={4} backgroundColor={Colors.lightGreen} 
                    borderColor={Colors.lightGreen}
                    loading={isLoading}
                    onPress={()=>processPayment()}
                  />
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

export default InvestmentCart;
