import React,{useState} from 'react';
import {WebView} from 'react-native-webview';
import Modal from 'react-native-modal';
import {StyleSheet} from 'react-native';
import {
  Text,
  View,
  ActivityIndicator,
} from 'react-native';

const PaystackUrl = (payload) =>(
  payload.plan_id ? (
    {
  
      html: `  
          <!DOCTYPE html>
          <html lang="en">
              <body style="background-color:'blue'; height:100vh; ">
             
              <script src="https://js.paystack.co/v1/inline.js"></script>
             
             
            <script type="text/javascript">
            payWithPaystack();
              function payWithPaystack(){
                var handler = PaystackPop.setup({
                  key: "${payload.key}",
                  email:"${payload.email}",
                  amount: "${payload.amount}",
                  currency: "NGN",
                  ref: "${payload.reference_id}", // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
                  firstname: "${payload.firstname}",
                  lastname: "${payload.lastname}",
                  plan : "${payload.plan_id}",
                  // label: "Optional string that replaces customer email"
                  metadata: {
                     custom_fields: [
                        {
                            display_name: "Mobile Number",
                            variable_name: "mobile_number",
                            value: "+2348012345678"
                        }
                     ]
                  },
                  callback: function(response){
                    window.ReactNativeWebView.postMessage(JSON.stringify(response))
                  },
                  onClose: function(data){
                    window.ReactNativeWebView.postMessage(JSON.stringify({message: "USER_CANCELLED"}))
                  }
                });
                handler.openIframe();
              }
            </script>
              </body>
      `
    }
  ) : (
    {
  
      html: `  
          <!DOCTYPE html>
          <html lang="en">
              <body style="background-color:'blue'; height:100vh; ">
             
              <script src="https://js.paystack.co/v1/inline.js"></script>
             
             
            <script type="text/javascript">
            payWithPaystack();
              function payWithPaystack(){
                var handler = PaystackPop.setup({
                  key: "${payload.key}",
                  email:"${payload.email}",
                  amount: "${payload.amount}",
                  currency: "NGN",
                  ref: "${payload.reference_id}", // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
                  firstname: "${payload.firstname}",
                  channels: ['card'],
                  lastname: "${payload.lastname}",
                  // label: "Optional string that replaces customer email"
                  metadata: {
                     custom_fields: [
                        {
                            display_name: "Mobile Number",
                            variable_name: "mobile_number",
                            value: "+2348012345678"
                        }
                     ]
                  },
                  callback: function(response){
                    window.ReactNativeWebView.postMessage(JSON.stringify(response))
                  },
                  onClose: function(data){
                    window.ReactNativeWebView.postMessage(JSON.stringify({message: "USER_CANCELLED"}))
                  }
                });
                handler.openIframe();
              }
            </script>
              </body>
      `
    }
  )
);

const PayPalUrl = () => (
  {
  
    html: `  
        <!DOCTYPE html>
        <html lang="en">
            <body style="background-color:'blue'; height:100vh; ">

            <div id="smart-button-container">
              <div style="text-align: center;">
                <div id="paypal-button-container"></div>
              </div>
            </div>
           
            <script src="https://www.paypal.com/sdk/js?client-id=AUG8FNTWDAI0M522pHVAh7h5s36wpS3PqEoDJg7Tq_Ro7GneDWKojGaFv5ATGolQO5WEU8UbBLXy6P82&currency=USD" data-sdk-integration-source="button-factory"></script>
           
           
          <script type="text/javascript">
          function initPayPalButton() {
            paypal.Buttons({
              style: {
                shape: 'rect',
                color: 'gold',
                layout: 'vertical',
                label: 'paypal',
                
              },
          
              createOrder: function(data, actions) {
                return actions.order.create({
                  purchase_units: [{"description":"AGS plan subscription", "reference_id":"reference_id__IIIEIEI#", "amount":{"currency_code":"USD","value":100}}]
                });
              },
          
              onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                  window.ReactNativeWebView.postMessage(JSON.stringify(details))
                });
              },
          
              onError: function(err) {
                window.ReactNativeWebView.postMessage(JSON.stringify(err))
              }
            }).render('#paypal-button-container');
          }
          initPayPalButton();
          </script>
            </body>
    `
  }
)


const monifyURL = (data) => (
  {
  
    html: `  
        <!DOCTYPE html>
        <html lang="en">
            <body style="background-color:'blue'; height:100vh; ">
            <script type="text/javascript" src="https://sdk.monnify.com/plugin/monnify.js"></script>
                  
            
            <script type="text/javascript">
            payWithMonnify()
              function payWithMonnify() {
                MonnifySDK.initialize({
                  amount: 5000,
                  currency: "NGN",
                  reference: "${data.reference_id}",
                  customerName: "${data.full_name}",
                  customerEmail: "${data.email}",
                  apiKey: "MK_TEST_L9JGC3BXD7",
                  contractCode: "4934121693",
                  paymentDescription: "${data.description}",
                  isTestMode: true,
                    metadata: {
                                "name": "Damilare",
                                "age": 45
                        },
                  paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],
                  // incomeSplitConfig: 	[
                  //         {
                  //       "subAccountCode": "MFY_SUB_342113621921",
                  //       "feePercentage": 50,
                  //       "splitAmount": 1900,
                  //       "feeBearer": true
                  //     },
                  //     {
                  //       "subAccountCode": "MFY_SUB_342113621922",
                  //       "feePercentage": 50,
                  //       "splitAmount": 2100,
                  //       "feeBearer": true
                  //     }
                  //     ],
                  onComplete: function(response){
                    //Implement what happens when transaction is completed.
                     console.log(response);
                     window.ReactNativeWebView.postMessage(JSON.stringify(response))
                     response
                  },
                  onClose: function(data){
                    //Implement what should happen when the modal is closed here
                    console.log(data);
                    window.ReactNativeWebView.postMessage(JSON.stringify(data))
                  }
                });
              }
            </script>
            </body>
    `
  }
)

export const ModalWebView = ({transactionHandler,payload,showModal,setShowModal,paypal_load,setLoading,
  setPayload,setPaypalLoad,is_monify
}) => {
  let paystackView;
  if(is_monify){
    paystackView = monifyURL(payload)
  }else{
    paystackView = !paypal_load ? PaystackUrl(payload) : PayPalUrl(paypal_load);
  }
  console.log("paystackView",paystackView)
  let MyWebView = null;
  return(
    <View style={{flex: 1}}>
        <Modal
          visible={showModal}
          animationType="slide"
          transparent={false}
          style={{flex: 1}}
          onRequestClose={() =>{
            setShowModal(false);
            setLoading(false);
            setPayload ? setPayload({}) : null;
            setPaypalLoad ? setPaypalLoad({}) : null;
          }}
          onHardwareBackPress={() =>{
            setShowModal(false);
            setLoading(false);
            setPayload ? setPayload({}) : null;
            setPaypalLoad ? setPaypalLoad({}) : null;
          }}>
          <WebView
            injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=1'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
            scalesPageToFit={true}
            javaScriptEnabled={true}
            javaScriptEnabledAndroid={true}
            originWhitelist={['*']}
            ref={(webView) => (MyWebView = webView)}
            source={paystackView}
            automaticallyAdjustContentInsets={true}
            onMessage={(e) => transactionHandler(e.nativeEvent.data)}
            //onNavigationStateChange={this.handleWebViewNavigationStateChange}
            onLoadStart={false}
            onLoadEnd={false}
            style={{flex: 1}}
          />
          {/* {this.state.true && (
            <View>
              <ActivityIndicator
                size="large"
                color={this.props.ActivityIndicatorColor}
              />
            </View>
          )} */}
        </Modal>
        
      </View>
)


}

