import React, {useState, useEffect} from 'react';
import {AppPageTitle, H1, H2, P, LocalAvatar, Button,TouchFeedback} from '../components/component';
import {Container, Page, TouchWrap, scaleFont, SizedBox, InputWrap,
    ImageWrap,Avatar, Rounded, ScrollArea} from '@burgeon8interactive/bi-react-library';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../helpers/colors';
import {FlatList, ActivityIndicator} from 'react-native';
import {Dialog} from 'react-native-simple-dialogs';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useStoreState, useStoreActions} from 'easy-peasy';
import Pay1 from '../../assets/img/icons/watch.png';
import Pay2 from '../../assets/img/icons/people.png';
import Pay3 from '../../assets/img/icons/naira.png';
import PlanLady1 from '../../assets/img/silver_lady.png'; 
import { ToastLong } from '../helpers/utils';
import { apiFunctions } from '../helpers/api';
import moment from 'moment';
import {gold_plan_id,silver_plan_id} from '../helpers/constants';
import { Retry } from '../components/retry';



const Account = props => {
    const [isLoading,setLoading] = useState(false);
    const [subscriptionStatus,setSubscriptionStatus] = useState({sub_status : false});
    const [retry,showRetry] = useState(false);
    const {userD,token} = useStoreState(state => ({
        userD: state.userDetails.user,
        token : state.userDetails.token
    }));
    const  {_updateSubscriptionStatus} = useStoreActions(actions=>({
        _updateSubscriptionStatus: actions.userDetails.updateSubscriptionStatus
    }));

    const getPlan = async () =>{
        try{
            setLoading(true);
            let res = await apiFunctions.subscriptionStatus(token);
            showRetry(false);
            setSubscriptionStatus(res);
            _updateSubscriptionStatus(res);
            setLoading(false);
        }catch(error){
            setLoading(false);
            showRetry(true);
        }
    }

    useEffect(()=>{
        const unsubscribe = props.navigation.addListener('focus', () => {
            getPlan();
        });
        return unsubscribe;
    },[
        props.navigation
    ]);

  return (
    <>
      <Page barIconColor="light" backgroundColor={Colors.primary}>
        <Container paddingHorizontal={6} paddingTop={6} direction="row" horizontalAlignment="space-between">
            <TouchFeedback paddingRight={2} paddingBottom={2} paddingTop={2} onPress={() => props.navigation.navigate("Settings")}>
            <Feather Icon name="chevron-left" size={scaleFont(20)} color="#fff" />
            </TouchFeedback>
        </Container>
        <SizedBox height={3} />
        <Container backgroundColor={Colors.white} flex={1} paddingHorizontal={6} borderTopLeftRadius={50} borderTopRightRadius={50}>
            <SizedBox height={3}/>
            <ScrollArea flexGrow={1}>
                <Container
                    backgroundColor={Colors.lightPrimary}
                    marginTop={5}
                    borderRadius={5} 
                    marginBottom={5}
                >
                    <SizedBox height={2}/>
                    <ImageWrap source={PlanLady1} fit="contain" height={20} />
                    <Container horizontalAlignment="center" verticalAlignment="center" padding={7}>
                        <Container paddingHorizontal={3}>
                            <H1 fontSize={15}>
                                {userD.email}
                            </H1>
                        </Container>
                        <SizedBox height={3} />
                        <P>You are on</P>
                        {
                            isLoading ? (
                                <ActivityIndicator size="small" color={Colors.button} />
                            ) : (
                                <H1 fontSize={15}>
                                    {!subscriptionStatus.sub_status ? 'Free Plan' : subscriptionStatus.plan.id === gold_plan_id ? 'Gold Plan' : 'Silver Plan'}
                                </H1>
                            )
                        }
                        {
                            !isLoading && subscriptionStatus.sub_status && subscriptionStatus.plan && subscriptionStatus.plan.id && (
                                <>
                                    <H1 fontSize={10}>
                                        Next Payment Date: {subscriptionStatus.next_payment_date && moment(subscriptionStatus.next_payment_date).format('DD MMM, YYYY')}
                                    </H1>
                                    {
                                        subscriptionStatus.plan.id === gold_plan_id && (
                                            <SizedBox height={5}/>
                                        )
                                    }
                                </>
                            )
                        }
                    </Container>
                    <Container paddingLeft={7} paddingRight={7}>
                        {
                            !isLoading && subscriptionStatus.sub_status && subscriptionStatus.plan && subscriptionStatus.plan.id !== gold_plan_id && (
                                <P>
                                    Upgrade to the Gold Plan to join the Herconomy network and enjoy up to 30% discounts with top brands. 
                                </P>
                            )
                        }
                        {
                            !isLoading && !subscriptionStatus.sub_status && (
                                <P>
                                    Upgrade to a paid membership to interact with people of like minds in Groups, chat directly to members and even more, unlock exclusive shopping discounts with the Gold plan.  
                                </P>
                            )
                        }
                    </Container>
                    {
                        !isLoading && subscriptionStatus.sub_status && subscriptionStatus.plan && subscriptionStatus.plan.id !== gold_plan_id && (
                            <Container padding={10} horizontalAlignment="center">
                                <Button borderRadius={5} onPress={()=>props.navigation.navigate('Upgrade',{tabs:[gold_plan_id]})} title="Upgrade to GOLD" />
                            </Container>
                        )
                    }
                    {
                        !isLoading && !subscriptionStatus.sub_status && (
                            <Container padding={10} horizontalAlignment="center">
                                <Button borderRadius={5} onPress={()=>props.navigation.navigate('Upgrade',{tabs:[silver_plan_id,gold_plan_id]})} title="Upgrade" />
                            </Container>
                        )
                    }
                    {
                        retry ? (
                            <Retry funcCall={getPlan} param={[]} />
                        ) : null
                    }
                </Container>
           </ScrollArea>
        </Container>
      </Page>
      
    </>
  );
};

export default Account;
