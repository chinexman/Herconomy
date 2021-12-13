import React, { useEffect } from 'react';
import {Page, Container, TouchWrap, scaleFont, SizedBox} from '@burgeon8interactive/bi-react-library';
import {H1,PageHeader,TouchFeedback} from '../../../components/component';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../helpers/colors';
import {OpportunityTabScreens} from '../../../helpers/route';
import { Retry } from '../../../components/retry';
import { useStoreState } from 'easy-peasy';
import { FONTSIZE } from '../../../helpers/constants';

const Opportunities = props => {
  const {retry,funcCall} = useStoreState(state=>({
    retry : state.retryModel.retry,
    funcCall : state.retryModel.funcCall
  }))
  useEffect(()=>{

  },[retry])
  return (
    <Page backgroundColor={Colors.primary} >
       <PageHeader navigation={props.navigation} title={'Opportunity Board'}/>
      {/* ANCHOR - HEADER 2 */}
      <Container flex={1} backgroundColor={Colors.white} marginTop={2} borderTopLeftRadius={50} 
        borderTopRightRadius={50}
      >
        <SizedBox height={3}/>
        <OpportunityTabScreens />
        {
          retry ? (
            <Retry funcCall={funcCall} param={[]}/>
          ) : null
        }
      </Container>
    </Page>
  );
};

export default Opportunities;
