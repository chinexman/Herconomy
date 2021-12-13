import React, {useState} from 'react';
import {TouchWrap, Container, ScrollArea, ImageWrap, SizedBox, scaleFont, InputWrap} from '@burgeon8interactive/bi-react-library';
import {H2, P, CheckBok,TouchFeedback} from '../../components/component';
import {useStoreActions} from 'easy-peasy';
import {RouteContext} from '../../helpers/routeContext';
import Colors from '../../helpers/colors';
import Feather from 'react-native-vector-icons/Feather';
import {View, ActivityIndicator, Keyboard, Alert} from 'react-native';
import {apiFunctions} from '../../helpers/api';
import {storeData, getData} from '../../helpers/functions';
import {ToastShort, ToastLong} from '../../helpers/utils';
import { FONTSIZE } from '../../helpers/constants';

const Verify = props => {
  const {setCurrentState} = React.useContext(RouteContext);
  const [loading, setLoading] = useState(false);
  const [token, setEmail] = React.useState('');
  const [password1, setPassword1] = React.useState('');
  const [password2, setPassword2] = React.useState('');

  const submit = async () => {
    if (token === '' || password1 === '' || password2 === '') {
      return;
    }
    Keyboard.dismiss();

    setLoading(true);
    try {
      let fd = {token, password1, password2};
      let res = await apiFunctions.reset(fd);
      if (res) {
        setLoading(false);
        setCurrentState('main');
      }
    } catch (error) {
      if(error.msg){
        let msg = Array.isArray(Object.values(error.msg)[0]) ? Object.values(error.msg)[0][0] : Object.values(error.msg)[0];
        setLoading(false);
        return Alert.alert('Ags Tribe',msg);
      }
      setLoading(false);
      ToastShort(JSON.stringify(error));
    }
  };

  return (
    <View style={{flex: 1}}>
      <Container flex={1} backgroundColor={Colors.primary} verticalAlignment="center">
        <SizedBox height={10} />

        <ScrollArea flexGrow={1}>
          <Container flex={1} verticalAlignment="center">
            <ImageWrap source={require('../../../assets/img/agsLogo_dark.png')} fit="contain" height={10} />
          </Container>

          <SizedBox height={4} />

          <Container backgroundColor={Colors.primary} paddingTop={3} borderTopLeftRadius={50} borderTopRightRadius={50} 
            flex={1}
            verticalAlignment="flex-end">
            <Container paddingHorizontal={6} marginBottom={3}>
              <H2 textAlign="center" color={Colors.black} fontSize={FONTSIZE.page}>
                Reset Password
              </H2>
              <SizedBox height={3} />
              <P>A reset PIN has been sent to your registered email. Fill in the PIN below to reset your password.</P>
              <SizedBox height={3} />

              <InputWrap
                value={token}
                onChangeText={text => setEmail(text)}
                placeholder="PIN"
                color={Colors.black}
                returnKeyType="next"
                placeholderTextColor={Colors.lightGrey}
                backgroundColor={Colors.white}
                icon={<Feather Icon name="lock" color={Colors.black} size={scaleFont(20)} />}
                keyboardType="number-pad"
                onSubmit={() => this.one.focus()}
                borderRadius={5}
                borderColor={Colors.black}
                borderWidth={2.5}
                backgroundColor={Colors.white}
              />

               <SizedBox height={1} />

              <InputWrap
                value={password1}
                onChangeText={text => setPassword1(text)}
                placeholder="Password"
                color={Colors.black}
                secure={true}
                returnKeyType="next"
                placeholderTextColor={Colors.lightGrey}
                icon={<Feather Icon name="lock" color={Colors.black} size={scaleFont(20)} />}
                onSubmit={() => this.two.focus()}
                borderRadius={5}
                borderColor={Colors.black}
                borderWidth={2.5}
                backgroundColor={Colors.white}
              />

              <SizedBox height={1} />

            <InputWrap
                value={password2}
                onChangeText={text => setPassword2(text)}
                placeholder="Confirm Password"
                color={Colors.black}
                secure={true}
                returnKeyType="next"
                placeholderTextColor={Colors.lightGrey}
                backgroundColor={Colors.white}
                icon={<Feather Icon name="lock" color={Colors.black} size={scaleFont(20)} />}
                onSubmit={submit}
                borderRadius={5}
                borderColor={Colors.black}
                borderWidth={2.5}
              />
              <SizedBox height={2} />

              <Container verticalAlignment="center">
                <TouchFeedback flex={1} paddingLeft={6} onPress={() => props.navigation.navigate('SignIn')}>
                  <H2 fontSize={FONTSIZE.medium} color={Colors.black}>
                    Remember Password?
                  </H2>
                </TouchFeedback>
                <SizedBox height={2} />
                <Container flex={1} backgroundColor={Colors.black} borderTopLeftRadius={50}>
                  {loading ? (
                    <Container paddingVertical={2} flex={1} horizontalAlignment="center" verticalAlignment="center"
                    backgroundColor={Colors.black}>
                      <ActivityIndicator color={Colors.white} size="large" />
                    </Container>
                  ) : (
                    <TouchFeedback flex={1} onPress={submit}>
                      <Container paddingVertical={2} flex={1} horizontalAlignment="center" verticalAlignment="center"
                        backgroundColor={Colors.black}>
                        <H2 fontSize={FONTSIZE.big} color={Colors.white}>Submit</H2>
                      </Container>
                    </TouchFeedback>
                  )}
                </Container>
              </Container>
            </Container>
          </Container>
        </ScrollArea>
      </Container>
    </View>
  );
};

export default Verify;
