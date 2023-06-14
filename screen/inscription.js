import React from 'react';
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {connect} from "react-redux";
import WhiteButton from '../components/white_button';
import Title  from '../components/title';
import { RadioButton } from 'react-native-paper';



class Inscription extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          email: "",
          pass:"",
          lname:"",
          fname:"",
          tel:"",
          civ:"",
          checked:'M'
        }
    }
  

  testinputs() {
    const {navigate} = this.props.navigation;
      const formdata = new FormData;
      if(this.state.login == "" || this.state.email == "" || this.state.pass == ""){
        Alert.alert("Veuillez remplir tous les champs.", "", [{text: "ok", onPress: () => console.log("test")}], {cancelable: false});
      }else{
        //const action = {type:"add_user", value:{login:this.state.login,email:this.state.email, pass:this.state.pass}};
        
          formdata.append("name",this.state.lname);
          formdata.append("fname",this.state.fname);
          formdata.append("mail",this.state.email);
          formdata.append("pass",this.state.pass);
          formdata.append("tel",this.state.tel);
          formdata.append("civ",this.state.civ);
     
          fetch('http://jdevalik.fr/api/mycities/usersinsert.php', {
                method: 'POST', 
                body: formdata, 
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            }).then((response) => response.json())
                .then((json) => {
                    if(json == false){
                        Alert.alert(
                            'Erreur',
                            'Cet Email n\'est pas disponible.',
                            [
                                {text: 'OK'},
                            ],
                        );
                    }else{
                        navigate('Homepage');
                    }
                })
                .catch((error) => {
                        console.error(error);
                    }
                );
              }

            };

        
        //this.props.dispatch(action);
        
        //console.log(this.props);
        
      
  

    render(){
        const {navigate} = this.props.navigation;

        return (
            <View style={styles.container}>
                      <Title val="Inscription"/>
                     
                      <TextInput style={styles.input} value={this.state.email} onChangeText={text=> this.setState({email:text})}  placeholder="E-mail" keyboardType="text"/>
                    
                      <TextInput style={styles.input} value={this.state.pass} onChangeText={text=> this.setState({pass:text})} placeholder="Mot de passe" keyboardType="text"/>
           
                      <TextInput style={styles.input} value={this.state.lname} onChangeText={text=> this.setState({lname:text})} placeholder="Nom" keyboardType="text"/>
                
                      <TextInput style={styles.input} value={this.state.fname} onChangeText={text=> this.setState({fname:text})} placeholder="Prénom" keyboardType="text"/>
                    
                      <TextInput style={styles.input} value={this.state.tel} onChangeText={text=> this.setState({tel:text})} placeholder="Téléphone" keyboardType="text"/>
               
                      <TextInput style={styles.input} value={this.state.civ} onChangeText={text=> this.setState({civ:text})} placeholder="Civilité" keyboardType="text"/>
                      
                      <WhiteButton val="Valider" onPress={() => this.testinputs()}/>

                      <View style={{flexDirection: "row", alignContent:'center'}}>
                        
                        <View style={{ flex: 4, alignSelf: 'center' }}> 
                          <Text>Homme</Text>
                        </View>
                        <View style={{flex:1}}>
                      <RadioButton
                        value="M"
                        status={this.state.checked === 'M' ? 'check' : 'non check'}
                        onPress={() => this.setState({checked:'M'})}
                        uncheckedColor='red'
                        color='green'
                      />
                      </View>
                      <View style={{ flex: 4, alignSelf: 'center' }}>
                        <Text>Femme</Text>
                        </View>
                        <View style={{flex:1}}>
                      <RadioButton
                        value="M"
                        status={this.state.checked === 'F' ? 'check' : 'non check'}
                        onPress={() => this.setState({checked:'F'})}
                        uncheckedColor='red'
                        color='green'
                      />
                      </View>
                 
                      </View>
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
    },
    
    container: {
      flex: 1,
      backgroundColor: '#545454',
      alignItems: 'center',
      justifyContent: 'center',
    },

    radiogroup:{
      flex:1,
      flexDirection:"row",
    },
  
  });

  const mapStateToProps = (state)=>{
    return state;}
export default connect(mapStateToProps)(Inscription);