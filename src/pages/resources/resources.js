import React,{useState} from 'react';
import {Container, SizedBox,InputWrap,scaleFont,TouchWrap,Page,ImageWrap} from '@burgeon8interactive/bi-react-library';
import Colors from '../../helpers/colors';
import {H1,TouchFeedback} from '../../components/component';
import {ResourcesTabScreen} from '../../helpers/route';
import Feather from 'react-native-vector-icons/Feather';
import walk2 from '../../../assets/img/walk2.png';
import walk4 from '../../../assets/img/walk4.png';
import { FlatList } from 'react-native-gesture-handler';
import { FONTSIZE } from '../../helpers/constants';

const Resources = ({navigation,route}) => {
  const data = [
    {
      id : '1',
      image : walk2,
      name : 'LightBox Sessions',
      type : 'session',
      title : "LightBox Sessions"

    },
    {
      id : '2',
      image : walk4,
      name : 'PDF Resources',
      type : 'pdf',
      title : "PDF Resources"
    }
  ]
  return (
    <Page barIconColor="light" backgroundColor={Colors.primary}>
      <Container paddingHorizontal={6} paddingTop={6} direction="row" verticalAlignment="center">
        <TouchFeedback paddingRight={5} paddingTop={1.5} paddingBottom={1.5} onPress={() => navigation.openDrawer()}>
          <Feather Icon name="menu" size={scaleFont(FONTSIZE.menu)} color="#fff" />
        </TouchFeedback>
      </Container>
      <SizedBox height={1} />
        <Container flex={1} paddingHorizontal={6} backgroundColor={Colors.white}
          borderTopLeftRadius={50}
          borderTopRightRadius={50} marginTop={2}
        >
            <SizedBox height={4} />
              <Container flexGrow={1}>
                    <FlatList 
                      extraData={data}
                      data={data}
                      showsVerticalScrollIndicator={false}
                      keyExtractor={data=>data.id}
                      renderItem={({item,index})=>(
                        <Container marginBottom={10}>
                          <TouchFeedback onPress={()=>navigation.navigate('ResourceDetails',{item})}>
                            <ImageWrap
                              source={item.image}
                              height={30}
                              fit="contain"
                            />
                            <H1 textAlign="center">{item.name}</H1>
                          </TouchFeedback>
                        </Container>
                      )}
                    />
              </Container>
            <SizedBox height={4} />
        </Container>
    </Page>
  )
};
export default Resources;
