import React,{useState} from 'react';
import {H1,P,H2,TouchFeedback} from './component';
import {Container, ScrollArea, Avatar, SizedBox, ImageWrap, TouchWrap, InputWrap, scaleFont} from '@burgeon8interactive/bi-react-library';
import Colors from '../helpers/colors';
import { useStoreActions } from 'easy-peasy';
import moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import {Modal} from 'react-native';
import { Capitalize } from '../helpers/utils';

const ListCard = ({data,tabName,navigation,navigateTo,isInvestment = false}) => {
  const [showModal,setShowModal] = useState(false);
    let item = data.fund ? data.fund : data.investment ? data.investment : data;
    const updateOpportunity = useStoreActions(actions => actions.opportunity.updateOpportunity);
    return (
      <Container padding={1.5}>
        <TouchFeedback onPress={()=>{
            updateOpportunity(item);
            isInvestment ? setShowModal(true) : navigation.navigate(navigateTo,{opportunity:item,
            tabname:tabName,showButtons:false})
        }}>
          <Container backgroundColor={Colors.whiteBase} elevation={5} widthPercent="100%" direction="row" borderRadius={10}>
            <Container paddingVertical={1} paddingLeft={5} paddingTop={5} paddingBottom={5}
              widthPercent={isInvestment ? "80%" : '100%'}
            >
               <H2>{item.title ? Capitalize(item.title): ''}</H2>
                  <P fontSize={8} color={Colors.fadedText}>Date Submitted:  {moment(item.created_at).format('MMM DD YYYY hh:mm a')}</P>
               <SizedBox height={2}/>
                <P fontSize={8} color={Colors.fadedText}>By {isInvestment ? item.company : `${item.user.first_name} ${item.user.last_name}`}</P>
               <SizedBox height={2}/>
               <Container borderBottomWidth={1} widthPercent="50%" horizontalAlignment="center">
                <P fontSize={8}>View Application</P>
               </Container>
            </Container>  
           {
             isInvestment && (
              <Container widthPercent="20%"
                paddingVertical={1} paddingLeft={4} paddingTop={5} paddingRight={3.5}
                horizontalAlignment="center"
              >
                <H2 fontSize={8}>{data.units}</H2>
                <P fontSize={8}>Units</P>
              </Container>
             )
           }
          </Container>
        </TouchFeedback>
  
        <SizedBox height={3} />
        <Modal visible={showModal} transparent={true} statusBarTranslucent={true}>
            <ScrollArea flexGrow={1}>
              <Container flex={1} horizontalAlignment="center" verticalAlignment="center">
                <Container backgroundColor={Colors.whiteBase} padding={10} borderRadius={10} widthPercent="90%"
                 borderColor={Colors.line} borderWidth={1}>
                  <Container>
                    <TouchWrap onPress={()=>setShowModal(false)}>
                      <Container horizontalAlignment="flex-end">
                        <Feather name="x-circle" size={scaleFont(15)}/>
                      </Container>
                    </TouchWrap>
                    <Container>
                      <H1 fontSize={15}>Rice Farm Investment</H1>
                      <P fontSize={10}>&#x20A6;{Number(data.amount).toLocaleString('en-US')} / Per Unit</P>
                    </Container>
                  </Container>
                  <SizedBox height={3}/>
                  <Container direction="row">
                    <Container widthPercent="80%">
                      <P fontSize={10}>Amount Invested</P>
                      <H1>&#x20A6;{Number(data.amount).toLocaleString('en-US')}</H1>

                      <SizedBox height={1}/>
                      <P fontSize={10}>Total Expected</P>
                      <H1>&#x20A6;{Number(data.amount).toLocaleString('en-US')}</H1>

                      <SizedBox height={1}/>
                      <P fontSize={10}>Rate(%)</P>
                      <H1 color={Colors.primary}>{data.roi}%</H1>

                      <SizedBox height={1}/>
                      <P fontSize={10}>Purchase Date</P>
                      <H1>{moment(data.created_at).format('MM-DD-YYYY')}</H1>

                      <SizedBox height={1}/>
                      <P fontSize={10}>Maturity Date</P>
                      <H1>{isInvestment ? moment(data.investment.maturity_date).format('MM-DD-YYYY') : ''}</H1>
                    </Container>
                    <Container widthPercent="20%" 
                      horizontalAlignment="center"
                    >
                      <H1 textAlign="center" color={Colors.primary}>{data.units} {'\n'} Units</H1>
                    </Container>
                  </Container>
                </Container>
              </Container>
            </ScrollArea>
        </Modal>
      </Container>
    );
  }

  export default ListCard;