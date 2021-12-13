/* console.ignoredYellowBox = true;
console.disableYellowBox = true; */

import React,{useEffect} from 'react';
import codePush from 'react-native-code-push';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation//stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {StoreProvider} from 'easy-peasy';
import AppStore from './src/helpers/store';
import {RouteContext} from './src/helpers/routeContext';

import Splash from './src/pages/splash';

import OnboardOne from './src/pages/onBoard/onboard1';
import OnboardTwo from './src/pages/onBoard/onboard2';
import OnboardThree from './src/pages/onBoard/onboard3';
import OnboardFour from './src/pages/onBoard/onboard4';

import SignIn from './src/pages/auth/login';
import SignUp from './src/pages/auth/signup';

import Home from './src/pages/main/home/home';
import Post from './src/pages/main/post/post';

import Message from './src/pages/main//message/message';
import MessageSearch from './src/pages/main//message//messageSearch';
import MessageRequest from './src/pages/main/message/messageRequest';

import FeedDetails from './src/pages/main/home/feeds/feedDetails';

import {MainTabMenu, DrawerMenu} from './src/components/menus';
import Profile from './src/pages/main/profile/profile';
import ProfileEdit from './src/pages/main/profile/edit';

import Search from './src/pages/main/home/search';
import GroupDetails from './src/pages/main/home/groups/groupDetails';

import GroupEvents from './src/pages/main/home/groups/details/groupEvents';
import GroupSearch from './src/pages/main/home/groups/details/groupSearch';
import GroupAdmin from './src/pages/main/home/groups/details/groupAdmin';
import GroupRequests from './src/pages/main/home/groups/details/groupRequests';
import GroupInfo from './src/pages/main/home/groups/details/groupInfo';

import NewGroupPost from './src/pages/main/home/groups/newGroupPost';

import TopicDetails from './src/pages/main/home/topics/topicDetails';
import TopicDetailsPost from './src/pages/main/home/topics/topicDetailsPost';
import NewTopicPost from './src/pages/main/home/topics/newTopicPost';

import MessageChat from './src/pages/main/message/messageChat';
import GroupDetailsPost from './src/pages/main/home/groups/groupDetailsPost';
import FeedPost from './src/pages/main/home/feeds/feedPost';
import Policy from './src/pages/main/policy';
import Forgot from './src/pages/auth/forgot';
import Verify from './src/pages/auth/verify';
import FeedActions from './src/pages/main/home/feeds/feedActions';
import Payments from './src/pages/payments/payments';
import Membership from './src/pages/payments/membership';
import Plan from './src/pages/payments/plan';
import Cards from './src/pages/payments/card';
import PaymentOption from './src/pages/payments/paymentOption';
import Checkout from './src/pages/payments/checkout';
import Webview from './src/pages/payments/webview';

import Opportunities from './src/pages/main/opportunities/opportunities';
import InvestDetails from './src/pages/main/opportunities/details/investDetails';
import OtherOppsDetails from './src/pages/main/opportunities/details/otheropps_details';
import Events from './src/pages/main/events/events';
import EventDetails from './src/pages/main/events/details/event_details';
import EventCart from './src/pages/main/events/details/event_cart';
import ReferEarn from './src/pages/refer_and_earn/refer_earn';
import JoinReferralProgram from './src/pages/refer_and_earn/join_referral_program';
import ReferFriend from './src/pages/refer_and_earn/refer_friend';
import EarningsDashboard from './src/pages/refer_and_earn/earnings_dashboard';
import BuyUnits from './src/pages/main/opportunities/details/invest_details/buy_investment_units';
import InvestmentCart from './src/pages/main/opportunities/details/invest_details/investment_cart';
import JobApplication from './src/pages/main/opportunities/details/invest_details/job_application';
import FundApplication from './src/pages/main/opportunities/details/invest_details/fund_application';
import Privacy from './src/pages/privacy/privacy';

import Applications from './src/pages/applications/applications';
import Welcome from './src/pages/auth/welcome';
import Account from './src/pages/account';
import Affinity from './src/pages/affinity/affinity';
import AffinityDetails from './src/pages/affinity/affinity_details';
import HowItWorks from './src/pages/affinity/tabs/how_it_works';
import DiscountInfo from './src/pages/affinity/tabs/discount_info';
import GiftSomeone from './src/pages/gift_someone/gift_someone';
import BuyGift from './src/pages/gift_someone/buy_gift';
import GiftPayNow from './src/pages/gift_someone/gift_pay_now';
import Resources from './src/pages/resources/resources';
import ResourceDetails from './src/pages/resources/resource_details';
import Recipients from './src/pages/gift_someone/recipients';
import ShowResource from './src/pages/resources/show';
import Settings from './src/pages/settings/settings';
import ResetPwd from './src/pages/settings/reset';
import Notification from './src/pages/notification/notifications';
import CustomPush from './src/pages/notification/custom_push';
import { Upgrade } from './src/pages/main/upgrade';
import {AddGroupEvent} from './src/pages/main/home/groups/add_group_events';
import {MainGroupEvents} from './src/pages/main/home/groups/group_events';
import ContactUs from './src/pages/contact/contact';
import {SetNotification} from './src/pages/settings/set_notification';
import { PostLikes } from './src/pages/main/home/post_likes';
import Toast, { BaseToast } from 'react-native-toast-message';
import Colors from './src/helpers/colors';
import Logo from './assets/img/agsLogo_dark.png';
import { socketConnection } from './src/helpers/sockets';

//Savings new screens
import Savings from './src/pages/main/savings/savings';
import { Wallet } from './src/pages/main/savings/wallet';
import Notify from './src/pages/main/home/notify';
import { Transactions } from './src/pages/main/savings/transactions';
import { Plans } from './src/pages/main/savings/plans';
import { Performance } from './src/pages/main/savings/performance';
import { GoalName } from './src/pages/main/savings/goal_name';
import { ReviewPlan } from './src/pages/main/savings/review_plan';
import { SinglePlan } from './src/pages/main/savings/single_plan';
import { PlanSettings } from './src/pages/main/savings/plan_settings';
import { TransactionDetails } from './src/pages/main/savings/transaction_details';
import { AccountSearch } from './src/pages/main/savings/account_search';


const OnboardStack = createStackNavigator();
const OnboardStackScreens = () => (
  <OnboardStack.Navigator headerMode={null} screenOptions={{...TransitionPresets.SlideFromRightIOS}} initialRouteName="SignIn">
    <OnboardStack.Screen name="OnboardTwo" component={OnboardTwo} />
    <OnboardStack.Screen name="OnboardThree" component={OnboardThree} />
    <OnboardStack.Screen name="OnboardFour" component={OnboardFour} />
  </OnboardStack.Navigator>
);

const AuthStack = createStackNavigator();
const AuthStackScreens = () => (
  <AuthStack.Navigator headerMode={null} screenOptions={{...TransitionPresets.SlideFromRightIOS}} initialRouteName="Welcome">
    <AuthStack.Screen name="SignIn" component={SignIn} />
    <AuthStack.Screen name="SignUp" component={SignUp} />
    <AuthStack.Screen name="Forgot" component={Forgot} />
    <AuthStack.Screen name="Verify" component={Verify} />
    <AppStack.Screen name="Policy" component={Policy} />
    <AppStack.Screen name="Welcome" component={Welcome} />
  </AuthStack.Navigator>
);

const LoginStack = createStackNavigator();
const LoginStackScreens = () => (
  <LoginStack.Navigator headerMode={null} screenOptions={{...TransitionPresets.SlideFromRightIOS}} initialRouteName="SignIn">
    <LoginStack.Screen name="SignIn" component={SignIn} />
    <LoginStack.Screen name="SignUp" component={SignUp} />
    <LoginStack.Screen name="Forgot" component={Forgot} />
    <LoginStack.Screen name="Verify" component={Verify} />
    <LoginStack.Screen name="Policy" component={Policy} />
    <LoginStack.Screen name="Welcome" component={Welcome} />
  </LoginStack.Navigator>
);

const TabStack = createBottomTabNavigator();
const TabStackScreen = () => (
  <TabStack.Navigator tabBar={props => <MainTabMenu {...props} />} initialRouteName="Home">
    <TabStack.Screen name="Home" component={Home} />
    <TabStack.Screen name="Savings" component={Savings}/>
    <TabStack.Screen name="Add" component={Post} />
    <TabStack.Screen name="Oppo" component={Opportunities} />
    <TabStack.Screen name="Notifications" component={Notification} />

    {/** Remove Savings and Add Events **/}
    

    {/* <TabStack.Screen name="Events" component={Events} /> */}
  </TabStack.Navigator>
);

const DrawerStack = createDrawerNavigator();
const DrawerStackScreen = (props) => {
  return (
    <DrawerStack.Navigator drawerContent={props => <DrawerMenu {...props} />}>
      <DrawerStack.Screen name="Home" component={TabStackScreen} />
      {/* <DrawerStack.Screen name="Upgrade" component={Payments} /> */}
      <DrawerStack.Screen name="Savings" component={Savings} />
      <DrawerStack.Screen name="Transactions" component={Transactions} />
      <DrawerStack.Screen name="Applications" component={Applications} />
      <DrawerStack.Screen name="Resources" component={Resources} />
      <DrawerStack.Screen name="Affinity" component={Affinity} />
      <DrawerStack.Screen name="Events" component={Events} />
      <DrawerStack.Screen name="GiftSomeone" component={GiftSomeone} />
      <DrawerStack.Screen name="ReferEarn" component={ReferEarn} />
      <DrawerStack.Screen name="Support" component={ContactUs} />
      <DrawerStack.Screen name="Settings" component={Settings} />
      {/* <DrawerStack.Screen name="Privacy" component={Privacy} options={{unmountOnBlur: true}} /> */}
      {/* <DrawerStack.Screen name="Notifications" component={Notification}/> */}
    </DrawerStack.Navigator>
  );
};

const AppStack = createStackNavigator();
const AppStackScreens = (props) => (
  <AppStack.Navigator headerMode="none" screenOptions={{...TransitionPresets.SlideFromRightIOS}} initialRouteName="Home">
    <AppStack.Screen name="Home" component={DrawerStackScreen} />
    <AppStack.Screen name="FeedDetails" component={FeedDetails} />
    <AppStack.Screen name="Membership" component={Membership} />
    <AppStack.Screen name="Plan" component={Plan} />
    <AppStack.Screen name="PaymentOption" component={PaymentOption} />
    <AppStack.Screen name="Checkout" component={Checkout} />
    <AppStack.Screen name="Webview" component={Webview} />
    <AppStack.Screen name="Cards" component={Cards} />

    <AppStack.Screen name="Profile" component={Profile} />
    <AppStack.Screen name="ProfileEdit" component={ProfileEdit} />
    <AppStack.Screen name="FeedPost" component={FeedPost} />
    <AppStack.Screen name="PostLikes" component={PostLikes} />
    <AppStack.Screen name="GroupDetails" component={GroupDetails} />
    <AppStack.Screen name="GroupDetailsPost" component={GroupDetailsPost} />
    {/* <AppStack.Screen name="GroupEvents" component={GroupEvents} /> */}
    <AppStack.Screen name="GroupSearch" component={GroupSearch} />
    <AppStack.Screen name="GroupAdmin" component={GroupAdmin} />
    <AppStack.Screen name="GroupRequests" component={GroupRequests} />
    <AppStack.Screen name="GroupInfo" component={GroupInfo} />
    <AppStack.Screen name="NewGroupPost" component={NewGroupPost} />

    <AppStack.Screen name="TopicsDetails" component={TopicDetails} />
    <AppStack.Screen name="TopicDetailsPost" component={TopicDetailsPost} />
    <AppStack.Screen name="NewTopicPost" component={NewTopicPost} />
    <AppStack.Screen name="Search" component={Search} />

    <AppStack.Screen name="MessageSearch" component={MessageSearch} />
    <AppStack.Screen name="MessageRequest" component={MessageRequest} />
    <AppStack.Screen name="MessageChat" component={MessageChat} />
    <AppStack.Screen name="Chat" component={Message} />
    <AppStack.Screen name="InvestDetails" component={InvestDetails} />
    <AppStack.Screen name="OtherOppsDetails" component={OtherOppsDetails} />
    <AppStack.Screen name="EventDetails" component={EventDetails} />
    <AppStack.Screen name="EventCart" component={EventCart} />
    <AppStack.Screen name="JoinReferralProgram" component={JoinReferralProgram} />
    <AppStack.Screen name="ReferFriend" component={ReferFriend} />
    <AppStack.Screen name="EarningsDashboard" component={EarningsDashboard} />
    <AppStack.Screen name="Recipients" component={Recipients} />
    <AppStack.Screen name="BuyUnits" component={BuyUnits} />
    <AppStack.Screen name="InvestmentCart" component={InvestmentCart} />
    <AppStack.Screen name="JobApplication" component={JobApplication} />
    <AppStack.Screen name="FundApplication" component={FundApplication} />
    <AppStack.Screen name="Upgrade" component={Payments} />
    <AppStack.Screen name="AffinityDetails" component={AffinityDetails} />
    <AppStack.Screen name="DiscountInfo" component={DiscountInfo} />
    <AppStack.Screen name="HowItWorks" component={HowItWorks} />
    <AppStack.Screen name="BuyGift" component={BuyGift} />
    <AppStack.Screen name="GiftPayNow" component={GiftPayNow} />
    <AppStack.Screen name="FeedActions" component={FeedActions} />
    <AppStack.Screen name="ShowResource" component={ShowResource} />
    <AppStack.Screen name="ResourceDetails" component={ResourceDetails} />
    <AppStack.Screen name="Account" component={Account} />
    <AppStack.Screen name="Privacy" component={Privacy} />
    <AppStack.Screen name="Reset" component={ResetPwd} />
    <AppStack.Screen name="CustomPush" component={CustomPush} />
    <AppStack.Screen name="AppUpgrade" component={Upgrade} />
    <AppStack.Screen name="AddGroupEvent" component={AddGroupEvent} />
    <AppStack.Screen name="MainGroupEvents" component={MainGroupEvents} />
    <AppStack.Screen name="SetNotification" component={SetNotification} />

    
    {/* //Saving Features */}
    <AppStack.Screen name="Wallet" component={Wallet} />
    <AppStack.Screen name="Notify" component={Notify} />
    <AppStack.Screen name="Transactions" component={Transactions} />
    <AppStack.Screen name="Plans" component={Plans} />
    <AppStack.Screen name="Performance" component={Performance} />
    <AppStack.Screen name="GoalName" component={GoalName} />
    <AppStack.Screen name="ReviewPlan" component={ReviewPlan} />
    <AppStack.Screen name="SinglePlan" component={SinglePlan} />
    <AppStack.Screen name="PlanSettings" component={PlanSettings} />
    <AppStack.Screen name="AccountSearch" component={AccountSearch} />
    <AppStack.Screen name="TransactionDetails" component={TransactionDetails} />
  </AppStack.Navigator>
);

const App = () => {
  const [currentState, setCurrentState] = React.useState(React.useContext(RouteContext).initState);
  const toastConfig = {
    success : ({ text1,text2, ...rest }) => (
      <BaseToast
        {...rest}
        style={{ borderLeftColor: Colors.button}}
        contentContainerStyle={{ paddingHorizontal: 15,marginBottom : 8,marginTop:8}}
        text1Style={{
          fontSize: 15,
          fontWeight: 'semibold'
        }}
        text1Style={{
          fontSize : 18
        }}
        text2Style={{
          fontSize : 15
        }}
        text1={text1}
        text2={text2}
        leadingIcon={Logo}
        leadingIconStyle={{
          height : 50,
          width : 50,
          marginLeft:10
        }}
      />
    ),
    error: ({ text1,text2, ...rest }) => (
      <BaseToast
        {...rest}
        style={{ borderLeftColor: 'red' }}
        contentContainerStyle={{ paddingHorizontal: 15,marginBottom : 8}}
        text1Style={{
          fontSize: 15,
          fontWeight: 'semibold'
        }}
        text1Style={{
          fontSize : 18
        }}
        text2Style={{
          fontSize : 15
        }}
        text1={text1}
        text2={text2}
        leadingIcon={Logo}
        leadingIconStyle={{
          height : 50,
          width : 50,
          marginLeft:10
        }}

      />
    )
  };  

  useEffect(()=>{
    socketConnection();
  },[])
  return (
    <StoreProvider store={AppStore}>
      <RouteContext.Provider value={{currentState, setCurrentState}}>
        <NavigationContainer>
          {currentState === 'splash' ? (
            <Splash />
          ) : currentState === 'walkthrough' ? (
            <OnboardOne />
          ) : currentState === 'onboard' ? (
            <OnboardStackScreens />
          ) : currentState === 'auth' ? (
            <AuthStackScreens />
          ) : 
          currentState === 'login' ? (
            <LoginStackScreens />
          ) :
          (
            <AppStackScreens />
          )}
        </NavigationContainer>
      </RouteContext.Provider>
      <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
    </StoreProvider>
  );
};

let codePushOptions = {installMode: codePush.InstallMode.ON_NEXT_RESTART, checkFrequency: codePush.CheckFrequency.ON_APP_RESUME};
//let codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_RESUME};
export default codePush(codePushOptions)(App);
//installMode: codePush.InstallMode.ON_NEXT_RESTART
//export default App;
