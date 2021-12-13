import React,{useState,useEffect} from 'react';
import {Container,TouchWrap,SizedBox} from '@burgeon8interactive/bi-react-library';
// import Colors from '../../../../helpers/colors';
import {H1,P,H2} from '../../components/component';
// import Card from '../../components/card';
import {FlatList,ActivityIndicator} from 'react-native';
import ListCard from '../../components/app_list_card';
import Colors from '../../helpers/colors';
import { apiFunctions } from '../../helpers/api';
import {useStoreState,useStoreActions} from 'easy-peasy';
import {ToastShort, ToastLong} from '../../helpers/utils';

const LoansList = ({navigation,route}) => {

      const {token} = useStoreState(state => ({
        user: state.userDetails.user,
        token: state.userDetails.token
      }));
      const [loans,setLoans] = useState([]);
      const getLoans = async () => {
        try{
          setLoading(true);
          let fundings = await apiFunctions.fundApplications(token);
          let filtered = fundings.filter((funding)=> funding.fund.fund_type === 'loans');
          setLoans(filtered)
          setLoading(false);
        }catch(error){
            setLoading(false);
            ToastLong(error.msg);
        }
      }
      

      const [isLoading,setLoading] = useState(true);

      useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
          getLoans();
        });
        return unsubscribe;
      },[
        navigation
      ]);


    return(
        <Container>
            <SizedBox height={3} />
            {
              isLoading ? (
                <ActivityIndicator size="large" color={Colors.primary}  />
              ) : (
                <FlatList 
                    data={loans} 
                    extraData={loans} 
                    keyExtractor={loan => loan.id} 
                    renderItem={({item, index}) => <ListCard data={item} tabname="loans" 
                    navigation={navigation} navigateTo="OtherOppsDetails"  />} 
                    showsVerticalScrollIndicator={false}
                />
              )
            }
            {
            loans.length === 0 && isLoading === false && (
              <Container paddingHorizontal={4} paddingHorizontal={4} horizontalAlignment="center" verticalAlignment="center"> 
                <H1>No loans found</H1>
              </Container>
            )
          }
        </Container>
    )
}

export default LoansList;