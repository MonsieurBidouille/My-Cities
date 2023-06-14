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


export default class Homepage extends React.Component{
    constructor(props){
        super(props);
        this.state={

        }
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