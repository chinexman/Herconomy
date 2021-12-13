import React, {useState, useEffect} from 'react';
import {Container, ScrollArea, Avatar, SizedBox, ImageWrap, TouchWrap, InputWrap} from '@burgeon8interactive/bi-react-library';
import Colors from '../../../helpers/colors';
import {H1, H2, ImageCardHolder, P,TouchFeedback} from '../../../components/component';
import {useNavigation} from '@react-navigation/native';
import {FlatList} from 'react-native';
import Card from '../../../components/card';
import { apiFunctions } from '../../../helpers/api';
import {useStoreState,useStoreActions} from 'easy-peasy';
import { ScrollView } from 'react-native-gesture-handler';
import {Text} from 'react-native';
import {ToastShort, ToastLong} from '../../../helpers/utils';
import {ActivityIndicator} from 'react-native';

const Investment = ({navigation,route}) => {
  const {token,retry} = useStoreState(state => ({
    user: state.userDetails.user,
    token: state.userDetails.token,
    retry : state.retryModel.retry
  }));
  const {updateFunc,updateRetry} = useStoreActions(action=>(
    {
      updateFunc : action.retryModel.updateFunc,
      updateRetry : action.retryModel.updateRetry
    }
  ));
  const getInvestmentCategories = async () => {
    try{
      setCatLoading(true);
      let res = await apiFunctions.getInvestmentCategories(token);
      res = res.map(categ=>categ.toLowerCase());
      res = [...new Set(res)];
      setCategory(res);
      setCatLoading(false);
    }catch(error){
      setCatLoading(false);
      ToastShort(error.msg);
    }
  }

  const getInvestment = async () => {
    try{
      setInvestLoading(true);
      if(retry){
        getInvestmentCategories();
      }
      updateRetry(false);
      updateFunc(getInvestment);
      let res = await apiFunctions.getInvestment(token);
      setInvestment(res);
      setFilteredInvest(res);
      setInvestLoading(false);
    }catch(error){
      updateFunc(getInvestment);
      updateRetry(true);
      setInvestLoading(false);
    }
  }

  const [investments,setInvestment] = useState([]);
  const [filtered_investments,setFilteredInvest] = useState([]);
  const [is_invest_loading, setInvestLoading] = useState(true);
  const [categories,setCategory] = useState([]);
  const [is_cat_loading, setCatLoading] = useState(true);
  const [filter_by,setFilter] = useState(' ');
  useEffect(()=>{
    const unsubscribe = navigation.addListener('focus', () => {
      getInvestmentCategories(token);
      getInvestment(token);
    });
    return unsubscribe;
  },[
    navigation
  ]);
  return (
    <Container flex={1} paddingHorizontal={6} backgroundColor={Colors.white}>
      <Container width="100%" marginHorizontal={6} marginTop={2}>
        <InputWrap 
          placeholder="search" backgroundColor="#fff" flex={1} 
          elevation={10} 
          paddingTop={2} paddingLeft={5} borderRadius={50}
          onChangeText={(value)=>{
            let filtered_investments = investments.filter(investment => {
              return investment.title.toLowerCase().includes(value.toLowerCase());
            });
            value.length === 0 ? setFilteredInvest(investments) : setFilteredInvest(filtered_investments);
          }}
        />
      </Container>
        <SizedBox height={1} />
        <Container>
              <ScrollView horizontal={true}>
                  <Container direction="row" verticalAlignment="center" horizontalAlignment="space-between" padding={3} marginRight={10}>
                  {
                    is_cat_loading  === false ? categories.map((categ,index)=>(
                      <TouchFeedback key={index}
                        onPress={()=>{
                            let filtered_investments = investments.filter(investment => {
                              return investment.investment_type.toLowerCase() === categ.toLowerCase()
                            });
                            setFilteredInvest(filtered_investments);
                            setFilter(categ);
                        }}
                      >
                          <P> <Text  
                            style={{color:`${filter_by === categ ? Colors.primary : Colors.black}`}}
                      >{categ.charAt(0).toUpperCase()}{categ.slice(1)}</Text> {index !== (categories.length - 1) && '|'}</P>
                      </TouchFeedback>
                    )) : (
                      <> 
                        <ActivityIndicator size="large" color={Colors.primary}  />
                      </>
                    ) 
                  }
                  </Container>
              </ScrollView>
        </Container>
        <SizedBox height={1} />
        <Container marginBottom={25}>
           {
             is_invest_loading === false && filtered_investments.length === 0 && !retry ? (
              <Container horizontalAlignment="center" verticalAlignment="center">
                  <H1>No investments found</H1>
              </Container>
              ) : null
           }
           {
            filtered_investments.length === 0 && is_invest_loading ? (
              <ImageCardHolder />
            ) : null
          }
           {
            <FlatList 
              data={filtered_investments} 
              extraData={filtered_investments} 
              keyExtractor={filtered_investments => filtered_investments.id} 
              renderItem={({item, index}) => <Card navigation={navigation} data={item} navigate_to="InvestDetails" isInvestment={true}/>} 
              showsVerticalScrollIndicator={false}
              refreshing={is_invest_loading}
              onRefresh={()=>{
                getInvestmentCategories();
                getInvestment()
            }}
        /> 
           }
          
        </Container>
    </Container>
  );
};

export default Investment;
