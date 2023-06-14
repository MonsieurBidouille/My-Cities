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
import {connect} from "react-redux";
import Title from '../components/title';



class Admin extends React.Component{
    constructor(props){
        super(props);
        this.state={

        }      
}



render(){
    const {navigate} = this.props.navigation;
    return(
        <View style={styles.container}>
            <Title val="Pannel admin" />
        <View style={styles.container2} >
            <WhiteButton  val="Promouvoir un utilisateur"onPress={() => navigate("promote")}/>
            <View style={{height: 20}}/>
            <WhiteButton  val="Valider bâtiments en attentes"onPress={() => navigate("pending")}/>
            <View style={{height: 20}}/>
            <WhiteButton  val="Valider les photos en attentes"onPress={() => navigate("Validation photos")}/>
        </View>
        </View>
    )
}
}

const styles = StyleSheet.create({
    
    container: {
      flex: 1,
      backgroundColor: '#545454',

    },
  
    container2:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    },
  });


const mapStateToProps = (state)=>{
    return state;}
export default connect(mapStateToProps)(Admin);