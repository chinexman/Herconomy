import React, { useEffect, useState } from 'react';
import { Container,ImageWrap,Page,scaleFont,SizedBox, TouchWrap } from "@burgeon8interactive/bi-react-library";
import { H1, TouchFeedback,P,H2,
    LottieIcon,
    SavingsLoader
} from '../../../components/component';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../helpers/colors';
import { ScrollView } from 'react-native-gesture-handler';
import numeral from 'numeral';
import failedPNG from '../../../../assets/img/failed.png';
import depositPNG from '../../../../assets/img/deposit.png';
import withdrawalPNG from '../../../../assets/img/withdrawal.png';
import moment from 'moment';
import Empty from '../../../../assets/lottie/empty.json'
import { Retry } from '../../../components/retry';
import { handleQuery } from '../../../helpers/api';
import { getData } from '../../../helpers/functions';


export const Transactions = (props) => {
    const [current,setCurrent] = React.useState(0)
    const [transactions,setTransactions] = useState([]);
    const [retry,setRetry] = useState(false);
    const [loading,setLoading] = useState(false);
    const [plans,setPlans] = useState([]);
    const [holders,setHolders] = useState([])
    const getTransactions = async () => {
        try{
            const {type,id} = props && props.route && props.route.params ? props.route.params : {
                type : "All", id : "All"
            };
            setLoading(true);
            setRetry(false);
            let gql_token = await getData('gql_token');
            let gql_user = await getData('gql_user')
            let condition;
            if(!type){
                condition = `{user_id :${gql_user.id}}`
            }
            if(type == "All" || type === "Wallet"){
                condition = `{user_id :${gql_user.id}}`
            }
            if(type === "plan"){
                condition = `{user_id : ${gql_user.id},user_savings_challenge:${id}}`
            }
            if(type === "goal"){
                condition = `{user_id : ${gql_user.id},user_goal:${id}}`
            }
            let query = `query{
                goals : userGoals(
                    where : {user_id :${gql_user.id}}
                    sort: "created_at:desc"
                ){
                    id
                    title
                    next_payment_date
                }
                
                transactions : transactions(
                    where : ${condition}
                    sort: "created_at:desc"
                ){
                    id
                    amount
                    destination
                    description
                    source
                    created_at
                    transaction_type
                    status
                    user_id{
                      id
                    }
                    user_goal{
                      id
                      title
                    }
                    user_savings_challenge{
                        id
                        saving_challenges_id{
                          id
                          title
                        }
                    }
                    transaction_type
                  }
                
                savings :  userSavingsChallengesConnection(
                    where : {user_id : ${gql_user.id}}
                    sort: "created_at:desc"
                ){
                    values{
                        id
                        saving_challenges_id{
                            title
                        }
                        amount_saved
                    }
                }
            }`
            console.log("query>>}}",query)
            let res = await handleQuery(query,gql_token);
            setTransactions(res.data.transactions)
            setHolders(res.data.transactions)
            let savings = res && res.data && res.data.savings && res.data.savings.values ?
            res.data.savings.values : [];
            let goals = res && res.data && res.data.goals ? res.data.goals : [];
            let plans = ["All","Wallet",...goals,...savings];
            let current_index = undefined;
            if(id === "All"){
                current_index = 0
                setCurrent(current_index)
            }
            if(id === "Wallet"){
                current_index = 1
                setCurrent(current_index)
            }
            if(current_index === undefined && id !== "Wallet" && id !== "All"){
                current_index = plans.map((item)=>{
                    if(type === "goal"){
                        return item.id
                    }
                    if(type === "plan"){
                        return item.id
                    }
                    return false;
                }).indexOf(id)
                plans.splice(2,1,plans[current_index])
                plans = plans.splice(0,3)
                setCurrent(2)
            }
            setPlans(plans);
            setLoading(false)
        }catch(err){    
            console.log("err",err);
            setRetry(true)
        }
    }
    useEffect(()=>{
        getTransactions()
    },[])
    return(
        <Page backgroundColor={Colors.primary}>
        <Container paddingHorizontal={6} paddingTop={6} backgroundColor={Colors.primary} direction="row">
            <TouchWrap paddingRight={2} paddingBottom={2} paddingTop={2} onPress={() => props.navigation.goBack()}>
                <Feather Icon name="chevron-left" size={scaleFont(25)} color="#fff" />
            </TouchWrap>
          <Container backgroundColor={Colors.primary} paddingHorizontal={6} 
              paddingTop={0.5} paddingBottom={3}
              widthPercent="80%"
              horizontalAlignment="center"
          >
              <H1 fontSize={20} color={Colors.whiteBase}>
                  Transactions
              </H1>
          </Container>
        </Container>
        <Container flex={1} backgroundColor={Colors.white} marginTop={2} borderTopLeftRadius={50} 
          borderTopRightRadius={50}
          paddingHorizontal={3}
        >
          <SizedBox height={6}/>

            <Container
                borderBottomWidth={0.7}
                borderColor={Colors.line}
            >
                <ScrollView 
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    <Container direction="row" verticalAlignment="center" 
                        horizontalAlignment="space-between" 
                        padding={3} marginRight={10}
                    >
                    {
                        plans && plans.map((item,index)=>(
                            <TouchWrap
                                onPress={()=>{
                                    let is_savings = item.saving_challenges_id ? true : false;
                                    if(item === "All") {
                                        setCurrent(index)
                                        return setTransactions(holders)
                                    }
                                    if(item === "Wallet"){
                                        let data = holders && Array.isArray(holders) && holders.filter((tran,i)=>{
                                            return tran && tran.source === "wallet"
                                        })
                                        setCurrent(index)
                                        return setTransactions(data)
                                    }
                                    if(is_savings){
                                        let data = holders && Array.isArray(holders) && holders.filter((tran,i)=>(
                                            tran && tran.user_savings_challenge && tran.user_savings_challenge
                                            && tran.user_savings_challenge.id === item.id
                                        ))
                                        setTransactions(data)
                                    }
                                    if(!is_savings){
                                        let data = holders && Array.isArray(holders) && holders.filter((tran,i)=>(
                                            tran && tran.user_goal && tran.user_goal
                                            && tran.user_goal.id === item.id
                                        ))
                                        setTransactions(data)
                                    }
                                    setCurrent(index)
                                }}
                                key={index}
                            >
                                <Container
                                    marginRight={6}
                                    marginBottom={2}
                                    backgroundColor={current === index ? Colors.primary : Colors.white}
                                    paddingVertical={1.2}
                                    paddingHorizontal={3}
                                    borderRadius={3}
                                >
                                    <H2 fontSize={8}
                                        color={current === index ? Colors.whiteBase : Colors.text}
                                    >{index === 0 ? 'All' : index === 1 ? "Wallet" : item && item.saving_challenges_id && item.saving_challenges_id.title 
                                    ? item.saving_challenges_id.title : item && item.title ? item.title  : ""
                                }</H2>
                                </Container>
                            </TouchWrap>
                        ))
                    }
                    </Container>
                </ScrollView>
            </Container>

          <ScrollView showsVerticalScrollIndicator={false}>
              <Container>

                  <Container marginBottom={6} marginTop={3}>
                    {
                        !loading && transactions && Array.isArray(transactions) && transactions.length > 0 ? transactions.map((item,index)=>(
                            <TouchWrap key={index}
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
                                    horizontalAlignment="space-between"
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
                                                item.transaction_type === "withdraw" ? withdrawalPNG :  item && 
                                                item.status === "PENDING" ?
                                                withdrawalPNG : 
                                                failedPNG
                                            }
                                        />
                                    </Container>
                                    <Container verticalAlignment="center"
                                        widthPercent="60%"
                                        paddingRight={5}
                                    >
                                        <H2 fontSize={8}>{item.description}</H2>
                                        {
                                            item.destination === "goal" ? (
                                                <P fontSize={5}
                                                    color={Colors.otherText}
                                                >{item.user_goal && item.user_goal.title ? item.user_goal.title : "goal"}</P>
                                            ) : item.destination === "savings plan"  ? (
                                                <P fontSize={5}
                                                    color={Colors.otherText}
                                                >{item.user_savings_challenge && item.user_savings_challenge.saving_challenges_id
                                                && item.user_savings_challenge.saving_challenges_id.title ? item.user_savings_challenge.saving_challenges_id.title : "savings plan"}</P>
                                            ) : (
                                                <P fontSize={5}
                                                    color={Colors.otherText}
                                                >{item.destination}</P>
                                            )
                                        }
                                    </Container>
                                    <Container widthPercent="27%">
                                        <H1 fontSize={9}
                                            numberOfLines={1}
                                        >&#8358;{numeral(item.amount).format('0,0')}</H1>
                                        <P fontSize={5}>{item.created_at ? moment(item.created_at).format('ddd DD MMM, YYYY') : ""}</P>
                                    </Container>
                                </Container>
                            </TouchWrap>
                        )) : null
                    }
                    {
                        loading ? (
                            <SavingsLoader />
                        ) : null
                    }
                    {!loading && transactions && transactions.length == 0 ? (
                            <Container horizontalAlignment="center">
                                <LottieIcon icon={Empty} />
                            </Container>
                    ) : null }
                  </Container>
              </Container>
          </ScrollView>
        </Container>
        {
            retry ? (
                <Retry funcCall={getTransactions} param={[]}/>
            ) : null
        }
      </Page>
    )
}