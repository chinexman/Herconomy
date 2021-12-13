import React,{useState,useEffect} from 'react';
import {H1,P,H2,TouchFeedback} from './component';
import {Container, ScrollArea, Avatar, SizedBox, ImageWrap, TouchWrap, InputWrap,scaleFont, Rounded} from '@burgeon8interactive/bi-react-library';
import Colors from '../helpers/colors';
import { useStoreActions, useStoreState } from 'easy-peasy';
import moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';

const ImageTopTextBottomCard = ({navigation,data,navigateTo,tabName,status,setUpgrade}) => { 
    const updateAffinity = useStoreActions(actions=>actions.affinity.updateAffinity);
    let header_img = data.header_image || data.image;
    return (
        <Container padding={2}>
            <TouchFeedback onPress={() =>{
                if(!status){
                    setUpgrade(true);
                    return;
                }
            tabName === 'Affinity' ?  updateAffinity(data) : null
                navigation.navigate(navigateTo,{data,tabName:tabName})
            }}>
                <Container backgroundColor={Colors.whiteBase} elevation={5} widthPercent="100%" borderRadius={10}>
                    <Container>
                        <ImageWrap
                            height={15}
                            backgroundColor={Colors.primary}
                            url={header_img || data.banner}
                            borderRadius={8}
                            fit="cover"
                        />
                    </Container>
                    <Container paddingVertical={1} paddingHorizontal={5} paddingTop={3} paddingBottom={3}>
                        {
                            data.logo_image && (
                                <Container direction="row">
                                    <Avatar 
                                        url={data.logo_image}
                                        height={5}
                                    />
                                    <SizedBox width={2}/>
                                    <Container marginTop={1}>
                                        <P numberOfLines={1} fontSize={10}>{data.partner ? data.partner.name : ""}</P>
                                    </Container>
                                </Container>
                            )
                        }
                        <Container>
                            {
                                data.discount_expire && (
                                    <Container marginTop={1}> 
                                        <H1 fontSize={8}>Expires on {moment(data.discount_expire).format('MMMM DD, YYYY')}</H1>
                                    </Container>
                                )
                            }
                            {
                                data.short_description ? (
                                    <>
                                        <SizedBox height={1}/>
                                        <P numberOfLines={2}>{data.short_description}</P> 
                                    </>
                                ) : (
                                <>
                                    <H1 fontSize={10} flexWrap="wrap">{data.title ? data.title : data.name}</H1>
                                    <P fontSize={8} color={Colors.lightGrey}>{data.location}</P>
                                    <P numberOfLines={2}>{data.description}</P>
                                </>
                                )
                            }
                            <SizedBox height={2}/>
                            <Container direction="row">
                                <Container
                                    borderBottomWidth={0.5}
                                    borderBottomColor={Colors.line}
                                    width={data.short_description ? 30 : 25}
                                    widthPercent="50%"
                                >
                                    <P color={data.short_description ? Colors.primary : Colors.fadedText}>{data.short_description ? 'Offers Details' : 'Learn More'}</P>
                                </Container>
                            {
                                !status && tabName === 'Affinity' && (
                                    <Container widthPercent="50%" horizontalAlignment="flex-end">
                                        <Feather name="lock" size={scaleFont(10)}/>
                                    </Container>
                                )
                            }
                            </Container>
                        </Container>
                    </Container>
                </Container>
            </TouchFeedback>
        </Container>
    );
  }

  export default ImageTopTextBottomCard;