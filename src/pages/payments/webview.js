import React, {useState, useRef, useEffect} from 'react';
import ProgressWebView from 'react-native-progress-webview';
import Colors from '../../helpers/colors';
import {Container, SizedBox, scaleFont, TouchWrap} from '@burgeon8interactive/bi-react-library';
import Feather from 'react-native-vector-icons/Feather';
import {color} from 'react-native-reanimated';
import {H1,TouchFeedback} from '../../components/component';
import {useNavigation} from '@react-navigation/native';

const paymentRoutes = {
  card_year: 'https://paystack.com/pay/agstribeyearly',
  card_month: 'https://paystack.com/pay/2oy9cddbnv',
  //card_month: 'https://paystack.com/pay/agstribemonthly',
  paypal_month: 'https://paystack.com/pay/agstribemonthly',
  paypal_year: 'https://paystack.com/pay/agstribemonthly',
};

const Webview = props => {
  const navigation = useNavigation();
  const webView = useRef(null);
  const route = props.route.params;
  //const [url,setUrl] = useState(null);
  const [loadingColor, setLoadingColor] = useState(Colors.primary);

  const pageLoadingStart = evt => {
    setLoadingColor(Colors.primary);
  };

  const loadProgress = evt => {
    setLoadingColor(Colors.primary);
  };

  const pageLoadingEnd = evt => {
    let pageTitle = evt.nativeEvent.title;
  };
  const {url} = props.route.params;
  return (
    <Container flex={1}>
      <Container backgroundColor={Colors.primary}>
        <SizedBox height={6} />
        <Container paddingHorizontal={6} direction="row" verticalAlignment="center" horizontalAlignment="space-between">
          <TouchFeedback onPress={() => props.navigation.goBack()}>
            <Feather Icon name="x" size={scaleFont(20)} color="#fff" />
          </TouchFeedback>

          <TouchFeedback onPress={() => navigation.navigate('Account')}>
            <H1 color="#fff">Close</H1>
          </TouchFeedback>
        </Container>
        <SizedBox height={2} />
      </Container>
      <ProgressWebView
        source={{uri: `https://${url}`}}
        color={loadingColor}
        ref={webView}
        onLoadEnd={pageLoadingEnd}
        onLoadStart={pageLoadingStart}
        onLoadProgress={loadProgress}
      />
    </Container>
  );
};

export default Webview;
