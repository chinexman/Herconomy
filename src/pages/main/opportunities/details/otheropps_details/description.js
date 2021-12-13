import React, { useEffect } from 'react';
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
import {H1,H2,P} from '../../../../../components/component';
import Colors from '../../../../../helpers/colors';
import OppDetailsHeader from '../../../../../components/opp_details_header';
import {useStoreState} from 'easy-peasy';
import numeral from 'numeral';
import moment from 'moment';

const OppsDescription = () => {
    const {opportunity} = useStoreState(state => ({
        opportunity: state.opportunity,
    }));
    const new_opp = opportunity.oppo !== undefined ? opportunity.oppo :  opportunity;
    return(
        <ScrollArea>
            <OppDetailsHeader oppo={new_opp} />
            <Container padding={3}>
                <Container direction="row" padding={5}>
                    <Container widthPercent="3%">
                    </Container>
                    <Container widthPercent="97%">
                        <H1>{new_opp.category == 'jobs' && ('Job')} Description</H1>
                        <SizedBox height={5} />
                        {new_opp.category.toLowerCase() === 'jobs' || new_opp.category.toLowerCase() === 'scholarships' || 
                        new_opp.category.toLowerCase() === "fellowship" ? (
                            <P lineHeight={25}>{new_opp.summary}</P>
                        ) : (
                            <P lineHeight={25}>{new_opp.description ? new_opp.description : new_opp.eligibility}</P>
                        )}
                    </Container>
                </Container>
               {
                    new_opp.benefits ? (
                        <Container direction="row" padding={5}>
                            <Container widthPercent="3%">
                            </Container>
                            <Container widthPercent="97%">
                                <H1>Benefits</H1>
                                <SizedBox height={3} />
                                <P lineHeight={25}>{new_opp.benefits}</P>
                            </Container>
                        </Container>
                    ) : null
               }
            </Container>
            <Container horizontalAlignment="center" verticalAlignment="center" borderBottomWidth={1} borderColor={Colors.line}>
                </Container>
            {
                new_opp.position ? (

                    <>
                    <Container direction="row" padding={3}>
                        <Container 
                        widthPercent="20%"
                        verticalAlignment="center"
                        horizontalAlignment="center"
                        >
                            <ImageWrap 
                            source={require('../../../../../../assets/img/icons/location.png')}
                            height={3}
                            width={5}
                            />
                        </Container>
                        <Container>
                            <H1>Location</H1>
                            <SizedBox height={0.5}/>
                            <P fontSize={8}>{new_opp.location}</P>
                        </Container>
                    </Container>
                    
                    <Container direction="row" padding={3}
                        horizontal={true}
                    >
                    <Container 
                        widthPercent="20%"
                        verticalAlignment="center"
                        horizontalAlignment="center"
                        >
                            <ImageWrap 
                            source={require('../../../../../../assets/img/icons/salary.png')}
                            height={3}
                            width={5}
                            />
                        </Container>
                        <Container widthPercent="76%" >
                            <H1>Salary</H1>
                            <SizedBox height={0.5}/>
                            <P 
                                numberOfLines={1}
                                fontSize={8}
                            >{new_opp.salary}</P>
                        </Container>
                    </Container>
                    </>
                ) : null
            }
            
            <Container direction="row" padding={3}>
                 <Container 
                widthPercent="20%"
                verticalAlignment="center"
                horizontalAlignment="center"
                >
                    <ImageWrap 
                    source={require('../../../../../../assets/img/icons/suitcase.png')}
                    height={3}
                    width={5}
                    />
                </Container>
                
                <Container>
                    <H1>Industries</H1>
                    <SizedBox height={0.5}/>
                    <Container wrap="wrap" paddingHorizontal={2}>
                        {
                            new_opp.industry && new_opp.industry.map((indus,index) =>{
                                return <P key={index} fontSize={8}> {indus} </P>
                            })
                        }
                    </Container>
                </Container>
            </Container>

           
                
    {
        new_opp.position && ( 
            <Container direction="row" padding={3}>
                    <Container 
                        widthPercent="20%"
                        verticalAlignment="center"
                        horizontalAlignment="center"
                    >
                    <ImageWrap 
                        source={require('../../../../../../assets/img/icons/suitcase.png')}
                        height={3}
                        width={5}
                    />
                </Container>
                <Container>
                    <H1>Job Nature</H1>
                    <SizedBox height={0.5}/>
                    <P fontSize={8}>{new_opp.work_time}</P>
                </Container>
            </Container>
        ) 
    }


            

            <Container direction="row" padding={3}>
            <Container 
                widthPercent="20%"
                verticalAlignment="center"
                horizontalAlignment="center"
                >
                    <ImageWrap 
                    source={require('../../../../../../assets/img/icons/sand_clock.png')}
                    height={3}
                    width={5}
                    />
                </Container>
                <Container>
                    <H1>Deadline</H1>
                    <SizedBox height={0.5}/>
                    <P fontSize={8}>{moment(new_opp.end_date).format("MMM Do YYYY")}</P>
                </Container>
            </Container>
            
        </ScrollArea>
    )
}

export default OppsDescription;