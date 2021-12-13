import React, { useEffect,useState } from 'react';
import {Page, Container, SizedBox, 
     ScrollArea,
     InputWrap,
     scaleFont
} from '@burgeon8interactive/bi-react-library';
import {H1, ImageCardHolder} from '../../../components/component';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../helpers/colors';
import FilterIcon from '../../../../assets/img/icons/filter_icon.png';
import EventCard from '../../../components/event_card';
import { FlatList } from 'react-native-gesture-handler';
import {apiFunctions} from '../../../helpers/api';
import { ActivityIndicator } from 'react-native';
import {ToastLong,ToastShort} from '../../../helpers/utils';
import { useStoreState,useStoreActions } from 'easy-peasy';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';



const UpcomingEvents = ({page}) => {
    const navigation = useNavigation();
    const {token,retry} = useStoreState(state => ({
        token: state.userDetails.token,
        retry : state.retryModel.retry
    }));
    const {updateFunc,updateRetry} = useStoreActions(action=>(
      {
        updateFunc : action.retryModel.updateFunc,
        updateRetry : action.retryModel.updateRetry
      }
    ))
    const getEvents = async () =>{
        try{
            setLoading(true);
            updateRetry(false);
            updateFunc(getEvents);
            let events = await apiFunctions.getEvents(token);
            let upcomingEvents = events.filter((event)=>{
                return (event.status.toLowerCase() === 'open' && 
                new Date(event.start_datetime).getTime() > new Date().getTime()) && event.status.toLowerCase() !== 'close' &&
                !event.past 
            });
            console.log("upcomingEvents",upcomingEvents)
            let myEvents = await apiFunctions.getMyEvents(token);
            setUpcomingEvents(upcomingEvents);
            setEventsHolder(upcomingEvents);
            setMyEvents(myEvents);
            setLoading(false);
        }catch(error){
            updateFunc(getEvents);
            updateRetry(true);
            setLoading(false);
        }
    }

    const searchEngine = (value) => {
        let result = eventsHolder.filter((event)=>{
            return event.title && event.title.toLowerCase().includes(value.toLowerCase()) || 
            moment(event.start_datetime || new Date()).format('MMM').toLowerCase().includes(value.toLowerCase())
            || event.location && event.location.toLowerCase().includes(value.toLowerCase()) || 
            event.city && event.city.toLowerCase().includes(value.toLowerCase())
        });
        value.length === 0 ? setUpcomingEvents(eventsHolder) : setUpcomingEvents(result);
    }
    
    const [upcomingEvents,setUpcomingEvents] = useState([]);
    const [eventsHolder,setEventsHolder] = useState([]);
    const [myEvents,setMyEvents] = useState([]);
    const [isLoading,setLoading] = useState(false);
    useEffect(()=>{
        getEvents();
    },[
        
    ])
    return(
        <Container flex={1}>
            <ScrollArea>
                <Container
                    padding={5}
                >
                  <>
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
                                  isLoading && upcomingEvents.length === 0 && eventsHolder.length === 0 ? (
                                    <ImageCardHolder />
                                  ) : null
                              }
                              <FlatList 
                                data={upcomingEvents} 
                                extraData={upcomingEvents} 
                                keyExtractor={upcomingEvent => `${upcomingEvent.id}-${Math.random(1000)}`} 
                                renderItem={({item, index}) => <EventCard navigation={navigation} 
                                data={item} navigateTo="EventDetails" tabName="upcomingEvents" myEvents={myEvents} 
                                    index={index} 
                                    key={index}
                                />} 
                                showsVerticalScrollIndicator={false}
                                refreshing={isLoading}
                            />
                              {
                                !isLoading && upcomingEvents.length === 0 && eventsHolder.length > 0 ? (
                                    <Container horizontalAlignment="center" verticalAlignment="center">
                                        <H1>No upcoming events found</H1>
                                    </Container>
                                ) : null
                              }
                              
                        </>
                  {
                      !isLoading && upcomingEvents.length === 0 && eventsHolder.length === 0 && !retry ? (
                        <Container horizontalAlignment="center" verticalAlignment="center">
                            <H1>No upcoming events found</H1>
                        </Container>
                      ) : null
                  }
                </Container>
            </ScrollArea>
        </Container>
    );
}

export default UpcomingEvents;