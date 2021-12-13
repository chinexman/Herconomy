import React, {useState, useRef} from 'react';
import {
  Page,
  TextWrap,
  TouchWrap,
  Container,
  ScrollArea,
  ImageWrap,
  SizedBox,
  scaleFont,
  InputWrap,
} from '@burgeon8interactive/bi-react-library';
import {H1,H2, P, CheckBok,TouchFeedback} from '../../components/component';
import {useStoreActions} from 'easy-peasy';
import {RouteContext} from '../../helpers/routeContext';
import Colors from '../../helpers/colors';
import Feather from 'react-native-vector-icons/Feather';
import {View, ActivityIndicator, Alert, Linking,Platform} from 'react-native';
import {apiFunctions} from '../../helpers/api';
import {ToastShort, ToastLong} from '../../helpers/utils';
import {GoogleSignin} from '@react-native-community/google-signin';
import { storeData } from '../../helpers/functions';
import { FONTSIZE } from '../../helpers/constants';

const SignUp = props => {
  const {currentStack, setCurrentState} = React.useContext(RouteContext);
  /*   const [email, setEmail] = React.useState('love@admin.com');
  const [password, setPassword] = React.useState('123456'); */


  const inputOne = useRef(null);
  const inputTwo = useRef(null);
  const inputThree = useRef(null);
  const inputFour = useRef(null);

  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [first_name, setFName] = useState('');
  const [last_name, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const updateUser = useStoreActions(actions => actions.userDetails.updateUser);
  const updateToken = useStoreActions(actions => actions.userDetails.updateToken);

  const submitGoogleSign = async () => {
    // if (!agree) {
    //   Alert.alert('Herconomy', 'You must agree to our privacy policy to continue');
    //   return;
    // }

    try {
      let {idToken} = await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const user = userInfo.user;
      processUser(user.givenName, user.familyName, user.email, user.id, user.id);
    } catch (error) {
    }
  };

  const submit = async () => {
    if (first_name === '' || last_name === '' || email === '' || password1 === '' || password2 === '') {
      return;
    }
    if (password1 !== password2) {
      return Alert.alert("Herconomy","Passwords do not match");
    }
    if(password1.length < 6){
      return Alert.alert("Herconomy","Password must be a minimum of 6 characters");
    }
    processUser(first_name, last_name, email, password1, password2);
  };

  const processUser = async (first_name, last_name, email, password1, password2) => {
    setLoading(true);
    try {
      let fd = {first_name, last_name, email, password1, password2};
      let res = await apiFunctions.registration(fd);
      storeData('user',res.user);
      storeData('token',res.token);
      updateUser(res.user);
      updateToken(res.token);
      global.token = res.token;
      if (res) {
        setLoading(false);
        setCurrentState('onboard');
      }
    } catch (error) {
      setLoading(false);
      if(error.status === 500){
        return ToastLong("Connection Error. Please try again later");
      }
      if (error.msg) {
        if (error.msg.email) {
          Alert.alert('Herconomy', error.msg.email[0]);
          return;
        }
      }
      if(error.msg.non_field_errors){
        Alert.alert('Herconomy',error.msg.non_field_errors[0])
      }
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {}
  };

  React.useEffect(() => {
    //submit(); uncomment for auto login
    signOut();
    GoogleSignin.configure({
      webClientId: '470433460061-5aookol460l1qt77r02doc9u8ic3ab1h.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  return (
    <View style={{flex: 1}}>
      <Container flex={1} backgroundColor={Colors.primary} verticalAlignment="center">
        <SizedBox height={6} />

        <ScrollArea flexGrow={1}>
          <Container flex={1} paddingHorizontal={10} marginBottom={2}>
            <ImageWrap flex={1} source={require('../../../assets/img/agsLogo_dark.png')} fit="contain" height={10}/>
          </Container>
          <Container backgroundColor={Colors.primary} verticalAlignment="flex-end">
            <Container paddingHorizontal={6}>
            <P color={Colors.black} textAlign="center" fontSize={FONTSIZE.big}>
          Sign up to a Pan African Network of female professionals and entrepreneurs.
          </P>
          <SizedBox height={2} />
          {
            Platform.OS !== 'ios' && (
              <>
                <TouchFeedback onPress={submitGoogleSign}>
                  <Container direction="row" backgroundColor={Colors.black} horizontalAlignment="center"
                  verticalAlignment="center" borderRadius={5}
                  paddingVertical={1.5}
                  >
                    <ImageWrap source={require('../../../assets/img/icons/google.png')} height={3} widthPercent="6%" fit="contain"/>
                    <SizedBox width={2}/>
                    <H1 color={Colors.white} fontSize={FONTSIZE.medium}>Continue with Google</H1>
                  </Container>
                </TouchFeedback>
              </>
            )
          }

          {
            Platform.OS === 'ios' && (
              <>
              <TouchFeedback>
                <Container direction="row" backgroundColor={Colors.black} horizontalAlignment="center"
                verticalAlignment="center" borderRadius={5}
                paddingVertical={1.5}
                >
                  <ImageWrap source={require('../../../assets/img/icons/apple_logo.png')} height={5} widthPercent="6%" fit="contain"/>
                  <SizedBox width={2}/>
                  <H1 color={Colors.white} fontSize={FONTSIZE.medium}>Continue with Apple</H1>
                </Container>
              </TouchFeedback>

              </>
            )
          }
              <SizedBox height={2} />
              <Container direction="row" verticalAlignment="center">
                <Container
                  widthPercent="40%"
                  borderBottomWidth={1}
                  borderColor={Colors.black}
                />
                <Container widthPercent="20%">
                  <P textAlign="center" color={Colors.black} fontSize={10}>
                    OR
                  </P>
                </Container>
                <Container
                  widthPercent="40%"
                  borderBottomWidth={1}
                  borderColor={Colors.black}
                  marginRight={3}
                />
              </Container>

              

              <SizedBox height={2} />

              <SizedBox height={2} />

              <InputWrap
                value={first_name}
                onChangeText={text => setFName(text)}
                placeholder="First Name"
                color={Colors.black}
                returnKeyType="next"
                placeholderTextColor={Colors.lightGrey}
                backgroundColor={Colors.white}
                icon={<Feather Icon name="user" color={Colors.black} size={scaleFont(20)} />}
                onSubmit={() => inputOne.current.focus()}
                borderWidth={2.5}
                borderRadius={5}
              />

              <SizedBox height={1.5} />

              <InputWrap
                value={last_name}
                onChangeText={text => setLName(text)}
                placeholder="Last Name"
                color={Colors.black}
                returnKeyType="next"
                placeholderTextColor={Colors.lightGrey}
                backgroundColor={Colors.white}
                icon={<Feather Icon name="user" color={Colors.black} size={scaleFont(20)} />}
                onSubmit={() => inputTwo.current.focus()}
                refValue={inputOne}
                borderWidth={2.5}
                borderRadius={5}
              />

              <SizedBox height={1.5} />

              <InputWrap
                value={email}
                onChangeText={text => setEmail(text)}
                placeholder="Email"
                color={Colors.black}
                returnKeyType="next"
                placeholderTextColor={Colors.lightGrey}
                backgroundColor={Colors.white}
                icon={<Feather Icon name="mail" color={Colors.black} size={scaleFont(20)} />}
                keyboardType="email-address"
                onSubmit={() => inputThree.current.focus()}
                refValue={inputTwo}
                borderWidth={2.5}
                borderRadius={5}
              />

              <SizedBox height={1.5} />

              <InputWrap
                value={password1}
                onChangeText={text => setPassword1(text)}
                placeholder="Password"
                secure={true}
                color={Colors.black}
                returnKeyType="done"
                placeholderTextColor={Colors.lightGrey}
                backgroundColor={Colors.white}
                icon={<Feather Icon name="lock" color={Colors.black} size={scaleFont(20)} />}
                onSubmit={() => inputFour.current.focus()}
                refValue={inputThree}
                borderWidth={2.5}
                borderRadius={5}
              />

              <SizedBox height={1.5} />

              <InputWrap
                value={password2}
                onChangeText={text => setPassword2(text)}
                placeholder="Confirm Password"
                secure={true}
                returnKeyType="done"
                placeholderTextColor={Colors.lightGrey}
                backgroundColor={Colors.white}
                icon={<Feather Icon name="lock" color={Colors.black} size={scaleFont(20)} />}
                onSubmit={submit}
                refValue={inputFour}
                color={Colors.black}
                borderWidth={2.5}
                borderRadius={5}
              />

              <SizedBox height={1.5} />
              <Container verticalAlignment="center">
                <Container flex={1} backgroundColor={Colors.primary} borderTopLeftRadius={50}>
                  {loading ? (
                    <Container backgroundColor={Colors.black} paddingVertical={2} direction="row" flex={1} horizontalAlignment="center" verticalAlignment="center">
                      <ActivityIndicator color={Colors.white} size="large" />
                    </Container>
                  ) : (
                    <TouchFeedback flex={1} onPress={submit}>
                      <Container paddingVertical={2} flex={1} borderRadius={5} horizontalAlignment="center" verticalAlignment="center"
                      backgroundColor={Colors.black}>
                        <H2 fontSize={FONTSIZE.big} color={Colors.white}>Sign Up</H2>
                      </Container>
                    </TouchFeedback>
                  )}
                </Container>
                <SizedBox height={1.5} />
                <TouchFeedback flex={1} onPress={() => props.navigation.navigate('SignIn')}>
                  <P fontSize={8}  textAlign="center" color={Colors.black}>
                    Already a member?{' '}
                    <H2 fontSize={FONTSIZE.medium} color={Colors.black}>
                      Sign In
                    </H2>
                  </P>
                </TouchFeedback>
                <SizedBox height={1.5} />
              </Container>
            </Container>
          </Container>
        </ScrollArea>
      </Container>
    </View>
  );
};

export default SignUp;
