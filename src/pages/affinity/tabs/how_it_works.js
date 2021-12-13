import React from 'react';
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
} from '@burgeon8interactive/bi-react-library';
import {H1,H2,P, Button} from '../../../components/component';
import  Colors  from '../../../helpers/colors';
import {useStoreState} from 'easy-peasy';

const HowItWorks = props => {
    const {affinity} = useStoreState(state=>({
        affinity : state.affinity.affinity
    }));
    return(
        <ScrollArea>
            <Container flexGrow={1}>
                <SizedBox height={3} />
                <Container paddingHorizontal={5}>
                    <P>
                       {affinity ? affinity.how_it_works : ""}
                    </P>
                </Container>
                <SizedBox height={5} />
            </Container>
        </ScrollArea>
    );
}

export default HowItWorks;