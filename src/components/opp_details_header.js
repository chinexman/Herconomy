import React from 'react';
import {
  Page,
  Container,
  TouchWrap,
  SizedBox,
  scaleFont,
  Rounded,
  ImageWrap,
  Avatar,
  ScrollArea,
} from '@burgeon8interactive/bi-react-library';
import {H1,P} from '../components/component'; 
import Colors from '../helpers/colors';

const OppDetailsHeader = ({oppo}) => {
    return(
        <Container padding={5}>
            <Container horizontalAlignment="center" verticalAlignment="center" borderBottomWidth={1} borderColor={Colors.line}>
                <SizedBox height={2} />
                <H1 fontSize={13} textAlign="center">
                    {
                        oppo ? oppo.title.split(' ').map((word)=>{
                            return(
                                `${word.charAt(0).toUpperCase()}${word.slice(1)}`
                            )
                        }).join(' ') : ""
                    }
                </H1>
                <>
                    <H1 fontSize={6} textAlign="center">
                        {oppo ? oppo.user.first_name : ""} {oppo ? oppo.user.last_name : ""}
                    </H1>
                    <SizedBox height={1.5}/>
                    {
                        oppo.location && (
                            <P fontSize={4} color={Colors.greyBase900}>
                                {oppo ? oppo.user.location : ""}
                            </P>
                        )
                    }
                </>
                
                
                <SizedBox height={2} />
            </Container>
            <SizedBox height={0.5} />
        </Container>
    )
}

export default OppDetailsHeader;