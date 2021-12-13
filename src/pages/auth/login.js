import React, {useState, useRef} from 'react';
import {TouchWrap, Container, ScrollArea, ImageWrap, SizedBox, scaleFont, InputWrap} from '@burgeon8interactive/bi-react-library';
import {H1,H2, P, CheckBok,TouchFeedback} from '../../components/component';
import {useStoreActions} from 'easy-peasy';
import {RouteContext} from '../../helpers/routeContext';
import Colors from '../../helpers/colors';
import Feather from 'react-native-vector-icons/Feather';
import {View, ActivityIndicator,Alert,Platform,Keyboard} from 'react-native';
import {ToastLong} from '../../helpers/utils';
import {GoogleSignin} from '@react-native-community/google-signin';
import {storeData, getData} from '../../helpers/functions';
import { FONTSIZE } from '../../helpers/constants';
import { apiFunctions } from '../../helpers/api';
import { getUniqueId, getManufacturer,getDeviceId,getDeviceName,getIpAddress,getDeviceType,getBaseOs} from 'react-native-device-info';

const SignIn = props => {
  const inputOne = useRef(null);
  const {currentStack, setCurrentState} = React.useContext(RouteContext);

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const loginAction = useStoreActions(actions => actions.userDetails.appLogin);
  const [secure,setSecure] = React.useState(true)

  const submitGoogleSign = async () => {
    try {
      let {idToken} = await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const user = userInfo.user;
      processUser(user.email, user.id);
    } catch (error) {
    }
  };

  const submit = async () => {
    if (email === '' || password === '') {
      Alert.alert('Herconomy','Email and password are required')
      return;
    }
    Keyboard.dismiss();
    storeData('email', {email});
    processUser(email, password);
  };

  const processUser = async (email, password) => {
    setLoading(true);
    try {
      let fd = {email, password};
      let res = await loginAction(fd);
      if (res) {
        let device_id = await getDeviceId();
        let device_name = await getDeviceName();
        let device_ip = await getIpAddress();
        let device_type = await getDeviceType();
        let fd = {
          device : `${device_id}|${device_name}|${device_ip}|${device_type}|${Platform.OS}`
        }
        let token = await getData("token")
        apiFunctions.send_mail(token,fd);
        setLoading(false);
        res.onboarded ? setCurrentState('main') : setCurrentState('onboard');
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const loadUserName = async () => {
    let getEmail = await getData('email');
    if (getEmail) {
      setEmail(getEmail.email);
    }
  };

  React.useEffect(() => {
    loadUserName();
    GoogleSignin.configure({
      webClientId: '470433460061-5aookol460l1qt77r02doc9u8ic3ab1h.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  return (
    <View style={{flex: 1}}>
      <Container flex={1} backgroundColor={Colors.primary} verticalAlignment="center" paddingHorizontal={3}>
        <SizedBox height={4} />

        <ScrollArea flexGrow={1}>
          <Container flex={1} verticalAlignment="center">
            <ImageWrap source={require('../../../assets/img/agsLogo_dark.png')} fit="contain" height={10} />
          </Container>



          <Container backgroundColor={Colors.primary} paddingTop={3} flex={1}>
            <Container paddingHorizontal={2} marginBottom={1}>
              <H1 color={Colors.black} textAlign="center" fontSize={13}>
                Sign in to the Pan African Network of female professionals and entrepreneurs.
              </H1>
              <SizedBox height={2} />
              {
                Platform.OS !== 'ios' && (
                  <>
                    <TouchFeedback onPress={submitGoogleSign}>
                      <Container direction="row" backgroundColor={Colors.black} horizontalAlignment="center"
                      verticalAlignment="center" borderRadius={5}
                      paddingVertical={1.5}
                      >
                        <ImageWrap source={require('../../../assets/img/icons/google.png')} height={5} widthPercent="6%" fit="contain"/>
                        <SizedBox width={2}/>
                        <H1 color={Colors.white} fontSize={FONTSIZE.medium}>Continue with Google</H1>
                      </Container>
                    </TouchFeedback>
                    <SizedBox height={2}/>
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
                    <SizedBox height={2} />
                  </>
                )
              }
              
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
                borderColor="black"
                borderRadius={5}
                onSubmit={() => inputOne.current.focus()}
                borderWidth={2.5}
                textAlignVertical="center"
              />

              <SizedBox height={1.5} />

              <InputWrap
                refValue={inputOne}
                value={password}
                onChangeText={text => setPassword(text)}
                placeholder="Password"
                secure={secure}
                color={Colors.black}
                returnKeyType="done"
                placeholderTextColor={Colors.lightGrey}
                backgroundColor={Colors.white}
                icon={<Feather Icon name="lock" color={Colors.black} size={scaleFont(20)} />}
                onSubmit={submit}
                borderColor={Colors.black}
                borderRadius={5}
                borderWidth={2.5}
                textAlignVertical="center"
                secureIcon={<Feather Icon name={secure ? "eye" : "eye-off"} color={Colors.black} size={scaleFont(FONTSIZE.icon)} />}
                onToggleSecure={()=>setSecure(!secure)}
              />
              <SizedBox height={3} />
              <Container flex={1} backgroundColor={Colors.primary} borderTopLeftRadius={50}>
                {loading ? (
                  <Container paddingVertical={1.3} flex={1} horizontalAlignment="center" verticalAlignment="center"
                  backgroundColor={Colors.black} borderRadius={5}>
                    <ActivityIndicator color={Colors.white} size="large" />
                  </Container>
                ) : (
                  <TouchFeedback flex={1} onPress={submit}>
                    <Container paddingVertical={2} flex={1} borderRadius={5} horizontalAlignment="center" verticalAlignment="center"
                     backgroundColor={Colors.black}>
                      <H2 fontSize={14} color={Colors.white}>Sign In</H2>
                    </Container>
                  </TouchFeedback>
                )}
              </Container>
              <SizedBox height={3}/>
              <TouchFeedback paddingBottom={1} onPress={() => props.navigation.navigate('Forgot')}>
                <H2 color={Colors.black} fontSize={10} textAlign="center">
                  Forgot Password?
                </H2>
              </TouchFeedback>

              <SizedBox height={3}/>
              <TouchFeedback paddingBottom={1} onPress={() => props.navigation.navigate('SignUp')}>
                <H2 color={Colors.black} fontSize={10} textAlign="center">
                  Don't have an account? Create one.
                </H2>
              </TouchFeedback>
            </Container>
          </Container>
        </ScrollArea>
      </Container>
    </View>
  );
};

export default SignIn;
