import React, { useEffect,useState } from 'react';
import {Page, Container, TouchWrap, scaleFont, SizedBox,ImageWrap, ScrollArea, Width} from '@burgeon8interactive/bi-react-library';
import {H1,TouchFeedback} from '../../../components/component';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../helpers/colors';
import {apiFunctions} from '../../../helpers/api';
import {EventTabScreens} from '../../../helpers/route';
import Agsbanner from '../../../../assets/img/agsLogo_dark.png';
import Swiper from 'react-native-swiper';
import {Retry} from '../../../components/retry';
import { useStoreState } from 'easy-peasy';
import UpcomingEvents from './upcoming_events';
import PastEvents from './past_events';
import MyEvents from './my_events';
import { ToastLong } from '../../../helpers/utils';
import moment from 'moment';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {Linking} from 'react-native';
import { FONTSIZE } from '../../../helpers/constants';

const Events = ({navigation}) => {
  const [adverts,setAdverts] = useState([]);
    const [isLoading,setLoading] = useState(false);
    const [current,setCurrent] = useState("Upcoming");
    const {retry,funcCall} = useStoreState(state=>({
      retry : state.retryModel.retry,
      funcCall : state.retryModel.funcCall
    }))
  
    const getMyEvents = async () =>{
      try{
          setLoading(true);
          let adverts = await apiFunctions.getAdvert(token);
          let filter = adverts.filter(ad=>!moment(new Date()).isAfter(moment(ad.end_date)))
          setAdverts(filter);
          setLoading(false);
      }catch(error){
      }
    }
    
    
    //navigation,retry
    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            getMyEvents();
          });
    },[])
  return (
    <Page backgroundColor={Colors.white} barColor={Colors.black}>
      <Container paddingHorizontal={4} paddingTop={4} backgroundColor={Colors.white}>
      <TouchFeedback paddingRight={2} paddingBottom={2} paddingTop={2} onPress={() => navigation.openDrawer()}>
          <Feather Icon name="menu" size={scaleFont(FONTSIZE.menu)} color={Colors.black} />
        </TouchFeedback>
        
          {
            adverts.length > 0 ? (
              <Container
                height={20}
              >
                <Swiper autoplay={true} activeDotColor={Colors.primary}>
                  {
                    adverts.map((item,index)=>{
                      return(
                        <TouchFeedback 
                          key={index}
                          onPress={()=>{
                            if(!Linking.canOpenURL(item.link)) return;
                            Linking.openURL(item.link)
                          }}  
                        >
                          <Container>
                            <ImageWrap
                                borderTopLeftRadius={10}
                                borderBottomLeftRadius={10}
                                url={item.image}
                                borderRadius={10} backgroundColor="#efefef"
                                height={20}
                                widthPercent="100%"
                                fit="cover" 
                            />
                          </Container>
                        </TouchFeedback>
                        
                      )
                    })
                  }
                </Swiper>
              </Container>
            ) : (
              <ImageWrap
                  borderTopLeftRadius={10}
                  borderBottomLeftRadius={10}
                  source={Agsbanner}
                  borderRadius={10} backgroundColor="#efefef"
                  height={20}
                  fit="contain" 
              />
            )
          }
      </Container>

      {/* ANCHOR - HEADER 2 */}
      <Container flex={1} marginTop={2} backgroundColor={Colors.white} flex={1} borderTopLeftRadius={50} borderTopRightRadius={50}>
        {/* <EventTabScreens /> */}
        <Container paddingBottom={2} direction="row" backgroundColor={Colors.white} 
          paddingHorizontal={2} 
          paddingRight={6}
          horizontalAlignment="center" marginTop={1} marginBottom={1}
        >
          {["Upcoming","Past Events","My Events"].map((el, i) => (
            <TouchFeedback
              width={30}
              key={i}
              onPress={() => {
                setCurrent(el)
              }}>
              <Container
                borderRadius={5}
                backgroundColor={el === current ? Colors.primary : Colors.white}
                horizontalAlignment="center"
                paddingVertical={1.5}
              >
                <H1 fontSize={9} 
                  color={el === current ? '#fff' : Colors.text}
                  textAlign="center"
                >
                  {el}
                </H1>
              </Container>
            </TouchFeedback>
          ))}
        </Container>
        {
          current === "Upcoming" ? (
            <UpcomingEvents page={current}/>
          ) : current === "Past Events" ? (
            <PastEvents page={current}/>
          ) : (
            <MyEvents page={current}/>
          )
        }

        {
          retry ? (
            <Retry funcCall={funcCall} param={[]}/>
          ) : null
        }
      </Container>
    </Page>
  );
};

export default Events;
