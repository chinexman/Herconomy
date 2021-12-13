import React, {useState, useEffect} from 'react';
import {Container, Page, TouchWrap, scaleFont, SizedBox, InputWrap,
    ImageWrap,Avatar, Rounded, ScrollArea} from '@burgeon8interactive/bi-react-library';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../helpers/colors';
import {SettingsTabScreen} from '../../helpers/route';
import {Input, Button,TouchFeedback} from '../../components/component';
import { ToastLong } from '../../helpers/utils';
import { apiFunctions } from '../../helpers/api';
import { Alert } from 'react-native';
import { useStoreState } from 'easy-peasy';



const ResetPwd = props => {
    const {_user,token} = useStoreState(state=>({
        token : state.userDetails.token,
        _user : state.userDetails.user
    }))
    const [loading,setLoading] = useState(false);
    const [password,setPassword] = useState('');
    const [con_password,setConPassword] = useState('');

    const submit = async () =>{
        try{
            if(password === '' || con_password === '' || password !== con_password){
                return Alert.alert("Herconomy",'Please make sure password match');
            }  
            if(password.length < 6){
                return Alert.alert("Herconomy",'Password must not be less than 6 characters')
            }
            setLoading(true);
            let fd = {
                password1 : password,
                password2:con_password
            }
            await apiFunctions.pwdChange(token,fd);
           Alert.alert("Herconomy","Password has been changed");
           setLoading(false);
        }catch(error){
            setLoading(false);
            ToastLong("Network Error! Please try again");
        }
    }
    
  return (
    <>
    
    <Page barIconColor="light" backgroundColor={Colors.primary}>
        <Container paddingHorizontal={6} paddingTop={6} direction="row" horizontalAlignment="space-between">
            <TouchFeedback paddingRight={2} paddingBottom={2} paddingTop={2} onPress={() => props.navigation.goBack()}>
            <Feather Icon name="chevron-left" size={scaleFont(20)} color="#fff" />
            </TouchFeedback>
        </Container>
        <SizedBox height={3} />
        <Container backgroundColor={Colors.white} flex={1} paddingHorizontal={6} borderTopLeftRadius={50} borderTopRightRadius={50}>
        <SizedBox height={10} />
            <Container flex={1} paddingHorizontal={6}
                verticalAlignment={"center"}
            >
                <SizedBox height={3}/>
                <ScrollArea flexGrow={1}>
                    <Container>
                        <Input type={password} 
                            secure={true} 
                            placeholder="Password"
                            value={password} onChangeText={(text)=>setPassword(text)}
                            type="default" 
                        />
                        <Input type={password} 
                            secure={true} 
                            placeholder="Confirm Password"
                            value={con_password} onChangeText={(text)=>setConPassword(text)} 
                            type="default"
                        />
                        <SizedBox height={3}/>
                        <Button title="Submit" loading={loading} onPress={submit}/>
                    </Container>
                </ScrollArea>
            </Container>
        </Container>
    </Page>
    </>
  );
};

export default ResetPwd;
