import React from 'react';
import Swiper from 'react-native-swiper';
import {Container, ImageWrap, SizedBox, Page, Avatar, TouchWrap, scaleFont, SlideTransition,TextWrap, Rounded} from '@burgeon8interactive/bi-react-library';
import {H2, Button, P, TouchWrapButton} from '../../components/component';
import Colors from '../../helpers/colors';
import {RouteContext} from '../../helpers/routeContext';
import Feather from 'react-native-vector-icons/Feather';
import { FONTSIZE } from '../../helpers/constants';

const slides = [
  {
    text: 'Join the largest community of professionals who want to Save, Earn, Connect and Thrive',
    img: require('../../../assets/img/walk1.png'),
  },
  {
    text: 'Get up-to-date information on opportunities such as Grants, Loans, Investments, Job Openings, Fellowships and more!',
    img: require('../../../assets/img/walk2.png'),
  },
  {
    text: 'Get discounted offers across various brands with your Herconomy Debit Card',
    img: require('../../../assets/img/walk10.png'),
  },
];

const OnboardOne = props => {
  const {setCurrentState} = React.useContext(RouteContext);
  const swiper = React.useRef(null);
  const [showButton] = React.useState([2]);

  return (
    <Page barIconColor="dark">
      <Container height={100}>
        <Swiper ref={swiper} loop={false} dot={<Avatar size={0} />} activeDot={<Avatar size={0} />}>
          {slides.map((el, i) => (
            <Container
              flexGrow={1}
              key={i}
              paddingHorizontal={6}
              paddingVertical={2}
              flex={1}
              horizontalAlignment="center"
              verticalAlignment="center">
              <ImageWrap source={el.img} height={30} widthPercent="80%" fit="contain" />
              <SizedBox height={6} />
              <H2 textAlign="center" fontSize={FONTSIZE.semiBig} color={Colors.button}>
                {el.text}
              </H2>

              <SizedBox height={6} />
              <Container direction="row" horizontalAlignment="center">
                <Rounded size={3} backgroundColor={i == 0 ? Colors.primary : Colors.lightGrey} radius={50}/>
                <SizedBox width={1}/>
                <Rounded size={3} backgroundColor={i == 1 ? Colors.primary : Colors.lightGrey} radius={50}/>
                <SizedBox width={1}/>
                <Rounded size={3} backgroundColor={i == 2 ? Colors.primary : Colors.lightGrey} radius={50}/>
              </Container>
              { !showButton.includes(i) ? (
                <Container direction="row" verticalAlignment="center" marginTop={5}>
                  <H2 fontSize={FONTSIZE.medium}>Swipe</H2>
                  <SizedBox width={2} />
                 <TextWrap>>></TextWrap>
                </Container>
              ) : (
                <Container direction="row" 
                widthPercent="80%"
                verticalAlignment="center" marginTop={5}>
                  <TouchWrapButton title="Continue" onPress={() => setCurrentState('auth')} />
                </Container>
              )}
            </Container>
          ))}
        </Swiper>
      </Container>
    </Page>
  );
};

export default OnboardOne;
