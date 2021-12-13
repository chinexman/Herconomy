import React, {useState, useEffect} from 'react';
import {Page, Container, TouchWrap, SizedBox, scaleFont, Rounded, ImageWrap, Avatar, ScrollArea} from '@burgeon8interactive/bi-react-library';
import {H1, H2, P} from '../../../../../../components/component';
import Colors from '../../../../../../helpers/colors';

const GroupDescription = ({data}) => {
  return (
    <Container flex={1} backgroundColor={Colors.white}>
      <ScrollArea>
        <Container padding={3}>
          <Container direction="row" padding={5}>
            <Container widthPercent="3%" />
            <Container widthPercent="97%">
              <H1>Description</H1>
              <SizedBox height={5} />
              <P>{data && data.description ? data.description : ''}</P>
            </Container>
          </Container>
        </Container>
      </ScrollArea>
    </Container>
  );
};

export default GroupDescription;