import React, { useEffect, useRef } from 'react';
import { Container,ImageWrap,Page,scaleFont,SizedBox, TouchWrap } from "@burgeon8interactive/bi-react-library";
import { H1, TouchFeedback,P,H2, Button, CheckBok ,TransferMoney,
    TransferPlan,
    FundWallet,
    Warning,
    SavingsLoader
} from '../../../components/component';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../helpers/colors';
import { ScrollView } from 'react-native-gesture-handler';
import numeral from 'numeral';
import {Picker} from '@react-native-picker/picker';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";
import { Dimensions } from 'react-native';
import { handleQuery } from '../../../helpers/api';
import { Retry } from '../../../components/retry';
import { getData } from '../../../helpers/functions';


export const Performance = (props) => {

    const [retry,setRetry] = React.useState(false)
    const [savings,setSavings] = React.useState(false);
    const [interests,setInterest] = React.useState([]);
    const [fetching,setFetching] = React.useState(false);

    const getPerformance = async () => {
        try{
          let gql_user = await getData('q_user');
          let gql_token = await getData('gql_token')
          setFetching(true)
          setRetry(false)
          let query = `query{
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
    
            total_interests : interestsConnection(where : {user_id : 1}){
              aggregate{
                sum{
                  interested_amount
                }
              }
            }
            interests : interests(where : {user_id : 1}){
                id
                amount
                interested_amount
                created_at
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
          let goals_saving = {
            amount_saved : res.data && res.data.goals_tot_amt && 
            res.data.goals_tot_amt.aggregate && res.data.goals_tot_amt.aggregate.sum ? 
            res.data.goals_tot_amt.aggregate.sum 
            && res.data.goals_tot_amt.aggregate.sum && 
            res.data.goals_tot_amt.aggregate.sum.amount_saved : 0
          }
          let interest = res.data && res.data.total_interests && 
          res.data.total_interests.aggregate && res.data.total_interests.aggregate.sum ? 
          res.data.total_interests.aggregate.sum 
          && res.data.total_interests.aggregate.sum && 
          res.data.total_interests.aggregate.sum.amount : 0;
    
        
          let interests = res.data && res.data.interests ? res.data.interests : [];
          console.log("interests||",interests)
          setInterest(interests);
          let chall_savings = {
            amount_saved : res.data && res.data.chall_tot_amt && 
            res.data.chall_tot_amt.aggregate && res.data.chall_tot_amt.aggregate.sum ? 
            res.data.chall_tot_amt.aggregate.sum 
            && res.data.chall_tot_amt.aggregate.sum && 
            res.data.chall_tot_amt.aggregate.sum.amount_saved : 0
          }
          setSavings({
            amount_saved : (chall_savings.amount_saved || 0) + (goals_saving.amount_saved || 0),
            interest : interest
          })
          setFetching(false)
        }catch(err){
            setRetry(true)
          console.log("err",err)
        }
      }
    
      React.useEffect(()=>{
        getPerformance();
      },[])

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
                  Performance
              </H1>
          </Container>
        </Container>
        <Container flex={1} backgroundColor={Colors.white} marginTop={2} borderTopLeftRadius={50} 
          borderTopRightRadius={50}
          paddingHorizontal={3}
        >
          <SizedBox height={3}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                {
                    fetching ? (
                        <SavingsLoader />
                    ) : (
                        <Container 
                            verticalAlignment="center"
                            backgroundColor={Colors.lightYellow}
                            paddingVertical={5}
                            borderRadius={10}
                            marginTop={2}
                        >
                            <Container>
                                <H1 textAlign="center" fontSize={5}>Performance</H1>
                                <H1 textAlign="center"
                                    fontSize={15}
                                >&#8358;{savings.amount_saved && savings.amount_saved ? 
                                    numeral(savings.amount_saved).format("0,0.00") : "0.00"}</H1>
                            </Container>
                            <Container marginTop={5}
                                marginBottom={3}
                                direction="row"
                                horizontalAlignment="space-evenly"
                            >
                                <Container direction="row"
                                    verticalAlignment="center"
                                >
                                    <P fontSize={5}>Savings</P> 
                                    <SizedBox width={0.8} />
                                    <Feather name={"play"} 
                                        size={8}
                                        color={Colors.primary}
                                    />
                                    <SizedBox width={0.8} />
                                    <H1
                                    fontSize={5}
                                >&#8358;{savings.amount_saved && savings.amount_saved ? 
                                    numeral(savings.amount_saved).format("0,0.00") : "0.00"}</H1>
                                </Container>
        
                                <Container direction="row"
                                    verticalAlignment="center"
                                >
                                    <P fontSize={5}>Returns</P> 
                                    <SizedBox width={0.8} />
                                    <Feather name={"play"} 
                                        size={8}
                                        color={Colors.primary}
                                    />
                                    <SizedBox width={0.8} />
                                    <H1
                                    fontSize={5}
                                >&#8358;{savings.interest && savings.interest ? 
                                    numeral(savings.interests).format("0,0.00") : "0.00"
                                }</H1>
                                </Container>
                            </Container>
                            <LineChart
                                data={{
                                labels: ["S", "M", "T", "W", "T", "F","S"],
                                datasets: [
                                    {
                                        data: [
                                            Math.random() * 100,
                                            Math.random() * 100,
                                            Math.random() * 100,
                                            Math.random() * 100,
                                            Math.random() * 100,
                                            Math.random() * 100,
                                            Math.random() * 100
                                        ]
                                    }
                                ]
                                }}
                                width={Dimensions.get("window").width} // from react-native
                                height={220}
                                yAxisLabel=""
                                yAxisSuffix="k"
                                yAxisInterval={1} // optional, defaults to 1
                                withDots={false}
                                withInnerLines={false}
                                chartConfig={{
                                backgroundColor: Colors.greyBase300,
                                backgroundGradientFrom: Colors.lightYellow,
                                backgroundGradientTo: Colors.lightYellow,
                                decimalPlaces: 2, // optional, defaults to 2dp
                                color: (opacity = 0) => Colors.primary,
                                labelColor: (opacity = 1) => Colors.black,
                                // style: {
                                //     borderRadius: 16
                                // },
                                // propsForDots: {
                                //     //r: "6",
                                //     //strokeWidth: "0",
                                //     //stroke: "#ffa726"
                                // }
                                }}
                                withVerticalLines={false}
                                withHorizontalLines={false}
                                bezier
                                style={{
                                marginVertical: 8,
                                //borderRadius: 16
                                }}
                            />
                        </Container>
                    )
                }
            </ScrollView>
        </Container>
        {
            retry ? (
                <Retry funcCall={getPerformance} param={[]}/>
            ) : null
        }
      </Page>
    )
}