import React,{useEffect} from 'react';
import {Container, SizedBox} from '@burgeon8interactive/bi-react-library';
import Colors from '../../../helpers/colors';
import {H1, P,H2} from '../../../components/component';
import {useStoreState} from 'easy-peasy';
import { FONTSIZE } from '../../../helpers/constants';

const AboutMe = ({about_me}) => {
  return (
    <Container
        widthPercent="100%"
        // verticalAlignment="center"
        paddingBottom={2.5}
        paddingTop={2.5}
        backgroundColor={Colors.white}
        flex={1}>
        <Container marginBottom={3}>
          <H1 fontSize={8}>Profession</H1>
          <SizedBox height={0.5} />
          <P fontSize={FONTSIZE.medium} color={Colors.greyBase600}>
            {about_me.profession}
          </P>
        </Container>

        <Container marginBottom={3}>
          <H1 fontSize={8}>Industry</H1>
          <SizedBox height={0.5} />
          <P fontSize={FONTSIZE.medium} color={Colors.greyBase600}>
            {about_me.industry}
          </P>
        </Container>

        {about_me.job_title && (
          <Container marginBottom={3}>
            <H1 fontSize={8}>Current Job</H1>
            <SizedBox height={0.5} />
            <H2 fontSize={FONTSIZE.medium} color={Colors.greyBase600}>
              {about_me.job_title}
            </H2>
            <SizedBox height={0.2} />
            <P fontSize={FONTSIZE.medium} color={Colors.greyBase600}>
              {about_me.company_name}
              {about_me.job_location && `, ${about_me.job_location}`}
            </P>
          </Container>
        )}

        {about_me.education && about_me.education.length > 0 && (
          <Container marginBottom={3}>
            <H1 fontSize={FONTSIZE.medium}>Education</H1>
            <SizedBox height={0.5} />
            <P fontSize={FONTSIZE.medium} color={Colors.greyBase600}>
              {about_me.education[0].institution}
            </P>
            <P fontSize={FONTSIZE.medium} color={Colors.greyBase600}>
              {about_me.education[0].certification}
            </P>
          </Container>
        )}

        <Container marginBottom={2}>
          <H1 fontSize={FONTSIZE.medium}>Interest</H1>
          <SizedBox height={0.5} />
          <Container direction="row" wrap="wrap">
            {about_me.interest
              ? about_me.interest.map((el, i) => (
                  <Container marginRight={2} marginBottom={1} padding={2} borderColor={Colors.primary} borderWidth={1} key={i}>
                    <P fontSize={FONTSIZE.medium} color={Colors.greyBase600} key={i}>
                      {el.toUpperCase()}
                    </P>
                  </Container>
                ))
              : null}
          </Container>
        </Container>
      </Container>
  );
};

export default AboutMe;
