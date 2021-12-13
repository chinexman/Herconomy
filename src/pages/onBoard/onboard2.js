import React from 'react';
import {Container, ImageWrap, SizedBox, Page} from '@burgeon8interactive/bi-react-library';
import {H2, H1, Button} from '../../components/component';
import Colors from '../../helpers/colors';
import { FONTSIZE } from '../../helpers/constants';

const text = 'You are joining hundreds of other female professionals and entrepreneurs who are making a difference in their communities on the continent.';
const img = require('../../../assets/img/walk3.png');

const OnboardTwo = props => {
  return (
    <Page barIconColor="dark" backgroundColor={Colors.primary}>
      <Container height={100}>
        <Container flexGrow={1} paddingHorizontal={6} paddingVertical={2} flex={1} horizontalAlignment="center" verticalAlignment="center">
          <ImageWrap source={img} height={30} widthPercent="80%" fit="contain" />

          <SizedBox height={1} />

          <H1 textAlign="center" fontSize={FONTSIZE.big}>
            Welcome to the Tribe
          </H1>

          <SizedBox height={4} />

          <H2 textAlign="center" fontSize={FONTSIZE.medium} color={Colors.button}>
            {text}
          </H2>

          <SizedBox height={6} />

          <Button widthPercent="80%" borderRadius={5} title="Continue" onPress={() => props.navigation.navigate('OnboardFour')}>
            <H2 textAlign="center" backgroundColor="blue" fontSize={FONTSIZE.big}>
              Continue
            </H2>
          </Button>
        </Container>
      </Container>
    </Page>
  );
};

export default OnboardTwo;
