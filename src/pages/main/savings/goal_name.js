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
import { ScrollView } from 'react-native-gesture-handler';
import numeral from 'numeral';
import { Picker } from '@react-native-picker/picker';
import { IOSDatePicker } from '../../../components/ios_date_picker';
import {Modal} from 'react-native';
import { Alert } from 'react-native';
import moment from 'moment';
import { getData } from '../../../helpers/functions';
import { handleQuery } from '../../../helpers/api';
import { Retry } from '../../../components/retry';
import { FONTSIZE } from '../../../helpers/constants';

const StepOne = ({setStep,goal,setGoal,type}) => (
    <Container marginTop={7}>
        <Label name="What are you saving for?" />
        <P fontSize={FONTSIZE.small}>Tap here and enter a goal title</P>
        <SizedBox height={1} />
        <Container marginBottom={3}>
            {console.log("goal???",goal)}
            {
                type ? (
                    <Container
                        backgroundColor={Colors.lightYellow}
                        borderColor={Colors.primary}
                        borderWidth={0.8}
                        borderRadius={5}
                        paddingHorizontal={2}
                        paddingVertical={2}
                        textAlignVertical="center"
                        value={goal ? goal.name : null}
                    >
                        <P fontSize={8}>{goal ? goal.name : null}</P>
                    </Container>
                ) : (
                    <InputWrap
                        backgroundColor={Colors.lightYellow}
                        borderColor={Colors.primary}
                        borderWidth={0.8}
                        borderRadius={5}
                        paddingHorizontal={2}
                        placeholder={'Give it a name e.g Vacation, Land Purchase'}
                        textPaddingHorizontal={2}
                        height={7}
                        inputStyle={{
                            fontSize : 13
                        }}
                        textAlignVertical="center"
                        value={goal ? goal.name : null}
                        editable={type ? false : true}
                        onChangeText={(value)=>setGoal({...goal,name : value})}
                    />
                )
            }
        </Container>
       {
           !type ? (
            <Container>
                <Label name="Select a category"/>
                <P fontSize={FONTSIZE.small}>Pick relevant category for your goal</P>
                <SizedBox height={1} />
                <Container
                    backgroundColor={Colors.lightYellow}
                    borderColor={Colors.primary}
                    borderWidth={0.8}
                    borderRadius={5}
                    paddingHorizontal={2}
                >
                    <Picker
                        selectedValue={goal ? goal.reason : null}
                        onValueChange={(value)=>{
                            setGoal({...goal,reason : value})
                        }}
                        mode={'dropdown'}
                    >
                        {
                            [   
                                {
                                    label  : "Select a reason",
                                    value : ""
                                },
                                {
                                    label  : "Investment",
                                    value : "Investment"
                                },
                                {
                                    label  : "Rent",
                                    value : "Rent"
                                },
                                {label  : "Vacation",
                                    value : "Vacation"},
                                {label  : "Car",
                                value : "Car"},
                                {label  : "Fees or Debt",
                                value : "Fees or Debt"},

                                {label  : "Education",
                                value : "Education"},
                                {label  : "Starting / Growing a Business",
                                value : "Starting / Growing a Business"},
                                {label  : "Gadgets",
                                value : "Gadgets"},

                                {label  : "Others",
                                value : "Others"},
                            ].map((item,i)=>(
                                <Picker.Item 
                                    label={item.label} 
                                    value={item.value} 
                                    key={i}
                                />
                            ))
                        }
                    </Picker>
                </Container>
            </Container>
           ) : null
       }
    </Container>
)

const StepTwo = ({setStep,setGoal,goal}) => (
    <Container marginTop={7}>
        <Label name="What amount would you like to start with?" />
        {console.log("goal",goal)}
        <P color={Colors.otherText}
                    fontSize={5}
                >You can always update this target amount later.</P>
        <SizedBox height={3} />
        <Container marginBottom={3}>
            <InputWrap
                icon={<H1>&#8358;</H1>}
                backgroundColor={Colors.lightYellow}
                borderColor={Colors.primary}
                borderWidth={0.8}
                borderRadius={5}
                paddingHorizontal={2}
                placeholder={'Enter any amount'}
                inputStyle={{
                    fontSize : 18,
                    fontWeight : 'bold'
                }}
                textAlignVertical="center"
                //textPaddingHorizontal={2}
                height={7}
                keyboardType={'number-pad'}
                onChangeText={(value)=>setGoal({...goal, amount : Number(numeral(value).format("0"))})}
                value={goal.amount ? numeral(goal.amount).format('0,0') : ""}
            />
        </Container>
        <P fontSize={FONTSIZE.small}>You can get started with any of these custom amount:</P>
        <Container direction="row" wrap="wrap" marginTop={1}>
            {
                [5000,10000,15000,20000,50000,].map((item,i)=>(
                    <TouchFeedback key={i}
                        onPress={()=>{
                            console.log("pressong",item,goal);
                            setGoal({...goal, amount : item})
                        }}
                    >
                        <Container 
                            marginRight={3}
                            backgroundColor={Colors.savingYellow}
                            paddingVertical={1}
                            paddingHorizontal={3}
                            borderRadius={10}
                            marginBottom={2}
                        >
                            <P
                                color={Colors.primary}
                                fontSize={8}
                            >&#8358;{numeral(item).format('0,0.00')}</P>
                        </Container>
                    </TouchFeedback>
                ))
            }
        </Container>
    </Container>
)

const StepThree = ({setStep,goal,setGoal,setCustom,custom,type}) => {
    const [selected,setSelected] = React.useState("select")
    const [show,setShow] = React.useState(false);
    const [date,setDate] = React.useState(new Date())
    const [start,setStart] = React.useState(new Date())
    const [balance,setBalance] = React.useState(0);
    const setHowLong = (holder) => {
        setCustom(holder);
        setSelected("select")
    }
    const getBalance = async () => {
        let q_user = await getData('gql_user');
        console.log("q_user>",q_user)
        q_user && q_user.wallet_balance ? setBalance(q_user.wallet_balance) : null;
    }
    useEffect(()=>{
        getBalance()
    },[])
    return(
        <React.Fragment>
                            <Container marginTop={8}>
                    {
                        selected === "Let me choose" ? (
                                <Container>
                                    <Container direction="row" verticalAlignment="center"
                                        horizontalAlignment="space-between"
                                    >
                                        <Label name="How long do you want to save for?"/>
                                        <TouchFeedback onPress={()=>{
                                            setSelected("select")
                                            setGoal({...goal,how_long : ""})
                                        }}>
                                            <P fontSize={5}>Back</P>
                                        </TouchFeedback>
                                    </Container>
                                    <SizedBox height={1} />

                                    <TouchFeedback
                                onPress={()=>{
                                    setShow(true)
                                }}
                            >
                                    <Container
                                        backgroundColor={Colors.lightYellow}
                                        borderColor={Colors.primary}
                                        borderWidth={0.8}
                                        borderRadius={5}
                                        paddingHorizontal={3}
                                        paddingVertical={2}
                                        direction="row"
                                        horizontalAlignment="space-between"
                                        verticalAlignment="center"
                                    >
                                        <P fontSize={8}>{moment(date).format('DD MMM YYYY')}</P>
                                        <Feather name="calendar" size={scaleFont(20)}
                                            color={Colors.greyBase300}
                                        />
                                    </Container>
                                    </TouchFeedback>
                                    <SizedBox height={3} />
                                    <P fontSize={8}
                                        textAlign={'center'}
                                    >Minimum duration for goals is 3 months</P>
                                </Container>
                            
                        ) : (
                            <React.Fragment>
                                {
                                   !type ? (
                                        <Container>
                                            <Label name="How long do you want to save for?"/>
                                            <P fontSize={FONTSIZE.small}>You can select how long you want to save for here</P>
                                            <SizedBox height={1} />
                                            <Container
                                                backgroundColor={Colors.lightYellow}
                                                borderColor={Colors.primary}
                                                borderWidth={0.8}
                                                borderRadius={5}
                                                paddingHorizontal={2}
                                            >
                                                <Picker
                                                    selectedValue={goal ? goal.how_long : null}
                                                    onValueChange={(value)=>{
                                                        if(value === "Let me choose"){
                                                            setGoal({...goal,how_long : value})
                                                            return setSelected(value)
                                                        }
                                                        setGoal({...goal,how_long : value})
                                                        setCustom(null)
                                                    }}
                                                    mode={'dropdown'}
                                                >
                                                    {
                                                        [   
                                                            {
                                                                label :  "Select your preference",
                                                                value : ""
                                                            },
                                                            {
                                                                label :  "3 months",
                                                                value : "3 months"
                                                            },
                                                            {
                                                                label :  "6 months",
                                                                value : "6 months"
                                                            },
                                                            {
                                                                label :  "12 months",
                                                                value : "12 months"
                                                            },
                                                            {
                                                                label :  "Let me choose",
                                                                value : "Let me choose"
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
                                            </Container>
                                        </Container>
                                   ) : (
                                        <Container>
                                            <Label name="Source of funding"/>
                                            <SizedBox height={1} />
                                            <Container
                                                backgroundColor={Colors.lightYellow}
                                                borderColor={Colors.primary}
                                                borderWidth={0.8}
                                                borderRadius={5}
                                                paddingHorizontal={2}
                                            >
                                                <Picker
                                                    selectedValue={goal ? goal.source : null}
                                                    onValueChange={(value)=>{
                                                        setGoal({...goal,source : value,later : false})
                                                        setCustom(null)
                                                    }}
                                                    mode={'dropdown'}
                                                >
                                                    {
                                                        [   
                                                        {
                                                            label :  "Select your funding method",
                                                            value : ""
                                                        },
                                                        {
                                                            label :  "Use Bank Card",
                                                            value : "bank card"
                                                            },
                                                            {
                                                                label :  "Use Herconomy Card",
                                                                value : "gold card"
                                                            },
                                                            {
                                                                label :  `Use Herconomy Wallet (${numeral(balance).format('0,0.00')})`,
                                                                value : "wallet"
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
                                            </Container>
                                        </Container>
                                   )
                               }
                               <SizedBox height={1} />
                              {
                                  custom ? (
                                    <H1 fontSize={5}>
                                        Date Selected  : {moment(custom).format('DD MMM YYYY')}
                                    </H1>
                                  ) : null
                              }
                               <SizedBox height={3} />


                                <Container marginBottom={5}>
                                    <Label name="How often?"/>
                                    <P fontSize={FONTSIZE.small}>You can select how often your goal should be funded</P>
                                    <SizedBox height={1} />
                                    <Container
                                        backgroundColor={Colors.lightYellow}
                                        borderColor={Colors.primary}
                                        borderWidth={0.8}
                                        borderRadius={5}
                                        paddingHorizontal={2}
                                    >
                                        <Picker
                                             selectedValue={goal ? goal.how_often : null}
                                             onValueChange={(value)=>{
                                                 setGoal({...goal,how_often : value})
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
                                    </Container>
                                    <SizedBox height={1} />
                                    <P fontSize={5}>You can always update your preference later</P>
                               </Container>
                            </React.Fragment>
                        )
                    }
                    
                </Container>
                <Modal visible={show}>
                    <Container backgroundColor="#0000" flex={1} verticalAlignment="center">
                        <IOSDatePicker
                            setPlaceholder={setDate}
                            setHolder={setStart}
                            setShow={setShow}
                            value={start}
                            placeholder={date}
                            isSavings={true}
                            setHowLong={setHowLong}
                        />
                    </Container>
                </Modal>
        </React.Fragment>
    )
}


export const GoalName = (props) => {
    const [step,setStep] = React.useState("one")
    const [custom,setCustom] = React.useState("");
    const [show,setShow] = React.useState(false);
    const [warning,setWarning] = React.useState(false);
    const [retry,setRetry] = React.useState(false)
    const [goal,setGoal] = React.useState({
        name : "",
        reason : "",
        amount : "",
        how_often : "",
        how_long : "",
        source : "",
        later : false
    });
    const {type,item} = props.route && props.route.params ? props.route.params : 
        {type :null, item : null};
    const fetchData = async () => {
        try{
            const {type,item} = props.route && props.route.params ? props.route.params : 
            {type :null, item : null}
            let q_user = await getData('gql_user');
            let balance = q_user && q_user.wallet_balance ? q_user.wallet_balance : null;
            setRetry(false);
            let query = `query{
                        generalSetting{
                        before_end_withdraw
                        goal_roi
                        withdraw_condition
                    }
                }`
                  let gql_token = await getData('gql_token')
                  let res = await handleQuery(query,gql_token)
            type ? setGoal({...goal,name : item.title,
                reason : item.description,
                balance
            }) : setGoal({
                ...goal,withdraw_condition : res && res.data && res.data.generalSetting &&
                res.data.generalSetting.withdraw_condition
                ? res.data.generalSetting.withdraw_condition : "",
                roi : res && res.data && res.data.generalSetting && res.data.generalSetting.goal_roi ? 
                res.data.generalSetting.goal_roi : 0
            })
        }catch(err){
            console.log("errr",err)
            setRetry(true)
        }
    }
    useEffect(()=>{
        fetchData()
    },[])
    const handleSubmit = () => {
        try{
            if(step == "one" && (goal.name.trim() === "" || goal.reason === "")){
                return Alert.alert("Herconomy","Please all fields are required")
            }
            if(step == "two" && (goal.amount.toString().trim() === "")){
                return Alert.alert("Herconomy","Please all fields are required")
            }
            if(step == "three" && !type &&(goal.how_long.trim() === "" || 
                (goal.how_long.trim() === "Let me choose" && !custom) ||
                (goal.how_often.trim() === "")
            )){
                return Alert.alert("Herconomy","Please all fields are required")
            }
            if(step == "three" && type && (!goal.source || goal.source.trim() === "" ||
                (goal.how_often.trim() === "")
            )){
                return Alert.alert("Herconomy","Please all fields are required")
            }
            if(step === "one"){
                return setStep("two")
            }
            if(step === "two"){
                return setStep("three")
            }
            if(!goal.later && goal.source === "bank card") return setShow(true);
            if(!goal.later && goal.source === "gold card") return setShow(true);
            if(goal.source === "wallet" && (!goal.balance || goal.balance < goal.amount)){
                return Alert.alert("Herconomy","Insufficient amount in wallet.")
            }
            console.log("goal",goal)
            if(type){
                let challenge = {
                    ...goal,
                    withdraw_condition : item.withdraw_condition,
                    roi : item.roi,
                    how_long : item.maturity_date,
                    start_date : item.start_date,
                    challenge_id : item.id
                }
                return props.navigation.navigate('ReviewPlan',{
                    plan : challenge, custom,type : "challenge"
                })
            }
            props.navigation.navigate('ReviewPlan',{
                plan : goal, custom
            })
        }catch(err){
            console.log("err",err)
        }
    }

    return(
        <Page backgroundColor={Colors.primary} >
        <Container paddingHorizontal={6} paddingTop={6} backgroundColor={Colors.primary} direction="row">
            <TouchFeedback paddingRight={2} paddingBottom={2} paddingTop={2} onPress={() => {
                if(step === "two") return setStep("one")
                if(step === "three") return setStep("two")
                props.navigation.goBack()
            }}>
                <Feather Icon name="chevron-left" size={scaleFont(25)} color="#fff" />
            </TouchFeedback>
          <Container backgroundColor={Colors.primary} paddingHorizontal={6} 
              paddingTop={0.5} paddingBottom={3}
              widthPercent="90%"
              horizontalAlignment="center"
          >
              <H1 fontSize={18} color={Colors.whiteBase}>
                  {!type ? 'Goal Name' : item.title}
              </H1>
          </Container>
        </Container>
        
        <Container flex={1} backgroundColor={Colors.white} marginTop={2} borderTopLeftRadius={50} 
          borderTopRightRadius={50}
          paddingHorizontal={3}
        >
          <SizedBox height={3}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Container marginBottom={6} marginTop={3}>
                    <H2 fontSize={8}>{
                        step === "one" ? "Question 1 of 3" :
                        step === "two" ? "Question 2 of 3" :
                        "Question 3 of 3"
                    }</H2>
                    <Container 
                        widthPercent="100%"
                        verticalAlignment="center"
                        marginTop={2}
                    >
                        <Container backgroundColor={Colors.lightGrey} 
                            height={1.5}
                            borderRadius={5}
                        >
                            <Container 
                                height={1.5}
                                borderRadius={5}
                                backgroundColor={Colors.primary}
                                widthPercent={
                                    step === "one" ? `33.3%` : 
                                    step === "two" ? `66.6%` : 
                                    `100%` 
                                }
                            />
                        </Container>
                    </Container>
                   {
                       step === "one" ? (
                        <StepOne setStep={setStep} setGoal={setGoal} goal={goal} type={type} />
                       ) : step === "two" ? (
                        <StepTwo setStep={setStep} setGoal={setGoal} goal={goal}/>
                       ) : (
                           <StepThree setStep={setStep} setGoal={setGoal} goal={goal}
                            setCustom={setCustom}
                            custom={custom}
                            type={type}
                        />
                       )
                   }
                </Container>
            </ScrollView>
            <Modal visible={show}>
                <Container 
                    backgroundColor="#0009" flex={1} horizontalAlignment={"center"}
                    verticalAlignment={"center"}
                >
                   <Container widthPercent="80%"
                        backgroundColor={Colors.whiteBase}
                        paddingVertical={8}
                        paddingHorizontal={10}
                        borderRadius={5}
                    >
                        <H1 fontSize={8}>Do you want to fund this plan now?</H1>
                        <SizedBox height={2} />
                        <Button title={'Yes'} borderRadius={5} backgroundColor={Colors.primary}
                            borderColor={Colors.primary}
                            onPress={()=>{
                                setShow(false)
                                let challenge = {
                                    ...goal,
                                    withdraw_condition : item.withdraw_condition,
                                    roi : item.roi,
                                    how_long : item.maturity_date,
                                    start_date : item.start_date,
                                    challenge_id : item.id
                                }
                                console.log("challenge",challenge)
                                return props.navigation.navigate('ReviewPlan',{
                                    plan : challenge, custom,type : "challenge"
                                })
                            }}
                        />
                        <SizedBox height={2}/>
                        <Button title={'Later'} borderRadius={5} backgroundColor={Colors.whiteBase}
                            borderColor={Colors.primary}
                            color={Colors.fadedText}
                            onPress={()=>{
                                setShow(false)
                                setGoal({...goal,later : true})
                            }}
                        />
                    </Container>
                </Container>
            </Modal>
            <Container marginBottom={3}>
                <Button title="Continue"
                    backgroundColor={Colors.primary}
                    borderColor={Colors.primary}
                    borderRadius={5}
                    onPress={()=>handleSubmit()}
                    fontSize={8}
                />
            </Container>
        </Container>
        {
           retry ? (
            <Retry funcCall={fetchData} param={[]} />
           ) : null
       }
      </Page>
    )
}