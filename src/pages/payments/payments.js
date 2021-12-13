import React, {useRef, useEffect,useState} from 'react';
import {AppPageBack, H1, P, Button, H2} from '../../components/component';
import {Container, SizedBox, ScrollArea, ImageWrap, Avatar, scaleFont} from '@burgeon8interactive/bi-react-library';
import Feather from 'react-native-vector-icons/Feather';
import Swiper from 'react-native-swiper';
import {ScrollView} from 'react-native-gesture-handler';
import numeral from 'numeral';
import Colors from '../../helpers/colors';
import PlanLady from '../../../assets/img/plan_lady.png';
import { ToastLong } from '../../helpers/utils';
import {useStoreState} from 'easy-peasy'
import {apiFunctions} from '../../helpers/api';
import {FONTSIZE, gold_plan_id,silver_plan_id} from '../../helpers/constants'; 
import { storeData } from '../../helpers/functions';

const Plans = [
  {
    name: 'Silver',
    price: 5000,
    period: 'Monthly',
    desc: 'Billed monthly',
    type: 'month',
    popular: false,
    id : silver_plan_id,
    currency: 'NGN',
    feature: [
      'Features Include:',
      'All features in free plan',
      'Unlimited Direct Messages - Reach out to anyone in the community and send a direct message to expand your network',
      'Resources - Access to live events and webinars with industry leaders.',
      //'Group - Groups allow you to start conversation with like-minded people, who share the same goals and/or interests.',
      'Referral Bonus - Get N500 if you refer someone who becomes a Silver Member.',
    ],
  },
  {
    name: 'Gold',
    price: 50000,
    period: 'Annually',
    desc: 'Billed annually',
    type: 'year',
    popular: true,
    currency: 'NGN',
    id : gold_plan_id,
    feature: [
      'Features Include:',
      'All features in silver plan',
      'Referral Bonus - Get N1,000 if you refer someone who becomes a Gold Member',
      'Get up to 30% discounts on products and services from some of the best brands in Africa through the Tribe Gold Card'
    ],
  },
];

const Payments = props => {
  const swiper = useRef(null);
  const tabs = props.route.params ? props.route.params.tabs : [silver_plan_id,gold_plan_id];
  const [sub_plans,setPlans] = useState([]);
  const [isLoading,setLoading] = useState(false);
  const {token} = useStoreState(state => ({
    token : state.userDetails.token
  }));
  const getPlans = async  () => {
    try{
        storeData("initial_url",null);
        setLoading(true);
        let res1 = await apiFunctions.getPlans(token);
        let plans =  res1.filter(value=>Number(value.amount) > 0 && tabs.includes(value.id)).sort((a,b)=>a.id - b.id);
        setPlans(plans);
        setLoading(false); 
    }catch(error){
      setLoading(false);
      error.msg ? ToastLong(error.msg) : ToastLong('Opps! Network error. Please retry');
    }
  }
  useEffect(()=>{
    getPlans();
  },[])
  return (
    <AppPageBack title="Choose A Plan" {...props} color={Colors.whiteBase}>
      <Container flex={1} paddingBottom={2}>
        <SizedBox height={1}/>
        {
          tabs.length > 1  ? (
            <ScrollView horizontal={true} pagingEnabled={false} 
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              >
                {Plans.filter(item=>tabs.includes(item.id)).map((el, i) => (
                  <Container key={i} 
                      width={72}
                      marginRight={5} 
                      backgroundColor={i === 0 ? Colors.white : '#f9f0db'} 
                      borderTopLeftRadius={10}
                      borderTopRightRadius={10}
                      marginTop={5}>
                    <ScrollArea>
                      <Container marginTop={4}>
                        <ImageWrap source={PlanLady} height={20} fit="contain"/>
                      </Container>
                      <Container
                        backgroundColor={i === 0 ? Colors.white : '#f9f0db'}
                        horizontalAlignment="center"
                        marginTop={4}
                        marginBottom={2}
                        padding={3}
                        paddingVertical={2}
                        borderRadius={5}>
                        <H1 color={Colors.black} fontSize={22}>
                          {el.name.toUpperCase()}
                        </H1>
                        <H1 color={Colors.black} fontSize={22}>
                          N{numeral(el.price).format('0,0')} / <P>{el.type === 'month' ? "per month" : "per annum"}</P>
                        </H1>
                      </Container>
                      <Container marginBottom={6} widthPercent="100%" padding={tabs.length > 1 ? 0 : 4}>
                        {el.feature.map((ell, ii) => (
                          <Container paddingVertical={1.5} direction="row" flex={1} verticalAlignment="center" key={ii}>
                            <SizedBox width={3} />
                            <Feather name="check" color={Colors.lightGreen} size={scaleFont(15)}/>
                            <SizedBox width={2}/>
                            <Container flex={1}>
                              <P fontSize={FONTSIZE.medium}>{ell}</P>
                            </Container>
                          </Container>
                        ))}
                      </Container>
                    </ScrollArea>
                    <SizedBox height={1} />
                    <Button loading={isLoading} title="Choose Plan" onPress={() => {
                      if(isLoading || sub_plans.length === 0){
                        getPlans();
                        return false
                      }
                      props.navigation.navigate('PaymentOption', {selected : sub_plans[i]})
                    }} />
                  </Container>
                ))}
              </ScrollView>
          ) : (
            <ScrollView horizontal={false} pagingEnabled={false} 
            showsHorizontalScrollIndicator={false}
             showsVerticalScrollIndicator={false}
            >
              {Plans.filter(item=>tabs.includes(item.id)).map((el, i) => (
                <Container key={i} 
                    widthPercent="100%"
                    marginRight={5} 
                    backgroundColor={i === 0 ? Colors.white : '#f9f0db'} 
                    borderTopLeftRadius={10}
                    borderTopRightRadius={10}
                    marginTop={5}>
                  <ScrollArea>
                    <Container marginTop={4}>
                      <ImageWrap source={PlanLady} height={20} fit="contain"/>
                    </Container>
                    <Container
                      backgroundColor={i === 0 ? Colors.white : '#f9f0db'}
                      horizontalAlignment="center"
                      marginTop={4}
                      marginBottom={2}
                      padding={3}
                      paddingVertical={2}
                      borderRadius={5}>
                      <H1 color={Colors.black} fontSize={22}>
                        {el.name.toUpperCase()}
                      </H1>
                      <H1 color={Colors.black} fontSize={22}>
                        N{numeral(el.price).format('0,0')} /<P>{el.type === 'month' ? "per month" : "per annum"}</P>
                      </H1>
                    </Container>
    
                    <Container marginBottom={6} widthPercent="100%" padding={tabs.length > 1 ? 0 : 4}>
                      {el.feature.map((ell, ii) => (
                        <Container paddingVertical={1.5} direction="row" flex={1} verticalAlignment="center" key={ii}>
                          <SizedBox width={3} />
                          <Feather name="check" color={Colors.lightGreen} size={scaleFont(15)}/>
                          <SizedBox width={2}/>
                          <Container flex={1}>
                            <P fontSize={FONTSIZE.medium}>{ell}</P>
                          </Container>
                        </Container>
                      ))}
                    </Container>
                  </ScrollArea>
                  <SizedBox height={1} />
                  <Button loading={isLoading} title="Choose Plan" onPress={() => {
                      if(isLoading || sub_plans.length === 0){
                        getPlans();
                        return false
                      }
                      props.navigation.navigate('PaymentOption', {selected : sub_plans[i]})
                    }} />
                </Container>
              ))}
            </ScrollView>
          )
        }
      </Container>
    </AppPageBack>
  );
};

export default Payments;
