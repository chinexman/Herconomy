import React, {useState} from 'react';
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
import {H1,H2,P, Button,TouchFeedback} from '../../../../../components/component';
import  Colors  from '../../../../../helpers/colors';
import {useStoreState} from 'easy-peasy';
import {FullImageModal} from '../../../../../components/image_modal'
const AboutInvestment = props => {
    const {opportunity} = useStoreState(state => {
        return({
            opportunity : state.opportunity,
        })
    });
    const [show,setShow] = useState(false)
    const [current_image,setCurrentImage] = useState(null);
    let new_opp = opportunity.oppo !== undefined ? opportunity.oppo :  opportunity;
    return(
        <ScrollArea>
            <SizedBox height={2}/>
            <Container padding={5}>
               {
                   new_opp.investment_type !== "real estate"  && (
                    <>
                        <H1>Description</H1>
                        <P>
                            {new_opp.description}
                        </P>
                    </>
                   )
               }

               {
                   new_opp.investment_type === 'others' && (
                        <>
                            <SizedBox height={2}/>
                            <H1>Company</H1>
                            <P>
                                {new_opp.company}
                            </P>
                        </>
                   )
               }
               {
                   new_opp.investment_type === "real estate"  && (
                        <>
                            <Container paddingHorizontal={3} marginTop={2}>
                                <H1>Summary</H1>
                                <SizedBox height={1}/>
                                <P>{new_opp.description}</P>
                            </Container>
                            <Container paddingHorizontal={3} marginTop={2}>
                                <H1>Other partners</H1>
                                <SizedBox height={1}/>
                                <P>{new_opp.other_partners || "Not Available"}</P>
                            </Container>
                            <SizedBox height={2} />
                            <Container paddingHorizontal={3} marginTop={2}>
                                <H1>Pictures</H1>
                                <Container direction="row" wrap="wrap">
                                    {
                                        new_opp.layout_images.map((img,index)=>(
                                           <TouchFeedback
                                            onPress={()=>{
                                                setShow(true)
                                                setCurrentImage(img.image)
                                            }}
                                           >
                                            <Avatar 
                                                url={img.image}
                                                size={12}
                                                marginRight={3}
                                                marginTop={2}
                                            />
                                           </TouchFeedback>
                                        ))   
                                    }
                                    {
                                        show && (
                                            <FullImageModal setShow={setShow} image={current_image} />
                                        )
                                    }
                                </Container>
                            </Container>
                            
                        </>
                   )
                   
               }
            </Container>
            <SizedBox height={7} />
        </ScrollArea>
    );
}

export default AboutInvestment;