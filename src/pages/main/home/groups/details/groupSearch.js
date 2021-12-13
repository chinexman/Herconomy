import React, {useState, useEffect} from 'react';
import {AppPageTitle, H1, H2, P, Button, LocalAvatar, OtherFeedBox,TouchFeedback} from '../../../../../components/component';
import {Container, Page, TouchWrap, scaleFont, SizedBox, InputWrap, Avatar} from '@burgeon8interactive/bi-react-library';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../../../helpers/colors';
import {FlatList} from 'react-native-gesture-handler';
import {apiFunctions} from '../../../../../helpers/api';
import {storeData, getData} from '../../../../../helpers/functions';
import {ActivityIndicator} from 'react-native';
import {useStoreActions, useStoreState} from 'easy-peasy';
import {ToastShort, ToastLong} from '../../../../../helpers/utils';
import {Like, Unlike, ListenGroupPost, ReloadGroups} from '../../../../../helpers/global_sockets';

const GroupSearch = props => {
  const {user} = useStoreState(state => ({
    user: state.userDetails.user,
  }));

  const getMembersByFilter = async (sort, filter_name) => {
    try {
      setFilterBy(filter_name);
      fetchMembers(filter_name);
      setLoading(true);
      let res = await apiFunctions.getMembers(token, sort);
      setMembers(res);
      setHoldMembers(res);
      setLoading(false);
      storeData(filter_name, res);
    } catch (error) {
      ToastLong(error.msg);
    }
  };

  const fetchMembers = async filter_name => {
    let membersSearch = await getData(filter_name);
    if (membersSearch) {
      setFilterBy(filter_name);
      setMembers(membersSearch);
      setHoldMembers(membersSearch);
      setLoading(false);
    }
  };

  const token = useStoreState(state => state.userDetails.token);
  const [members, setMembers] = useState([]);
  const [hold_members, setHoldMembers] = useState([]);
  const [filter_by, setFilterBy] = useState('all');
  const [loading, setLoading] = useState(false);
  const [groupPosts, setGroupPosts] = useState([]);
  const [groupPostsHolder, setGroupPostsHolder] = useState([]);
  const [likes, setLikes] = useState([]);
  const [unlike, setUnLike] = useState([]);

  const {data} = props.route.params;
  const loadPostData = () => {
    // setLoading(true);
    let fd = {group_id: data.id};
    ListenGroupPost(fd);
  };

  const loadGroupPosts = () => {
    if (global.groupPost) {
      // setLoading(false);
      setGroupPostsHolder(global.groupPost);
      setGroupPosts(global.groupPost);
    }
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      loadGroupPosts();
      loadPostData();
    });
    return unsubscribe;
    // eslint-disable-next-line
  }, [props.navigation]);

  const likeDislike = async (el, path) => {
    let isLiked = el.likes.filter(ell => ell.id === user.id).length > 0;

    if (isLiked || likes.includes(el.id) === true) {
      setLikes(likes.filter(like => like !== el.id));
      Unlike(path, el.id);
    } else {
      setLikes([...likes, el.id]);
      Like(path, el.id);
    }

    ReloadGroups(res => {
      setLikes([]);
    });
  };

  return (
    <Page barIconColor="light-content" backgroundColor={Colors.primary}>
      <Container paddingHorizontal={6} paddingTop={6} direction="row" horizontalAlignment="space-between" verticalAlignment="center">
        <Container direction="row" verticalAlignment="center">
          <TouchFeedback paddingRight={3} onPress={() => props.navigation.goBack()}>
            <Feather Icon name="chevron-left" size={scaleFont(25)} color="#fff" />
          </TouchFeedback>

          <H1 color="#fff" fontSize={18}>
            Search
          </H1>
        </Container>
      </Container>

      <SizedBox height={6} />

      <Container backgroundColor={Colors.white} flex={1} paddingHorizontal={6}>
        {/* ANCHOR - Search*/}
        <Container position="absolute" width={88} marginHorizontal={6} marginTop={-3}>
          <InputWrap
            placeholder="By name, post, post content"
            backgroundColor="#fff"
            flex={1}
            elevation={10}
            paddingTop={2}
            paddingBottom={2}
            paddingLeft={5}
            borderRadius={50}
            onChangeText={value => {
              let filtered_posts = groupPostsHolder.filter(post => {
                return (
                  (post.user && post.user.first_name && post.user.first_name.toLowerCase().includes(value.toLowerCase())) ||
                  (post.user && post.user.last_name && post.user.last_name.toLowerCase().includes(value.toLowerCase())) ||
                  (post.user && post.user.profession && post.user.profession.toLowerCase().includes(value.toLowerCase())) ||
                  (post.user &&  post.user.location && post.user.location.toLowerCase().includes(value.toLowerCase())) ||
                  (post.body && post.body.toLowerCase().includes(value.toLowerCase()))
                );
              });
              value.length === 0 ? setGroupPosts(groupPostsHolder) : setGroupPosts(filtered_posts);
            }}
          />
        </Container>

        {/* ANCHOR - CONTENT */}
        <Container marginTop={1} />

        <SizedBox height={5} />
        {loading && (
          <Container paddingLeft={5}>
            <P color={Colors.black}>Loading ...</P>
            <SizedBox height={5} />
          </Container>
        )}

        {groupPosts &&
          groupPosts
            .slice(0, 15)
            .map((el, i) => (
              <OtherFeedBox
                key={i}
                data={el}
                userD={user}
                onPress={() => props.navigation.navigate('GroupDetailsPost', {postId: el.id, groupId: data.id})}
                onPressLD={() => likeDislike(el, 'post')}
                likes={likes}
                unlike={unlike}
                navigation={props.navigation}
              />
            ))}
      </Container>
    </Page>
  );
};

export default GroupSearch;