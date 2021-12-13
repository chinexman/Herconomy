import React, { useEffect,useState } from 'react';
import {Container, SizedBox} from '@burgeon8interactive/bi-react-library';
import {PlainFeedBox} from '../../../components/component';
import {Retry} from '../../../components/retry';
import {useStoreState, useStoreActions} from 'easy-peasy';
import Colors from '../../../helpers/colors';
import { apiFunctions } from '../../../helpers/api';
import {Like, Unlike} from '../../../helpers/global_sockets';
import { ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/core';
const MyPost = props => {
  const {myPost,token,user,result} = useStoreState(state => ({
    myPost: state.userDetails.myPost,
    token : state.userDetails.token,
    user : state.userDetails.user,
    result : state.resultModel.result
  }));

  const [retry,setRetry] = useState(false);
  const [loading,setLoading] = useState(false);
  const {updateMyPost} = useStoreActions(action=>(
    {updateMyPost : action.userDetails.updateMyPost}
  ));
  const navigation = useNavigation();
  const getPosts = async () =>{
    try{
      setRetry(false);
      setLoading(true);
      let res = await apiFunctions.myPost(token,props.about_me.id);
      setLoading(false);
      updateMyPost(res);
    }catch(error){
      setRetry(true);
      setLoading(false);
    }
  }
  const likeDislike = (el, path) => {
    el.likes.filter(ell => ell.id === user.id).length > 0 ? Unlike(path, el.id) : Like(path, el.id);
    getPosts();
  };
  let posts = myPost.filter(item=>item.user.id === props.about_me.id);
  useEffect(()=>{
    getPosts();
  },[]);
  return (
    <Container widthPercent="100%" backgroundColor={Colors.white} paddingTop={2.5}>
      {
        loading ? (
          <Container>
              <ActivityIndicator size={20} color={Colors.primary} />
              <SizedBox height={5} />
          </Container>
        ) : null
      }
      {!retry && posts.slice(0, 5).map((el, i) => (
        <PlainFeedBox
          key={i}
          data={el}
          userD={user}
          onPress={null}
          onPressLD={() => likeDislike(el, 'post')}
          onShare={() => shareDetails({message: el.body, file: el.file})}
          navigation={navigation}
          from_profile={true}
        />
      ))}
      {
        retry ? (
          <Retry funcCall={getPosts} param={[]}/>
        ) : null
      }

    </Container>
  );
};

export default MyPost;
