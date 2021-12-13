import React from 'react';
import {Container,TouchWrap,SizedBox, Rounded,ImageWrap} from '@burgeon8interactive/bi-react-library';
import Colors from '../helpers/colors';
import {H1,P,H2,TouchFeedback} from '../components/component';
export const ResourceBox = ({data,index,count}) => (
    <Container paddingHorizontal={6} marginBottom={count - 1 === index ? 10 : 5}>
        <TouchFeedback>
            <Container direction="row" backgroundColor={Colors.lightGrey}
                padding={7} borderRadius={10}
            >
                <Container widthPercent="20%">
                    <ImageWrap backgroundColor={Colors.greyBase300}
                        height={8}
                        borderRadius={10}
                        url={data.image}
                        fit="cover"
                    />
                </Container>
                <Container verticalAlignment="center" 
                    widthPercent="80%"
                    paddingHorizontal={4}
                >
                    <H1 color={Colors.button} fontSize={10}>{data.name}</H1>
                    <P color={Colors.button} fontSize={10}>{data.comment}</P>
                </Container>
            </Container>
        </TouchFeedback>
    </Container>
);