import React,{useState,useEffect} from 'react';
import {Container,TouchWrap,SizedBox, Rounded,ImageWrap} from '@burgeon8interactive/bi-react-library';
import Colors from '../../../helpers/colors';
import {H1,P,H2} from '../../../components/component';
import {FlatList} from 'react-native';
import {ResourceBox} from '../../../components/resource_box';

const SessionResource = ({navigation,route}) => {
    const data = [
        {
            name : 'Programming',
            comment : '50 sessions',
            id : 1,
            image : "https://m.media-amazon.com/images/I/51zx-V7+8ML.jpg"
        },
        {
            name : 'Graphic Design',
            id : 2,
            comment : '10 sessions',
            image : "https://m.media-amazon.com/images/I/51GxW8immiL.jpg"
        },
        {
            name : 'Financial Accounting',
            id : 3,
            comment : '2 sessions',
            image : "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ85HvMh55pQs2qCRLNKLdHk7-6u3Hcv5iHmA&usqp=CAU"
        },
        {
            name : 'Economics',
            id : 4,
            comment : '2 sessions',
            image : "https://www.storyfit.com/hubfs/Imported_Blog_Media/photo-1507415492521-917f60c93bfe-2.jpeg"
        },
        {
            name : 'Artificial Intelligence',
            id : 5,
            comment : '2 sessions',
            image : "https://www.storyfit.com/hubfs/Imported_Blog_Media/photo-1507415492521-917f60c93bfe-2.jpeg"
        },
    ];
    return(
        <Container>
            <SizedBox height={5}/>
            <FlatList 
                data={data}
                extraData={data}
                keyExtractor={data => data.id}
                showsVerticalScrollIndicator={false}
                renderItem={({item,index})=><ResourceBox data={item} count={data.length} index={index}/>}
            />
        </Container>
    )
}

export default SessionResource;