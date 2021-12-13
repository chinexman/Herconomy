import React from 'react';

import {Container, ImageWrap, SizedBox, Page} from '@burgeon8interactive/bi-react-library';
import {H2, H1, Button} from '../../components/component';
import Colors from '../../helpers/colors';
import { FONTSIZE } from '../../helpers/constants';

const text = 'Tell us a little about yourself';
const img = require('../../../assets/img/walk4.png');

const OnboardThree = props => {
  return (
    <Page barIconColor="dark" backgroundColor={Colors.white}>
      <Container height={100}>
        <Container flexGrow={1} paddingHorizontal={6} paddingVertical={2} flex={1} horizontalAlignment="center" verticalAlignment="center">
          <ImageWrap source={img} height={30} widthPercent="80%" fit="contain" />

          <SizedBox height={1} />

          <H1 textAlign="center" fontSize={13}>
            We would like to know{'\n'}you better,
          </H1>

          <SizedBox height={4} />

          <H2 textAlign="center" fontSize={13} color={Colors.button}>
            {text}
          </H2>

          <SizedBox height={6} />

          <Button widthPercent="80%" borderRadius={5} title="Continue" onPress={() => props.navigation.navigate('OnboardFour')}>
            <H2 textAlign="center" backgroundColor="blue" fontSize={FONTSIZE.medium}>
              Continue
            </H2>
          </Button>
        </Container>
      </Container>
    </Page>
  );
};

export default OnboardThree;
