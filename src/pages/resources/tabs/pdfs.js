import React,{useState,useEffect} from 'react';
import {Container,TouchWrap,SizedBox, Rounded,ImageWrap} from '@burgeon8interactive/bi-react-library';
import Colors from '../../../helpers/colors';
import {H1,P,H2} from '../../../components/component';
import {FlatList} from 'react-native';
import {ResourceBox} from '../../../components/resource_box';

const PDFResource = ({navigation,route}) => {
    const data = [
        {
            name : 'The Reasonable Robot',
            id : 1,
            image : "https://i.ytimg.com/vi/0_nAHeLXcXc/maxresdefault.jpg"
        },
        {
            name : 'Artificial Intelligence and the Law',
            id : 2,
            image : "https://miro.medium.com/max/1000/1*eF2Yy_xyV7B4JRD9rRoVNg.jpeg"
        },
        {
            name : 'Analytics of Life',
            id : 3,
            image : "https://builtin.com/sites/default/files/styles/og/public/2019-12/ai-books.jpg"
        },
        {
            name : 'Artificial Intelligence By Example',
            id : 4,
            image : "https://upload.wikimedia.org/wikipedia/en/d/db/Human_Compatible_%28Stuart_J._Russell%2C_2019%29_book_cover.jpg"
        },
        {
            name : 'AI in Health.',
            id : 5,
            image : "https://upload.wikimedia.org/wikipedia/en/d/db/Human_Compatible_%28Stuart_J._Russell%2C_2019%29_book_cover.jpg"
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

export default PDFResource;