import React,{useState} from 'react';
import {Container,TouchWrap,SizedBox,scaleFont,InputWrap} from '@burgeon8interactive/bi-react-library';
import Colors from '../../../helpers/colors';
import {H1,P,H2, TwoMenuLineTab,TouchFeedback} from '../../../components/component';
import Card from '../../../components/card';
import {FlatList} from 'react-native';
import {FundingTabScreen} from '../../../helpers/route';
import {useStoreActions,useStoreState} from 'easy-peasy';
import Feather from 'react-native-vector-icons/Feather';
import Loans from './funding/loans';
import Grants from './funding/grants';


const Funding = props => {
  const updateFunds = useStoreActions(actions => actions.funds.updateFunds);
  const {fundsHolder,funds,search} = useStoreState(state => ({
    fundsHolder : state.funds.fundsHolder,
    funds : state.funds.funds,
    search : state.funds.search
  }));
  const {updateSearch} = useStoreActions(action=>({
    updateSearch : action.funds.updateSearch
  }))
  const [current,setCurrent] = useState("Loans");
  return (
    <Container flex={1} paddingHorizontal={6} backgroundColor={Colors.white}>
        <SizedBox height={1} />
        <Container direction="row" width="100%" marginHorizontal={6} marginTop={2}>
          <InputWrap 
            placeholder="Search" backgroundColor="#fff" flex={1} 
            elevation={10} 
            paddingTop={2} paddingLeft={5} borderRadius={50}
            value={search}
            onChangeText={(value)=>{
              // updateSearch(value)
              // value.length === 0 ? updateFunds(fundsHolder) : null;
            }}
            width={65}
          />
          <TouchWrap 
            verticalAlignment="center" paddingHorizontal={3}
            onPress={()=>{
              // if(!search || search.length === 0){
              //   return
              // }
              // let result = fundsHolder.filter((fund)=>{
              //   return fund.title.toLowerCase().includes(search.toLowerCase());
              // })
              // search.length === 0 ? updateFunds(fundsHolder) : updateFunds(result);
            }}
          >
            <Feather Icon name="search" size={scaleFont(25)} color={Colors.primary} />
          </TouchWrap>
        </Container>
        <SizedBox height={3} />
        <Container direction="row">
          {
            [
              {
                name : "Loans"
              },
              {
                name : "Grants"
              }
            ].map((item,index)=>(
              <TwoMenuLineTab 
                el={item} key={index} i={index} current={current} setCurrent={setCurrent} 
              />
            ))
          }
        </Container>
        
        {
          current === "Loans" ? (
            <Loans />
          ) : (
            <Grants />
          )
        }
        {/* <FundingTabScreen /> */}
    </Container>
  );
};

export default Funding;
