import React, {useState, useRef} from 'react';
import {TouchWrap, Container, ScrollArea, ImageWrap, SizedBox, scaleFont, InputWrap, TextWrap} from '@burgeon8interactive/bi-react-library';
import {H1,H2, P, CheckBok,TouchFeedback} from '../../components/component';
import {useStoreActions} from 'easy-peasy';
import {RouteContext} from '../../helpers/routeContext';
import Colors from '../../helpers/colors';
import Feather from 'react-native-vector-icons/Feather';
import {View, ActivityIndicator, Keyboard,Alert,Platform,Linking} from 'react-native';
import {ToastLong} from '../../helpers/utils';
import {GoogleSignin} from '@react-native-community/google-signin';
import {storeData, getData} from '../../helpers/functions';
import {apiFunctions} from '../../helpers/api';
import { FONTSIZE } from '../../helpers/constants';

const Welcome = props => {
  const inputOne = useRef(null);
  const {currentStack, setCurrentState} = React.useContext(RouteContext);

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const loginAction = useStoreActions(actions => actions.userDetails.appLogin);

  const updateUser = useStoreActions(actions => actions.userDetails.updateUser);
  const updateToken = useStoreActions(actions => actions.userDetails.updateToken);
  

  const submitGoogleSign = async () => {
    try {
      let {idToken} = await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const user = userInfo.user;
      processUser(user.givenName, user.familyName, user.email, user.id, user.id);
    } catch (error) {
    }
  }

  const processUser = async (first_name, last_name, email, password1, password2) => {
    setLoading(true);
    try {
      let fd = {first_name, last_name, email, password1, password2};
      let res = await apiFunctions.registration(fd);
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
            <H1 color={Colors.black} textAlign="center" fontSize={FONTSIZE.semiBig}>
              Sign up to join Africa's first community for empowered women combined with financial platform.
              Men who believe in the empowerment of women are also welcome to join.
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
                        <H1 color={Colors.white} fontSize={FONTSIZE.semiBig}>Continue with Google</H1>
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
                        <H1 color={Colors.white} fontSize={FONTSIZE.semiBig}>Continue with Apple</H1>
                      </Container>
                    </TouchFeedback>
                    <SizedBox height={2} />
                  </>
                )
              }
              <Container flex={1} backgroundColor={Colors.primary} borderTopLeftRadius={50}>
                {loading ? (
                  <Container paddingVertical={1.3} flex={1} horizontalAlignment="center" verticalAlignment="center"
                  backgroundColor={Colors.black} borderRadius={5}>
                    <ActivityIndicator color={Colors.white} size="large" />
                  </Container>
                ) : (
                  <TouchFeedback flex={1} onPress={() => props.navigation.navigate('SignUp')}>
                    <Container paddingVertical={2} flex={1} borderRadius={5} horizontalAlignment="center" verticalAlignment="center"
                     backgroundColor={Colors.black} direction="row">
                        <Feather name="mail" size={scaleFont(15)} color={Colors.white}/>
                        <SizedBox width={2}/>
                      <H2 fontSize={FONTSIZE.semiBig} color={Colors.white}>Continue with Email</H2>
                    </Container>
                  </TouchFeedback>
                )}
              </Container>

              <SizedBox height={3}/>
              <TouchFeedback paddingBottom={1} onPress={() => props.navigation.navigate('SignIn')}>
                <H2 color={Colors.black} fontSize={FONTSIZE.medium} textAlign="center">
                  Already have an account? <H1>Sign In.</H1>
                </H2>
              </TouchFeedback>
            </Container>
          </Container>
              <Container horizontalAlignment="center">
                <TouchFeedback onPress={()=>Linking.openURL('https://www.agstribe.org/privacy-policy')}>
                  <P color={Colors.black} fontSize={FONTSIZE.medium} textAlign="center">
                    By Signing up, you agree to our <H2 fontSize={FONTSIZE.medium} color={Colors.black}>Privacy policy</H2> and 
                  </P>
                </TouchFeedback>
                <TouchFeedback onPress={()=>Linking.openURL('https://www.agstribe.org/terms/')}>
                  <P color={Colors.black} fontSize={10} textAlign="center"><H2 fontSize={FONTSIZE.medium} color={Colors.black}>Terms and conditions.</H2></P>
                </TouchFeedback>
              </Container>
              <SizedBox height={3}/>
        </ScrollArea>
      </Container>
    </View>
  );
};

export default Welcome;
