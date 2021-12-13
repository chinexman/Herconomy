import React from 'react';
import {Container, SizedBox,TouchWrap,} from '@burgeon8interactive/bi-react-library';
import {P,TouchFeedback} from '../components/component';
import DatePicker from 'react-native-date-picker';
import Colors from '../helpers/colors';
import { Alert } from 'react-native';
import moment from 'moment';

export const IOSDatePicker = ({setPlaceholder,setHolder,setShow,value,placeholder,isDOB,isEvent,isSavings,
  setHowLong
}) => {
    return(
      <Container position="absolute" backgroundColor={Colors.whiteBase} marginTop={20} padding={6} marginLeft={3}>
        <DatePicker
          date={placeholder}
          onDateChange={(value)=>setPlaceholder(new Date(value))}
          mode={isEvent ? "datetime" : "date"}
        />
        <Container direction="row" marginTop={5} horizontalAlignment="flex-end" widthPercent="98%">
          <TouchWrap borderBottomWidth={0.3} borderBottomColor={Colors.line}
          onPress={()=>{
            setHolder(value ? new Date(value) : new Date())
            setShow(false);
          }}
          >
            <P fontSize={10}>Cancel</P>
          </TouchWrap>
          <SizedBox width={5}/>
          <TouchWrap borderBottomWidth={0.3} borderBottomColor={Colors.line}
          onPress={()=>{
            if(isDOB && (new Date(placeholder).getTime() > new Date().getTime())){
              setHolder(new Date());
              return Alert.alert("Sorry! You can't select a future date");
            }
            if(isDOB && ((new Date().getYear() - new Date(placeholder).getYear()) < 18)){
              setHolder(new Date(new Date().getYear() - 18));
              return Alert.alert("Sorry! Age can not be less than 18");
            }
            console.log("<<||>>",placeholder,moment(new Date()).add(3,'months'))
            if(isSavings && moment(new Date(placeholder)).isBefore(moment(new Date()).add(3,'months'))){
              return Alert.alert("Herconomy","Minimum duration for goals is 3 months.")
            }
            if(isSavings){
              setHowLong(placeholder)
              return setShow(false)
            }

            setHolder(new Date(placeholder));
            setShow(false)
          }}
          >
            <P fontSize={10}>Select</P>
          </TouchWrap>
        </Container>
      </Container>
    )
}