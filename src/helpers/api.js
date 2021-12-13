import axios from 'axios';
import { Platform } from 'react-native';
import { storeData } from './functions';
export const endPoint = 'https://api.agstribe.org/api/v1';
//export const endPoint = 'https://stagging.agstribe.org/api/v1';
// export const base_ql_url = "https://socket-staging.agstribe.org/graphql"
// export const base_ql_http = "https://socket-staging.agstribe.org"
export const base_ql_url = "https://socket-live.agstribe.org/graphql"
export const base_ql_http = "https://socket-live.agstribe.org/"




export const apiFunctions = {
  registration: async fd => postNoToken('/rest-auth/registration/', fd),

  forgot: async fd => postNoToken('/accounts/password_reset_request/', fd),

  reset: async fd => postNoToken('/accounts/password_reset/', fd),

  login: async fd => postNoToken('/rest-auth/login/', fd),

  loginGoogle: async fd => postNoToken('/rest-auth/google/', fd),

  onboarding: async (token, userId, fd) => storeFilePut(`/users/ia${userId}/`, token, fd),
  onboarding1: async (token, userId, fd) => putAPIs(`/users/${userId}/`, token, fd),

  icebreakers: async token => getAPIs('/icebreakers/', token),

  ansIcebreakers: async (path, token, fd) => storeFile(path, token, fd),

  subscriptionStatus: async token => getAPIs('/subscription/get_subscription_status/', token),

  feeds: async token => getAPIs('/feeds/', token),
  getFeeds: async (token,page) => getAPIs(`/feeds/?page=${page}`, token),

  topics: async token => getAPIs('/topics/', token),

  groups: async token => getAPIs('/groups/', token),

  myGroups: async token => getAPIs('/groups/my_groups/', token),

  myTopicsPost: async (token, topicsId) => getAPIs(`/topics/${topicsId}/get_posts/`, token),

  myGroupsPost: async (token, groupId) => getAPIs(`/groups/${groupId}/get_posts/`, token),

  myGroupsPost: async (token, groupId) => getAPIs(`/groups/${groupId}/get_posts/`, token),

  myGroupRequests: async (token, groupId) => getAPIs(`/groups/${groupId}/admin_see_all_requests/`, token),

  groupRemoveUser: async (token, groupId, fd) => postAPIs(`/groups/${groupId}/admin_remove_user/`, token, fd),

  groupMakeAdmin: async (token, groupId, fd) => postAPIs(`/groups/${groupId}/admin_make_user_admin/`, token, fd),
  groupRequestAccept: async (token, groupId, fd) => postAPIs(`/groups/${groupId}/admin_accept_request/`, token, fd),
  groupRequestDecline: async (token, groupId, fd) => postAPIs(`/groups/${groupId}/admin_decline_request/`, token, fd),

  joinGroups: async (token, groupId, path) => postAPIs(`/groups/${groupId}/${path}/`, token, {}),

  myPost: async (token, userId) => getAPIs(`/users/${userId}/get_posts/`, token),

  like: async (token, fd, path) => postAPIs(`/posts/like_${path}/`, token, fd),

  unlike: async (token, fd, path) => postAPIs(`/posts/unlike_${path}/`, token, fd),

  follow: async (token, topicId) => postAPIs(`/topics/${topicId}/follow/`, token),

  unfollow: async (token, topicId) => postAPIs(`/topics/${topicId}/unfollow/`, token),

  newComment: async (token, postId, fd) => postAPIs(`/posts/${postId}/post_comment/`, token, fd),

  newFeedPost: async (token, fd, path) => postAPIs(path, token, fd),

  newFeedPostFile: async (token, fd, path) => storeFile(path, token, fd),

  newReply: async (token, fd) => postAPIs('/posts/reply_comment/', token, fd),

  getMessage: async (token, fd) => getAPIs('/chats/contacts/me/', token),

  sendMessageRequest: async (token, fd) => postAPIs('/chats/contacts/send_request/', token, fd),

  acceptMessageRequest: async (token, fd) => postAPIs('/chats/contacts/accept_request/', token, fd),

  sendMessage: async (token, fd) => postAPIs('/chats/send_message/', token, fd),

  getSentMessage: async (token, fd) => postAPIs('/chats/get_messages/', token, fd),

  search: async (token, keyword) => getAPIs(`/search/?keyword=${keyword}`, token),
  paidMembers: async (token, page) => getAPIs(`/users/all_paid_user/?page=${page}`, token),
  getMembers: async (token,sort,page) => getAPIs(`/users/all_user_basic_info/?sort=${sort}&page=${page}`,token),
  getInvestmentCategories : async (token) => getAPIs('/investment/investment_category/', token),
  getInvestment : async (token) => getAPIs('/investment/',token),
  getMyInvestment : async (token) => getAPIs('/my_investment/',token),
  getFundings : async (token) => getAPIs('/funds/',token),
  likeOppOperation : async (token,fd,oppGroup) => postAPIs(`/${oppGroup}/${fd}/like/`,token),
  unlikeOppOperation : async (token,fd,oppGroup) => postAPIs(`/${oppGroup}/${fd}/unlike/`,token),
  processOppApplication : async (token,fund_id,fd,type) => storeFile(`/${type}/${fund_id}/apply/`,token,fd),
  getScholarships : async (token) => getAPIs('/scholarships/',token),
  getJobs : async (token) => getAPIs('/jobs/',token),
  getEvents : async (token) => getAPIs('/event/',token),
  getMyEvents : async (token) => getAPIs('/my_event/',token),
  likeOrUnlikeEvent : async (token,event_id,action) => postAPIs(`/event/${event_id}/${action}/`,token),
  searchPaidMembers: async (token, keyword, page) => getAPIs(`/search/paid_users/?keyword=${keyword}&page=${page}`, token),
  bookSeat : async (token,event_id,action,fd) => postAPIs(`/event/${event_id}/${action}/`,token,fd),
  createTransaction : async (token,action,fd) => postAPIs(`${action}`,token,fd),
  payInvestment : async (token,fd) => postAPIs(`/investment/pay_investment/`,token,fd),
  searchUser: async (token, keyword, page) => getAPIs(`/search/users/?keyword=${keyword}&page=${page}`, token),
  payEvent : async (token,fd) => postAPIs(`/event/pay_event/`,token,fd),
  getAccountName : async (token,fd) => postAPIs(`/users/get_account_name/`,token,fd),
  getReferralInfo : async(token) => getAPIs(`/users/get_referral_info/`,token),
  updateAccountDetails : async(token,fd) => postAPIs(`/users/update_account_details/`,token,fd),
  getAccountInfo : async (token) => getAPIs(`/users/get_account_info/`,token),
  update_user : async (userId,token,fd) => putAPIs(`/users/${userId}/`,token,fd),
  createEducation : async (userId,token,fd) => postAPIs(`/users/${userId}/education/`,token,fd),
  createCurrentJob: async (userId, token, fd) => postAPIs(`/users/${userId}/current_job/`, token, fd),
  editCurrentJob: async (userId, token, fd) => putAPIs(`/users/${userId}/current_job/`, token, fd),
  getCurrentJobs: async (userId, token) => postAPIs(`/users/${userId}/current_job/`, token),
  editEducation : async (userId,token,fd) => putAPIs(`/users/${userId}/education/`,token,fd),
  fundApplications : async (token) => getAPIs(`/fund-applications/`,token),
  jobApplications : async (token) => getAPIs(`/job-applications/`,token),
  scholarshipApplications : async (token) => getAPIs(`/scholarships-applications/`,token),
  resendVerification: async fd => postNoToken('/accounts/resend_email_verification/', fd),
  getBlockedUsers: async token => getAPIs('/users/blocked_users/', token),
  blockUser: async (token, fd) => postAPIs('/users/block_user/', token, fd),
  unblockUser: async (token, fd) => postAPIs('/users/unblock_user/', token, fd),
  getPartners : async (token) => getAPIs(`/offers/`,token),
  getResources : async (token) => getAPIs(`/resource/`,token),
  getPlans : async (token) => getAPIs(`/subscription/get_subscription_plans/`,token),
  giftSomeone : async (token,fd) => postAPIs(`/subscription/gift_someone/`,token,fd),
  confirmPayment : async (token,fd) => postAPIs(`/subscription/confirm_card_payment/`,token,fd),
  confirmGifting : async (token,fd) => postAPIs(`/subscription/confirm_gift_payment/`,token,fd),
  getGifts : async (token) => getAPIs(`/subscription/my_gifts/`,token),
  validateEmail : async (token,fd) => postAPIs(`/users/validate_user/`,token,fd),
  subTransaction : async (token,fd) => postAPIs(`/subscription/create_transaction/`,token,fd),
  pwdChange : async (token,fd) => postAPIs(`/users/change_password/`,token,fd),
  getNotifications : async(token,userId,page) => getAPIs(`/push/notification/?page=${page}`,token),
  markAsSeen : async(token,notification_id) => putAPIs(`/push/${notification_id}/`,token),
  getQuestions : async(token) => getAPIs(`/askquestions/`,token),
  getAdvert : async(token) => getAPIs(`/adverts/get_event_advert/`,token),
  getSuggestedGroups : async(token) => getAPIs(`/groups/based_on_interest/`,token),
  createGroupEvent : async (token,group_id,fd) => storeFile(`/group_event/${group_id}/create_grp_event/`,token,fd),
  updateGroupEvent : async (token,group_id,fd) => storeFilePut(`/group_event/${group_id}/update_grp_event/`,token,fd),
  getGroupEvent : async (token,group_id) => getAPIs(`/group_event/${group_id}/get_single_grp_event/`,token),
  getPreference : async (token) => getAPIs(`/users/user_select_notification/`,token),
  updatePreference : async (token,fd) => postAPIs(`/users/user_select_notification/`,token,fd),
  getUsersWithImages : async (token,) => getAPIs(`/users/get_all_basic_users_with_images/`,token),
  getMsgNotification : async (token) => getAPIs(`/chats/get_viewed_messages/`,token),
  updateMsgNotification : async (token) => postAPIs(`/chats/update_viewed_messaages/`,token),
  generalUpdate : async (token) => putAPIs(`/push/general_update/`,token),
  getAllGroups : async (token) => getAPIs(`/groups/`,token),
  getAllTopics : async (token) => getAPIs(`/topics/`,token),
  getGrpPost : async (token,grp_id) => getAPIs(`/groups/${grp_id}/get_posts/`,token),
  getCurrentVersion : async (token) => getAPIs(`/version/get_app_version/`,token),
  getNotification : async (token,notification_id) => getAPIs(`/push/${notification_id}/`,token),
  getContacts : async (token) => getAPIs('/chats/get_contact_info/',token),
  passwordSavings : async (token,fd) => postAPIs('/users/verify_password_savings/',token,fd),
  deactivate_user  : async (token) => postAPIs(`/users/deactivate_user/`,token),
  send_mail : async (token,fd) => postAPIs(`/users/send_mail_after_login/`,token,fd)
};

export const getAPIs = (path, token) => {
  const source = axios.CancelToken.source();
  global.cancel = source.cancel
  return new Promise((resolve, reject) => {
    let split = path.split("/?");
    let url = split && split.length > 1 ? 
    `${endPoint}${path}&timestamp=${new Date().getTime()}` : 
    `${endPoint}${path}?timestamp=${new Date().getTime()}`;
    axios
      .get(`${url}`,{
        headers: {
          Authorization: `JWT ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': 0
        },
      },{
        cancelToken: source.token
      })
      .then(result => {
        resolve(result.data);
      })
      .catch(error => {
        if (axios.isCancel(error)) return;
        logError(endPoint,path,error)
        reject({status: 500, msg: error.response.data});
      });
      setTimeout(() => reject({status: 500, msg: 'Connection Error. Please try again later'}), 50000);
  });
};

const postAPIs = (path, token, fd) => {
  return new Promise((resolve, reject) => {
    axios({
      url: `${endPoint}${path}`,
      method: 'post',
      data: fd,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
    })
      .then(result => {
        resolve(result.data);
      })
      .catch(error => {
        logError(endPoint,path,error)
        if (error.response) {
          reject({status: 500, msg: error.response.data});
        } else {
          reject({status: 500, msg: 'Connection Error. Please try again later'});
        }
      });

    setTimeout(() => reject({status: 500, msg: 'Connection Error. Please try again later'}), 50000);
  });
};

const putAPIs = (path, token, fd) => {
  return new Promise((resolve, reject) => {
    axios({
      url: `${endPoint}${path}`,
      method: 'put',
      data: fd,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
    })
      .then(result => {
        resolve(result.data);
      })
      .catch(error => {
        logError(endPoint,path,error)
        if (error.response) {
          reject({status: 500, msg: error.response.data});
        } else {
          reject({status: 500, msg: 'Connection Error. Please try again later'});
        }
      });
      setTimeout(() => reject({status: 500, msg: 'Connection Error. Please try again later'}), 50000);
  });
};

const postNoToken = (path, fd) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${endPoint}${path}`, fd, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(result => {
        resolve(result.data);
      })
      .catch(error => {
        logError(endPoint,path,error)
        if (error.response) {
          reject({status: 400, msg: error.response.data});
        } else {
          reject({status: 400, msg: 'Connection Error. Please try again later'});
        }
      });

    setTimeout(() => reject({status: 500, msg: 'Connection Error. Please try again later'}), 50000);
  });
};

const storeFile = async (path, token, fd) => {
  return new Promise((resolve, reject) => {
    axios({
      url: `${endPoint}${path}`,
      method: 'POST',
      data: fd,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `JWT ${token}`,
      },
    })
      .then(res => {
        return resolve(res.data);
      })
      .catch(error => {
        logError(endPoint,path,error)
        return reject(error);
      });
});
};

const storeFilePut = async (path, token, fd) => {
  return new Promise((resolve, reject) => {
    axios({
      url: `${endPoint}${path}`,
      method: 'put',
      data: fd,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `JWT ${token}`,
      },
    })
      .then(res => {
        return resolve(res);
      })
      .catch(error => {
        logError(endPoint,path,error)
        return reject({status: 400, msg: 'Connection Error. Please try again later'});
      });

    setTimeout(() => reject({status: 500, msg: 'Connection Error. Please try again later'}), 50000);
  });
};

const logError = (endPoint,path,error) => {
  let msg = error.response ? error.response : error;
  let fd = {
    endpoint : `${endPoint}${path}`,
    log : JSON.stringify(msg),
    device : Platform.OS
  }
  axios({
    url: `${endPoint}/logs/`,
    method: 'post',
    data: fd,
    headers: {
      Accept: 'application/json',
    },
  })
}


export const handleQuery = (fd,token,timer = true) => {
  const source = axios.CancelToken.source();
  global.cancel = source.cancel
  return new Promise((resolve,reject)=>{
      axios.post(base_ql_url,{
        query : `${fd}`
      },
      token ? {
        headers : {
            Authorization : `Bearer ${token}`
        }
    } : null
      ).then(res=>{
          if(
              res && res.data && res.data.errors
            ){
            let error = res.data.errors[0]
            //logError(base_ql_url,fd,error)
            //console.log("error",error);
            let error_msg = {
                msg: "Network Error! Please try again",
                code : 500
            };
            if(error && error.extensions && error.extensions.exception && error.extensions.exception.data && 
              error.extensions.exception.data.data && error.extensions.exception.data.data[0]
                && error.extensions.exception.data.data[0].messages 
                && error.extensions.exception.data.data[0].messages[0]
            ){
                error_msg = {
                  msg :  error.extensions.exception.data.data[0].messages[0].message,
                  code  : error.extensions.exception.code
                }
            }
            return reject(error_msg);
          }
          return resolve(res.data);
      }).catch(error=>{
          console.log("error",error.response);
          let error_msg = {
            msg: "Network Error! Please try again",
            code : 500
        };
        if(error && error.response && error.response.data && 
            error.response.data.data && error.response.data.data[0]
            && error.response.data.data[0].messages 
            && error.response.data.data[0].messages[0]
        ){
            error_msg = {
               msg :  error.response.data.data[0].messages[0].message,
               code  : error.response.status
            }
        }
        return reject(error_msg);
      });
  });
}