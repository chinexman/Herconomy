import React,{useState} from 'react';
import {Container, SizedBox,InputWrap,scaleFont,TouchWrap} from '@burgeon8interactive/bi-react-library';
import Colors from '../../../helpers/colors';
import {H1, H2, TwoMenuLineTab,TouchFeedback} from '../../../components/component';
import {OtherOppsTabScreen} from '../../../helpers/route';
import {useStoreActions,useStoreState} from 'easy-peasy';
import Feather from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Scholarship from './others/scholarships';
import Jobs from './others/jobs';

const OthersOpp = props => {
  const {updateOthSearch,updateOthHolder,updateOthOpps} = useStoreActions(actions => ({
    updateOthHolder : actions.otherOpps.updateOthHolder,
    updateOthSearch : actions.otherOpps.updateOthSearch,
    updateOthOpps : actions.otherOpps.updateOthOpps
  }));

  const {oth_opp_holder,other_search} = useStoreState(state => ({
    oth_opp_holder : state.otherOpps.oth_opp_holder,
    other_search : state.otherOpps.other_search
  }));
  const [current,setCurrent] = useState("Scholarships")
  return (
    <Container flex={1} paddingHorizontal={6} backgroundColor={Colors.white}>
        <SizedBox height={1} />
        <Container direction="row" width="100%" marginHorizontal={6} marginTop={2}>
          <InputWrap 
            placeholder="Search" backgroundColor="#fff" flex={1} 
            elevation={10} 
            paddingTop={2} paddingLeft={5} borderRadius={50}
            onChangeText={(value)=>{
              // updateOthSearch(value)
              // value.length === 0 && oth_opp_holder !== undefined ? 
              // updateOthOpps(oth_opp_holder ? oth_opp_holder : []) : null;
            }}
            width={65}
            value={other_search}
          />
          <TouchWrap 
            verticalAlignment="center" paddingHorizontal={3}
            onPress={()=>{
              // if(!other_search || other_search.length === 0){
              //   return
              // }
              // let result = oth_opp_holder.filter((opp)=>{
              //   return opp.title.toLowerCase().includes(other_search.toLowerCase());
              // })
              // !other_search || other_search.length === 0 ? updateOthHolder(oth_opp_holder) : updateOthOpps(result);
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
                name : "Scholarships"
              },
              {
                name : "Jobs"
              }
              
            ].map((item,index)=>(
              <TwoMenuLineTab 
                el={item} key={index} i={index} current={current} setCurrent={setCurrent} 
              />
            ))
          }
        </Container>
        
        {
          current === "Scholarships" ? (
            <Scholarship />
          ) : (
            <Jobs />
          )
        }
    </Container>
  );
};

export default OthersOpp;
