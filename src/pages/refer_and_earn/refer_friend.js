import React from 'react';
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
  InputWrap,
} from '@burgeon8interactive/bi-react-library';
import {H1,H2,P,Button,Input,TouchFeedback} from '../../components/component';
import Colors from '../../helpers/colors';
import Feather from 'react-native-vector-icons/Feather';
import HistoryIcon from '../../../assets/img/icons/history.png';
import {Share} from 'react-native';
import {useStoreState} from 'easy-peasy';

const ReferFriend = props => {
  const {user} = useStoreState(state=>({
    user : state.userDetails.user
  }));
  return (
    <Page barIconColor="light" backgroundColor={Colors.primary}>
      <Container paddingHorizontal={6} paddingTop={6} direction="row" horizontalAlignment="space-between">
        <TouchFeedback paddingRight={5} paddingTop={1.5} paddingBottom={1.5} onPress={() => props.navigation.goBack()}>
          <Feather Icon name="chevron-left" size={scaleFont(25)} color={Colors.white} />
        </TouchFeedback>
        <TouchFeedback paddingRight={5} paddingTop={1.5} paddingBottom={1.5} onPress={() => props.navigation.navigate('EarningsDashboard')}>
            <ImageWrap source={HistoryIcon} height={4} width={10} fit="contain" />
        </TouchFeedback>
      </Container>
      <SizedBox height={10} />
      <Container
        horizontalAlignment="center"
        verticalAlignment="center"
      >
        <Container widthPercent="70%">
          <H1 textAlign="center" fontSize={20}>Now, you can invite friends and earn free cash</H1>
          <SizedBox height={2}/>
          <P textAlign="center">For each friend that signs up on Gold plan, you get N1,000 and for each that signs up on Silver plan, you get N500</P>
          <SizedBox height={5}/>
          <Button title="Invite friends" borderRadius={5} onPress={()=>Share.share({
            message : `I’m a proud member of the Herconomy community for female professionals and entrepreneurs and I’d like to invite you to join us. Within our community, you get access to grants, loans, jobs capacity building, discounts across different stores and more!!! 
            
    You also get access to network with likeminded people who believe that women should be empowered. 
            
    Join via link below.
            https://api.agstribe.org/accounts/signup/referral/${user.username}/`
          })}/>
        </Container>
      </Container>
     
    </Page>
  );
};

export default ReferFriend;
