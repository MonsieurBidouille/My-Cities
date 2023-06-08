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
            <Button  title="Promouvoir un utilisateur"onPress={() => navigate("promote")}/>
            <View style={{height: 20}}/>
            <Button  title="Valider bâtiments en attentes"onPress={() => navigate("pending")}/>
            <View style={{height: 20}}/>
        </View>
    )
}
}

const styles = StyleSheet.create({
container:{
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
}
)

const mapStateToProps = (state)=>{
    return state;}
export default connect(mapStateToProps)(Admin);