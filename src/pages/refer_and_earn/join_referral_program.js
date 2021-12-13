import React,{useState,useEffect} from 'react';
import {
  Page,
  Container,
  TouchWrap,
  SizedBox,
  scaleFont,
  Rounded,
  ImageWrap,
  Avatar,
  ScrollArea,
  InputWrap
} from '@burgeon8interactive/bi-react-library';
import {H1,H2,P,Button,Input,Dropdown,ListWrapGeneral,TouchFeedback} from '../../components/component';
import Colors from '../../helpers/colors';
import Feather from 'react-native-vector-icons/Feather';
import ReferEarn2 from '../../../assets/img/refer_earn2.png';
import {apiFunctions} from '../../helpers/api';
import {Modal,ActivityIndicator} from 'react-native';
import {useStoreState} from 'easy-peasy';
import axios from 'axios';
import { ToastLong, Capitalize, ToastShort } from '../../helpers/utils';
import {ReferralForm} from '../../components/referral_program_form';

const JoinReferralProgram = ({navigation,route}) => {
  const [account,setAccount] = useState({});
  return (
    <Page barIconColor="light" backgroundColor={Colors.primary}>
      <ScrollArea flexGrow={1}>
      <Container paddingHorizontal={6} paddingTop={6} direction="row" verticalAlignment="center">
        <TouchFeedback paddingRight={5} paddingTop={1.5} onPress={() => navigation.goBack()}>
          <Feather Icon name="chevron-left" size={scaleFont(25)} color="#fff" />
        </TouchFeedback>
        <H1 color={Colors.white}>Refer & Earn</H1>
      </Container>
      <Container horizontalAlignment="center">
      <Container widthPercent="70%">
          <ImageWrap source={ReferEarn2} height={35} fit="contain"/>
      </Container>
      </Container>
      <ReferralForm 
        title="Join Program" 
        buttonText="Join Program" 
        account={account}
        setAccount={setAccount}
        navigation={navigation}
      />
      </ScrollArea>
    </Page>
  );
};

export default JoinReferralProgram;
