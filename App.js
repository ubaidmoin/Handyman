import React from 'react';
import { View, Icon, SafeAreaView, Text, ScrollView, Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';


import LoginScreen from './src/components/LoginScreen';
import StartupScreen from './src/components/StartupScreen';
import RegisterScreen from './src/components/RegisterScreen';

//User
import HomeScreen from './src/components/user/HomeScreen';
import SearchHandymanScreen from './src/components/user/SearchHandyman';
import ConfirmationViewScreen from './src/components/user/ConfirmationView';
import FeedbackScreen from './src/components/user/Feedback';
import PickLocationScreen from './src/components/user/PickLocation';

import EditProfileScreen from './src/components/user/EditProfile';
import HistoryScreen from './src/components/user/History';
import ReportProblemScreen from './src/components/user/ReportProblem'

//Admin
import ManageScreen from './src/components/admin/Manage';
import ServicesScreen from './src/components/admin/Services';

//Handyman
import HandymanHomeScreen from './src/components/handyman/HomeScreen';
import HandymanEditProfileScreen from './src/components/handyman/EditProfile';
import DirectionScreen from './src/components/handyman/Direction';
import HandymanFeedbackScreen from './src/components/handyman/Feedback';
import HandymanHistoryScreen from './src/components/handyman/History';
import SettingsScreen from './src/components/handyman/Settings';

const AdminDrawer = createDrawerNavigator({
  Manage: {
    screen: ManageScreen
  },
  Service: {
    screen: ServicesScreen
  },
  Logout: {
    screen: LoginScreen,
    navigationOptions: {
     title: 'Log out'
    }
  }
},{
  initialRouteName: 'Manage',
    contentComponent: (props) => (
     <SafeAreaView style={{flex: 1}}>
         <View style={styles.containerStyle}>
           <View>
           <Image source={require("./src/assets/login.jpg")} style = {{width: 60, height: 60, borderRadius: 20}} />
           </View>
           <View>
           <Text style={{fontSize: 20, fontWeight: 'bold'}}>Admin Panel</Text>
           <Text>Manage Handyman</Text>
           </View>
         </View>
       <ScrollView>
         <DrawerNavigatorItems {...props} />
       </ScrollView>
     </SafeAreaView>
    )
})
const AdminTab = createBottomTabNavigator({
  Admin: {
    screen: AdminDrawer
  },
  Service:{
    screen: ServicesScreen
  }
})

const StartupDrawer = createDrawerNavigator({
  Startup: {
    screen: StartupScreen,    
  },
  Login: {
    screen: LoginScreen
  },
  Register: {
    screen: RegisterScreen
  }
},  {
  initialRouteName: 'Login'
});

const UserStack = createStackNavigator({
  UserStackHome: {
    screen: HomeScreen,    
  },  
  SearchHandyman: {
    screen: SearchHandymanScreen
  },
  ConfirmationView: {
    screen: ConfirmationViewScreen
  },
  Feedback: {
    screen: FeedbackScreen
  },
  PickLocation: {
    screen: PickLocationScreen
  },
  EditProfile: {
    screen: EditProfileScreen
  },
  History: {
    screen: HistoryScreen
  },
  ReportProblem: {
    screen: ReportProblemScreen
  },  
},  {
  initialRouteName: 'UserStackHome'
});

const UserDrawer = createDrawerNavigator({
  UserHome: {
    screen: UserStack
  },
  EditProfile: {
    screen: EditProfileScreen
  },
  History:{
    screen: HistoryScreen
  },
  Logout: {
    screen: LoginScreen, 
    navigationOptions: {
      title: 'Log out',
      drawerLockMode: 'locked-closed'
    }
  }
},{
    
})

const HandymanStack = createStackNavigator({
  HandymanStackHome: {
    screen: HandymanHomeScreen
  },
  Direction: {
    screen: DirectionScreen
  },
  Feedback: {
    screen: HandymanFeedbackScreen
  }
})

const HandymanDrawer = createDrawerNavigator({
  HandymanHome: {
    screen: HandymanStack
  },
  EditProfile: {
    screen: HandymanEditProfileScreen
  },
  Settings: {
    screen: SettingsScreen
  },
  History: {
    screen: HandymanHistoryScreen
  },
  Logout: {
    screen: LoginScreen, 
    navigationOptions: {
      title: 'Log out',
      drawerLockMode: 'locked-closed'
    }
  }
})

const CombineDrawer = createDrawerNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      drawerLabel: () => null,
    }   
  },
  Register: {
    screen: RegisterScreen,
    navigationOptions: {
      drawerLabel: () => null,
    }   
  },
  User: {
    screen: UserDrawer, 
    navigationOptions: {
      drawerLabel: () => null,
    }   
  },
  Admin: {
   screen: AdminTab,
   navigationOptions: {
    drawerLabel: () => null
  }
  },
  Handyman: {
    screen: HandymanDrawer,
    navigationOptions: {
     drawerLabel: () => null
   }
  }
}, {
  initialRouteName: 'Login',   
  navigationOptions: {
    tabBarVisible: false
  }
});

const styles = {
  containerStyle: {
      borderBottomWidth: 1,
      padding: 5,
      backgroundColor: '#FFF',   
      justifyContent: 'flex-start',
      flexDirection: 'row',
      borderColor: '#ddd',
      position: 'relative',
      borderRadius: 20,
      paddingTop: 20
  }
};

export default createAppContainer(CombineDrawer);
