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
import {H1,H2,P, Button} from '../../../../../components/component';
import  Colors  from '../../../../../helpers/colors';
import calender_icon from '../../../../../../assets/img/icons/calendar.png';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import {useStoreState} from 'easy-peasy';

const InvestmentInfo = props => {
    const {opportunity} = useStoreState(state => {
        return({
            opportunity : state.opportunity,
        })
    });
    let new_opp = opportunity.oppo !== undefined ? opportunity.oppo :  opportunity;
    return(
        <ScrollArea>
            <Container flexGrow={1}>
                <SizedBox height={3}/>
                {
                    new_opp.investment_type === "real estate" && ( 
                       <>
                        <Container paddingHorizontal={5}>
                            <H1>Pricing Plans</H1>
                            <SizedBox height={1}/>
                            {
                                new_opp.pricing_plans.length  > 0 ? new_opp.pricing_plans.map((plan,index)=>(
                                    <Container marginBottom={1}>
                                        <P key={index}>{plan}</P>
                                    </Container>
                                )) : (<P>Not Available</P>)
                            }
                        </Container>
                        <Container paddingHorizontal={5} marginTop={2}>
                            <H1>Features</H1>
                            <SizedBox height={1}/>
                            {
                                new_opp.features.length  > 0 ? (
                                    <Container marginBottom={1}>
                                        <P>{new_opp.features.toString()}</P>
                                    </Container>
                                ) : (<P>Not Available</P>)
                            }
                        </Container>

                        <Container paddingHorizontal={5} marginTop={2}>
                            <H1>Benefits</H1>
                            <SizedBox height={1}/>
                            {
                                new_opp.benefits.length  > 0 ? (
                                    <Container marginBottom={1}>
                                        <P>{new_opp.benefits.toString()}</P>
                                    </Container>
                                ) : (<P>Not Available</P>)
                            }
                        </Container>
                       </>
                    ) 
                }
                {
                    new_opp.investment_type !== "real estate" && (
                        <>
                            <Container direction="row" paddingLeft={3} paddingRight={6}>
                                <Container widthPercent="50%" 
                                    horizontalAlignment="center" 
                                    padding={4}
                                    backgroundColor={Colors.white}
                                >
                                    <P fontSize={10}>{['fixed income',"others"].includes(new_opp.investment_type) ? 'Min Investment' : 'Price/Unit'}</P>
                                    <H2 fontSize={10}>&#x20A6;{Number(new_opp.price).toLocaleString('en-US')}</H2>
                                </Container>
                                <Container 
                                    widthPercent="50%" 
                                    horizontalAlignment="center" 
                                    padding={4}
                                    backgroundColor={Colors.white}
                                    marginLeft={3}
                                > 
                                    <P fontSize={10}>ROI</P>
                                    <H2 fontSize={10}>{new_opp.roi}%</H2>
                                </Container>
                            </Container>
                            <SizedBox height={3} />
                            <Container direction="row" paddingLeft={3} paddingRight={6}>
                                {
                                   !['fixed income',"others"].includes(new_opp.investment_type) && (
                                        <Container widthPercent="50%" 
                                            horizontalAlignment="center" 
                                            padding={4}
                                            backgroundColor={Colors.white}
                                        >
                                            <P fontSize={10}>Trade Cycle</P>
                                            <H2 fontSize={10}>{moment(new_opp.start_date).format('MMM')} - {moment(new_opp.end_date).format('MMM YYYY')} </H2>
                                        </Container>
                                    )
                                }
                                <Container 
                                    widthPercent="50%" 
                                    horizontalAlignment="center" 
                                    padding={4}
                                    backgroundColor={Colors.white}
                                    marginLeft={!['fixed income',"others"].includes(new_opp.investment_type) ? 3 : 0}
                                > 
                                    <P fontSize={10}>Tenor</P>
                                    <H2 fontSize={10}>{new_opp.maturity_period || 
                                `${new_opp.maturity_in_months} months` }</H2>
                                </Container>
                            </Container>
                        </>
                    )
                }
                <SizedBox height={7} />
            </Container>
        </ScrollArea>
    );
}

export default InvestmentInfo;