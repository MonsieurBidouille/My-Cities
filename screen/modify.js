import React from 'react';
import WhiteButton from '../components/white_button';
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  Alert,
  TextInput
} from 'react-native';
import {connect} from "react-redux";

import * as SQLite from 'expo-sqlite';


class Modify extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name:"" ,
            fname:"",
            email: "",
            pass:"",
            tel:"",
            civ:""
          }
}

componentDidMount(){
    
    const {crnt_id} = this.props;
    let formdata = new FormData;
    formdata.append("id",crnt_id)

    fetch('http://jdevalik.fr/api/mycities/getuserinfo.php', {
                method: 'POST', 
                body: formdata, 
                headers: {
                    "Content-Type": "multipart/form-data"
                },})
                .then((response) => response.json())
                .then((json) => {
                    if(json != false){
                      this.setState({name:json[0].user_name});
                      this.setState({fname:json[0].user_fname});
                      this.setState({email:json[0].user_mail});
                      this.setState({pass:json[0].user_pass});
                      this.setState({tel:json[0].user_tel});
                      this.setState({civ:json[0].user_civ});
                    }else{
                       return false;
                    }
                })
                .catch((error) => {
                        console.error(error);
                    }
                );
}


valid(){
  const {navigate} = this.props.navigation;
  const {crnt_id} = this.props;
  let formdata = new FormData;
  formdata.append("id",crnt_id);
  formdata.append("name",this.state.name);
  formdata.append("fname",this.state.fname);
  formdata.append("mail",this.state.email);
  formdata.append("pass",this.state.pass);
  formdata.append("tel",this.state.tel);
  formdata.append("civ",this.state.civ);

  fetch('http://jdevalik.fr/api/mycities/updateuser.php', {
    method: 'POST', 
    body: formdata, 
    headers: {
        "Content-Type": "multipart/form-data"
    },})
    .then((response) => response.json())
    .then((json) => {
        if(json != false){
          const action1 = {type:"crnt_user",value:this.state.email};
          this.props.dispatch(action1);
          navigate("valid");
        }else{
          Alert.alert("Veuillez entrer des informations valides.");
        }
    })
    .catch((error) => {
            console.error(error);
        }
    );

}

render(){
        
    return (
        <View style={styless.container}>
                   <TextInput style={styles.input} value={this.state.name} onChangeText={text=> this.setState({name:text})}  placeholder="Nom" keyboardType="text"/>
                   <TextInput style={styles.input} value={this.state.fname} onChangeText={text=> this.setState({fname:text})}  placeholder="Prénom" keyboardType="text"/>
                   <TextInput style={styles.input} value={this.state.email} onChangeText={text=> this.setState({email:text})}  placeholder="Email" keyboardType="text"/>
                   <TextInput style={styles.input} value={this.state.pass} onChangeText={text=> this.setState({pass:text})}  placeholder="Password" keyboardType="text"/>
                   <TextInput style={styles.input} value={this.state.tel} onChangeText={text=> this.setState({tel:text})}  placeholder="Téléphone" keyboardType="text"/>
                   <TextInput style={styles.input} value={this.state.civ} onChangeText={text=> this.setState({civ:text})}  placeholder="Civilité" keyboardType="text"/>
                   <WhiteButton style={{height: 20}} val = "Valider"  onPress={() => this.valid()}></WhiteButton>
        </View>
    )
}

}


const styles = StyleSheet.create({
    input: {
      height: 40,
      width: 220,
      borderWidth: 1,
      padding: 10,
      backgroundColor:'white',
      margin: 10
    }
    ,
  });const styless = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'pink',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
  });

const mapStateToProps = (state)=>{
    return state;}
export default connect(mapStateToProps)(Modify);