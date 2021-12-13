import React, { useEffect } from 'react';
import { Container,ImageWrap,InputWrap,Page,scaleFont,SizedBox, TouchWrap } from "@burgeon8interactive/bi-react-library";
import { H1, TouchFeedback,P,H2, Button, CheckBok ,TransferMoney,
    TransferPlan,
    FundWallet,
    Warning,
    Label,
    WellDone
} from '../../../components/component';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../helpers/colors';
import { ScrollView } from 'react-native-gesture-handler';
import numeral from 'numeral';
import moment from 'moment';
import { useState } from 'react';
import { useStoreState } from 'easy-peasy';
import { generateRandomString, getData, storeData } from '../../../helpers/functions';
import { base_ql_http, handleQuery } from '../../../helpers/api';
import { Modal } from 'react-native';
import { ToastLong } from '../../../helpers/utils';
import {ModalWebView} from '../../../helpers/paystack_webview';
import axios from 'axios';
import { Retry } from '../../../components/retry';
import { FONTSIZE, SAVING_TEST_KEY } from '../../../helpers/constants';

export const ReviewPlan = (props) => {
    const [show,setShow] = useState(false)
    const [warning,setWarning] = useState(false);
    const {gql_token} = useStoreState((state)=>({
        gql_token : state.userDetails.gql_token
    }))
    const {plan,custom,type} = props.route.params;
    let split = [];
    if(plan.how_long !== "Let me choose"){
        split = plan.how_long.split(' ');
    }
    let maturity_date;
    if(!type){
        maturity_date = plan.how_long !== "Let me choose" ? 
        moment(new Date()).add(split[0],split[1]).format('DD MMM YYYY') : 
        moment(custom).format('DD MMM YYYY')
    }else{
        maturity_date = moment(plan.how_long).format('DD MMM YYYY')
    }
    const [loading,setLoading] = useState(false)
    let amount_to_be_saved;
    if(plan.how_often === "Daily"){
        let diff = moment(maturity_date).diff(moment(new Date()),'days')
        amount_to_be_saved = diff > 0 ? diff * plan.amount : plan.amount
    }
    if(plan.how_often === "Weekly"){
        let diff = moment(maturity_date).diff(moment(new Date()),'weeks')
        amount_to_be_saved = diff > 0 ? diff * plan.amount : plan.amount
    }
    if(plan.how_often === "Monthly"){
        let diff = moment(maturity_date).diff(moment(new Date()),'months')
        amount_to_be_saved = diff > 0 ? diff * plan.amount : plan.amount
    }
    if(plan.how_often === "Once"){
        amount_to_be_saved = plan.amount
    }
    
    const payWithPayStack = async (destination) => {
        try{
            //return setWarning(false)
            //make calls to paystack;
            console.log("payWithPayStack")
            let  user = await getData('gql_user');
            await getData('gql_token');
            let reference_code = generateRandomString();
            setLoading(true);
            if(loading){
                //setLoading(false);
                return false;
            }
    
            let fundData = {
              "amount": plan.amount,
              "reference" : `cardPlan_${reference_code}_${user.id}`,
              "type": "plan",
              "type_id": destination.id,
              "user_id": user.id
            }
            await storeData('fundData',fundData);
            //await handleQuery(query,gql_token);
            let data = {
                //key : res.paystack_public_key,//pk_test_83607f8cf120e5cab090541076f62b683187af95
                key : SAVING_TEST_KEY,
                email : user.email,
                amount : plan.amount * 100,
                reference_id : `cardPlan_${reference_code}_${user.id}`
            }
            setShowModal(true);
            setPayload(data);
        }catch(err){
          setLoading(false);
          ToastLong("This should not happen. Please try again")
            console.log("err",err)
        }
    }

    const transactionHandler = async (data) => {
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
              let fd = await getData('fundData');
              console.log("transactionHandler",fd)
              let gql_token = await getData('gql_token');
              // verify the ref here by sending it back to the backend
              axios.post(`${base_ql_http}/verify/transaction/`,fd,{
                headers : {
                  'Authorization' : `Bearer ${gql_token}`
                }
              }).then((res)=>{
                console.log("res",res)
                setLoading(false)
                setShow(true);
              }).catch((err)=>{
                console.log("err>>",err)
                setLoading(false)
                return ToastShort("This should not happen. Please try again");
              })
            } catch (error) {
              console.log("err",error)
              setLoading(false)
              return ToastShort("This should not happen. Please try again");
            }
          }
        }
      }
      const [payload,setPayload] = useState({});
      const [showModal,setShowModal] = useState(false);
    const handleSubmit = async () => {
        try{
            setLoading(true)
            setWarning(false);
            let  user = await getData('gql_user');
            let query = !type ? `
                mutation{
                    createUserGoal(input : {
                        data : {
                            user_id: "${user.id}"
                            title: "${plan.name}"
                            start_date: "${moment(new Date).format('YYYY-MM-DD')}"
                            end_date: "${moment(maturity_date).format('YYYY-MM-DD')}"
                            description: "${plan.reason}"
                            smashed: ${false}
                            target_amount: ${plan.amount}
                            frequency : ${plan.how_often}
                            percentage : ${0}
                            amount_saved : ${0}
                            roi: ${plan.roi}
                        }
                    }){
                        userGoal{
                            id
                        }
                    } 
                }
            ` : `mutation{
                createUserSavingsChallenge(input : {
                  data : {
                    user_id: ${user.id}
                    amount_saved: ${0}
                    start_date: "${moment(new Date).format('YYYY-MM-DD')}"
                    percentage: ${0}
                    roi: ${plan.roi}
                    frequency: ${plan.how_often}
                    target_amount: ${plan.amount}
                    saving_challenges_id : ${plan.challenge_id}
                  }
                }){
                  userSavingsChallenge{
                    id
                  }
                }
              }`
            let res = await handleQuery(query,gql_token);
            if(plan.source === "wallet" && res.data && res.data.createUserSavingsChallenge
              && res.data.createUserSavingsChallenge.userSavingsChallenge &&
              res.data.createUserSavingsChallenge.userSavingsChallenge.id
            ){
                let destination = {
                    id : res.data.createUserSavingsChallenge.userSavingsChallenge.id
                }
                return payWithWallet(destination)
            }

            if((plan.source === "bank card" && !plan.later || plan.source === "gold card" && !plan.later) && res.data && res.data.createUserSavingsChallenge
            && res.data.createUserSavingsChallenge.userSavingsChallenge &&
            res.data.createUserSavingsChallenge.userSavingsChallenge.id){
                let destination = {
                    id : res.data.createUserSavingsChallenge.userSavingsChallenge.id
                }
                return payWithPayStack(destination)
            }
            setLoading(false)
            setShow(true);
        }catch(err){
            console.log("Err",err)
            setLoading(false);
            ToastLong("This should not happen. Please try again.")
        }
    }

    const payWithWallet = async (destination) => {
        try{
          let gql_user = await getData('gql_user');
          let gql_token = await getData('gql_token');
          if(plan.amount > gql_user.wallet_balance){
            return ToastLong("You have insufficient fund in wallet")
          }
          let fd =  { 
            user_id : gql_user.id,
            amount : plan.amount,
            type_id : destination.id,
            type : !type ? "goal" : "plan"
          }
          console.log("endpoint",`${base_ql_http}/fund_plans_goals`,fd)
          setLoading(true)
          // verify the ref here by sending it back to the backend
          axios.post(`${base_ql_http}/fund_plans_goals`,fd,{
            headers : {
              'Authorization' : `Bearer ${gql_token}`
            }
          }).then((res)=>{
            setLoading(false)
            setShow(true);
          }).catch((err)=>{
            console.log("err>>",err)
            setLoading(false)
            return ToastShort("This should not happen. Please try again");
          })
        }catch(err){
          console.log("err",err);
        }
    }

    return(
        <Page backgroundColor={Colors.primary} >
        <Container paddingHorizontal={6} paddingTop={6} backgroundColor={Colors.primary} direction="row">
            <TouchFeedback paddingRight={2} paddingBottom={2} paddingTop={2} onPress={() => props.navigation.goBack()}>
                <Feather Icon name="chevron-left" size={scaleFont(25)} color="#fff" />
            </TouchFeedback>
          <Container backgroundColor={Colors.primary} paddingHorizontal={6} 
              paddingTop={0.5} paddingBottom={3}
              widthPercent="80%"
              horizontalAlignment="center"
          >
              <H1 fontSize={18} color={Colors.whiteBase}>
                  Review Plan
              </H1>
          </Container>
        </Container>
        {console.log("custom??",custom,plan)}
        <Container flex={1} backgroundColor={Colors.white} marginTop={2} borderTopLeftRadius={50} 
          borderTopRightRadius={50}
          paddingHorizontal={3}
        >
          <SizedBox height={3}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Container marginBottom={6} marginTop={3}>
                    <Container marginBottom={2}>
                        <P
                            fontSize={5}
                            textAlign="center"
                        >{plan.reason}</P>
                        <H1
                            fontSize={15}
                            textAlign="center"
                        >&#8358;{amount_to_be_saved ? numeral(amount_to_be_saved).format('0,0.00') : '0.00'}</H1>
                        <P
                            fontSize={5}
                            textAlign="center"
                        >by {maturity_date}</P>
                        <SizedBox height={2}/>
                        <P
                            fontSize={5}
                            textAlign="center"
                        >These are your settings. They can at any time be updated.</P>
                    </Container>
                    {
                        [
                            {
                                label : "Goal Title",
                                value : plan && plan.name ? plan.name : "",
                                hint : null
                            },
                            {
                                label : "Saving Amount",
                                value : plan && plan.amount ? numeral(plan.amount).format('0,0.00') : '0.00',
                                hint : null
                            },
                            {
                                label : "Est. Target Amount",
                                value : amount_to_be_saved && plan && plan.roi && 
                                (Number(amount_to_be_saved) * (plan.roi/100) + Number(amount_to_be_saved)) ?  
                                numeral(Number(amount_to_be_saved) * (plan.roi/100) + Number(amount_to_be_saved)).format('0,0.00') 
                                : amount_to_be_saved ? numeral(amount_to_be_saved).format('0,0.00') : "0.00",
                                hint : "This is how much you would get at the end of the savings period."
                            },
                            {
                                label : "Interest Rate",
                                value : `${plan && plan.roi ? plan.roi : 0}% per Annum`,
                                hint : null
                            },
                            {
                                label : "Maturity Date",
                                value : maturity_date,
                                hint : "You will be able to get your targeted amount on this day. Congratulations!"
                            }
                        ].map((item,i)=>(
                            <Container
                                key={i}
                                paddingVertical={3}
                                borderBottomWidth={1}
                                borderColor={Colors.line}
                            >
                                <Container direction="row"
                                    verticalAlignment="center"
                                    horizontalAlignment="space-between"
                                >
                                    <H2 
                                        fontSize={8}
                                        color={Colors.otherText}
                                    >{item.label}</H2>
                                    <P fontSize={8}>{item.value}</P>
                                </Container>
                                {item.hint ? <Container marginTop={2}>
                                    <P fontSize={FONTSIZE.small}>{item.hint}</P>
                                    </Container> : null}
                            </Container>
                        ))
                    }
                    <Container marginTop={3}>
                        <P
                            fontSize={5}
                            //textAlign="center"
                        ><H1 fontSize={5}>Withdrawal conditions: </H1> 
                            {!plan.withdraw_condition ? 
                                "If you break this plan before the maturity date, you will lose all the interest accrued and bear the 2% payment gateway charge for processing your deposit into this target" : plan.withdraw_condition
                            }
                        </P>
                    </Container>
                    <Container marginTop={4}>
                        <Button title="Accept & Continue"
                            backgroundColor={Colors.primary}
                            borderColor={Colors.primary}
                            borderRadius={5}
                            fontSize={8}
                            onPress={()=> {
                                if(plan.source === "bank card" && !plan.later){
                                    return setWarning(true);
                                }
                                if(plan.source === "gold card" && !plan.later){
                                    return setWarning(true);
                                }
                                handleSubmit()
                            }}
                            loading={loading}
                        />
                    </Container>
                </Container>

            </ScrollView>
            <Modal visible={warning}>
                <Container 
                    backgroundColor="#0009" flex={1} horizontalAlignment={"center"}
                    verticalAlignment={"flex-start"}
                >
                    <Warning setWarning={setWarning} onPressD={handleSubmit}/>
                </Container>
            </Modal>
            <Modal 
                visible={show}
                backgroundColor={'red'}
            >
                <WellDone 
                    setShow={setShow}
                    text={'You just created a savings plan.To fund your goals, tap "see goals" to get started'}
                    onPressD={()=>{
                        setShow(false)
                        props.navigation.navigate("Plans")
                    }}
                    btn_text={'See Goals'}
                />
            </Modal>

            <ModalWebView payload={payload} 
                transactionHandler={transactionHandler} setLoading={setLoading}
                isLoading={loading}
                setShowModal={setShowModal}
                showModal={showModal}
            />
        </Container>
      </Page>
    )
}