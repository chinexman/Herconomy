import React, {useState} from 'react';
import {AppPageBack, H1, H2, P, Button, Dropdown, ListWrapGeneral,TouchFeedback} from '../../components/component';
import {Container, SizedBox, ScrollArea, ImageWrap, TouchWrap, Avatar, Rounded} from '@burgeon8interactive/bi-react-library';
import Feather from 'react-native-vector-icons/Feather';
import {Modal} from 'react-native';
import Colors from '../../helpers/colors';
import numeral from 'numeral';

const GoldPlan = [
  {
    name: 'Gold',
    price: 50000,
    period: 'Annually',
    desc: 'billed annually as a recurring payment',
    type: 'year',
    popular: true,
    currency: 'NGN',
  },
  {
    name: 'Silver',
    price: 5000,
    period: 'Monthly',
    desc: 'billed monthly as a recurring payment',
    type: 'month',
    popular: false,
    currency: 'NGN',
  },
];

const Plan = props => {
  const planType = props.route.params;
  const [plan] = useState(planType);
  const [planDetails] = useState(planType === 'Gold Plan' ? GoldPlan : []);
  const [selectedPlan, setSelectPlan] = useState(GoldPlan[0]);

  const selection = el => {
    setSelectPlan(el);
  };

  return (
    <AppPageBack {...props}>
      <ScrollArea>
        <Container horizontalAlignment="center" paddingTop={6} marginBottom={5}>
          <H1 textAlign="center" fontSize={23}>
            {plan}
          </H1>
        </Container>

        <Container>
          {planDetails.map((el, i) => (
            <TouchFeedback onPress={() => selection(el)} key={i}>
              <Container
                widthPercent="100%"
                paddingBottom={5}
                marginBottom={3}
                borderRadius={10}
                horizontalAlignment="center"
                orderColor={Colors.Button}
                borderWidth={0.2}>
                <Container
                  borderTopLeftRadius={10}
                  borderTopRightRadius={10}
                  widthPercent="100%"
                  paddingVertical={1}
                  backgroundColor={Colors.button}
                  horizontalAlignment="center">
                  <H2 fontSize={8} color={Colors.buttonText}>
                    {el.period}
                  </H2>
                </Container>

                <SizedBox height={2} />

                <H2 textAlign="center" fontSize={18}>
                  N{numeral(el.price).format('0,0')}/{el.type}
                </H2>

                {el.popular ? (
                  <Container backgroundColor={Colors.primary30} padding={1} marginTop={1}>
                    <H2 fontSize={3}>MOST POPULAR</H2>
                  </Container>
                ) : null}

                <SizedBox height={1} />

                <P textAlign="center" fontSize={8}>
                  {el.desc}
                </P>

                {el.price === selectedPlan.price ? (
                  <Rounded size={4} backgroundColor={Colors.primary} position="absolute" right={2} top={-2}>
                    <Feather Icon name="check" size={15} />
                  </Rounded>
                ) : (
                  <Rounded size={4} backgroundColor={Colors.primary} position="absolute" right={2} top={-2}>
                    <Rounded size={3.5} backgroundColor={Colors.white} />
                  </Rounded>
                )}
              </Container>
            </TouchFeedback>
          ))}
        </Container>

        <Button title="Continue" onPress={() => props.navigation.navigate('PaymentOption', selectedPlan)} />
      </ScrollArea>
    </AppPageBack>
  );
};

export default Plan;
