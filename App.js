import React from 'react';
import { View, AsyncStorage, SafeAreaView, Text, ScrollView, Image } from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
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

import ScheduledBookingScreen from './src/components/user/ScheduledBooking';
import BookingDetailsScreen from './src/components/user/BookingDetails';
import EditProfileScreen from './src/components/user/EditProfile';
import HistoryScreen from './src/components/user/History';
import ReportProblemScreen from './src/components/user/ReportProblem'

//Admin
import AdminHomeScreen from './src/components/admin/HomeScreen';
import ServicesScreen from './src/components/admin/Services';
import SubServicesScreen from './src/components/admin/SubServices';
import ComplaintScreen from './src/components/admin/Complaints';
import ComplaintDetailScreen from './src/components/admin/Details';
import AdminHistoryScreen from './src/components/admin/History';
import AdminSettingsScreen from './src/components/admin/Settings';
import ApproveIncrementScreen from './src/components/admin/IncrementApproval';
import RequestApprovalScreen from './src/components/admin/RequestApproval';

//Handyman
import HandymanHomeScreen from './src/components/handyman/HomeScreen';
import HandymanEditProfileScreen from './src/components/handyman/EditProfile';
import DirectionScreen from './src/components/handyman/Direction';
import HandymanFeedbackScreen from './src/components/handyman/Feedback';
import HandymanHistoryScreen from './src/components/handyman/History';
import SettingsScreen from './src/components/handyman/Settings';

const AdminHomeStack = createStackNavigator({
  Home: {
    screen: AdminHomeScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Home',
      headerLeft: (<IoniconsIcon
        style={{ marginLeft: 10 }}
        name='ios-menu'
        size={30}
        color='#000'
        onPress={() => navigation.toggleDrawer()}
      />)
    })
  },
  AdminHistory: {
    screen: AdminHistoryScreen
  }
}, {
  })

const ServiceStack = createStackNavigator({
  Services: {
    screen: ServicesScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Services',
      headerLeft: (<IoniconsIcon
        style={{ marginLeft: 10 }}
        name='ios-menu'
        size={30}
        color='#000'
        onPress={() => navigation.toggleDrawer()}
      />)
    })
  },
  SubServices: {
    screen: SubServicesScreen,
    navigationOptions: {
      title: 'Sub Services'
    }
  }
}, {
    initialRouteName: 'Services'
  })

const ComplaintStack = createStackNavigator({
  Complaints: {
    screen: ComplaintScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Complaints',
      headerLeft: (<IoniconsIcon
        style={{ marginLeft: 10 }}
        name='ios-menu'
        size={30}
        color='#000'
        onPress={() => navigation.toggleDrawer()}
      />)
    })
  },
  Details: {
    screen: ComplaintDetailScreen,
    navigationOptions: {
      title: 'Details'
    }
  }
}, {
  })

const SettingsStack = createStackNavigator({
  Settings: {
    screen: AdminSettingsScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Settings',
      headerLeft: (<IoniconsIcon
        style={{ marginLeft: 10 }}
        name='ios-menu'
        size={30}
        color='#000'
        onPress={() => navigation.toggleDrawer()}
      />)
    })
  }
}, {
  })

const ApprovalStack = createStackNavigator({
  ApproveIncrement: {
    screen: ApproveIncrementScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Pending Increments',
      headerLeft: (<IoniconsIcon
        style={{ marginLeft: 10 }}
        name='ios-menu'
        size={30}
        color='#000'
        onPress={() => navigation.toggleDrawer()}
      />)
    })
  }
}, {
  })
const RequestsStack = createStackNavigator({
  RequestApproval: {
    screen: RequestApprovalScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Increase rate requests',
      headerLeft: (<IoniconsIcon
        style={{ marginLeft: 10 }}
        name='ios-menu'
        size={30}
        color='#000'
        onPress={() => navigation.toggleDrawer()}
      />)
    })
  }
}, {
  })

const AdminDrawer = createDrawerNavigator({
  Home: {
    screen: AdminHomeStack
  },
  Service: {
    screen: ServiceStack
  },
  Complaints: {
    screen: ComplaintStack
  },
  ApproveIncrement: {
    screen: ApprovalStack,
    navigationOptions: {
      title: 'Pending Increments'
    }
  },
  Requests: {
    screen: RequestsStack,
    navigationOptions: {
      title: 'Increase rate requests'
    }
  },
  Settings: {
    screen: SettingsStack
  },
  Logout: {
    screen: LoginScreen,
    navigationOptions: {
      title: 'Log out'
    }
  }
}, {
    initialRouteName: 'Home',    
    contentComponent: (props) => (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.containerStyle}>
          <View>
            <Image source={require("./src/assets/login.jpg")} style={{ width: 60, height: 60, borderRadius: 20 }} />
          </View>
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Admin Panel</Text>
            <Text>Manage Handyman</Text>
          </View>
        </View>
        <ScrollView>
          <DrawerNavigatorItems {...props} />
        </ScrollView>
      </SafeAreaView>
    )
  })
const AdminStack = createStackNavigator({
  Admin: {
    screen: AdminDrawer,
  }
}, {
    defaultNavigationOptions: ({ navigation }) => ({
      header: () => null
    })
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
}, {
    initialRouteName: 'Startup'
  });


const CustomerHomeStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Home',
      headerLeft: (<IoniconsIcon
        style={{ marginLeft: 10 }}
        name='ios-menu'
        size={30}
        color='#000'
        onPress={() => navigation.toggleDrawer()}
      />)
    })
  },
  SearchHandyman: {
    screen: SearchHandymanScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Search Handyman'
    })
  },
  ConfirmationView: {
    screen: ConfirmationViewScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Confirmation',
      headerLeft: null
    })
  }
}, {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: 'white',
      },
      headerTintColor: '#000',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }
  })

const CustomerEditProfileStack = createStackNavigator({
  EditProfile: {
    screen: EditProfileScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Edit Profile',
      headerLeft: (<IoniconsIcon
        style={{ marginLeft: 10 }}
        name='ios-menu'
        size={30}
        color='#000'
        onPress={() => navigation.toggleDrawer()}
      />)
    })
  }
}, {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: 'white',
      },
      headerTintColor: '#000',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }
  })

const CustomerYourBookingStack = createStackNavigator({
  YourBooking: {
    screen: ScheduledBookingScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Your Bookings',
      headerLeft: (<IoniconsIcon
        style={{ marginLeft: 10 }}
        name='ios-menu'
        size={30}
        color='#000'
        onPress={() => navigation.toggleDrawer()}
      />)
    })
  },
  ReportProblem: {
    screen: ReportProblemScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Report a Problem'
    })
  },
  BookingDetails: {
    screen: BookingDetailsScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Booking Details'
    })
  }
}, {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: 'white',
      },
      headerTintColor: '#000',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }
  })

// const CustomerStack = createStackNavigator({
//   Home: {
//     screen: HomeScreen,    
//   },  
//   SearchHandyman: {
//     screen: SearchHandymanScreen
//   },
//   ConfirmationView: {
//     screen: ConfirmationViewScreen
//   },
//   Feedback: {
//     screen: FeedbackScreen
//   },
//   PickLocation: {
//     screen: PickLocationScreen
//   },
//   EditProfile: {
//     screen: EditProfileScreen
//   },
//   History: {
//     screen: HistoryScreen
//   },
//   ReportProblem: {
//     screen: ReportProblemScreen
//   },  
// },  {
//   initialRouteName: 'Home',
//   defaultNavigationOptions: {
//     headerStyle: {
//       backgroundColor: 'white',
//     },
//     headerTintColor: '#000',
//     headerTitleStyle: {
//       fontWeight: 'bold',
//     },
//   }
// });

const CustomerDrawer = createDrawerNavigator({
  Home: {
    screen: CustomerHomeStack
  },
  EditProfile: {
    screen: CustomerEditProfileStack,
    navigationOptions: {
      title: 'Edit Profile'
    }
  },
  YourBooking: {
    screen: CustomerYourBookingStack,
    navigationOptions: {
      title: 'Your Bookings'
    }
  },
  Logout: {
    screen: LoginScreen,
    navigationOptions: {
      title: 'Log out',
      drawerLockMode: 'locked-closed'
    }
  }
}, {
    contentComponent: (props) => (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.containerStyle}>
          <View>
            {/* <Image source={(JSON.parse(AsyncStorage.getItem('userData').image) === null) ? require('./src/assets/user.jpg') :{uri: `data:image/png;base64,${AsyncStorage.getItem('userData').image}`}} style = {{width: 60, height: 60, borderRadius: 20}} /> */}
          </View>
          <View>
            {/* <Text style={{fontSize: 20, fontWeight: 'bold'}}>{JSON.parse(AsyncStorage.getItem('userData').name)}</Text> */}
            {/* <Text>{JSON.parse(AsyncStorage.getItem('userData').rating)}</Text> */}
          </View>
        </View>
        <ScrollView>
          <DrawerNavigatorItems {...props} />
        </ScrollView>
      </SafeAreaView>
    )
  })

const HandymanHomeStack = createStackNavigator({
  Home: {
    screen: HandymanHomeScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Home',
      headerLeft: (<IoniconsIcon
        style={{ marginLeft: 10 }}
        name='ios-menu'
        size={30}
        color='#000'
        onPress={() => navigation.toggleDrawer()}
      />)
    })
  },
  Direction: {
    screen: DirectionScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Booking Details',
      headerLeft: null
    })
  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Settings'
    })
  }
}, {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: 'white',
      },
      headerTintColor: '#000',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }
  })

const HandymanEditProfileStack = createStackNavigator({
  EditProfile: {
    screen: HandymanEditProfileScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Edit Profile',
      headerLeft: (<IoniconsIcon
        style={{ marginLeft: 10 }}
        name='ios-menu'
        size={30}
        color='#000'
        onPress={() => navigation.toggleDrawer()}
      />)
    })
  }
}, {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: 'white',
      },
      headerTintColor: '#000',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }
  })

const HandymanHistoryStack = createStackNavigator({
  History: {
    screen: HandymanHistoryScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'History',
      headerLeft: (<IoniconsIcon
        style={{ marginLeft: 10 }}
        name='ios-menu'
        size={30}
        color='#000'
        onPress={() => navigation.toggleDrawer()}
      />)
    })
  }
}, {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: 'white',
      },
      headerTintColor: '#000',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }
  })

// const HandymanStack = createStackNavigator({
//   Home: {
//     screen: HandymanHomeScreen
//   },
//   Direction: {
//     screen: DirectionScreen
//   },
//   Feedback: {
//     screen: HandymanFeedbackScreen
//   },
//   EditProfile: {
//     screen: HandymanEditProfileScreen
//   },
//   History:{
//     screen: HandymanHistoryScreen
//   },
//   Settings: {
//     screen: SettingsScreen,
//     navigationOptions: {
//       title: 'Settings'
//     }
//   }
// },{
//   initialRouteName:'Home',
//   defaultNavigationOptions: {
//     headerStyle: {
//       backgroundColor: 'white',
//     },
//     headerTintColor: '#000',
//     headerTitleStyle: {
//       fontWeight: 'bold',
//     },
//   }
// })

const HandymanDrawer = createDrawerNavigator({
  Home: {
    screen: HandymanHomeStack
  },
  EditProfile: {
    screen: HandymanEditProfileStack,
    navigationOptions: {
      title: 'Edit Profile'
    }
  },
  History: {
    screen: HandymanHistoryStack
  },
  Logout: {
    screen: LoginScreen,
    navigationOptions: {
      title: 'Log out',
      drawerLockMode: 'locked-closed'
    }
  }
}, {
    contentComponent: (props) => (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.containerStyle}>
          <View>
            {/* <Image source={(AsyncStorage.getItem('userData').image === null) ? require('./src/assets/user.jpg') :{uri: `data:image/png;base64,${AsyncStorage.getItem('userData').image}`}} style = {{width: 60, height: 60, borderRadius: 20}} /> */}
          </View>
          <View>
            {/* <Text style={{fontSize: 20, fontWeight: 'bold'}}>{JSON.parse(AsyncStorage.getItem('userData').name)}</Text> */}
            {/* <Text>{JSON.parse(AsyncStorage.getItem('userData').rating)}</Text> */}
          </View>
        </View>
        <ScrollView>
          <DrawerNavigatorItems {...props} />
        </ScrollView>
      </SafeAreaView>
    )
  })

const CombineDrawer = createDrawerNavigator({
  Startup: {
    screen: StartupScreen,
    navigationOptions: {
      drawerLabel: () => null,
    }
  },
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
  Customer: {
    screen: CustomerDrawer,
    navigationOptions: {
      drawerLabel: () => null,
    }
  },
  Admin: {
    screen: AdminStack,
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
    initialRouteName: 'Startup',
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
