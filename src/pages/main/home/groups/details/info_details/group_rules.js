import React from 'react';
import {Page, Container, TouchWrap, SizedBox, scaleFont, Rounded, ImageWrap, Avatar, ScrollArea} from '@burgeon8interactive/bi-react-library';
import {H1, H2, P, Button} from '../../../../../../components/component';
import OppDetailsHeader from '../../../../../../components/opp_details_header';
import Colors from '../../../../../../helpers/colors';

const GroupRules = ({data}) => {
  return (
    <Container flex={1} backgroundColor={Colors.white}>
      <ScrollArea>
        <Container padding={5}>
          <Container widthPercent="97%">
            <H1>Rules</H1>
            <SizedBox height={5} />
            {data && data.rules ? <P>{data.rules && data.rules}</P> : <P>There are no rules in this group</P>}
          </Container>
        </Container>
      </ScrollArea>
    </Container>
  );
};

export default GroupRules;