import React, { useEffect,useState } from 'react';
import {Page, Container, TouchWrap, scaleFont, SizedBox,ImageWrap,ScrollArea,InputWrap} from '@burgeon8interactive/bi-react-library';
import {H1,H2,P,TouchFeedback} from '../../components/component';
import Agsbanner from '../../../assets/img/card_8.jpeg';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../helpers/colors';
import { FlatList } from 'react-native-gesture-handler';
import {apiFunctions} from '../../helpers/api';
import { ActivityIndicator } from 'react-native';
import {useStoreState,useStoreActions} from 'easy-peasy';
import ImageTopTextBottomCard from '../../components/image_top_text_bottom';
import { ToastShort } from '../../helpers/utils';
import {Button} from '../../components/component';
import {FONTSIZE, gold_plan_id,silver_plan_id} from '../../helpers/constants';
import {Retry} from '../../components/retry';

const Affinity = ({navigation,route}) => {
    const [isLoading,setLoading] = useState(false);
    const getPartners = async () => {
        try{
            setLoading(true);
            updateRetry(false);
            updateFunc(getPartners);
            let res = await apiFunctions.getPartners(token);
            setPartnersHolder(res);
            setPartners(res);
            setLoading(false);
        }catch(error){
            updateFunc(getPartners);
            updateRetry(true);
            setLoading(false);
        }
    }

    const {updateSeen,updateFunc,updateRetry} = useStoreActions(actions => ({
        updateSeen : actions.notification.updateSeen,
        updateFunc : actions.retryModel.updateFunc,
        updateRetry : actions.retryModel.updateRetry,
    }));
    const [partners,setPartners] = useState([]);
    const [showUpgrade,setUpgrade] = useState(false);
    const [partnersHolder,setPartnersHolder] = useState([]);
    const {token,subscriptionStatus,seen_notifications,retry,funcCall} = useStoreState(state=>({
        token : state.userDetails.token,
        subscriptionStatus : state.userDetails.subscriptionStatus,
        seen_notifications : state.notification.seen_notifications,
        retry : state.retryModel.retry,
        funcCall : state.retryModel.funcCall
    }));
    const notification_id =  route.params && route.params.notification_id || null;
    const searchEngine = (value) => {
        let result = partnersHolder.filter((item)=>{
            return item && item.partner && item.partner.name && item.partner.name.toLowerCase().includes(value.toLowerCase())
        });
        value.length === 0 ? setPartners(partnersHolder) : setPartners(result);
    }

    useEffect(()=>{
        if(notification_id){
            apiFunctions.markAsSeen(token,notification_id);
        }
        if(notification_id && seen_notifications && !seen_notifications.includes(notification_id)){
            global.tot_notifications = global.tot_notifications - 1;
            updateSeen([...seen_notifications,notification_id])
        }
        let unsubscribed = navigation.addListener('focus',()=>{
            getPartners(token);
        });
    },[navigation,retry])
  return (
    <Page backgroundColor={Colors.white} barColor={Colors.black}>
        <Container paddingHorizontal={4} paddingTop={4} backgroundColor={Colors.white}>
            <Container
                direction="row"
                verticalAlignment="center"
            >
                <TouchFeedback paddingRight={2} paddingBottom={2} paddingTop={2} onPress={() => navigation.openDrawer()}>
                    <Feather Icon name="menu" size={scaleFont(FONTSIZE.menu)} color={Colors.black} />
                </TouchFeedback>
                {
                    !showUpgrade && !isLoading && (
                        <Container widthPercent="80%" horizontalAlignment="center" padding={2}>
                                <InputWrap 
                                    placeholder="Search" backgroundColor="#fff" flex={1} 
                                    elevation={10} 
                                    paddingTop={2} paddingLeft={5} borderRadius={50}
                                    onChangeText={(value)=>searchEngine(value)}
                                    height={7.3}
                                />
                        </Container>
                    ) 
                }
            </Container>
            <Container padding={2}>
                <ImageWrap
                    borderTopLeftRadius={10}
                    borderBottomLeftRadius={10}
                    source={Agsbanner}
                    borderRadius={10} backgroundColor={Colors.white}
                    height={30}
                    fit="contain" 
                />
            </Container>
        </Container>

      {/* ANCHOR - HEADER 2 */}
        <Container flex={1} marginTop={2} backgroundColor={Colors.white} flex={1} borderTopLeftRadius={50} borderTopRightRadius={50}>
            <Container flex={1}>
                <ScrollArea>
                    <Container
                        padding={5}
                    >
                    {
                        isLoading && (
                            <ActivityIndicator size="large" color={Colors.primary}/>
                        )
                    }
                    {
                        partners.length > 0 ? (
                        <>
                            {
                                    !showUpgrade ? (
                                    <Container>
                                        <FlatList 
                                            data={partners} 
                                            extraData={partners} 
                                            keyExtractor={item => item.id} 
                                            renderItem={({item, index}) => <ImageTopTextBottomCard navigation={navigation} 
                                                data={item} navigateTo="AffinityDetails" tabName="Affinity" 
                                                status={!subscriptionStatus.plan ? false : subscriptionStatus.plan.id !== gold_plan_id || subscriptionStatus.sub_status === false ? false : true} 
                                                setUpgrade={setUpgrade}
                                            />} 
                                            showsVerticalScrollIndicator={false}
                                        />
                                    </Container>
                                    ) : (
                                    <Container paddingHorizontal={6} flex={1} verticalAlignment="center">
                                        <TouchFeedback onPress={()=>setUpgrade(false)}>
                                        <H2 textAlign="right">x</H2>
                                        </TouchFeedback>
                                        <SizedBox height={3}/>
                                        <Container horizontalAlignment="center">
                                        <P color="#0008" textAlign="center" fontSize={FONTSIZE.medium} lineHeight={scaleFont(13)}>
                                            Upgrade to Gold Plan to join Herconomy Network and unlock access to exclusive discounts and offers.
                                        </P>
                                        <SizedBox height={4} />
                                        <Button title="Upgrade to GOLD" onPress={()=>navigation.navigate('Upgrade',{tabs : [gold_plan_id]})} />
                                        </Container>
                                    </Container>
                                    )
                            }
                        </>
                                
                        ) : null
                    }
                    {
                        !isLoading && partners.length === 0 ? (
                            <Container horizontalAlignment="center" verticalAlignment="center">
                                <H1>No record found</H1>
                            </Container>
                        ) : null
                    }
                    </Container>
                </ScrollArea>
            </Container>
            {
          retry ? (
            <Retry funcCall={funcCall} param={[]}/>
          ) : null
        }
      </Container>
    </Page>
  );
};

export default Affinity;
