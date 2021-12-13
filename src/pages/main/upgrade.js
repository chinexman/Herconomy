import React from 'react';
import { Page, Container, ImageWrap, SizedBox } from '@burgeon8interactive/bi-react-library';
import Colors from '../../helpers/colors';
import Logo from '../../../assets/img/agsLogo_dark.png'
import UpgradePNG from '../../../assets/img/upgrade.jpeg'
import { H1, P, Button } from '../../components/component';
import { ScrollView } from 'react-native-gesture-handler';
import { Linking } from 'react-native';
export const Upgrade = () => {
    return(
        <Page backgroundColor={Colors.primary}>
            <Container flex={1}>
                <SizedBox height={5} />
                <Container paddingHorizontal={20}>
                    <ImageWrap 
                        source={Logo}
                        height={30}
                        fit="contain"
                    />
                </Container>
                <Container backgroundColor={Colors.white} flex={1}
                    borderTopLeftRadius={50}
                    verticalAlignment="center"
                    borderTopRightRadius={50}
                >
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <SizedBox height={5}/>
                        <ImageWrap 
                            height={30}
                            source={UpgradePNG}
                            fit="contain"
                        />
                        <Container 
                            paddingHorizontal={5} marginTop={4}
                            horizontalAlignment="center"
                        >
                            <H1 fontSize={18}>New version available</H1>
                            <SizedBox height={2}/>
                            <P textAlign="center">We have made some improvements on the app to bring you some enhancements and features.</P>
                            <SizedBox height={5}/>
                            <Button title="Update" 
                                widthPercent="70%"
                                backgroundColor={Colors.primary}
                                borderColor={Colors.primary}
                                onPress={()=>Linking.openURL('https://tinyurl.com/y6hd63bw')}
                            />
                            <SizedBox height={5}/>
                        </Container>
                    </ScrollView>
                </Container>
            </Container>
        </Page>
    )
}