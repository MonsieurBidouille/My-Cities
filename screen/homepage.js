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
        const {navigate} = this.props.navigation;
        return (
            <View style={styles.container}>
                      <Text style={{color:'blue',fontSize: 22 ,}}>Connexion/Inscription</Text>
                      <View style={{height: 20}}/>
                      <Button style={styles.boutoncli} color={this.state.color1} title="Connexion"onPress={() => navigate("login")}/>
                      <View style={{height: 20}}/>
                      <WhiteButton val="INSCRIPTION" onPress={()=> navigate("inscription")}></WhiteButton>
                      <Image style={styles.tinyLogo} source={{ uri: 'https://reactnative.dev/img/tiny_logo.png',}}/>
                      <View style={{height: 20}}/>
                      <Button style={styles.boutoncli} color={this.state.color1} title="Connexion"onPress={() => navigate("city")}/>
                      <View style={{height: 20}}/>
                      <Button style={styles.boutoncli} color={this.state.color1} title="Connexion"onPress={() => navigate("modify")}/>
            </View>
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

    tinyLogo: {
      position:'absolute',
      top:0,
      left:0,
      width: 50,
      height: 50,
    },
  
  });