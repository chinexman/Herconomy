import React,{useEffect,useState} from 'react';
import {
  Page,
  Container,
  TouchWrap,
  SizedBox,
  scaleFont,
  ScrollArea,
  TextWrap
} from '@burgeon8interactive/bi-react-library';
import {H1,H2,P,Button,Input,Label,Dropdown,ListWrapGeneral,CheckBok,TouchFeedback} from '../../../../components/component';
import Colors from '../../../../helpers/colors';
import Feather from 'react-native-vector-icons/Feather';
import { CheckBox } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {IOSDatePicker} from '../../../../components/ios_date_picker';
import {Modal,Alert} from 'react-native';
import moment from 'moment';
import { apiFunctions } from '../../../../helpers/api';
import {useStoreState} from 'easy-peasy';
import { ToastLong } from '../../../../helpers/utils';
import { storeData, getData } from '../../../../helpers/functions';
import { FONTSIZE } from '../../../../helpers/constants';



export const AddGroupEvent = ({navigation,route}) => {
    
    const {group_id,group_event} =  route.params;  
    const [event,setEvent] = useState({
        title : group_event ? group_event.title : null,
        banner : null,
        description : group_event ? group_event.description : null,
        start_date : group_event ? group_event.start_datetime : null,
        end_date : group_event ? group_event.end_datetime : null,
        event_type : group_event ? group_event.event_type : null,
        location : group_event ? group_event.location : null,
        city : group_event ? group_event.city : null,
        address : group_event ? group_event.address : null,
        medium : group_event ? group_event.medium : null,
        link : group_event ? group_event.link : null,
        registration_link : group_event ? group_event.registration_link : null,
        cta_button : group_event ? group_event.cta_button : null,
        paid : group_event ? !group_event.free : null,
        price : group_event ? group_event.price : null,
        flagship : false,
        status : group_event ? group_event.status : "Open",
        seats : null
    });
    const [data,setData] = useState([]);
    const [list,setList] = useState({
        title : null,
        type : null
    });
    const [showPicker,setShow] = useState(false);
    const manageFilePicker = async (fieldName) =>{
        try {
            const res = await DocumentPicker.pick({
              type: [DocumentPicker.types.images],
            });
            if(res.size > 10000000){
                ToastLong(`${fieldName} can not be more than 10MB`);
                fieldName === "banner" ? setEvent({}) : null;
                //fieldName === "resume" ? setResumePlaceHolder("Resume/CV") : setCoverPlaceholder("Cover Letter");
                return false;
            }
            let file = {
                uri : res.uri,
                type : res.type, // mime type
                name : res.name,
                //size : res.size
            }
            fieldName === "banner" ? setEvent({...event,banner : file}) : null;
            // fieldName === "resume" ? setResumePlaceHolder(file.name) : setCoverPlaceholder(file.name);
            saveDraft();
          } catch (err) {
            if (DocumentPicker.isCancel(err)) {
              // User cancelled the picker, exit any dialogs or menus and move on
            } else {
              throw err;
            }
          }
    }
    const openListWrapper = list => {
        setShowList(true);
        if(list === 'event_type'){
            setData([
                {title : "Internal"},
                {title : "External"}
            ]);
            setList({
                title : "Event Type",
                type : "event_type"
            });
        }
        if(list === 'medium'){
            setData([
                {title : "In-Person"},
                {title : "Virtual"},
                // {title : "Hybrid"}
            ]);
            setList({
                title : "Medium",
                type : "medium"
            });
        }
        if(list === 'status'){
            setData([
                {title : "Open"},
                {title : "Close"}
            ]);
            setList({
                title : "Status",
                type : "status"
            });
        }
    }
    const selectFromList = (value)=>{
        if(list.type === "event_type") setEvent({...event,event_type:value.title,link : ''})
        if(list.type === "medium") setEvent({...event,medium:value.title,registration_link : '',
        location : '',city : '',address : ''
    });
        if(list.type === "status") setEvent({...event,status:value.title})
        saveDraft();
        setShowList(false);
    }

    const [showList,setShowList] = useState(false);
    const [purpose,setPurpose] = useState(null);
    const [start_date,setStart] = useState(group_event ? group_event.start_datetime : new Date());
    const [end_date,setEnd] = useState(group_event ? group_event.end_datetime : new Date());
    const [start_holder,setStartHolder] = useState(new Date());
    const [end_holder,setEndHolder] = useState(new Date());
    const {token,user} = useStoreState(state=>({
        token : state.userDetails.token,
        user : state.userDetails.user
    }));
    const [loading,setLoading] = useState(false);  

    const createEvent = async (required) => {
        if(event.medium === "In-Person" || event.medium === "Hybrid"){
            required.push("location","city","address");
        }
        if((event.medium === "Virtual" && event.paid && event.event_type !== "External") || (event.medium === "Hybrid" && event.paid)){
            required.push("registration_link");
        }
        if(event.event_type === "External"){
            required.push("link");
        }
        if(event.paid){
            required.push("price");
        }
        let status = event.status ? event.status.toLowerCase() : event.status;
        let event_type = event.event_type ? event.event_type.toLowerCase() : event.event_type;
        try{
            let fd = {...event,
                free : !event.paid,
                start_date : start_date,
                end_date:end_date,
                status,
                event_type
            }
            let failed = false 
            let reqs = required.filter(item=>item.length > 0);
            for(let req of reqs){
                if(!fd[req]) {
                    failed = true
                }
            }
            let {group_id} =  route.params;
            if(failed){
                return Alert.alert("Herconomy","Field marked with * are required");
            }
            let diff = new Date(end_date).getTime() - new Date(start_date).getTime();
            if(diff < 0){
                return Alert.alert("Herconomy","End date must be after start date");
            }
            if(
                (event.link && !event.link.startsWith('https://')) ||
                (event.registration_link && !event.registration_link.startsWith('https://'))
            ){
                return Alert.alert("Herconomy","Link should be formatted properly")
            }
            
            setLoading(true);
            let fdata = new FormData();
            fdata.append('title',event.title);
            if(event.banner){
                fdata.append('banner',event.banner);
            }
            fdata.append('description',event.description);
            fdata.append('start_datetime',moment(start_date).format("YYYY-MM-DDTHH:mm:ss"));
            fdata.append('end_datetime',moment(end_date).format("YYYY-MM-DDTHH:mm:ss"));
            fdata.append('event_type',event.event_type);
            fdata.append('location',event.location);
            fdata.append('city',event.city);
            fdata.append('address',event.address);
            fdata.append('medium',event.medium);
            fdata.append('link',event.link === null ? "" : event.link);
            fdata.append('registration_link',event.registration_link === null ? "" : event.registration_link );
            fdata.append('cta_button',event.cta_button);
            fdata.append('free',!event.paid);
            fdata.append('price',Number(event.price));
            fdata.append('is_flagship',event.flagship);
            fdata.append('status',event.status.toLowerCase());
            fdata.append('seats',Number(event.seats));
            fdata.append('user',user.id);
            let res = group_event ? await apiFunctions.updateGroupEvent(token,group_event.id,fdata) : 
                await apiFunctions.createGroupEvent(token,group_id,fdata);
            storeData('group_id',null);
            storeData('group_event',null);
            let msg = group_event ? 'Event has been edited' : 'Event has been created';
            Alert.alert('Herconomy',msg);
            return navigation.goBack();
        }catch(error){
            setLoading(false);
            if(error && error.response && error.response.data &&
                error.response.data.link){
                let err = error.response.data.link[0]
                ? error.response.data.link[0] : "Network Error. Check the internet and try again";
                ToastLong(err);
                return setLoading(false);
              }
              let err = error && error.response && error.response.data && 
              error.response.data.registration_link && error.response.data.registration_link[0]
              ? error.response.data.registration_link[0] : "Network Error. Check the internet and try again";
              ToastLong(err);
        }
    }
    const saveDraft = () => {
        setTimeout(()=>{
            storeData('group_id',group_id);
            storeData('group_event',event);
        },1000);
    }
    const getStoredData = async () => {
        let id = await getData('group_id');
        if(id === group_id){
            let group_event = await getData('group_event');
            setEvent({...event,...group_event});
        }
    }
    useEffect(()=>{
        getStoredData();
    },[])
    return (
        <Page barIconColor="light" backgroundColor={Colors.primary}>
            <Container paddingHorizontal={6} paddingTop={6} direction="row" verticalAlignment="center">
                <TouchFeedback paddingRight={5} paddingTop={1.5} paddingBottom={1.5} onPress={() => navigation.goBack()}>
                    <Feather Icon name="chevron-left" size={scaleFont(FONTSIZE.menu)} color="#fff" />
                </TouchFeedback>
                <H1 color={Colors.white} fontSize={FONTSIZE.page}>Add Event</H1>
            </Container>
            <SizedBox height={8} />
            <Container backgroundColor={Colors.white} flex={1} borderTopLeftRadius={50} borderTopRightRadius={50}>
                <SizedBox height={2} />
                <ScrollArea>
                    <Container horizontalAlignment="center" flex={1}>
                            <Container flex={1} widthPercent="100%" paddingHorizontal={6}>
                                <SizedBox height={3}/>
                                <Container>
                                    <Label name="Title *" />
                                    <Input placeholder="Title" 
                                        placeholderTextColor={Colors.lightGrey} 
                                        type="default"
                                        onChangeText={(value)=>{
                                            setEvent({...event,title : value});
                                            saveDraft();
                                        }}
                                        value={event.title}
                                    />
                                </Container>
                                <SizedBox height={3}/>
                                <TouchFeedback>
                                    <Container>
                                        <Container direction="row" horizontalAlignment="space-between">
                                            <Label name="Banner *" />
                                            <P color={Colors.primary} fontSize={5}>Max file size 10MB of dimension (1980 x 960)</P>
                                        </Container>
                                        <SizedBox height={1}/>
                                        <TouchFeedback
                                            onPress={()=>manageFilePicker("banner")}
                                        >
                                            <Container backgroundColor={Colors.whiteBase} 
                                                paddingHorizontal={3} paddingVertical={2.1}
                                                borderRadius={7}
                                            >
                                                <TextWrap fontSize={FONTSIZE.medium} color={ event.banner === null ? Colors.lightGrey : Colors.black}>
                                                    { event.banner === null ? 'Banner' : event.banner.name }
                                                </TextWrap>
                                            </Container>
                                        </TouchFeedback>
                                    </Container>
                                </TouchFeedback>
                                <SizedBox height={3}/>
                                <Container>
                                    <Label name="Description *" />
                                    <Input placeholder="Description" 
                                        placeholderTextColor={Colors.lightGrey} 
                                        type="default"
                                        onChangeText={(value)=>{
                                            setEvent({...event,description : value});
                                            saveDraft();
                                        }}
                                        value={event.description}
                                        multiline={true}
                                    />
                                </Container>
                                <SizedBox height={3}/>
                                <Container>
                                        <Container direction="row" horizontalAlignment="space-between">
                                            <Label name="Start Date *" />
                                        </Container>
                                        <SizedBox height={1}/>
                                        <TouchFeedback
                                            onPress={()=>{
                                                setShow(true)
                                                setPurpose('start')
                                            }}
                                        >
                                        <Container backgroundColor={Colors.whiteBase} 
                                            paddingHorizontal={3} paddingVertical={2.1}
                                            borderRadius={7}
                                        >
                                            <TextWrap fontSize={FONTSIZE.medium} color={purpose ?  Colors.black : Colors.lightGrey}>
                                                {moment(start_date).format('DD MMMM YYYY hh:mm:ss a')}
                                            </TextWrap>
                                        </Container>
                                    </TouchFeedback>
                                    </Container>

                                <SizedBox height={3}/>
                                <Container>
                                    <Label name="End Date *" />
                                    <SizedBox height={1}/>
                                    <TouchFeedback
                                        onPress={()=>{
                                            setShow(true)
                                            setPurpose('end')
                                        }}
                                    >
                                        <Container backgroundColor={Colors.whiteBase} 
                                            paddingHorizontal={3} paddingVertical={2.1}
                                            borderRadius={7}
                                        >
                                            <TextWrap fontSize={FONTSIZE.medium} color={purpose ? Colors.black : Colors.lightGrey}>
                                                {moment(end_date).format('DD MMMM YYYY hh:ss a')}
                                            </TextWrap>
                                        </Container>
                                    </TouchFeedback>
                                </Container>
                                <SizedBox height={3}/>
                                <Container>
                                    <Label name="Event Type *" />
                                    <Dropdown
                                        placeholder="Select Event Type"
                                        backgroundColor="#fff"
                                        value={event.event_type}
                                        onPress={() => openListWrapper("event_type")}
                                    />
                                </Container>
                                <SizedBox height={3}/>
                                <Container>
                                    <Label name="Medium *" />
                                    <Dropdown
                                        placeholder="Select Medium"
                                        backgroundColor="#fff"
                                        value={event.medium}
                                        onPress={() => openListWrapper("medium")}
                                    />
                                </Container>
                                {
                                    event.medium === "In-Person" || event.medium === "Hybrid" ? (
                                        <>
                                            <Container>
                                                <Label name="Location *" />
                                                <Input placeholder="Location" 
                                                    placeholderTextColor={Colors.lightGrey} 
                                                    type="default"
                                                    onChangeText={(value)=>{
                                                        setEvent({...event,location : value});
                                                        saveDraft();
                                                    }}
                                                    value={event.location}
                                                />
                                            </Container>
                                            <Container>
                                                <Label name="City *" />
                                                <Input placeholder="City" 
                                                    placeholderTextColor={Colors.lightGrey} 
                                                    type="default"
                                                    onChangeText={(value)=>{
                                                        setEvent({...event,city:value})
                                                        saveDraft();
                                                    }}
                                                    value={event.city}
                                                />
                                            </Container>
                                            <Container>
                                                <Label name="Address *" />
                                                <Input placeholder="Address" 
                                                    placeholderTextColor={Colors.lightGrey} 
                                                    type="default"
                                                    onChangeText={(value)=>{
                                                        setEvent({...event,address:value})
                                                        saveDraft();
                                                    }}
                                                    value={event.address}
                                                />
                                            </Container>
                                        </>
                                    ) : null
                                }

                                <SizedBox height={2}/>
                                <Container>
                                    <Label name="Is this a paid event?" />
                                    <Container direction="row">
                                        <CheckBok 
                                            status={event.paid === false}
                                            onPress={()=>{
                                                setEvent({...event,paid : false})
                                                saveDraft();
                                            }}
                                        />
                                        <SizedBox width={2} />
                                        <P>No</P>
                                        <SizedBox width={3} />
                                        <CheckBok 
                                            status={event.paid === true}
                                            onPress={()=>{
                                                setEvent({...event,paid : true,link : null});
                                                saveDraft();
                                            }}
                                        />
                                        <SizedBox width={2} />
                                        <P>Yes</P>
                                    </Container>
                                </Container>
                                <SizedBox height={3}/>
                               
                                {
                                    event.medium === "Hybrid" || (event.event_type === "External") ? (
                                        <>
                                            <Container>
                                                <Label name={`CTA/External Link *`} />
                                                <Input placeholder="https://example.com" 
                                                    placeholderTextColor={Colors.lightGrey} 
                                                    type="default"
                                                    onChangeText={(value)=>{
                                                        setEvent({...event,link : value,registration_link : ''});
                                                        saveDraft();
                                                    }}
                                                    value={event.link}
                                                />
                                            </Container>
                                        </>
                                    ) : null
                                }

                                {
                                    (event.medium && event.medium === "Virtual" && event.event_type !== 'External') ? (
                                        <Container>
                                            <Label name={`Virtual Event Link ${event.paid ? '*' : ''}`} />
                                            <Input placeholder="https://example.com" 
                                                placeholderTextColor={Colors.lightGrey} 
                                                type="default"
                                                onChangeText={(value)=>{
                                                    setEvent({...event,registration_link : value})
                                                    saveDraft();
                                                }}
                                                value={event.registration_link}
                                            />
                                        </Container>
                                    ) : null
                                }
                                {
                                    (event.link && event.link.trim() !== '') ? (
                                        <Container>
                                            <Label name="CTA Button Text" />
                                            <Input placeholder="Learn More/View More/Register" 
                                                placeholderTextColor={Colors.lightGrey} 
                                                type="default"
                                                onChangeText={(value)=>{
                                                    setEvent({...event,cta_button : value})
                                                }}
                                                value={event.cta_button}
                                            />
                                        </Container>
                                    ) : null
                                }
                                
                                {
                                    event.paid ? (
                                        <>
                                            <SizedBox height={2}/>
                                            <Container>
                                                <Label name="Price *" />
                                                <Input placeholder="Price" 
                                                    placeholderTextColor={Colors.lightGrey} 
                                                    type="numeric"
                                                    onChangeText={(value)=>{
                                                        setEvent({...event,price:value})
                                                        saveDraft();
                                                    }}
                                                    value={event.price}
                                                />
                                            </Container>
                                        </>
                                    ) : null
                                }
                                {/* <Container>
                                    <Label name="Maximum Capacity *" />
                                    <Input placeholder="Maximum Capacity" 
                                        placeholderTextColor={Colors.lightGrey} 
                                        type="numeric"
                                        onChangeText={(value)=>setEvent({...event,seats:value})}
                                        value={event.seats}
                                    />
                                </Container> */}
                                {/* <SizedBox height={2}/>
                                <Container>
                                    <Label name="Flagship" />
                                    <CheckBok 
                                        status={event.flagship}
                                        onPress={()=>setEvent({...event,flagship : !event.flagship})}
                                    />
                                </Container> */}
                                <SizedBox height={2}/>
                                <Container>
                                    <Label name="Status" />
                                    <Dropdown
                                        placeholder="Select Status"
                                        backgroundColor="#fff"
                                        value={event.status}
                                        onPress={() => openListWrapper("status")}
                                    />
                                </Container>
                                <SizedBox height={2}/>
                                <Container padding={4} horizontalAlignment="center">
                                    <Container widthPercent="50%">
                                        <Button title="SAVE" borderRadius={4} backgroundColor={Colors.primary} 
                                            borderColor={Colors.primary} 
                                            onPress={()=>createEvent(["title",
                                                group_event ? "" : "banner","description","start_date",
                                                "end_date",
                                                "event_type",
                                                "medium"
                                            ])}
                                            loading={loading}
                                        />
                                    </Container>
                                </Container>
                                <SizedBox height={3}/>
                            </Container>
                        </Container>
                </ScrollArea>
            </Container>
            <Modal visible={showList} transparent={true} statusBarTranslucent={true}>
                    <Container backgroundColor="#0009" flex={1} horizontalAlignment="center" verticalAlignment="flex-start">
                        <SizedBox height={20} />
                        <Container height={50} width={95}>
                            <ListWrapGeneral
                                onToggle={() => setShowList(!showList)}
                                title={list.title}
                                listMap={data}
                                onHide={() => setShowList(false)}
                                selectFromList={selectFromList}
                            />
                        </Container>
                    </Container>
                </Modal>
                <Modal visible={showPicker}>
                    <Container backgroundColor="#0009" flex={1} verticalAlignment="center">
                        <IOSDatePicker
                            setPlaceholder={purpose === 'start' ? setStart : setEnd}
                            setHolder={purpose === 'start' ? setStartHolder : setEndHolder}
                            setShow={setShow}
                            value={purpose === 'start' ? start_holder:end_holder}
                            placeholder={purpose === 'start' ? start_date : end_date}
                            isEvent={true}
                        />
                    </Container>
                </Modal>
        </Page>
    );
};
