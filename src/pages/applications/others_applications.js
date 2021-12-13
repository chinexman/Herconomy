import React,{useState} from 'react';
import {Container, SizedBox,InputWrap,scaleFont,TouchWrap} from '@burgeon8interactive/bi-react-library';
import Colors from '../../helpers/colors';
import {H2} from '../../components/component';
import {OthersAppTabScreen} from '../../helpers/route';
import {useStoreActions,useStoreState} from 'easy-peasy';
import Feather from 'react-native-vector-icons/Feather';

const OthersApps = props => {
  const updateOtherOpps = useStoreActions(actions => actions.otherOpps.updateOtherOpps);
  const {otherOppsHolder} = useStoreState(state => ({
    otherOppsHolder : state.otherOpps.otherOppsHolder
  }));
  const [searchValue,setSearchValue] = useState("");
  return (
    <Container flex={1} paddingHorizontal={6} backgroundColor={Colors.white}>
        <SizedBox height={3} />
        <OthersAppTabScreen />
    </Container>
  );
};

export default OthersApps;
