import React, {useEffect, useState} from 'react';
import {Page, Container, TouchWrap, scaleFont, SizedBox, ImageWrap} from '@burgeon8interactive/bi-react-library';
import {H1,TouchFeedback} from '../../../../../components/component';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../../../helpers/colors';
import {apiFunctions} from '../../../../../helpers/api';
import {GroupEventTabScreens} from '../../../../../helpers/route';
import Agsbanner from '../../../../../../assets/img/agsLogo_dark.png';
import {ToastLong, ToastShort} from '../../../../../helpers/utils';
import {useStoreState} from 'easy-peasy';

const GroupEvents = ({navigation, route}) => {
  const [flagshipEvents, setFlagshipEvent] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const {token} = useStoreState(state => ({
    token: state.userDetails.token,
  }));

  const {data} = route.params;

  const getMyEvents = async () => {
    try {
      setLoading(true);
      let events = await apiFunctions.getEvents(token);
      let filteredEvents = events.filter(event => event.is_flagship && new Date(event.start_datetime).getTime() > new Date().getTime());
      setFlagshipEvent(filteredEvents);
      setLoading(false);
    } catch (error) {
      ToastLong(error.msg);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getMyEvents();
    });
    return unsubscribe;
    // eslint-disable-next-line
  }, [navigation]);
  return (
    <Page backgroundColor={Colors.white} barColor={Colors.black} barIconColor="dark-content">
      <Container paddingHorizontal={4} paddingTop={4} backgroundColor={Colors.white}>
        <TouchFeedback paddingRight={2} paddingBottom={2} paddingTop={2} onPress={() => navigation.goBack()}>
          <Feather Icon name="chevron-left" size={scaleFont(25)} color={Colors.black} />
        </TouchFeedback>
        <Container padding={2}>
          {flagshipEvents[0] ? (
            <ImageWrap
              borderTopLeftRadius={10}
              borderBottomLeftRadius={10}
              url={flagshipEvents[0].banner}
              borderRadius={10}
              backgroundColor="#efefef"
              height={20}
              fit="cover"
            />
          ) : (
            <ImageWrap
              borderTopLeftRadius={10}
              borderBottomLeftRadius={10}
              url={data.thumbnail}
              borderRadius={10}
              backgroundColor="#efefef"
              height={20}
              fit="cover"
            />
          )}
        </Container>
      </Container>

      {/* ANCHOR - HEADER 2 */}
      <Container flex={1} marginTop={2} backgroundColor={Colors.white} borderTopLeftRadius={50} borderTopRightRadius={50}>
        <GroupEventTabScreens />
      </Container>
    </Page>
  );
};

export default GroupEvents;