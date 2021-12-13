import React, {useState} from 'react';
import {Page, Container, SizedBox, InputWrap, scaleFont, TouchWrap, ImageWrap} from '@burgeon8interactive/bi-react-library';
import Colors from '../../../../../helpers/colors';
import {H2, H1,TouchFeedback} from '../../../../../components/component';
import {useStoreActions, useStoreState} from 'easy-peasy';
import Feather from 'react-native-vector-icons/Feather';
import GroupDescription from './info_details/group_description';
import GroupRules from './info_details/group_rules';
import GroupMembers from './info_details/group_members';

const GroupInfo = props => {
  const {data,tab_name} = props.route.params;
  return (
    <Page backgroundColor={Colors.primary} flex={1}>
      <Container paddingHorizontal={6} paddingTop={6} backgroundColor={Colors.primary} direction="row">
        <TouchFeedback paddingRight={2} paddingBottom={2} paddingTop={2} onPress={() => props.navigation.goBack()}>
          <Feather Icon name="chevron-left" size={scaleFont(25)} color="#fff" />
        </TouchFeedback>
        <Container backgroundColor={Colors.primary} paddingHorizontal={6} paddingTop={0.5} paddingBottom={3}>
          <H1 fontSize={20} color={Colors.whiteBase}>
            Group Info
          </H1>
        </Container>
      </Container>

      <SizedBox height={8} />
      <Container
        flex={1}
        paddingHorizontal={6}
        backgroundColor={Colors.white}
        marginTop={2}
        borderTopLeftRadius={50}
        borderTopRightRadius={50}>
        <Container position="absolute" width={70} marginHorizontal={15} marginTop={-10}>
          <ImageWrap height={20} backgroundColor="#dfdfdf" borderRadius={20} url={data.thumbnail} elevation={15} />
        </Container>
        <SizedBox height={12} />
        {
          tab_name === "Description" ? (
            <GroupDescription data={data}/>
          ) : tab_name === "Members" ? (
            <GroupMembers data={data}/>
          ) : (
            <GroupRules data={data}/>
          )
        }
      </Container>
    </Page>
  );
};

export default GroupInfo;