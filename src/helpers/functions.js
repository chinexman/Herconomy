import AsyncStorage from '@react-native-community/async-storage';
import {Share} from 'react-native';
import axios from 'axios';
//import Share from 'react-native-share';
import Toast from 'react-native-toast-message';
import moment from 'moment';

export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(`@${key}`, jsonValue);
    return true;
  } catch (e) {
    return false;
  }
};

export const getData = async key => {
  try {
    const jsonValue = await AsyncStorage.getItem(`@${key}`);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    return false;
  }
};

/* export const shareDetails = async fd => {
  try {
    const result = await Share.share(fd);
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    //alert(error.message);
  }
}; */

export const shareDetails = async fd => {
  try {
    const result = await Share.share({
      message : `${fd.user || ""} ${fd.time || ""} posted this on Herconomy app “${fd.message || ""}”.  To join the conversation download the app on Playstore via https://tinyurl.com/y6hd63bw`});
  } catch (error) {
  }
};


export const sendNotification = (data) => {
  axios
      .post(`onesignal.com/api/v1/notifications`, data, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }).then(res=>{
      }).catch(error=>{
      })
}

export const ToastSuccess = (msg) => {
  return Toast.show({
    type: 'success',
    position: 'bottom',
    text1: "You are back online",
    text2: "",
    visibilityTime: 4000,
    autoHide: true,
    topOffset: 30,
    bottomOffset: 40,
    onShow: () => {},
    onHide: () => {},
    onPress: () => {},
  });
}

export const ToastError = (msg) => {
  return Toast.show({
    type: 'error',
    position: 'bottom',
    text1: 'You are offline',
    text2: "",
    visibilityTime: 4000,
    autoHide: true,
    topOffset: 30,
    bottomOffset: 40,
    onShow: () => {},
    onHide: () => {},
    onPress: () => {},
  });
}
 
export const calAmtToBeSaved = (planData) => {
  let amount_to_be_saved;
  if(planData.frequency === "Daily"){
    let diff = moment(planData.end_date).diff(planData.start_date,'days')
    amount_to_be_saved = diff > 0 ? diff * planData.target_amount : planData.target_amount;
    //saving_date = moment(new Date()).diff(planData.start_date,'days').add(1,'day'); 
  }
  if(planData.frequency === "Weekly"){
    let diff = moment(planData.end_date).diff(planData.start_date,'weeks')
    amount_to_be_saved = diff > 0 ? diff * planData.target_amount : planData.target_amount;
    //saving_date = moment(new Date()).diff(planData.start_date,'days').add(1,'day'); 
  }
  if(planData.frequency === "Monthly"){
    let diff = moment(planData.end_date).diff(planData.start_date,'months')
    amount_to_be_saved = diff > 0 ? diff * planData.target_amount : planData.target_amount;
    //saving_date = moment(new Date()).diff(planData.start_date,'days').add(1,'day');
  }
  if(planData.frequency === "Once"){
      amount_to_be_saved = planData.target_amount
  }
  return amount_to_be_saved;
}

export const generateRandomString = () => {
    var result           = '';
    var characters       = `${new Date().getTime()}ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij${new Date().getTime()}klmnopqrstuvwxyz0123456789${new Date().getTime()}`;
    var charactersLength = characters.length;
    for ( var i = 0; i < 15; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
      charactersLength));
   }
   return result;
}

 