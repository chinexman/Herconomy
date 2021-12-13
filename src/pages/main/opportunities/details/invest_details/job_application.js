import React,{useEffect,useState} from 'react';
import {
  Page,
  Container,
  TouchWrap,
  SizedBox,
  scaleFont,
  Rounded,
  ImageWrap,
  Avatar,
  ScrollArea,
  InputWrap,
  TextWrap
} from '@burgeon8interactive/bi-react-library';
import {H1,H2,P,Button,Input,Label,TouchFeedback} from '../../../../../components/component';
import Colors from '../../../../../helpers/colors';
import Feather from 'react-native-vector-icons/Feather';
import LocationIcon from '../../../../../../assets/img/icons/location.png';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import {ToastLong,ToastShort} from '../../../../../helpers/utils';
import {apiFunctions} from '../../../../../helpers/api';
import {useStoreState} from 'easy-peasy';
import {Platform,Alert} from 'react-native';
import { FONTSIZE } from '../../../../../helpers/constants';



const JoinApplication = ({navigation,route}) => {

    const {token} = useStoreState(state => ({
        token: state.userDetails.token,
    }));

    const manageFilePicker = async (fieldName) =>{
        try {
            const res = await DocumentPicker.pick({
              type: [DocumentPicker.types.pdf],
            });
            if(res.size > 10000000){
                ToastLong(`${fieldName} can not be more than 10MB`);
                fieldName === "resume" ? setResume({}) : setLetter({});
                fieldName === "resume" ? setResumePlaceHolder("Resume/CV") : setCoverPlaceholder("Cover Letter");
                return false;
            }
            let file = {
                uri : res.uri,
                type : res.type, // mime type
                name : res.name,
                //size : res.size
            }
            fieldName === "resume" ? setResume(file) : setLetter(file);
            fieldName === "resume" ? setResumePlaceHolder(file.name) : setCoverPlaceholder(file.name);
          } catch (err) {
            if (DocumentPicker.isCancel(err)) {
              // User cancelled the picker, exit any dialogs or menus and move on
            } else {
              throw err;
            }
          }
    }

    const processFundApplication = async (requiredFields) => {
        try{
            if(isLoading){
                return false;
            }
            if(!user.is_email_verified){
                return Alert.alert('Herconomy','Glad you have come this far, you will need to verify your email to continue')
            }
            setLoading(true);
            let check = await requiredFields.filter((field)=> field.length === 0);
            if(check.length > 0){
                setLoading(false);
                return Alert.alert('Herconomy','Fields marked with "*" are required and must be formatted correctly.');
            }
            let opportunityId = route.params.opportunity.id;
            let tabname  = route.params.tabname;
            let fd = new FormData();
           
            fd.append('job',opportunityId);
            fd.append('email',emailAddress);
            fd.append('cover_letter',cover_letter);
            fd.append('resume_cv',resume);
            fd.append('phone',phoneNumber);
            let res = await apiFunctions.processOppApplication(token,opportunityId, fd,tabname);
            setLoading(false);
            navigation.navigate('Oppo');
            ToastShort("Application successful");
        }catch(error){
            setLoading(false);
            return ToastShort("Network error. Please retry");
        }
    }
    const [emailAddress,setEmailAddress] = useState("");
    const [phoneNumber,setPhoneNumber] = useState("");
    const [resumePlaceholder,setResumePlaceHolder] = useState('Resume/CV');
    const [certPlaceholder,setCoverPlaceholder] = useState('Cover Letter');
    const [resume,setResume] = useState({});
    const [cover_letter,setLetter] = useState({});
    const [isLoading,setLoading] = useState(false);

  return (
    <Page barIconColor="light" backgroundColor={Colors.primary}>
        <ScrollArea>
        <Container paddingHorizontal={6} paddingTop={6} direction="row" verticalAlignment="center">
        <TouchFeedback paddingRight={5} paddingTop={1.5} paddingBottom={1.5} onPress={() => navigation.goBack()}>
          <Feather Icon name="chevron-left" size={scaleFont(25)} color="#fff" />
        </TouchFeedback>
      </Container>
      <SizedBox height={8} />
      <Container backgroundColor={Colors.white} flex={1} borderTopLeftRadius={50} borderTopRightRadius={50}>
      


      <Container horizontalAlignment="center" flex={1}>
          <SizedBox height={5} />

            <Container flex={1} widthPercent="100%" paddingHorizontal={6}>
                <Container 
                    verticalAlignment="center"
                    borderBottomWidth={1}
                    borderColor={Colors.lightGrey}
                >
                    <H1 fontSize={20}>
                        Apply
                    </H1>
                    <SizedBox height={1.5}/>
                </Container>
                <SizedBox height={3}/>
                <Container>
                    <Label name="Email Address *" />
                    <Input placeholder="Email Address" 
                        placeholderTextColor={Colors.lightGrey} 
                        type="default"
                        type="email-address"
                        onChangeText={(value)=>setEmailAddress(value)}
                    />
                </Container>
                <SizedBox height={3}/>
                <Container>
                    <Label name="Phone Number *" />
                    <Input placeholder="Phone Number" 
                        placeholderTextColor={Colors.lightGrey} type="numeric"
                        onChangeText={(value)=>setPhoneNumber(value)}
                    />
                </Container>
                <SizedBox height={3}/>
                <Container>
                        <Container direction="row" horizontalAlignment="space-between">
                            <Label name="Resume/CV *" />
                            <P color={Colors.primary} fontSize={5}>Max file size 10MB</P>
                        </Container>
                        <SizedBox height={1}/>
                        <TouchFeedback
                            onPress={()=>manageFilePicker("resume")}
                        >
                        <Container backgroundColor={Colors.whiteBase} 
                            paddingHorizontal={3} paddingVertical={2.1}
                            borderRadius={7}
                        >
                            <TextWrap fontSize={FONTSIZE.medium} color={Object.values(resume).length > 0 ? Colors.black : Colors.lightGrey}>
                                {resumePlaceholder.length === 0 ? "Resume/CV" : resumePlaceholder}
                            </TextWrap>
                        </Container>
                    </TouchFeedback>
                    </Container>
                <SizedBox height={3}/>
                <TouchFeedback>
                    <Container>
                        <Container direction="row" horizontalAlignment="space-between">
                            <Label name="Cover Letter *" />
                            <P color={Colors.primary} fontSize={5}>Max file size 10MB</P>
                        </Container>
                        <SizedBox height={1}/>
                        <TouchFeedback
                            onPress={()=>manageFilePicker("cover_letter")}
                        >
                        <Container backgroundColor={Colors.whiteBase} 
                            paddingHorizontal={3} paddingVertical={2.1}
                            borderRadius={7}
                        >
                            <TextWrap fontSize={FONTSIZE.medium} color={Object.values(cover_letter).length > 0 ? Colors.black : Colors.lightGrey}>
                                {certPlaceholder.length === 0 ? "cover letter" : certPlaceholder}
                            </TextWrap>
                        </Container>
                    </TouchFeedback>
                    </Container>
                </TouchFeedback>

                <SizedBox height={2}/>
                <Container padding={4} horizontalAlignment="center">
                    <Container widthPercent="50%">
                        <Button title="APPLY" borderRadius={4} backgroundColor={Colors.primary} 
                            borderColor={Colors.primary} 
                            onPress={()=>processFundApplication([emailAddress,resume,cover_letter,phoneNumber])}
                            loading={isLoading}
                        />
                    </Container>
                </Container>
                <SizedBox height={3}/>
          </Container>
        </Container>

      </Container>
        </ScrollArea>
    </Page>
  );
};

export default JoinApplication;
