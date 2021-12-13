import 'react-native-get-random-values';
import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import Modal from 'react-native-modal';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {PaystackUrl,ModalWebView} from '../../../../../helpers/paystack_webview';


  
  
  messageRecived = async (data) => {
    this.setState({showModal: false});
    var webResponse = JSON.parse(data);
    this.setState({showModal: false});
    switch (
      webResponse.message //i used paymentStatus here, it might be diff from yours. know the right one to use wen u log out webResponse
    ) {
      case 'USER_CANCELLED':
        {
          this.setState({
            showModal: false,
          });
          //  this.authorized();
          this.props.navigation.navigate('Service');
        }
        break;
      case 'Approved': {
        // paymentReference
        //reference
        this.authorized(webResponse.reference);
        try {
          // verify the ref here by sending it back to the backend
        } catch (e) {
            if (e.response) {
            }
        }
      }
    }
  };

  const MyWebView = null;
  //injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=1'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
  
const InvestmentCheckout = ({navigation,route}) => {

    const [showModal,setShowModal] = useState(false);
        return (
          <View style={{flex: 1}}>
            <Modal
              visible={showModal}
              animationType="slide"
              transparent={false}
              style={{flex: 1}}
              onRequestClose={() => this.setState({showModal: false})}
              onHardwareBackPress={() =>
                this.setState({showModal: !this.state.showModal})
              }>
                <WebView
                    injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=1'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
                    scalesPageToFit={true}
                    javaScriptEnabled={true}
                    javaScriptEnabledAndroid={true}
                    originWhitelist={['*']}
                    ref={(webView) => (MyWebView = webView)}
                    source={PaystackUrl}
                    automaticallyAdjustContentInsets={true}
                    onMessage={(e) => this.messageRecived(e.nativeEvent.data)}
                    //onNavigationStateChange={this.handleWebViewNavigationStateChange}
                    onLoadStart={() => this.setState({isLoading: true})}
                    onLoadEnd={() => this.setState({isLoading: false})}
                    style={{flex: 1}}
                />
              {/* {this.state.isLoading && (
                <View>
                  <ActivityIndicator
                    size="large"
                    color={this.props.ActivityIndicatorColor}
                  />
                </View>
              )} */}
            </Modal>
            {this.state.isloading ? (
              <View style={styles.popUp2}>
                <ActivityIndicator size="large" color="#00921B" />
              </View>
            ) : null}
          </View>
        );
}