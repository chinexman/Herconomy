
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import { ToastLong } from '../helpers/utils';
import { Alert } from 'react-native';


export const addEventToCalendar = (title,start_date,end_date="",description) => {
    const eventConfig = {
      title: title,
      startDate: start_date,
      endDate: end_date,
      notes: `${description.substr(1,50)} ...`
    };
    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then(eventInfo => {
          if(eventInfo.action === 'CANCELED'){
              return Alert.alert('Herconomy','Calendar has been closed');
          }
          Alert.alert('Herconomy',"Event has been added to calendar");
      })
      .catch(error => {
        Alert.alert('Herconomy', error);
      });
  }