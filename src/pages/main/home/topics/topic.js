import React, {useState, useEffect, useCallback} from 'react';
import {Container, TouchWrap, SizedBox, scaleFont, ScrollAreaRefresh, Rounded, ImageWrap} from '@burgeon8interactive/bi-react-library';
import Colors from '../../../../helpers/colors';
import {useStoreActions, useStoreState} from 'easy-peasy';
import {ActivityIndicator, ScrollView} from 'react-native';
import {H2, P, H1, BoxLoader, TouchFeedback} from '../../../../components/component';
import Feather from 'react-native-vector-icons/Feather';
import numeral from 'numeral';
import {} from '../../../../helpers/sockets';
import {} from '../../../../helpers/utils';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import { getData, storeData } from '../../../../helpers/functions';
import { manageTopicData, ReloadGroups } from '../../../../helpers/global_sockets';
import { apiFunctions } from '../../../../helpers/api';
import { FONTSIZE } from '../../../../helpers/constants';

export const TopicBoxOne = props => {
  let data = props.data;
  return (
    <>
      <TouchFeedback onPress={props.onPress}>
        <Container direction="row" horizontalAlignment="space-between" verticalAlignment="center">
          <Container direction="row" verticalAlignment="center" paddingVertical={1}>
            <Rounded size={8} backgroundColor="#dfdfdf" radius={5} elevation={1}>
              <ImageWrap url={data.thumbnail} borderRadius={8} height={5}/>
            </Rounded>

            <SizedBox width={5} />

            <Container>
              <H2 fontSize={FONTSIZE.medium}>{data.title}</H2>
              <P fontSize={8} color={Colors.greyBase600}>
                {numeral(data.number_of_followers).format('0a')} Following
              </P>
            </Container>
          </Container>
          <Feather Icons name="chevron-right" color={Colors.primary} size={scaleFont(20)} />
        </Container>
      </TouchFeedback>
    </>
  );
};

export const TopicBoxTwo = props => {
  let data = props.data;
  const [submitting, setSubmitting] = useState(false);

  const followIt = async () => {
    setSubmitting(true);
    let fd = {topic_id: data.id,token : global.token,user_id : props.userD.id};
    Follow(fd);
  };

  const Follow = fd => {
    try{
      global.socket.emit('follow_topic', fd, data => {
      });
      global.socket.off(`follow_topic_${props.userD.id}`).on(`follow_topic_${props.userD.id}`, ({res}) => {
          try{
            let data = res;
            console.log("Follow",data)
            var index = props.topic_data
              .map(function(e) {
                return e.id;
              })
              .indexOf(data.id);
        
            let arr = [...props.topic_data];
            arr[index] = data;
            props.updateTopicData(arr);
            storeData('topics',arr);
            setSubmitting(false);
            ReloadGroups()
          }catch(err){
          }
      });
    }catch(error){
    }
  };

  return (
    <Container width={45} marginRight={2}>
      <TouchFeedback onPress={()=>{
        if(data.is_follower){
          return props.onPress();
        }
        followIt();
      }}>
        <ImageWrap url={data.thumbnail} borderRadius={8} fit="cover" height={18} overlayColor="#0008">
          <Container horizontalAlignment="center" verticalAlignment="center" flex={1}>
            <H1 fontSize={10} color="#fff" textAlign="center">
              {data.title}
            </H1>
            <P fontSize={8} color="#fff">
              {numeral(data.number_of_followers).format('0a')} Following
            </P>

            <SizedBox height={1} />

            {submitting ? (
             <TouchFeedback backgroundColor={Colors.primary} widthPercent={40} paddingVertical={1} borderRadius={5}>
                <Container>
                  <ActivityIndicator color="#fff" size="small" />
                </Container>
              </TouchFeedback>
            ) : null}
            {
              !data.is_follower && !submitting ? (
                <TouchFeedback backgroundColor={Colors.primary} width={15} paddingVertical={1} borderRadius={5} onPress={followIt}>
                  <H1 textAlign="center" fontSize={FONTSIZE.medium} color="#fff">
                    Follow
                  </H1>
                </TouchFeedback>
              ) : null
            }
          </Container>
        </ImageWrap>
      </TouchFeedback>
      {/* <SizedBox height={2} /> */}
    </Container>
  );
};

const Topics = props => {
  const navigation = useNavigation();
  const {userD,topic_data} = useStoreState(state => ({
    userD: state.userDetails.user,
    topic_data : state.community.topic_data 
  }));
  const {updateTopicData} = useStoreActions(action=>({
    updateTopicData : action.community.updateTopicData
  }))
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState([]);
  const [myTopics, setMyTopics] = useState([]);
  const [otherTopics, setOtherTopics] = useState([]);

  function loadTopics() {
    if (!topic_data || topic_data.length < 1) {
      setLoading(true);
    } else {
      setLoading(false);
      console.log("<<loadTopics|>>",topic_data)
      setTopics(topic_data);
    }
  }

  useEffect(() => {
    loadTopics();
  }, [topic_data]);

  return (
    <Container 
        backgroundColor={Colors.white} 
        paddingHorizontal={6} paddingTop={1}
      >
        <Container verticalAlignment="flex-start">
            <React.Fragment>
                  <H2 fontSize={10} color={Colors.greyBase300}>
                    Trending Today
                  </H2>
                  <SizedBox height={2} />
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                      {topic_data.length === 0 ? (
                        [...'12'].map((item,index)=>(
                            <BoxLoader key={index} />
                          ))
                        ) : null
                      }
                    {topic_data.map((el, i) => {
                        return <TopicBoxTwo data={el} onPress={() => {
                          storeData("current_topic_index",el.id)
                          navigation.navigate('TopicsDetails', el.id)
                        }} key={i}
                          data_length={topics.length}
                          index={i}
                          topic_data={topic_data}
                          updateTopicData={updateTopicData}
                          userD={userD}
                        />
                      })}
                  </ScrollView>
                  <Container height={0.1} marginVertical={1} />
            </React.Fragment>
        </Container>
      </Container>
  );
};

export default React.memo(Topics);
