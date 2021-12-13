import React, { useEffect } from 'react';
import { Container,ImageWrap,Page,scaleFont,SizedBox, TouchWrap } from "@burgeon8interactive/bi-react-library";
import { H1, TouchFeedback,P,H2, Button, CheckBok ,TransferMoney,
    TransferPlan,
    FundWallet,
    Warning,
    BreakCharge,
    WithdrawWallet,
    AddMoney,
    SavingsLoader,
    LottieIcon
} from '../../../components/component';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../helpers/colors';
import numeral from 'numeral';
import pulsePNG from '../../../../assets/img/pulse.png';
import stampPNG from '../../../../assets/img/stamp.png';
import failedPNG from '../../../../assets/img/failed.png';
import depositPNG from '../../../../assets/img/deposit.png';
import withdrawalPNG from '../../../../assets/img/withdrawal.png';
import moment from 'moment';
import {ActivityIndicator, Modal,ScrollView} from 'react-native';
import { handleQuery } from '../../../helpers/api';
import { useStoreState } from 'easy-peasy';
import { Retry } from '../../../components/retry';
import { useFocusEffect } from '@react-navigation/core';
import { calAmtToBeSaved, getData } from '../../../helpers/functions';
import Empty from '../../../../assets/lottie/empty.json'

export const SinglePlan = (props) => {
    const [current,setCurrent] = React.useState('All')
    const [show,setShow] = React.useState(false)
    const [action,setAction] = React.useState('withdraw');
    const [send_plan,setSendPlan] = React.useState(false);
    const [warning,setWarning] = React.useState(false);
    const [loading,setLoading] = React.useState(false);
    const [retry,setRetry] = React.useState(false);
    const [planD,setPlan] = React.useState(null)
    const [information,setInformation] = React.useState(null)
    const [canWithdraw,setCanWithdraw] = React.useState(true)
    const [user,setUser] = React.useState(null);
    
    const {gql_token} = useStoreState((state)=>({
        gql_token : state.userDetails.gql_token
    }))
    const {plan,type} = props.route.params;
    const fetchData = async () => {
        try{
            setLoading(true);
            let gql_user = await getData('gql_user');
            setUser(gql_user)
            let planData = await getData("single_plan")
            let amount_to_be_saved = calAmtToBeSaved(planData)
            //let diff = moment(planData.start_date).diff(new Date(),'days')
            //console.log("diff------",diff)
            //diff >= 90 || type !== "goal" ? setCanWithdraw(true) : setCanWithdraw(false)
            setRetry(false)
            let query = type === "goal" ? `query{
                goal : userGoals(
                    where: {id : ${planData.id}}
                ){
                  target_amount
                  amount_saved
                  percentage
                  end_date
                  start_date
                  description
                  next_payment_date
                  roi
                  status
                  transactions(sort : "created_at:desc"){
                    amount
                    created_at
                    description
                    destination
                    transaction_type
                    source
                    status
                  }
                }
              }` : `query{
                challenge : userSavingsChallenges(where: {id : ${planData.id}}){
                  amount_saved
                  next_payment_date
                  percentage
                  status
                  saving_challenges_id{
                    title
                    amount_to_be_saved
                    roi
                    start_date
                    maturity_date
                    maturity_period
                  }
                  
                  transactions(sort : "created_at:desc"){
                    amount
                    created_at
                    description
                    destination
                    transaction_type
                    source
                    status
                  }
                }
              }`
            let res = await handleQuery(query,gql_token);
            console.log("handleQuery---",res)
            if(type === "goal" && res.data.goal && res.data.goal.length > 0){
                let plan = res.data.goal[0]
                setPlan({...planData,transactions : plan.transactions,amount_to_be_saved,
                    amount_saved : plan.amount_saved,
                    next_payment_date : plan.next_payment_date,
                    type : "goal",
                    percentage : plan.percentage,
                    status : plan.status
                })
            }
            if(type !== "goal" && res.data.challenge){
                let plan = res.data.challenge[0];
                setPlan({...planData,transactions : plan.transactions,amount_to_be_saved,
                    amount_saved : plan.amount_saved,
                    next_payment_date : plan.next_payment_date,
                    type : "plan",
                    percentage : plan.percentage,
                    status : plan.status
                })
            }
            setLoading(false)
        }catch(err){
            console.log("err",err)
            setRetry(true)
        }
    }

    useEffect(()=>{
        fetchData()
    },[show])
    
    useFocusEffect(
        React.useCallback(()=>{
            fetchData();
        },[])
    )
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
              <H1 fontSize={18} color={Colors.whiteBase} numberOfLines={1}>
                  {planD ? planD.title : ""}
              </H1>
          </Container>
        </Container>
        <Container flex={1} backgroundColor={Colors.white} marginTop={2} borderTopLeftRadius={50} 
          borderTopRightRadius={50}
          paddingHorizontal={3}
        >
          <SizedBox height={6}/>
          <ScrollView showsVerticalScrollIndicator={false}>
                <Container>
                    <Container
                    paddingHorizontal={4}
                    paddingVertical={3}
                    borderRadius={5}
                    backgroundColor={Colors.primary}
                >
                    {console.log("planD>>>>",planD)}
                    {
                        !loading ? (
                            <H1 color={Colors.whiteBase}>&#8358;{
                                planD && planD.amount_saved ? 
                                numeral(planD.amount_saved).format('0,0.00')
                                 : "0.00"
                            }</H1>
                        ) : (
                            <ActivityIndicator size={10}
                                color={Colors.button}
                            />
                        )
                    }
                    <Container marginTop={3} direction="row"
                        horizontalAlignment="space-between"
                        verticalAlignment="center"
                    >
                        <P color={Colors.lightestGrey}
                        fontSize={5}
                        >{`${planD && planD.percentage > 100 ? 100 :  
                            planD && planD.percentage < 100 ? numeral(planD.percentage).format('0') : 0}%`} achieved</P>
                        <Container>
                            <P color={Colors.lightestGrey}
                            fontSize={5}
                            >Target Amount</P>
                            <H1 color={Colors.whiteBase}>&#8358;
                                {planD && planD.amount_to_be_saved ? numeral(planD.amount_to_be_saved).format('0,0') : "0.00"}
                            </H1>
                        </Container>
                    </Container>
                    <Container backgroundColor={Colors.white} 
                        height={1}
                        borderRadius={5}
                        marginTop={1}
                    >
                        <Container 
                            height={1}
                            borderRadius={5}
                            backgroundColor={Colors.lightGreen}
                            widthPercent={`${planD && planD.percentage > 100 ? 100 :  
                                planD && planD.percentage < 100 ? numeral(planD.percentage).format('0') : 0}%`}
                        />
                    </Container>
                </Container>

                <Container direction="row"
                    horizontalAlignment="space-between"
                    marginTop={5}
                >
                    {console.log("planD--",planD)}
                    <Button 
                        widthPercent="45%"
                        borderRadius={5}
                        title={'Withdraw'}
                        backgroundColor={Colors.whiteBase}
                        borderColor={(!planD || planD.amount_saved < 1 || !canWithdraw) ? Colors.lightGrey : Colors.primary}
                        color={(!planD || planD.amount_saved < 1 || !canWithdraw) ? Colors.lightGrey : Colors.primary}
                        onPress={()=>{
                            if(!planD || planD.amount_saved < 1 || !canWithdraw){
                                return;
                            }
                            moment(planD.end_date)
                            .diff(moment(new Date())) < 1 || planD.percentage >= 100 || planD.roi == 0 ?  
                            setAction('withdraw_wallet') : setAction('withdraw')
                            setShow(true);
                        }}
                    />
                    <Button 
                        widthPercent="45%"
                        title={'Top Up'}
                        borderRadius={5}
                        backgroundColor={planD && planD.status === "Completed" ? Colors.lightGrey : Colors.primary}
                        borderColor={planD && planD.status === "Completed" ? Colors.lightGrey : Colors.whiteBase}
                        color={Colors.whiteBase}
                        onPress={()=>{
                            if(!planD || planD.status === "Completed") return 
                            setShow(true)
                            setAction('Fund')
                        }}
                    />
                </Container>
                <Container 
                    marginTop={10}
                    direction="row"
                    horizontalAlignment="space-between"
                    verticalAlignment="center"
                    marginBottom={2}
                    borderBottomWidth={1}
                    paddingBottom={4}
                    borderColor={Colors.line}
                >
                    <Container>
                        <P fontSize={5}
                            color={Colors.otherText}
                        >Saving Amount</P>
                        <P>&#8358;
                            {planD && planD.target_amount && type === "goal"  ? 
                                numeral(planD.target_amount).format('0,0.00') : 
                                type !== "goal" && planD && planD.target_amount ? 
                                numeral(planD.target_amount).format('0,0.00') : '0.00'
                            } {planD && planD.frequency ? planD.frequency : null}
                        </P>
                    </Container>
                   {/* {
                       type !== "challenge" ? ( */}
                        <Container width={15}>
                            <Button 
                                title="Edit"
                                backgroundColor={Colors.primary}
                                widthPercent="100%"
                                borderColor={Colors.primary}
                                backgroundColor={Colors.whiteBase}
                                color={Colors.primary}
                                paddingVertical={0.5}
                                borderRadius={1}
                                fontSize={8}
                                onPress={()=>props.navigation.navigate('PlanSettings',{planD,type})}

                            />
                        </Container>
                       {/* ) : null
                   } */}
                </Container>
                {
                        [
                                {
                                label1 : "Next Saving Date",
                                value1 : `${planD && planD.next_payment_date ? 
                                    moment(planD.next_payment_date).format('MMM DD, YYYY') : ""}`,
                                label2 : "Start Date",
                                value2 : `${planD && planD.start_date ? 
                                    moment(planD.start_date).format('MMM DD, YYYY') : ""}`
                            },
                            {
                                label1 : "Maturity Date",
                                value1 : `${planD && planD.end_date ? 
                                    moment(planD.end_date).format('MMM DD, YYYY') : ""}`,
                                label2 : "Plan Type",
                                value2 : `${type && type === "goal" ?  "Personal Goal" : "Savings Plan"}`
                            }
                        ].map((item,i)=>(
                            <Container direction="row"
                                verticalAlignment="center"
                                horizontalAlignment="space-between"
                                key={i}
                                paddingVertical={3}
                            >
                            <Container>
                                    <P fontSize={5}
                                        color={Colors.otherText}
                                    >{item.label1}</P>
                                    <H2 
                                        fontSize={8}
                                    >{item.value1}</H2>
                                </Container>
                                <Container>
                                    <P fontSize={5}
                                        color={Colors.otherText}
                                        textAlign="right"
                                    >{item.label2}</P>
                                    <H2 
                                        fontSize={8}
                                    >{item.value2}</H2>
                                </Container>
                                
                            </Container>
                        ))
                    }
                    <Container direction="row" horizontalAlignment="space-between">
                        <Container>
                            <P fontSize={5}
                                color={Colors.otherText}
                            >Interest</P>
                            <H2 
                                fontSize={8}
                                color={Colors.lightGreen}
                            >{planD && planD.roi ? planD.roi : 0}%</H2>
                        </Container>
                        <Container>
                            <P fontSize={5}
                                color={Colors.otherText}
                            >Auto Save</P>
                            {console.log("user>>>>",planD,user)}
                            <H2 
                                fontSize={8}
                                color={Colors.black}
                            >{
                                planD && planD.status === "In_Progress" && user && Array.isArray(user.user_cards) && 
                                user.user_cards.length > 0 ? 'Yes' : 'No'
                            }</H2>
                        </Container>
                    </Container>

                    <Container marginTop={3}
                    horizontalAlignment="space-between"
                    direction="row"
                    paddingBottom={2}
                    borderBottomWidth={0.7}
                    borderColor={Colors.line}
                >
                    <H2>Recent Transactions</H2>
                    <TouchFeedback onPress={()=>{
                        if(!planD) return
                        props.navigation.navigate('Transactions',{type:planD.type,id : planD.id})
                    }}>
                        <P color={Colors.primary}
                            fontSize={8}
                        >View All</P>
                    </TouchFeedback>
                </Container>
            </Container>
              {
                  loading ? (
                      <SavingsLoader />
                  ) : (
                    
                 <Container marginBottom={6} marginTop={3}>
                     {
                         planD && planD.transactions && Array.isArray(planD.transactions) &&
                         planD.transactions.length === 0 ? (
                            <Container horizontalAlignment="center">
                                <LottieIcon icon={Empty} />
                            </Container>
                         ) : null
                     }
                 {
                     planD && planD.transactions && Array.isArray(planD.transactions) ? planD.transactions.map((item,index)=>(
                             <TouchFeedback key={index}
                                onPress={()=>{
                                    let data = {
                                        type : item.transaction_type,
                                        title : item.description,
                                        text : item.destination,
                                        amount : item.amount,
                                        date : item.created_at,
                                        source : item.source,
                                        status : item.status,
                                        back_to_wallet : false
                                    }
                                    props.navigation.navigate("TransactionDetails",{
                                        transaction : data
                                    })
                                }}
                             >
                                 <Container direction="row"
                                     verticalAlignment="center"
                                     borderBottomWidth={0.5}
                                     borderColor={Colors.line}
                                 >
                                     <Container height={10} widthPercent="13%">
                                         <ImageWrap 
                                             flex={1}
                                             width={10}
                                             fit={'contain'}
                                             source={
                                                item && item.status && item.status !== 'FAILED' && 
                                                item.transaction_type === "funding" ? 
                                                depositPNG : item && item.status && item.status !== 'FAILED' && 
                                                item.transaction_type === "withdraw" ? withdrawalPNG : 
                                                failedPNG
                                            }
                                         />
                                     </Container>
                                     <Container verticalAlignment="center"
                                          widthPercent="60%"
                                        paddingRight={5}
                                     >
                                         <H2 fontSize={8}>
                                             {item.description ? item.description : ""}
                                         </H2>
                                         <P fontSize={5}
                                             color={Colors.otherText}
                                         >{item.destination}</P>
                                     </Container>
                                     <Container widthPercent="27%">
                                         <H1 fontSize={9}
                                             numberOfLines={1}
                                         >&#8358;{item.amount ? numeral(item.amount).format('0,0') : '0.00'}</H1>
                                         <P fontSize={5}>
                                         {item.created_at ? moment(item.created_at).format('ddd MMM DD, YYYY') : ""}
                                         </P>
                                     </Container>
                                 </Container>
                             </TouchFeedback>
                     )) : null
                 }
             </Container>
                  )
              }
          </ScrollView>
          
        </Container>
        {
              retry ? (
                  <Retry funcCall={fetchData} param={[]}/>
              ) : null
          }
        <Modal visible={show}>
            <Container 
            backgroundColor="#0009" flex={1} horizontalAlignment="center"
                verticalAlignment={"flex-end"}
            >
                {
                    action === "withdraw" ? (
                        <BreakCharge setShow={setShow} 
                            setAction={setAction}
                        />
                    ) : null
                }
                {
                    action === "withdraw_wallet" ? (
                        <WithdrawWallet 
                            setShow={setShow} 
                            setAction={setAction}
                            planD={planD}
                        />
                    ) : null
                }

                            {
                                action === "Fund" && !warning ? (
                                    <AddMoney 
                                        setSendPlan={setSendPlan} 
                                        setShow={setShow}
                                        setWarning={setWarning}
                                        type={type}
                                        target_amt={planD ? planD.target_amount : 0}
                                        current_index={planD ? planD.current_index : null}
                                        tab_name={planD ? planD.tab_name : null}
                                    />
                                ) : null
                            }
                            {
                                warning ? (
                                    <Warning setWarning={setWarning} />
                                ) : null
                            }
            </Container>
        </Modal>
      </Page>
    )
}