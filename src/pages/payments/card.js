import React, {useState, useEffect} from 'react';
import RNPaystack from 'react-native-paystack';
import {AppPageBack, H1, H2, P, Button, Dropdown, ListWrapGeneral, Input} from '../../components/component';
import {Container, SizedBox, ScrollArea, ImageWrap} from '@burgeon8interactive/bi-react-library';
import {Modal, Keyboard} from 'react-native';
import Colors from '../../helpers/colors';
import {Capitalize, SpaceCard, randomString, ToastShort} from '../../helpers/utils';
import {validate, isNumeral} from 'numeral';

RNPaystack.init({
  publicKey: 'pk_test_707b132b0745ce619d373689f6a97a0baf6ec862',
});

const Cards = props => {
  const planType = props.route.params;
  const [loading, setLoading] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNum, setCardNum] = useState('');
  const [expiryPeriod, setExpiryPeriod] = useState('');
  const [expiryPeriodRaw, setExpiryPeriodRaw] = useState('');
  const [cardCVC, setCardCVC] = useState('');

  const validateNum = num => {
    let val = num;
    let temp_val;

    if (!isNaN(val)) {
      if (val > 1 && val < 10 && val.length === 1) {
        temp_val = '0' + val + '/';
        setExpiryPeriod(temp_val);
      } else {
        setExpiryPeriod(temp_val);
      }
    } else {
      setExpiryPeriod(val);
    }
  };

  const payStackPay = async () => {
    if (cardName === '' || cardNum === '' || cardCVC === '' || expiryPeriod === '' || expiryPeriod.length < 5) {
      ToastShort('Please input a correct card details');
    } else {
      Keyboard.dismiss();
      setLoading(true);
      let cc = expiryPeriod.split('/');
      let cardPayload = {
        cardNumber: cardNum,
        expiryMonth: `${cc[0]}`,
        expiryYear: `${cc[1]}`,
        cvc: cardCVC,
        accessCode: randomString(15),
      };

      try {
        let res = await RNPaystack.chargeCardWithAccessCode(cardPayload);
        let reference = res.reference;
        alert(reference);
        setLoading(false);
        //saveReferenceKey(reference);
      } catch (error) {
        ToastShort(error.message);
        setLoading(false);
      }
    }
  };

  useEffect(() => {}, []);

  return (
    <AppPageBack {...props}>
      <ScrollArea>
        <Container horizontalAlignment="center" paddingTop={6} marginBottom={5}>
          <H1 textAlign="center" fontSize={19}>
            Enter credit card information
          </H1>

          <P textAlign="center" fontSize={8}>
            You can cancel at any time before your 30 day free trial ends
          </P>
        </Container>

        <Container>
          <Input placeholder="Name on Card" value={cardName} onChangeText={text => setCardName(text && Capitalize(text))} returnKeyType="next" />
          <Input
            placeholder="Card Number"
            value={SpaceCard(cardNum)}
            type="number-pad"
            onChangeText={num => setCardNum(num)}
            maxLength={22}
          />

          <Container direction="row" flex={1}>
            <Container flex={1}>
              <Input
                placeholder="Expiry (MM / YY)"
                type="number-pad"
                maxLength={5}
                value={expiryPeriod}
                onChangeText={num => validateNum(num)}
              />
            </Container>
            <SizedBox width={2} />
            <Container flex={1}>
              <Input placeholder="CVC" type="number-pad" maxLength={3} value={cardCVC} onChangeText={num => setCardCVC(num)} />
            </Container>
          </Container>
        </Container>

        <Button title="Continue" loading={loading} onPress={payStackPay} />
      </ScrollArea>
    </AppPageBack>
  );
};

export default Cards;
