import React,{useState} from 'react';
import {Container,TouchWrap,SizedBox,scaleFont,InputWrap} from '@burgeon8interactive/bi-react-library';
import Colors from '../../helpers/colors';
import {H1,P,H2} from '../../components/component';
import {FlatList} from 'react-native';
import {FundingAppTabScreen} from '../../helpers/route';
import {useStoreActions,useStoreState} from 'easy-peasy';
import Feather from 'react-native-vector-icons/Feather';


const FundingApps = props => {
  const updateFunds = useStoreActions(actions => actions.funds.updateFunds);
  const {fundsHolder} = useStoreState(state => ({
    fundsHolder : state.funds.fundsHolder
  }));
  const [searchValue,setSearchValue] = useState("");
  return (
    <Container flex={1} paddingHorizontal={6} backgroundColor={Colors.white}>
        <SizedBox height={3} />
        <FundingAppTabScreen />
    </Container>
  );
};

export default FundingApps;
