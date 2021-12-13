import React,{useState,useEffect} from 'react';
import {Container,TouchWrap,SizedBox} from '@burgeon8interactive/bi-react-library';
import Colors from '../../helpers/colors';
import {H1,P,H2} from '../../components/component';
// import Card from '../../../../components/card';
import {FlatList} from 'react-native';
import ListCard from '../../components/app_list_card';
import { useStoreState,useStoreActions } from 'easy-peasy';
import {ActivityIndicator} from 'react-native';
import {apiFunctions} from '../../helpers/api';
import {ToastLong,ToastShort} from '../../helpers/utils';

const JobsList = ({navigation,route}) => {
  const {token} = useStoreState(state => ({
    user: state.userDetails.user,
    token: state.userDetails.token
  }));
  const [jobs,setJobs] = useState([]);
  const getJobs = async () => {
    try{
      setLoading(true);
      let jobs = await apiFunctions.jobApplications(token);
      setJobs(jobs)
      setLoading(false);
    }catch(error){
        ToastLong(error.msg);
    }
  }
  const [isLoading,setLoading] = useState(false);
  useEffect(()=>{
    const unsubscribe = navigation.addListener('focus', () => {
      getJobs();
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
        !isLoading && jobs.length > 0 && (
          <FlatList 
              data={jobs} 
              extraData={jobs} 
              keyExtractor={item => item.id} 
              renderItem={({item, index}) => <ListCard data={item.job} 
                navigation={navigation} navigateTo="OtherOppsDetails" 
                tabName="jobs"
              />} 
              showsVerticalScrollIndicator={false}
          />
        )
      }
      {
      jobs.length === 0 && isLoading === false && (
        <Container paddingHorizontal={4} paddingHorizontal={4} horizontalAlignment="center" verticalAlignment="center"> 
          <H1>No jobs found</H1>
        </Container>
        
      )
    }
  </Container>
    )
}

export default JobsList;