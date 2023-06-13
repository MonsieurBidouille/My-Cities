import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, KeyboardAvoidingView } from 'react-native';
import { List } from 'react-native-paper'
import {connect} from "react-redux";
import WhiteButton from '../components/white_button';
import Title from '../components/title';


class Modifbuilding extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            lat: 0,
            long: 0,
            name: "",
            year: 0,
            desc: "",
            city:"",
            address:"",
            arch: 0,
            type:[],
            type_id:0
          }
}

componentDidMount(){
    
    let b_id = {id:this.props.route.params.id};
    let formdata = new FormData;
    formdata.append("id",b_id.id);
    fetch('http://jdevalik.fr/api/mycities/buildingbyid.php', {
                method: 'POST', 
                body: formdata, 
                headers:{
                    "Content-Type": "multipart/form-data"
                },})
                .then((response) => response.json())
                .then((json) => {
                    if(json != false){
                        console.log(json[0])
                        this.setState({name:json[0].build_name});
                        this.setState({year:json[0].build_year});
                        this.setState({desc:json[0].build_desc});
                        this.setState({address:json[0].build_addresse});
                        //this.setState({arch:json[0].build_archi});
                        this.setState({lat:json[0].build_lat});
                        this.setState({long:json[0].build_long});
                        this.setState({type_id:json[0].build_typeid});
                        this.getcitname(json[0].build_cityid);
                    }else{
                       return false;
                    }
                });


    fetch('http://jdevalik.fr/api/mycities/gettypes.php',{
    method:"POST",
    headers:{
        "Content-Type":"multipart/form-data"
    },})
        .then((res) => res.json())
        .then((json) => {
        if(json != false){
            const arr = []
            for(let i=0; i<json.length; i++){
                arr.push({id:json[i].type_id, lib:json[i].type_lib})
            }
            this.setState({type: arr});
        }});             
}

getcitname(id){
    let formdata = new FormData;
    formdata.append("id",id);
    fetch('http://jdevalik.fr/api/mycities/citybyid.php', {
        method: 'POST', 
        body: formdata, 
        headers: {
            "Content-Type": "multipart/form-data"
        },})
        .then((response) => response.json())
        .then((json) => {
            if(json != false){
                this.setState({city:json[0].cit_name})
            }else{
               return false;
            }
        });
}

valid(){
  const {navigate} = this.props.navigation;
  const {crnt_id} = this.props;
  let formdata = new FormData;

  fetch('http://jdevalik.fr/api/mycities/.php', {
    method: 'POST', 
    body: formdata, 
    headers: {
        "Content-Type": "multipart/form-data"
    },})
    .then((response) => response.json())
    .then((json) => {
        if(json != false){
        }else{
          Alert.alert("Veuillez entrer des informations valides.");
        }
    })
    .catch((error) => {
            console.error(error);
        }
    );

}


checkcity(){
    let formdata = new FormData;
    formdata.append("city",this.state.city)
    fetch('http://jdevalik.fr/api/mycities/checkcity.php', {
        method: 'POST', 
        body: formdata, 
        headers: {
            "Content-Type": "multipart/form-data"
        },
    })
    .then((response) => response.json())
    .then((json) => {
        if(json != false){
            this.updatebuild(json[0].id);
    }
})
}

updatebuild(cit_id){
    const {navigate} = this.props.navigation;
    let b_id = {id:this.props.route.params.id};
    const formdata = new FormData;
    formdata.append("id",b_id.id);
    formdata.append("name", this.state.name);
    formdata.append("desc", this.state.desc);
    formdata.append("adress", this.state.address);
    formdata.append("year", this.state.year);
    formdata.append("city",cit_id);
    formdata.append("type",this.state.type_id);

    fetch('http://jdevalik.fr/api/mycities/updatebuilding.php', {
        method: 'POST', 
        body: formdata, 
        headers: {
            "Content-Type": "multipart/form-data"
        },
    })
    .then((response) => response.json())
    .then((json) => {
        if(json != false){
            navigate('admin');
    }
})
}

render(){
    const {navigate} = this.props.navigation;
    let b_id = {id:this.props.route.params.id};
    return (
<KeyboardAvoidingView  style={styles.container}>

    <Title val="Modifier Bâtiment" />

        <View style={styles.form}>
            <View style={styles.subform1}>
            <TextInput style={styles.input} value={this.state.name} placeholder="Insérer le nom du bâtiment" onChangeText={inputText => this.setState({name: inputText})}/>
            <TextInput style={styles.input} value={this.state.year.toString()} placeholder="Insérer l'année du bâtiment" onChangeText={inputText => this.setState({year: inputText})}/>

            <View style={styles.list}>
            
            <List.Accordion
                title="Types"
                left={props => <List.Icon {...props} icon="castle" />}
                expanded={this.state.expanded}
                onPress={this.handlePress}>
                {
                    this.state.type.map((item, i) => (
                        <List.Item style={styles.items}
                            key={i}
                            title={item.lib}
                            onPress={()=>{this.setState({expanded:false}); this.setState({type_id:this.state.type[i].id});}}
                        />
                    ))
                }
            </List.Accordion>
         
    </View> 
            </View>
            <View style={styles.subform2}>
            <TextInput style={styles.input} value={this.state.desc} placeholder="Insérer la description du bâtiment" onChangeText={inputText => this.setState({desc: inputText})}/>
            <TextInput style={styles.input} value={this.state.city} placeholder="Insérer la ville du bâtiment" onChangeText={inputText => this.setState({city: inputText})}/>
            <TextInput style={styles.input} value={this.state.address} placeholder="Insérer la ville du bâtiment" onChangeText={inputText => this.setState({address: inputText})}/>
            </View>
        </View>


            <WhiteButton val="OK" onPress={() => this.checkcity()}/>
            
            </KeyboardAvoidingView> 
    )
}
}


const styles = StyleSheet.create({
    input: {
      height: 40,
      width: 180,
      borderWidth: 1,
      padding: 10,
      backgroundColor:'white',
      margin: 10,
      textAlign:'left'
    },
 
    form:{
        flex:1,
        borderWidth:1,
        flexDirection:"row",
        backgroundColor:"gray",
        margin:10,
        marginTop:55
    },

    container: {
      flex: 1,
      backgroundColor: '#545454',
      alignItems: 'center',
      justifyContent: 'center',
    },

    list:{
        flex:2,
        width:180,
        margin: 10,
        height:40
    },

    items:{
        backgroundColor:"white",
        width:180,
        margin: 10
    },
  });

const mapStateToProps = (state)=>{
    return state;}
export default connect(mapStateToProps)(Modifbuilding);

