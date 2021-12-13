import React,{useState,useEffect} from 'react';
import {Container,TouchWrap,SizedBox} from '@burgeon8interactive/bi-react-library';
import Colors from '../../helpers/colors';
import {FlatList, ActivityIndicator} from 'react-native';
import ListCard from '../../components/app_list_card';
import { apiFunctions } from '../../helpers/api';
import {useStoreState,useStoreActions} from 'easy-peasy';
import {P,H2,H1} from '../../components/component';
import {ToastLong} from '../../helpers/functions';

const GrantsList = ({navigation,route}) => {

  const {token} = useStoreState(state => ({
    user: state.userDetails.user,
    token: state.userDetails.token
  }));
  const [grants,setGrants] = useState([]);
  const getGrants = async () => {
    try{
      setLoading(true);
      let fundings = await apiFunctions.fundApplications(token);
      let filtered = fundings.filter((funding)=> funding.fund.fund_type === 'grants');
      setGrants(filtered)
      setLoading(false);
    }catch(error){
        ToastLong(error.msg);
    }
  }

      const [isLoading,setLoading] = useState(true);

      useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
          getGrants();
        });
        return unsubscribe;
      },[navigation]);
      
    return(
      <Container>
          <SizedBox height={3} />
          {
            isLoading ? (
              <ActivityIndicator size="large" color={Colors.primary}  />
            ) : (
              <FlatList 
                  data={grants} 
                  extraData={grants} 
                  keyExtractor={grants => grants.id} 
                  renderItem={({item, index}) => <ListCard data={item} tabname="grants" 
                  navigation={navigation} navigateTo="OtherOppsDetails" />} 
                  showsVerticalScrollIndicator={false}
              />
            )
          }
          {
            grants.length === 0 && isLoading === false && (
              
              <Container paddingHorizontal={4} horizontalAlignment="center" verticalAlignment="center"> 
                <H1>No grants found</H1>
              </Container>
            )
          }
      </Container>
    )
}

export default GrantsList;