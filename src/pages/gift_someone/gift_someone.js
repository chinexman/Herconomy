import React,{useState} from 'react';
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
import GiftIcon from '../../../assets/img/gift.png';
import {Alert} from 'react-native';
import { apiFunctions } from '../../helpers/api';
import { ToastLong,validateEmail } from '../../helpers/utils';
import { useStoreState } from 'easy-peasy';
import HistoryIcon from '../../../assets/img/icons/history.png';
import { FONTSIZE } from '../../helpers/constants';

const GiftSomeone = props => {
  const [friend,setFriend] = useState('');
  const {token} = useStoreState(state=>({
    token : state.userDetails.token
  }))
  const validate = () => {
    if(friend.trim() === '' || validateEmail(friend) === false){
      return Alert.alert('Herconomy', "Please enter your friend's email address")
    }
    return props.navigation.navigate('BuyGift',friend);
  }
  return (
    <Page barIconColor="light" backgroundColor={Colors.primary}>
      <Container paddingHorizontal={6} paddingTop={6} direction="row" horizontalAlignment="space-between">
        <TouchFeedback paddingRight={5} paddingTop={1.5} paddingBottom={1.5} onPress={() => props.navigation.openDrawer()}>
          <Feather Icon name="menu" size={scaleFont(FONTSIZE.menu)} color={Colors.white} />
        </TouchFeedback>
        <TouchFeedback horizontalAlignment="flex-end"
          onPress={()=>props.navigation.navigate('Recipients')}
        >
          <ImageWrap source={HistoryIcon} height={4} width={10} fit="contain" />
        </TouchFeedback>
      </Container>
      <SizedBox height={3}/>
      <ScrollArea flexGrow={1}>
        <Container
          horizontalAlignment="center"
          verticalAlignment="center"
        >
          <Container widthPercent="70%">
              <ImageWrap 
                source={GiftIcon}
                fit="contain"
                height={30}
              />
              <SizedBox height={2}/>
            <H1 textAlign="center" fontSize={20}>Membership Gifting</H1>
            <SizedBox height={2}/>
            <P textAlign="center">Gift your friend a Tribe {'\n'} Membership</P>
            <SizedBox height={2}/>
            <Input 
              placeholder="Enter Email Address"
              placeholderTextColor={Colors.lightGrey}
              onChangeText={(value)=>setFriend(value)}
              keyboardType="email"
              value={friend}
            />
            <Button title="Buy Gift" borderRadius={5} onPress={()=>validate()} />
          </Container>
        </Container>
      </ScrollArea>
    </Page>
  );
};

export default GiftSomeone;