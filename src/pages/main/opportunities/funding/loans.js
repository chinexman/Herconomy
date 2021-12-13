import React, {useState, useEffect} from 'react';
import {Container, TouchWrap, SizedBox} from '@burgeon8interactive/bi-react-library';
// import Colors from '../../../../helpers/colors';
import {H1, P, H2, ImageCardHolder} from '../../../../components/component';
// import Card from '../../../../components/card';
import {FlatList, ActivityIndicator} from 'react-native';
import Card from '../../../../components/card';
import Colors from '../../../../helpers/colors';
import {apiFunctions} from '../../../../helpers/api';
import {useStoreState, useStoreActions} from 'easy-peasy';
import {ToastShort, ToastLong} from '../../../../helpers/utils';
import {storeData, getData} from '../../../../helpers/functions';
import { useNavigation } from '@react-navigation/core';

const Loans = () => {
  const {token,retry,funds} = useStoreState(state => ({
    user : state.userDetails.user,
    token : state.userDetails.token,
    retry : state.retryModel.retry,
    funds : state.funds.funds
  }));
  const {updateFunc,updateRetry} = useStoreActions(action=>(
    {
      updateFunc : action.retryModel.updateFunc,
      updateRetry : action.retryModel.updateRetry
    }
  ));
  const updateFunds = useStoreActions(actions => actions.funds.updateFunds);
  const updateFundsHolder = useStoreActions(actions => actions.funds.updateFundsHolder);
  const navigation = useNavigation();
  const getLoans = async () => {
    try {
      updateRetry(false);
      updateFunc(getLoans);
      let fundings = await apiFunctions.getFundings(token);
      updateFunds(fundings);
      updateFundsHolder(fundings);
      setLoading(false);
    } catch (error) {
      updateFunc(getLoans);
      updateRetry(true);
    }
  };

  const [isLoading, setLoading] = useState(true);
  let loans = funds ? funds.filter(funding => funding.category === 'loans') : [];
  useEffect(() => {
    getLoans();
  }, []);
  return (
    <Container>
      <SizedBox height={3} />
      {
        isLoading && loans.length === 0 ? (
          <ImageCardHolder />
        ) : null
      }
      <FlatList
        data={loans}
        extraData={loans}
        keyExtractor={loans => loans.id.toString()}
        renderItem={({item, index}) => <Card data={item} navigation={navigation} navigate_to="OtherOppsDetails" tabName="loans" />}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={getLoans}
      />
      {loans.length === 0 && isLoading === false && !retry ? (
        <Container paddingHorizontal={4} horizontalAlignment="center" verticalAlignment="center">
          <H1>No loans found</H1>
        </Container>
      ) : null }
    </Container>
  );
};

export default Loans;