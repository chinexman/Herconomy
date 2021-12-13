import React,{useState,useEffect} from 'react';
import {H1,P,H2,TouchFeedback} from './component';
import {Container, ScrollArea, Avatar, SizedBox, ImageWrap, TouchWrap, InputWrap,scaleFont} from '@burgeon8interactive/bi-react-library';
import Colors from '../helpers/colors';
import Loved from '../../assets/img/icons/love.png';
import moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import { apiFunctions } from '../helpers/api';
import {useStoreState} from 'easy-peasy';
import { ToastShort } from '../helpers/utils';
import {ActivityIndicator} from 'react-native';

const EventCard = ({navigation,data,navigateTo,groupByMonth,tabName,searching,myEvents,is_admin}) => {
    const event_months = [];
    data = tabName === 'myEvents' && !searching ? data.event : data;
    return (
      <Container>
          {
              groupByMonth && (
                <Container direction="row">
                    <Container
                        widthPercent="40%"
                        borderColor={Colors.line}
                        borderBottomWidth={2}
                        marginRight={2}
                        marginBottom={1}
                    ></Container>
                    <Container
                        widthPercent="20%"
                        horizontalAlignment="center"
                    >
                    <P>{data.talk_month}</P>
                    </Container>
                    <Container
                        widthPercent="40%"
                        borderColor={Colors.line}
                        borderBottomWidth={2}
                        marginLeft={2}
                        marginBottom={1}
                    ></Container>
                </Container>
              )
          }
          <Container padding={5}>
            <TouchFeedback onPress={() => navigation.navigate(navigateTo,{eventDetails:data,tabName:tabName,myEvents})}>
                <Container backgroundColor={Colors.whiteBase} elevation={5} widthPercent="100%" borderRadius={10}>
                    <Container>
                        <ImageWrap
                            borderRadius={10}
                            height={23}
                            backgroundColor={Colors.primary}
                            url={data.banner}
                        />
                    </Container>
                    <Container direction="row" paddingVertical={1} paddingLeft={4} paddingTop={3} paddingBottom={3}>
                        <Container horizontalAlignment="center" padding={2} widthPercent="23%">
                            <H1 color={Colors.primary}>{moment.utc(new Date(data.start_datetime)).format('MMM')}</H1>
                            <H1 color={Colors.primary}>{moment.utc(new Date(data.start_datetime)).format('DD')}</H1>
                            <P fontSize={1}>{moment.utc(new Date(data.start_datetime)).format('h:mm:ss a')}</P>
                            <Container 
                                paddingVertical={2.3}
                                padding={4}
                                >
                                    {
                                        !data.liked && (
                                            <Feather Icon name="heart" size={scaleFont(18)} color={Colors.primary} />
                                        )
                                    }
                                    {
                                      data.liked  && (
                                        <ImageWrap width={6} height={3}  source={Loved} fit="contain" />
                                    )
                                        
                                    }
                                    <SizedBox height={2}/>
                                    {is_admin ? (
                                        <TouchFeedback onPress={()=>navigation.navigate('AddGroupEvent',{"group_event" : data})}>
                                            <Feather name="edit" size={scaleFont(18)} color={Colors.primary}/>
                                        </TouchFeedback>
                                    ) : null}
                                    
                                </Container>
                        </Container>
                        <SizedBox width={0.6} />
                        <Container padding={2} widthPercent="70%">
                            <H1 fontSize={10} numberOfLines={1}>{data.title}</H1>
                            <P fontSize={8} color={Colors.lightGrey}>
                                {data.location === "null" && 
                                data.medium === "Virtual" ? "Online" : data.location}
                            </P>
                                <P numberOfLines={2}>{data.description}</P>
                            <SizedBox height={2}/>
                            <Container>
                                {
                                data.free ? (
                                    <H1 color={Colors.lightGreen} fontSize={8} textAlign="right">FREE</H1>
                                ): (
                                    <H1 color={Colors.lightGreen} fontSize={8} textAlign="right">&#x20A6;{Number(data.price).toLocaleString('en-US')}</H1>
                                )
                                }
                            </Container>
                            <SizedBox height={2}/>
                            <Container
                                borderBottomWidth={0.5}
                                borderBottomColor={Colors.line}
                                width={30}
                                horizontalAlignment="center"
                            >
                                <P>Learn More</P>
                            </Container>
                        </Container>
                    </Container>
                </Container>
            </TouchFeedback>
        </Container>
      </Container>
    );
  }

  export default EventCard;