import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import  Login  from './screen/login';
import Validation from './screen/valid';
import Homepage from './screen/homepage';
import Modify from './screen/modify';
import Inscription from './screen/inscription';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import Store from './store/configStore';
import Cities from './screen/cities';
import Buildings from './screen/buildings';
import Building from './screen/building';
import Promote from './screen/promote';
import Admin from './screen/admin';
import Pending from './screen/pending';
import Pendingexe from './screen/pendingexe';
import AddBuilding from './screen/addbuilding';
import BuildForm from './screen/addbuildform';
import Modifbuilding from './screen/modifbuildings';
import Camera_screen from './screen/camera';
import Buildfilter from './screen/buildfilter';
import Buildingsmap from './screen/buildingsmap';
import Favlist from './screen/favscreen';
import Itinerary from './screen/itinerary';
import Picstovalid from './screen/picstovalid';

const stack = createNativeStackNavigator();



export default function App() {
  return (
    <Provider store={Store}>
    <NavigationContainer>
      <stack.Navigator>
        <stack.Screen name="Homepage" component = {Homepage}/>
        <stack.Screen name="admin" component = {Admin}/>
        <stack.Screen name="Itineraire" component = {Itinerary}/>
        <stack.Screen name="Validation photos" component = {Picstovalid}/>
        <stack.Screen name="buildingsmap" component = {Buildingsmap}/>
        <stack.Screen name="favlist" component = {Favlist}/>
        <stack.Screen name="buildfilter" component = {Buildfilter}/>
        <stack.Screen name="camera" component = {Camera_screen}/>
        <stack.Screen name="buildform" component = {BuildForm}/>
        <stack.Screen name="addbuild" component = {AddBuilding}/>
        <stack.Screen name="promote" component = {Promote}/>
        <stack.Screen name="modifbuilding" component = {Modifbuilding}/>
        <stack.Screen name="building" component = {Building}/>
        <stack.Screen name="city" component = {Cities}/>
        <stack.Screen name="buildings" component = {Buildings}/>
        <stack.Screen name="inscription" component = {Inscription}/>
        <stack.Screen name="login" component = {Login}/>
        <stack.Screen name="valid" component = {Validation}/>
        <stack.Screen name="modify" component = {Modify}/>
        <stack.Screen name="pending" component = {Pending}/>
        <stack.Screen name="pendingexe" component = {Pendingexe}/>
      </stack.Navigator>
    </NavigationContainer>
    </Provider>
  )
}




