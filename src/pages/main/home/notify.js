import React, { useEffect,useState } from 'react';
import {Container, Page, TouchWrap, scaleFont, SizedBox, InputWrap,
    ImageWrap,Avatar, Rounded, ScrollArea} from '@burgeon8interactive/bi-react-library';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../helpers/colors';
import {BoxLoader, H1,P,TouchFeedback} from '../../../components/component';
import { FlatList } from 'react-native';
import {apiFunctions} from '../../../helpers/api';
import {useStoreState,useStoreActions} from 'easy-peasy';
import { ToastLong } from '../../../helpers/utils';
import moment from 'moment';
import {gold_plan_id,silver_plan_id} from '../../../helpers/constants';
import {Retry} from '../../../components/retry';
import { storeData } from '../../../helpers/functions';
import { ScrollView } from 'react-native-gesture-handler';

const Notify = ({props, notification_id,setNotify}) => {
    const [retry,showRetry] = useState(false);
    const {updateOpportunity,updateAffinity,updateSenders} = useStoreActions(actions => (
        {
            updateOpportunity : actions.opportunity.updateOpportunity,
            updateAffinity : actions.affinity.updateAffinity,
            updateSenders : actions.community.updateSenders
        }
    ));
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
    const getNotification = async () => {
        try{
            console.log("getNotification>>>",props,notification_id)
            //2884ed0d-7245-4ae6-9084-714fad1832a7
            let item  = await apiFunctions.getNotification(token,notification_id);
            let myEvents = await apiFunctions.getMyEvents(token);

            console.log("iteM<<>>",item)


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


            if(item.post === false && item.content_placement === "group"){
                await storeData(`members-${item.action_id}`,item.group_members);
                setNotify(null)
                return props.navigation.navigate("GroupRequests",{
                  data : item,notification_id : item.id
                })
            }
            if(item.post === false && item.content_placement === "contact"){
                updateSenders(null);
                return navigation.navigate("Chat",{notification_id : item.id})
            }
            updateOpportunity(item.post);
            if((item.content_placement === "feed" || (placement_arr && placement_arr[1]  && placement_arr[1] === 'feed')) && item.post){
                setNotify(null)
                return props.navigation.navigate("FeedDetails",{notifPost:item.post,notification_id : item.id,feed_id :  placement_arr[0]});
            }
            if((item.content_placement === 'group' || (placement_arr && placement_arr[1]  && placement_arr[1] === 'group')) && item.post){
                setNotify(null)
                return props.navigation.navigate("GroupDetailsPost",{postId:item.post.id,groupId :  placement_arr[0],
                    thePost : item.post,notification_id : item.id})
            }
            if((item.content_placement === 'topic' || (placement_arr && placement_arr[1]  && placement_arr[1] === 'topic'))  && item.post){
                setNotify(null)
                return props.navigation.navigate("TopicDetailsPost",{itemId:item.post.id,mainId : placement_arr[0],
                    thePost : item.post,notification_id : item.id})
            }

            if(item.content_placement === 'event' && item.post){
                setNotify(null)
                return props.navigation.navigate("EventDetails",{eventDetails:item.post,tabName:`
                ${
                    (
                        item.post.status.toLowerCase() === 'open' && 
                        new Date(item.post.start_datetime).getTime() > new Date().getTime()) ? 'upcomingEvents' : 
                        'pastEvents'

                }
                `,myEvents,notification_id : item.id})
            }
            if(["scholarship","fund&grants",'job','loans'].includes(item.content_placement) && item.post){
                setNotify(null)
                return props.navigation.navigate("OtherOppsDetails",{opportunity:item.post,tabname:tabname,showButtons:true,notification_id : item.id})
            }
            if(item.content_placement === "investment" && item.post){
                setNotify(null)
                return props.navigation.navigate("InvestDetails",{opportunity:item.post,notification_id : item.id})
            }
            if(item.content_placement === "offer"){
                updateAffinity(item.post)
                setNotify(null)
                return props.navigation.navigate(!subscriptionStatus.plan ? "Affinity" : subscriptionStatus.plan.id !== gold_plan_id || subscriptionStatus.sub_status === false ? "Affinity" : "AffinityDetails",{data:item.post,notification_id : item.id,tabName:"Affinity"})
            }
            if(item.content_placement === "session" || item.content_placement === "pdf"){
                setNotify(null)
                return props.navigation.navigate('ResourceDetails',{item : placement,notification_id:item.id})
            }

            if(item.content_placement === "custom_notification"){
                setNotify(null)
                return props.navigation.navigate('CustomPush',{item,notification_id:item.id})
            }
            props.navigation.navigate("Home");
        }catch(error){
            console.log("errpr",error);
            setNotify(null)
            props.navigation.navigate("Home");
        }
    }

    // useFocusEffect(
    //     React.useCallback(()=>{
    //         console.log("Notify>>--Callback")
    //         props.navigation.navigate('Home')
    //     },[])
    // )

    useEffect(()=>{
        getNotification();
    },[]);
    return(
            <Page barIconColor="light" backgroundColor={Colors.primary}>
                <SizedBox height={7} />
                <Container backgroundColor={Colors.white} flex={1} paddingHorizontal={6} borderTopLeftRadius={50} borderTopRightRadius={50}>
                    <SizedBox height={3}/>
                    <ScrollView showsVerticalScrollIndicator={false}>
                   {
                        [...'123456'].map((item,index)=>(
                            <BoxLoader key={index} />
                        ))
                   }
                    </ScrollView>
                </Container>
                {
                    retry ? (
                        <Retry funcCall={getNotifications} param={[page]} />
                    ) : null
                }
            </Page>
    )
}

export default React.memo(Notify);