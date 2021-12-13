import { Page,Container,TouchWrap, scaleFont,ScrollArea,SizedBox } from '@burgeon8interactive/bi-react-library';
import { useStoreState } from 'easy-peasy';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Switch } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import { P,H1,TouchFeedback } from '../../components/component';
import { apiFunctions } from '../../helpers/api';
import Colors from '../../helpers/colors';
import { getData, storeData } from '../../helpers/functions';
import { Capitalize } from '../../helpers/utils';

export const SetNotification = props => {
    const {token} = useStoreState(state=>({
        token : state.userDetails.token
    }))
    const setPrefrence = async () =>{
        try{
            const preference = await getData('settings');
            preference ? setSettings([...preference]) : setSettings([
                {name : "post",value : true},
                {name : "comment",value : true},
                {name : "reply",value : true},
                {name : "group",value : true},
                {name : "topic",value : true},
                {name : "chatmessage",value : true},
                {name : "opportunity",value : true},
                {name : "scholarship",value : true},
                {name : "partner",value : true}
            ]);
            let res = await apiFunctions.getPreference(token);
            let data = [];
            for(let item in res){
                if(['id','created_at','updated_at','user'].includes(item)) continue;
                data.push({
                    name : item,
                    value : res[item]
                });
            }
            setSettings([...data])
            storeData('settings',data);
        }catch(error){
        }
    }
    useEffect(()=>{
        props.navigation.addListener('focus',()=>{
            setPrefrence();
        })
    },[props.navigation])
    const [settings,setSettings]  = useState([]);
   return(
        <Page barIconColor="light" backgroundColor={Colors.primary}>
            <Container paddingHorizontal={6} paddingTop={6} 
                verticalAlignment="center"
                direction="row"
            >
                <TouchFeedback paddingRight={2} paddingBottom={2} paddingTop={2} onPress={() => props.navigation.navigate("Settings")}>
                    <Feather Icon name="chevron-left" size={scaleFont(20)} color="#fff" />
                </TouchFeedback>
                <H1 color="#fff">Settings</H1>
            </Container>
            <SizedBox height={3} />
            <Container backgroundColor={Colors.white} flex={1} paddingHorizontal={6} borderTopLeftRadius={50} borderTopRightRadius={50}>
                <SizedBox height={3}/>
                <ScrollArea flexGrow={1}>
                    {
                        settings.map((setting,index)=>(
                            <Container marginBottom={2} key={index}>
                                <Container 
                                    direction="row" 
                                    horizontalAlignment="space-between"
                                    widthPercent="100%"
                                    borderWidth={1}
                                    borderRadius={10}
                                    borderColor={Colors.line}
                                    paddingVertical={2}
                                    paddingHorizontal={3}
                                >
                                    <P>{Capitalize(
                                            setting.name === "chatmessage" ? "Direct Message" : 
                                            setting.name === "topic" ? "Topics" : 
                                            setting.name === "scholarship" ? "scholarships" : 
                                            setting.name === "like" ? "likes" : 
                                            setting.name === "comment" ? "comments" : 
                                            setting.name === "partner" ? "partner added" : setting.name
                                    )}</P>
                                    <Switch 
                                        trackColor={{false: Colors.offWhite, true: Colors.offWhite}}
                                        thumbColor={Colors.primary}
                                        value={setting.value}
                                        thumbColor={setting.value ? Colors.primary : Colors.offWhite}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={ async (value)=>{
                                            try{
                                                let arr = [...settings];
                                                arr[index] = {name : setting.name, value}
                                                setSettings(arr);
                                                let res = await apiFunctions.updatePreference(token,{[setting.name] : value})
                                                storeData('settings',arr);
                                            }catch(error){
                                                let arr = [...settings];
                                                arr[index] = {name : setting.name, value : !value}
                                                setSettings(arr);
                                                storeData('settings',arr);
                                            }
                                        }}
                                    />
                                </Container>
                            </Container>
                        ))
                    }
                </ScrollArea>
            </Container>
        </Page>
   )
}