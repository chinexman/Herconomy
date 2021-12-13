import React from 'react';
import {createStore, action, thunk} from 'easy-peasy';
import {apiFunctions} from './api';
import {ToastLong, ToastShort} from './utils';
import {storeData} from './functions';
import {Alert} from 'react-native';

///  Global Variables ///
global.feeds = [];
global.topics = [];
global.myTopics = [];
global.groups = [];
global.myGroups = [];
global.groupPost = [];
global.topicPost = [];
global.contacts = [];
global.sent_requests = [];
global.received_requests = [];
global.sorted_contacts = [];
global.allContacts = null;
global.feeds_page_num = 1;
global.seen_notifications = [];
global.tot_notifications = 0;
global.the_post = null;
global.requestMessage = '';
global.senders = [];

const communityModel = {
  feeds: [],
  feeds_data : [],
  topic_data : [],
  group_data : [],
  topics: [],
  myTopics: [],
  groups: [],
  myGroups: [],
  groupPost: [],
  groupInfo: [],
  topicPost: [],
  topicPost: [],
  feeds_holders : [],
  topics_holders : [],
  group_holders : [],
  current_feed : {},
  cur_grp_posts : [],
  answered_breakers : [],
  contact_info : null,
  current_topic_posts : [],
  fetch_contact : false,
  msg_senders : null,
  gql_token : null,
  
  //Actions
  updateAnsweredBreakers: action((state, data) => {
    return (state.answered_breakers = data)
  }),
  updateFeeds: action((state, data) => {
    return (state.feeds = data)
  }),
  updateCurGrpPosts : action((state, data) => {state.cur_grp_posts = data}),
  updateCurTopicPosts : action((state, data) => {state.current_topic_posts = data}),
  updateFeedData : action((state,data)=>{state.feeds_data = data}),
  updateTopicData : action((state,data)=>{
    state.topic_data = data
  }),
  updateSenders : action((state,data)=>{
    state.msg_senders = data
  }),
  updateGroupData : action((state,data)=>{
    state.group_data = data
  }),
  updateFeedHolders : action((state,data)=>{
    state.feeds_holders = data
  }),
  updateTopicHolders : action((state,data)=>{
    state.topics_holders = data
  }),
  updateGroupHolders : action((state,data)=>{
    state.group_holders = data
  }),
  updateCurrentFeed : action((state,data)=>{
    state.current_feed = data
  }),
  updateGroupInfo: action((state, data) => {
    state.groupInfo = data
  }),
  updateContactInfo : action((state,data)=>{
    state.contact_info = data
  }),

  updateFetchContact : action((state,data)=>{
    state.fetch_contact = data
  }),

  updateFeedsOne: action((state, data) => {
    var index = state.feeds
      .map(function(e) {
        return e.id;
      })
      .indexOf(data.id);

    if (index < 0) {
      state.feeds.unshift(data);
    } else {
      let arr = [...state.feeds];
      arr[index] = data;
      state.feeds = arr;
    }
  }),

  updateTopics: action((state, data) => {
    state.topics = data
  }),

  updateMyTopics: action((state, data) => {
    state.myTopics = data
  }),

  updateTopicsOne: action((state, data) => {
    var index = state.topics
      .map(function(e) {
        return e.id;
      })
      .indexOf(data.id);

    if (index < 0) {
      state.topics.unshift(data);
    } else {
      let arr = [...state.topics];
      arr[index] = data;
      state.topics = arr;
    }
  }),

  updateMyTopicsOne: action((state, data) => {
    var index = state.myTopics
      .map(function(e) {
        return e.id;
      })
      .indexOf(data.id);

    if (index < 0) {
      state.myTopics.unshift(data);
    } else {
      let arr = [...state.myTopics];
      arr[index] = data;
      state.myTopics = arr;
    }
  }),

  updateTopicPost: action((state, data) => (state.topicPost = data)),

  updateGroups: action((state, data) => (state.groups = data)),

  updateGroupInfo: action((state, data) => (state.groupInfo = data)),

  updateMyGroups: action((state, data) => (state.myGroups = data)),

  updateGroupsOne: action((state, data) => {
    var index = state.groups
      .map(function(e) {
        return e.id;
      })
      .indexOf(data.id);

    if (index < 0) {
      state.groups.unshift(data);
    } else {
      let arr = [...state.groups];
      arr[index] = data;
      state.groups = arr;
    }
  }),

  updateMyGroupsOne: action((state, data) => {
    var index = state.myGroups
      .map(function(e) {
        return e.id;
      })
      .indexOf(data.id);

    if (index < 0) {
      state.myGroups.unshift(data);
    } else {
      let arr = [...state.myGroups];
      arr[index] = data;
      state.myGroups = arr;
    }
  }),

  updateGroupPost: action((state, data) => (state.groupPost = data)),
};

const userDetailsModel = {
  user: {},
  subscriptionStatus: {sub_status: false}, // change to null in production
  token: '',
  myPost: [],

  //Thunks
  appLogin: thunk(async (actions, payload) => {
    return new Promise((resolve, reject) => {
      apiFunctions
        .login(payload)
        .then(data => {
          global.token = data.token;
          global.user = data.user;

          storeData('token', data.token);
          storeData('user', data.user);

          actions.updateUser(data.user);
          actions.updateToken(data.token);

          resolve(data.user);
        })
        .catch(error => {
          if (error && error.msg && error.msg.email) {
            let error_msg = 'Oops! The email or password you’ve entered is incorrect.'
            Alert.alert('Herconomy', error_msg);
            return reject(false)
          }
          if (error.msg.non_field_errors) {
            let error_msg = error.msg.non_field_errors[0].includes('log in with provided credentials')
              ? 'Oops! The email or password you’ve entered is incorrect.'
              : error.msg.non_field_errors[0];
            Alert.alert('Herconomy', error_msg);
          } else {
            //ToastLong(error.msg);
            Alert.alert('Herconomy', 'Please check your internet and try again'); ///OUTPUT SERVER MESSAGE
          }
          reject(false);
        });
    });
  }),

  userPost: thunk(async (actions, payload) => {
    return new Promise((resolve, reject) => {
      apiFunctions
        .myPost(payload.token, payload.userId)
        .then(data => {
          actions.updateMyPost(data);
          resolve(true);
        })
        .catch(err => {
          //ToastLong('Unable to fetch your post at this time');
          reject(false);
        });
    });
  }),

  //Actions
  updateUser: action((state, data) => (state.user = data)),
  updateToken: action((state, data) => {
    state.token = data
  }),
  updateGqlToken : action((state, data) => {
    state.gql_token = data
  }),
  updateSubscriptionStatus: action((state, data) => (state.subscriptionStatus = data)),
  updateMyPost: action((state, data) => (state.myPost = data)),
};

const contactModel = {
  contacts: [],
  sent_requests: [],
  received_requests: [],
  sorted_contacts: [],

  updateMessagesBlock: action((state, data) => {
    state.contacts = data.contacts;
    state.sent_requests = data.sent_requests;
    state.received_requests = data.received_requests;
    state.sorted_contacts = data.sorted_contacts;
  }),
};

const retryFuncModel = {
  retry: false,
  funcCall: null,
  updateFunc: action((state, data) => {
    state.funcCall = data;
  }),
  updateRetry: action((state, data) => {
    state.retry = data;
  }),
};

const affinityModel = {
  affinity: {},
  updateAffinity: action((state, data) => (state.affinity = data)),
};

const notificationModel = {
  seen_notifications : [],
  tot_notifications : 0,
  updateTotNotification : action((state,data)=> {
    state.tot_notifications = data
  }),
  updateSeen : action((state,data)=> (state.seen_notifications = data))
}

const notificationBadgeModel = {
  hide_notifications: false,
  updateHideNotification: action((state, data) => (state.hide_notifications = data)),
};

const backgroundModel = {
  newMessage: '',
  updateMessages: action((state, data) => (state.newMessage = data)),
};

const pageCountModel = {
  feeds_page_num: 1,
  updateFeedsPage: action((state, data) => (state.feeds_page_num = data)),
};

const opportunityModel = {
  oppo: {},
  updateOpportunity: action((state, data) => (state.oppo = data)),
};

const searchResModel = {
  result: {},
  updateResult: action((state, data) => (state.result = data)),
};

const memberModel = {
  member: {},
  updateMember: action((state, data) => (state.member = data)),
};

const fundsModel = {
  funds: [],
  fundsHolder : [],
  search : " ",
  updateSearch : action((state,data)=>{
    //return(state.search = data)
  }),
  updateFunds : action((state,data)=>(state.funds = data)),
  updateFundsHolder : action((state,data)=>(state.fundsHolder = data)),
}

const otherOppsModel = {
  other_search : " ",
  oth_opp_holder : [],
  other_opps : [],
  updateOthHolder : action((state,data)=>(state.oth_opp_holder = data)),
  updateOthSearch : action((state,data)=>(state.other_search = data)),
  updateOthOpps : action((state,data)=>(state.other_opps = data)),
}

const AppStore = createStore({
  background: backgroundModel,
  community: communityModel,
  userDetails: userDetailsModel,
  allContacts: contactModel,
  opportunity: opportunityModel,
  member: memberModel,
  funds: fundsModel,
  otherOpps: otherOppsModel,
  resultModel: searchResModel,
  affinity: affinityModel,
  pageCount: pageCountModel,
  notification: notificationModel,
  notificationBadge: notificationBadgeModel,
  retryModel: retryFuncModel,
});

export default AppStore;
