import React, {useEffect} from 'react';
import {Page, Container, ImageWrap, SlideTransition} from '@burgeon8interactive/bi-react-library';
import {H2} from '../components/component';
import Colors from '../helpers/colors';
import {getData, storeData} from '../helpers/functions';
import {RouteContext} from '../helpers/routeContext';
import {useStoreActions} from 'easy-peasy';
import { apiFunctions } from '../helpers/api';
import { Linking } from 'react-native';

const Splash = () => {
  const {setCurrentState} = React.useContext(RouteContext);
  const {_updateUser, _updateToken, _updateMessagesBlock,
    _updateFeedData,_updateTopicData,_updateGroupData,_updateGqlToken} = useStoreActions(actions => ({
    _updateUser: actions.userDetails.updateUser,
    _updateToken: actions.userDetails.updateToken,
    _updateGqlToken: actions.userDetails.updateGqlToken,
    _updateMessagesBlock: actions.allContacts.updateMessagesBlock,
    _updateFeedData : actions.community.updateFeedData,
    _updateTopicData : actions.community.updateTopicData,
    _updateGroupData : actions.community.updateGroupData
  }));

  const init = async () => {
    try {
      let url = await Linking.getInitialURL();
      if(url){
        await storeData("initial_url",url);
      }
      let token = await getData('token');
      let gql_token = await getData('gql_token');
      let user = await getData('user');
      let feeds = await getData('feeds');
      let topics = await getData('topics');
      let groups = await getData('groups');
      let allContacts = await getData('allContacts');

      if (feeds) _updateFeedData(feeds.slice(0,10));
      if (topics) _updateTopicData(topics.slice(0,10));
      if (groups) _updateGroupData(groups.slice(0,10));
      if (allContacts) global.allContacts = allContacts;

      if (user && token) {
        global.token = token;
        global.gql_token = gql_token;
        global.user = user;
        //Populate Store
        _updateUser(user);
        _updateToken(token);
        _updateGqlToken(gql_token)

        //Go To Main
       setTimeout(() => setCurrentState('main'), 250);
      } else if (user) {
        setCurrentState('auth');
      } else {
        setCurrentState('walkthrough');
      }
    } catch (error) {}
  };

  useEffect(() => {
    setTimeout(() => init(), 550);
  }, []);

  return (
    <Page backgroundColor={Colors.primary}>
      <Container verticalAlignment="center" horizontalAlignment="center" flex={1}>
        <SlideTransition from={10} duration={350}>
          <ImageWrap 
            source={require('../../assets/img/agsLogo_dark.png')} fit="contain" 
            height={10}
          />
        </SlideTransition>
      </Container>
    </Page>
  );
};

export default Splash;
