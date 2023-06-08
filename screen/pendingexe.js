import React from 'react';
import {
  StyleSheet,
  Button,
  View,
  TouchableOpacity,
  SafeAreaView,
  Text,
  Image,
  Alert,
  useEffect,
  setInterval,
  TextInput
} from 'react-native';




export default class Pendingexe extends React.Component{
    constructor(props){
        super(props);
        this.state={
            bd_id:"",
            bd_name:"",
            bd_description:"",
            bd_year:"",
            bd_address:""
        }      
}

componentDidMount(){
    const {navigate} = this.props.navigation;

    let buildid = {id:this.props.route.params.id};
    this.setState({bd_id:buildid.id});

    const formdata = new FormData;
    formdata.append("id", buildid.id);

    
    fetch('http://jdevalik.fr/api/mycities/buildingbyid.php', {
                method: 'POST', 
                body: formdata, 
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            }).then((response) => response.json())
                .then((json) => {
                    if(json != false){
                        this.setState({bd_name: json[0].build_name})
                        this.setState({bd_description: json[0].build_desc})
                        this.setState({bd_year: json[0].build_year})
                        this.setState({bd_address: json[0].build_addresse})
                    }else{
                        navigate('Homepage');
                    }
                })
                .catch((error) => {
                        console.error(error);
                    }
                );
}

pendexe(boolt){
    
    const {navigate} = this.props.navigation;
    const formdata = new FormData;
    formdata.append("valid",boolt);
    formdata.append("id",this.state.bd_id);
    fetch('http://jdevalik.fr/api/mycities/pendingex.php', {
        method: 'POST', 
        body: formdata, 
        headers: {
            "Content-Type": "multipart/form-data"
        },}).then((response) => response.json())
        .then((json) => {
            if(json != false){
                 navigate("admin");}
        })
}
        
render(){
    return(
        <View style={styles.container}>
            <Text>{this.state.bd_name}</Text>
            <Text>{this.state.bd_description}</Text>
            <Text>{this.state.bd_year}</Text>
            <Text>{this.state.bd_address}</Text>
            <Button  title="Valider" onPress={() => this.pendexe("y") }/> 
            <Button  title="Supprimer" onPress={() =>  this.pendexe("n") }/>
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