import React, {useState, useEffect} from 'react';
import {Container, ScrollArea, Avatar, SizedBox, ImageWrap, TouchWrap, InputWrap} from '@burgeon8interactive/bi-react-library';
import Colors from '../../helpers/colors';
import {H1, H2, P} from '../../components/component';
import {useNavigation} from '@react-navigation/native';
import {FlatList} from 'react-native';
import ListCard from '../../components/app_list_card';
import { apiFunctions } from '../../helpers/api';
import {useStoreState} from 'easy-peasy';
import { ScrollView } from 'react-native-gesture-handler';
import {Text} from 'react-native';
import {ToastShort, ToastLong} from '../../helpers/utils';
import {ActivityIndicator} from 'react-native';

const InvestmentApps = ({navigation,route}) => {
  const {token} = useStoreState(state => ({
    user: state.userDetails.user,
    token: state.userDetails.token,
  }));
  const getInvestment = async (token) => {
    try{
      setLoading(true);
      let res = await apiFunctions.getMyInvestment(token);
      setInvestment(res.filter(item=>item.status === 'paid'));
      setLoading(false);
    }catch(error){
      setLoading(false);
      ToastShort(error.msg);
    }
  }

  const [investments,setInvestment] = useState([]);
  const [is_loading, setLoading] = useState(true);
  useEffect(()=>{
    const unsubscribe = navigation.addListener('focus', () => {
      getInvestment(token);
    });
    return unsubscribe;
  },[
    navigation
  ]);
  return (
    <Container flex={1} paddingHorizontal={6} backgroundColor={Colors.white}>
        <SizedBox height={1} />
        <Container marginBottom={7}>
           {
             is_loading && (
                <ActivityIndicator size="large" color={Colors.primary}  />
             )
           }
           {
             is_loading === false && investments.length === 0 && (
              <Container horizontalAlignment="center" verticalAlignment="center">
                  <H1>No investments found</H1>
              </Container>
              )
           }

           {
             is_loading === false && investments.length > 0 && (
              <FlatList 
                  data={investments} 
                  extraData={investments} 
                  keyExtractor={investments => investments.id} 
                  renderItem={({item, index}) => <ListCard navigation={navigation} data={item} 
                  navigate_to="InvestDetails" 
                  isInvestment={true}/>} 
                  showsVerticalScrollIndicator={false}
              /> 
             )
           }
          
        </Container>
    </Container>
  );
};

export default InvestmentApps;
