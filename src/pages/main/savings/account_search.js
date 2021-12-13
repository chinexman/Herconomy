import React, { useEffect } from 'react';
import { Avatar, Container,ImageWrap,InputWrap,Page,scaleFont,SizedBox, TouchWrap } from "@burgeon8interactive/bi-react-library";
import { H1, TouchFeedback,P,H2, Button, CheckBok ,TransferMoney,
    TransferPlan,
    FundWallet,
    Warning,
    Label,
    LottieIcon,ConfirmWithdrawal
} from '../../../components/component';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../helpers/colors';
import Load from '../../../../assets/lottie/load.json'
import Load1 from '../../../../assets/lottie/load1.json'
import { apiFunctions, base_ql_http, handleQuery } from '../../../helpers/api';
import { useStoreState } from 'easy-peasy';
import { Retry } from '../../../components/retry';
import { ScrollView } from 'react-native-gesture-handler';
import { ToastLong, ToastShort } from '../../../helpers/utils';
import numeral from 'numeral';
import { getData } from '../../../helpers/functions';
import { Modal } from 'react-native';
import axios from 'axios';

export const AccountSearch = (props) => {
    const [transaction,setTransaction] = React.useState(null)
    const {token} = useStoreState((state)=>({
        token : state.userDetails.token
    }))
    const [step,setStep] = React.useState('1')
    const [retry,setRetry] = React.useState(false);
    const [data,setData] = React.useState(null);
    const [loading,setLoading] = React.useState(false)
    const [check,setCheck] = React.useState(true);
    const [action,setAction] = React.useState("");
    const [show,setShow] = React.useState(false);
    const [setting,setSetting] = React.useState(null)
    const getTransaction = async () => {
        try{
            let gql_token = await getData('gql_token')
            let gql_user = await getData('gql_user');
            setRetry(false);
            let que = `query{
                generalSetting{
                    withdraw_charges
                    minimum_withdraw
                }
            }`
            let gen = await handleQuery(que,gql_token);
            gen && gen.data && gen.data.generalSetting ? setSetting(gen.data.generalSetting) : null;
            let {bank} = props.route.params;
            bank.is_new ? setCheck(true) : setCheck(false);
            let fd = {
                bank_code : bank.bank_code,
                accountNumber : bank.account_number
            }
            //let res = await apiFunctions.getAccountName(token,fd);
            let res = await axios.post(`${base_ql_http}/get_bank_details`,fd,{
                headers : {
                    Authorization : `Bearer ${gql_token}`
                }
            });
            setData({
                account_number : res.data.accountNumber,
                account_name : res.data.accountName,
                amount : bank.amount,
                bank_name : bank.bank_name,
                bank_id : bank.id
            })
            let q1 = `query{
                bankAccounts(where : {
                  account_number : "${res.data.accountNumber}",
                  user_id : "${gql_user.id}"
                }){
                  id
                  account_number
                }
              }`
              let resq1  = await handleQuery(q1,gql_token)
              let is_found  = false;
              if(resq1 && resq1.data && resq1.data.bankAccounts 
                    && Array.isArray(resq1.data.bankAccounts) && resq1.data.bankAccounts.length > 0
                ){
                    is_found = true;
                    setData({
                        account_number : res.data.accountNumber,
                        account_name : res.data.accountName,
                        amount : bank.amount,
                        bank_name : bank.bank_name,
                        bank_id : resq1.data.bankAccounts[0].id
                    })
                }
               if(bank.is_new && !is_found){
                console.log("CREATING----")
                let query = `mutation{
                    createBankAccount(input :{
                        data : {
                            bank_name : "${bank.bank_name}",
                            bank_code : "${bank.bank_code}",
                            account_name : "${res.data.accountName}",
                            account_number : "${bank.account_number}"
                            user_id : "${gql_user.id}"
                        }
                    }){
                        bankAccount{
                            id
                            bank_name
                        }
                    }
                }`
                let resD = await handleQuery(query,gql_token)
                resD && resD.data && resD.data.createBankAccount && 
                resD.data.createBankAccount.bankAccount && resD.data.createBankAccount.bankAccount.id  ? setData({
                    account_number : res.data.accountNumber,
                    account_name : res.data.accountName,
                    amount : bank.amount,
                    bank_name : bank.bank_name,
                    bank_id : resD.data.createBankAccount.bankAccount.id
                }) : null
            }
            setStep('2');
        }catch(err){
            console.log("err",err)
            setRetry(true)
            let msg = err && err.msg && typeof(err.msg) == "string" ? err.msg : 'This should not happen. Please try again.'
            ToastLong(msg);
            return props.navigation.goBack()
        }
    }

    const processWithdrawal = () => {
        try{
            setLoading(true)
            props.navigation.navigate('TransactionDetails',{
                transaction : {
                    type : 'deposit',
                    title : 'Deposit Made from',
                    text : '(James Martins) ACCESS BANK',
                    amount : 100000,
                    date : '10/05/2020'
                }
            })
        }catch(err){
            ToastShort("This should not happen. Please try again.")
            setLoading(false)
        }
    }

    useEffect(()=>{
        getTransaction()
    },[])
    return(
        <Page 
            backgroundColor={Colors.white} 
            barIconColor={'dark'}
        >
           {
               step == '2' ? (
                <Container paddingHorizontal={6} 
                    paddingTop={6} 
                    backgroundColor={Colors.white} 
                    direction="row"
                    verticalAlignment="center"
                >
                    <TouchFeedback paddingRight={2} paddingBottom={2} paddingTop={2} onPress={() => props.navigation.goBack()}>
                        <Feather Icon name="chevron-left" size={scaleFont(25)} color={Colors.black} />
                    </TouchFeedback>
                    <Container widthPercent="80%"
                        horizontalAlignment="center"
                    >
                        <H1 fontSize={13} color={Colors.black}>
                            Transfer to Bank
                        </H1>
                    </Container>
                </Container>
               ) : null
           }
        <Container flex={1} backgroundColor={Colors.white} 
            marginTop={step == '2' ? 2 : 0} 
        >
            {
                step !== '2' ? (
                    <Container horizontalAlignment="center"
                        paddingHorizontal={3}
                        verticalAlignment="center"
                        horizontalAlignment="center"
                        flex={1}
                    >
                        <LottieIcon icon={Load} size={200}/>
                        <H2 fontSize={13}>{check ? 'LOOKING FOR ACCOUNT' : "PROCESSING"}</H2>
                    </Container>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Container marginTop={5}
                            verticalAlignment="center"
                            horizontalAlignment="center"
                        >
                            <H2>{data && data.account_name ? data.account_name : ''}</H2>
                            <Container direction="row" marginTop={3}
                                verticalAlignment="center"
                            >
                                <P fontSize={8}>{data && data.bank_name ? data.bank_name : ""}</P>
                                <SizedBox width={1}/>
                                <Avatar 
                                    size={2}
                                    backgroundColor={Colors.savingGrey}
                                />
                                <SizedBox width={1.5}/>
                                <H2 fontSize={8}>{data && data.account_number ? data.account_number : ''}</H2>
                            </Container>
                        </Container>
                        <Container direction="row"
                            marginTop={8}
                            verticalAlignment="center"
                            horizontalAlignment="space-between"
                            paddingVertical={3}
                            borderBottomWidth={1}
                            borderColor={Colors.line}
                            borderTopWidth={1}
                            paddingHorizontal={6}
                        >
                            <H2 
                                fontSize={8}
                            >Amount to transfer</H2>
                            <H1>&#8358;{data && data.amount ? numeral(data.amount).format('0,0.00') : '0.00'}</H1>
                        </Container>
                        <Container 
                            paddingVertical={3}
                            paddingHorizontal={6}
                            horizontalAlignment="center"
                        >
                            <P fontSize={8}
                            >N{setting && setting.withdraw_charges} Processing fee will be deducted from the amount withdrawn.</P>
                        </Container>
                        {/* <Container 
                            paddingVertical={3}
                            paddingHorizontal={6}
                            horizontalAlignment="center"
                        >
                            <P fontSize={8}
                            >Withdrawals are subject to approval from our fraud system and can take up to 24 hours.</P>
                        </Container> */}
                        <Container
                            horizontalAlignment="center"
                            marginTop={5}
                            paddingHorizontal={6}
                        >
                            <Button title="Confirm"
                                backgroundColor={Colors.primary}
                                borderColor={Colors.primary}
                                borderRadius={5}
                                fontSize={8}
                                onPress={()=>{
                                    setAction("Confirm")
                                    setShow(true)
                                }}
                            />
                        </Container>


                        <Modal visible={show}>
                            <Container 
                                backgroundColor="#0009" flex={1} horizontalAlignment="center"
                                    verticalAlignment={"flex-end"}
                                >
                                    {console.log("data>>",data)}
                               
                                {
                                    action === "Confirm" ? (
                                        <ConfirmWithdrawal 
                                            setShow={setShow}
                                            reload={null}
                                            data={data}
                                        />
                                    ) : null
                                }
                            </Container>
                        </Modal>

                    </ScrollView>
                )
            }
        </Container>
      </Page>
    )
}