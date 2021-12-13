import React, {useState, useReducer} from 'react';
import {AppPageBack, H1, H2, P, Button, Dropdown, ListWrapGeneral} from '../../components/component';
import {Container, SizedBox, ScrollArea, ImageWrap, TouchWrap, Avatar, Rounded} from '@burgeon8interactive/bi-react-library';
import Feather from 'react-native-vector-icons/Feather';
import {Modal, Alert} from 'react-native';
import Colors from '../../helpers/colors';
import numeral from 'numeral';
import {useStoreState} from 'easy-peasy';
import { Capitalize } from '../../helpers/utils';
import { silver_plan_id } from '../../helpers/constants';

const PaymentOption = props => {
  const plan = props.route.params.selected;
  const {user} = useStoreState(state => ({
    user: state.userDetails.user,
  }));

  const [loading, setLoading] = useState(false);

  const goToPay = () => {
    props.navigation.navigate('Checkout', {details: plan});
  };

  return (
    <AppPageBack {...props}>
      <ScrollArea>
        <Container paddingTop={6} marginBottom={4} horizontalAlignment="center">
          <H1 fontSize={23}>Hi! {user.first_name}</H1>
          <P fontSize={10} textAlign="center" color={Colors.greyBase900}>
            We are glad to have you join us. Kindly make payment to unlock all the benefits of Gold plan.
          </P>
        </Container>

        <Container marginTop={4} marginBottom={10}>
          <H2 fontSize={18}>Transaction Summary</H2>
          <Container direction="row" marginTop={4} horizontalAlignment="space-between">
            <P color={Colors.greyBase900}>Account Name</P>
            <H2>
              {user.first_name} {user.last_name}
            </H2>
          </Container>

          <Container direction="row" marginTop={4} horizontalAlignment="space-between">
            <P color={Colors.greyBase900}>Package</P>
            <H2>{plan.id ===  silver_plan_id ? 'Silver' : 'Gold'} Plan</H2>
          </Container>

          <Container direction="row" marginTop={4} horizontalAlignment="space-between">
            <P color={Colors.greyBase900}>Billed</P>
            <H2>{plan.interval ? Capitalize(plan.interval) : ""}</H2>
          </Container>

          <Container direction="row" marginTop={4} horizontalAlignment="space-between">
            <P color={Colors.greyBase900}>Total Amount ({plan.interval})</P>
            <H2>
              {'NGN' + ' '}
              {numeral(plan.amount / 100).format('0,0')}
            </H2>
          </Container>
        </Container>

        <Button title="Proceed to Checkout" loading={loading} onPress={goToPay} />
      </ScrollArea>
    </AppPageBack>
  );
};

export default PaymentOption;
