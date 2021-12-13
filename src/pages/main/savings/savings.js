import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {Container, TouchWrap, scaleFont, SizedBox,Page, ImageWrap, Avatar} from '@burgeon8interactive/bi-react-library';
import {H1,H2,TouchFeedback,P,Button, TransferMoney, FundWallet, 
  Warning,
  AddMoney,
  SavingsLoader,
  AddBVN,
  AddPhone
} from '../../../components/component';
import Colors from '../../../helpers/colors';
import numeral from 'numeral';
import { Dashboard } from './dashboard';
import transfefPNG from '../../../../assets/img/money_transer.png'
import travellersPNG from '../../../../assets/img/travellers.png'
import piggyPNG from '../../../../assets/img/piggy_bank.png';
import cardPNG from '../../../../assets/img/card.png';
import checkPNG from '../../../../assets/img/check.png';
import Swiper from 'react-native-swiper';
import { Dimensions, Modal,ActivityIndicator,ScrollView } from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import { useStoreActions, useStoreState } from 'easy-peasy';
import { generateRandomString, getData, storeData } from '../../../helpers/functions';
import moment from 'moment';
import { apiFunctions, base_ql_http, handleQuery } from '../../../helpers/api';
import { Retry } from '../../../components/retry';
import { useFocusEffect } from '@react-navigation/core';
import { Capitalize, ToastShort } from '../../../helpers/utils';
import { ModalWebView } from '../../../helpers/paystack_webview';
import axios from 'axios';
import { FONTSIZE, SAVING_TEST_KEY } from '../../../helpers/constants';



const Progress = ({load}) => {
  let interest_fraction = load && load.interest && load.saved ? (
    Number(load.interest) /(Number(load.interest) + Number(load.saved))
  ): 0
  let saved_fraction = load && load.interest && load.saved ? (
    (load.saved) /(Number(load.interest) + Number(load.saved))
  ): 0
  return(
    <ProgressChart
      hideLegend={true}
      data={[interest_fraction, saved_fraction]}
      width={Dimensions.get('window').width - 200}
      strokeWidth={8}
      height={150}
      chartConfig={{
        backgroundColor: Colors.primary,
        backgroundGradientFrom: Colors.primary,
        backgroundGradientFromOpacity : 0,
        backgroundGradientTo: Colors.primary,
        decimalPlaces: 2,
        color: (opacity = 0.5) => `rgba(0, 0, 100, ${opacity})`,
        style: {
          borderRadius: 16,
        },
      }}
      style={{
        marginVertical: 0,
        borderRadius: 16,
      }}
    />
  )
}

const Savings = props => {
  const [current,setCurrent] = React.useState("Dashboard");

  const [show,setShow] = React.useState(false);
  const [send_plan,setSendPlan] = React.useState(false);
  const [action,setAction] = React.useState("Transfer");
  const [warning,setWarning] = React.useState(false);
  const [loading,setLoading] = React.useState(false);
  const [retry,showRetry] = React.useState(false);
  const [gql_user,setGqlUser] = React.useState(null);
  const [challenges,setChallenges] = React.useState([]);
  const [transactions,setTransactions] = React.useState([]);
  const [savings,setSavings] = React.useState(null);
  const [challenge_ids,setChallengeIds] = React.useState(null)
  const [interest,setInterest] = React.useState(0)
  const [display,setDisplay] = React.useState(false)

  const [payload,setPayload] = React.useState(null);
  const [showModal,setShowModal] = React.useState(false);


  const transactionHandler = async (data) => {
    var webResponse = JSON.parse(data);
    setShowModal(false);
    switch (
      webResponse.message //i used paymentStatus here, it might be diff from yours. know the right one to use wen u log out webResponse
    ) {
      case 'USER_CANCELLED':
        {
          setLoading(false);
          setShowModal(false);
        }
        break;
      case 'Approved': {
        try {
          let gql_user = await getData('gql_user');
          let link_data = await getData('link_data')
          let data = {
            "amount": link_data.amount/100,
            "reference" : `${link_data.reference_id}`,
            "type": "wallet",
            "type_id": null,
            "user_id": gql_user.id,
            link_card: true
          }
          console.log("webResponse",webResponse,data)
          let gql_token = await getData('gql_token');
          // verify the ref here by sending it back to the backend
          let response = await axios.post(`${base_ql_http}/verify/transaction/`,data,{
            headers : {
              'Authorization' : `Bearer ${gql_token}`
            }
          }).then((res)=>{
            setShow(false)
            processData()
          }).catch((err)=>{
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


  const {_updateGqlToken,_updateUser} = useStoreActions((action)=>(
    {
      _updateGqlToken : action.userDetails.updateGqlToken,
      _updateUser : action.userDetails.updateUser
    }
  )) 
  const {gql_token,userD,token} = useStoreState((state)=>({
    gql_token : state.userDetails.gql_token,
    userD : state.userDetails.user,
    token : state.userDetails.token
  }))
  const [fetching,setFetching] = React.useState(false);
  const processData = async () => {
    try{
      //check if gql_token is saved and expiry_date isnt now
      showRetry(false);
      setLoading(false);
      const expiry = await getData('gql_token_expiry');
      let userD = await getData('user');
      let gql_token = await getData('gql_token');
      if(gql_token && expiry && moment(new Date()).isBefore(expiry)){
        return fetchData();
      }
      setLoading(true);
      //check if user has an account, if they dont, register them and log them in.
      if(userD.gql_acc){
       let query = `mutation{
          strap_user: login(input:{identifier: "${userD.email}", 
            password: "${userD.email}|${userD.id}"
          }){
            jwt
            user{
              id
              email
              username
            }
          }
        }`
        let res  = await handleQuery(query,null);
        storeData('gql_token_expiry',moment(new Date()).add(1.5,'months'))
        _updateGqlToken(res.data.strap_user.jwt)
        storeData('gql_token',res.data.strap_user.jwt)
        await storeData("q_user",res.data.strap_user.user)
      }
      if(!userD.gql_acc){
        let query = `mutation {
          register(input:{email: "${userD.email}", 
          password: "${userD.email}|${userD.id}", 
          username: "${userD.email}"
          firstname : "${userD.first_name}"
          lastname : "${userD.last_name}"
        }){
            jwt
            user{
              id
              email
              username
              wallet_balance
            }
          }
        }`;
        let data = {gql_acc : true}
        let res  = await handleQuery(query,null);
        let res1 = await apiFunctions.onboarding1(token,userD.id,data);
        storeData('gql_token_expiry',moment(new Date()).add(1.5,'months'))
        _updateUser(res1);
        _updateGqlToken(res.data.register.jwt)
        storeData('user',res1);
        storeData('gql_token',res.data.register.jwt)
        await storeData("q_user",res.data.register.user);
      }
      fetchData();
      setLoading(false);
    }catch(err){
      showRetry(true);
    }
  }
  const fetchData = async () => {
    try{
      let gql_user = await getData('q_user');
      let gql_token = await getData('gql_token')
      setFetching(true)
      if(!gql_user) return;
      let query = `query{
        ql_user : users(
            where : {id : ${gql_user.id}}
            sort: "created_at:desc"
          ){
            id
            wallet_balance
            email
            ags_nuban_number
            phone
            user_cards{
              id
            }
            bvn_detail{
              id
            }
            bank_accounts{
              bank_name
              bank_code
              account_name
              account_number
            }
            user_savings_challenges{
              saving_challenges_id{
                id
              }
            }
          }
          challenges : savingChallenges(sort: "created_at:desc"){
            id
            title
            amount_to_be_saved
            maturity_date
            maturity_period
            withdraw_condition
            description
            start_date
            roi
            image
            user_savings_challenges{
              user_id{
                  firstname
                  lastname
              }
            }
          }
        goals_tot_amt : userGoalsConnection(where: {user_id : ${gql_user.id}}){
          aggregate{
            sum{
              amount_saved
            }
            avg{
              roi
            }
          }
        }

        total_interests : interestsConnection(where : {user_id : ${gql_user.id}}){
          aggregate{
            sum{
              amount
            }
          }
        }

        
        chall_tot_amt : userSavingsChallengesConnection(where: {user_id : ${gql_user.id}}){
          aggregate{
            sum{
              amount_saved
            }
            avg{
              roi
            }
          }
        }
      } `
      
      let res = await handleQuery(query,gql_token);
      let user = res && res.data && 
      res.data.ql_user && res.data.ql_user[0] ? res.data.ql_user[0]
       : null
      if(user && !user.phone){
        setDisplay(true)
        setAction("AddPhone")
      }
      if(user){
        let challenge_ids = user.user_savings_challenges && Array.isArray(user.user_savings_challenges)
        ? user.user_savings_challenges.map((item,i)=>{
          return(
            item.saving_challenges_id && item.saving_challenges_id.id ? 
            item.saving_challenges_id.id : null
          )
        }).filter((item)=>item) : []
        console.log("challenge_ids",challenge_ids)
        setChallengeIds(challenge_ids)
        setGqlUser(user)
        storeData('gql_user',user);
      };
      setChallenges(res.data.challenges);
      let goals_saving = {
        amount_saved : res.data && res.data.goals_tot_amt && 
        res.data.goals_tot_amt.aggregate && res.data.goals_tot_amt.aggregate.sum ? 
        res.data.goals_tot_amt.aggregate.sum 
        && res.data.goals_tot_amt.aggregate.sum && 
        res.data.goals_tot_amt.aggregate.sum.amount_saved : 0,

        avg_roi : res.data && res.data.goals_tot_amt && 
        res.data.goals_tot_amt.aggregate && res.data.goals_tot_amt.aggregate.sum ? 
        res.data.goals_tot_amt.aggregate.sum 
        && res.data.goals_tot_amt.aggregate.avg && 
        res.data.goals_tot_amt.aggregate.avg.roi : 0
      }
      let interest = res.data && res.data.total_interests && 
      res.data.total_interests.aggregate && res.data.total_interests.aggregate.sum ? 
      res.data.total_interests.aggregate.sum 
      && res.data.total_interests.aggregate.sum && 
      res.data.total_interests.aggregate.sum.amount : 0;
      console.log("interest---",interest,res.data.total_interests)
      setInterest(interest);

      let chall_savings = {
        amount_saved : res.data && res.data.chall_tot_amt && 
        res.data.chall_tot_amt.aggregate && res.data.chall_tot_amt.aggregate.sum ? 
        res.data.chall_tot_amt.aggregate.sum 
        && res.data.chall_tot_amt.aggregate.sum && 
        res.data.chall_tot_amt.aggregate.sum.amount_saved : 0,

        avg_roi : res.data && res.data.chall_tot_amt && 
        res.data.chall_tot_amt.aggregate && res.data.chall_tot_amt.aggregate.sum ? 
        res.data.chall_tot_amt.aggregate.sum 
        && res.data.chall_tot_amt.aggregate.avg && 
        res.data.chall_tot_amt.aggregate.avg.roi : 0
      }
      setSavings({
        amount_saved : (chall_savings.amount_saved || 0) + (goals_saving.amount_saved || 0),
        avg_roi : ((chall_savings.avg_roi || 0) + (goals_saving.avg_roi || 0))
      })
      setFetching(false)
    }catch(err){
    setFetching(false)
      console.log("err",err)
    }
  }

  React.useEffect(()=>{
    fetchData();
  },[show])
  useFocusEffect(
    React.useCallback(()=>{
    processData()
  },[]))
  return (
    <Page backgroundColor={Colors.primary} >
      <Container paddingHorizontal={6} paddingTop={6} backgroundColor={Colors.    primary} direction="row">
        <TouchFeedback paddingRight={2} paddingBottom={2} paddingTop={2} onPress={() => props.navigation.openDrawer()}>
          <Feather Icon name="menu" size={scaleFont(FONTSIZE.menu)} color="#fff" />
        </TouchFeedback>
        <Container backgroundColor={Colors.primary} paddingHorizontal={6} 
            paddingTop={0.5} paddingBottom={3}
            widthPercent="80%"
            horizontalAlignment="center"
            verticalAlignment="center"
        >
            <H1 fontSize={FONTSIZE.page} color={Colors.whiteBase}>
                Savings
            </H1>
        </Container>
      </Container>
      
          <Container flex={1} backgroundColor={Colors.white} marginTop={2} borderTopLeftRadius={50} 
            borderTopRightRadius={50}
            paddingHorizontal={3}
          >
          <SizedBox height={6} />
        {
          loading ? (
            <SavingsLoader />
          ) : (
              
                <React.Fragment>
                  <Container 
                    direction="row" 
                    backgroundColor={Colors.white} 
                    horizontalAlignment="space-between"
                    paddingBottom={2}
                  >
                    {["Dashboard","Plans","Wallet"].map((el, i) => (
                      <Container
                        widthPercent="33%"
                        key={i}
                      >
                        <TouchFeedback
                          onPress={() => {
                            props.navigation.navigate(el);
                          }}>
                          <Container
                            backgroundColor={el === current ? Colors.primary : Colors.white}
                                horizontalAlignment="center"
                                paddingVertical={1.5}
                                borderRadius={5}
                            >
                            <H1 fontSize={8} color={el === current ? Colors.white : Colors.lightBlack}>
                              {el}
                            </H1>
                          </Container>
                        </TouchFeedback>
                      </Container>
                    ))}
                  </Container>
                <Container 
                    height={1}
                    borderBottomWidth={0.8}
                    borderColor={Colors.line}
                    marginBottom={2}
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                <Container 
                  borderRadius={10}
                  height={30}
                verticalAlignment="center"
                >
                  <Swiper 
                    activeDotColor={Colors.whiteBase}
                    autoplay={true}
                    backgroundColor={Colors.primary}
                    borderRadius={10}
                    // dotStyle={{
                    //   marginTop: 100
                    // }}
                    // activeDotStyle={{
                    //   marginTop: 100
                    // }}
                  >
                    {
                      ["Select money","View wallet","Show more"].map((item,i)=>(
                        <Container horizontalAlignment={item !== "Show more" ? "center" : "flex-start"}
                          borderRadius={10}
                          paddingVertical={3}
                          key={i}
                        >
                          {
                            fetching ? (
                              <Container paddingLeft={item !== "Show more" ? 0 : 5}>
                                <ActivityIndicator 
                                  size={15}
                                  color={Colors.button}
                                />
                              </Container>
                            ) : null
                          }
                            {
                              item === "Select money" ? (
                                <React.Fragment>
                                  <P color={Colors.white}>Total Savings</P>
                                   <H1 fontSize={25}
                                        color={Colors.white}
                                      >
                                        &#8358;{savings && savings.amount_saved ? 
                                        numeral(savings.amount_saved).format("0,0.00") : '0.00'}
                                      </H1>
                                  {/* <P fontSize={5} color={Colors.white}>Total Interest</P> */}
                                  <Container
                                    paddingLeft={1}
                                    paddingRight={1}
                                  >
                                    <P fontSize={FONTSIZE.small} color={Colors.white} textAlign="center">This is the amount you have saved across all savings plans and goals.</P>
                                  </Container>
                                  <Container direction="row" verticalAlignment="center">
                                      <P fontSize={8} color={Colors.white}>
                                        You have earned
                                        + &#8358;
                                        {
                                          numeral(interest).format("0,0.00")
                                        }
                                        {" "} interest.
                                      </P>
                                      <SizedBox width={1} />
                                      {/* <Avatar size={1}
                                        backgroundColor={Colors.white}
                                      />
                                      <P fontSize={8} color={Colors.white}> +{
                                        (
                                          savings && savings.avg_roi && (savings.avg_roi/2)
                                        ) ? (
                                          numeral((savings.avg_roi/2))
                                          .format('0')
                                        ) : '0'}%
                                      </P> */}
                                  </Container>
                                  <SizedBox height={2}/>
                                </React.Fragment>
                              ) : null
                            }
                            {
                              item === "View wallet" ? (
                                <React.Fragment>
                                  {/* <SizedBox height={4}/> */}
                                  <P color={Colors.whiteBase}
                                  >Wallet Balance</P>
                                  <H1 fontSize={25}
                                      color={Colors.white}
                                  >&#8358;{gql_user && gql_user.wallet_balance ? 
                                    numeral(gql_user.wallet_balance).format("0,0.00") : 
                                    '0.00'
                                  }</H1>
                                   <P fontSize={FONTSIZE.small} color={Colors.white}>This is your account balance with Herconomy</P>
                                  <SizedBox height={2}/>
                                </React.Fragment>
                              ) : null
                            }
                            {
                              item !== "Show more" ? (
                                <Button 
                                  widthPercent="80%"
                                  borderRadius={3}
                                  backgroundColor={Colors.white}
                                  color={Colors.black}
                                  borderColor={Colors.white}
                                  title={item === "Select money" ? "Add funds" : item}
                                  paddingVertical={1.4}
                                  onPress={()=>{
                                    if(item === "View wallet"){
                                      return props.navigation.navigate('Wallet')
                                    }
                                    if(item === "Select money"){
                                      setShow(true);
                                      return setAction("Select money")
                                    }
                                  }}
                                />
                              ) : null
                            }
                            {
                              item === "Show more" ? (
                                  <Container verticalAlignment="center">
                                    <Container
                                      paddingHorizontal={5}
                                      //backgroundColor={'red'}
                                    >
                                        <H2 fontSize={8}>Savings</H2>
                                        <Container direction="row"
                                          horizontalAlignment="space-between"
                                        >
                                          <Progress load={
                                            {
                                              saved : savings && savings.amount_saved ? savings.amount_saved : 0,
                                              interest :  interest
                                                
                                              
                                            }
                                          }/>
                                          
                                          <Container>
                                            <Container marginBottom={2}>
                                              <Container
                                                direction="row"
                                                verticalAlignment="center"
                                              >
                                                <Avatar
                                                  backgroundColor={Colors.black}
                                                  size={1.3}
                                                />
                                                <SizedBox width={1} />
                                                <H2 fontSize={5}
                                                  color={Colors.whiteBase}
                                                >Total Savings</H2>
                                              </Container>
                                              <H2 color={Colors.whiteBase}>
                                              &#8358;{savings && savings.amount_saved ? 
                                    numeral(savings.amount_saved).format("0,0.00") : '0.00'}
                                              </H2>
                                            </Container>
                                            <Container marginBottom={2}>
                                              <Container
                                                direction="row"
                                                verticalAlignment="center"
                                              >
                                                <Avatar
                                                  backgroundColor={Colors.greyBase300}
                                                  size={1.3}
                                                />
                                                <SizedBox width={1} />
                                                <H2 fontSize={5}
                                                  color={Colors.whiteBase}
                                                >Interest</H2>
                                              </Container>
                                              <H2 color={Colors.whiteBase}>
                                                &#8358;{numeral(interest).format("0,0.00")}
                                              </H2>
                                            </Container>
                                            {/* <Button 
                                              title={'Show more'}
                                              paddingVertical={1}
                                              fontSize={5}
                                              backgroundColor={Colors.whiteBase}
                                              color={Colors.black}
                                              borderColor={Colors.whiteBase}
                                              borderRadius={3}
                                              onPress={()=>props.navigation.navigate('Performance')}
                                            /> */}
                                          </Container>
                                        </Container>
                                  </Container>
                                  </Container>
                              ) : null
                            }
                        </Container>
                      ))
                    }
                  </Swiper>
                </Container>
                <Container 
                    height={3}
                    borderBottomWidth={0.8}
                    borderColor={Colors.line}
                />

<Container marginTop={3}>
                      <H1>To - Do List</H1>
                    </Container>
                  {
                    gql_user && Array.isArray(gql_user.user_cards) && gql_user.user_cards.length == 0 ? (
                      <TouchFeedback 
                        onPress={()=> {
                          setWarning(true)
                        }}
                      >
                        <Container

                          direction="row" widthPercent="100%" marginTop={3} borderRadius={10}
                          backgroundColor={Colors.savingsGreen}
                          paddingHorizontal={5}
                          paddingVertical={2}
                          verticalAlignment="center"
                          borderWidth={0.8}
                          borderColor={Colors.line}
                          horizontalAlignment="space-between"
                        >
                            <Container width="10%" marginRight={3}>
                              <ImageWrap 
                                height={5}
                                fit={'contain'}
                                width={10}
                                source={cardPNG}
                              />
                            </Container>
                            <Container widthPercent="80%">
                              <H2>
                                Link a card
                              </H2>
                              <P fontSize={5}>Enable automatic saving by linking your card to reach your saving goals</P>
                            </Container>
                            <Container widthPercent="10%" textAlign="right">
                              <Feather name="chevron-right" size={scaleFont(25)} />
                            </Container>
                        </Container>
                      </TouchFeedback>
                    ) : null
                  }
                  {
                    gql_user && !gql_user.phone ? (
                      <TouchWrap 
                        onPress={()=> {
                          setAction("AddPhone")
                          setWarning(false)
                          setShow(true)
                        }}
                      >
                        <Container

                          direction="row" widthPercent="100%" marginTop={3} borderRadius={10}
                          backgroundColor={Colors.savingsGreen}
                          paddingHorizontal={5}
                          paddingVertical={2}
                          verticalAlignment="center"
                          borderWidth={0.8}
                          borderColor={Colors.line}
                          horizontalAlignment="space-between"
                        >
                            <Container width="10%" marginRight={3}>
                              <ImageWrap 
                                height={5}
                                fit={'contain'}
                                width={10}
                                source={cardPNG}
                              />
                            </Container>
                            <Container widthPercent="80%">
                              <H2>
                                Add a phone number
                              </H2>
                              <P fontSize={5}>We need this to generate your wallet address.</P>
                            </Container>
                            <Container widthPercent="10%" textAlign="right">
                              <Feather name="chevron-right" size={scaleFont(25)} />
                            </Container>
                        </Container>
                      </TouchWrap>
                    ) : null
                  }
        
                  {
                    !gql_user || !gql_user.bvn_detail ? (
                      <TouchFeedback onPress={()=>{
                        setShow(true)
                        setAction("AddBVN")
                      }}>
                        <Container 
                            direction="row" widthPercent="100%" marginTop={3} borderRadius={10}
                            backgroundColor={Colors.savingYellow}
                            paddingHorizontal={5}
                            paddingVertical={2}
                            verticalAlignment="center"
                            borderWidth={0.8}
                            borderColor={Colors.line}
                            horizontalAlignment="space-between"
                        >
                            <Container width="10%" marginRight={3}>
                              <ImageWrap 
                                height={5}
                                fit={'contain'}
                                width={10}
                                source={checkPNG}
                              />
                            </Container>
                            <Container widthPercent="80%">
                              <H2>
                                Add your BVN
                              </H2>
                              <P fontSize={5}>Boost your confidence with us by linking your bvn for ease savings goals</P>
                            </Container>
                            <Container widthPercent="10%" textAlign="right">
                              <Feather name="chevron-right" size={scaleFont(25)} />
                            </Container>
                        </Container>
                      </TouchFeedback>
                    ) : null
                  }
                    
                    <TouchFeedback onPress={()=>{
                        setShow(true);
                        return setAction("Select money")
                    }}>
                      <Container 
                          direction="row" 
                          widthPercent="100%" 
                          marginTop={3} 
                          borderRadius={10}
                          backgroundColor={Colors.savingsGreen}
                          paddingHorizontal={5}
                          paddingVertical={3}
                          verticalAlignment="center"
                          borderWidth={0.8}
                          borderColor={Colors.line}
                          horizontalAlignment="space-between"
                        >
                            <Container width="10%" marginRight={3}>
                              <ImageWrap 
                                height={5}
                                fit={'contain'}
                                width={10}
                                source={transfefPNG}
                              />
                            </Container>
                            <Container widthPercent="80%">
                              <P fontSize={5}>
                                Fund your wallet!
                              </P>
                            </Container>
                            <Container widthPercent="10%" textAlign="right">
                              <Feather name="chevron-right" size={scaleFont(25)} />
                            </Container>
                        </Container>
                    </TouchFeedback>
                    
                    <TouchFeedback
                      onPress={()=>props.navigation.navigate('GoalName')}
                    >
                      <Container direction="row" widthPercent="100%" marginTop={3} borderRadius={10}
                        backgroundColor={Colors.savingYellow}
                        paddingHorizontal={5}
                        paddingVertical={4}
                        verticalAlignment="center"
                        borderWidth={0.8}
                        borderColor={Colors.line}
                        horizontalAlignment="space-between"
                      >
                          <Container width="10%" marginRight={3}>
                            <ImageWrap 
                              height={5}
                              fit={'contain'}
                              width={10}
                              source={piggyPNG}
                            />
                          </Container>
                          <Container widthPercent="80%">
                            {/* <H2 fontSize={8}>OWN YOUR FUTURE</H2> */}
                            <P fontSize={5}>
                              Own your future with Herconomy Savings.
                            </P>
                          </Container>
                          <Container widthPercent="10%" textAlign="right">
                            <Feather name="chevron-right" size={scaleFont(25)} />
                          </Container>
                      </Container>
                    </TouchFeedback>
                  {
                    challenges && challenges.length > 0 ? (
                      <React.Fragment >
                        <Container marginTop={3}>
                          <H1>Savings Plans</H1>
                          <P color={Colors.otherText} fontSize={8}>
                            Start saving with our community and put your money to work.
                          </P>
                        </Container>
                        {
                          challenges.map((item,i)=>(
                            <TouchFeedback key={i}
                              onPress={()=>{
                                let matured = item.maturity_date && moment(item.maturity_date)
                                  .diff(moment(new Date()),'days') > 0 ?  false : true;
                                let joined = challenge_ids && Array.isArray(challenge_ids) &&
                                challenge_ids.includes(item.id) ? true : false;
                               // return console.log("item>>",item)
                                if(matured || joined) return;
                                props.navigation.navigate('GoalName',{
                                  type : 'challenge',
                                  item
                                })
                              }}
                            >
                              <Container direction="row" horizontalAlignment="space-between" marginTop={2}
                                borderRadius={10}
                                paddingHorizontal={5}
                                paddingVertical={1.3}
                                backgroundColor={Colors.whiteBase}
                                marginBottom={challenges.length == (i + 1) ? 5 : 0}
                              >
                                <Container widthPercent="30%" verticalAlignment="center">
                                  <ImageWrap 
                                    url={item.image ? item.image : null}
                                    flex={1}
                                    fit={'contain'}
                                  />
                                </Container>
                                <Container widthPercent="65%" paddingVertical={3}>
                                  <H2 fontSize={10}>{item.title ? Capitalize(item.title) : null}</H2>
                                  <H2 fontSize={5}>
                                    {item.user_savings_challenges && Array.isArray(item.user_savings_challenges) ? item.user_savings_challenges.length : 0} 
                                    {""} {item.user_savings_challenges && Array.isArray(item.user_savings_challenges) && item.user_savings_challenges.length > 1 ? "members" : "member"}
                                  </H2>
                                  <SizedBox height={1} />
                                  <P fontSize={8} color={Colors.otherText}>
                                    {item.description ? item.description : null}
                                  </P>
                                  <Container 
                                    marginTop={2}
                                    direction="row" horizontalAlignment={
                                      item.maturity_date && moment(item.maturity_date)
                                      .diff(moment(new Date()),'days') < 0 ? "space-between" : 
                                      "flex-end"}>
                                    {
                                      item.maturity_date && moment(item.maturity_date)
                                      .diff(moment(new Date()),'days') < 0 ? (
                                        <P color={'red'} fontSize={3}>Matured</P>
                                      ) : null
                                    }
                                  {
                                    challenge_ids && Array.isArray(challenge_ids) &&
                                    challenge_ids.includes(item.id) ? (
                                      <H1 fontSize={5}>Joined</H1>
                                    ) : null
                                  } 
                                  </Container>
                                </Container>
                              </Container>
                            </TouchFeedback>
                          ))
                        }
                      </React.Fragment>
                    ) : null
                  }
                  {
                      fetching ? (
                        <SavingsLoader /> 
                      ) : null
                    }
                  {/* <Dashboard /> */}
                </ScrollView>
            </React.Fragment>
          ) 
        }
      {
             payload && Array.isArray(Object.values(payload)) && Object.values(payload).length > 0 ? (
              <ModalWebView payload={payload} 
                transactionHandler={transactionHandler} setLoading={setLoading}
                isLoading={loading}
                setShowModal={setShowModal}
                showModal={showModal}
              />
             ) : null
      }
                    
      </Container>
            <Modal visible={show || warning || display}>
              <Container 
                backgroundColor="#0009" flex={1} horizontalAlignment="center"
                    verticalAlignment={warning ? "flex-start" : "flex-end"}
                >
                  {
                    action === "Select money" && !warning ? (
                      <AddMoney 
                          setSendPlan={setSendPlan} 
                          setShow={setShow}
                          setWarning={setWarning}
                          hide_wallet_option={true}
                        />
                    ) : null
                  }
                  {
                    action === "AddPhone" && !warning ? (
                      <AddPhone 
                        setShow={setDisplay}
                        reload={processData}
                      />
                    ) : null
                  }
                  {
                    warning ? <Warning 
                      onPressD={async ()=>{
                        setWarning(false)
                        let reference_code = generateRandomString();
                        let data = {
                            key  : SAVING_TEST_KEY,
                            email : userD.email,
                            amount : 10000,
                            reference_id : reference_code,
                        }
                        await storeData("link_data",data)
                        setShowModal(true);
                        setPayload(data);
                      }}
                      text={"You will be redirected to paystack. You will be required to pay a sum of N100 to verify your card which will be deposited into the wallet."}
                      setWarning={setWarning}
                    /> : null
                  }
                  {
                    action === "AddBVN" && !warning ? (
                        <AddBVN 
                          setShow={setShow}
                          reload={processData}
                        />
                    ) : null
                  }
              </Container>
          </Modal>
          {
            retry ? (
                <Retry funcCall={processData} param={[]} />
            ) : null
          }         
    </Page>
  );
};

export default Savings;
