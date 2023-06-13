import React from 'react';
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  Image,
  Alert,
  useEffect,
  setInterval,
  ImageBackground
} from 'react-native';
import WhiteButton from '../components/white_button';
import Inscription from './inscription';
import * as SQLite from 'expo-sqlite';


export default class Homepage extends React.Component{
    constructor(props){
        super(props);
        this.state={
          color1:"blue",
          color2:"red"
        }
}


changecolor(){
  setTimeout(() => {
   this.setState({color1: 'red'})
  }, 250);


  setTimeout(() => {
    this.setState({color1: 'blue'})
   }, 500);


   setTimeout(() => {
    this.changecolor();
   }, 1000);
   

}


componentDidMount(){
  this.changecolor();
  this.createusertable();


  // const interval = setInterval(() => {
  //   this.changecolor();
  // }, 1000);
}



createusertable(){
const db = SQLite.openDatabase("data.db");
db.transaction(trs => {
  trs.executeSql("CREATE TABLE IF NOT EXISTS users (user_id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT, user_name TEXT , user_mail TEXT ,user_pass TEXT);");
});
}


    render(){
      const city = require('../assets/city.jpg');
      const logo = require('../assets/logo.png');
        const {navigate} = this.props.navigation;
        return (
          <ImageBackground source={city} style={styles.background}>
            <View style={styles.container}>
                      <Image source={logo} style={styles.logo}/>        
                      <WhiteButton  color={this.state.color1} val="Connexion"onPress={() => navigate("login")}/>       
                      <WhiteButton val="Inscription" onPress={()=> navigate("inscription")}></WhiteButton>
                      <WhiteButton  color={this.state.color1} val="Liste des villes"onPress={() => navigate("city")}/>                     
            </View>
            </ImageBackground>
        )
    }
}


const styles = StyleSheet.create({

    boutoncli:{
      margin:10,
      height:40,
    },

    container:{
      flex: 1,
      backgroundColor: 'lightGreen',
      alignItems: 'center',
      justifyContent: 'center',
    },

    logo: {
      width: 150,
      height: 150,
      marginBottom: 20,
      position:"absolute",
      top:5
    },

    background: {
      flex: 1,
      resizeMode: 'cover', 
    },
  
  });