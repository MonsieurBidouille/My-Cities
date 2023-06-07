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




export default class Promote extends React.Component{
    constructor(props){
        super(props);
        this.state={
            user:"",
            users:[]
        }      
}


getuser(){
    formdata = new FormData;
    formdata.append("name",this.state.user);

    fetch('http://jdevalik.fr/api/mycities/getusertopromote.php', {
        method: 'POST',
        body: formdata,
        headers: {
            "Content-Type": "multipart/form-data"
        },
    }).then((response) => response.json())
        .then((json) => {
          if(json != false){
            let arr = [];
            for(let i=0;i<json.length;i++){
                arr.push([json[i].user_id,json[i].user_fname,json[i].user_name,json[i].user_mail]);
            }
            this.setState({users:arr});
          }else{
          }
    })
}

promote(id){
    formdata = new FormData;
    formdata.append("id",id);
    fetch('http://jdevalik.fr/api/mycities/promoteuser.php', {
        method: 'POST',
        body: formdata,
        headers: {
            "Content-Type": "multipart/form-data"
        },
    })
    }



render(){
    return(
        <View style={styles.container}>
            <TextInput  value={this.state.user} onChangeText={text=> this.setState({user:text})}  placeholder="Chercher un utilisateur par nom, prénom ou adresse mail" keyboardType="text"/>
            <Button color='blue'  title="Valider" onPress={() => this.getuser()}/>
           {this.state.users.map((users, Users) => (
                    <View  key={Users}>
                    <View >
                    <TouchableOpacity onPress={() => this.promote(users[0])}><Text>{users[1]} {users[2]}| mail:{users[3]}</Text></TouchableOpacity>
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