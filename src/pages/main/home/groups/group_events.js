import React, { useEffect,useState } from 'react';
import {Page, Container, TouchWrap, scaleFont, SizedBox, ScrollArea, InputWrap} from '@burgeon8interactive/bi-react-library';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../../helpers/colors';
import {apiFunctions} from '../../../../helpers/api';
import {GroupEventTabScreens} from '../../../../helpers/route';
import {Retry} from '../../../../components/retry';
import { useStoreState,useStoreActions } from 'easy-peasy';
import {ActivityIndicator} from 'react-native';
import moment from 'moment';
import {H1,TouchFeedback} from '../../../../components/component';
import EventCard from '../../../../components/event_card';
import { FlatList } from 'react-native-gesture-handler';
import { ToastLong } from '../../../../helpers/utils';
import axios from 'axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FONTSIZE } from '../../../../helpers/constants';

export const MainGroupEvents = ({navigation,route}) => {
    const {token,retry,funcCall} = useStoreState(state => ({
        token: state.userDetails.token,
        retry : state.retryModel.retry,
        funcCall : state.retryModel.funcCall
    }));
    const {updateFunc,updateRetry} = useStoreActions(action=>({
        updateFunc : action.retryModel.updateFunc,
        updateRetry : action.retryModel.updateRetry
    }));
    let group = route.params.data;
    let admin  = route.params.is_admin;
    const getGroupEvents = async () =>{
        try{
            setLoading(true);
            updateRetry(false);
            updateFunc(getGroupEvents);
            let data = await apiFunctions.getGroupEvent(token,group.id);
            let events = data.map(item=>item.event);
            setEvents(events);
            setEventsHolder(events);
            setLoading(false);
        }catch(error){
            updateFunc(getGroupEvents);
            updateRetry(true);
            setLoading(false);
        }
    }

    const searchEngine = (value) => {
        let result = eventsHolder.filter((event)=>{
            return event.title.toLowerCase().includes(value.toLowerCase()) || 
            moment(event.start_datetime).format('MMM').toLowerCase().includes(value.toLowerCase())
            || event.location.toLowerCase().includes(value.toLowerCase()) || 
            event.city.toLowerCase().includes(value.toLowerCase())
        });
        value.length === 0 ? setEvents(eventsHolder) : setEvents(result);
    }
    
    const [events,setEvents] = useState([]);
    const [eventsHolder,setEventsHolder] = useState([]);
    const [isLoading,setLoading] = useState(false);
    const {group_id} = route.params;
    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            updateRetry(false);
            getGroupEvents();
          });
          return unsubscribe;
    },[
        navigation,retry
    ])
  return (
    <Page backgroundColor={Colors.primary} barColor={Colors.black}>
      <Container paddingHorizontal={4} paddingTop={4} backgroundColor={Colors.primary} marginTop={2} 
        direction="row" verticalAlignment="center">
            <TouchFeedback paddingRight={2} paddingBottom={2} paddingTop={2} onPress={() => navigation.goBack()}>
                <Feather name="chevron-left" size={scaleFont(FONTSIZE.menu)} color={Colors.white} />
            </TouchFeedback>
            <H1 fontSize={FONTSIZE.page} color={Colors.white}>{group.name}</H1>
            <Container widthPercent="30%"></Container>
            {
                admin ? (
                <TouchFeedback
                    onPress={()=>navigation.navigate("AddGroupEvent",{group_id})}
                >
                    <Container direction="row">
                        <FontAwesome name="calendar" size={scaleFont(FONTSIZE.icon)} color={Colors.white} />
                        <Feather name="plus" size={scaleFont(FONTSIZE.icon)} color={Colors.white} />
                    </Container>
                </TouchFeedback>
                ) : null
            }
      </Container>
        <SizedBox height={3} />
      {/* ANCHOR - HEADER 2 */}
      <Container flex={1} marginTop={2} backgroundColor={Colors.white} flex={1} borderTopLeftRadius={50} borderTopRightRadius={50}>
        <ScrollArea>
            <Container
                padding={5}
            >
                {
                    isLoading && (
                        <ActivityIndicator size={20} color={Colors.button}/>
                    )
                }
                <Container horizontalAlignment="center" padding={2}>
                    <Container widthPercent="80%">
                        <InputWrap 
                            placeholder="Search" backgroundColor="#fff" flex={1} 
                            elevation={10} 
                            paddingTop={2} paddingLeft={5} borderRadius={50}
                            onChangeText={(value)=>searchEngine(value)}
                            height={7.3}
                        />
                    </Container>
                </Container>
                <SizedBox height={0.8}/>
                {
                    events.length > 0 ? (
                        <Container>
                            <FlatList 
                                data={events} 
                                extraData={events} 
                                keyExtractor={events => events.id} 
                                renderItem={({item, index}) => <EventCard navigation={navigation} 
                                data={item} navigateTo="EventDetails" tabName="upcomingEvents" is_admin={admin} />} 
                                showsVerticalScrollIndicator={false}
                            />
                        </Container>
                    ) : null  
                }  
                {
                    !isLoading && events.length === 0 && eventsHolder.length === 0 && !retry ? (
                    <Container horizontalAlignment="center" verticalAlignment="center">
                        <H1>No events found</H1>
                    </Container>
                    ) : null
                }
            </Container>
        </ScrollArea>
        {
          retry ? (
            <Retry funcCall={funcCall} param={[]}/>
          ) : null
        }
      </Container>
    </Page>
  );
};
