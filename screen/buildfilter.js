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
        <View>
            <View>
                <TextInput placeholder='Nom du bâtiment' value={this.state.buildname} onChangeText={text=> this.setState({buildname:text})}></TextInput>
                    <View>
                        <Text>Année du bâtiment entre :</Text>
                        <TextInput placeholder='' keyboardType = 'numeric' value={this.state.year1} onChangeText={text=> this.setState({year1:text})}></TextInput>
                        <Text> et :</Text>
                        <TextInput placeholder='' keyboardType = 'numeric' value={this.state.year2} onChangeText={text=> this.setState({year2:text})}></TextInput>
                    </View>
                <View>
                    <List.Accordion
                        title="Types de bâtiment"
                        left={props => <List.Icon {...props} icon="castle" />}>
                            {this.state.types.map((type,i) => (
                    <List.Item key={i} title={type.lib} onPress={()=>{this.setState({typeid:type.id})}} />    
                            ))}
                    </List.Accordion>
                </View>
               

                <View>
                {this.state.favs.map((favs,i) => (
                    <TouchableOpacity key={i} title={favs.name} onPress={() => navigate("building",{id:favs.id})}>
                        <Text>{favs.name}</Text>
                    </TouchableOpacity>
                ))}
                </View>

                <Button title="OK" onPress={()=>{this.dofilter(this.state.typeid,this.state.year1,this.state.year2,this.state.buildname)}} />
            </View>
        </View>
    )
}
}

