import React,{useEffect, useState} from 'react';
import {
  TextWrap,
  TouchWrap,
  Container,
  SizedBox,
  InputWrap,
  Page,
  scaleFont,
  Width,
  ImageWrap,
  Height,
  Avatar,
  Rounded,
  ScrollArea,
} from '@burgeon8interactive/bi-react-library';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {FullImageModal} from '../components/image_modal';
import Colors from '../helpers/colors';
import {View, Image, Switch, ActivityIndicator, Modal, Alert} from 'react-native';
import moment from 'moment';
import numeral from 'numeral';
import {useStoreState, useStoreActions} from 'easy-peasy';
import user_placeholder from '../../assets/img/icons/avatar.png';
import donePNG from '../../assets/img/done.gif';
import {calAmtToBeSaved, generateRandomString, getData, shareDetails, storeData, ToastError} from '../helpers/functions';
import { useNavigation } from '@react-navigation/native';
import ContentLoader, {BulletList,Facebook} from 'react-content-loader/native'
import { ScrollView, TouchableOpacity,TouchableNativeFeedback } from 'react-native-gesture-handler';
import Svg, {
  Circle,
  Ellipse,
  G,
  Text,
  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Use,
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask,
  SvgUri,
} from 'react-native-svg';
import {useClipboard} from '@react-native-community/clipboard';
import SavingLoader from '../../assets/lottie/load.json'
 
/* export const fontReg = 'CircularStd-Book';
export const fontSemi = 'CircularStd-Medium';
export const fontBold = 'CircularStd-Black'; */

export const fontReg = 'OpenSans-Regular';
export const fontSemi = 'OpenSans-SemiBold';
export const fontBold = 'OpenSans-Bold';

export const avatar = user_placeholder;
import stampPNG from '../../assets/img/stamp.png'
import { apiFunctions, base_ql_http, handleQuery } from '../helpers/api';
import { SentenceCase, ToastLong, ToastShort } from '../helpers/utils';
import { ModalWebView } from '../helpers/paystack_webview';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import { FONTSIZE, SAVING_TEST_KEY } from '../helpers/constants';

/* ANCHOR H1 */
export const H1 = props => (
  <TextWrap
    backgroundColor={props.backgroundColor}
    fontFamily={fontBold}
    textAlign={props.textAlign}
    lineHeight={props.lineHeight}
    numberOfLines={props.numberOfLines}
    fontSize={props.fontSize || 8}
    color={props.color || Colors.text}>
    {props.children}
  </TextWrap>
);

/* ANCHOR H2 */
export const H2 = props => (
  <TextWrap
    backgroundColor={props.backgroundColor}
    fontFamily={fontSemi}
    textAlign={props.textAlign}
    lineHeight={props.lineHeight}
    numberOfLines={props.numberOfLines}
    fontSize={props.fontSize || 8}
    color={props.color || Colors.text}>
    {props.children}
  </TextWrap>
);

/* ANCHOR P */
export const P = props => (
  <TextWrap
    backgroundColor={props.backgroundColor}
    fontFamily={fontReg}
    textAlign={props.textAlign}
    lineHeight={props.lineHeight}
    numberOfLines={props.numberOfLines}
    fontSize={props.fontSize || 8}
    color={props.color || Colors.text}>
    {props.children}
  </TextWrap>
);
export const Label = props => (
  <>
    <H1 color={Colors.black} fontSize={8}>
      {props.name}
    </H1>
    <SizedBox height={1} />
  </>
);
/* ANCHOR BUTTON */
export const Button = props => (
  <Container
    backgroundColor={props.backgroundColor || Colors.button}
    widthPercent={props.widthPercent || '100%'}
    horizontalAlignment="center"
    borderRadius={props.borderRadius || 10}
    borderColor={props.borderColor || Colors.button}
    borderWidth={props.borderWidth || 1}
  >
    {!props.loading ? (
      <TouchWrap widthPercent="100%" paddingVertical={props.paddingVertical || 2} onPress={props.onPress} horizontalAlignment="center">
        <H2 fontSize={props.fontSize || 10} color={props.color || Colors.buttonText}>
          {props.title}
        </H2>
      </TouchWrap>
    ) : (
      <TouchWrap widthPercent="100%" paddingVertical={2} onPress={props.onPress} horizontalAlignment="center">
        <ActivityIndicator color={Colors.buttonText} size="large" />
      </TouchWrap>
    )}
  </Container>
);

export const TouchWrapButton = props => (
  <Container
    backgroundColor={props.backgroundColor || Colors.button}
    widthPercent={props.widthPercent || '100%'}
    horizontalAlignment="center"
    borderRadius={props.borderRadius || 10}
    borderColor={props.borderColor || Colors.button}
    borderWidth={props.borderWidth || 1}>
    {!props.loading ? (
      <TouchWrap widthPercent="100%" paddingVertical={2} onPress={props.onPress} horizontalAlignment="center">
        <H2 fontSize={FONTSIZE.medium} color={Colors.buttonText}>
          {props.title}
        </H2>
      </TouchWrap>
    ) : (
      <TouchWrap widthPercent="100%" paddingVertical={2} onPress={props.onPress} horizontalAlignment="center">
        <ActivityIndicator color={Colors.buttonText} size="large" />
      </TouchWrap>
    )}
  </Container>
);

/* ANCHOR BUTTON INVERT */
export const ButtonInvert = props => (
  <Container
    backgroundColor={props.backgroundColor || '#E4E4E4'}
    widthPercent={props.widthPercent || '100%'}
    borderRadius={props.borderRadius || 10}
    borderColor={props.borderColor || Colors.button}
    borderWidth={props.borderWidth || 1
    }>
    {!props.loading ? (
      <TouchFeedback 
        widthPercent="100%" paddingVertical={1.5} onPress={props.onPress} 
        horizontalAlignment="center"
      >
        <H2 fontSize={10} color={Colors.button}>
          {props.title}
        </H2>
      </TouchFeedback>
    ) : (
      <TouchFeedback widthPercent="100%" paddingVertical={1.5} onPress={props.onPress} horizontalAlignment="center">
        <ActivityIndicator color={Colors.button} size="large" />
      </TouchFeedback>
    )}
  </Container>
);

/** TouchFeedback */
export const TouchFeedback = (props) => (
  <TouchableNativeFeedback
    onPress={props.onPress}
    //activeOpacity={0.9}
    delayPressIn={0}
    background={TouchableNativeFeedback.Ripple(null, true)}
    style={[
      {
        
        opacity: props.opacity,
        padding: Width(props.padding),
        paddingTop: Width(props.paddingTop),
        paddingBottom: Width(props.paddingBottom),
        paddingLeft: Width(props.paddingLeft),
        paddingRight: Width(props.paddingRight),
        paddingVertical: Height(props.paddingVertical),
        paddingHorizontal: Width(props.paddingHorizontal),
        flex: props.flex,
        backgroundColor: props.backgroundColor,
        borderBottomColor: props.borderBottomColor,
        borderBottomWidth: Width(props.borderBottomWidth),
        width: Width(props.width) || props.widthPercent,
        height: Height(props.height),
        borderRadius: props.borderRadius,
        justifyContent: props.verticalAlignment,
        alignItems: props.horizontalAlignment,
      },
      props.style,
    ]}>
      {props.children}
  </TouchableNativeFeedback>
);

/* ANCHOR INPUT */
export const Input = props => (
  <>
    <InputWrap
      numberOfLines={props.numberOfLines}
      fontFamily={fontSemi}
      value={props.value}
      onChangeText={props.onChangeText}
      onSubmit={props.onSubmit}
      color={props.color || Colors.text}
      placeholder={props.placeholder}
      placeholderTextColor={props.placeholderTextColor || Colors.greyBase900}
      borderColor={props.placeholderTextColor || Colors.greyBase900}
      textPaddingHorizontal={2}
      textPaddingVertical={1.8}
      borderWidth={0.4}
      borderRadius={10}
      fontSize={props.fontSize || 8}
      lineHeight={props.fontSize || 8}
      secure={props.secure}
      keyboardType={props.type}
      returnKeyType={props.returnKeyType}
      refValue={input => (props.index ? this[props.index] = input : null)}
      backgroundColor={props.backgroundColor || '#fff'}
      multiline={props.multiline}
      maxLength={props.maxLength}
    />
    <SizedBox height={2} />
  </>
);


export const ChatLoader = () => {
  return(
      <Container>
        {
          [..."123"].map((item,index)=>(
            <ContentLoader
              viewBox="0 0 800 400" height={20} width={450}
              backgroundColor={Colors.lightGrey}
              key={index}
            >
              {/* Only SVG shapes */}
              <Ellipse  cx="27.53" cy="26.15" rx="27.53" ry="26.15"/>
              <Rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
              <Rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
            </ContentLoader>
          ))
        }
      </Container>
  )
}

export const SavingsLoader = props => {
    return(
      [...'123'].map((item,i)=>(
        <ContentLoader 
          key={i}
          viewBox="0 0 778 116" width={350} height={100} {...props}
          backgroundColor={Colors.lightGrey}
        >
          <Rect x="37" y="34" rx="0" ry="0" width="0" height="0" />
          <Rect x="28" y="29" rx="0" ry="0" width="258" height="32" />
          <Rect x="28" y="71" rx="0" ry="0" width="465" height="32" />
          <Rect x="434" y="94" rx="0" ry="0" width="0" height="0" />
          <Rect x="29" y="116" rx="0" ry="0" width="749" height="32" />
        </ContentLoader>
      ))
    )
  }

export const PostsPlaceholder = () => (
  <ScrollView>
    <Container
      paddingHorizontal={5}
    >
      {
        [...'123'].map((item,index)=>(
          <ContentLoader viewBox="0 0 800 400" height={250} width={450}
            backgroundColor={Colors.lightGrey}
            key={index}
          >
            <Path d="M484.52,64.61H15.65C7.1,64.61.17,71.2.17,79.31V299.82c0,8.12,6.93,14.7,15.48,14.7H484.52c8.55,0,15.48-6.58,15.48-14.7V79.31C500,71.2,493.07,64.61,484.52,64.61Zm-9,204.34c0,11.84-7.14,21.44-15.94,21.44H436.39L359.16,171.52c-7.1-10.92-19.67-11.16-27-.51L258.64,277.94C253.78,285,245.73,286,240,280.2l-79.75-80.62c-6-6.06-14.33-5.7-20,.88L62.34,290.39H40.63c-8.8,0-15.94-9.6-15.94-21.44V110.19c0-11.84,7.14-21.44,15.94-21.44H459.54c8.8,0,15.94,9.6,15.94,21.44Z"/>
            <Ellipse  cx="27.53" cy="26.15" rx="27.53" ry="26.15"/>
            <Rect  x="69.36" y="0.5" width="87.36" height="16.48" rx="4.5"/>
            <Rect  x="0.53" y="328.35" width="87.36" height="16.48" rx="4.5"/>
            <Rect  x="95.84" y="328.35" width="87.36" height="16.48" rx="4.5"/>
            <Rect  x="195.38" y="328.35" width="304.45" height="16.48" rx="4.5"/>
            <Rect  x="412.47" y="358.52" width="87.36" height="16.48" rx="4.5" />
            <Rect  x="291.22" y="358.52" width="113.31" height="16.48" rx="4.5" />
            <Rect  x="0.53" y="358.52" width="282.21" height="16.48" rx="4.5" />
            <Rect  x="69.36" y="25.22" width="164.67" height="27.07" rx="3.83"/>  
        </ContentLoader>
        ))
      }
    </Container>
  </ScrollView>
)

export const TwoMenuLineTab = ({el,i,current,setCurrent}) => (
      <Container widthPercent="50%">
        <TouchFeedback
          onPress={() => {
            setCurrent(el.name)
          }}>
          <Container
            paddingBottom={1}
            backgroundColor={Colors.white}
            horizontalAlignment="center"
            borderBottomWidth={el.name ===  current ? 5 : null}
            borderColor={el.name === current ? Colors.primary : null}>
            <H1 fontSize={FONTSIZE.semiBig} color={el.name === current ? Colors.primary : Colors.text}>
              {el.name.replace(/_/g,' ').split('List')[0]} {/**Remove 'List' from 'FundingList' */}
            </H1>
          </Container>
        </TouchFeedback>
      </Container>
)

export const ImageCardHolder = () => (
  <ScrollView showsVerticalScrollIndicator={false}>
    <Container
      paddingHorizontal={5}>
      {
        [...'123'].map((item,index)=>(
          <ContentLoader viewBox="0 0 850 400" 
          height={200} 
          width={480}
            key={index}
            backgroundColor={Colors.lightGrey}
          >
            <Path d="M484.52,64.61H15.65C7.1,64.61.17,71.2.17,79.31V299.82c0,8.12,6.93,14.7,15.48,14.7H484.52c8.55,0,15.48-6.58,15.48-14.7V79.31C500,71.2,493.07,64.61,484.52,64.61Zm-9,204.34c0,11.84-7.14,21.44-15.94,21.44H436.39L359.16,171.52c-7.1-10.92-19.67-11.16-27-.51L258.64,277.94C253.78,285,245.73,286,240,280.2l-79.75-80.62c-6-6.06-14.33-5.7-20,.88L62.34,290.39H40.63c-8.8,0-15.94-9.6-15.94-21.44V110.19c0-11.84,7.14-21.44,15.94-21.44H459.54c8.8,0,15.94,9.6,15.94,21.44Z"/>
            <Rect  x="95.84" y="328.35" width="87.36" height="16.48" rx="4.5"/>
            <Rect  x="195.38" y="328.35" width="304.45" height="16.48" rx="4.5"/>
            <Rect  x="412.47" y="358.52" width="87.36" height="16.48" rx="4.5" />
            <Rect  x="291.22" y="358.52" width="113.31" height="16.48" rx="4.5" />
            <Rect  x="0.53" y="358.52" width="282.21" height="16.48" rx="4.5" />
            <Rect  x="69.36" y="25.22" width="164.67" height="27.07" rx="3.83"/>  
        </ContentLoader>
        ))
      }
    </Container>
  </ScrollView>
)

export const GrpPlaceholder = () => (
  <ScrollView showsVerticalScrollIndicator={false}>
    <Container horizontalAlignment="center">
      {
        [...'123456789'].map((item,index)=>(
          <BulletList 
            backgroundColor={Colors.lightGrey}
            key={index}
          />
        ))
      }
    </Container>
  </ScrollView>
)

export const BoxLoader = () => (
  <ContentLoader
    width={350}
  backgroundColor={Colors.lightGrey}
  ></ContentLoader>
)


/* ANCHOR DROP DOWN */
export const Dropdown = props => (
  <TouchWrap widthPercent={props.width || '100%'} onPress={props.onPress}>
    <Container
      backgroundColor={props.backgroundColor || "#fff"}
      widthPercent={props.width || '100%'}
      paddingHorizontal={4}
      paddingVertical={1.8}
      direction="row"
      verticalAlignment="center"
      horizontalAlignment="space-between"
      borderColor={props.placeholderTextColor || Colors.greyBase900}
        borderWidth={props.borderWidth || 0.4}
        borderRadius={props.borderRadius || 2}>
      {props.value ? (
        <H2 fontSize={props.fontSize || 8} color={props.color}>
          {props.value}
        </H2>
      ) : (
        <H2 fontSize={props.fontSize || 8} color={props.color || Colors.greyBase900}>
          {props.placeholder}
        </H2>
      )}

      <Feather Icon name="chevron-down" size={scaleFont(15)} color={Colors.greyBase900} />
    </Container>
    <SizedBox height={2} />
  </TouchWrap>
);


/* ANCHOR DROP DOWN */
export const DropdownSmall = props => (
  <>
    <TouchWrap widthPercent={props.width || '100%'} onPress={props.onPress} marginBottom={1}>
      <Container
        backgroundColor={props.backgroundColor || "#fff"}
        direction="row"
        verticalAlignment="center"
        horizontalAlignment="space-between"
        widthPercent="100%"
        paddingHorizontal={2}
        paddingVertical={1.8}
        borderWidth={props.borderWidth || 0.1}
        borderColor={props.borderColor || Colors.black}
        paddingLeft={3}
        borderRadius={props.borderRadius || 2}>
        <P fontSize={props.fontSize || 11} color={props.color || Colors.greyBase900}>
          {props.placeholder}
        </P>

        <Feather Icon name="chevron-down" size={scaleFont(15)} color={Colors.greyBase900} />
      </Container>
    </TouchWrap>
  </>
);

/* ANCHOR PAGE BACK */
export const AppPageBack = props => (
  <Page barIconColor="light" backgroundColor={Colors.primary}>
    <Container paddingHorizontal={6} paddingTop={6} direction="row" verticalAlignment="center">
      <TouchFeedback 
      //paddingRight={5} paddingTop={1.5} paddingBottom={1.5}
      style={{
        paddingRight : 5,
        paddingTop : 1.5,
        paddingBottom : 1.5
      }} onPress={() => props.navigation.goBack()}>
        <Feather Icon name="chevron-left" size={scaleFont(FONTSIZE.menu)} color="#fff" />
      </TouchFeedback>

      {props.avatar ? <Container marginRight={3}>{props.avatar}</Container> : null}
      {props.title ? (
        <H1 fontSize={FONTSIZE.page} color="#fff">
          {props.title}
        </H1>
      ) : null}
    </Container>

    <SizedBox height={2} />

    <Container
      paddingHorizontal={props.paddingHorizontal || 7}
      backgroundColor={props.color || Colors.white}
      flex={1}
      borderTopLeftRadius={50}
      borderTopRightRadius={50}>
      {props.children}
    </Container>
  </Page>
);

/* ANCHOR PAGE BACK */
export const AppPageTitle = props => (
  <Page barIconColor="light" backgroundColor={Colors.primary}>
    <Container paddingHorizontal={6} paddingTop={6} direction="row" horizontalAlignment="space-between">
      <TouchFeedback paddingRight={3} paddingBottom={3} onPress={() => props.navigation.goBack()}>
        <Feather Icon name="chevron-left" size={scaleFont(25)} color="#fff" />
      </TouchFeedback>

      <H1 color="#fff" fontSize={18}>
        {props.title}
      </H1>

      <TouchFeedback paddingLeft={3} paddingBottom={3} onPress={() => props.navigation.goBack()}>
        <Feather Icon name="plus" size={scaleFont(25)} color="#fff" />
      </TouchFeedback>
    </Container>

    <SizedBox height={2} />

    <Container paddingHorizontal={7} backgroundColor={Colors.white} flex={1} borderTopLeftRadius={50} borderTopRightRadius={50}>
      {props.children}
    </Container>
  </Page>
);

/* ANCHOR LOCAL AVATAR */
export const LocalAvatar = props => (
  <View style={{width: Width(props.size), height: Width(props.size), marginLeft: Width(props.marginLeft)}}>
    <Image
      source={avatar}
      style={{
        width: Width(props.size),
        borderRadius: Width(props.size) / 2,
        height: Width(props.size),
      }}
    />
  </View>
);

/* ANCHOR CHECKBOX*/
export const CheckBok = props => (
  <TouchFeedback onPress={props.onPress}>
    <View
      style={{
        width: Width(props.dimension || 6),
        justifyContent: 'center',
        alignItems: 'center',
        height: Width(props.dimension || 6),
        borderRadius: Width(3),
        backgroundColor: '#fff',
        borderColor: Colors.primary,
        borderWidth: 2,
      }}>
      {props.status ? <Avatar size={3.5} backgroundColor={Colors.primary} /> : null}
    </View>
  </TouchFeedback>
);

/* ANCHOR CHECKBOX*/
export const CheckBox2 = props => (
  <TouchWrap onPress={props.onPress}>
    <View
      style={{
        width: Width(6),
        justifyContent: 'center',
        alignItems: 'center',
        height: Width(6),
        borderRadius: Width(1),
        backgroundColor: '#fff',
        borderColor: Colors.greyBase900,
        borderWidth: 2,
      }}>
      {props.status ? <Feather Icon name="check" size={scaleFont(14)} color={Colors.button} /> : null}
    </View>
  </TouchWrap>
);

export const SwitchWrap = props => (
  <Switch
    trackColor={{false: Colors.offWhite, true: Colors.offWhite}}
    thumbColor={props.enabled ? Colors.primary : Colors.offWhite}
    ios_backgroundColor="#3e3e3e"
    onValueChange={props.toggleSwitch}
    value={props.enabled}
  />
);

/* ANCHOR HORIZONTAL GRID*/
export const HGrid = props => (
  <Container direction="row" verticalAlignment="center" horizontalAlignment="space-between" style={{marginTop: Height(props.marginTop)}}>
    {props.children}
  </Container>
);

/* ANCHOR PLAIN FEEDBOX */
export const PlainFeedBox = props => {
  let post = props.data;
  let user = post.user;
  const {updateResult} = useStoreActions(action=>(
    {updateResult:action.resultModel.updateResult}
  ))
  const [show,setShow] = useState(false)
  const [current_image,setCurrentImage] = useState(null);
  return (
    <Container borderColor={post.content_type === "sponsor" ? Colors.line : ""} 
      borderWidth={post.content_type === "sponsor" ? 2 : 0} 
      paddingHorizontal={post.content_type === "sponsor" ? 6 : 0} paddingVertical={post.content_type === "sponsor" ? 2 : 0}
      marginBottom={post.content_type === "sponsor" ? 2 : 0}
    >
      {
        post.content_type !== "sponsor" ? (
          <Container direction="row" verticalAlignment="center" paddingTop={1.5}>
            <Container width={15} horizontalAlignment="center">
            {user.photo ? 
                  <TouchFeedback onPress={()=>{
                    if(props.placeholder){
                      return;
                    }
                    setShow(true)
                    setCurrentImage(user.photo)
                  }}>
                    <Avatar backgroundColor="#efefef" size={10} url={user.photo} />
                  </TouchFeedback> : (
                    <TouchFeedback onPress={()=>{
                      if(props.placeholder){
                        return;
                      }
                      setShow(true)
                      setCurrentImage(null)
                    }}>
                      <LocalAvatar size={10} />
                    </TouchFeedback>
                  )}
            </Container>
            
            <Container paddingLeft={3}>
              <TouchFeedback
                onPress={async ()=>{
                  if(props.placeholder || props.from_profile){
                    return;
                  }
                  await updateResult(user);
                  props.navigation.navigate('Profile',{
                      member_info:user
                  })
                }}
                borderBottomWidth={0.1} borderBottomColor={Colors.line}
              >
                <Container direction="row">
                            <H1 fontSize={FONTSIZE.medium}>
                              {user.first_name} {user.last_name}
                            </H1>
                              <SizedBox width={1} />
                              {
                                user.status ? (
                                  <Avatar backgroundColor={Colors.primary} 
                                    size={1.5}
                                  />
                                ) : (
                                  <Avatar backgroundColor={Colors.lightGrey} 
                                    size={1.5}
                                  />
                                )
                              }
                            </Container>
              </TouchFeedback>
              <SizedBox height={2}/>
              <P fontSize={FONTSIZE.small} color={props.placeholder ? Colors.fadedText : null}>
                  {post && post.created_at ? moment(post.created_at, 'YYYY-MM-DDTHH:mm:ss.SSS')
                .local()
                .fromNow() : null}
              </P>
            </Container>
          </Container>
        ) : (
          <Container paddingLeft={3} marginBottom={1}>
            <H1>Sponsored!</H1>
          </Container>
        )
      }
      {
        show && <FullImageModal setShow={setShow} image={current_image} />
      }
      <SizedBox height={1} />

      <Container direction="row" verticalAlignment="flex-start" borderColor={Colors.primary} 
        borderBottomWidth={post.content_type !== "sponsor" ? 1 : 0} 
        paddingBottom={2}
      >
        {/**ANCHOR SIDE ICONS */}
        {post.content_type !== "sponsor" && (<Container width={15} horizontalAlignment="center" />)}

        {post ? (
          <Container paddingLeft={3} paddingRight={2} flex={1}>
            <Container borderColor="#efefef" borderBottomWidth={0} paddingBottom={1}>
            {
              props.placeholder ? (
                <ActivityIndicator width={5} color={Colors.button} size={15}/>
              ) : null
            }
            <P fontSize={FONTSIZE.medium} color={props.placeholder ? Colors.fadedText : null}>{post.body ?  SentenceCase(post.body) : null}</P>

              {post.file ? (
                <TouchFeedback onPress={()=>{
                  if(props.placeholder){
                    return;
                  }
                  setShow(true)
                  setCurrentImage(post.file)
                }}>
                    <Container marginTop={1}>
                      <ImageWrap height={20} borderRadius={10} backgroundColor="#efefef" url={post.file} fit="cover" />
                    </Container>
                </TouchFeedback>
              ) : null}
            </Container>

            {/**ANCHOR BOTTOM ICONS */}
            <Container
              borderColor="#efefef"
              borderBottomWidth={0}
              paddingBottom={0}
              direction="row"
              horizontalAlignment="space-between"
              verticalAlignment="center">
              <TouchFeedback onPress={()=>{
                if(props.placeholder || props.from_profile){
                  return;
                }
                props.onPress()
              }}>
                <Container direction="row" verticalAlignment="center" padding={1.5}>
                  <Feather Icon name="message-circle" color={Colors.greyBase900} size={scaleFont(FONTSIZE.icon)} />

                  <SizedBox width={1} />

                  <P color={Colors.greyBase900} fontSize={8}>
                     {numeral(post.comments && post.comments.result 
                      && post.comments.result.length ? post.comments.result.length : post.comment ? post.comment.length : 0
                    ).format('0,0')}
                  </P>
                </Container>
              </TouchFeedback>

              <Container direction="row" verticalAlignment="center">
                <TouchFeedback paddingRight={2} onPress={()=>{
                    if(props.placeholder){
                      return;
                    }
                    props.onPressLD()
                  }}>
                  <Container direction="row" verticalAlignment="center" padding={1.5}>
                    {post.likes.filter(el => el.id === props.userD.id).length > 0  || (props.likes && props.likes.includes(post.id) !== false) ? (
                      <Ionicons Icon name="ios-heart" color="red" size={scaleFont(FONTSIZE.icon)} />
                    ) : (
                      <Feather Icon name="heart" color={Colors.greyBase900} size={scaleFont(FONTSIZE.icon)} />
                    )}
                  </Container>
                </TouchFeedback>
                <TouchFeedback onPress={()=>{
                  //return console.log("post>>",post);
                  if(!post.likes.length){
                    return;
                  }
                  props.navigation.navigate("PostLikes",post.likes);
                }}>
                    <P fontSize={8} color={Colors.greyBase900}>
                      Liked by {numeral(post && post.likes ? post.likes.length : 0).format('0 a')}
                    </P>
                </TouchFeedback>
              </Container>

              <TouchFeedback paddingRight={2} onPress={()=>{
                if(props.placeholder){
                  return;
                }
                shareDetails({message:post.body,user:`${user.first_name} ${user.last_name}`,
                  file : post.file,time : `[ ${moment(post.created_at).format('MMM DD YYYY')} at ${moment(post.created).format('h:mm:ss a')} ]`
                })
              }}>
                <Container direction="row" verticalAlignment="center" padding={1.5}>
                  <Feather Icon name="share-2" color={Colors.greyBase900} size={scaleFont(FONTSIZE.icon)} />
                </Container>
              </TouchFeedback>
            </Container>
          </Container>
        ) : null}
      </Container>
    </Container>
  );
};


export const WellDone = ({setShow,text,onPressD,btn_text}) => {
  return(
    <Container 
        backgroundColor={Colors.whiteBase}
        widthPercent="100%"
        borderRadius={5}
        paddingVertical={4}
        height={70}
        paddingHorizontal={10}
        horizontalAlignment="center"
        verticalAlignment="space-between"
        flex={1}
      >
          <Container widthPercent="50%"
            height={40}
          >
            <ImageWrap 
              fit={'contain'}
              flex={1}
              source={donePNG}
            />
          </Container>
          <Container horizontalAlignment="center">
            <H1 fontSize={20}>Well Done!</H1>
            {
              text ? (
                <P>{text}</P>
              ) : null
            }
              <SizedBox height={2} />
          </Container>
          <Button title={btn_text || "Back to Wallet"}
            backgroundColor={Colors.primary}
            borderColor={Colors.primary}
            borderRadius={5}
            onPress={()=>{
              if(text || onPressD){
                return onPressD()
              }
              setShow(false)
            }}
            fontSize={8}
          />
          <SizedBox height={4} />
      </Container>
  )
}

export const AddMoney = ({setSendPlan,setShow,type,target_amt,hide_wallet_option,current_index,reload,
  tab_name}) => {
  const [plans,setPlans] = React.useState([]);
  const [showList,setShowList] = useState("select plan");
  const [loading,setLoading] = React.useState(false);
  const [retry,setRetry] = React.useState(false);
  const [amount,setAmount] = React.useState(target_amt)
  const [destination,setDestination] = React.useState(null)

  const fetchData = async () => {
    try{
      setLoading(true);
      let gql_user = await getData('gql_user');
      let gql_token = await getData('gql_token');
      let query = "";
      query = type !== "goal" && tab_name !== "All" ? `query{
        challenges : userSavingsChallenges(
          where : {user_id : ${gql_user.id}}  
          sort : "created_at:desc"
        ){
          id
          amount_saved
          percentage
          target_amount
          start_date
          percentage
          frequency
          roi
          saving_challenges_id{
            title
            description
            amount_to_be_saved
            maturity_date
          }
        }
      }`:
      tab_name !== "All" && type === "goal" ? `query{
        goals : userGoals(
          where : {user_id : ${gql_user.id},status_in : ["Not_Started","In_Progress","Suspend_Auto_Charge"]}
          sort : "created_at:desc"
        ){
          id
          title
          target_amount
          amount_saved
          start_date
          end_date
          description
          percentage
          frequency
          roi
        }
      }` : `query{
            goals : userGoals(
              where : {user_id : ${gql_user.id},status_in : ["Not_Started","In_Progress","Suspend_Auto_Charge"]}
              sort : "created_at:desc"
            ){
              id
              title
              target_amount
              amount_saved
              start_date
              end_date
              description
              percentage
              frequency
              roi
            }
            challenges : userSavingsChallenges(
              where : {user_id : ${gql_user.id}}  
              sort : "created_at:desc"
            ){
              id
              amount_saved
              percentage
              target_amount
              start_date
              percentage
              frequency
              roi
              saving_challenges_id{
                title
                description
                amount_to_be_saved
                maturity_date
              }
            }
      }`;
      let res = await handleQuery(query,gql_token)
      let data = [];
      if(tab_name === "All" && res && res.data && res.data.goals && res.data.challenges){
        let goals  = Array.isArray(res.data.goals) ? res.data.goals.map((item)=>(
          {
            name : item.title,
            id : item.id,
            amount : item.amount_saved,
            description : item.description,
            frequency : item.frequency,
            target_amount : item.target_amount,
            end_date : item.end_date,
            start_date : item.start_date
          }
        )) : []
        let challenges = Array.isArray(res.data.challenges) ? res.data.challenges.map((item)=>(
          {
            name :  item.saving_challenges_id && item.saving_challenges_id.title ? 
              item.saving_challenges_id.title : "",
            id : item.id,
            amount : item.amount_saved,
            description : item.saving_challenges_id && item.saving_challenges_id.description ? 
            item.saving_challenges_id.description : "",
            frequency : item.frequency,
            target_amount : item.target_amount,
            end_date : item.saving_challenges_id && item.saving_challenges_id.maturity_date ? 
            item.saving_challenges_id.maturity_date : null,
            start_date : item.start_date
          }
        )) : []
        data = [{
          name : "My Wallet",
          id : null,
          amount : gql_user.wallet_balance,
          description : "Wallet topup"
        },...challenges,...goals];
      }
      if(type === "goal" && tab_name !== "All" && res && res.data && res.data.goals){
        let items  = Array.isArray(res.data.goals) ? res.data.goals.map((item)=>(
          {
            name : item.title,
            id : item.id,
            amount : item.amount_saved,
            description : item.description,
            frequency : item.frequency,
            target_amount : item.target_amount,
            end_date : item.end_date,
            start_date : item.start_date
          }
        )) : []
        data = [{
          name : "My Wallet",
          id : null,
          amount : gql_user.wallet_balance,
          description : "Wallet topup"
        },...items];
      } 
      if(type !== "goal" && tab_name !== "All" && res && res.data && res.data.challenges){
        let items = Array.isArray(res.data.challenges) ? res.data.challenges.map((item)=>(
          {
            name :  item.saving_challenges_id && item.saving_challenges_id.title ? 
              item.saving_challenges_id.title : "",
            id : item.id,
            amount : item.amount_saved,
            description : item.saving_challenges_id && item.saving_challenges_id.description ? 
            item.saving_challenges_id.description : "",
            frequency : item.frequency,
            target_amount : item.target_amount,
            end_date : item.saving_challenges_id && item.saving_challenges_id.maturity_date ? 
            item.saving_challenges_id.maturity_date : null,
            start_date : item.start_date
          }
        )) : []
        data = [{
          name : "My Wallet",
          id : null,
          amount : gql_user.wallet_balance,
          description : "Wallet topup"
        },...items];
      }
      setPlans(data)
      let selected = current_index !== undefined && current_index !== null && data && data[current_index + 1] ? 
        data[current_index + 1] : {
          name : "My Wallet",
          id : null,
          amount : gql_user.wallet_balance,
          description : "Wallet topup"
        }
      setDestination(selected)
      setLoading(false);
    }catch(err){
      console.log("errr",err);
      setLoading(false)
      setRetry(true);
    }
  } 
  React.useEffect(()=>{
    fetchData();
  },[])
  return(
      <React.Fragment>
        {
            showList === "select plan" ? (
              <SelectPlan 
                setShow={setShow} 
                setShowList={setShowList}
                setAmount={setAmount}
                amount={amount}
                destination={destination}
              />
            ) : showList === "weldone" ? (
                <WellDone showList={showList} setShow={setShow}/>
            ) : showList === "payment" ? (
              <PaymentMethods 
                setShowList={setShowList} setSendPlan={setSendPlan}
                setShow={setShow}
                destination={destination}
                type={type}
                amount={amount}
                hide_wallet={hide_wallet_option}
                reload={reload}
              />
            ) : (
                <PlansList 
                  setShowList={setShowList} 
                  setSendPlan={setSendPlan} 
                  setShow={setShow}
                  plans={plans}
                  loading={loading}
                  setDestination={setDestination}
                  destination={destination}
              />
            )
        }
      </React.Fragment>
  )
}

const PaymentMethods = ({setShowList,destination,type,amount,setShow,hide_wallet,reload}) => {
  const [payload,setPayload] = useState({});
  const [showModal,setShowModal] = useState(false);
  const [loading,setLoading] = useState(false);
  const [done,setDone] = useState(false);
  const [gql_user,setGqlUser] = useState(null)

  const fetchData = async () => {
    try{
      let gql_user = await getData('gql_user');
      setGqlUser(gql_user);
    }catch(err){
      console.log("err",err)
    }
  }

  useEffect(()=>{
    fetchData()
  },[])

  const payWithWallet = async () => {
    try{
      let gql_user = await getData('gql_user');
      let gql_token = await getData('gql_token');
      if(amount && Number(numeral(amount).format('0')) > gql_user.wallet_balance){
        return ToastLong("You have insufficient fund in wallet")
      }
      let fd =  { 
        user_id : gql_user.id,
        amount : Number(numeral(amount).format('0')),
        type_id : destination.id,
        type : type === "goal" ? "goal" : "plan"
      }
      setLoading(true)
      // verify the ref here by sending it back to the backend
      console.log("${base_ql_http}/fund_plans_goals/",fd,`${base_ql_http}/fund_plans_goals/`)
      axios.post(`${base_ql_http}/fund_plans_goals/`,fd,{
        headers : {
          'Authorization' : `Bearer ${gql_token}`
        }
      }).then(async (res)=>{
        await storeData("gql_user",{...gql_user,wallet_balance : Number(gql_user.wallet_balance) - amount})
        setDone(true)
      }).catch((err)=>{
        console.log("err>>",err)
        setLoading(false)
        return ToastShort("This should not happen. Please try again");
      })
    }catch(err){
      console.log("err",err);
    }
  }

  const payWithPayStack = async () => {
    try{
        //return setWarning(false)
        //make calls to paystack;
        let  user = await getData('gql_user');
        await getData('gql_token');
        let reference_code = generateRandomString();
        //setLoading(true);
        if(loading){
            //setLoading(false);
            return false;
        }

        let fundData = !destination.id ? {
          "amount": Number(numeral(amount).format('0')),
          "reference" : `cardWallet_${reference_code}_${user.id}`,
          "type": "wallet",
          "type_id": null,
          "user_id": user.id
        } : type === "goal" ? {
          "amount": Number(numeral(amount).format('0')),
          "reference" : `cardGoal_${reference_code}_${user.id}`,
          "type": "goal",
          "type_id": destination.id,
          "user_id": user.id,
          "name" : destination.name
        } : {
          "amount": Number(numeral(amount).format('0')),
          "reference" : `cardPlan_${reference_code}_${user.id}`,
          "type": "plan",
          "type_id": destination.id,
          "user_id": user.id,
          "name" : destination.name
        }
        await storeData('fundData',fundData);
        //await handleQuery(query,gql_token);
        let data = {
            //key : res.paystack_public_key,//pk_test_83607f8cf120e5cab090541076f62b683187af95
            key : SAVING_TEST_KEY,
            email : user.email,
            amount : Number(numeral(amount).format('0')) * 100,
            reference_id : fundData.reference,
        }
        console.log("data>>>",data)
        setShowModal(true);
        setPayload(data);
    }catch(err){
      setLoading(false);
      ToastLong("This should not happen. Please try again")
        console.log("err",err)
    }
}

const transactionHandler = async (data) => {
    //setLoading(false);
    var webResponse = JSON.parse(data);
    setShowModal(false);
    switch (
      webResponse.message //i used paymentStatus here, it might be diff from yours. know the right one to use wen u log out webResponse
    ) {
      case 'USER_CANCELLED':
        {
          setShowModal(false);
        }
        break;
      case 'Approved': {
        try {
          let fd = await getData('fundData');
          console.log("transactionHandler",fd)
          let gql_token = await getData('gql_token');
          // verify the ref here by sending it back to the backend
          let response = await axios.post(`${base_ql_http}/verify/transaction/`,fd,{
            headers : {
              'Authorization' : `Bearer ${gql_token}`
            }
          }).then((res)=>setDone(true)).catch((err)=>{
            console.log("err>>",err.response)
            setLoading(false)
            return ToastShort("This should not happen. Please try again");
          })
        } catch (error) {
          console.log("err",error)
          setLoading(false)
          return ToastShort("This should not happen. Please try again");
        }
      }
    }
  }
  let options = !hide_wallet && destination && destination.id !== null ?  [
    {
      label : "Use Bank Card",
      type : "card"
    },
    {
      label : "Use Herconomy Card",
      type : "card"
    },
    {
      label : `Use Herconomy wallet (${gql_user && gql_user.wallet_balance ? 
        numeral(gql_user.wallet_balance).format('0,0.00') : '0.00'})`,
      type : "wallet"
    },
    // {
    //   label : "Pay with bank",
    //   type : "bank"
    // }
  
  ] :  [
    {
      label : "Use Bank Card",
      type : "card"
    },
    {
      label : "Use Herconomy Card",
      type : "card"
    },
  ]
  return(
    <Container
      backgroundColor={Colors.whiteBase}
      widthPercent="100%"
      borderRadius={5}
      paddingVertical={4}
      height={80}
    >
      <Container 
        paddingHorizontal={6}
      >
        <TouchWrap
            onPress={()=>setShowList('select plan')}
        >
            <Feather 
                name="arrow-left"
                size={scaleFont(15)}
            />
        </TouchWrap>
      </Container>

            <Container 
              marginTop={4}
              paddingHorizontal={6}
              flex={1}
            >
                {
                  loading ? (
                      <Container
                        flex={1}
                        verticalAlignment="center"
                        horizontalAlignment="center"
                      >
                         <LottieIcon icon={SavingLoader} />
                      </Container>
                  ) : (
                        <React.Fragment>
                          <H1 fontSize={17}>Select payment option</H1>
                          <P
                            fontSize={5}
                            color={Colors.otherText}
                          >Tap any of the options below</P>
                          <SizedBox 
                            height={3}
                          />
                          {
                          options.map((item,i)=>(
                              <TouchWrap key={i}
                                onPress={()=>{
                                  console.log("type>>",item.type)
                                  if(item.type === "card"){
                                    return payWithPayStack()
                                  }
                                  if(item.type === "wallet"){
                                    return payWithWallet()
                                  }
                                }}
                              >
                                <Container
                                  borderRadius={5}
                                  borderWidth={1}
                                  borderColor={Colors.primary}
                                  paddingVertical={1.5} 
                                  backgroundColor={Colors.whiteBase}
                                  marginBottom={2}
                                >
                                    <P textAlign="center" fontSize={8}>{item.label}</P>
                                </Container>
                              </TouchWrap>
                            ))
                          }
                        </React.Fragment>
                  )
                }
            </Container>
            <Modal visible={done}>
                <WellDone 
                    setShow={setShow}
                    text={`You just funded ${destination.id ? destination.name : 'your Wallet'}`}
                    onPressD={()=>{
                        reload ? reload() : null
                        setDone(false)
                        setShow(false)
                    }}
                    btn_text={'Ok'}
                />
            </Modal>
                    
            <ModalWebView payload={payload} 
                      transactionHandler={transactionHandler} setLoading={setLoading}
                      isLoading={loading}
                      setShowModal={setShowModal}
                      showModal={showModal}
                      setPayload={setPayload}
                    />
    </Container>
  )
}

export const LottieIcon = ({icon,size}) => {
  return(
    <LottieView 
        source={icon}
        autoPlay={true}
        style={{
            width: size || 150,
            height: size || 150
        }}
        loop={true}
    />
  )
}

export const PlansList = ({setShowList,setSendPlan,setShow,plans,loading,
  setDestination,destination}) => {
  const [list,setList] = useState([]);
  const [plan,setPlan] = useState(null)
  useEffect(()=>{
    setPlan(destination)
    setList(plans)
  },[plans])
  return(
    <Container
      backgroundColor={Colors.whiteBase}
      widthPercent="100%"
      borderRadius={5}
      paddingVertical={4}
    >
      <Container 
        paddingHorizontal={6}
      >
        <TouchWrap
            onPress={()=>setShow(false)}
        >
            <Feather 
                name="arrow-left"
                size={scaleFont(15)}
            />
        </TouchWrap>
      </Container>
      <Container marginTop={4}
        paddingHorizontal={6}
      >
          <Label name="Select your destination" />
          <SizedBox height={1} />
          <Container marginBottom={3}>
            <InputWrap
              backgroundColor={Colors.lightYellow}
              borderColor={Colors.primary}
              borderRadius={5}
              paddingHorizontal={2}
              placeholder={'Search for options'}
              textPaddingHorizontal={5}
              onChangeText={(value)=>{
                if(value.toString().trim() === ""){
                  return setList(plans)
                }
                let filter = plans.filter(plan=>{
                  return(
                    plan.name && plan.name.toLowerCase().includes(value ? value.toLowerCase() : "")
                  )
                })
                setList(filter)
              }}
            />
          </Container>
          <Container marginBottom={5}>
            {
              console.log("loading--planlist>>",list,loading)
            }
            {
              loading ? (
                <SavingsLoader />
              ) : (
                <ScrollView showsVerticalScrollIndicator={false}
                  height={100}
                >
                  {
                    list.map((item,i)=>(
                      <TouchWrap 
                        onPress={()=>{
                          console.log("setPlan(item)",item)
                          setPlan(item)
                        }}
                        key={i}
                        paddingHorizontal={3}
                      >
                        
                        <Container marginTop={3}
                              direction="row"
                              verticalAlignment="center"
                          >
                              <Container widthPercent="10%">
                                  <CheckBok  
                                      dimension={4}
                                      status={(
                                        (plan && plan.id == item.id) ||
                                        (!plan && destination && destination.id == item.id)
                                      ) ? true : false}
                                  />
                              </Container>
                              <Container direction="row">
                                  <H2 fontSize={8}>
                                    {item.name}
                                  </H2>
                                  <SizedBox width={3}/>
                                  <H2 fontSize={8}>
                                    &#8358;{item.amount ? numeral(item.amount).format('0,0.00') : '0.00'}
                                  </H2>
                              </Container>
                          </Container>
                      </TouchWrap>
                    ))
                  }
                </ScrollView>
              )
            }
           
          </Container>
          <Button title="Done"
            backgroundColor={Colors.primary}
            borderColor={Colors.primary}
            borderRadius={5}
            onPress={()=>{
              setDestination(plan || destination)
              setShowList("select plan")
            }}
            fontSize={8}
          />
        </Container>
      </Container>
  )
}



export const BanksList = ({setShowList,setShow,banks,loading,
  setDestination,destination}) => {
  const [list,setList] = useState(null);
  const [bank,setBank] = useState(destination || null)
  useEffect(()=>{
    setList(banks)
  },[banks])
  return(
    <Container
      backgroundColor={Colors.whiteBase}
      widthPercent="100%"
      borderRadius={5}
      paddingVertical={4}
    >
      <Container 
        paddingHorizontal={6}
      >
        <TouchWrap
            onPress={()=>setShow(false)}
        >
            <Feather 
                name="arrow-left"
                size={scaleFont(15)}
            />
        </TouchWrap>
      </Container>
      <Container marginTop={4}
        paddingHorizontal={6}
      >
          <Label name="Select bank from list" />
          <SizedBox height={1} />
          <Container marginBottom={3}>
            <InputWrap
              backgroundColor={Colors.lightYellow}
              borderColor={Colors.primary}
              borderRadius={5}
              paddingHorizontal={2}
              placeholder={'Search for options'}
              textPaddingHorizontal={5}
              onChangeText={(value)=>{
                if(value.toString().trim() === ""){
                  return setList(banks)
                }
                let filter = banks.filter(bank=>{
                  return(
                    bank.name && bank.name.toLowerCase().includes(value ? value.toLowerCase() : "")
                  )
                })
                setList(filter)
              }}
            />
          </Container>
          <Container marginBottom={5}>
            {
              console.log("loading--planlist>>",list,loading)
            }
            {
              loading ? (
                <SavingsLoader />
              ) : (
                <ScrollView showsVerticalScrollIndicator={false}
                  height={100}
                >
                  {
                    list && Array.isArray(list) && list.map((item,i)=>(
                      <TouchWrap 
                        onPress={()=>{
                          console.log("setPlan(item)",item)
                          setBank(item)
                        }}
                        key={i}
                        paddingHorizontal={3}
                      >
                        
                        <Container marginTop={3}
                              direction="row"
                              verticalAlignment="center"
                          >
                              <Container widthPercent="10%">
                                  <CheckBok  
                                      dimension={4}
                                      status={(
                                        (bank && bank.name == item.name) ||
                                        (!bank && destination && destination.name == item.name)
                                      ) ? true : false}
                                  />
                              </Container>
                              <Container direction="row">
                                  <H2 fontSize={8}>
                                    {item && item.name ? item.name : ""}
                                  </H2>
                              </Container>
                          </Container>
                      </TouchWrap>
                    ))
                  }
                </ScrollView>
              )
            }
           
          </Container>
          <Button title="Done"
            backgroundColor={Colors.primary}
            borderColor={Colors.primary}
            borderRadius={5}
            onPress={()=>{
              setDestination(bank)
              setShowList("AddAccount")
            }}
            fontSize={8}
          />
        </Container>
      </Container>
  )
}

export const BreakCharge = ({setShow,setAction}) => {
  const [setting,setSetting] = React.useState(null);
  const [loading,setLoading] = React.useState(true);
  const fetchData = async () => {
    try{
        setLoading(true)
        let query = `query{
          generalSetting{
              before_end_withdraw
              goal_roi
              withdraw_condition
            }
          }`
      let gql_token = await getData('gql_token')
      let res = await handleQuery(query,gql_token)
      res && res.data && res.data.generalSetting ? 
      setSetting(res.data.generalSetting) : null;
      setLoading(false)
    }catch(err){

      setLoading(false)
    }
  }
  useEffect(()=>{
    fetchData()
  },[])
  return(
    <Container
      backgroundColor={Colors.whiteBase}
      widthPercent="100%"
      borderTopLeftRadius={8}
      borderTopRightRadius={8}
      paddingVertical={4}
      showsVerticalScrollIndicator={false}
    >
        <ScrollView>
          <Container 
            paddingHorizontal={6}
            horizontalAlignment="flex-end"
          >
            <TouchWrap
                onPress={()=>setShow(false)}
            >
                <Feather 
                    name="x"
                    size={scaleFont(15)}
                />
            </TouchWrap>
          </Container>
          <Container
            paddingHorizontal={6}
          >
            <Container 
              marginTop={4}
            >
                <Container
                  horizontalAlignment="center"
                >
                  <H1 fontSize={17}>Break Charge</H1>
                  <SizedBox 
                    height={3}
                  />
                  <Container
                    widthPercent="80%"
                  >
                    <P
                      fontSize={8}
                      textAlign="center"
                    >Withdrawing from your plan before maturity comes with a {setting ? setting.before_end_withdraw : 0}% charge.</P>
                  </Container>
                  <Container
                    widthPercent="80%"
                    marginTop={2}
                  >
                    <P
                      fontSize={8}
                      textAlign="center"
                    >We charge this fee to help you with financial discipline.</P>
                  </Container>
                  <SizedBox 
                    height={3}
                  />
                </Container>
            </Container>
            <Button title="Accept & Continue"
                backgroundColor={Colors.primary}
                borderColor={Colors.primary}
                borderRadius={5}
                onPress={()=>setAction("withdraw_wallet")}
                fontSize={8}
              />
              <SizedBox height={4} />
          </Container>
        </ScrollView>
    </Container>
  )
}

export const WithdrawWallet = ({setShow,setShowList,planD}) => {
  const navigation = useNavigation();
  const [loading,setLoading] = useState(false)
  const processWithdrawal = async () => {
    try{
      let gql_token = await getData('gql_token');
      let gql_user = await getData('gql_user');
      let fd = { 
        user_id : gql_user.id,
        type_id : planD.id,
        type : planD.type
      }
      console.log("processWithdrawal",fd)
        setLoading(true);
      await axios.post(`${base_ql_http}/withdraw_plans_goals`,fd,{
            headers : {
              'Authorization' : `Bearer ${gql_token}`
            }}).then((res)=>{
              setShow(false);
              navigation.navigate('Wallet');
            }).catch(err=>{
              console.log("err<<}}",err)
              setLoading(false);
              let msg = err.msg && typeof(err.msg) == "string" ? err.msg : "This should not happen. Please try again."
              return ToastLong(msg)
            })
    }catch(err){
      console.log("err2<<}}",err)
      let msg = err.msg && typeof(err.msg) == "string" ? err.msg : "This should not happen. Please try again."
      return ToastLong(msg)
    }
  }
  return(
    <Container
      backgroundColor={Colors.whiteBase}
      widthPercent="100%"
      borderRadius={5}
      paddingVertical={4}
      showsVerticalScrollIndicator={false}
    >
        <ScrollView>
          {
            !loading ? (
              <Container 
                paddingHorizontal={6}
              >
                <TouchWrap
                    onPress={()=>setShow(false)}
                >
                    <Feather 
                        name="arrow-left"
                        size={scaleFont(15)}
                    />
                </TouchWrap>
              </Container>
            ) : null
          }
          {
            loading ? (
              <Container horizontalAlignment="center">
                <LottieIcon icon={SavingLoader} />
              </Container>
            ) : (
              <Container
                paddingHorizontal={6}
              >
                <Container 
                  marginTop={4}
                >
                    <H1 fontSize={17}
                      textAlign="center"
                    >Withdraw to Wallet</H1>
                    <SizedBox 
                      height={3}
                    />
                    <Container
                        backgroundColor={Colors.lightYellow}
                        borderColor={Colors.primary}
                        borderWidth={0.8}
                        borderRadius={5}
                        paddingHorizontal={2}
                        paddingVertical={2}
                        textAlignVertical="center"
                    >
                        <P fontSize={8}>{planD && planD.title ? planD.title : ""}</P>
                    </Container>
                    <SizedBox 
                      height={4}
                    />
                    <Container
                        backgroundColor={Colors.lightYellow}
                        borderColor={Colors.primary}
                        borderWidth={0.8}
                        borderRadius={5}
                        paddingHorizontal={2}
                        paddingVertical={2}
                        textAlignVertical="center"
                        direction="row"
                    >   
                        <H1 fontSize={18}>&#8358;</H1>
                        <H1 fontSize={18}>{planD && planD.amount_saved ? 
                          numeral(planD.amount_saved).format("0,0.00") : "0.00"
                        }</H1>
                    </Container>
                </Container>
              
                <SizedBox height={4} />
                <Button title="Withdraw to Wallet"
                    backgroundColor={Colors.primary}
                    borderColor={Colors.primary}
                    borderRadius={5}
                    onPress={()=>{
                      processWithdrawal()
                    }}
                    fontSize={8}
                  />
                  <SizedBox height={4} />
              </Container>
            )
          }
        </ScrollView>
    </Container>
  )
}


export const SelectPlan = ({setShow,setShowList,
    setAmount,amount,destination
  }) => {
  return(
    <Container
      backgroundColor={Colors.whiteBase}
      widthPercent="100%"
      borderRadius={5}
      paddingVertical={4}
      showsVerticalScrollIndicator={false}
    >
        <ScrollView>
          <Container 
            paddingHorizontal={6}
          >
            <TouchWrap
                onPress={()=>setShow(false)}
            >
                <Feather 
                    name="arrow-left"
                    size={scaleFont(15)}
                />
            </TouchWrap>
          </Container>
          <Container
            paddingHorizontal={6}
          >
            <Container 
              marginTop={4}
            >
                <H1 fontSize={17}>Add Funds</H1>
                <P
                  fontSize={8}
                  color={Colors.otherText}
                >Enter any amount and continue</P>
                <SizedBox 
                  height={3}
                />
                <Container>
                  <Label name="Enter the amount" />
                  <SizedBox height={1} />
                  <InputWrap 
                    icon={<H1>&#8358;</H1>}
                    backgroundColor={Colors.white}
                    borderWidth={0.5}
                    borderColor={Colors.primary}
                    borderRadius={5}
                    paddingHorizontal={2}
                    textPaddingHorizontal={3}
                    fontWeight={'bold'}
                    verticalAlignment="center"
                    textAlignVertical="center"
                    inputStyle={{
                      fontSize : 18
                    }}
                    keyboardType={'numeric'}
                    value={amount ? numeral(amount).format("0,0") : ""}
                    onChangeText={(value)=>setAmount ? setAmount(value) : null}
                  />
                </Container>
            </Container>
            <Container marginTop={4}>
              <Container>
                <Label name="Destination"/>
                <SizedBox height={1} />
                <Dropdown 
                  placeholderTextColor={Colors.primary}
                  backgroundColor={Colors.white}
                  borderWidth={0.5}
                  borderRadius={5}
                  // onPress={()=>setShowList(true)}
                  value={destination && destination.name ? destination.name : null}
                  color={Colors.otherText}
                  fontSize={8}
                />
              </Container>
            </Container>
            <SizedBox height={4} />
            <Button title="Continue"
                backgroundColor={Colors.primary}
                borderColor={Colors.primary}
                borderRadius={5}
                onPress={()=>{
                  if(!destination || !amount){
                    return ToastLong("Please complete the form and press 'Continue'")
                  }
                  if(destination && destination.id){
                    let amount_to_be_saved = calAmtToBeSaved(destination)
                    if((Number(numeral(amount).format("0")) + destination.amount) > amount_to_be_saved){
                      return ToastLong(`This sum will take you pass the target amount by ${(Number(numeral(amount).format("0")) + destination.amount) - amount_to_be_saved}`)
                    }
                  }
                  setShowList("payment")
                }}
                fontSize={8}
              />
              <SizedBox height={4} />
          </Container>
        </ScrollView>
    </Container>
  )
}


export const TransferPlan = ({setSendPlan,setShow,type,target_amt,hide_wallet_option,reload}) => {
  //const [showList,setShowList] = useState("send plan");
  const selectFromList = el => {
    setShowList(false);
  };

  const [plans,setPlans] = React.useState([]);
  const [showList,setShowList] = useState("select plan");
  const [loading,setLoading] = React.useState(false);
  const [retry,setRetry] = React.useState(false);
  const [amount,setAmount] = React.useState(target_amt)
  const [destination,setDestination] = React.useState(null)
  const [gql_user,setGqlUser] = React.useState(null)
  const [processing,setProcessing] = React.useState(false);

  const payWithWallet = async (destination) => {
    try{
      let gql_user = await getData('gql_user');
      let gql_token = await getData('gql_token');
      if(amount && Number(numeral(amount).format('0')) > gql_user.wallet_balance){
        return ToastLong("You have insufficient fund in wallet")
      }
      let fd =  { 
        user_id : gql_user.id,
        amount : Number(numeral(amount).format('0')),
        type_id : destination.id,
        type : !type ? "goal" : "plan"
      }
      //return console.log("endpoint",`${base_ql_http}/fund_plans_goals`,fd,destination)
      if(destination && destination.id){
        let amount_to_be_saved = calAmtToBeSaved(destination)
        if((Number(numeral(amount).format("0")) + destination.amount) > amount_to_be_saved){
          return ToastLong(`This sum will take you pass the target amount by ${(Number(numeral(amount).format("0")) + destination.amount) - amount_to_be_saved}`)
        }
      }
      setLoading(true)
      setProcessing(true)
      // verify the ref here by sending it back to the backend
      axios.post(`${base_ql_http}/fund_plans_goals`,fd,{
        headers : {
          'Authorization' : `Bearer ${gql_token}`
        }
      }).then((res)=>{
        setLoading(false)
        setProcessing(false)
        reload()
        setShow(false)
        setShowList("weldone")
      }).catch((err)=>{
        console.log("err>>",err)
        setLoading(false)
        setProcessing(false)
        return ToastShort("This should not happen. Please try again");
      })
    }catch(err){
      console.log("err",err);
    }
}

  const fetchData = async () => {
    try{
      console.log("fetchData-admoney")
      setLoading(true);
      let gql_user = await getData('gql_user');
      let gql_token = await getData('gql_token');
      setGqlUser(gql_user);
      let query = `query{
        challenges : userSavingsChallenges(where : {user_id : ${gql_user.id},status_nin: ["Completed"]}){
          id
          amount_saved
          percentage
          target_amount
          start_date
          percentage
          frequency
          roi
          saving_challenges_id{
            title
            description
            amount_to_be_saved
            maturity_date
          }
        }
        goals : userGoals(where : {user_id : ${gql_user.id},status_nin: ["Completed"]}){
          id
          title
          target_amount
          amount_saved
          start_date
          end_date
          description
          percentage
          frequency
          roi
        }
      }`;
      console.log("query>>",query)
      let res = await handleQuery(query,gql_token)
      let data = []
      if(res && res.data && res.data.goals){
        data  = Array.isArray(res.data.goals) ? res.data.goals.map((item)=>(
          {
            name : item.title,
            id : item.id,
            amount : item.amount_saved,
            description : item.description,
            start_date : item.start_date,
            end_date : item.end_date,
            frequency : item.frequency,
            target_amount : item.target_amount
          }
        )) : []
        //setPlans(data)
      } 
      if(res && res.data && res.data.challenges){
        let items = Array.isArray(res.data.challenges) ? res.data.challenges.map((item)=>(
          {
            name :  item.saving_challenges_id && item.saving_challenges_id.title ? 
              item.saving_challenges_id.title : "",
            id : item.id,
            amount : item.amount_saved,
            description : item.saving_challenges_id && item.saving_challenges_id.description ? 
            item.saving_challenges_id.description : "",
            start_date : item.start_date ? item.start_date : "",
            frequency : item.frequency ? item.frequency : "",
            end_date : item.saving_challenges_id && item.saving_challenges_id.maturity_date ? 
            item.saving_challenges_id.maturity_date : "",
            target_amount : item.target_amount
          }
        )) : []
        data = [...data,...items]
      }
      data && Array.isArray(data) && data.length > 0 ? setDestination(data[0]) : []
      console.log("res<<>>",res);
      setPlans(data);
      setLoading(false);
    }catch(err){
      console.log("errr",err);
      setLoading(false)
      setRetry(true);
    }
  } 
  React.useEffect(()=>{
    fetchData();
  },[])

  return(
      <React.Fragment>
        {
            showList === "select plan" ? (
              <Container
              backgroundColor={Colors.whiteBase}
              widthPercent="100%"
              borderRadius={5}
              paddingVertical={4}
              showsVerticalScrollIndicator={false}
          >
              {
                !processing ? (
                  <ScrollView>
                    <Container 
                      paddingHorizontal={6}
                    >
                      <TouchWrap
                          onPress={()=>setShow(false)}
                      >
                          <Feather 
                              name="arrow-left"
                              size={scaleFont(15)}
                          />
                      </TouchWrap>
                    </Container>
                    <H1 textAlign="center" fontSize={15}>Send to Plan</H1>
                    <Container 
                      backgroundColor={Colors.white}
                      horizontalAlignment="center"
                      verticalAlignment="center"
                      paddingVertical={5}
                      marginTop={3}
                    >
                      <P>Wallet Balance</P>
                      <H1 fontSize={15}>&#8358;
                        {gql_user && gql_user.wallet_balance ? numeral(gql_user.wallet_balance ).format('0,0.00')
                          : '0.00'}
                      </H1>
                    </Container>
                    <Container
                      paddingHorizontal={6}
                    >
                      <Container marginTop={4}>
                          <Container>
                            <Label name="Enter the amount" />
                            <SizedBox height={1}/>
                            <InputWrap 
                              fontWeight={'bold'}
                              verticalAlignment="center"
                              textAlignVertical="center"
                              inputStyle={{
                                fontSize : 18
                              }}
                              icon={<H1>&#8358;</H1>}
                              backgroundColor={Colors.white}
                              borderWidth={0.5}
                              borderColor={Colors.primary}
                              borderRadius={5}
                              paddingHorizontal={2}
                              textPaddingHorizontal={3}
                              keyboardType={'numeric'}
                              value={amount ? numeral(amount).format('0,0') : ""}
                              onChangeText={(value)=>setAmount(value)}
                            />
                          </Container>
                      </Container>
                      <Container marginTop={4}>
                        <Container>
                          <Label name="Select your destination"/>
                          <SizedBox height={1} />
                          <Dropdown 
                            placeholderTextColor={Colors.primary}
                            backgroundColor={Colors.white}
                            borderWidth={0.5}
                            borderRadius={5}
                            onPress={()=>setShowList(true)}
                            value={destination && destination.name ? destination.name : ''}
                            color={Colors.otherText}
                            fontSize={8}
                          />
                        </Container>
                      </Container>
                      <SizedBox height={4} />
                      <Button title="Send"
                          backgroundColor={Colors.primary}
                          borderColor={Colors.primary}
                          borderRadius={5}
                          onPress={()=>{
                            if(!destination || !amount){
                              return
                            }
                            payWithWallet(destination)
                          }}
                          fontSize={8}
                        />
                        <SizedBox height={4} />
                    </Container>
                  </ScrollView>
                ) : (
                  <Container
                    verticalAlignment="center"
                    horizontalAlignment="center"
                  >
                      <LottieIcon icon={SavingLoader} />
                  </Container>
                )
              }
          </Container>
            ) : showList === "weldone" ? (
                  <WellDone 
                    setShow={setShow}
                    text={`You just funded ${destination && destination.id ? destination.name : 'your Wallet'}`}
                    onPressD={()=>{
                        setShow(false)
                    }}
                    btn_text={'Ok'}
                />
            ) : (
                <PlansList 
                    setShowList={setShowList} 
                    setSendPlan={setSendPlan} 
                    setShow={setShow}
                    plans={plans}
                    loading={loading}
                    setDestination={setDestination}
                    destination={destination}
                />
              )
        }
      </React.Fragment>
  )
}

export const AddPhoneForm = ({setShowList,setShow}) => {
  const [phone,setPhone] = useState(null)
  const navigation = useNavigation()
  const submitHandler = async () => {
      try{
        setShowList("Processing");
        let gql_user = await getData('gql_user');
        let gql_token = await getData('gql_token');
        let query = `mutation{
            updateUser(input:{
            where : {id : ${gql_user.id}}
            data : {phone : "+234${phone}"}    
          }){
            user{
              id
            }
          }
        }`
        let res = await handleQuery(query,gql_token)
        setShowList("Done")
      }catch(err){
        console.log("err",err)
        setShowList("AddPhone")
        ToastLong("This should not happen. Please retry.")
      }
  }
  return(
    <React.Fragment>
      <TouchWrap
        onPress={()=>{
          navigation.navigate("Home")
          setShow(false)
        }}
    >
        <Feather 
            name="arrow-left"
            size={scaleFont(15)}
        />
    </TouchWrap>
    <Container horizontalAlignment="center" marginTop={1}>
      <H1 fontSize={FONTSIZE.medium}>We need the phone number to generate your wallet address.</H1>
    </Container>

  <Container marginTop={4}>
    <Label name="Enter Phone Number" />
    <SizedBox height={1}/>
    <InputWrap 
      icon={<H1>+234</H1>}
      backgroundColor={Colors.white}
      borderWidth={0.5}
      borderColor={Colors.primary}
      borderRadius={5}
      paddingHorizontal={2}
      textPaddingHorizontal={3}
      keyboardType={'numeric'}
      value={phone}
      maxLength={10}
      onChangeText={(value)=>setPhone(value)}
      fontWeight={'bold'}
      verticalAlignment="center"
      inputStyle={{
        fontSize : 18
      }}
      textAlignVertical="center"
    />
  </Container>
    <SizedBox height={4} />
    <Button title="Submit"
        backgroundColor={Colors.primary}
        borderColor={Colors.primary}
        borderRadius={5}
        onPress={()=>{
          if(!phone || phone.trim() === ""){
            return ToastLong("Please fill the form and continue")
          }
          submitHandler()
        }}
        fontSize={8}
      />
      <SizedBox height={4} />
  </React.Fragment>
  )
}

export const AddBVNForm = ({setBvn,destination,bvn,account,setAccount,setShowList,showList,setShow}) => {
  const verifyBVN = async () => {
    setShowList("Processing");
    let gql_token = await getData('gql_token');
    let fd = { 
      bvn, 
      'bank_code' : destination.bank_code,
      'account_number' :account
    }
    axios({
      url: `${base_ql_http}/verify/bvn`,
      method: 'post',
      data: fd,
      headers : {
        Authorization : `Bearer ${gql_token}`
      }
    }).then((res)=>{
      setShowList("Done");
    }).catch(err=>{
      console.log("err",err)
      setShowList("AddAccount");
      let msg = err.msg && typeof(err.msg) == "string" ? err.msg : "This should not happen. Please retry"
      ToastLong(msg);
    })
  }
  return(
    <React.Fragment>
    <TouchWrap
        onPress={()=>setShow(false)}
    >
        <Feather 
            name="arrow-left"
            size={scaleFont(15)}
        />
    </TouchWrap>
    <Container horizontalAlignment="center">
      <H1 fontSize={15}>Verify BVN</H1>
    </Container>
    <Container marginTop={4}>
      <Container>
        <Label name="Enter BVN" />
        <SizedBox height={1}/>
        <InputWrap 
          fontWeight={'bold'}
          verticalAlignment="center"
          textAlignVertical="center"
          inputStyle={{
            fontSize : 18
          }}
          backgroundColor={Colors.white}
          borderWidth={0.5}
          borderColor={Colors.primary}
          borderRadius={5}
          paddingHorizontal={2}
          textPaddingHorizontal={3}
          keyboardType={'numeric'}
          value={bvn}
          onChangeText={(value)=>setBvn(value)}
        />
      </Container>
    </Container>

  <Container marginTop={4}>
    <Label name="Enter Account Number" />
    <SizedBox height={1}/>
    <InputWrap 
      backgroundColor={Colors.white}
      borderWidth={0.5}
      borderColor={Colors.primary}
      borderRadius={5}
      paddingHorizontal={2}
      textPaddingHorizontal={3}
      keyboardType={'numeric'}
      value={account}
      onChangeText={(value)=>setAccount(value)}
    />
  </Container>
  <Container marginTop={4}>
    <Label name="Select Bank" />
    <SizedBox height={1}/>
    <Dropdown 
      placeholderTextColor={Colors.primary}
      backgroundColor={Colors.white}
      borderWidth={0.5}
      borderRadius={5}
      onPress={()=>setShowList('BankList')}
      value={destination && destination.name ? destination.name : ''}
      color={Colors.otherText}
      fontSize={8}
    />
  </Container>
    <SizedBox height={4} />
    <Button title="Verify"
        backgroundColor={Colors.primary}
        borderColor={Colors.primary}
        borderRadius={5}
        onPress={()=>{
          if(!account || account.trim() === "" || !destination || !bvn || bvn.trim() == ""){
            return ToastLong("Please fill the form and continue")
          }
          verifyBVN()
        }}
        fontSize={8}
      />
      <SizedBox height={4} />
  </React.Fragment>
  )
}

export const ConfirmWithdrawal  = ({setShow,reload,data}) => {
  const navigation = useNavigation();
  const [password,setPassword] = React.useState(null);
  const [otp,setOTP] = React.useState(null)
  const [loading,setLoading] = useState(false)
  const [text,setText] = React.useState("Submit");
  const [action,setAction] = React.useState("Password")
  const {token} = useStoreState((state)=>({
    token : state.userDetails.token
  }))

  const processOTP = async () => {
    try{
      setLoading(true);
      let fd = {
        otp_code : otp
      }
      let gql_token = await getData('gql_token')
      console.log("processOTP",fd,gql_token)
      await axios({
        url: `${base_ql_http}/verify/otp`,
        method: 'post',
        data: fd,
        headers : {
          Authorization : `Bearer ${gql_token}`
        }
      })
      let fData = {
        withdraw : true,
        bank_acc_id : data.bank_id
      }
      let res = await axios({
        url: `${base_ql_http}/initiate/transfer`,
        method: 'post',
        data: fData,
        headers : {
          Authorization : `Bearer ${gql_token}`
        }
      }).then((res)=>{
        let item = res.data.transaction;
        console.log("processOTP",res)
        let data = {
          type : item.transaction_type,
          title : item.description,
          text : item.destination,
          amount : item.amount,
          date : item.created_at,
          source : item.source,
          status : item.status,
          back_to_wallet : true
        }
        navigation.navigate("TransactionDetails",{
            transaction : data
        })
        setShow(false);
      }).catch(err=>{
        console.log("err",err)
        let msg = err.msg && typeof(err.msg) == "string" ? err.msg : "This should not happen.Please retry."
        setLoading(false)
        ToastLong(msg)
        setShow(false)
      })
    }catch(err){
      console.log("err",err)
      let msg = err.msg && typeof(err.msg) == "string" ? err.msg : "This should not happen.Please retry."
      setLoading(false)
      ToastLong(msg)
      setShow(false)
    }
}

const processData = async () => {
  try{
    
    if(!password || password.trim() === ""){
      return ToastShort("Please enter password")
    }
    setLoading(true);
    let fd = {
      password : password
    }
    console.log("pass",fd,token)
    let res = await apiFunctions.passwordSavings(token,fd);
    console.log("passwordSavings",res)
    let gql_token = await getData('gql_token')
    let fData = {
      bank_acc_id : data.bank_id,
      withdraw_amount : data.amount
    }
    await axios({
      url: `${base_ql_http}/initiate/withdraw`,
      method: 'post',
      data: fData,
      headers : {
        Authorization : `Bearer ${gql_token}`
      }
    })
    await axios({
      url: `${base_ql_http}/generate/otp`,
      method: 'post',
      data: null,
      headers : {
        Authorization : `Bearer ${gql_token}`
      }
    })
    setLoading(false)
    setAction("OTP");
  }catch(err){
    console.log("err>>",err.response)
    let msg = err.msg && typeof(err.msg) == "string" ? err.msg : "This should not happen.Please retry."
    setLoading(false)
    ToastLong(msg)
    setShow(false)
  }
}

  return(

    <Container
      backgroundColor={Colors.whiteBase}
      widthPercent="100%"
      borderRadius={7}
      paddingVertical={4}
      showsVerticalScrollIndicator={false}
    >
      <ScrollView>
        <Container
          paddingHorizontal={6}
        >
           <React.Fragment>
                {
                  !loading ? (
                      <React.Fragment>
                        <TouchWrap
                          onPress={()=>setShow(false)}
                      >
                          <Feather 
                            name="arrow-left"
                            size={scaleFont(15)}
                          />
                      </TouchWrap>
                      <Container horizontalAlignment="center">
                        <H1 fontSize={15}>Withdrawal</H1>
                      </Container>
                    </React.Fragment>
                  ) : null
                }
                {
                  loading ? (
                    <Container horizontalAlignment="center">
                            <LottieIcon icon={SavingLoader} />
                    </Container>
                  ) : null
                }
                {
                  action === "Password" && !loading ? (
                    <Container marginTop={4}>
                      <Container>
                        <Label name="Enter Herconomy Password" />
                        <SizedBox height={1}/>
                        <InputWrap 
                          fontWeight={'bold'}
                          verticalAlignment="center"
                          textAlignVertical="center"
                          inputStyle={{
                            fontSize : 18
                          }}
                          backgroundColor={Colors.white}
                          borderWidth={0.5}
                          borderColor={Colors.primary}
                          borderRadius={5}
                          paddingHorizontal={2}
                          textPaddingHorizontal={3}
                          keyboardType={'default'}
                          secure={true}
                          value={password}
                          onChangeText={(value)=>setPassword(value)}
                        />
                      </Container>
                    </Container>
                  ) : null
                }
                {
                  action === "OTP" && !loading ? (
                    <Container marginTop={4}>
                      <Label name="Enter OTP" />
                      <SizedBox height={1}/>
                      <InputWrap 
                        backgroundColor={Colors.white}
                        borderWidth={0.5}
                        borderColor={Colors.primary}
                        borderRadius={5}
                        paddingHorizontal={2}
                        textPaddingHorizontal={3}
                        keyboardType={'numeric'}
                        value={otp}
                        fontSize={18}
                        fontWeight={'bold'}
                        onChangeText={(value)=>setOTP(value)}
                      />
                    </Container>
                  ) : null
                }
              { !loading ? (
                  <React.Fragment>
                    <SizedBox height={4} />
                    <Button title={text}
                      backgroundColor={Colors.primary}
                      borderColor={Colors.primary}
                      borderRadius={5}
                      onPress={()=>{action === "Password" ? processData() : processOTP()}}
                      fontSize={8}
                    />
                    <SizedBox height={4} />
                  </React.Fragment>
              ) : null
              }
            </React.Fragment>
        </Container>
      </ScrollView>
    </Container> 
  )
}


export const AddPhone = ({setShow,reload}) => {
  const [showList,setShowList] = useState("AddPhone") 
  useEffect(()=>{

  },[])
  return(
    <Container
      backgroundColor={Colors.whiteBase}
      widthPercent="100%"
      borderRadius={7}
      paddingVertical={4}
      showsVerticalScrollIndicator={false}
    >
      <ScrollView>
        <Container
          paddingHorizontal={6}
        >
          {
            showList === "AddPhone" ? (
              <AddPhoneForm 
                setShow={setShow}
                setShowList={setShowList}
                showList={showList}
              />
            ) : null
          }
              {
                showList === "Processing" ? (
                  <Container horizontalAlignment="center">
                    <LottieIcon icon={SavingLoader} />
                  </Container>
                ) : null
              }
              {
                showList === "Done" ? (
                  <WellDone 
                      setShow={setShow}
                      text={null}
                      onPressD={()=>{
                          setShow(false)
                          reload()
                      }}
                      btn_text={'Ok'}
                  />
                ) : null
              }
        </Container>
      </ScrollView>
    </Container>    
  )
}


export const AddBVN = ({setShow,reload}) => {
  const [bvn,setBvn] = useState(null);
  const [account,setAccount] = useState(null)
  const [showList,setShowList] = useState("AddAccount")
  const [banks,setBanks] = useState(null);
  const [loading,setLoading] = useState(true)  
  const [destination,setDestination] = useState(null)
  const getBanksFromPaystack = async () => {
    try{
      setLoading(true);
      let res = await axios.get('https://api.paystack.co/bank');
      let banks = res && res.data && res.data.data && 
        Array.isArray(res.data.data) ? res.data.data.map((bank)=>{
        return {
          name : bank.name,
          bank_code : bank.code
        }
      }) : [];
      console.log("getBanksFromPaystack",banks)
      setLoading(false);
      setBanks(banks);
    }catch(error){
      //setRetry(true);
    }
  }

  useEffect(()=>{
    getBanksFromPaystack()
  },[])

  return(

    <Container
      backgroundColor={Colors.whiteBase}
      widthPercent="100%"
      borderRadius={7}
      paddingVertical={4}
      showsVerticalScrollIndicator={false}
    >
      <ScrollView>
        <Container
          paddingHorizontal={6}
        >
          {
            showList === "AddAccount" ? (
              <AddBVNForm bvn={bvn} 
                setShow={setShow}
                setBvn={setBvn}
                destination={destination}
                setDestination={setDestination}
                account={account}
                setAccount={setAccount}
                setShowList={setShowList}
                showList={showList}
              />
            ) : null
          }
          {
                showList === "BankList" ? (
                  <BanksList 
                      setShowList={setShowList}
                      setShow={setShow}
                      banks={banks}
                      loading={loading}
                      setDestination={setDestination}
                      destination={destination}
                  />
                ) : null
              }
              {
                showList === "Processing" ? (
                  <Container horizontalAlignment="center">
                    <LottieIcon icon={SavingLoader} />
                  </Container>
                ) : null
              }
              {
                showList === "Done" ? (
                  <WellDone 
                      setShow={setShow}
                      text={`Success! Your BVN has been verified.`}
                      onPressD={()=>{
                          setShow(false)
                          reload()
                      }}
                      btn_text={'Ok'}
                  />
                ) : null
              }
        </Container>
      </ScrollView>
    </Container>    
  )
}

export const BankWithdrawal = ({setShow,gql_user}) => {
  const [showList,setShowList] = useState('BankAccount')
  const [banks,setBanks] = React.useState([])
  const [loading,setLoading] = React.useState(false)
  const [destination,setDestination] = React.useState(null)
  const [retry,setRetry] = React.useState(false);
  const [account,setAccount] = React.useState(null)
  const [amount,setAmount] = React.useState(null)
  const navigation = useNavigation()
  const [setting,setSetting] = React.useState(null);

  const getBanksFromPaystack = async () => {
    try{
      setLoading(true);
      setRetry(false)
      let query = `query{
        generalSetting{
            withdraw_charges
            minimum_withdraw
        }
    }`
    let gql_token = await getData('gql_token')
    let gen = await handleQuery(query,gql_token);
    gen && gen.data && gen.data.generalSetting ? setSetting(gen.data.generalSetting) : null;
    let res = await axios.get(`${base_ql_http}/get_banks`,{
      headers : {
        Authorization : `Bearer ${gql_token}`
      }
    });
    let banks = res && res.data && res.data.banks && 
      Array.isArray(res.data.banks) ? res.data.banks.map((bank)=>{
      return {
        name : bank.bankName,
        bank_code : bank.bankCode
      }
    }) : [];
    setLoading(false);
    setBanks(banks);
    }catch(error){
      console.log("getBanksFromPaystack-err",error)
      setRetry(true);
    }
  }

  useEffect(()=>{
    getBanksFromPaystack()
  },[])
  return(
  <Container
    backgroundColor={Colors.whiteBase}
    widthPercent="100%"
    borderRadius={7}
    paddingVertical={4}
    showsVerticalScrollIndicator={false}
>
      <ScrollView>
        <Container
          paddingHorizontal={6}
        >
          {
            showList === 'BankAccount' ? (
              <React.Fragment>
                <TouchWrap
                    onPress={()=>setShow(false)}
                >
                    <Feather 
                        name="arrow-left"
                        size={scaleFont(15)}
                    />
                </TouchWrap>
                <Container horizontalAlignment="center">
                  <H1 fontSize={15}>Bank Account</H1>
                </Container>
                <Container marginTop={4}>
                  <Container>
                    <Label name="Enter the amount" />
                    <SizedBox height={1}/>
                    <InputWrap 
                      fontWeight={'bold'}
                      verticalAlignment="center"
                      textAlignVertical="center"
                      inputStyle={{
                        fontSize : 18
                      }}
                      icon={<H1>&#8358;</H1>}
                      backgroundColor={Colors.white}
                      borderWidth={0.5}
                      borderColor={Colors.primary}
                      borderRadius={5}
                      paddingHorizontal={2}
                      textPaddingHorizontal={3}
                      keyboardType={'numeric'}
                      value={amount ? numeral(amount).format('0,0') : ""}
                      onChangeText={(value)=>setAmount(value)}
                    />
                  </Container>
                </Container>
                <SizedBox height={4} />
                <Button title="Choose Account"
                    backgroundColor={Colors.primary}
                    borderColor={Colors.primary}
                    borderRadius={5}
                    onPress={()=>{
                      if(!amount || amount.toString().trim() === "" || (
                        !gql_user
                      )){
                        return ToastShort("Please enter amount to withdraw")
                      }
                      if(gql_user.wallet_balance < Number(numeral(amount).format('0'))){
                        return ToastLong("Insufficient wallet balance")
                      }
                      if(!setting) return
                      if(amount < setting.minimum_withdraw){
                        return ToastShort(`Minimum amount you can withdraw is ${setting.minimum_withdraw} naira`)
                      }
                      setShowList("TransferBank")
                    }}
                    fontSize={8}
                  />
                  <SizedBox height={4} />
              </React.Fragment>
            ) : null
          }
          
          {
            showList === 'TransferBank' ? (
              <React.Fragment>
                <TouchWrap
                    onPress={()=>setShow(false)}
                >
                    <Feather 
                        name="arrow-left"
                        size={scaleFont(15)}
                    />
                </TouchWrap>
                <Container horizontalAlignment="center">
                  <H1 fontSize={15}>Transfer to Bank</H1>
                </Container>
                <ScrollView showsVerticalScrollIndicator={false}
                  height={150}>
                  {
                    gql_user && Array.isArray(gql_user.bank_accounts) ? gql_user.bank_accounts.map((bank,i)=>(
                      <TouchWrap 
                        onPress={()=>{
                          setShow(false)
                          navigation.navigate('AccountSearch',{
                            bank : {
                              bank_code : bank.bank_code,
                              account_number : bank.account_number,
                              bank_name : bank.bank_name,
                              account_name : bank.account_name,
                              amount : amount,
                              is_new : false,
                              id : bank.id
                            }
                          })
                        }}
                        key={i}
                      >
                        <Container marginTop={4}
                          borderBottomWidth={0.8}
                          borderColor={Colors.line}
                        >
                            <Label name={bank && bank.account_number ? bank.account_number : ""}/>
                            <Container direction="row" horizontalAlignment="space-between">
                              <P fontSize={8} color={Colors.greyBase300}>
                                {bank && bank.account_name ? 
                              bank.account_name : ""}</P>
                              <Feather 
                                name="chevron-right" 
                                size={scaleFont(15)}
                                color={Colors.greyBase300}
                              />
                            </Container>
                            <SizedBox height={3}/>
                        </Container>
                      </TouchWrap>
                    )) : null
                  }
                </ScrollView>
                <SizedBox height={4} />
                <Button title="Add Account"
                    backgroundColor={Colors.savingYellow}
                    borderColor={Colors.savingYellow}
                    color={Colors.black}
                    borderRadius={5}
                    onPress={()=>setShowList("AddAccount")}
                    fontSize={8}
                  />
                  <SizedBox height={4} />
              </React.Fragment>
            ) : null
          }


          {
            showList === 'AddAccount' ? (
              <React.Fragment>
                <TouchWrap
                    onPress={()=>setShow(false)}
                >
                    <Feather 
                        name="arrow-left"
                        size={scaleFont(15)}
                    />
                </TouchWrap>
                <Container marginTop={3}>
                  <H1>Add a bank account</H1>
                  <SizedBox height={1.5} />
                  <P fontSize={8}
                    color={Colors.otherText}
                  >
                    Please only add account that you own. Transactions to account
                    that do not belong to you will be flagged.
                  </P>
                </Container>
                <Container marginTop={4}>
                    <Label name="Enter Account Number" />
                    <SizedBox height={1}/>
                    <InputWrap 
                      backgroundColor={Colors.white}
                      borderWidth={0.5}
                      borderColor={Colors.primary}
                      borderRadius={5}
                      paddingHorizontal={2}
                      textPaddingHorizontal={3}
                      keyboardType={'numeric'}
                      value={account}
                      onChangeText={(value)=>setAccount(value)}
                    />
                </Container>
                <Container marginTop={4}>
                    <Label name="Select Bank" />
                    <SizedBox height={1}/>
                    <Dropdown 
                      placeholderTextColor={Colors.primary}
                      backgroundColor={Colors.white}
                      borderWidth={0.5}
                      borderRadius={5}
                      onPress={()=>setShowList('BankList')}
                      value={destination && destination.name ? destination.name : ''}
                      color={Colors.otherText}
                      fontSize={8}
                    />
                </Container>
                <SizedBox height={4} />
                <Button title="Next"
                    backgroundColor={Colors.primary}
                    borderColor={Colors.primary}
                    borderRadius={5}
                    onPress={()=>{
                      if(!destination || !destination.bank_code || !account){
                        return ToastShort("Please complete the form")
                      }
                      setShow(false)
                      navigation.navigate('AccountSearch',{
                        bank : {
                          bank_code : destination.bank_code,
                          account_number : account,
                          bank_name : destination.name,
                          amount : amount,
                          is_new : true
                        }
                      })
                    }}
                    fontSize={8}
                  />
                  <SizedBox height={4} />
              </React.Fragment>
            ) : null
          }
          {
            showList === "BankList" ? (
              <BanksList 
                  setShowList={setShowList}
                  setShow={setShow}
                  banks={banks}
                  loading={loading}
                  setDestination={setDestination}
                  destination={destination}
              />
            ) : null
          }
        </Container>
      </ScrollView>
    </Container>
  )
}


export const FundWallet = ({setSendPlan,setShow,setWarning,setAction,gql_user}) => {
  const [bank,setBank] = useState(false);
  const [data, setString] = useClipboard();
  const copyToClipboard = (text) => {
    setString(text);
    ToastShort("Copied!")
  };  
  return(
    <React.Fragment>
        {
          bank ? (
            <Container
                backgroundColor={Colors.whiteBase}
                widthPercent="100%"
                paddingHorizontal={10}
                borderRadius={5}
                paddingVertical={7}
            >
                <TouchWrap
                    onPress={()=>setBank(false)}
                >
                    <Feather 
                        name="arrow-left"
                        size={scaleFont(15)}
                    />
                </TouchWrap>
                <SizedBox height={4} />
                <H1>By Bank Transfer</H1>
                <P color={Colors.otherText}
                    fontSize={5}
                >Fund your wallet by sending money to your wallet account number</P>
                <TouchWrap
                  onPress={()=>{
                    copyToClipboard('7080235463')
                    setShow(false)
                  }}
                >
                  <Container marginTop={3}
                      direction="row"
                      verticalAlignment="center"
                      borderRadius={5}
                      backgroundColor={Colors.savingYellow}
                      paddingHorizontal={5}
                      paddingVertical={2}
                      horizontalAlignment="space-between"
                  >
                      <Container widthPercent="80%">
                        <P fontSize={5}>Account Information</P>
                        <SizedBox height={2} />
                        <H2 fontSize={8}>
                          {gql_user && gql_user.ags_nuban_number && gql_user.ags_nuban_bank ? 
                              `${gql_user.ags_nuban_number} / ${gql_user.ags_nuban_bank}` : ""
                          }
                        </H2>
                      </Container>
                      <Container
                        height={10}
                        widthPercent="10%"
                      >
                        <ImageWrap 
                          fit={'contain'}
                          flex={1}
                          source={stampPNG}
                        />
                      </Container>
                  </Container>
                </TouchWrap>
            </Container>
          ) : (
            <Container
              backgroundColor={Colors.whiteBase}
              widthPercent="100%"
              paddingHorizontal={10}
              borderRadius={5}
              paddingVertical={7}
            >
                <TouchWrap
                    onPress={()=>setShow(false)}
                >
                    <Feather 
                        name="arrow-left"
                        size={scaleFont(15)}
                    />
                </TouchWrap>
                <SizedBox height={4} />
                <H1>Add Funds</H1>
                <P color={Colors.otherText}
                    fontSize={5}
                >Select where you want to add funds from</P>
                <TouchWrap
                  onPress={()=>setBank(true)}
                >
                  <Container marginTop={3}
                      direction="row"
                      verticalAlignment="center"
                  >
                      <Container widthPercent="10%">
                          <CheckBok  
                              dimension={4}
                          />
                      </Container>
                      <Container>
                          <H2 fontSize={8}>By Bank Transfer</H2>
                      </Container>
                  </Container>
                </TouchWrap>

                <TouchWrap onPress={()=>{
                  setAction("AddMoney")
                  //setWarning(true)
                }}>
                  <Container marginTop={3}
                    direction="row"
                    verticalAlignment="center"
                  >
                    <Container widthPercent="10%">
                      <CheckBok  
                          dimension={4}
                      />
                    </Container>
                    <Container>
                      <H2 fontSize={8}>By Debit Card</H2>
                    </Container>
                  </Container>
                </TouchWrap>
            </Container>
          )
        }
    </React.Fragment>
  )
}

export const Warning = ({setWarning,onPressD,text=null}) => (
  <Container backgroundColor={Colors.whiteBase}
    widthPercent="90%"
    borderRadius={5}
    marginTop={10}
  >
    <Container horizontalAlignment="flex-end"
      paddingHorizontal={5}
      paddingVertical={3}
    >
      <TouchWrap onPress={()=>setWarning(false)}>
        <Feather name="x" size={scaleFont(10)} />
      </TouchWrap>
    </Container>
    <Container>
      <H1 fontSize={15} textAlign="center">Redirect</H1>
      <Container
        horizontalAlignment="center"
        paddingVertical={2}
        paddingBottom={6}
      >
        <Container widthPercent="80%">
          <P color={Colors.black}
            fontSize={8}
            textAlign="center"
          >{
            text ? text : "You are being redirected to Paystack, Please note that Herconomy does not store any payment information. Click 'OK' to continue or 'CANCEL' to end this transaction."
          }
          </P>
        </Container>
        <Container direction="row" horizontalAlignment="space-evenly" marginTop={3}
          widthPercent="80%"
        >
          <Button 
            title="Cancel"
            backgroundColor={Colors.primary}
            borderColor={Colors.lightestGrey}
            borderRadius={5}
            onPress={()=>setWarning(false)}
            fontSize={8}
            widthPercent="35%"
            paddingVertical={1}
            backgroundColor={Colors.lightestGrey}
            color={Colors.otherText}
          />
          <Button title="Ok"
            backgroundColor={Colors.primary}
            borderColor={Colors.primary}
            borderRadius={5}
            onPress={()=>onPressD ? onPressD() : null}
            fontSize={8}
            widthPercent="35%"
            paddingVertical={1}
          />
        </Container>
      </Container>
    </Container>
  </Container>
)

export const TransferMoney = ({setSendPlan,setShow,setAction,gql_user}) => {
  const navigation = useNavigation()
  return(
    <Container
        backgroundColor={Colors.whiteBase}
        widthPercent="100%"
        paddingHorizontal={10}
        borderRadius={5}
        paddingVertical={7}
    >
        <TouchWrap
            onPress={()=>setShow(false)}
        >
            <Feather 
                name="arrow-left"
                size={scaleFont(15)}
            />
        </TouchWrap>
        <SizedBox height={4} />
        {
          !gql_user || !gql_user.bvn_detail ? <React.Fragment>
              <H1 fontSize={5}>You must provide your bvn to make transfers. Please go to savings home to provide your bvn details.</H1>
              <SizedBox height={4} />
              <Button title="Contine"
                backgroundColor={Colors.primary}
                borderColor={Colors.primary}
                borderRadius={5}
                onPress={()=>navigation.navigate("Savings")}
                fontSize={8}
                paddingVertical={1}
              />
          </React.Fragment> : <React.Fragment>
              <H1>Transfer</H1>
              <P color={Colors.otherText}
                  fontSize={5}
              >Select where you want to transfer money to</P>
              <TouchWrap
                onPress={()=>setAction('TransferPlan')}
              >
                <Container marginTop={3}
                    direction="row"
                    verticalAlignment="center"
                >
                    <Container widthPercent="10%">
                        <CheckBok  
                            dimension={4}
                        />
                    </Container>
                    <Container>
                        <H2 fontSize={8}>Fund a Plan</H2>
                        <P fontSize={5}
                            color={Colors.otherText}
                        >Fund either your "savings plans" or "personal goals"</P>
                    </Container>
                </Container>
              </TouchWrap>
              <TouchWrap
                onPress={()=>setAction('BankWithdrawal')}
              >
                <Container marginTop={3}
                    direction="row"
                    verticalAlignment="center"
                  >
                    <Container widthPercent="10%">
                        <CheckBok  
                            dimension={4}
                        />
                    </Container>
                    <Container>
                        <H2 fontSize={8}>Send to a bank account</H2>
                        <P fontSize={5}
                            color={Colors.otherText}
                        >Bank charges apply when sending money to your bank</P>
                    </Container>
                </Container>
              </TouchWrap>
        </React.Fragment>
        }
    </Container>
  )
}

export const OtherFeedBox = props => {
  let post = props.data;
  let user = post.user;
  let likes = props.likes;
  let unlike = props.unlike;
  const {updateResult} = useStoreActions(action => ({updateResult: action.resultModel.updateResult}));
  const [show, setShow] = useState(false);
  const [current_image, setCurrentImage] = useState(null);
  return (
    <Container borderColor={post.content_type === "sponsor" ? Colors.line : ""} 
      borderWidth={post.content_type === "sponsor" ? 2 : 0} 
      paddingHorizontal={post.content_type === "sponsor" ? 6 : 0} paddingVertical={post.content_type === "sponsor" ? 2 : 0}
      marginBottom={post.content_type === "sponsor" ? 2 : 0}
    >
      {
        post.content_type !== "sponsor" ? (
          <Container direction="row" verticalAlignment="center" paddingTop={1.5}>
            <Container width={15} horizontalAlignment="center">
              {user.photo ? (
                <TouchFeedback
                  onPress={() => {
                    if(props.placeholder){
                      return
                    }
                    setShow(true);
                    setCurrentImage(user.photo);
                  }}>
                  <Avatar backgroundColor="#efefef" size={10} url={user.photo} />
                </TouchFeedback>
              ) : (
                <TouchFeedback
                  onPress={() => {
                    if(props.placeholder){
                      return
                    }
                    setShow(true);
                    setCurrentImage(null);
                  }}>
                  <LocalAvatar size={10} />
                </TouchFeedback>
              )}
            </Container>
            <Container paddingLeft={3}>
              <TouchFeedback
                onPress={ async () => {
                  if(props.placeholder){
                    return
                  }
                  await updateResult(user);
                  props.navigation.navigate('Profile', {
                    member_info: user,
                  });
                }}
                borderBottomWidth={0.1}
                borderBottomColor={Colors.black}>
                <Container direction="row">
                            <H1 fontSize={10}>
                              {user.first_name} {user.last_name}
                            </H1>
                              <SizedBox width={1} />
                              {
                                user.status ? (
                                  <Avatar backgroundColor={Colors.primary} 
                                    size={1.5}
                                  />
                                ) : (
                                  <Avatar backgroundColor={Colors.lightGrey} 
                                    size={1.5}
                                  />
                                )
                              }
                            </Container>
              </TouchFeedback>
              <SizedBox height={2} />
              <P fontSize={FONTSIZE.small} color={props.placeholder ? Colors.fadedText : null}>
                  {post && post.created_at ? moment(post.created_at, 'YYYY-MM-DDTHH:mm:ss.SSS')
                .local()
                .fromNow() : null}
              </P>
            </Container>
          </Container>
        ) : (
          <Container paddingLeft={3} marginBottom={1}>
            <H1>Sponsored!</H1>
          </Container>
        )
      }

      <SizedBox height={1} />
      {show && <FullImageModal setShow={setShow} image={current_image} />}
      <Container direction="row" verticalAlignment="flex-start" borderColor={Colors.primary} 
        borderBottomWidth={post.content_type !== "sponsor" ? 1 : 0} 
        paddingBottom={2}>
        {/**ANCHOR SIDE ICONS */}
        {post.content_type !== "sponsor" && (<Container width={15} horizontalAlignment="center" />)}

        {post ? (
          <Container paddingLeft={3} paddingRight={2} flex={1}>
            <Container borderColor="#efefef" borderBottomWidth={0} paddingBottom={1}>
              <P fontSize={FONTSIZE.medium} color={props.placeholder ? Colors.fadedText : null}>{post.body ? SentenceCase(post.body) : null}</P>
                  {
                    props.placeholder ? (
                      <Container horizontalAlignment="flex-end">
                        <ActivityIndicator size={15} color={Colors.button} />
                      </Container>
                    ) : null
                  }

              {post.file ? (
                <TouchFeedback
                  onPress={() => {
                    if(props.placeholder){
                      return
                    }
                    setShow(true);
                    setCurrentImage(post.file);
                  }}>
                  <Container marginTop={1}>
                    <ImageWrap height={20} borderRadius={10} backgroundColor="#efefef" url={post.file} fit="cover" />
                  </Container>
                </TouchFeedback>
              ) : null}
            </Container>

            {/**ANCHOR BOTTOM ICONS */}
            <Container
              borderColor="#efefef"
              borderBottomWidth={0}
              paddingBottom={0}
              direction="row"
              horizontalAlignment="space-between"
              verticalAlignment="center">
              <TouchFeedback onPress={()=>{
                if(props.placeholder){
                  return
                }
                props.onPress()
              }}>
                <Container direction="row" verticalAlignment="center" padding={1.5}>
                  <Feather Icon name="message-circle" color={Colors.greyBase900} size={scaleFont(FONTSIZE.icon)} />

                  <SizedBox width={1} />
                  <P color={Colors.greyBase900} fontSize={8}>
                    {numeral(post.comments && post.comments.result 
                      && post.comments.result.length ? post.comments.result.length : post.comment ? post.comment.length : 0
                    ).format('0,0')}
                  </P>
                </Container>
              </TouchFeedback>

              <Container direction="row" verticalAlignment="center">
                <TouchFeedback paddingRight={2} onPress={()=>{
                  if(props.placeholder){
                    return
                  }
                  props.onPressLD()
                }}>
                  <Container direction="row" verticalAlignment="center" padding={1.5}>
                    {likes.includes(post.id) !== false || post.likes.filter(el => el.id === props.userD.id).length > 0 ? (
                      <Ionicons Icon name="ios-heart" color="red" size={scaleFont(FONTSIZE.icon)} />
                    ) : (
                      <Feather Icon name="heart" color={Colors.greyBase900} size={scaleFont(FONTSIZE.icon)} />
                    )}
                  </Container>
                </TouchFeedback>
                <TouchFeedback onPress={()=>{
                  if(!post.likes.length){
                    return;
                  }
                  props.navigation.navigate("PostLikes",post.likes);
                }}>
                    {/* props.likes && props.likes.includes(post.id) === true ? post.likes.length + 1 : post.likes.length */}
                    <P fontSize={8} color={Colors.greyBase900}>
                      Liked by {numeral(post && post.likes ? post.likes.length : 0).format('0 a')}
                    </P>
                </TouchFeedback>
              </Container>

              <TouchFeedback
                paddingRight={2}
                onPress={() =>
                  {
                    if(props.placeholder){
                      return
                    }
                    shareDetails({
                      message: post.body,
                      user: `${user.first_name} ${user.last_name}`,
                      file: post.file,
                      time: `[ ${moment(post.created_at).format('MMM DD YYYY')} at ${moment(post.created).format('h:mm:ss a')} ]`,
                    })
                  }
                }>
                <Container direction="row" verticalAlignment="center" padding={1.5}>
                  <Feather Icon name="share-2" color={Colors.greyBase900} size={scaleFont(FONTSIZE.icon)} />
                </Container>
              </TouchFeedback>
            </Container>
          </Container>
        ) : null}
      </Container>
    </Container>
  );
};


/* ANCHOR GROUP BOX  */
export const GroupBox = props => {
  let data = props.data;

  return (
    <TouchFeedback onPress={props.onPress}>
      <Container direction="row" verticalAlignment="center" horizontalAlignment="space-between" marginBottom={3}>
        <Rounded backgroundColor="#cfcfcf" size={10} radius={5}>
          <ImageWrap url={data.thumbnail} borderRadius={10} />
        </Rounded>

        <SizedBox width={5} />

        <Container flex={1}>
          <H2 fontSize={FONTSIZE.medium}>{data.name}</H2>
          <SizedBox height={0.5} />
          <P fontSize={10}>{data.members_count} member(s)</P>

          {data.request_status === 'pending' ? (
            <>
              <SizedBox height={1} />
              <P fontSize={8} color="red">
                Request Pending
              </P>
            </>
          ) : null}

          <SizedBox height={1.5} />

          {data.avatars.length > 0 ? (
            <Container direction="row" verticalAlignment="center">
              {data.avatars.map((el, i) => (
                <>
                  {el.photo ? <Avatar size={6} backgroundColor="#cfcfcf" url={el.photo} /> : <LocalAvatar size={6} />}
                  <SizedBox width={0.5} />
                </>
              ))}

              <SizedBox width={2} />
              <H2 fontSize={8}>See More</H2>
            </Container>
          ) : null}
        </Container>

        <SizedBox width={5} />

        {!props.data.is_member ? (
          <Container horizontalAlignment="center" verticalAlignment="center">
            <Feather Icon name="plus" size={scaleFont(20)} />
            <SizedBox height={2} />
            {data.closed ? <Feather Icon name="lock" size={scaleFont(10)} /> : null}
          </Container>
        ) : (
          <Feather Icon name="chevron-right" size={scaleFont(20)} />
        )}
      </Container>
    </TouchFeedback>
  );
};

export const TopicBox = props => {
  let data = props.data;
  return (
    <>
      <TouchFeedback onPress={props.onPress}>
        <Container direction="row" verticalAlignment="center" horizontalAlignment="space-between">
          <Container widthPercent="60%">
            <H1 fontSize={FONTSIZE.medium}>{data.title}</H1>
            <SizedBox height={0.5} />
            <P fontSize={10} color={Colors.greyBase900}>
              Keep up today with the latest tech trends
            </P>
            <SizedBox height={1} />

            {data.avatars.length > 0 ? (
              <Container direction="row" verticalAlignment="center">
                {data.avatars.slice(0, 4).map((el, i) => (
                  <>
                    {el.photo ? <Avatar size={6} backgroundColor="#cfcfcf" url={el.photo} /> : <LocalAvatar size={6} />}
                    <SizedBox width={0.5} />
                  </>
                ))}

                <SizedBox width={2} />
                <H2 fontSize={8}>See More</H2>
              </Container>
            ) : null}
          </Container>

          {!data.following ? (
            props.isLoadingFollow ? (
              <TouchFeedback
                width={20}
                borderRadius={10}
                padding={3}
                verticalAlignment="center"
                horizontalAlignment="center"
                borderWidth={1}
                borderColor={Colors.primary}
                backgroundColor={!data.following ? Colors.primary : null}>
                <ActivityIndicator size="small" color="#fff" />
              </TouchFeedback>
            ) : (
              <TouchFeedback onPress={props.onFollow}>
                <Container
                  width={20}
                  borderRadius={10}
                  padding={3}
                  verticalAlignment="center"
                  horizontalAlignment="center"
                  borderWidth={1}
                  borderColor={Colors.primary}
                  backgroundColor={data.following ? Colors.primary : null}>
                  <H2 color={Colors.primary} fontSize={10}>
                    Follow
                  </H2>
                </Container>
              </TouchFeedback>
            )
          ) : (
            <TouchFeedback width={20} horizontalAlignment="center">
              <Feather Icon name="check" color={Colors.primary} size={scaleFont(20)} />
            </TouchFeedback>
          )}
        </Container>
      </TouchFeedback>
      <SizedBox height={5} />
    </>
  );
};

export const CommentBoxTemplate = ({item, type, likeDislike,props,post,placeholder}) => {
  const {userD} = useStoreState(state => ({
    userD: state.userDetails.user,
  }));
  
  const {updateResult} = useStoreActions(action=>(
    {updateResult:action.resultModel.updateResult}
  ))
  const navigation = useNavigation();

  const onClicked = el => {
    likeDislike(el);
  };
  return (
    <>
      <Container direction="row">
        <Container marginRight={2} horizontalAlignment="flex-start">
          {item.user.photo ? <Avatar backgroundColor="#efefef" size={10} url={item.user.photo} /> : <LocalAvatar size={10} />}
        </Container>

        <>
          <Container widthPercent="85%">
            <Container paddingLeft={3} borderRadius={10} padding={2} backgroundColor={Colors.offWhite} flex={1}>
              <Container direction="row" marginBottom={0.5}>
                <TouchFeedback 
                  borderBottomColor={Colors.black}
                  borderBottomWidth={0.1}
                  onPress={ async ()=>{
                      if(placeholder){
                        return
                      }
                      await updateResult(item.user);
                      navigation.navigate('Profile',{
                          member_info:item.user
                      })
                  }}>
                    <Container direction="row">
                      <H1 fontSize={8}>
                        {item.user.first_name} {item.user.last_name}
                      </H1>
                      <SizedBox width={1} />
                      {
                        item.user.status ? (
                          <Avatar backgroundColor={Colors.primary} 
                            size={1.5}
                          />
                        ) : (
                          <Avatar backgroundColor={Colors.lightGrey} 
                            size={1.5}
                          />
                        )
                      }
                    </Container>
                </TouchFeedback>
                <SizedBox width={5} />
                {
                  placeholder ? (
                    <ActivityIndicator size={15} color={Colors.button}/>
                  ) : null
                }
              </Container>
              <P fontSize={6}>
                  {item && item.created_at ? moment(item.created_at, 'YYYY-MM-DDTHH:mm:ss.SSS')
                .local()
                .fromNow() : null}
              </P>

              <SizedBox height={0.5} />

              <P fontSize={8}>{item.body ? SentenceCase(item.body) : null}</P>

              {item.file ? (
                <>
                  <SizedBox height={2} />
                  <ImageWrap height={25} borderRadius={10} backgroundColor="#efefef" url={item.file} fit="contain" />
                </>
              ) : null}
            </Container>

            <SizedBox height={1} />
          </Container>
        </>
      </Container>
    </>
  );
};

export const PageHeader = ({title,navigation}) => (
  <Container paddingHorizontal={6} paddingTop={6} backgroundColor={Colors.    primary} direction="row">
    <TouchFeedback paddingRight={2} paddingBottom={2} paddingTop={2} onPress={() => navigation.openDrawer()}>
      <Feather Icon name="menu" size={scaleFont(FONTSIZE.menu)} color="#fff" />
    </TouchFeedback>
    <Container backgroundColor={Colors.primary} paddingHorizontal={6} 
        paddingTop={0.5} paddingBottom={3}
        widthPercent="80%"
        horizontalAlignment="center"
        verticalAlignment="center"
    >
        <H1 fontSize={FONTSIZE.page} color={Colors.whiteBase}>
            {title}
        </H1>
    </Container>
  </Container>
)


export const ListWrap = props => {
  return (
    <Container flex={1} backgroundColor="#0009" paddingHorizontal={6}>
      <TouchFeedback flex={1} onPress={props.onPress} />

      <Container backgroundColor="#fff" padding={4}>
        <TouchFeedback borderBottomColor="#dfdfdf" borderBottomWidth={0.5} paddingVertical={2}>
          <H1>Select {props.title}</H1>
        </TouchFeedback>

        <ScrollArea>
          {props.listMap.map((el, i) => (
            <TouchFeedback
              borderBottomColor="#dfdfdf"
              borderBottomWidth={0.5}
              paddingVertical={2}
              onPress={() => props.selectFromList(el)}
              key={i}>
              {props.title === 'Group' || props.title === 'Groups' ? (
                <P>{el.name}</P>
              ) : props.title === 'Topic' || props.title === 'Topics' ? (
                <P>{el.title}</P>
              ) : null}
            </TouchFeedback>
          ))}
        </ScrollArea>

        <SizedBox height={2} />

        <Button title="Cancel" onPress={props.onHide} />
      </Container>

      <TouchFeedback flex={1} onPress={props.onToggle} />
    </Container>
  );
};

export const ListWrapGeneral = props => {
  return (
    <Container flex={1} paddingHorizontal={6}>
      <TouchWrap flex={1} onPress={props.onPress} />

      <Container backgroundColor="#fff" padding={4} borderRadius={10}>
        <TouchWrap borderBottomColor="#dfdfdf" borderBottomWidth={0.5} paddingVertical={2}>
          <H1>Select {props.title}</H1>
        </TouchWrap>

        <ScrollArea>
          {props.listMap.map((el, i) => (
            <TouchWrap
              borderBottomColor="#dfdfdf"
              borderBottomWidth={0.5}
              paddingVertical={2}
              onPress={() => props.selectFromList(el)}
              key={i}>
              <P>{el.title}</P>
            </TouchWrap>
          ))}
        </ScrollArea>

        <SizedBox height={2} />

        <TouchWrapButton title="Cancel" onPress={props.onHide} />
      </Container>

      <TouchWrap flex={1} onPress={props.onToggle} />
    </Container>
  );
};
