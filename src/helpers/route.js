import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {HomeTabMenu, ProfileTabMenu,OppDetailsTabMenu,EventsTabMenu} from '../components/menus';

import Feeds from '../pages/main/home/feeds/feeds';
import Topics from '../pages/main/home/topics/topic';
import Groups from '../pages/main/home/groups/group';

import Investment from '../pages/main/opportunities/investments';
import Funding from '../pages/main/opportunities/funding';
import Others from '../pages/main/opportunities/others';

import AboutMe from '../pages/main/profile/aboutMe';
import MyPost from '../pages/main/profile/myPost';
import Loans from '../pages/main/opportunities/funding/loans';
import Grants from '../pages/main/opportunities/funding/grants';
import Jobs from '../pages/main/opportunities/others/jobs';
import Scholarships from '../pages/main/opportunities/others/scholarships';
import AboutInvestment from '../pages/main/opportunities/details/invest_details/about_investment';
import InvestmentInfo from '../pages/main/opportunities/details/invest_details/investment_info';
import OppsDescription from '../pages/main/opportunities/details/otheropps_details/description';
import OppsRequirements from '../pages/main/opportunities/details/otheropps_details/requirements';
import OppsCompanyInfo from '../pages/main/opportunities/details/otheropps_details/company_info';
import PastEvents from '../pages/main/events/past_events'
import UpcomingEvents from '../pages/main/events/upcoming_events';
import MyEvents from '../pages/main/events/my_events';
import InvestmentApps from '../pages/applications/investment_applications';
import FundingApps from '../pages/applications/fund_applications';
import LoansList from '../pages/applications/loans_list';
import GrantsList from '../pages/applications/grants_list';
import  JobsList from '../pages/applications/jobs_list';
import  ScholarshipsList from '../pages/applications/scholarships_list';
import OthersApps from '../pages/applications/others_applications';
import DiscountInfo from '../pages/affinity/tabs/discount_info';
import HowItWorks from '../pages/affinity/tabs/how_it_works';
import PDFResource from '../pages/resources/tabs/pdfs';
import SessionResource from '../pages/resources/tabs/sessions';
import BlockedResource from '../pages/privacy/tabs/blocked';

import GroupDescription from '../pages/main/home/groups/details/info_details/group_description';
import GroupRules from '../pages/main/home/groups/details/info_details/group_rules';
import GroupMembers from '../pages/main/home/groups/details/info_details/group_members';

const HomeTab = createMaterialTopTabNavigator();
export const HomeTabScreens = () => (
  <HomeTab.Navigator tabBar={props => <HomeTabMenu {...props} />} initialRouteName="Feed" lazy={true} swipeEnabled={false}>
    <HomeTab.Screen name="Feed" component={Feeds} />
    <HomeTab.Screen name="Trending" component={Topics} />
    <HomeTab.Screen name="Groups" component={Groups} />
  </HomeTab.Navigator>
);

const OpportunityTab = createMaterialTopTabNavigator();
export const OpportunityTabScreens = () => (
  <OpportunityTab.Navigator tabBar={props => <HomeTabMenu {...props} />} initialRouteName="Investment" lazy={true} swipeEnabled={false}>
    <OpportunityTab.Screen name="Investment" component={Investment} />
    <OpportunityTab.Screen name="Funding" component={Funding} />
    <OpportunityTab.Screen name="Others" component={Others} />
  </OpportunityTab.Navigator>
);

const ApplicationsTab = createMaterialTopTabNavigator();
export const ApplicationsTabScreens = () => (
  <ApplicationsTab.Navigator tabBar={props => <HomeTabMenu {...props} />} initialRouteName="InvestmentApps" lazy={true} swipeEnabled={false}>
    <ApplicationsTab.Screen name="InvestmentApps" component={InvestmentApps} />
    <ApplicationsTab.Screen name="FundingApps" component={FundingApps} />
    <ApplicationsTab.Screen name="OthersApps" component={OthersApps} />
  </ApplicationsTab.Navigator>
);

const EventTab = createMaterialTopTabNavigator();
export const EventTabScreens = () => (
  <EventTab.Navigator tabBar={props => <EventsTabMenu {...props} />} initialRouteName="UpcomingEvents" lazy={true} swipeEnabled={false}>
    <EventTab.Screen name="Upcoming" component={UpcomingEvents} />
    <EventTab.Screen name="Past_Events" component={PastEvents} />
    <EventTab.Screen name="My_Events" component={MyEvents} />
  </EventTab.Navigator>
);



const ProfileTab = createMaterialTopTabNavigator();
export const ProfileTabScreen = (props) => (
  <ProfileTab.Navigator tabBar={props => <ProfileTabMenu {...props} />} lazy={false} swipeEnabled={false}>
    <ProfileTab.Screen component={AboutMe} name="About Me" />
    <ProfileTab.Screen component={MyPost} name="Posts" />
  </ProfileTab.Navigator>
);

const FundingTab = createMaterialTopTabNavigator();
export const FundingTabScreen = (props) => (
  <FundingTab.Navigator tabBar={props => <ProfileTabMenu {...props} />} lazy={false} swipeEnabled={false}>
    <FundingTab.Screen component={Loans} name="Loans" />
    <FundingTab.Screen component={Grants} name="Grants" />
  </FundingTab.Navigator>
);

const FundingAppTab = createMaterialTopTabNavigator();
export const FundingAppTabScreen = (props) => (
  <FundingAppTab.Navigator tabBar={props => <ProfileTabMenu {...props} />} lazy={false} swipeEnabled={false}>
    <FundingAppTab.Screen component={LoansList} name="LoansList" />
    <FundingAppTab.Screen component={GrantsList} name="GrantsList" />
  </FundingAppTab.Navigator>
);

const OthersAppTab = createMaterialTopTabNavigator();
export const OthersAppTabScreen = (props) => (
  <OthersAppTab.Navigator tabBar={props => <ProfileTabMenu {...props} />} lazy={false} swipeEnabled={false}>
    <OthersAppTab.Screen component={JobsList} name="JobsList" />
    <OthersAppTab.Screen component={ScholarshipsList} name="ScholarshipsList" />
  </OthersAppTab.Navigator>
);

const OtherOppsTab = createMaterialTopTabNavigator();
export const OtherOppsTabScreen = (props) => (
  <OtherOppsTab.Navigator tabBar={props => <ProfileTabMenu {...props} />} lazy={false} swipeEnabled={false}>
    <OtherOppsTab.Screen component={Scholarships} name="Scholarships" />
    <OtherOppsTab.Screen component={Jobs} name="Jobs" />
  </OtherOppsTab.Navigator>
);

const ResourcesTab = createMaterialTopTabNavigator();
export const ResourcesTabScreen = (props) => (
  <ResourcesTab.Navigator tabBar={props => <ProfileTabMenu {...props} />} lazy={false} swipeEnabled={false}>
    <ResourcesTab.Screen component={SessionResource} name="Sessions" />
    <ResourcesTab.Screen component={PDFResource} name="PDFs" />
  </ResourcesTab.Navigator>
);

const BlockedTab = createMaterialTopTabNavigator();
export const BlockedTabScreen = props => (
  <BlockedTab.Navigator tabBar={props => <ProfileTabMenu {...props} />} lazy={false} swipeEnabled={false}>
    <BlockedTab.Screen component={BlockedResource} name="Blocked" />
    {/*<BlockedTab.Screen component={SessionResource} name="Sessions" />
  <BlockedTab.Screen component={PDFResource} name="PDFs" />*/}
  </BlockedTab.Navigator>
);

const InvestmentDetailsTab = createMaterialTopTabNavigator();
export const InvestmentDetailsTabScreen = (props) => (
  <InvestmentDetailsTab.Navigator tabBar={props => <ProfileTabMenu {...props} />} lazy={false} swipeEnabled={false}>
    <InvestmentDetailsTab.Screen component={InvestmentInfo} name="Investment_Info" />
    <InvestmentDetailsTab.Screen component={AboutInvestment} name="About_Investment" />
  </InvestmentDetailsTab.Navigator>
);


const AffinityDetailsTab = createMaterialTopTabNavigator();
export const AffinityDetailsTabScreen = (props) => (
  <AffinityDetailsTab.Navigator tabBar={props => <ProfileTabMenu {...props} />} lazy={false} swipeEnabled={false}>
    <AffinityDetailsTab.Screen component={DiscountInfo} name="Discount_Info" />
    <AffinityDetailsTab.Screen component={HowItWorks} name="How_to_Redeem" />
  </AffinityDetailsTab.Navigator>
);

const OtherOppsDetailsTab = createMaterialTopTabNavigator();
export const OtherOppsDetailsTabScreen = (_props) => (
  <OtherOppsDetailsTab.Navigator tabBar={props => <OppDetailsTabMenu {...props} _props={_props} />} lazy={false} swipeEnabled={false}>
    <OtherOppsDetailsTab.Screen component={OppsDescription} name="Description" />
    <OtherOppsDetailsTab.Screen component={OppsRequirements} name="Requirements" />
    <OtherOppsDetailsTab.Screen component={OppsCompanyInfo} name="Company_Info" />
  </OtherOppsDetailsTab.Navigator>
);


const GroupEventTab = createMaterialTopTabNavigator();
export const GroupEventTabScreens = () => (
  <GroupEventTab.Navigator
    tabBar={props => <EventsTabMenu {...props} />}
    initialRouteName="UpcomingEvents"
    lazy={true}
    swipeEnabled={false}>
    <GroupEventTab.Screen name="Upcoming" component={UpcomingEvents} />
    <GroupEventTab.Screen name="Past_Events" component={PastEvents} />
    <GroupEventTab.Screen name="My_Events" component={MyEvents} />
  </GroupEventTab.Navigator>
);

const GroupInfoDetailsTab = createMaterialTopTabNavigator();
export const GroupInfoTabScreen = props => (
  <GroupInfoDetailsTab.Navigator tabBar={props => <EventsTabMenu {...props} />} lazy={false} swipeEnabled={false}>
    <GroupInfoDetailsTab.Screen component={GroupDescription} name="Description" />
    <GroupInfoDetailsTab.Screen component={GroupRules} name="Rules" />
    <GroupInfoDetailsTab.Screen component={GroupMembers} name="Members" />
  </GroupInfoDetailsTab.Navigator>
);