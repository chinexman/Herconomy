import React,{useState,useEffect} from 'react';
import {Container,TouchWrap,SizedBox} from '@burgeon8interactive/bi-react-library';
import Colors from '../../../../helpers/colors';
import {H1,P,H2, ImageCardHolder} from '../../../../components/component';
import {FlatList,ActivityIndicator} from 'react-native';
import Card from '../../../../components/card';
import { useStoreState,useStoreActions } from 'easy-peasy';
import {ToastLong,ToastShort} from '../../../../helpers/utils';
import {apiFunctions} from '../../../../helpers/api';
import {storeData, getData} from '../../../../helpers/functions';
import { useNavigation } from '@react-navigation/core';

const Scholarship = () => {
    
  const {token,retry} = useStoreState(state => ({
    token: state.userDetails.token,
    retry : state.retryModel.retry
  }));
  const navigation = useNavigation();
  const {updateFunc,updateRetry} = useStoreActions(action=>(
    {
      updateFunc : action.retryModel.updateFunc,
      updateRetry : action.retryModel.updateRetry
    }
  ));
  const {updateOthHolder,updateOthOpps} = useStoreActions(actions => ({
    updateOthHolder : actions.otherOpps.updateOthHolder,
    updateOthOpps : actions.otherOpps.updateOthOpps
  }));
  const {other_opps} = useStoreState(state => ({
    other_opps : state.otherOpps.other_opps
  }));
    const getScholarships = async () => {
      try {
        setLoading(true);
        updateRetry(false);
        updateFunc(getScholarships);
        let scholarships = await apiFunctions.getScholarships(token);
        updateOthHolder(scholarships);
        updateOthOpps(scholarships);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        updateFunc(getScholarships);
        updateRetry(true);
      }
    };
    const [isLoading,setLoading] = useState(false);
    const scholarships = other_opps ? other_opps.filter(item=>{
      return item.fund_type === "scholarship" ||  item.fund_type === "scholarships"
    }) : [];
    useEffect(()=>{
      getScholarships();
    },[]);
    return(
        <Container>
          <SizedBox height={3} />
          {
            scholarships.length === 0 && isLoading ? (
              <ImageCardHolder />
            ) : null
          }
          <FlatList 
            data={scholarships} 
            extraData={scholarships} 
            keyExtractor={scholarships => scholarships.id} 
            renderItem={({item, index}) => <Card data={item} 
              navigation={navigation} navigate_to="OtherOppsDetails" 
              tabName="scholarships"
            />} 
            showsVerticalScrollIndicator={false}
            refreshing={isLoading}
            onRefresh={getScholarships}
          />
          {
            scholarships.length === 0 && isLoading === false && !retry ? (
            <Container paddingHorizontal={4} paddingHorizontal={4} horizontalAlignment="center" verticalAlignment="center"> 
              <H1>No scholarships found</H1>
            </Container>
          ) : null
        }
      </Container>
    )
}

export default Scholarship;