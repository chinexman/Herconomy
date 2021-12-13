import React from 'react';
import {H1,P,H2,TouchFeedback} from './component';
import {Container, ScrollArea, Avatar, SizedBox, ImageWrap, TouchWrap, InputWrap} from '@burgeon8interactive/bi-react-library';
import Colors from '../helpers/colors';
import { useStoreActions } from 'easy-peasy';
import LovedIcon from '../../assets/img/icons/love.png';
import moment from 'moment';
import { Capitalize } from '../helpers/utils';
import { FONTSIZE } from '../helpers/constants';

const Card = ({data,navigation,navigate_to,tabName,data_length,index,isInvestment = false}) => {
  const updateOpportunity = useStoreActions(actions => actions.opportunity.updateOpportunity);
    let banner = tabName !== 'jobs' ? data.banner : data.logo;
    let summary = tabName !== 'jobs' ? data.summary : `${data.user.first_name} ${data.user.last_name}`
    return (
      <Container padding={1.5} marginBottom={data_length && (data_length - 1) === index ? 20 : 0}>
        <TouchFeedback
          onPress={() => {
            updateOpportunity(data);
            navigation.navigate(navigate_to,{opportunity:data,tabname:tabName,showButtons:true})
          }}
        >
          <Container backgroundColor={Colors.whiteBase} elevation={5} widthPercent="100%" direction="row" borderRadius={10}>
            <Container widthPercent="40%">
              <ImageWrap
                borderTopLeftRadius={10}
                borderBottomLeftRadius={10}
                flex={1}
                backgroundColor="white"
                url={isInvestment ? data.logo : banner}
              />
            </Container>
            <Container paddingVertical={1} paddingLeft={4} paddingTop={3} paddingBottom={3}
              widthPercent="60%"
            >
                <Container marginRight={3}>
                    <H2 fontSize={FONTSIZE.medium} flexWrap="wrap">{data.title}</H2>
                    {
                      data.investment_type !== "real estate" && (
                        <>
                          {
                            isInvestment ? (
                              <P fontSize={FONTSIZE.small}>{`${data.roi}% ${data.tenor_type ? data.tenor_type : ''} in ${data.maturity_period || 
                                `${data.maturity_in_months} months` }`}</P>
                            ) : (
                              <P fontSize={FONTSIZE.small} numberOfLines={1}>
                                {tabName === 'loans' || tabName === 'grants' ? data.description : summary}
                              </P>
                            )
                          }
                        </>
                      )
                    }
                </Container>
              <SizedBox height={2} />
              {
                isInvestment ? (
                  <>
                  <Container direction="row">
                    <Container marginRight={3}>
                      {
                        data.investment_type === "real estate" && (
                            <>
                              <H2>{data.location}</H2>
                              <P fontSize={FONTSIZE.medium}>Location</P>
                            </>
                        )
                      }
                      {
                        !["real estate"].includes(data.investment_type) && (
                            <Container>
                              <H2>&#x20A6;{Number(data.price).toLocaleString('en-US')}</H2>
                              <P fontSize={FONTSIZE.medium}>{['fixed income',"others"].includes(data.investment_type) ? 'Minimum' : "Per Unit"}</P>
                            </Container>
                        )
                      }
                    </Container>
                    {
                      !["real estate","fixed income","others"].includes(data.investment_type) && (
                        <Container>
                          <H2 textAlign="center" fontSize={FONTSIZE.medium}>{`${data.units_available}`}</H2>
                          <P>Remaining</P>
                        </Container>
                      )
                    }
                    {
                      ['fixed income',"others"].includes(data.investment_type) && (
                        <Container widthPercent="35%" marginLeft={2}>
                          <H2 numberOfLines={1}>{data.risk && Capitalize(data.risk)}</H2>
                          <P fontSize={FONTSIZE.medium}>Risk</P>
                        </Container>
                      )
                    }
                  </Container>
                  <SizedBox height={3} />
                  <Container backgroundColor="#e8dcdb" width={18} borderRadius={5} padding={0.5}>
                    <P fontSize={5} color={data.status.toLowerCase() === 'active' ? Colors.lightGreen : '#EA4335'} 
                    textAlign="center">
                      {data.status.toLowerCase() === 'active' ? 'available' : 'sold out'}
                    </P>
                  </Container>
                </>
                ) : (

                    <>
                      <P fontSize={6}>
                      {data && data.created_at ? moment(data.created_at, 'YYYY-MM-DDTHH:mm:ss.SSS')
                .local()
                .fromNow() : null}
                        </P>
                      <SizedBox height={2} />
                      <Container width={5.5} borderRadius={5} padding={0.5} horizontalAlignment="flex-start">
                        {
                            data.liked && (
                              <ImageWrap 
                                  source={LovedIcon}
                                  height={3}
                                  fit="contain"
                              />
                            )
                        }
                      </Container>
                    </>
                )
              }
            </Container>
          </Container>
        </TouchFeedback>
        <SizedBox height={3} />
      </Container>
    );
  }

  export default Card;