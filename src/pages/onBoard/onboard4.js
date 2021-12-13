import React,{useState} from 'react';

import {Container, ImageWrap, SizedBox, Page, Avatar, ScrollArea, TouchWrap, Width} from '@burgeon8interactive/bi-react-library';
import {H2, H1, P, Button, Input, ListWrapGeneral,TouchFeedback} from '../../components/component';
import Swiper from 'react-native-swiper';
import Colors from '../../helpers/colors';
import {MiniFormOne, MiniFormTwo, MiniFormThree, MiniFormFour, MiniFormFive} from '../../components/mini_form';
import {Alert, View, StatusBar, Keyboard, Modal} from 'react-native';
import {useStoreState, useStoreActions} from 'easy-peasy';
import {apiFunctions} from '../../helpers/api';
import {ToastShort} from '../../helpers/utils';
import {RouteContext} from '../../helpers/routeContext';
import NationalityList from '../../doc/nationality';
import SectorList from '../../doc/sectors';
import {storeData} from '../../helpers/functions';
import moment from 'moment';
import { FONTSIZE } from '../../helpers/constants';

const OnboardFour = props => {
  const updateUser = useStoreActions(actions => actions.userDetails.updateUser);
  const swiper = React.useRef(null);
  const [index, setIndex] = React.useState(0);

  const {token, userD} = useStoreState(state => ({
    token: state.userDetails.token,
    userD: state.userDetails.user,
  }));

  const {currentStack, setCurrentState} = React.useContext(RouteContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLastPage, setIsLastPage] = React.useState(false);
  const [onboarded] = React.useState(true);
  const [date_of_birth, setDob] = React.useState(userD.date_of_birth);
  const [nationality, setNationality] = React.useState(userD.nationality);
  const [location, setLocation] = React.useState(userD.location || 0);
  const [job_title, setJobTitle] = React.useState(userD.job_title || 0);
  const [profession, Profession] = React.useState(userD.profession);
  const [industry, setIndustry] = React.useState(userD.industry);
  const [interest, setInterest] = React.useState([]);
  const [file, setFile] = React.useState(userD.file || null);
  const [fileMeta, setFileMeta] = React.useState({});
  const [showList, setShowList] = React.useState(false);
  const [listTitle, setListTitle] = React.useState('');
  const [listMap, setListMap] = React.useState([]);
  const [listHolder,setListHolder] = useState([]);

  const [images, setImages] = React.useState([
    require('../../../assets/img/walk5.png'),
    require('../../../assets/img/walk6.png'),
    require('../../../assets/img/walk7.png'),
    require('../../../assets/img/walk8.png'),
    require('../../../assets/img/walk9.png'),
  ]);

  const onIndexChanged = e => {
    setIndex(e);
    if (e === 4) {
      setIsLastPage(true);
    } else {
      setIsLastPage(false);
    }
  };

  const goNext = () => {
    swiper.current.scrollBy(1, true);
  };

  const goBack = () => {
    if (index === 0) {
      props.navigation.goBack();
      return;
    }
    swiper.current.scrollBy(-1, true);
  };

  const openListWrapper = list => {
    if (list === 'Nationality') {
      setListMap(NationalityList);
      setListHolder(NationalityList);
    }

    if (list === 'Job Sector') {
      setListMap(SectorList);
      setListHolder(SectorList);
    }

    setListTitle(list);
    setShowList(true);
  };

  const selectFromList = el => {
    if (listTitle === 'Nationality') {
      setNationality(el.title);
    }

    if (listTitle === 'Job Sector') {
      setIndustry(el.title);
    }

    setShowList(false);
  };

  const submitForm = async () => {
      try{
        Keyboard.dismiss();
        if (
          date_of_birth === '' ||
          nationality === '' ||
          location === '' ||
          job_title === '' ||
          profession === '' ||
          industry === '' ||
          interest === ''
        ) {
          Alert.alert('Herconomy', 'All fields are required');
          return;
        }
        setIsLoading(true);
        let dob = date_of_birth ? moment(date_of_birth).format('YYYY-MM-DD') : null;
        let fd = Object.values(fileMeta).length > 0 ? {
          onboarded,
          dob,
          nationality,
          location,
          job_title,
          profession,
          industry,
          interest : interest.length > 0 ? interest : null,
          username : userD.username,
          photo : `data:image/jpeg;base64,`+fileMeta.data
        } : {
          onboarded,
          dob,
          nationality,
          location,
          job_title,
          profession,
          industry,
          interest : interest.length > 0 ? interest : null,
          username : userD.username,
          photo : null
        }
        let data = await apiFunctions.onboarding1(token,userD.id,fd);
        if(data){  
          await updateUser(data);
          await storeData('user', data);
          return await setCurrentState('main');
        }
        setIsLoading(false);
        ToastShort("Record not saved. Please retry");
      }catch(error){
        ToastShort('Network Error. Please retry');
        setIsLoading(false);
      }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar translucent={true} barStyle="dark-content" backgroundColor="#0000" />
      <SizedBox height={5} />
      <ScrollArea flexGrow={1}>
        <Container height={40}>
          <Swiper
            loop={false}
            ref={swiper}
            onIndexChanged={onIndexChanged}
            scrollEnabled={false}
            dot={<Avatar size={2} backgroundColor="#E4E4E4" marginLeft={2} />}
            activeDot={<Avatar size={2} backgroundColor={Colors.primary} marginLeft={2} />}>
            {images.map((el, i) => (
              <Container
                key={i}
                flexGrow={1}
                paddingVertical={10}
                paddingBottom={15}
                flex={1}
                horizontalAlignment="center"
                verticalAlignment="center">
                {i === 3 && file ? (
                  <ImageWrap url={file} height={30} widthPercent="100%" fit="contain" />
                ) : (
                  <ImageWrap source={el} height={30} widthPercent="100%" fit="contain" />
                )}
              </Container>
            ))}
          </Swiper>
        </Container>

        <Container verticalAlignment="center" flex={1} height={53}>
          {index === 0 ? (
            <MiniFormOne
              setDob={setDob}
              openListWrapper={openListWrapper}
              setLocation={setLocation}
              date_of_birth={new Date(date_of_birth)}
              nationality={nationality}
              location={location}
            />
          ) : index === 1 ? (
            <MiniFormTwo
              job_title={job_title}
              profession={profession}
              industry={industry}
              setJobTitle={setJobTitle}
              Profession={Profession}
              openListWrapper={openListWrapper}
            />
          ) : index === 2 ? (
            <MiniFormThree interest={interest} setInterest={setInterest} />
          ) : index === 3 ? (
            <MiniFormFour file={file} setFile={setFile} fileMeta={fileMeta} setFileMeta={setFileMeta} />
          ) : (
            <MiniFormFive submitForm={submitForm} isLoading={isLoading} />
          )}

          <Container direction="row" horizontalAlignment="space-between" marginTop={3} paddingHorizontal={6}>
            <TouchFeedback paddingVertical={2} paddingRight={5} onPress={goBack}>
              <H2 fontSize={FONTSIZE.big} color={Colors.button}>
                Back
              </H2>
            </TouchFeedback>
            {isLastPage ? null : (
              <TouchFeedback paddingVertical={2} paddingLeft={5} onPress={goNext}>
                <H2 fontSize={FONTSIZE.big} color={Colors.button}>
                  Next
                </H2>
              </TouchFeedback>
            )}
          </Container>

          <SizedBox height={3} />
        </Container>
      </ScrollArea>

      <Modal visible={showList} transparent={true} statusBarTranslucent={true}>
        <Container backgroundColor="#0009" flex={1} horizontalAlignment="center" verticalAlignment="flex-start">
          <SizedBox height={20} />
          <Container height={50} width={95}>
            <Container paddingHorizontal={5}>
              <Input placeholder="Search"
                onChangeText={(value)=>{
                  if(value.trim().length < 0)  return setListMap(listHolder);
                  let items = listHolder.filter(list=> list.title.toLowerCase().includes(value.toLowerCase()))
                 return setListMap(items);
                }}
              />
            </Container>
            <ListWrapGeneral
              onToggle={() => setShowList(!showList)}
              title={listTitle}
              listMap={listMap}
              onHide={() => setShowList(false)}
              selectFromList={selectFromList}
            />
          </Container>
        </Container>
      </Modal>
    </View>
  );
};

export default OnboardFour;
