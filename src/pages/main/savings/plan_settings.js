import React, { useEffect } from 'react';
import { Container,ImageWrap,InputWrap,Page,scaleFont,SizedBox, TouchWrap } from "@burgeon8interactive/bi-react-library";
import { H1, TouchFeedback,P,H2, Button, CheckBok ,TransferMoney,
    TransferPlan,
    FundWallet,
    Warning,
    Label
} from '../../../components/component';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../helpers/colors';
import { ScrollView, Switch } from 'react-native-gesture-handler';
import numeral from 'numeral';
import { ActivityIndicator, Modal } from 'react-native';
import moment from 'moment';
import { handleQuery } from '../../../helpers/api';
import { useStoreState } from 'easy-peasy';
import { ToastLong } from '../../../helpers/utils';
import { calAmtToBeSaved, getData, storeData } from '../../../helpers/functions';
import { IOSDatePicker } from '../../../components/ios_date_picker';
import { Picker } from '@react-native-picker/picker';

export const PlanSettings = (props) => {
    const [show,setShow] = React.useState(false);
    const [plan,setPlan] = React.useState(null);
    const [typeD,setType] = React.useState(null)
    const [loading,setLoading] = React.useState(false)
    const [save,setSave] = React.useState(null)
    const [user,setUser] = React.useState(null);
    const {gql_token} = useStoreState((state)=>({
        gql_token : state.userDetails.gql_token
    }))
    const [edit,setEdit] = React.useState({
        label : "",
        value : ""
    })
    const [date,setDate] = React.useState(new Date())
    const [start,setStart] = React.useState(new Date())
    const setHowLong = (holder) => {
        setCustom(holder);
        setSelected("select")
    }
    const getPlanData = async () => {
        const {planD,type} = props.route.params;
        let user = await getData('gql_user');
        console.log("=---==||",planD)
        setUser(user);
        setPlan(planD);
        setType(type)
    }
    const handleAutoSave = async (param) => {
        try{
            //return console.log("handleAutoSave",param,plan,typeD)
            let new_status = plan.status === "In_Progress" ? "Suspend_Auto_Charge" : "In_Progress";
            setPlan({...plan,status : new_status})
            let gql_token = await getData('gql_token')
            let query = typeD === "goal" ? `mutation{
                updateUserGoal(input : {
                  where : {id : ${plan.id}}
                  data : {
                    status : ${new_status}
                  }
                }){
                  userGoal{
                    id
                  }
                }
              }` : `mutation{
                updateUserSavingsChallenge(input:{
                  where : {id : ${plan.id}}
                  data : {
                    status : ${new_status}
                  }
                }){
                  userSavingsChallenge{
                    id
                  }
                }
              }`;
              await handleQuery(query,gql_token)
        }catch(err){
            console.log("err",err)
            setPlan({...plan,status : plan.status})
            ToastLong("This should not have happen. Please retry")
        }
    }
    const handleSubmit = async () => {
        try{
            setLoading(true);
            let query = typeD === "goal" ? `mutation{
                updateUserGoal(input : {
                  where : {id : ${plan.id}}
                  data : {
                    title : "${plan.title}",
                    end_date : "${plan.end_date}",
                    frequency : ${plan.frequency}
                    target_amount : ${plan.target_amount}
                  }
                }){
                  userGoal{
                    title,
                    end_date,
                    frequency,
                    target_amount
                  }
                }
              }` : `mutation{
                updateUserSavingsChallenge(input:{
                  where : {id : ${plan.id}}
                  data : {
                    frequency : ${plan.frequency}
                    target_amount : ${plan.target_amount}
                  }
                }){
                  userSavingsChallenge{
                    frequency,
                    target_amount
                  }
                }
              }`;
            let res = await handleQuery(query,gql_token)
            if(res.data && res.data.updateUserGoal && res.data.updateUserGoal.userGoal){
                setLoading(false)
                storeData("single_plan",{...plan,...res.data.updateUserGoal.userGoal})
                props.navigation.goBack();
            }
            if(res.data && res.data.updateUserSavingsChallenge && res.data.updateUserSavingsChallenge.userSavingsChallenge){
                setLoading(false)
                storeData("single_plan",{...plan,...res.data.updateUserSavingsChallenge.userSavingsChallenge})
                props.navigation.goBack();
            }
        }catch(err){
            setLoading(false);
            return ToastLong("This shouldn't happen. Please try again")
        }
    }
    useEffect(()=>{
        getPlanData()
    },[])
    return(
        <Page backgroundColor={Colors.primary} >
        <Container paddingHorizontal={6} 
            paddingTop={6} 
            backgroundColor={Colors.primary} 
            direction="row"
            verticalAlignment="center"
            horizontalAlignment="space-between"
        >
            <Container
                direction="row"
                verticalAlignment="center"
            >
                <TouchFeedback paddingRight={2} paddingBottom={2} paddingTop={2} onPress={() => props.navigation.goBack()}>
                    <Feather Icon name="chevron-left" size={scaleFont(25)} color="#fff" />
                </TouchFeedback>
                <H1 fontSize={13} color={Colors.whiteBase}>
                    Plan Settings
                </H1>
            </Container>
            {
                loading ? (
                    <ActivityIndicator color={Colors.button} />
                ) : (
                    <TouchFeedback
                        onPress={()=>handleSubmit()}
                    >
                        <H1 fontSize={13} color={Colors.whiteBase}>
                            Save
                        </H1>
                    </TouchFeedback>
                )
            }
        </Container>
        {console.log("plan<<>>",plan)}
        <Container flex={1} backgroundColor={Colors.white} marginTop={2} borderTopLeftRadius={50} 
          borderTopRightRadius={50}
          paddingHorizontal={3}
        >
          <SizedBox height={3}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Container marginBottom={6} marginTop={3}>
                    <Container marginBottom={2}>
                        {console.log("plan>>",plan)}
                        <P
                            fontSize={5}
                            textAlign="center"
                        >{plan && plan.description ? plan.description : null}</P>
                        <H1
                            fontSize={15}
                            textAlign="center"
                        >&#8358;{plan && plan.amount_to_be_saved ? numeral(plan.amount_to_be_saved).format('0,0.00') : "0.00"}</H1>
                        <P
                            fontSize={5}
                            textAlign="center"
                        >by {plan && plan.end_date ? moment(plan.end_date ).format("DD MMM, YYYY") : ""}</P>
                        <SizedBox height={2}/>
                    </Container>
                    {
                        [
                            {
                                label : "Goal Name",
                                value : `${plan && plan.title ? plan.title : ""}`
                            },



                            {
                                label : "Savings Amount",
                                value : plan && plan.target_amount ? numeral(plan.target_amount).format('0,0.00') : '0.00'
                            },
                            {
                                label : "Est. Target Amount",
                                value : plan && plan.amount_to_be_saved && plan && plan.roi && 
                                (Number(plan.amount_to_be_saved) * (plan.roi/100) + Number(plan.amount_to_be_saved)) ?  
                                numeral(Number(plan.amount_to_be_saved) * (plan.roi/100) + Number(plan.amount_to_be_saved)).format('0,0.00') : 
                                plan && plan.amount_to_be_saved ? numeral(plan.amount_to_be_saved).format('0,0.00') : '0.00'
                            },
                            {
                                label : "Interest Rate",
                                value : `${plan && plan.roi ? plan.roi : 0}%`
                            },
                            {
                                label : "Maturity Date",
                                value : `${plan && plan.end_date ? moment(plan.end_date ).format("DD MMM, YYYY") : ""}`
                            },
                            {
                                label : "Frequency",
                                value : `${plan && plan.frequency ? plan.frequency : ""}`
                            },
                            {
                                label : "Auto-Save",
                                value : (<Container>
                                    <Switch 
                                    trackColor={{false: Colors.offWhite, true: Colors.offWhite}}
                                    value={plan && plan.status === "In_Progress" && user && Array.isArray(user.user_cards) && 
                                    user.user_cards.length > 0  ? true : false}
                                    thumbColor={true ? Colors.primary : Colors.offWhite}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={ async (value)=>{
                                        if(plan && plan.status === "Completed" || plan.status === "Not_Started"
                                        || (user && Array.isArray(user.user_cards) &&
                                        user.user_cards.length === 0)
                                        ) return
                                        handleAutoSave(value)
                                    }}
                                />
                                <P fontSize={5} textAlign="center">{plan && plan.status === "In_Progress" && user && Array.isArray(user.user_cards) && 
                                    user.user_cards.length > 0 ? "On" : "Off"}</P>
                                </Container>)
                            }
                        ].map((item,i)=>(
                            <TouchWrap
                                onPress={()=>{
                                    let canEdit = []
                                    if(typeD !== "goal"){
                                        canEdit = ["Savings Amount","Frequency"]
                                    }else{
                                        canEdit = ["Goal Name","Savings Amount","Maturity Date","Frequency"]
                                    }
                                    if(canEdit.includes(item.label)){
                                        setEdit(
                                            {label : item.label,
                                            value : item.value}
                                        )
                                    }
                                    canEdit.includes(item.label) ? setShow(true) : null
                                }}
                                key={i}
                            >
                                <Container direction="row"
                                    verticalAlignment="center"
                                    horizontalAlignment="space-between"
                                    paddingVertical={3}
                                    borderBottomWidth={1}
                                    borderColor={Colors.line}
                                >
                                    <H2 
                                        fontSize={8}
                                        color={Colors.otherText}
                                    >{item.label}</H2>
                                    <P fontSize={8}>{item.value}</P>
                                </Container>
                            </TouchWrap>
                        ))
                    }
                </Container>
                    <Modal visible={show}>
                        <Container 
                            backgroundColor="#0009" flex={1} horizontalAlignment="center"
                            verticalAlignment={'center'}
                        >
                            {
                                edit.label === "Maturity Date" ? <IOSDatePicker
                                    setPlaceholder={setDate}
                                    setHolder={setStart}
                                    setShow={setShow}
                                    value={start}
                                    placeholder={date}
                                    isSavings={true}
                                    setHowLong={(holder)=>{
                                        if(edit.label === "Maturity Date"){
                                            setPlan({...plan,end_date : moment(holder).format("YYYY-MM-DD")})
                                        }
                                    }}
                                /> : (
                                    <Container
                                        borderRadius={9}
                                        backgroundColor={Colors.whiteBase}
                                        widthPercent="90%"
                                        paddingHorizontal={6}
                                        paddingVertical={4}
                                    >
                                        <H2>{edit.label}</H2>
                                        <SizedBox 
                                            height={2}
                                        />
                                        <Container
                                            borderBottomWidth={1.5}
                                            borderColor={Colors.primary}
                                        >
                                            {
                                                edit.label === "Frequency" ? (
                                                    <Picker
                                                        selectedValue={edit ? edit.value : null}
                                                        onValueChange={(value)=>{
                                                            setEdit({...edit,value})
                                                        }}
                                                        mode={'dropdown'}
                                                    >
                                                        {
                                                            [   
                                                                {
                                                                    label : "Select your preference",
                                                                    value : ""
                                                                },
                                                                {
                                                                    label : "Daily",
                                                                    value : "Daily"
                                                                },
                                                                {
                                                                    label : "Weekly",
                                                                    value : "Weekly"
                                                                },
                                                                {
                                                                    label : "Monthly",
                                                                    value : "Monthly"
                                                                },
                                                                {
                                                                    label : "Just this once",
                                                                    value : "Once"
                                                                }
                                                            ].map((item,i)=>(
                                                                <Picker.Item 
                                                                    label={item.label} 
                                                                    value={item.value} 
                                                                    key={i} 
                                                                />
                                                            ))
                                                        }
                                                    </Picker>
                                                ) : (
                                                    <InputWrap 
                                                        value={edit.value}
                                                        onChangeText={(value)=>{
                                                            let val = value
                                                            if(edit.label === "Savings Amount"){
                                                                val = numeral(value).format("0,0.00")
                                                            }
                                                            setEdit({...edit,value : val})
                                                        }}
                                                        keyboardType={edit.label === "Savings Amount" ? "number-pad" : "default"}
                                                    />
                                                )
                                            }
                                        </Container>
                                        <SizedBox 
                                            height={5}
                                        />
                                        <Container direction="row"
                                            horizontalAlignment="flex-end"
                                        >
                                            <TouchWrap
                                                onPress={()=>setShow(false)}
                                            >
                                                <P
                                                    fontSize={8}
                                                    color={Colors.otherText}
                                                >Cancel</P>
                                            </TouchWrap>
                                            <SizedBox width={5} />
                                            <TouchWrap
                                                onPress={()=>{
                                                    if(edit.label === "Goal Name"){
                                                        setPlan({...plan,title : edit.value})
                                                    }
                                                    if(edit.label === "Frequency"){
                                                        let update = {...plan,frequency : edit.value}
                                                        let amount_to_be_saved = calAmtToBeSaved(update)
                                                        setPlan({...update,amount_to_be_saved : amount_to_be_saved})
                                                    }
                                                    if(edit.label === "Savings Amount"){
                                                        let update = {...plan,target_amount : numeral(edit.value).format("0")}
                                                        let amount_to_be_saved = calAmtToBeSaved(update)
                                                        setPlan({...update,amount_to_be_saved : amount_to_be_saved})
                                                    }
                                                    setShow(false)
                                                }}
                                            >
                                                <P
                                                    fontSize={8}
                                                >Ok</P>
                                            </TouchWrap>
                                        </Container>
                                    </Container>
                                )
                            }
                      </Container>
                  </Modal>
            </ScrollView>
        </Container>
      </Page>
    )
}