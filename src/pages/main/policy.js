import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import ProgressWebView from 'react-native-progress-webview';
import {Container, TouchWrap, scaleFont, SizedBox} from '@burgeon8interactive/bi-react-library';
import {H2,TouchFeedback} from '../../components/component';

const Policy = props => {
  return (
    <Container backgroundColor="red" flex={1}>
      <Container paddingHorizontal={6} elevation={5} backgroundColor="#fff" direction="row" verticalAlignment="center">
        <TouchFeedback paddingVertical={2} onPress={() => props.navigation.goBack()}>
          <Feather Icon name="chevron-left" size={scaleFont(25)} />
        </TouchFeedback>

        <SizedBox width={3} />

        <H2>Privacy Policy </H2>
      </Container>
      <ProgressWebView source={{uri: 'https://en.wikipedia.org/wiki/Privacy_policy'}} />
    </Container>
  );
};

export default Policy;
