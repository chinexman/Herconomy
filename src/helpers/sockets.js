import React from 'react';
import io from 'socket.io-client';
import {useStoreActions, useStoreState} from 'easy-peasy';
import {ToastShort} from './utils';
import {storeData} from './functions';

export const socketConnection = () => {
  console.log('socketConnection')
  //let url = "https://socket-staging.agstribe.org";
  let url = 'https://socket-live.agstribe.org';
  let socket = io(`${url}`,{
    transports: ['websocket'],
    pingTimeout: 600000,
    pingInterval: 2000,
    allowUpgrades : false,
    forceNew:true,
    reconnection: true,
    reconnectionDelay: 500,
	  reconnectionAttempts: Infinity, 
  });
  global.socket = socket;
  console.log("global.socket>>>",socket);
  return socket;
};

export const NewPost = (path, fd) => {
  if (global.socket.connected) {
    global.socket.emit(`post_${path}`, fd, data => {
    });
    //global.socket.emit('get_all_feeds', {});
    return;
  }
  const socket = socketConnection();
  socket.emit(`post_${path}`, fd);
  //socket.emit('get_all_feeds', {});
};

export const NewPostGroup = fd => {
  if (global.socket.connected) {
    global.socket.emit('post_to_group', fd);
    return;
  }
  const socket = socketConnection();
  socket.emit('post_to_group', fd);
};

export const PostComment = fd => {
  if (global.socket.connected) {
    global.socket.emit('post_comment', fd);
    return;
  }
  const socket = socketConnection();
  socket.emit('post_comment', fd);
};

export const PostReply = fd => {
  if (global.socket.connected) {
    global.socket.emit('reply_comment', fd);
    return;
  }
  const socket = socketConnection();
  socket.emit('reply_comment', fd);
};

export const ReportPost = fd => {
  if (global.socket.connected) {
    global.socket.emit('report_post', fd);
    return;
  }
  const socket = socketConnection();
  socket.emit('report_post', fd);
};

export const DeletePost = fd => {
  if (global.socket.connected) {
    global.socket.emit('delete_post', fd);
    return;
  }
  const socket = socketConnection();
  socket.emit('delete_post', fd);
};

export const Unlike = (path, id) => {
  if (global.socket.connected) {
    global.socket.emit(`unlike_${path}`, {[`${path}_id`]: id});
    return;
  }
  const socket = socketConnection();
  socket.emit(`unlike_${path}`, {[`${path}_id`]: id});
};

export const Like = (path, id) => {
  if (global.socket.connected) {
    global.socket.emit(`like_${path}`, {[`${path}_id`]: id});
    return;
  }
  const socket = socketConnection();
  socket.emit(`like_${path}`, {[`${path}_id`]: id});
};

export const UnFollowTopic = fd => {
  if (global.socket.connected) {
    global.socket.emit('unfollow_topic', fd);
    return;
  }
  const socket = socketConnection();
  socket.emit('unfollow_topic', fd);
};

export const FollowGroup = fd => {
  if (global.socket.connected) {
    global.socket.emit('join_group', fd, data => {
    });
    return;
  }
  const socket = socketConnection();
  socket.emit('join_group', fd);
};

export const GetMessages = fd => {
  if (global.socket.connected) {
    global.socket.emit('get_user_messages', fd);
    return;
  }
  const socket = socketConnection();
  socket.emit('get_user_messages', fd);
};

export const ReadMessage = fd => {
  if (global.socket.connected) {
    global.socket.emit('read_message', fd);
    return;
  }
  const socket = socketConnection();
  socket.emit('read_message', fd);
};

export const SentMessages = fd => {
  if (global.socket.connected) {
    global.socket.emit('send_message', fd);
    return;
  }
  const socket = socketConnection();
  socket.emit('send_message', fd);
};

export const AcceptMessages = fd => {
  if (global.socket.connected) {
    global.socket.emit('accept_chat_request', fd, data => console.log('Result', data));
    return;
  }
  const socket = socketConnection();
  socket.emit('accept_chat_request', fd);
};

export const RequestMessages = fd => {
  if (global.socket.connected) {
    global.socket.emit('send_request', fd, data => {
      global.requestMessage = data;
    });
  }
  const socket = socketConnection();
  socket.emit('send_request', fd);
};


export const RejectMessages = fd => {
  if (global.socket.connected) {
    global.socket.emit('reject_request', fd);
    return;
  }
  const socket = socketConnection();
  socket.emit('reject_request', fd);
};

export const DeleteRequest = fd => {
  if (global.socket.connected) {
    global.socket.emit('delete_request', fd, data => console.log('DELETE RESULT', data));
    return;
  }
  const socket = socketConnection();
  socket.emit('delete_request', fd, data => console.log('DELETE RESULT', data));
};

/* ANCHOR FEED SOCKET */
export const FeedSocket = () => {
  const {_updateFeeds, _updateFeedsOne} = useStoreActions(actions => ({
    _updateFeeds: actions.community.updateFeeds,
    _updateFeedsOne: actions.community.updateFeedsOne,
  }));

  React.useEffect(() => {
    let socket = global.socket ? global.socket : socketConnection();
    socket.on('disconnect', () => ToastShort('Connection Error'));

    setTimeout(() => {
      socket.on('get_all_feeds', res => {
       // _updateFeeds(res);
      });

      socket.on('get_feeds', res => {
        //_updateFeedsOne(res);
      });
    }, 250);
    // eslint-disable-next-line
  }, []);

  return <></>;
};

/* ANCHOR TOPIC SOCKET */
export const TopicSocket = () => {
  const {userD} = useStoreState(state => ({
    userD: state.userDetails.user,
  }));

  const {_updateTopics, _updateMyTopics, _updateTopicsOne, _updateMyTopicsOne} = useStoreActions(actions => ({
    //_updateTopics: actions.community.updateTopics,
    //_updateMyTopics: actions.community.updateMyTopics,
    //_updateTopicsOne: actions.community.updateTopicsOne,
    //_updateMyTopicsOne: actions.community.updateMyTopicsOne,
  }));

  React.useEffect(() => {
    let socket = global.socket ? global.socket : socketConnection();

    /* ANCHOR Topics Sockets */
    // socket.emit('get_all_topics', data => {
    //   data.sort((a, b) => a.title.localeCompare(b.title));
    //   let myTopics = [];
    //   let otherTopics = [];

    //   for (let i = 0; i < data.length; i++) {
    //     let miniData = data[i].followers.filter(ell => ell.id === userD.id);
    //     if (miniData.length > 0) {
    //       myTopics.push(data[i]);
    //     } else {
    //       otherTopics.push(data[i]);
    //     }
    //   }
    // });

    socket.on('get_topics', data => {
      // let miniData = data.followers.filter(ell => ell.id === userD.id);
      // if (miniData.length > 0) {
      //   //_updateMyTopicsOne(data);
      // } else {
      //   //_updateTopicsOne(data);
      // }
    });
  }, [userD.id]);

  return <></>;
};

/* ANCHOR GROUP SOCKET */
export const GroupSocket = () => {
  const {userD} = useStoreState(state => ({
    userD: state.userDetails.user,
  }));

  const {_updateGroups, _updateMyGroups, _updateGroupsOne, _updateMyGroupsOne} = useStoreActions(actions => ({
    _updateGroups: actions.community.updateGroups,
    _updateMyGroups: actions.community.updateMyGroups,
    _updateGroupsOne: actions.community.updateGroupsOne,
    _updateMyGroupsOne: actions.community.updateMyGroupsOne,
  }));

  React.useEffect(() => {
    let socket = global.socket ? global.socket : socketConnection();

    /* ANCHOR Group Sockets */
    // socket.emit('get_all_groups', data => {
    //   data.sort((a, b) => a.name.localeCompare(b.name));
    //   let myGroups = data.filter(el => el.is_member === true);
    //   let otherGroups = data.filter(el => el.is_member === false);

    //   //_updateGroups(otherGroups);
    //   //_updateMyGroups(myGroups);
    // });

    socket.on('get_groups', data => {
      //let miniData = data.filter(el => el.is_member === true);
      //miniData.length > 0 ? _updateMyGroupsOne(data) : _updateGroupsOne(data);
    });
  }, []);

  return <></>;
};

/* ANCHOR MESSAGE SOCKET */
export const MessageSocket = () => {
  const {userD} = useStoreState(state => ({
    userD: state.userDetails.user,
  }));

  const {_updateMessagesBlock} = useStoreActions(actions => ({
    _updateMessagesBlock: actions.allContacts.updateMessagesBlock,
  }));

  React.useEffect(() => {
    let socket = global.socket ? global.socket : socketConnection();

    /* ANCHOR Group Sockets */

    socket.on('get_contact_info', data => {
      // let groupArray = [];
      // data.sent_requests.forEach(el => {
      //   el.type = 'pending';
      //   groupArray.push(el);
      // });

      // let sortedContactArray = data.contacts.sort((x, y) => {
      //   let a = x.user.first_name.toLowerCase();
      //   let b = y.user.first_name.toLowerCase();
      //   return a === b ? 0 : a > b ? 1 : -1;
      // });

      // sortedContactArray.forEach(el => {
      //   el.type = 'contact';
      //   groupArray.push(el);
      // });

      // data.sorted_contacts = groupArray;
      // storeData('allContacts', data);
      // _updateMessagesBlock(data);
    });

    //socket.emit('get_contact_info', res => {});
  }, [_updateMessagesBlock]);

  return <></>;
};

export const NewMessageSocket = () => {
  const {updateMessages} = useStoreActions(action => ({updateMessages: action.background.updateMessages}));
  React.useEffect(() => {
    let socket = global.socket ? global.socket : socketConnection();
    socket.on('new_message', data => {
      //updateMessages('new_message');
    });
  }, [updateMessages]);
  return <></>;
};
