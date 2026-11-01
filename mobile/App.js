import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import CatalogueScreen from './src/screens/CatalogueScreen'
import ProductDetailScreen from './src/screens/ProductDetailScreen'
import EnquiryScreen from './src/screens/EnquiryScreen'
import MyEnquiriesScreen from './src/screens/MyEnquiriesScreen'
import { COLORS } from './src/constants'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const headerStyle = {
  headerStyle: { backgroundColor: COLORS.brand },
  headerTintColor: '#fff',
}

function CatalogueStack() {
  return (
    <Stack.Navigator screenOptions={headerStyle}>
      <Stack.Screen name="Catalogue" component={CatalogueScreen} options={{ title: 'Tribe Green' }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={({ route }) => ({ title: route.params.name })} />
      <Stack.Screen name="Enquiry" component={EnquiryScreen} options={{ title: 'Send an enquiry' }} />
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          ...headerStyle,
          tabBarActiveTintColor: COLORS.brand,
          tabBarIconStyle: { display: 'none' },
          tabBarLabelStyle: { fontSize: 15 },
        }}
      >
        <Tab.Screen name="CatalogueTab" component={CatalogueStack} options={{ title: 'Catalogue', headerShown: false }} />
        <Tab.Screen name="MyEnquiriesTab" component={MyEnquiriesScreen} options={{ title: 'My enquiries' }} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
