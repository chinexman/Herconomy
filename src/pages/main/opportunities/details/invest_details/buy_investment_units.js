import React,{useState} from 'react';
import {
  Page,
  Container,
  TouchWrap,
  SizedBox,
  scaleFont,
  Rounded,
  ImageWrap,
  Avatar,
  ScrollArea,
  TextWrap,
} from '@burgeon8interactive/bi-react-library';
import {H1,H2,P,Button,Input,Dropdown,Label,TouchFeedback} from '../../../../../components/component';
import Colors from '../../../../../helpers/colors';
import Feather from 'react-native-vector-icons/Feather';
import {ToastShort, ToastLong} from '../../../../../helpers/utils';

const BuyUnits = ({navigation,route}) => {
  const {investment} = route.params;
  const [unit_count,setUnitCount] = useState('1');
  const [price,setPrice] = useState(investment.price);
  return (
    <Page barIconColor="light" backgroundColor={Colors.primary}>
      <Container paddingHorizontal={6} paddingTop={6} direction="row" verticalAlignment="center">
        <TouchFeedback paddingRight={5} paddingTop={1.5} paddingBottom={1.5} onPress={() => navigation.goBack()}>
          <Feather Icon name="chevron-left" size={scaleFont(25)} color="#fff" />
        </TouchFeedback>
      </Container>
      <SizedBox height={8} />

      <Container backgroundColor={Colors.white} flex={1} borderTopLeftRadius={50} borderTopRightRadius={50}>
        <Container horizontalAlignment="center" flex={1}>
        <Rounded size={45} radius={5} position="absolute" marginTop={-14}>
            <ImageWrap backgroundColor="#efefef" borderRadius={10} elevation={5} url={investment.logo} flex={1} />
          </Rounded>
          <SizedBox height={17} />

          <Container flex={1} widthPercent="100%" paddingHorizontal={3}>
                <ScrollArea>
                <Container horizontalAlignment="center" verticalAlignment="center">
                  <H1 fontSize={15}>
                    Buy Units
                  </H1>
                  <SizedBox height={1.5}/>
                  <P>Use the form below to buy units</P>
                </Container>
                <SizedBox height={5.5} />
                  <Container paddingHorizontal={6}>
                    <Container direction="row" horizontalAlignment="space-between">
                      <Container widthPercent="40%">
                          <Label name="Units" />
                          <SizedBox height={1}/>
                          <Input 
                            placeholder="Enter units" type="numeric" placeholderTextColor={Colors.lightGrey}
                            onChangeText={(value)=>{
                              setPrice(value * investment.price)
                              setUnitCount(value)
                            }}
                            value={unit_count}
                          />
                      </Container>
                      <Container widthPercent="40%">
                        <Label name="Total Price" />
                        <SizedBox height={1}/>
                        <Container verticalAlignment="center" paddingTop={1}>
                          <TextWrap fontSize={13}>
                            &#x20A6;{Number(price).toLocaleString('en-US')}
                          </TextWrap>
                        </Container>
                      </Container>
                    </Container>
                    <SizedBox height={2}/>
                    <Button title="INVEST" borderRadius={4} backgroundColor={Colors.lightGreen} borderColor={Colors.lightGreen} 
                          onPress={()=>{
                            if(unit_count > Number(investment.units_available)){
                              return ToastShort(`Count of available unit is ${investment.units_available}`);
                            }
                            if(unit_count.length === 0 || unit_count < 1){
                              return ToastShort(`You must enter atleast one unit`);
                            }
                            navigation.navigate('InvestmentCart',{investment,unit_count})
                          }}
                        />
                  </Container>
                </ScrollArea>
          </Container>
        </Container>
      </Container>
    </Page>
  );
};

export default BuyUnits;
