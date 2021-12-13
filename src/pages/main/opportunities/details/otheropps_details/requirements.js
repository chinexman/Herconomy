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
import {H1,H2,P} from '../../../../../components/component';
import OppDetailsHeader from '../../../../../components/opp_details_header';
import {useStoreState} from 'easy-peasy';
import { FONTSIZE } from '../../../../../helpers/constants';


const OppsRequirement = () => {
    const {opportunity} = useStoreState(state => ({
        opportunity: state.opportunity,
    }));
    const new_opp = opportunity.oppo !== undefined ? opportunity.oppo :  opportunity;
    return(
        <Container>
            <ScrollArea>
                <OppDetailsHeader oppo={new_opp} />
                <Container padding={5}>
                    <Container paddingRight={5}>
                        <H1 fontSize={FONTSIZE.medium}>Minimum Requirements</H1>
                        <SizedBox height={5}/>
                        <P lineHeight={25}>{new_opp.category.toLowerCase() === 'jobs' ? new_opp.description : new_opp.eligibility}</P>
                    </Container>
                </Container>
            </ScrollArea>
        </Container>
    );
}

export default OppsRequirement;