import React, { useEffect,useState } from 'react';
import {Container, Page, TouchWrap, scaleFont, SizedBox, InputWrap,
    ImageWrap,Avatar, Rounded, ScrollArea} from '@burgeon8interactive/bi-react-library';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../helpers/colors';
import {BoxLoader, H1,P,PageHeader,TouchFeedback} from '../../components/component';
import { FlatList } from 'react-native';
import {apiFunctions} from '../../helpers/api';
import {useStoreState,useStoreActions} from 'easy-peasy';
import { ToastLong } from '../../helpers/utils';
import moment from 'moment';
import {FONTSIZE, gold_plan_id,silver_plan_id} from '../../helpers/constants';
import {Retry} from '../../components/retry';
import { storeData } from '../../helpers/functions';
import { ScrollView } from 'react-native-gesture-handler';

const NotificationBox = ({item,navigation,index,myEvents,subscriptionStatus,user}) => {
    const {updateOpportunity,updateAffinity,updateSenders} = useStoreActions(actions => (
        {
            updateOpportunity : actions.opportunity.updateOpportunity,
            updateAffinity : actions.affinity.updateAffinity,
            updateSenders : actions.community.updateSenders
        }
    ));
    const {seen_notifications} = useStoreState(state=>({
        seen_notifications : state.notification.seen_notifications
      }))
    let tabname = item.content_placement === 'scholarship' ? 'scholarships' : 
                    item.content_placement === 'fund&grants' ? 'grants' :
                    item.content_placement === 'loan'  ? 'loans' : 'jobs'
    let placement = item.content_placement === "session" ? {
        id : 1,
        name : 'LightBox Sessions',
        type : 'session',
        title : "LightBox Sessions"
  
      } :
      {
        id : 2,
        name : 'PDF Resources',
        type : 'pdf',
        title : "PDF Resources"
      }
      let placement_arr = item.content_placement_id && item.content_placement_id.split('|')
    return(
        <TouchFeedback
            onPress={async ()=>{
                if(item.post === false && item.content_placement === "group"){
                    await storeData(`members-${item.action_id}`,item.group_members);
                    return navigation.navigate("GroupRequests",{
                      data : item,notification_id : item.id
                    })
                }
                if(item.post === false && item.content_placement === "contact"){
                    updateSenders(null);
                    return navigation.navigate("Chat",{notification_id : item.id})
                }
                updateOpportunity(item.post);
                if((item.content_placement === "feed" || (placement_arr && placement_arr[1]  && placement_arr[1] === 'feed')) && item.post){
                    return navigation.navigate("FeedDetails",{notifPost:item.post,notification_id : item.id,feed_id :  placement_arr[0]});
                }
                if((item.content_placement === 'group' || (placement_arr && placement_arr[1]  && placement_arr[1] === 'group')) && item.post){
                    return navigation.navigate("GroupDetailsPost",{postId:item.post.id,groupId :  placement_arr[0],
                        thePost : item.post,notification_id : item.id})
                }
                if((item.content_placement === 'topic' || (placement_arr && placement_arr[1]  && placement_arr[1] === 'topic'))  && item.post){
                    return navigation.navigate("TopicDetailsPost",{itemId:item.post.id,mainId : placement_arr[0],
                        thePost : item.post,notification_id : item.id})
                }

                if(item.content_placement === 'event' && item.post){
                    return navigation.navigate("EventDetails",{eventDetails:item.post,tabName:`
                    ${
                        (
                            item.post.status.toLowerCase() === 'open' && 
                            new Date(item.post.start_datetime).getTime() > new Date().getTime()) ? 'upcomingEvents' : 
                            'pastEvents'

                    }
                    `,myEvents,notification_id : item.id})
                }
                if(["scholarship","fund&grants",'job','loans'].includes(item.content_placement) && item.post){
                    return navigation.navigate("OtherOppsDetails",{opportunity:item.post,tabname:tabname,showButtons:true,notification_id : item.id})
                }
                if(item.content_placement === "investment" && item.post){
                    return navigation.navigate("InvestDetails",{opportunity:item.post,notification_id : item.id})
                }
                if(item.content_placement === "offer"){
                    updateAffinity(item.post)
                    return navigation.navigate(!subscriptionStatus.plan ? "Affinity" : subscriptionStatus.plan.id !== gold_plan_id || subscriptionStatus.sub_status === false ? "Affinity" : "AffinityDetails",{data:item.post,notification_id : item.id,tabName:"Affinity"})
                }
                if(item.content_placement === "session" || item.content_placement === "pdf"){
                    return navigation.navigate('ResourceDetails',{item : placement,notification_id:item.id})
                }

                if(item.content_placement === "custom_notification"){
                    return navigation.navigate('CustomPush',{item,notification_id:item.id})
                }
               
            }}
            key={index}
        >
            <Container direction="row" paddingVertical={3} paddingHorizontal={5}
                borderRadius={10} borderWidth={1} 
                marginBottom={1.5}
                borderColor={Colors.line}
            >
                <Container widthPercent="20%">
                    <Container
                         backgroundColor={
                            (item.read_users && item.read_users.includes(user.id)) || 
                            (seen_notifications && 
                              seen_notifications.includes(item.id))
                              ? Colors.lightGrey
                              : Colors.primary
                          } 
                         horizontalAlignment="center" 
                        borderRadius={50}
                        width={8}
                        padding={2}
                    >
                        <Feather name="bell" size={scaleFont(10)} color={Colors.white} />
                    </Container>
                </Container>
                <Container widthPercent="80%">
                    <P>{item.content}</P>
                    {
                        item.actual_content && item.actual_content.length > 0 ? (
                            <>
                                <SizedBox height={1}/>
                                <P fontSize={10} numberOfLines={1} color={Colors.fadedText}>{item.actual_content.trim()}</P>
                            </>
                        ) : null
                    }
                    <SizedBox height={1}/>
                    <P fontSize={6} color={Colors.fadedText}>{moment(item.created_at).format('DD MMM YYYY hh:mm a')}</P>
                </Container>
            </Container>
        </TouchFeedback>
    )
}

const Notification = (props) => {
    const {user,token,subscriptionStatus,
        tot_notifications
    } = useStoreState(state=>(
        {
            token: state.userDetails.token,
            user : state.userDetails.user,
            subscriptionStatus : state.userDetails.subscriptionStatus,
            tot_notifications : state.notification.tot_notifications
        }
    ));
    const [myEvents,setEvents] = useState([]);
    const [notification,setNotifications] = useState([]);
    const [loading,setLoading] = useState(false);
    const [page,setPage] = useState(1);
    const [retry,showRetry] = useState(false);
    const {updateTotNotification} = useStoreActions(action=>({
        updateTotNotification : action.notification.updateTotNotification
      }))
    const getNotifications = async (num) => {
        try{
            setLoading(true);
            showRetry(false);
            let pg = num || 1;
            let res  = await apiFunctions.getNotifications(token,user.id,pg);
            let myEvents = await apiFunctions.getMyEvents(token);
            setEvents(myEvents);
            pg === 1 ? setNotifications([...res.results.notifications]) : setNotifications([...notification,...res.results.notifications]);
            setPage(pg + 1);
            setLoading(false);
        }catch(error){
            setLoading(false);
            if(error.msg && error.msg.detail && error.msg.detail === "Invalid page."){
                showRetry(false);
                return;
            }
            showRetry(true);
        }
    }

    const setLastChecked = async () => {
        try{
            updateTotNotification(0);
            let res = await apiFunctions.generalUpdate(token);
        }catch(err){
        }
    }
    useEffect(()=>{
        getNotifications(1);
        props.navigation.addListener('focus', ()=>{
            setLastChecked();
        })
    },[]);
    return(
        <>
            <Page barIconColor="light" backgroundColor={Colors.primary}>
                <PageHeader navigation={props.navigation} title={'Notifications'}/>
                <SizedBox height={3} />
                <Container backgroundColor={Colors.white} flex={1} paddingHorizontal={6} borderTopLeftRadius={50} borderTopRightRadius={50}>
                    <SizedBox height={3}/>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        { notification.length === 0 ? (
                                [...'123456'].map((item,index)=>(
                                    <BoxLoader key={index} />
                                ))
                            ) : null
                        }
                    </ScrollView>
                    <FlatList 
                        showsVerticalScrollIndicator={false}
                        data={notification}
                        extraData={notification}
                        renderItem={({item, index}) => <NotificationBox item={item} index={index} navigation={props.navigation} 
                            myEvents={myEvents}
                            subscriptionStatus={subscriptionStatus}
                            user={user}
                        />}
                        keyExtractor={item => item.id}
                        refreshing={loading}
                        onRefresh={()=>getNotifications(1)}
                        onEndReached={()=>{
                            getNotifications(page)
                        }}
                    />
                </Container>
                {
                    retry ? (
                        <Retry funcCall={getNotifications} param={[page]} />
                    ) : null
                }
            </Page>
        </>
    )
}

export default Notification;