import React from 'react';
import { Container,ImageWrap,Page,scaleFont,ScrollArea,SizedBox, TouchWrap } from "@burgeon8interactive/bi-react-library";
import { H1, TouchFeedback,P,H2, Button, CheckBok ,TransferMoney,
    TransferPlan,
    FundWallet,
    Warning,
    SavingsLoader,
    LottieIcon
} from '../../../components/component';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../helpers/colors';
import { ScrollView } from 'react-native-gesture-handler';
import numeral from 'numeral';
import { getData, storeData } from '../../../helpers/functions';
import { Capitalize, ToastLong } from '../../../helpers/utils';
import { handleQuery } from '../../../helpers/api';
import { useStoreState } from 'easy-peasy';
import { Retry } from '../../../components/retry';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/core';
import Empty from '../../../../assets/lottie/empty.json'


const PlanBox = ({item,index,navigation,tab}) => (
    <TouchWrap
        key={index}
        onPress={async ()=>{
            let plan = item.saving_challenges_id  ? {
                id: item.id,
                title:  item.saving_challenges_id && item.saving_challenges_id.title ? 
                item.saving_challenges_id.title : "",
                target_amount : item.target_amount,
                amount_saved : item.amount_saved,
                start_date: item.start_date,
                end_date : item.saving_challenges_id && item.saving_challenges_id.maturity_date ? 
                item.saving_challenges_id.maturity_date : "",
                description: item.saving_challenges_id && item.saving_challenges_id.description ? 
                item.saving_challenges_id.description : "",
                roi : item.roi ? item.roi : 0,
                percentage: item.percentage,
                frequency: item.frequency,
                current_index : index,
                status : item.status,
                tab_name : tab
            } : {...item,current_index : index,tab_name : tab}
            await storeData("single_plan",plan)
            navigation.navigate('SinglePlan',{type : item.saving_challenges_id ? 'challenge' : 'goal'});
        }}
    >
        <Container
            backgroundColor={Colors.whiteBase}
            marginBottom={2}
            paddingVertical={3}
            paddingHorizontal={5}
            borderRadius={10}
        >
            <Container>
                {
                    item.saving_challenges_id ? (
                        <H2 fontSize={8}>{item.saving_challenges_id.title ? Capitalize(item.saving_challenges_id.title) : ""}</H2>
                    ) : (
                        <H2 fontSize={8}>{item.title ? Capitalize(item.title) : ""}</H2>
                    )
                }
                <SizedBox height={1.5} />
                <H1>&#8358;
                    {
                        item.amount_saved ? numeral(item.amount_saved).format('0,0.00')
                        : '0.00'
                    }
                </H1>
                <SizedBox height={1.5} />
                <Container direction="row" verticalAlignment="center">
                    <Container 
                        widthPercent="80%"
                        verticalAlignment="center"
                    >
                        <Container backgroundColor={Colors.white} 
                            height={1}
                            borderRadius={5}
                        >
                            <Container 
                                height={1}
                                borderRadius={5}
                                backgroundColor={Colors.primary}
                                widthPercent={`${item && item.percentage > 100 ? 100 :  
                                    item && item.percentage < 100 ? numeral(item.percentage).format('0') : 0}%`}
                            />
                        </Container>
                    </Container>
                    <Container widthPercent="20%"
                        verticalAlignment="center"
                        horizontalAlignment="flex-end"
                    >
                        <H2>{`${item && item.percentage > 100 ? 100 :  
                                    item && item.percentage < 100 ? numeral(item.percentage).format('0') : 0}%`}</H2>
                    </Container>
                </Container>
                {
                    item.saving_challenges_id ? (
                        <P fontSize={5}>
                            {item.saving_challenges_id && item.saving_challenges_id.maturity_date
                                &&
                                moment(item.saving_challenges_id.maturity_date).diff(moment(new Date),'days') > 0 
                                ? moment(item.saving_challenges_id.maturity_date).diff(moment(new Date),'days') : '0'
                            }
                            {' '}
                            {
                                item.saving_challenges_id && item.saving_challenges_id.maturity_date
                                &&
                                    moment(item.saving_challenges_id.maturity_date).diff(moment(new Date),'days') > 1 
                                    ? 'days left' : 
                                "day left"
                            } 
                        </P>
                    ) : (
                        <P fontSize={5}>
                            {
                            item.end_date && moment(item.end_date).diff(moment(new Date),'days') > 0 ? 
                            moment(item.end_date).diff(moment(new Date),'days') : 0
                            } 
                            {' '}
                            {
                                moment(item.end_date).diff(moment(new Date),'days') > 1 ? 'days left' : 
                                "day left"
                            } 
                        </P>
                    )
                }
            </Container>
        </Container>
    </TouchWrap>
)

export const Plans = (props) => {
    const [current,setCurrent] = React.useState('All');
    const [retry,setRetry] = React.useState(false);
    const [goals,setGoals] = React.useState(null);
    const [challenges,setChallenges] = React.useState(null);
    const [loading,setLoading] = React.useState(false)
    const {gql_token} = useStoreState((state)=>({
        gql_token : state.userDetails.gql_token
    }))
    const [payload,setPayload] = React.useState([]);
    const fetchData = async () => {
        try{
            setLoading(true)
            setRetry(false);
            let user = await getData('gql_user')
            let query = `query{
                challenges : userSavingsChallenges(
                    where : {user_id : ${user.id}}
                    sort: "created_at:desc"    
                ){
                  id
                  amount_saved
                  percentage
                  target_amount
                  start_date
                  percentage
                  frequency
                  roi
                  status
                  saving_challenges_id{
                    title
                    description
                    amount_to_be_saved
                    maturity_date
                  }
                }
                goals : userGoals(
                    where : {user_id : ${user.id}}
                    sort: "created_at:desc"    
                ){
                  id
                  title
                  target_amount
                  amount_saved
                  start_date
                  end_date
                  description
                  percentage
                  frequency
                  status
                  roi
                }
              }`;
            let res = await handleQuery(query,gql_token)
            console.log("handleQuery-plans",res.data.challenges,res.data.goals)
            let challenges = res && res.data && res.data.challenges ? res.data.challenges : []
            let goals = res && res.data && res.data.goals ? res.data.goals : []
            setCurrent("All");
            setPayload([...challenges,...goals])
            setChallenges(challenges)
            setGoals(goals)
            setLoading(false);
        }catch(err){
            console.log("Err",err)
           setRetry(true);
        }
    }
    useFocusEffect(React.useCallback(()=>{
        fetchData()
    },[]))
    return(
        <Page backgroundColor={Colors.primary} >
        <Container paddingHorizontal={6} paddingTop={6} backgroundColor={Colors.primary} direction="row">
            <TouchWrap paddingRight={2} paddingBottom={2} paddingTop={2} onPress={() => props.navigation.navigate('Savings')}>
                <Feather Icon name="chevron-left" size={scaleFont(25)} color="#fff" />
            </TouchWrap>
          <Container backgroundColor={Colors.primary} paddingHorizontal={6} 
              paddingTop={0.5} paddingBottom={3}
              widthPercent="80%"
              horizontalAlignment="center"
          >
              <H1 fontSize={18} color={Colors.whiteBase}>
                  Plans
              </H1>
          </Container>
        </Container>
        
        <Container flex={1} backgroundColor={Colors.white} marginTop={2} borderTopLeftRadius={50} 
          borderTopRightRadius={50}
          paddingHorizontal={3}
        >
          <SizedBox height={6}/>
          <Container direction="row"
            horizontalAlignment="space-evenly"
          >
                {
                    ["All",'Savings Plan','Personal Goals',"Completed"].map((item,index)=>(
                            <Container
                                borderBottomWidth={current === item ? 2 : 0}
                                widthPercent="25%"
                                paddingBottom={0.5}
                                key={index}
                            >
                                <TouchWrap
                                    onPress={()=>{
                                        let data;
                                        if(item === "All"){
                                            data = challenges && goals &&
                                            Array.isArray(goals) ? [...challenges,...goals] : []
                                        }
                                        if(item === "Savings Plan"){
                                            data = challenges && Array.isArray(challenges) ? challenges.filter(item=>(
                                                item.status !== "Completed"
                                            )) : []
                                        }
                                        if(item === "Personal Goals"){
                                            data = goals && Array.isArray(goals) ? goals.filter(item=>(
                                                item.status !== "Completed"
                                            )) : []
                                        }
                                        if(item === "Completed"){
                                            data = challenges && goals && Array.isArray(challenges) && Array.isArray(goals)
                                             ? [...challenges,...goals].filter(item=>(
                                                item.status === "Completed"
                                            )) : []
                                        }
                                        console.log("payload",data)
                                        setPayload(data);
                                        setCurrent(item)
                                    }}
                                >
                                    <H2 fontSize={8}
                                        textAlign="center"
                                        color={current === item ? Colors.text : Colors.otherText}
                                    >
                                        {item === "Personal Goals" ? "Goals" : 
                                            item === "Savings Plan" ? "Plans" : item
                                        }
                                    </H2>
                                </TouchWrap>
                            </Container>
                    ))
                }
            </Container>
            <ScrollArea showsVerticalScrollIndicator={false}>
                {
                    loading ? (
                        <SavingsLoader />
                    ) : (
                        <Container marginBottom={6} marginTop={3}>
                            {
                                !loading && payload.length === 0
                                ? (
                                    <Container horizontalAlignment="center">
                                        <LottieIcon icon={Empty} />
                                    </Container>
                                ) : null
                            }
                            {
                                payload && Array.isArray(payload) ? payload.map((item,index)=>(
                                    <PlanBox item={item} 
                                        index={index} navigation={props.navigation} key={index} 
                                        tab={current}
                                    />
                                )) : null
                            }
                        </Container>
                    )
                }
            </ScrollArea>
        </Container>
            {
                retry ? (
                    <Retry funcCall={fetchData} param={[]} />
                ) : null
            }
            <TouchWrap paddingVertical={3}
                onPress={()=>{
                    props.navigation.navigate('GoalName')
                }}
            >
                <Container backgroundColor={Colors.primary}>
                    <H1 textAlign="center" color={Colors.whiteBase}>Create a Goal</H1>
                </Container>
            </TouchWrap>
      </Page>
    )
}