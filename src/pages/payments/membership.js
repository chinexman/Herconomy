import React, {useState} from 'react';
import {AppPageBack, H1, H2, P, Button, Dropdown, ListWrapGeneral} from '../../components/component';
import {Container, SizedBox, ScrollArea, ImageWrap} from '@burgeon8interactive/bi-react-library';
import Feather from 'react-native-vector-icons/Feather';
import {Modal} from 'react-native';
import Colors from '../../helpers/colors';

const SilverPlan = [
  {title: 'Opportunity Market Place'},
  {title: 'Once the refer 25 people to the platform, they get one month free subscription on the gold'},
  {title: 'General Feed'},
  {title: 'Topics'},
  {title: 'Events'},
];

const GoldPlan = [
  {title: 'Opportunity Market Place'},
  {title: 'Unlimited Direct Messages'},
  {title: 'General Feed'},
  {title: 'Topics'},
  {title: 'Events'},
  {title: 'As a gold member, if they recommend another member, they get 1,000 cash'},
];

const Membership = props => {
  const [showList, setShowList] = useState(false);
  const [listMap] = useState([{title: 'Gold'}]);
  const [listTitle] = useState('Plan');
  const [chosenPlan, setChosenPlan] = useState('Gold Plan');
  const [plan, setPlan] = useState(GoldPlan);

  const selectFromList = el => {
    setPlan([]);
    setShowList(false);
    setChosenPlan(`${el.title} Plan`);
    if (el.title === 'Silver (Free)') {
      setPlan(SilverPlan);
    } else {
      setPlan(GoldPlan);
    }
  };

  return (
    <AppPageBack {...props}>
      <ScrollArea>
        <Container horizontalAlignment="center" paddingTop={6}>
          <H1 textAlign="center" fontSize={23}>
            Join the Tribe
          </H1>

          <P textAlign="center" fontSize={8}>
            Select a plan that’s right for you
          </P>
        </Container>

        <Container marginTop={4}>
          <Dropdown placeholder="Choose a plan" value={chosenPlan} onPress={() => setShowList(true)} />
        </Container>

        {plan.length > 0 ? (
          <Container borderColor={Colors.Button} borderWidth={0.2} padding={4} borderRadius={8} marginBottom={2}>
            {plan.map((el, i) => (
              <Container key={i} borderBottomWidth={0.2} paddingVertical={2}>
                <H2 fontSize={11}>{el.title}</H2>
              </Container>
            ))}
          </Container>
        ) : null}

        <Button title="Continue" onPress={() => props.navigation.navigate('Plan', chosenPlan)} />
      </ScrollArea>

      <Modal visible={showList} transparent={true} statusBarTranslucent={true}>
        <Container backgroundColor="#0009" flex={1} horizontalAlignment="center" verticalAlignment="flex-start">
          <SizedBox height={30} />
          <Container height={50} width={95}>
            <ListWrapGeneral
              onToggle={() => setShowList(!showList)}
              title={listTitle}
              listMap={listMap}
              onHide={() => setShowList(false)}
              selectFromList={selectFromList}
            />
          </Container>
        </Container>
      </Modal>
    </AppPageBack>
  );
};

export default Membership;
