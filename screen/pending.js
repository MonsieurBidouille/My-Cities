import React from 'react';
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Alert,
  useEffect,
  setInterval,
  TextInput,
} from 'react-native';
import WhiteButton from '../components/white_button';
import Inscription from './inscription';
import * as SQLite from 'expo-sqlite';

export default class Pending extends React.Component{
    constructor(props){
        super(props);
        this.state={
            buildings:[]
        }      
}

componentDidMount(){
    fetch('http://jdevalik.fr/api/mycities/getpending.php', {
        method: 'POST',  
        headers: {
            "Content-Type": "multipart/form-data"
        },
    }).then((response) => response.json())
        .then((json) => {
          if(json != false){
            let arr = [];
            for(let i=0;i<json.length;i++){
                arr.push([json[i].build_name,json[i].build_id]);
            }
            console.log(arr);
            this.setState({buildings:arr});
          }else{
            console.log('salut');
            let emptyarr = new Array();
            this.setState({buildings:emptyarr})
          }
    })
}



render(){
    const {navigate} = this.props.navigation;
    return(
        <View style={styles.container}>
                    {this.state.buildings.map((building, Building) => (
                <View  key={Building}>
                    <View >
                        <TouchableOpacity onPress={() => navigate("pendingexe",{id:building[1]})}><Text>{building[0]}</Text></TouchableOpacity>
                    </View>
                 </View>))}
        </View>
    )
}
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'pink',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
  });