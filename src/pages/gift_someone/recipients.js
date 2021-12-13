import React, { useEffect,useState } from 'react';
import {
  Page,
  Container,
  TouchWrap,
  SizedBox,
  scaleFont,
} from '@burgeon8interactive/bi-react-library';
import {H1,H2,P,Button,Input,TouchFeedback} from '../../components/component';
import Colors from '../../helpers/colors';
import Feather from 'react-native-vector-icons/Feather';
import {FlatList, ActivityIndicator} from 'react-native';
import {apiFunctions} from '../../helpers/api';
import {useStoreState} from 'easy-peasy';
import { ToastLong, Capitalize } from '../../helpers/utils';
import numeral from 'numeral';
import {silver_plan_id} from '../../helpers/constants';

const Recipients = props => {
    const [isLoading,setLoading] = useState(false);
    const [recipients,setRecipients] = useState([]);
    const {token} = useStoreState(state=>({
        token : state.userDetails.token
    }));
    getGifts = async () =>{
        try{
            setLoading(true);
            let res = await apiFunctions.getGifts(token);
            let recipients = res.gift.filter(item => item.status != 'pending');
            setRecipients(res.gift);
            setLoading(false);
        }catch(error){
            setLoading(false);
            return error.msg ? ToastLong(error.msg) : ToastLong('Opps! Network Error. Please retry');
        }
    }
    useEffect(()=>{
        getGifts();
    },[]);
    return (
        <Page barIconColor="light" backgroundColor={Colors.primary}>
            <>
                <Container paddingHorizontal={6} paddingTop={6} direction="row" verticalAlignment="center" horizontalAlignment="space-between">
                    <TouchFeedback paddingRight={5} paddingTop={1.5} paddingBottom={1.5} onPress={() => props.navigation.goBack()}>
                        <Feather Icon name="chevron-left" size={scaleFont(25)} color="#fff" />
                    </TouchFeedback>
                </Container>
                <SizedBox height={4}/>
                <Container backgroundColor={Colors.white} flex={1} borderTopLeftRadius={50} borderTopRightRadius={50}>
                    <Container horizontalAlignment="center" flex={1}>
                        <SizedBox height={5} />

                        <Container flex={1} widthPercent="100%" paddingHorizontal={6}>
                            <Container paddingHorizontal={3}>
                                <H1 fontSize={20}>
                                    My Gifts
                                </H1>
                            </Container>
                            <SizedBox height={3} />
                            {
                                isLoading && (
                                <Container flex={1} verticalAlignment="center" horizontalAlignment="center">
                                    <ActivityIndicator size="large" color={Colors.primary} />
                                </Container>
                                )
                            }
                            {
                                !isLoading && recipients.length === 0 && (
                                   <Container horizontalAlignment="center" verticalAlignment="center">
                                        <H1>No Record found</H1>
                                    </Container>
                                )
                            }
                            {
                                !isLoading && (
                                <FlatList 
                                    data={recipients} 
                                    extraData={recipients} 
                                    keyExtractor={recipients => recipients.email} 
                                    renderItem={({item, index}) => {
                                    return(
                                        <Container paddingVertical={2}
                                            paddingHorizontal={3}
                                            direction="row"
                                        >
                                            <Container widthPercent="70%">
                                                <P>{item.to_user_email ? `${item.to_user_email}` : `${item.to_user.first_name} ${item.to_user.last_name}`}</P>
                                            </Container>

                                            <Container widthPercent="30%"
                                            verticalAlignment="center"
                                            horizontalAlignment="center"
                                            >
                                                <P>{item.plan === silver_plan_id ? 'Silver' : 'Gold'}</P>
                                            </Container>
                                            {/* <Container widthPercent="30%"
                                            verticalAlignment="center"
                                            horizontalAlignment="center"
                                            >
                                                <P>NGN{item.subscription ? numeral(item.subscription.amount).format('0,0') : "0.00"}</P>
                                            </Container> */}
                                        </Container>
                                    )
                                }} 
                                showsVerticalScrollIndicator={false}
                            />
                                )
                            }
                            
                        </Container>
                    </Container>
                </Container>
            </>
        </Page>
    );
};

export default Recipients;
