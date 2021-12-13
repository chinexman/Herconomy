import io from 'socket.io-client';
import {storeData, getData, ToastSuccess, ToastError} from './functions';
import Toast from 'react-native-toast-message';
import moment from "moment"
import { socketConnection } from './sockets';

let tokenChecker = setInterval(() => {
  if (global.token) {
    clearInterval(tokenChecker);
    global.socket.on('disconnect', (reason) => {
      console.log("disconnect-reason",reason,global.socket);
      //global.socket = socketConnection();
      global.socket.connect();
    });
    global.socket.on('error',(err) => {
      global.socket.emit('offline', {user_id : global.user.id,token: global.token }, async (data) => {});
      console.log("error-listener",err)
      global.socket.connect();
    })
    global.socket.on("connect_error", (error) => {
      global.socket.emit('offline', {user_id : global.user.id,token: global.token }, async (data) => {});
      console.log("connect-error",error);
      global.socket.connect();
      // ...
    });
    global.socket.on('connect', () => {
      console.log("connect");
      global.socket.emit('online', {user_id : global.user.id,token: global.token }, async (data) => {});
      global.socket.emit('get_all_topics', {token: global.token }, async (data) => {});
      global.socket.emit('get_contact_info', {token: global.token }, data => {
      });
      global.socket.emit('get_all_groups', {token: global.token }, ({res}) => {});
    });
    global.socket.emit('get_all_feeds',{page:1,token : global.token}, res => {
      storeData('feeds_page_num',1);
      global.feeds = res.result;
      storeData('feeds', global.feeds);
    });

    global.socket.off('get_groups').on('get_groups', data => {
      storeData("group_update",true);
      var index = global.groups
        .map(function(e) {
          return e.id;
        })
        .indexOf(data.id);
      if (index < 0) {
        return global.groups.unshift(data);
      }
      if(global.the_post){
        /**
         * when viewing single post from notification, 
         * the particular post might not have been added to global.groups
         * */
        let post = global.the_post;
        return setGlobalPost(data,post);
      }
    });

    global.socket.off('get_topics').on('get_topics', data => {
      
    });

    global.socket.emit('get_all_groups',{token : global.token}, data => {
      data.sort((a, b) => a.name.localeCompare(b.name));
      global.groups = data;
      storeData('groups', data);
    });

    global.socket.emit('get_group',{token : global.token}, data => {});

    global.socket.emit('get_contact_info',{token : global.token}, data => {
    });
  }
}, 1000);

export const manageTopicData = async (data) => {
  try{
    let arr = await getData(`topic-${data.res.id}`);
    if(!global.the_post && data.post_index == -3){
      return null;
    }
    if(global.the_post && global.the_post.id === data.res.post.id){
      /**
       * when viewing single post from notification, 
       * the particular post might not have been added to global.topics
       * */
      let post = global.the_post;
      let cur_post = setGlobalPost(data,post);
      return cur_post;
    }
    if(!arr){
      return null;
    }
    console.log("manageTopicData<<>>",arr,data)
    storeData("topic_update",true);
    
    let post_index = data.post_index !== undefined && data.post_index !== null ? data.post_index : -1;
    if (post_index < 0) {
      arr.unshift(data.res.post);
      storeData(`topic-${data.res.id}`,arr);
      return arr;
    }
    //find the actual post topic
    if(!data.res.post.comment){
      //listening to post likes
      arr[post_index].likes = data.res.post.likes;
      storeData(`topic-${data.res.id}`,arr);
      return arr;
    }
    let old_comments;
    if(arr[post_index].comment !== null){
      old_comments = arr[post_index].comments ? arr[post_index].comments.result : arr[post_index].comment;
    }else{
      old_comments = arr[post_index].comment = [];
    }
    //let new_comment_index = old_comments.map(comment=> comment.id).indexOf(data.res.post.comment.id);
    let new_comment_index = data.comment_index !== null && data.comment_index !== undefined ? data.comment_index : -1; 
    if(new_comment_index < 0){
      old_comments.unshift(data.res.post.comment);
      storeData(`topic-${data.res.id}`, arr);
      return arr;
    }
    old_comments[new_comment_index].likes = data.res.post.comment.likes;
    if(data.res.post.comment.reply){
      //listening to replies
      old_comments[new_comment_index].replies = old_comments[new_comment_index].replies || {result : []};
      old_comments[new_comment_index].replies.result =  [data.res.post.comment.reply,...old_comments[new_comment_index].replies.result];
    }
    storeData(`topic-${data.res.id}`, arr);
    return arr;
  }catch(err){
    console.log("manageTopicData",err)
  }
}


export const manageGroupData = async (data) => {
  try{
    if(global.the_post){
      /**
       * when viewing single post from notification, 
       * the particular post might not have been added to global.groups
       * */
      let post = global.the_post;
      let cur_post = setGlobalPost(data,post);
      return cur_post;
    }
    console.log("manageGroupData",arr,data);
    let arr = await getData(`grp_post-${data.res.id}`);
    console.log("manageGroupData",arr,data);
    storeData("group_update",true);
    if(!arr) return;
    
    let index = data.post_index !== null ? data.post_index : -1;
    if (index < 0) {
      arr.unshift(data.res.post);
      storeData(`grp_post-${data.res.id}`,arr);
      return arr;
    }
    //find the actual post group
    if(!data.res.post.comment){
      //listening to post likes
      arr[index].likes = data.res.post.likes;
      storeData(`grp_post-${data.res.id}`, arr);
      return arr;
    }
    let old_comments;
    if(arr[index].comment !== null){
      old_comments = arr[index].comments ? arr[index].comments.result : arr[index].comment;
    }else{
      old_comments = arr[index].comment = [];
    }
    let new_comment_index = data.comment_index !== null ? data.comment_index : -1;
    if(new_comment_index < 0){
      old_comments.unshift(data.res.post.comment);
      storeData(`grp_post-${data.res.id}`, arr);
      return arr;
    }
    old_comments[new_comment_index].likes = data.res.post.comment.likes;
    if(data.res.post.comment.reply){
      //listening to replies
      old_comments[new_comment_index].replies = old_comments[new_comment_index].replies || {result : []};
      old_comments[new_comment_index].replies.result =  [data.res.post.comment.reply,...old_comments[new_comment_index].replies.result];
    }
    storeData(`grp_post-${data.res.id}`, arr);
    return arr;
  }catch(err){
    console.log("err",err)
  }
}

export const manageFeedData = async (data,type) => {

//   res:
// id: "41137cd5-8d6c-438e-af11-89464bd80e1e"
// post: {id: "e1b4b06a-ce42-4fbf-a56a-5c648ea65754", file: null, body: "what's up", user: {…}, created_at: "2021-08-10T08:31:12.179809Z", …}
// created_at: "2021-08-10T08:31:12.180783Z"
// new: false
// is_icebreaker: null
// __proto__: Object
// post_index: 0
// comment_index: null

  console.log("global.the_post",data,global.the_post);
  //&& data.id === global.the_post.id
  //prevent updates on other posts affect global.the_post;
  if(global.the_post && data.res.post.id === global.the_post.id){
    /**
     * when viewing single post from notification, 
     * the particular post might not have been added to global.feeds
     * */
    let post = global.the_post;
    let cur_post = setGlobalPost(data,post);
    return cur_post;
  }
  let global_data;
  let feeds = await getData('feeds');
  if(!feeds.length) return [];
  global_data = feeds;
  let arr = loadFeedData(data,global_data);
  Array.isArray(arr) && storeData(type,arr)
  return arr;
}

export const setGlobalPost = (data) => {
  try{
    console.log("setGlobalPost",data);
    let post = global.the_post;
    if(!data.res.post.comment){
      //listening to post likes
      post.likes = data.res.post.likes;
      return global.the_post = post;
      //return global.the_topic_post = post;
    }
  
    let old_comments = post.comments.result || post.comment;
    let new_comment_index = data.comment_index !== null && data.comment_index !== undefined 
    ? data.comment_index : -1;
    console.log("new_comment_index",new_comment_index)
    if(new_comment_index < 0){
      old_comments.unshift(data.res.post.comment)
      return global.the_post = post;
    }
    old_comments[new_comment_index].likes = data.res.post.comment.likes;
    if(data.res.post.comment.reply){
      //listening to replies
      old_comments[new_comment_index].replies = old_comments[new_comment_index].replies || {result : []};
      old_comments[new_comment_index].replies.result =  [data.res.post.comment.reply,...old_comments[new_comment_index].replies.result];
    }
    return global.the_post = post;
  }catch(err){
    console.log("err",err);
  }
}
export const loadFeedData = (data,global_data) => {
  try{
      // var index = global_data
      // .map(function(e) {
      //   return e.id;
      // })
      // .indexOf(data.id);
      var index = data.post_index !== null ? data.post_index : -1;
    /**
     * when someone comments on a post that user does not have currently
     */
    console.log("loadFeedData",global_data,data)
    if(index < 0 && moment(global_data[0].post.created_at).isAfter(data.res.post.created_at)){
      return global_data
    }
    if (index < 0 && global_data.length == 10) {
      global_data.pop();
      global_data.unshift(data.res);
      return global_data;
    }
    if (index < 0) {
      global_data.unshift(data.res);
      return global_data;
    }

    let arr = [...global_data];
    if(!data.res.post.comment){
      //listening to post likes
      arr[index].post.likes = data.res.post.likes;
      return arr;
    }
    
    let old_comments;
    if(arr[index].post.comment !== null){
      old_comments = arr[index].post.comments ? arr[index].post.comments.result : arr[index].post.comment;
    }else{
      old_comments = arr[index].post.comment = [];
    }
    //let new_comment_index = old_comments.map(comment=> comment.id).indexOf(data.post.comment.id);
    let new_comment_index = data.comment_index !== null ? data.comment_index : -1;
    console.log("new_comment_index>>>",new_comment_index,data)
    if(new_comment_index < 0){
      old_comments.unshift(data.res.post.comment)
      return arr;
    }
    old_comments[new_comment_index].likes = data.res.post.comment.likes;
    if(data.res.post.comment.reply){
      //listening to replies
      old_comments[new_comment_index].replies = old_comments[new_comment_index].replies || {result : []};
      old_comments[new_comment_index].replies.result =  [data.res.post.comment.reply,...old_comments[new_comment_index].replies.result];
    }
    return arr;
  }catch(err){
    console.log("err",err);
  }
}

export const Unlike = (path, id,post_index,comment_index = null) => {
  console.log("Unlike>>",post_index,comment_index);
  global.socket.emit(`unlike_${path}`, {[`${path}_id`]: id,token : global.token,
    post_index : post_index, comment_index : comment_index
  });
  return;
};

export const Like = (path, id,post_index,comment_index = null) => {
  console.log("Like>>",post_index,comment_index)
  global.socket.emit(`like_${path}`, {[`${path}_id`]: id,token : global.token,
    post_index : post_index, comment_index : comment_index
  },res=>{
  });
  return;
};

export const PostComment = fd => {
  global.socket.emit('post_comment',fd,res=>{
  });
  return;
};

export const PostReply = fd => {
  global.socket.emit('reply_comment', fd,res=>{
  });
  return;
};

export const Follow = fd => {
  global.socket.emit('follow_topic', fd, data => {
    var index = topic_data
      .map(function(e) {
        return e.id;
      })
      .indexOf(data.id);

    let arr = [...global.topics];
    arr[index] = data;
    updateTopicData(arr);
    storeData('topics',arr);
  });
  return;
};

export const SendMessages = fd => {
  global.socket.emit('send_message', fd);
  return;
};

export const ReportPost = fd => {
  global.socket.emit('report_post', fd);
  return;
};

export const DeletePost = fd => {
  global.socket.emit('delete_post', fd);
  return;
};

export const GetMessages = fd => {
  global.socket.emit('get_user_messages', fd);
  return;
};

export const ReadMessage = fd => {
  console.log("ReadMessage",fd)
  global.socket.emit('read_message', fd);
  return;
};

export const ReloadContactInfo = () => {
  global.socket.emit('get_contact_info', {token: global.token },data => {
  });
}

export const ListenGroupPost = fd => {
  global.socket.emit('get_group_posts', fd, res => {
    storeData("group_update",true);
    global.groupPost = res.post;
    global.currentGrpPost = res;
  });
};

export const ReloadGroups = (fd) => {
  global.socket.emit('get_all_groups_members', fd,(res) => {});
};
