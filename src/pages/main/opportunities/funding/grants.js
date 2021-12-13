import React, {useState, useEffect} from 'react';
import {Container, TouchWrap, SizedBox} from '@burgeon8interactive/bi-react-library';
import Colors from '../../../../helpers/colors';
import {FlatList, ActivityIndicator} from 'react-native';
import Card from '../../../../components/card';
import {apiFunctions} from '../../../../helpers/api';
import {useStoreState, useStoreActions} from 'easy-peasy';
import {P, H2, H1, ImageCardHolder} from '../../../../components/component';
import {ToastShort, ToastLong} from '../../../../helpers/utils';
import {storeData, getData} from '../../../../helpers/functions';
import { useNavigation } from '@react-navigation/core';

const Grants = () => {
  const {token,retry,funds} = useStoreState(state => ({
    user: state.userDetails.user,
    token: state.userDetails.token,
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

  const getGrants = async () => {
    try {
      setLoading(true);
      updateRetry(false);
      updateFunc(getGrants);
      let fundings = await apiFunctions.getFundings(token);
      updateFunds(fundings);
      updateFundsHolder(fundings);
      setLoading(false);
    } catch (error) {
      updateFunc(getGrants);
      updateRetry(true);
      setLoading(false);
    }
  };
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(true);
  let grants = funds ? funds.filter(funding => {
    return funding.category === 'grants' || funding.category === 'funds' 
      || funding.category === 'fund&grants'
  }) : [];
  useEffect(() => {
    getGrants();
  }, []);

  return (
    <Container>
      <SizedBox height={3} />
      {
        isLoading && grants.length === 0 ? (
          <ImageCardHolder />
        ) : null
      }
      <FlatList
        data={grants}
        extraData={grants}
        keyExtractor={grants => grants.id.toString()}
        renderItem={({item, index}) => <Card navigation={navigation} data={item} tabName="grants" navigate_to="OtherOppsDetails" />}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={getGrants}
      />
      {grants.length === 0 && isLoading === false && !retry ? (
        <Container paddingHorizontal={4} horizontalAlignment="center" verticalAlignment="center">
          <H1>No grants found</H1>
        </Container>
      ) : null }
    </Container>
  );
};

export default Grants;