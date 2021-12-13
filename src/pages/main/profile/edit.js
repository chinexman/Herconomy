import React, {useState} from 'react';
import {AppPageBack, H1, H2, P, Input, Button, Dropdown, ListWrapGeneral, CheckBox2, LocalAvatar,TouchFeedback, TouchWrapButton} from '../../../components/component';
import {FeedBox} from '../home/feeds/feeds';
import {Page, Container, SizedBox, ScrollArea, TouchWrap, TextWrap, Avatar, scaleFont} from '@burgeon8interactive/bi-react-library';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../helpers/colors';
import {useStoreState, useStoreActions} from 'easy-peasy';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Platform, Keyboard, Modal, ScrollView,Alert} from 'react-native';
import moment from 'moment';
//import DateTimePicker from '@react-native-community/datetimepicker';
import {ToastShort} from '../../../helpers/utils';
import {storeData} from '../../../helpers/functions';
import NationalityList from '../../../doc/nationality';
import SectorList from '../../../doc/sectors';
import Interest from '../../../doc/interest';
import {apiFunctions} from '../../../helpers/api';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import {IOSDatePicker} from '../../../components/ios_date_picker';
import {ProfileDatePicker} from '../../../components/profile_date_picker';
import AsyncStorage from '@react-native-community/async-storage';
import { RouteContext } from '../../../helpers/routeContext';
import { FONTSIZE } from '../../../helpers/constants';

const Label = props => (
  <>
    <H2 color={Colors.greyBase900} fontSize={10}>
      {props.name}
    </H2>
    <SizedBox height={0.5} />
  </>
);

const ProfileEdit = props => {
  const {userD, token} = useStoreState(state => ({
    userD: state.userDetails.user,
    token: state.userDetails.token,
  }));

  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [first_name, setFName] = useState(userD.first_name);
  const [last_name, setLName] = useState(userD.last_name);
  const [date_of_birth, setDateOfBirth] = useState(userD.date_of_birth ? userD.date_of_birth : new Date());
  const [nationality, setNationality] = useState(userD.nationality);
  const [location, setLocation] = useState(userD.location);
  const [edu_location, setEduLocation] = useState(userD.education.length > 0 ? userD.education[0].location : '');
  const [certification, setCertification] = useState(userD.education.length > 0 ? userD.education[0].certification : '');
  const [bio, setBio] = useState(userD.bio);
  const [job_title, setJobTitle] = useState(userD.job_title);
  const [profession, setProfession] = useState(userD.profession || "");
  const [company_name, setCompanyName] = useState(userD.company_name || "");
  const [job_location, setJobLocation] = useState('');
  const [job_start_date, setJobStartDate] = useState(new Date());
  const [start_date, setStartDate] = useState(userD.start_date);
  const [graduation_date, setGraduationDate] = useState(userD.education.length > 0 ? new Date(userD.education[0].date) : new Date());
  const [industry, setIndustry] = useState(userD.industry);
  const [interest, setInterest] = useState(userD.interest);
  const [facebook_id, setFacebook] = useState(userD.facebook_id);
  const [twitter_id, setTwitter] = useState(userD.twitter_id);
  const [linkedin_id, setLinkedIn] = useState(userD.linkedin_id);
  const [email, setEmail] = useState(userD.email);
  const [show, setShow] = React.useState(false);
  const [showStartDate, setShowStartDate] = React.useState(false);
  const [showJobStartDate, setShowJobStartDate] = React.useState(false);
  const [showGraduationDate, setShowGraduationDate] = React.useState(false);
  const [mode, setMode] = useState('date');
  const [institution, setInstitution] = useState(userD.education.length > 0 ? userD.education[0].institution : '');

  const [showList, setShowList] = React.useState(false);
  const [listTitle, setListTitle] = React.useState('');
  const [listMap, setListMap] = React.useState([]);
  const [deactivate,setDeactivate] = React.useState(false)
  const [processing,setProcessing] = React.useState(false);
  const {setCurrentState} = React.useContext(RouteContext);

  const [showCheckList, setShowCheckList] = React.useState(false);
  const [checkListMap, setCheckListMap] = React.useState(
    userD.interest
      ? [...Interest].map(item => {
          return userD.interest.includes(item.name)
            ? {
                name: item.name,
                value: true,
              }
            : {
                name: item.name,
                value: false,
              };
        })
      : Interest,
  );
  const [listHolder, setListHolder] = useState([]);
  const [photo, setPhoto] = useState({});
  const [photoPlaceholder, setPhotoPlaceholder] = useState('');

  const {_updateUser} = useStoreActions(actions => ({
    _updateUser: actions.userDetails.updateUser,
  }));

  const pickImage = () => {
    const options = {
      title: 'Select Profile PIcture',
    };
    ImagePicker.launchImageLibrary(options, response => {
      try {
        if (response.didCancel) {
          ToastShort('User cancelled image picker');
        } else if (response.error) {
          ToastShort(response.error);
        } else {
          setPhoto(response);
          setPhotoPlaceholder(response.uri);
        }
      } catch (error) {}
    });
  };

  const submit = async () => {
    try {
      Keyboard.dismiss();
      let dob = date_of_birth ? moment(date_of_birth).format('YYYY-MM-DD') : null;
      setLoading(true);
      if(profession.length < 1){
        setLoading(false);
        return Alert.alert("Profession can not be blank");
      }
      if(
        (facebook_id && !facebook_id.startsWith("https://")) ||
        twitter_id && !twitter_id.startsWith("https://") || 
        linkedin_id && !linkedin_id.startsWith("https://")
      ){
        setLoading(false);
        return Alert.alert("Herconomy","Social links must be formatted properly: 'https://...'")
      }
      let fd =
        photoPlaceholder.length > 0
          ? {
              first_name: first_name,
              last_name: last_name,
              date_of_birth: dob,
              location: location || null,
              nationality: nationality,
              bio: bio,
              job_title: job_title,
              profession: profession,
              company_name: company_name,
              industry: industry,
              interest: interest,
              facebook_id: facebook_id,
              twitter_id: twitter_id,
              linkedin_id: linkedin_id,
              email: email,
              photo: 'data:image/jpeg;base64,' + photo.data,
            }
          : {
              first_name: first_name,
              last_name: last_name,
              date_of_birth: dob,
              location: location || null,
              nationality: nationality,
              bio: bio,
              job_title: job_title,
              profession: profession,
              company_name: company_name,
              industry: industry,
              interest: interest,
              facebook_id: facebook_id,
              twitter_id: twitter_id,
              linkedin_id: linkedin_id,
              email: email,
            };
      let grad_date = graduation_date ? moment(graduation_date).format('YYYY-MM-DD') : null;
      let fd1 =
        userD.education.length > 0
          ? {
              certification: certification,
              institution: institution,
              date: grad_date,
              education_id: userD.education[0].id,
              location: edu_location,
            }
          : {
              certification: certification,
              institution: institution,
              date: grad_date,
              location: edu_location,
            };
      if (certification.length && institution.length && grad_date.length && location.length) {
        let res =
          (await userD.education.length) > 0
            ? apiFunctions.editEducation(userD.id, token, fd1)
            : apiFunctions.createEducation(userD.id, token, fd1);
      }

      let job_date = job_start_date ? moment(job_start_date).format('YYYY-MM-DD') : null;
      let fd2 = {
        company: company_name,
        location: job_location,
        occupation: profession,
        start_date: job_date,
      };
      if (company_name.length && job_location.length && profession.length && job_date.length) {
        let res = await apiFunctions.createCurrentJob(userD.id, token, fd2);
      }
      await apiFunctions.update_user(userD.id, token, fd).then(async data => {
        try {
          setLoading(false);
          if (data !== false) {
            await _updateUser(data);
            await storeData('user', data);
            ToastShort('Updated Successfully');
            props.navigation.goBack();
          } else {
            ToastShort('Unable to update. Please try again later');
          }
        } catch (error) {
          setLoading(false);
          ToastShort('Unable to update. Please try again later');
        }
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      ToastShort('Unable to update. Please try again later');
    }
  };

  const showDatepicker = arg => {
    if (arg === 'dob') {
      setDate(date_of_birth ? new Date(date_of_birth) : date ? new Date(date) : new Date());
      setShow(true);
    }
    if (arg === 'startDate') {
      setDate(moment(start_date).valueOf() || date);
      setShowStartDate(true);
    }
    if (arg === 'graduationDate') {
      setDate(graduation_date);
      setShowGraduationDate(true);
    }
    if (arg === 'jobStartDate') {
      setDate(job_start_date);
      setShowJobStartDate(true);
    }
    setMode('date');
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDateOfBirth(moment(currentDate).format('YYYY-MM-DD'));
  };

  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowStartDate(Platform.OS === 'ios');
    setStartDate(moment(currentDate).format('YYYY-MM-DD'));
  };

  const onChangeJobStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowStartDate(Platform.OS === 'ios');
    setStartDate(moment(currentDate).format('YYYY-MM-DD'));
  };

  const onChangeGraduationDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowGraduationDate(Platform.OS === 'ios');
    setGraduationDate(moment(currentDate).format('YYYY-MM-DD'));
  };

  const deactivateAccount = async () => {
    try{
      //return console.log("clicked");
      setProcessing(true)
      await apiFunctions.deactivate_user(token)
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
      setCurrentState('login');
    }catch(err){
      setProcessing(false)
      console.log("err--",err)
      ToastShort(err.msg)
    }
  }

  const openListWrapper = list => {
    if (list === 'Nationality') {
      setListMap(NationalityList);
      setListHolder(NationalityList);
    }

    if (list === 'Job Sector') {
      setListMap(SectorList);
      setListHolder(SectorList);
    }

    setListTitle(list);
    setShowList(true);
  };

  const selectFromList = el => {
    if (listTitle === 'Nationality') {
      setNationality(el.title);
    }

    if (listTitle === 'Job Sector') {
      setIndustry(el.title);
    }

    setShowList(false);
  };

  const updateChoices = index => {
    let newArr = [...checkListMap];

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
    setCheckListMap(newArr);
  };
  return (
    <AppPageBack title="Edit Profile" {...props}>
      <Container flex={1} marginTop={4}>
        <ScrollArea>
          {/*  <SizedBox height={3} />*/}

          {/* ANCHOR - Personal */}
          <Container direction="row" verticalAlignment="center" horizontalAlignment="space-between">
            <H1 fontSize={16}>Personal</H1>
            <Container widthPercent="30%" alignSelf="flex-end">
              <Button title="Update" onPress={submit} loading={loading} />
            </Container>
          </Container>
          <SizedBox height={2} />
          {/*  <Container widthPercent="30%" alignSelf="flex-end" marginBottom={4}>
            <Button title="Update" onPress={submit} loading={loading} />
          </Container>
}
          {/* <Container>
              <SizedBox height={2}/>
              <TouchFeedback
                  onPress={()=>manageFilePicker()}
              >
                <Container backgroundColor={Colors.whiteBase}
                            paddingHorizontal={3} paddingVertical={2.1}
                            borderRadius={7}
                            direction="row"
                            borderColor={Colors.black}
                            borderWidth={0.5}
                        >
                          <Container widthPercent="20%" horizontalAlignment="center" verticalAlignment="center">
                            <Feather name="camera"/>
                          </Container>
                          <Container widthPercent="80%" verticalAlignment="center">
                            <TextWrap fontSize={FONTSIZE.medium} color={Colors.lightGrey}>
                                {photoPlaceholder}
                            </TextWrap>
                          </Container>
                        </Container>
            </TouchFeedback>
            <SizedBox height={2}/>
          </Container> */}

          <Container marginBottom={3} direction="row">
            {userD.photo && photoPlaceholder.length < 1 && <Avatar url={userD.photo} size={15} />}
            {!userD.photo && photoPlaceholder.length < 1 && <LocalAvatar size={15} />}
            {photoPlaceholder.length > 1 && <Avatar url={photoPlaceholder} size={15} />}
            <SizedBox width={3} />
            <TouchFeedback onPress={pickImage}>
              <Feather name="edit" size={scaleFont(10)} />
            </TouchFeedback>
          </Container>

          <Container marginBottom={1}>
            <Label name="First Name" />
            <Input placeholder="" value={first_name} onChangeText={text => setFName(text)} />
          </Container>

          <Container marginBottom={1}>
            <Label name="Last Name" />
            <Input placeholder="" value={last_name} onChangeText={text => setLName(text)} />
          </Container>

          <Container marginBottom={1}>
            <Label name="Date of Birth" />
            <Dropdown
              placeholder="Date of Birth"
              backgroundColor="#fff"
              value={moment(date_of_birth).format('YYYY-MM-DD')}
              onPress={() => showDatepicker('dob')}
            />
          </Container>

          <Container marginBottom={1}>
            <Label name="Nationality" />
            <Dropdown
              placeholder="Select Country"
              backgroundColor="#fff"
              value={nationality}
              onPress={() => openListWrapper('Nationality')}
            />
          </Container>

          <Container marginBottom={1}>
            <Label name="Location" />
            <Input placeholder="" value={location} onChangeText={text => setLocation(text)} />
          </Container>

          <Container marginBottom={1}>
            <Label name="Bio" />
            <Input placeholder="" value={bio} onChangeText={text => setBio(text)} numberOfLines={4} multiline={true} />
          </Container>

          {/* ANCHOR - Professional */}
          <SizedBox height={3} />
          <H1 fontSize={16}>Professional</H1>
          <SizedBox height={2} />

          <Container marginBottom={1}>
            <Label name="Job Title/Entrepreneur" />
            <Input placeholder="" value={job_title} onChangeText={text => setJobTitle(text)} />
          </Container>

          <Container marginBottom={1}>
            <Label name="Profession" />
            <Input placeholder="" value={profession} onChangeText={text => setProfession(text)} />
          </Container>

          {/*     <Container marginBottom={1}>
            <Label name="Company Name" />
            <Input placeholder="" value={company_name} onChangeText={text => setCompanyName(text)} />
          </Container>
          <Container marginBottom={1}>
            <Label name="State Date" />
            <Dropdown placeholder="Select Date" backgroundColor="#fff" value={start_date} onPress={() => showDatepicker('startDate')} />
          </Container> */}

          <Container marginBottom={1}>
            <Label name="Industry" />
            <Dropdown placeholder="Select Industry" backgroundColor="#fff" value={industry} onPress={() => openListWrapper('Job Sector')} />
          </Container>

          <Container marginBottom={1}>
            <Label name="Current Employer" />
            <Input placeholder="" value={company_name} onChangeText={text => setCompanyName(text)} />
          </Container>

          <Container marginBottom={1}>
            <Label name="Job Location" />
            <Input placeholder="" value={job_location} onChangeText={text => setJobLocation(text)} />
          </Container>

          <Container marginBottom={1}>
            <Label name="Start Date" />
            <Dropdown
              placeholder="Select Start Date"
              backgroundColor="#fff"
              value={moment(job_start_date).format('YYYY-MM-DD')}
              onPress={() => showDatepicker('jobStartDate')}
            />
          </Container>

          {/* ANCHOR - Education */}
          <SizedBox height={3} />
          <H1 fontSize={16}>Education</H1>
          <SizedBox height={2} />

          <Container marginBottom={1}>
            <Label name="Most recent certification" />
            <Input placeholder="" value={certification} onChangeText={text => setCertification(text)} />
          </Container>
          <Container marginBottom={1}>
            <Label name="Institution" />
            <Input placeholder="" value={institution} onChangeText={text => setInstitution(text)} />
          </Container>

          <Container marginBottom={1}>
            <Label name="Date of Graduation" />
            <Dropdown
              placeholder="Select Graduation Date"
              backgroundColor="#fff"
              value={moment(graduation_date).format('YYYY-MM-DD')}
              onPress={() => showDatepicker('graduationDate')}
            />
          </Container>

          <Container marginBottom={1}>
            <Label name="Location" />
            <Input placeholder="-" value={edu_location} onChangeText={text => setEduLocation(text)} />
          </Container>

          {/* ANCHOR - Interest */}
          <SizedBox height={3} />
          <H1 fontSize={16}>Interest</H1>
          <SizedBox height={2} />

          <Container marginBottom={1}>
            <Label name="Interests" />
            <Dropdown
              placeholder="Select Interest"
              value={interest ? interest.toString() : null}
              backgroundColor="#fff"
              onPress={() => setShowCheckList(true)}
            />
          </Container>

          {/* ANCHOR - Social */}
          <SizedBox height={3} />
          <H1 fontSize={16}>Social</H1>
          <SizedBox height={2} />

          <Container marginBottom={1}>
            <Label name="Facebook" />
            <Input placeholder="https://facebook.com/username" value={facebook_id} onChangeText={text => setFacebook(text)} />
          </Container>

          <Container marginBottom={1}>
            <Label name="Twitter" />
            <Input placeholder="https://twitter.com/username" value={twitter_id} onChangeText={text => setTwitter(text)} />
          </Container>

          <Container marginBottom={1}>
            <Label name="Linkedin" />
            <Input placeholder="https://linkedin.com/username" value={linkedin_id} onChangeText={text => setLinkedIn(text)} />
          </Container>

            <Container marginBottom={3}>
              <Label name="E-Mail" />
              {/* <Input placeholder="" value={email} /> */}
              <P>{email}</P>
            </Container>
            <Button title="Update" onPress={submit} loading={loading} />
            <SizedBox height={2} />
            <TouchFeedback onPress={()=>setDeactivate(true)}>
              <H1 textAlign="center" color="red">Delete Account</H1>
            </TouchFeedback>
          <SafeAreaView />
        </ScrollArea>
      </Container>
              <Modal visible={deactivate} transparent={true} statusBarTranslucent={true}>
                <Container  backgroundColor="#0009" flex={1} horizontalAlignment="center" verticalAlignment="center"
                  paddingHorizontal={6}
                >
                    <Container backgroundColor={Colors.whiteBase}
                      borderRadius={10}
                      padding={10}
                    >
                      <H1 textAlign="center">We hate to see you go. Are you sure you want to delete your account?</H1>
                      <Container marginTop={2}>
                        <Button title="Delete Account" onPress={()=>deactivateAccount()} loading={processing}/>
                        <SizedBox  height={2}/>
                        <TouchWrap onPress={()=>setDeactivate(false)}>
                          <P textAlign="center">Cancel</P>
                        </TouchWrap>
                      </Container>
                    </Container>
                  
                </Container>
              </Modal>
      {show && (
        <ProfileDatePicker
          setPlaceholder={setDate}
          setHolder={setDateOfBirth}
          setShow={setShow}
          value={date_of_birth}
          placeholder={date}
          isDOB={true}
        />
      )}

      {showJobStartDate && (
        <IOSDatePicker
          setPlaceholder={setDate}
          setHolder={setJobStartDate}
          setShow={setShowJobStartDate}
          value={job_start_date}
          placeholder={date}
        />
      )}

      {showGraduationDate && (
        <ProfileDatePicker
          setPlaceholder={setDate}
          setHolder={setGraduationDate}
          setShow={setShowGraduationDate}
          value={graduation_date}
          placeholder={date}
        />
      )}

      {/*showStartDate && (
        <DatePicker testID="dateTimePicker" value={date} mode={mode} is24Hour={true} display="default" onChange={onChangeStartDate} />
      )*/}

      <Modal visible={showList} transparent={true} statusBarTranslucent={true}>
        <Container backgroundColor="#0009" flex={1} horizontalAlignment="center" verticalAlignment="flex-start">
          <SizedBox height={20} />
          <Container height={50} width={95}>
            <Container paddingHorizontal={5}>
              <Input
                placeholder="Search"
                onChangeText={value => {
                  if (value.trim().length < 0) {
                    return setListMap(listHolder);
                  }
                  let items = listHolder.filter(list => list.title.toLowerCase().includes(value.toLowerCase()));
                  return setListMap(items);
                }}
              />
            </Container>

            <ListWrapGeneral
              onToggle={() => setShowList(!showList)}
              title={listTitle}
              listMap={listMap}
              onHide={() => setShowList(false)}
              selectFromList={selectFromList}
            />
          </Container>
        </Container>
      </Modal>

      <Modal visible={showCheckList} transparent={true} statusBarTranslucent={true}>
        <Container backgroundColor="#0009" flex={1} horizontalAlignment="center" verticalAlignment="center">
          <Container height={85} width={95} backgroundColor={Colors.white} padding={6} borderRadius={10}>
            <H2 fontSize={15}>Select your interest</H2>
            <Container height={0.2} backgroundColor="#0003" marginTop={1.5} marginBottom={2} />
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
              <Container direction="row" wrap="wrap" horizontalAlignment="space-between">
                {checkListMap.map((el, i) => (
                  <TouchWrap widthPercent="45%" paddingVertical={2} onPress={() => updateChoices(i)} key={i}>
                    <Container direction="row">
                      <CheckBox2 status={el.value} onPress={() => updateChoices(i)} />
                      <SizedBox width={2} />
                      <H2 fontSize={FONTSIZE.medium}>{el.name}</H2>
                    </Container>
                  </TouchWrap>
                ))}
              </Container>
            </ScrollView>

            <SizedBox height={2} />
            <TouchWrapButton title="Close" onPress={() => setShowCheckList(false)} />
          </Container>
        </Container>
      </Modal>
    </AppPageBack>
  );
};

export default ProfileEdit;