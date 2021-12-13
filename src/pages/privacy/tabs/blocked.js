import React, {useState, useEffect} from 'react';
import {ActivityIndicator} from 'react-native';
import {Container, TouchWrap, SizedBox, scaleFont, Rounded, ImageWrap, InputWrap} from '@burgeon8interactive/bi-react-library';
import Colors from '../../../helpers/colors';
import {H1, P, H2,TouchFeedback} from '../../../components/component';
import {FlatList} from 'react-native';
import {BlockedCard} from '../../../components/blocked_card';
import {apiFunctions} from '../../../helpers/api';
import {ToastShort, ToastLong} from '../../../helpers/utils';
import {useStoreState} from 'easy-peasy';
import {useFocusEffect} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { Retry } from '../../../components/retry';

const BlockedResource = ({navigation, route, onPress}) => {
  const {token, user} = useStoreState(state => ({
    token: state.userDetails.token,
    user: state.userDetails.user,
  }));

  const [data, setData] = useState([]);
  const [holdBlocked, setHoldBlocked] = useState([]);
  const [loading, setLoading] = useState(false);
  const [retry,setRetry] = useState(false);

  useEffect(() => {
    // fetched blocked users
    getBlockedUsers();
    // populate data on Screen
    // implement unblock user
  }, []);

  const getBlockedUsers = React.useCallback(async () => {
    setLoading(true);
    setRetry(false);
    await apiFunctions
      .getBlockedUsers(token)
      .then(res => {
        // add data to this
        setData(res);
        setHoldBlocked(res);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        setRetry(true);
      });
  });

  const handlePress = async id => {
    let fd = {
      user_id: id,
    };

    await apiFunctions
      .unblockUser(token, fd)
      .then(async (res) => {
        if (res.is_blocked === false) {
          await getBlockedUsers();
          ToastShort(`${res.username} unblocked`);
        }
      })
      .catch(err => {
        ToastShort('Network Error. Please retry')
      });
  };


  return (
    <Container backgroundColor={Colors.white} flex={1}>
      <Container direction="row" width="100%" marginHorizontal={6} marginTop={2}>
        <Container 
          widthPercent="80%"
        >
          <InputWrap
            placeholder="Search"
            backgroundColor="#fff"
            flex={1}
            elevation={10}
            paddingTop={2}
            paddingLeft={5}
            borderRadius={50}
            onChangeText={value => {
              value === '' ? setData(data) : setData(filter_members);
              let filter_members = holdBlocked.filter(member => {
                return (
                  (member.first_name && member.first_name.toLowerCase().includes(value.toLowerCase())) ||
                  (member.last_name && member.last_name.toLowerCase().includes(value.toLowerCase())) ||
                  (member.username && member.username.toLowerCase().includes(value.toLowerCase()))
                );
              });
              value.length === 0 ? setData(holdBlocked) : setData(filter_members);
            }}
          />
        </Container>
        <Container widthPercent="20%" verticalAlignment="center">
          <TouchFeedback paddingHorizontal={3}>
            <Feather Icon name="search" size={scaleFont(25)} color={Colors.primary} />
          </TouchFeedback>
        </Container>
      </Container>

      <SizedBox height={5} />
      {loading && <ActivityIndicator size="small" color="#000" />}
      {data.length === 0 && (
        <Container verticalAlignment="center" horizontalAlignment="center" paddingHorizontal={4}>
          <P color={Colors.fadedText} fontSize={10}>
            You have no blocked users
          </P>
        </Container>
      )}
      <FlatList
        data={data}
        extraData={data}
        keyExtractor={data => data.id}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => <BlockedCard data={item} count={data.length} index={index} onPress={() => handlePress(item.id)} />}
      />
      {
        retry ? (
          <Retry funcCall={getBlockedUsers} param={[]}/>
        ) : null
      }
    </Container>
  );
};

export default BlockedResource;