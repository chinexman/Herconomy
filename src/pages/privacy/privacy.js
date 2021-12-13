import React, {useState} from 'react';
import {Container, SizedBox, InputWrap, scaleFont, TouchWrap, Page} from '@burgeon8interactive/bi-react-library';
import Colors from '../../helpers/colors';
import {H2,TouchFeedback} from '../../components/component';
import {ResourcesTabScreen, BlockedTabScreen} from '../../helpers/route';
import Feather from 'react-native-vector-icons/Feather';

const Privacy = ({navigation, route}) => {
  return (
    <Page barIconColor="light" backgroundColor={Colors.primary}>
      <Container paddingHorizontal={6} paddingTop={6} direction="row" verticalAlignment="center">
        <TouchFeedback paddingRight={5} paddingTop={1.5} paddingBottom={1.5} onPress={() => navigation.goBack()}>
          <Feather Icon name="chevron-left" size={scaleFont(25)} color="#fff" />
        </TouchFeedback>
      </Container>
      <SizedBox height={1} />
      <Container
        flex={1}
        paddingHorizontal={6}
        backgroundColor={Colors.white}
        borderTopLeftRadius={50}
        borderTopRightRadius={50}
        marginTop={2}>
        <SizedBox height={2} />
         {/* <Container direction="row" width="100%" marginHorizontal={6}>
          <InputWrap
            placeholder="Search"
            backgroundColor="#fff"
            flex={1}
            elevation={10}
            paddingTop={2}
            paddingLeft={5}
            borderRadius={50}
            width={65}
          />
          <TouchFeedback verticalAlignment="center" paddingHorizontal={3}>
            <Feather Icon name="search" size={scaleFont(25)} color={Colors.primary} />
          </TouchFeedback>
        </Container> */}
       
        <SizedBox height={4} />
        <BlockedTabScreen />
      </Container>
    </Page>
  );
};
export default Privacy;