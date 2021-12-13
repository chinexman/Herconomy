import React,{useState,useEffect} from 'react';
import {
    Container,
    SizedBox,
  } from '@burgeon8interactive/bi-react-library';
  import {H1,H2,P,Button,Input,Dropdown,ListWrapGeneral} from '../components/component';
  import Colors from '../helpers/colors';
  import {apiFunctions} from '../helpers/api';
  import {Modal,ActivityIndicator,Alert} from 'react-native';
  import {useStoreState} from 'easy-peasy';
  import axios from 'axios';
  import { ToastLong, ToastShort } from '../helpers/utils';



export const ReferralForm = ({buttonText,title,account={},navigation,setAccount}) =>{
    const [showList,setShowList] = useState(false);
  const [listTitle,setListTitle] = useState('');
  const [banks,setBanks] = useState([]);
  const [isBankLoading,setBankLoading] = useState(false);
  const [selectedBank,setSelectedBank] = useState({});
  const [acctConfirmed,setAcctConfirmed] = useState(false);
  const [isLoading,setLoading] = useState(false);
  const [accountNumber,setAccountNumber] = useState('');

  const openListWrapper = list => {
    setShowList(true);
  }

  const {token} = useStoreState(state => ({
    token: state.userDetails.token
  }));

  const selectFromList = (bank)=>{
    setSelectedBank(bank);
    setShowList(false);
  }

  const JoinProgram = async () => {
    try{
      if(Object.values(selectedBank).length === 0){
        ToastShort('Please select a bank');
        return false;
      }
      if(isLoading){
        return false;
      }
      setLoading(true);
      let fd = {
        bank_code : selectedBank.bank_code,
        account_number : accountNumber
      }
      let res = await apiFunctions.getAccountName(token,fd);
      let fd1 = {
        account_name : res.account_name,
        account_number : accountNumber,
        account_bank: selectedBank.title,
        account_bank_code : selectedBank.bank_code
      }
      let res1 = await apiFunctions.updateAccountDetails(token,fd1);
      if(Object.values(account).length > 0){
        Alert.alert('Herconomy','Update was successful');
        setAccount(res1);
        setLoading(false);
        return true;
      }
      setLoading(false);
      Alert.alert('Herconomy','Registration was successful');
      return navigation.navigate('ReferFriend');
    }catch(error){
      Alert.alert('Herconomy','Account details not found');
      return setLoading(false);
    }
  }

  const getBanksFromPaystack = async () => {
    try{
      setBankLoading(true);
      let res = await axios.get('https://api.paystack.co/bank');
      let banks = res.data.data.map((bank)=>{
        return {
          title : bank.name,
          bank_code : bank.code
        }
      });
      setBankLoading(false);
      setBanks(banks);
    }catch(error){
      Alert.alert('Herconomy','Check internet and try again');
    }
  }
  
  useEffect(()=>{
    getBanksFromPaystack();
  },[
    navigation
  ]);
    return(
        <Container backgroundColor={Colors.white} flex={1} 
        borderTopLeftRadius={50} borderTopRightRadius={50}>
            

        {
          showList && (
            <Modal visible={showList} transparent={true} statusBarTranslucent={true}>
              <Container backgroundColor="#0009" flex={1} horizontalAlignment="center" verticalAlignment="flex-start">
                <SizedBox height={20} />
                <Container height={50} width={95}>
                {
                  isBankLoading && (
                    <ActivityIndicator color={Colors.primary} size="large" />
                  )
              }
                  <ListWrapGeneral
                    onToggle={() => setShowList(!showList)}
                    title={'Banks'}
                    listMap={banks}
                    onHide={() => setShowList(false)}
                    selectFromList={selectFromList}
                  />
                </Container>
              </Container>
            </Modal>
          )
        }
        <Container horizontalAlignment="center" flex={1}>
            <SizedBox height={5} />
  
            <Container flex={1} widthPercent="100%" paddingHorizontal={6}>
                  <Container>
                      <Container horizontalAlignment="center" verticalAlignment="center">
                          <H1 fontSize={20}>
                              {title}
                          </H1>
                      </Container>
                      <SizedBox height={0.5} />
                </Container>
                <SizedBox height={5} />
                <Container>
                </Container>
                <Container paddingLeft={5} paddingRight={5}>
                  <Dropdown
                    placeholder="Select Bank Name"
                    backgroundColor="#fff"
                    value={selectedBank.title}
                    onPress={() => openListWrapper()}
                  />
          
                    <Input
                    type="numeric"
                      placeholder="Account Number"
                      value={accountNumber}
                      onChangeText={(value)=>setAccountNumber(value)}
                    />
                    {
                        Object.values(account).length > 0  && (
                            <>
                                <P fontSize={8}>Account Name : {account.account_name}</P>
                                <SizedBox height={1}/>
                                <P fontSize={8}>Account No : {account.account_number}</P>
                                <SizedBox height={1}/>
                                <P fontSize={8}>Account Bank : {account.account_bank}</P>
                            </>
                        )
                    }
                    <SizedBox height={4}/>
                    <Button title={buttonText} borderRadius={5} 
                            onPress={()=>JoinProgram()}
                            loading={isLoading}
                          />
                    
                </Container>
                
                <SizedBox height={5}/>
            </Container>
          </Container>
  
  
  
  
  
  
  
  
  
  
        </Container>
    )
}