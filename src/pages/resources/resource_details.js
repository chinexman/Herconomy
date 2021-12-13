import React,{useState, useEffect} from 'react';
import {Container, SizedBox,InputWrap,scaleFont,TouchWrap,Page,ImageWrap, ScrollAreaRefresh} from '@burgeon8interactive/bi-react-library';
import Colors from '../../helpers/colors';
import {H2,P,Button,TouchFeedback} from '../../components/component';
import {ResourcesTabScreen} from '../../helpers/route';
import Feather from 'react-native-vector-icons/Feather';
import { FlatList } from 'react-native';
import walk2 from '../../../assets/img/walk2.png';
import moment from 'moment';
// import Video from 'react-native-video';
import {StyleSheet,ActivityIndicator,Modal,Linking} from 'react-native';
import { apiFunctions } from '../../helpers/api';
import {useStoreState,useStoreActions} from 'easy-peasy';
import { Capitalize } from '../../helpers/utils';
import YouTube from 'react-native-youtube';
import {gold_plan_id,silver_plan_id} from '../../helpers/constants';
import { Retry } from '../../components/retry';

const PDFBOX = ({data,dataSize,index,status,navigation,setUpgrade}) => {
    return(
      <Container padding={1.5}>
        <TouchFeedback
           onPress={()=>{
            if(!status){
              return setUpgrade(true);
            }
            console.log("data>>>",data.file)
            if(data.file !== null && Linking.canOpenURL(data.file)){
              return Linking.openURL(data.file);
            }
           }}
        >
          <Container backgroundColor={Colors.whiteBase} elevation={5} widthPercent="100%" direction="row" borderRadius={10}>
            <Container widthPercent="40%">
              <ImageWrap
                borderTopLeftRadius={10}
                borderBottomLeftRadius={10}
                flex={1}
                backgroundColor="white"
                url={ data.cover_image}
              />
            </Container>
            <Container paddingVertical={1} paddingLeft={4} paddingTop={5} paddingBottom={5}
              widthPercent="60%"
            >
                <Container marginRight={3}>
                    <H2 fontSize={10} flexWrap="wrap">{data.title}</H2>
                </Container>
                <SizedBox height={2} />
                {data.speaker && <P numberOfLines={1} fontSize={10}>Speaker: {Capitalize(data.speaker)}</P>}
                {data.category && (<P numberOfLines={1} fontSize={10}>Category: {Capitalize(data.category)}</P>)}
                <SizedBox height={3}/>
                <Container direction="row"> 
                  <P fontSize={6}>{moment(new Date(data.created_at)).format('DD MMM YYYY')}</P>
                  {
                    !status && (
                      <>
                        <SizedBox width={3}/>
                        <Feather name="lock" size={scaleFont(4)} />
                      </>
                    )
                }
                </Container>
            </Container>
          </Container>
        </TouchFeedback>
        <SizedBox height={index < dataSize - 1 ? 3 : 6} />
      </Container>
    )
}

const VideoBox = ({data,status,navigation,setUpgrade}) => {
  
  
  return(
    <Container marginBottom={5}>
        <TouchFeedback
          onPress={()=>{
            if(!status){
              return setUpgrade(true);
            }
            navigation.navigate("ShowResource",{data,type:"video"})
          }}
        >
        <Container widthPercent="100%">
            <ImageWrap
                borderRadius={10}
                borderBottomLeftRadius={0}
                borderBottomRightRadius={0}
                backgroundColor="white"
                url={ data.cover_image}
                fit="cover"
                height={20}
            />
          </Container>
            <Container paddingLeft={5} paddingBottom={2} paddingTop={2} borderBottomLeftRadius={10} 
              borderBottomRightRadius={10} 
              borderLeftWidth={2} borderRightWidth={2} borderBottomWidth={2}
              borderColor={Colors.line}
            >
              <Container marginRight={3}>
                  <H2 fontSize={10} flexWrap="wrap">{data.title}</H2>
              </Container>
              <SizedBox height={2} />
              {data.speaker && <P numberOfLines={1} fontSize={10}>Speaker: {Capitalize(data.speaker)}</P>}
              <SizedBox height={3}/>
              <Container direction="row">
                <Container widthPercent="30%">
                  <P fontSize={6}>{moment(new Date(data.created_at)).format('DD MMM YYYY')}</P>
                </Container>
                <Container widthPercent="50%" paddingRight={5}>
                  {data.category ? (<P numberOfLines={1} fontSize={6} textAlign="right">Category: {Capitalize(data.category)}</P>) : null}
                </Container>
                {
                  !status && (
                    <Container widthPercent="20%" paddingRight={5}>
                      <Feather name="lock" size={scaleFont(4)} />
                    </Container>
                  )
                }
              </Container>
            </Container>
        </TouchFeedback>
    </Container>
  )
}

const DateHeader = ({date_grp}) => (  
  <Container direction="row" marginBottom={2}>
    <Container
        widthPercent="30%"
        borderColor={Colors.line}
        borderBottomWidth={2}
        marginRight={2}
        marginBottom={1}
    ></Container>
    <Container
        widthPercent="40%"
        horizontalAlignment="center"
    >
    <P>{date_grp}</P>
    </Container>
    <Container
        widthPercent="30%"
        borderColor={Colors.line}
        borderBottomWidth={2}
        marginLeft={2}
        marginBottom={1}
    ></Container>
  </Container>
)

const Resources = ({navigation,route}) => {
  const {token,_subscriptionStatus,seen_notifications,retry,funcCall} = useStoreState(state=>({
    token : state.userDetails.token,
    _subscriptionStatus : state.userDetails.subscriptionStatus,
    seen_notifications : state.notification.seen_notifications,
    retry : state.retryModel.retry,
    funcCall : state.retryModel.funcCall
  }));

  const groupData = (data) => {
    // this gives an object with dates as keys
    const groups = data.reduce((groups, resource) => {
      const date = resource.created_at.split('T')[0];
      const date_text = moment(date).format('MMMM YYYY');
      if (!groups[date_text]) {
        groups[date_text] = [];
      }
      groups[date_text].push(resource);
      return groups;
    }, {});

    // Edit: to add it in the array format instead
    const groupArrays = Object.keys(groups).map((date) => {
      return {
        date,
        resources : groups[date]
      };
    });
    return groupArrays;
  }

  const getResources = async () => {
    try{
      setLoading(true);
      updateRetry(false);
      updateFunc(getResources);
      let res = await apiFunctions.getResources(token);
      console.log("res",res,route.params.item.type)
      let filtered = res.filter(data=>data.resource_type === route.params.item.type);
      let grouped = groupData(filtered);
      setData(grouped);
      setLoading(false);
    }catch(error){
      updateFunc(getResources);
      updateRetry(true);
      setLoading(false);
    }
  }
  
  const [data,setData] = useState([]);
  const [isLoading,setLoading] = useState(false);
  const [showUpgrade,setUpgrade] = useState(false);

  const {notification_id} = route.params;
  const {updateSeen,updateFunc,updateRetry} = useStoreActions(actions => ({
    updateSeen : actions.notification.updateSeen,
    updateFunc : actions.retryModel.updateFunc,
    updateRetry : actions.retryModel.updateRetry,
  }));

  useEffect(()=>{
    if(notification_id){
      apiFunctions.markAsSeen(token,notification_id);
    }
    if(notification_id && seen_notifications && !seen_notifications.includes(notification_id)){
      global.tot_notifications = global.tot_notifications - 1;
      updateSeen([...seen_notifications,notification_id])
    }
    getResources()
  },[])
  
  return (
    <Page barIconColor="light" backgroundColor={Colors.primary}>
      <Container paddingHorizontal={6} paddingTop={6} direction="row" verticalAlignment="center">
        <TouchFeedback paddingRight={5} paddingTop={1.5} paddingBottom={1.5} onPress={() => navigation.goBack()}>
            <Feather Icon name="chevron-left" size={scaleFont(25)} color="#fff" /> 
        </TouchFeedback>
        <H2 fontSize={13} color={Colors.whiteBase}>
            {route.params.item.title}
        </H2>
      </Container>
      <SizedBox height={1} />
        <Container flex={1} paddingHorizontal={6} backgroundColor={Colors.white}
          
          marginTop={2}
        >
            <SizedBox height={4} />
              <Container flex={1}>
                    {
                      isLoading && (
                        <ActivityIndicator size="large" color={Colors.primary}  />
                      )
                    }
                    {
                      data.length > 0 && !showUpgrade && (
                        <ScrollAreaRefresh
                          refreshing={isLoading}
                          onRefresh={getResources}
                        >
                            {
                              data.map((itm,i)=>(
                                    <Container key={i}>
                                      <DateHeader date_grp={itm.date} />
                                      {itm.resources.map((item,index)=>(
                                        <React.Fragment key={index}>
                                          {
                                            route.params.item.type === 'pdf' ? <PDFBOX data={item} dataSize={data.length} navigation={navigation} index={index} 
                                              status={!_subscriptionStatus.sub_status ? false : true} setUpgrade={setUpgrade}/> : 
                                              <VideoBox data={item} dataSize={data.length} 
                                                index={index} status={!_subscriptionStatus.sub_status ? false : true}
                                                navigation={navigation}
                                                setUpgrade={setUpgrade}
                                              />
                                          }
                                        </React.Fragment>
                                      ))}
                                    </Container>
                              ))
                            }
                        </ScrollAreaRefresh>
                      )
                    }
                    {
                      !isLoading && showUpgrade && (
                        <Container paddingHorizontal={6} flex={1} verticalAlignment="center">
                            <TouchFeedback onPress={()=>setUpgrade(false)}>
                            <H2 textAlign="right">x</H2>
                            </TouchFeedback>
                            <SizedBox height={3}/>
                            <Container horizontalAlignment="center">
                            <P color="#0008" textAlign="center" fontSize={10} lineHeight={scaleFont(13)}>
                              Upgrade to a paid plan to watch previous and upcoming recordings of lightbox sessions and other articles.
                            </P>
                            <SizedBox height={4} />
                            <Button title="Upgrade" onPress={()=>navigation.navigate('Upgrade',{tabs : [silver_plan_id,gold_plan_id]})} />
                            </Container>
                        </Container>
                      )
                    }
                    {
                      !isLoading && data.length === 0 && !retry ? (
                        <Container horizontalAlignment="center" verticalAlignment="center">
                            <H2>No record found</H2>
                        </Container>
                      ) : null
                    }
              </Container>
            <SizedBox height={4} />
        </Container>
        {
          retry ? (
            <Retry funcCall={funcCall} param={[]}/>
          ) : null
        }
    </Page>
  )
};
export default Resources;
