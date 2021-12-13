import React, {useState, useEffect} from 'react';
import {AppPageTitle, H1, H2, P, LocalAvatar, Button,TouchFeedback} from '../../components/component';
import {Container, Page, TouchWrap, scaleFont, SizedBox, InputWrap,
    ImageWrap,Avatar, Rounded, ScrollArea} from '@burgeon8interactive/bi-react-library';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../helpers/colors';
import { apiFunctions } from '../../helpers/api';
import { ActivityIndicator,Alert } from 'react-native';
import {useStoreState} from 'easy-peasy';
import {ToastLong} from '../../helpers/utils';
import numeral from 'numeral';
import {gold_plan_id,silver_plan_id} from '../../helpers/constants';

const BuyGift = props => {
    const {token}  = useStoreState(state=>({
        token : state.userDetails.token
    }));
    
    const [isLoading,setLoading] = useState(false);
    const [plans,setPlans] = useState([]);
    const [selectedPlan,setSelectedPlan] = useState(null);
    const getPlans = async () =>{
        try{
            setLoading(true);
            let res = await apiFunctions.getPlans(token);
            let plans = res.filter(item=>[gold_plan_id,silver_plan_id].includes(item.id));
            setPlans(plans);
            setLoading(false);
        }catch(error){
            setLoading(false);
            return ToastLong("Opps! Please check your internet");
        };
    }
    const payNow = () => {
        if(!selectedPlan){
            return Alert.alert('Herconomy','You must select a plan');
        }
        let selected = plans.filter(item=>item.id === selectedPlan);
        if(selected.amount === "0.00"){
            return Alert.alert('Herconomy','Please select a paid plan');
        }
        props.navigation.navigate('GiftPayNow',{selected,friend:props.route.params});
    }
    useEffect(()=>{
        const unsubscribe = props.navigation.addListener('focus', () => {
            getPlans();
          });
          return unsubscribe;
    },[props.navigation]);

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
            <SizedBox height={3}/>
           <ScrollArea flexGrow={1}>
                <Container horizontalAlignment="center" verticalAlignment="center" padding={7}>
                    <H1 fontSize={20}>Buy as a Gift</H1>
                    <P textAlign="center" fontSize={10}>Select a plan to give as a gift</P>
                </Container>
                {
                    !isLoading && plans.length > 0 && plans.map((data,index)=>(
                        <TouchFeedback
                            onPress={()=>setSelectedPlan(data.id)}
                            key={index}
                        >
                            <Container backgroundColor={Colors.whiteBase} marginBottom={3}>
                                <Container
                                    backgroundColor={selectedPlan === data.id ?  Colors.primary : Colors.lightGrey}
                                    paddingVertical={1}
                                    paddingHorizontal={0.5}
                                    borderTopLeftRadius={10}
                                    borderTopRightRadius={10}
                                >
                                    <H1 textAlign="center" fontSize={8} color={Colors.white}>{gold_plan_id === data.id ? 
                                        'Gold Membership' : 'Silver Membership'}</H1>
                                </Container>
                                <Container
                                    horizontalAlignment="center"
                                    verticalAlignment="center"
                                    paddingVertical={5}
                                    borderWidth={1}
                                    borderColor={selectedPlan === data.id ?  Colors.primary : Colors.lightGrey}
                                    borderBottomLeftRadius={10}
                                    borderBottomRightRadius={10}
                                >
                                    <H1>&#x20A6;{numeral(Number(data.amount) / 100).format('0,0')}</H1>
                                    {
                                        gold_plan_id === data.id && (
                                            <>
                                                <SizedBox height={1}/>
                                                <Container backgroundColor={Colors.primaryFaded} padding={1}>
                                                    <H1 fontSize={1}>MOST POPULAR</H1>
                                                </Container>
                                            </>
                                        )
                                    }
                                    <SizedBox height={1}/>
                                    {
                                        data.interval !== null && (
                                            <Container
                                                paddingHorizontal={7}
                                            >
                                                <P fontSize={4}>{
                                                    gold_plan_id === data.id ? '1 year membership + access to Herconomy network.' : 
                                                    '1 month membership, grants access to Groups, Messaging and Resources.'
                                                }</P>
                                            </Container>
                                        )
                                    }
                                </Container>
                            </Container>
                        </TouchFeedback>
                    )) 
                }
                {
                    isLoading && (
                        <> 
                            <ActivityIndicator size="large" color={Colors.primary}  />
                        </>
                    )
                }
                <Container horizontalAlignment="center" marginTop={3}>
                    <Button title="Continue" borderRadius={5} onPress={()=>payNow()}/>
                </Container>
                <SizedBox height={4}/>
           </ScrollArea>
        </Container>
      </Page>
    </>
  );
};

export default BuyGift;
