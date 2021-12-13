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
import { ActivityIndicator, Modal } from 'react-native';
import moment from 'moment';
import pulsePNG from '../../../../assets/img/pulse.png';
import stampPNG from '../../../../assets/img/stamp.png';
import failedPNG from '../../../../assets/img/failed.png';
import depositPNG from '../../../../assets/img/deposit.png';
import withdrawalPNG from '../../../../assets/img/withdrawal.png';

export const TransactionDetails = (props) => {
    const [transaction,setTransaction] = React.useState(null)

    const getTransaction = async () => {
        const {transaction} = props.route.params;
       setTransaction(transaction);
    }
    useEffect(()=>{
        getTransaction()
    },[])
    return(
        <Page 
            backgroundColor={Colors.white} 
            barIconColor={'dark'}
        >
            <Container
                paddingTop={6} 
                backgroundColor={Colors.white} 
                direction="row"
                verticalAlignment="center"
            >
                <TouchFeedback paddingRight={2} paddingBottom={2} paddingTop={2} onPress={() => {
                    transaction.back_to_wallet  === false ? props.navigation.goBack() : props.navigation.navigate('Wallet')
                }}>
                    <Feather Icon name="chevron-left" size={scaleFont(25)} color={Colors.black} />
                </TouchFeedback>
                <Container widthPercent="80%"
                    horizontalAlignment="center"
                >
                    <H1 fontSize={13} color={Colors.black}>
                        Transaction
                    </H1>
                </Container>
            </Container>
        <Container flex={1} backgroundColor={Colors.white} marginTop={2} borderTopLeftRadius={50} 
          borderTopRightRadius={50}
          paddingHorizontal={3}
        >
            {console.log("Transaction>>>",transaction)}
            <ScrollView showsVerticalScrollIndicator={false}>
                <Container 
                    marginBottom={6}>
                    <Container marginBottom={5}>
                        <Container 
                            height={10}
                            horizontalAlignment="center"
                        >
                            {console.log("transaction",transaction)}
                            <ImageWrap 
                                flex={1}
                                width={15}
                                fit={'contain'}
                                source=
                                {
                                    transaction && transaction.status && transaction.status !== 'FAILED' && 
                                    transaction.type === "funding" ? 
                                    depositPNG : transaction && transaction.status && transaction.status !== 'FAILED' && 
                                    transaction.type === "withdraw" ? withdrawalPNG : transaction && transaction.status === "PENDING" ? withdrawalPNG
                                     : failedPNG
                                }
                            />
                        </Container>
                        <SizedBox height={1} />
                        <H1
                            fontSize={15}
                            textAlign="center"
                        >&#8358;{transaction && transaction.amount ? numeral(transaction.amount).format('0,0.00') : '0.00'}</H1>
                    </Container>
                    {
                        [
                            {
                                label : "From",
                                value : `${transaction && transaction.source ? transaction.source : ""}`
                            },
                            {
                                label : "To",
                                value : `${transaction && transaction.title ? `${transaction.title}` : ""}`
                            },
                            {
                                label : "Date",
                                value : `${transaction && transaction.date ? 
                                    moment(transaction.date).format('MMM DD, YYYY h:m:a') : ""
                                }`
                            },
                            {
                                label : "Transaction Status",
                                value : `${transaction && transaction.status && transaction.status === "SUCCESS" ? "Successful" : transaction && transaction.status === "PENDING" ? "PENDING" : "Unsuccessful"}`
                            },
                        ].map((item,i)=>(
                                <Container direction="row"
                                    verticalAlignment="center"
                                    horizontalAlignment="space-between"
                                    paddingVertical={3}
                                    borderBottomWidth={1}
                                    borderColor={Colors.line}
                                    borderTopWidth={i === 0 ? 1 : 0}
                                    key={i}
                                >
                                    <Container>
                                        <H2 
                                            fontSize={8}
                                            color={Colors.otherText}
                                        >{item.label}</H2>
                                    </Container>
                                    <SizedBox width={10}/>
                                    <Container>
                                        <P fontSize={8}>{item.value}</P>
                                    </Container>
                                </Container>
                        ))
                    }
                </Container>
                {
                    transaction && transaction.back_to_wallet !== false ? (
                        <Button title="Back to wallet"
                        backgroundColor={Colors.primary}
                        borderColor={Colors.primary}
                        borderRadius={5}
                        onPress={()=>{
                            props.navigation.navigate('Wallet')
                        }}
                        fontSize={8}
                      />
                    ) : null
                }
            </ScrollView>
        </Container>
      </Page>
    )
}