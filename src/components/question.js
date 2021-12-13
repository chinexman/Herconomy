import React, {useEffect,useState} from 'react';

import {useStoreState} from 'easy-peasy';
import {Container, TouchWrap, SizedBox, scaleFont, Avatar, ImageWrap} from '@burgeon8interactive/bi-react-library';
import {H1, H2, P, LocalAvatar, CommentBoxTemplate,TouchFeedback} from '../components/component';
import Colors from '../helpers/colors';
import { useNavigation } from '@react-navigation/core';
export const Question = ({item,comments,from_feed,index}) => {
    const navigation = useNavigation()
    return(
        <TouchFeedback
            onPress={()=>{
                navigation.navigate('FeedDetails', from_feed ? {main_feed_id : item.id,post_index : index} : {que_item: item})
            }}
        >
            <Container paddingHorizontal={5} paddingVertical={2} 
                borderColor={Colors.lightGrey} 
                borderWidth={1.5}
                horizontalAlignment="center"
                borderRadius={5}
            >
                <H1 textAlign="center" fontSize={9}>{item.body || item.post.body}</H1>
                <Container direction="row" marginTop={comments.length > 0 ? 2 : 1} wrap="wrap"  paddingHorizontal={7}
                >
                {
                   comments.slice(0,5).map((comment,i)=>(
                        <Container marginRight={1.3} key={i}>
                            {
                                comment.user.photo === null ? 
                                <LocalAvatar size={7} 
                                    marginBottom={3}
                                /> : 
                                <Avatar 
                                url={comment.user.photo} 
                                backgroundColor={Colors.primary}
                                size={7}
                                marginBottom={3}
                                />
                            }
                        </Container>
                    ))
                }
                {
                    comments.length > 5 && (
                        <Container marginLeft={2}>
                            <P>+{comments.length - 5}</P>
                        </Container>
                    )
                }
                </Container>
                <P fontSize={7} textAlign="center">{comments.length} 
                    {comments.length > 1 ? ' members have ' : ' member has '}
                answered</P>
            </Container>
        </TouchFeedback>
    )
}