import React, {useState} from 'react';
import {Input, H1, H2, Button, Dropdown, CheckBox2, ButtonInvert,TouchFeedback, DropdownSmall} from './component';
import {Container, SizedBox, TouchWrap} from '@burgeon8interactive/bi-react-library';
import Colors from '../helpers/colors';
import {ScrollView, Platform} from 'react-native';
import ImagePicker from 'react-native-image-picker';
//import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePicker from 'react-native-date-picker'
import {ToastShort, ToastLong} from '../helpers/utils';
import moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import {IOSDatePicker} from '../components/ios_date_picker';
import { FONTSIZE } from '../helpers/constants';

const allInterest = [
  {name: 'Baking', value: false},
  {name: 'Beauty', value: false},
  {name: 'Cooking', value: false},
  {name: 'Dating', value: false},
  {name: 'Dining', value: false},
  {name: 'Entertainment', value: false},
  {name: 'Entrepreneurship', value: false},
  {name: 'Family and relationships', value: false},
  {name: 'Fashion Design', value: false},
  {name: 'Fitness and wellness', value: false},
  {name: 'Food and drink', value: false},
  {name: 'Games', value: false},
  {name: 'Hiking', value: false},
  {name: 'Investing', value: false},
  {name: 'Meditation', value: false},
  {name: 'Movies', value: false},
  {name: 'Music', value: false},
  {name: 'Painting', value: false},
  {name: 'Parenting', value: false},
  {name: 'Politics', value: false},
  {name: 'Performing arts', value: false},
  {name: 'Pets', value: false},
  // {name: 'Photography', value: false},
  {name: 'Photography', value: false},
  {name: 'Poetry', value: false},
  {name: 'Reading', value: false},
  // {name: 'Reading', value: false},
  {name: 'Real estate', value: false},
  {name: 'Restaurants', value: false},
  {name: 'Running', value: false},
  {name: 'Shopping and fashion', value: false},
  {name: 'Singing', value: false},
  {name: 'Sports and outdoors', value: false},
  {name: 'Swimming', value: false},
  {name: 'Technology', value: false},
  {name: 'Tennis', value: false},
  {name: 'Travel', value: false},
  {name: 'TV', value: false},
  {name: 'Volunteering', value: false},
  {name: 'Writing', value: false},
  {name: 'Yoga', value: false},
];

export const MiniFormOne = ({setDob, openListWrapper, setLocation, date_of_birth, nationality, location}) => {
  const [date, setDate] = useState(new Date(1598051730000));
  const [show, setShow] = React.useState(false);
  const [mode, setMode] = useState('date');

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');

    setDate(currentDate);
    setDob(moment(currentDate).format('YYYY-MM-DD'));
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  return (
    <Container flex={1} verticalAlignment="center" width={100} paddingHorizontal={6} flexGrow={1}>
      <H1 textAlign="center" fontSize={FONTSIZE.page}>
        Tell us a little about yourself
      </H1>

      <SizedBox height={3} />

      <Dropdown placeholder="Date of Birth" backgroundColor="#fff" onPress={showDatepicker} value={moment(date_of_birth).format('YYYY-MM-DD')} />
      <SizedBox height={1.5} />
      <Dropdown placeholder="Nationality" backgroundColor="#fff" onPress={() => openListWrapper('Nationality')} 
      value={nationality} />
      <SizedBox height={1.5} />
      <Input placeholder="Location: City, Country" value={location} onChangeText={text => setLocation(text)} />
      <SizedBox height={1.5} />
      {show && <IOSDatePicker setPlaceholder={setDob} setHolder={setDob} setShow={setShow} 
      value={date_of_birth} placeholder={date_of_birth} isDOB={true}/>}
    </Container>
  );
};

export const MiniFormTwo = ({job_title, profession, openListWrapper, industry, setJobTitle, Profession}) => (
  <Container flex={1} verticalAlignment="center" width={100} paddingHorizontal={6}>
    <H1 textAlign="center" fontSize={FONTSIZE.page}>
      Tell us what you do for work
    </H1>

    <SizedBox height={3} />

    <Input placeholder="Job Title/Entrepreneur" value={job_title} onChangeText={text => setJobTitle(text)} />
    <Input placeholder="Profession" value={profession} onChangeText={text => Profession(text)} />
    <Dropdown placeholder="Job Sector/Industry" backgroundColor="#fff" value={industry} onPress={() => openListWrapper('Job Sector')} />
  </Container>
);

export const MiniFormThree = ({interest, setInterest}) => {
  const [theInterest, setTheInterests] = React.useState(allInterest);

  const filter = val => {
    //let theFilter = allInterest.filter((el, i) => el.value.includes(val));
  };

  const updateChoices = index => {
    let newArr = [...theInterest];

    if (newArr[index].value) {
      newArr[index].value = false;
    } else {
      newArr[index].value = true;
    }

    let theChoice = newArr.filter((el, i) => el.value === true);
    let theChoiceObj = [];
    theChoice.forEach((el, i) => {
      theChoiceObj.push(el.name);
    });

    setInterest(theChoiceObj);
    setTheInterests(newArr);
  };

  return (
    <Container flex={1} verticalAlignment="center" width={100} paddingHorizontal={6}>
      <H1 textAlign="center" fontSize={FONTSIZE.page}>
        We would like to know what interests you
      </H1>

      <SizedBox height={3} />

      {/*  <Input placeholder="Search Interest" /> */}

      <Container flex={1} height={20}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <Container direction="row" wrap="wrap" horizontalAlignment="space-between">
            {theInterest.map((el, i) => (
              <TouchWrap widthPercent="45%" paddingVertical={2} onPress={() => updateChoices(i)} key={i}>
                <Container direction="row">
                  <Container widthPercent="20%" horizontalAlignment="center" verticalAlignment="center">
                    <CheckBox2 status={el.value} onPress={() => updateChoices(i)} />
                  </Container>
                  <SizedBox width={2} />
                  <Container widthPercent="80%" paddingRight={4}>
                    <H2 fontSize={FONTSIZE.medium}>{el.name}</H2>
                  </Container>
                </Container>
              </TouchWrap>
            ))}
          </Container>
        </ScrollView>
      </Container>
    </Container>
  );
};

export const MiniFormFour = ({setFile, setFileMeta}) => {
  const pickImage = () => {
    const options = {
      title: 'Select Profile PIcture',
    };
    ImagePicker.launchImageLibrary(options, response => {
      try {
        if(response.fileSize > 2000000){
          return ToastShort("Image must not be more than 2mb");
        }
        if (response.didCancel) {
          ToastShort('User cancelled image picker');
        } else if (response.error) {
          ToastShort(response.error);
        } else {
          // let ext = response.fileName ? response.fileName.toLowerCase().split('.')[1] : "";
          // if(ext !== 'png' && ext !== 'jpeg' && ext !== 'jpg'){
          //   return ToastShort("Wrong image format");
          // }
          setFile(response.uri);
          setFileMeta(response);
        }
      } catch (error) {}
    });
  };

  const pickCamera = () => {
    const options = {
      title: 'Select Profile PIcture',
    };
    ImagePicker.launchCamera(options, response => {
      try {
        if (response.didCancel) {
          ToastShort('User cancelled image picker');
        } else if (response.error) {
          ToastShort(response.error);
        } else {
          setFile(response.uri);
          setFileMeta(response);
        }
      } catch (error) {}
    });
  };

  return (
    <Container flex={1} verticalAlignment="center" width={100} paddingHorizontal={6}>
      <SizedBox height={3} />

      <H1 textAlign="center" fontSize={FONTSIZE.page}>
        Let's put a face to the name!
      </H1>

      <SizedBox height={1} />

      <H2 textAlign="center" fontSize={FONTSIZE.big} color={Colors.button}>
        Selfie or Professional Headshot - completely up to you!
      </H2>

      <SizedBox height={5} />

      <ButtonInvert fontSize={FONTSIZE.medium} title=" Take a selfie" onPress={pickCamera} />

      <SizedBox height={1} />

      <Button fontSize={FONTSIZE.medium} color={Colors.white} title="Upload a picture" onPress={pickImage} />
    </Container>
  );
};

export const MiniFormFive = ({submitForm, isLoading}) => (
  <Container flex={1} verticalAlignment="center" width={100} paddingHorizontal={6}>
    <SizedBox height={3} />
    <H1 textAlign="center" fontSize={FONTSIZE.page}>
      All done!
    </H1>

    <SizedBox height={3} />

    <Button fontSize={FONTSIZE.big} title="Let's get started" onPress={submitForm} loading={isLoading} />
  </Container>
);
