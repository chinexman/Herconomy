import React,{useState,useEffect} from 'react';
import {Container,TouchWrap,SizedBox} from '@burgeon8interactive/bi-react-library';
import Colors from '../../helpers/colors';
import {H1,P,H2} from '../../components/component';
import {FlatList,ActivityIndicator} from 'react-native';
import ListCard from '../../components/app_list_card';
import { useStoreState,useStoreActions } from 'easy-peasy';
import {ToastLong,ToastShort} from '../../helpers/utils';
import {apiFunctions} from '../../helpers/api';

const ScholarshipsList = ({navigation,route}) => {
    
    const {token} = useStoreState(state => ({
      token: state.userDetails.token
    }));
    const getScholarships = async () => {
      try{
        setLoading(true);
        let res = await apiFunctions.scholarshipApplications(token);
        setScholarships(res);
        setLoading(false);
      }catch(error){
          ToastLong(error.msg);
      }
    }
    const [scholarships,setScholarships] = useState([]);
    const [isLoading, setLoading] = useState(true);
    useEffect(()=>{
      const unsubscribe = navigation.addListener('focus', () => {
        getScholarships();
      });
      return unsubscribe;
    },[

    ]);


    return(
        <Container>
          <SizedBox height={3} />
          {
            isLoading && (
              <ActivityIndicator size="large" color={Colors.primary}  />
            )
          }
          {
            !isLoading && scholarships.length > 0 && (
              <FlatList 
                  data={scholarships} 
                  extraData={scholarships} 
                  keyExtractor={item => item.id} 
                  renderItem={({item, index}) => <ListCard data={item.scholarship} 
                    navigation={navigation} navigateTo="OtherOppsDetails" 
                    tabName="scholarships"
                  />} 
                  showsVerticalScrollIndicator={false}
              />
            )
          }
          {
          scholarships.length === 0 && isLoading === false && (
            <Container paddingHorizontal={4} paddingHorizontal={4} horizontalAlignment="center" verticalAlignment="center"> 
              <H1>No scholarships found</H1>
            </Container>
          )
        }
      </Container>
    )
}

export default ScholarshipsList;