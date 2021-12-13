import React, { useEffect } from 'react';
import { Container,ImageWrap,Page,scaleFont,SizedBox, TouchWrap } from "@burgeon8interactive/bi-react-library";
import { H1, 
    TouchFeedback,P,H2, Button, CheckBok ,TransferMoney,
    TransferPlan,
    FundWallet,
    Warning,
    SavingsLoader,
    AddMoney,
    LottieIcon,
    BankWithdrawal
} from '../../../components/component';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../helpers/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import numeral from 'numeral';
import pulsePNG from '../../../../assets/img/pulse.png';
import stampPNG from '../../../../assets/img/stamp.png';
import failedPNG from '../../../../assets/img/failed.png';
import depositPNG from '../../../../assets/img/deposit.png';
import withdrawalPNG from '../../../../assets/img/withdrawal.png';
import moment from 'moment';
import {Modal,Text,ScrollView} from 'react-native';
import { base_ql_http, handleQuery } from '../../../helpers/api';
import { getData, storeData } from '../../../helpers/functions';
import { Retry } from '../../../components/retry';
import Empty from '../../../../assets/lottie/empty.json';
import { ToastShort } from '../../../helpers/utils';
import {useClipboard} from '@react-native-community/clipboard';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/core';
import { FONTSIZE } from '../../../helpers/constants';




export const Wallet = (props) => {
    const [show,setShow] = React.useState(false);
    const [send_plan,setSendPlan] = React.useState(false);
    const [action,setAction] = React.useState("Transfer");
    const [warning,setWarning] = React.useState(false);
    const [planD,setPlan] = React.useState(null)
    const [gql_user,setGqlUser] = React.useState(null)
    const [retry,setRetry] = React.useState(false);
    const [loading,setLoading] = React.useState(false)
    const [data, setString] = useClipboard();

    const copyToClipboard = (text) => {
        setString(text);
        ToastShort("Copied!")
    };

    const fetchData = async () => {
        try{
            setLoading(true);
            setRetry(false)
            let gql_user = await getData('gql_user');
            let gql_token = await getData('gql_token')
            console.log("gql_user>>",gql_user)
            if(!gql_user) return;
            let query = `query{
            ql_user : users(where : {id : ${gql_user.id}}){
                id
                wallet_balance
                email
                ags_nuban_number
                ags_nuban_bank
                phone
                bvn_detail{
                    id
                }
                bank_accounts{
                    id
                    bank_name
                    bank_code
                    account_name
                    account_number
                  }
                transactions(
                    limit : 10
                    sort : "created_at:desc"
                    where : {
                        _or : [{destination : "wallet"},{source : "wallet"}]
                      }
                ){
                    id
                    amount
                    destination
                    description
                    source
                    created_at
                    transaction_type
                    status
                }
              }
          } `
          console.log("query>>",query)
          let res = await handleQuery(query,gql_token);
          console.log("fetchData",res);
          let user = res && res.data && 
          res.data.ql_user && res.data.ql_user[0] ? res.data.ql_user[0]
           : null
          if(user){
            setGqlUser(user)
            storeData('gql_user',user);
          };
          setLoading(false);
        }catch(err){
          console.log("err",err)
          setRetry(true)
        }
      }
    const generateWalletAddress = async () => {
        try{
            setRetry(false)
            let gql_token = await getData('gql_token')
            let gql_user = await getData('gql_user')
            if(!gql_user || !gql_user.phone) return
            axios({
                url: `${base_ql_http}/generate/wallet/`,
                method: 'post',
                data: null,
                headers: {
                  Accept: 'application/json',
                  Authorization : `Bearer ${gql_token}`,
                },
              }).then((res)=>{
                console.log("generateWalletAddress>>",res)
                fetchData()
            }).catch(err=>{
                console.log("err>>>catch",err.response);
            })
        }catch(err){
            console.log("err||",err)
            setRetry(true)
        }
    }
    useFocusEffect(React.useCallback(()=>{
        fetchData();
    },[]))
    useEffect(()=>{
        generateWalletAddress()
    },[])
    return(
        <Page backgroundColor={Colors.primary} >
        <Container paddingHorizontal={6} paddingTop={6} backgroundColor={Colors.primary} direction="row">
            <TouchFeedback paddingRight={2} paddingBottom={2} paddingTop={2} onPress={() => props.navigation.navigate("Savings")}>
                <Feather Icon name="chevron-left" size={scaleFont(25)} color="#fff" />
            </TouchFeedback>
          <Container backgroundColor={Colors.primary} paddingHorizontal={6} 
              paddingTop={0.5} paddingBottom={3}
              widthPercent="80%"
              horizontalAlignment="center"
          >
              <H1 fontSize={18} color={Colors.whiteBase}>
                  Wallet
              </H1>
          </Container>
        </Container>
        <Container flex={1} backgroundColor={Colors.white} marginTop={2} borderTopLeftRadius={50} 
          borderTopRightRadius={50}
          paddingHorizontal={3}
        >
          <SizedBox height={5}/>
          <ScrollView showsVerticalScrollIndicator={false}>
            {
                loading ? (
                    <SavingsLoader />
                ) : (
                    <Container>
                        <Container
                            backgroundColor={Colors.lightYellow}
                            borderTopLeftRadius={10}
                            borderTopRightRadius={10}
                            paddingHorizontal={5}
                            paddingVertical={5}
                            direction="row"
                            horizontalAlignment="space-between"
                        >
                            <Container widthPercent="80%">
                                <P>Wallet Balance</P>
                                <H1 fontSize={FONTSIZE.big}>
                                    &#8358;{gql_user && gql_user.wallet_balance ? numeral(gql_user.wallet_balance).format('0,0.00') 
                                    : '0.00'}
                                </H1>
                                <P fontSize={FONTSIZE.small}>{`Your wallet account with Providus Bank works like a regular bank account number. You can do all banking activities such as transfer from any source to ${gql_user && gql_user.ags_nuban_number ? gql_user && gql_user.ags_nuban_number : null} here. Select Providus Bank as the destination bank.`}</P>
                            </Container>
                            <Container width="10%" 
                                horizontalAlignment="flex-end"
                            >
                                <ImageWrap 
                                    fit={'contain'}
                                    width={7}
                                    height={2}
                                    source={pulsePNG}
                                />
                            </Container>
                        </Container>
                        <TouchFeedback
                            onPress={()=>copyToClipboard(gql_user && gql_user.ags_nuban_number ? 
                                gql_user.ags_nuban_number : "")}
                        >
                            <Container backgroundColor={Colors.savingYellow}
                                horizontalAlignment="space-between"
                                direction="row"
                                paddingVertical={2}
                                borderBottomLeftRadius={10}
                                borderBottomRightRadius={10}
                                paddingHorizontal={5}
                            >
                                <Container>
                                    <H2 fontSize={8}>{gql_user && gql_user.ags_nuban_number && gql_user.ags_nuban_bank ? 
                                        `${gql_user.ags_nuban_number} / ${gql_user.ags_nuban_bank}` : ""
                                    }</H2>
                                </Container>
                                <Container width="10%" horizontalAlignment="flex-end"
                                    paddingRight={0}
                                >
                                    <ImageWrap 
                                        flex={1}
                                        fit={'contain'}
                                        width={10}
                                        source={stampPNG}
                                    />
                                </Container>
                            </Container>
                        </TouchFeedback>
    
                        <Container 
                            direction="row" 
                            marginTop={2}
                            horizontalAlignment="space-between"
                            paddingVertical={3}
                            borderBottomWidth={0.5}
                            borderColor={Colors.line}
                        >
                            <Button 
                                title={'Transfer Money'}
                                backgroundColor={Colors.whiteBase}
                                borderColor={gql_user && gql_user.wallet_balance && 
                                    gql_user.wallet_balance > 0 ? Colors.primary : Colors.lightGrey}
                                color={gql_user && gql_user.wallet_balance && 
                                    gql_user.wallet_balance > 0 ? Colors.primary : Colors.lightGrey}
                                widthPercent={'48%'}
                                borderRadius={5}
                                onPress={()=>{
                                    if(!gql_user || !gql_user.wallet_balance || 
                                        gql_user.wallet_balance < 1){
                                            return;
                                        }
                                    setAction("Transfer")
                                    setShow(true)
                                }}
                                fontSize={8}
                            />
                            <Button 
                                title={'Fund Wallet'}
                                backgroundColor={Colors.primary}
                                borderColor={Colors.primary}
                                color={Colors.whiteBase}
                                widthPercent={'48%'}
                                borderRadius={5}
                                onPress={()=>{
                                    setAction("Fund")
                                    setShow(true)
                                }}
                                fontSize={8}
                            />
                        </Container>
                        <Container marginTop={10}
                            horizontalAlignment="space-between"
                            direction="row"
                            paddingBottom={2}
                            borderBottomWidth={0.7}
                            borderColor={Colors.line}
                        >
                            <Container>
                                <H2>Recent Transactions</H2>
                                <P fontSize={FONTSIZE.small}>You can view all your transaction history here</P>
                            </Container>
                            <TouchFeedback onPress={()=>{
                                props.navigation.navigate('Transactions',{type:'Wallet',id : "Wallet"})
                            }}>
                                <P color={Colors.primary}
                                    fontSize={8}
                                >View All</P>
                            </TouchFeedback>
                        </Container>
                        <Container marginBottom={6} marginTop={3}>
                        {
                            gql_user && gql_user.transactions && Array.isArray(gql_user.transactions) && gql_user.transactions.length > 0 ? 
                             gql_user.transactions.
                             map((item,index)=>(
                                    <TouchFeedback 
                                        key={index}
                                        onPress={()=>{
                                            let data = {
                                                type : item.transaction_type,
                                                title : item.description,
                                                text : item.destination,
                                                amount : item.amount,
                                                date : item.created_at,
                                                source : item.source,
                                                status : item.status,
                                                back_to_wallet : false
                                            }
                                            props.navigation.navigate("TransactionDetails",{
                                                transaction : data
                                            })
                                        }}
                                    >
                                        <Container direction="row"
                                            verticalAlignment="center"
                                        >
                                            <Container height={10} widthPercent="13%">
                                                <ImageWrap 
                                                    flex={1}
                                                    width={10}
                                                    fit={'contain'}
                                                    source={
                                                        item && item.status && item.status !== 'FAILED' && 
                                                        item.transaction_type === "funding" ? 
                                                        depositPNG : item && item.status && item.status !== 'FAILED' && 
                                                        item.transaction_type === "withdraw" ? withdrawalPNG : 
                                                        failedPNG
                                                    }
                                                />
                                            </Container>
                                            <Container verticalAlignment="center"
                                                widthPercent="60%"
                                                paddingRight={5}
                                            >
                                                <H2 fontSize={8}>{item.destination ? item.description : ""}</H2>
                                                <P fontSize={5}
                                                    color={Colors.otherText}
                                                >{item.destination ? item.destination : ""}</P>
                                            </Container>
                                            <Container widthPercent="27%">
                                                <H1 fontSize={9}
                                                    numberOfLines={1}
                                                >&#8358;{item.amount ? 
                                                     numeral(item.amount).format('0,0.00') : '0.00'
                                                }</H1>
                                                <P fontSize={5}>
                                                    {item.created_at ? moment(item.created_at).format('ddd DD MMM, YYYY') : ""}
                                                </P>
                                            </Container>
                                        </Container>
                                    </TouchFeedback>
                            )) 
                            
                            : (
                                <Container horizontalAlignment="center">
                                    <LottieIcon icon={Empty} />
                                </Container>
                            )
                        }
                        </Container>
                        
                        <Modal visible={show}>
                            <Container 
                            backgroundColor="#0009" flex={1} horizontalAlignment="center"
                                verticalAlignment={warning ? "flex-start" : "flex-end"}
                            >
                                {
                                    action === "TransferPlan" && !warning ? (
                                        <TransferPlan 
                                            setSendPlan={setSendPlan} 
                                            setShow={setShow}
                                            setWarning={setWarning}
                                            type={null}
                                            target_amt={planD ? planD.target_amount : 0}
                                            hide_wallet_option={true}
                                            reload={fetchData}
                                        />
                                    ) : null
                                }
                                {
                                    action === "BankWithdrawal" && !warning ? (
                                        <BankWithdrawal 
                                            setShow={setShow}
                                            gql_user={gql_user}
                                        />
                                    ) : null
                                }

                                {
                                action === "AddMoney" && !warning ? (
                                    <AddMoney 
                                        setSendPlan={setSendPlan} 
                                        setShow={setShow}
                                        setWarning={setWarning}
                                        type={null}
                                        target_amt={planD ? planD.target_amount : 0}
                                        hide_wallet_option={true}
                                        reload={fetchData}
                                    />
                                ) : null
                            }
                                {
                                    action === "Transfer" && !warning ? (
                                        <TransferMoney 
                                            setSendPlan={setSendPlan} 
                                            setShow={setShow}
                                            setAction={setAction}
                                            gql_user={gql_user}
                                        />
                                    ) : null
                                }
                                {
                                    action === "Fund" && !warning ? (
                                        <FundWallet 
                                            setSendPlan={setSendPlan} 
                                            setShow={setShow}
                                            setWarning={setWarning}
                                            setAction={setAction}
                                            gql_user={gql_user}
                                        />
                                    ) : null
                                }
                                {
                                    warning ? (
                                        <Warning setWarning={setWarning} />
                                    ) : null
                                }
                            </Container>
                        </Modal>
                    </Container>
                )
            }
          </ScrollView>
        </Container>
        {
            retry ? (
                <Retry funcCall={fetchData} param={[]} />
            ) : null
        }
        {console.log("wallet---rerenders")}
      </Page>
    )
}