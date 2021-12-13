import React from 'react';
import {
  Page,
} from '@burgeon8interactive/bi-react-library';
import Colors from '../../helpers/colors';
import ReferralList from '../../components/referral_list';

const EarningsDashboard = props => {
  return (
    <Page barIconColor="light" backgroundColor={Colors.primary}>
      <ReferralList navigation={props.navigation} />
    </Page>
  );
};

export default EarningsDashboard;
