import React, { useEffect,useState } from 'react';
import {Container, Page, TouchWrap, scaleFont, SizedBox, InputWrap,
    ImageWrap,Avatar, Rounded, ScrollArea} from '@burgeon8interactive/bi-react-library';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../helpers/colors';
import {H1,P, Button,TouchFeedback} from '../../components/component';
import ZendeskChat from "react-native-zendesk-chat";
import { useStoreState } from 'easy-peasy';
import { State } from 'react-native-gesture-handler';
import refer_earn2 from '../../../assets/img/refer_earn2.png';
import { FONTSIZE } from '../../helpers/constants';

const ContactUs = (props) => {
    
    const {user} = useStoreState(state=>({
        user : state.userDetails.user
    }))

    const connect = () => {
        ZendeskChat.startChat({
            name: user.full_name,
            email: user.email,
            phone: user.mobile_phone,
            tags: ["tag1", "tag2"],
            department: "Your department",
            // The behaviorFlags are optional, and each default to 'true' if omitted
            behaviorFlags: {
                showAgentAvailability: true,
                showChatTranscriptPrompt: true,
                showPreChatForm: true,
                showOfflineForm: true,
            },
            // The preChatFormOptions are optional & each defaults to "optional" if omitted
            preChatFormOptions: {
                name: !user.full_name ? "required" : "optional",
                email: "optional",
                phone: "optional",
                department: "required",
            },
            localizedDismissButtonTitle: "Dismiss",
        });
    }

    useEffect(()=>{
        ZendeskChat.init("IDqSkPEeQs0m1610bUZ0gjMMyapLiXLd");
         const unsubscribe = props.navigation.addListener('focus', () => {
            connect();
        });
        return unsubscribe
         
    },[props.navigation]);
    return(
        <>
            <Page barIconColor="light" backgroundColor={Colors.primary}>
                <Container paddingHorizontal={6} paddingTop={6} direction="row">
                    <TouchFeedback paddingRight={2} paddingBottom={2} paddingTop={2} onPress={() => props.navigation.openDrawer()}>
                        <Feather Icon name="menu" size={scaleFont(FONTSIZE.menu)} color={Colors.button} />
                    </TouchFeedback>
                    <SizedBox width={2} />
                    <Container marginTop={0.7}>
                        <H1 fontSize={20}>
                            Support
                        </H1>
                    </Container>
                </Container>
                <SizedBox height={3} />
                <ScrollArea>
                    <Container flexGrow={1} verticalAlignment="center" paddingHorizontal={5} 
                        paddingTop={3}
                    >
                        <H1 fontSize={20} textAlign="center">Chat with Support!</H1>
                        <P textAlign="center">Always within your reach</P>
                        <SizedBox height={4}/>
                        <ImageWrap 
                            source={refer_earn2}
                            height={40}
                        />
                        <SizedBox height={4} />
                        <Button title="Chat" onPress={()=>connect()}/>
                    </Container>
                </ScrollArea>
            </Page>
        </>
    )
}

export default ContactUs;