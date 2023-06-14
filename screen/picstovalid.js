import React from 'react';
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  useEffect,
  setInterval,
  TextInput,
} from 'react-native';
import WhiteButton from '../components/white_button';


export default class Picstovalid extends React.Component{
    constructor(props){
        super(props);
        this.state={
            arrpic:[{pname:"",pid:0}],
            pindex:0,
            maxpic:0,
        }      
}

componentDidMount(){
    const {navigate} = this.props.navigation;
    fetch('http://jdevalik.fr/api/mycities/getpicstovalid.php', {
        method: 'POST', 
        headers: {
            "Content-Type": "multipart/form-data"
        },
    }).then((response) => response.json())
        .then((json) => {
          if(json != false){
            let arr = [];
            for(let i = 0; i < json.length ; i++){
                arr.push({pname: json[i].pic_name , pid: json[i].pic_id});
            }
          
            this.setState({maxpic:arr.length-1})
            this.setState({arrpic:arr})
          }else{
            Alert.alert('Erreur', "Il n'y a plus de photo à afficher", [{text: 'OK', onPress: () => navigate('admin')},])
          }
    })
}

refuse(){
    const {navigate} = this.props.navigation;
    let pic_i = this.state.pindex;
    let picid = this.state.arrpic[pic_i].pid;

    let max = this.state.maxpic;

    if(max<pic_i){
        Alert.alert('Erreur', "Il n'y a plus de photo à afficher", [{text: 'OK', onPress: () => navigate('admin')},])
        return false;
    }

    let formdata = new FormData;
    formdata.append("id", picid);
    
    fetch('http://jdevalik.fr/api/mycities/picrefuse.php', {
        method: 'POST', 
        body: formdata, 
        headers: {
            "Content-Type": "multipart/form-data"
        },
    })  
    
    this.setState({pindex:this.state.pindex+1})
}


accept(){
    const {navigate} = this.props.navigation;
    let pic_i = this.state.pindex;
    let picid = this.state.arrpic[pic_i].pid;
    let max = this.state.maxpic;

    if(max<pic_i){
        Alert.alert('Erreur', "Il n'y a plus de photo à afficher", [{text: 'OK', onPress: () => navigate('admin')},])
        return false;
    }

    console.log("pic id = ", picid);

    let formdata = new FormData;
    formdata.append("id", picid);

    fetch('http://jdevalik.fr/api/mycities/picaccept.php', {
        method: 'POST', 
        body: formdata, 
        headers: {
            "Content-Type": "multipart/form-data"
        },
    })  
    this.setState({pindex:this.state.pindex+1})   
}



showpicture(){
    const {navigate} = this.props.navigation;
    let pic_i = this.state.pindex;
    let max = this.state.maxpic;
    if(max<pic_i){
        Alert.alert('Erreur', "Il n'y a plus de photo à afficher", [{text: 'OK', onPress: () => navigate('admin')},])
        return false;
    }
    return <Image source={{uri:`http://jdevalik.fr/api/mycities/photos/uploads/${this.state.arrpic[pic_i].pname}.jpg`}}
    style={styles.picture}
/>
}

render(){
    return(
        <View style={styles.container}>
            <View style={styles.picbloc}>
                {this.showpicture()}
            </View>
            <View style={styles.buttons}>
            <TouchableOpacity style={styles.rbutton}><Text style={styles.buttonText}  onPress={ ()=> this.refuse()}>Refuser</Text></TouchableOpacity>
            <TouchableOpacity style={styles.abutton}><Text style={styles.buttonText}  onPress={ ()=> this.accept()}>Accepter</Text></TouchableOpacity>
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

    picbloc:{
        flex:5,
    },

    picture:{
        width:"100%",
        height:"100%"

    },

    rbutton:{
        backgroundColor:"red",
        height:50,
        padding:10,
        borderWidth:1
    },

    abutton:{
        backgroundColor:"green",
        height:50,
        padding:10,
        borderWidth:1
    },

    buttons:{
        flex:1,
        flexDirection:"row",
        alignContent:"center",
        margin:10,
        justifyContent:"space-evenly"
        
    },
  
    buttonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
      },
  });