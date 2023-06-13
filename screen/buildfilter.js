import React from 'react';
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  useEffect,
  setInterval,
} from 'react-native';
import { List } from 'react-native-paper'
import WhiteButton from '../components/white_button';
import Inscription from './inscription';
import * as SQLite from 'expo-sqlite';


export default class Buildfilter extends React.Component{
    constructor(props){
        super(props);
        this.state={
            expanded:true,
            types:[],
            favs:[],
            year1:"",
            year2:"",
            buildname:"",
            typeid:""
        }      
}


componentDidMount(){
    fetch('http://jdevalik.fr/api/mycities/gettypes.php',
    {
        method:"POST",
        headers:
        {
            "Content-Type":"multipart/form-data"
        },
    })
    .then((res) => res.json())
    .then((json) => 
    {
        if(json != false)
        {
            const arr = []
            for(let i=0; i<json.length; i++)
            {
                arr.push({id:json[i].type_id, lib:json[i].type_lib})
            }
            this.setState({types: arr})
        }
    })
}



dofilter(tid,y1,y2,bname){
    formdata = new FormData;
    console.log(tid);
    if(tid != ""){formdata.append("type",tid);}
    if(y1 != ""){formdata.append("year1",y1);}
    if(y2 != ""){formdata.append("year2",y2);}
    if(bname != ""){formdata.append("name",bname);}
    fetch('http://jdevalik.fr/api/mycities/filter.php',
    {
        method:"POST",
        body: formdata,
        headers:
        {
            "Content-Type":"multipart/form-data"
        },
    })
    .then((res) => res.json())
    .then((json) => 
    {
        if(json != false)
        {
            console.log(json[0]);
            const arr = []
            for(let i=0; i<json.length; i++)
            {
                arr.push({id:json[i].build_id, name:json[i].build_name})
            }
            this.setState({favs: arr})
        }
    })
}



render(){
    const {navigate} = this.props.navigation;
    return(
        <View style={styles.container}>
            <View style={styles.bloc}>
                <TextInput style={styles.input} placeholder='Tapez ici Nom du bâtiment' value={this.state.buildname} onChangeText={text=> this.setState({buildname:text})}></TextInput>
                    <View style={styles.years}>
                        <Text>Année du bâtiment entre :</Text>
                        <TextInput style={styles.input} placeholder='Tapez ici la première date' keyboardType = 'numeric' value={this.state.year1} onChangeText={text=> this.setState({year1:text})}></TextInput>
                        <Text > et :</Text>
                        <TextInput style={styles.input} placeholder='Tapez ici la seconde date' keyboardType = 'numeric' value={this.state.year2} onChangeText={text=> this.setState({year2:text})}></TextInput>
                    </View>
                <View>
                    <List.Accordion
                        title="Types de bâtiment"
                        left={props => <List.Icon {...props} icon="castle" />}>
                            {this.state.types.map((type,i) => (
                    <List.Item style={styles.touch} key={i} title={type.lib} onPress={()=>{this.setState({typeid:type.id})}} />    
                            ))}
                    </List.Accordion>
                </View>
               

                <View style={styles.types}>
                {this.state.favs.map((favs,i) => (
                    <TouchableOpacity style={styles.results} key={i} title={favs.name} onPress={() => navigate("building",{id:favs.id})}>
                        <Text style={styles.restext} >{favs.name}</Text>
                    </TouchableOpacity>
                ))}
                </View>
            </View>
            <WhiteButton style={styles.but} val="OK" onPress={()=>{this.dofilter(this.state.typeid,this.state.year1,this.state.year2,this.state.buildname)}} />
        </View>
    )
}
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#545454',
        alignItems: 'center',
        justifyContent:"center"
      },

      bloc:{
       
        padding:30
      },
      
      input:{
        backgroundColor:"white"
      },
    years:{
        backgroundColor:"white"
    },

    types:{
        width:300,
        
    },
    touch:{
        backgroundColor:"white"
    },
    but:{
        margin:35
    },

    results:{
     
    },

    restext:{
        fontSize:23,
        color:'white',
        textDecorationLine:"underline"
    },
    })