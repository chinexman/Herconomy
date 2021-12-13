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
import {H1,H2,P, Button} from '../../../../../components/component';
import OppDetailsHeader from '../../../../../components/opp_details_header';
import Colors from '../../../../../helpers/colors';
import {useStoreState} from 'easy-peasy';

const OppsCompanyInfo = () => {
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
                        {
                            new_opp.requirements && (
                                <P lineHeight={25}>{new_opp.requirements}</P>
                            )
                        }

                        {
                            new_opp.selection_process && (
                                <Container paddingTop={2}>
                                    <H1>Selection Process</H1>
                                    <SizedBox height={3}/>
                                    <P lineHeight={25}>{new_opp.selection_process}</P>
                                </Container>
                            )
                        }
                        
                        {
                            new_opp.how_to && (
                                <Container paddingTop={new_opp.selection_process ? 5 : 0}>
                                    <H1>How to Apply</H1>
                                    <SizedBox height={3}/>
                                    <P lineHeight={25}>{new_opp.how_to}</P>
                                </Container>
                            )
                        }
                    </Container>
                </Container>
        </ScrollArea>
        </Container>
    )
}

export default OppsCompanyInfo;