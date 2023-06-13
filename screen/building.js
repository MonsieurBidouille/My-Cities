import { SafeAreaView, View, Text, Image, Button, Alert, StyleSheet,TouchableOpacity } from "react-native";
import React from "react";
import {connect} from "react-redux";
import WhiteButton from "../components/white_button";
import { AntDesign } from '@expo/vector-icons';
import Title from "../components/title";


class Building extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state=
        {
            bd_id : "",
            bd_name : "",
            bd_description : "",
            bd_region :
            {
                latitude : 0,
                longitude : 0,
                latitudeDelta : 0,
                longitudeDelta : 0
            },
            bd_address : "",
            bd_year : "",
            bd_architect : "",
            bd_image : "",
            bd_favorite : false,
            cit_name:"",
            pictures:[],
            current_pic:0,
            max_pic:1
        }

}

componentDidMount(){


    let buildid = {id:this.props.route.params.id};
    const {crnt_id} = this.props;
    const formdata = new FormData;

    formdata.append("id", buildid.id);
    const {navigate} = this.props.navigation
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
                        this.getcitname(json[0].build_cityid);
                    }else{
                        navigate('Homepage');
                    }
                })
                .catch((error) => {
                        console.error(error);
                    }
                );

                const formdata2 = new FormData;
                formdata2.append('id', buildid.id);
                fetch('http://jdevalik.fr/api/mycities/getpicturesbybuilding.php', {
                    method: 'POST', 
                    body: formdata2, 

                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                }).then((response) => response.json())
                    .then((json) => {
                        if(json != false){
                            let arr = [];
                            for(let i =0; i < json.length;i++){
                                arr.push(json[i].pic_name);
                            }
                            this.setState({pictures:arr});
                            this.setState({max_pic:arr.length-1});
                        }else{
                        }
                    })


                let formdata3 = new FormData;
                formdata3.append("user_id",crnt_id);
                formdata3.append("building_id",buildid.id);

                    fetch('http://jdevalik.fr/api/mycities/getfavsforuserbyid.php', {
                    method: 'POST', 
                    body: formdata3, 

                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                }).then((response) => response.json())
                    .then((json) => {
                        if(json != false){
                                this.setState({bd_favorite:true});
                            }
                        })
                

            
                    
 
                    
    
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
                this.setState({cit_name:json[0].cit_name})
            }else{
               return false;
            }
        });
}

addToFavorite = () =>
{
    let buildid = {id:this.props.route.params.id};
    let {crnt_id} = this.props;

    formdata = new FormData;
    formdata.append("user_id", crnt_id);
    formdata.append("building_id", buildid.id);

    fetch('http://jdevalik.fr/api/mycities/addfav.php', {
        method: 'POST', 
        body: formdata, 
        headers: {
            "Content-Type": "multipart/form-data"
        },})

        this.setState({bd_favorite:true});

}

removeFavorite = () =>
{
    let buildid = {id:this.props.route.params.id};
    let {crnt_id} = this.props;

    formdata = new FormData;
    formdata.append("u_id", crnt_id);
    formdata.append("b_id", buildid.id);

    fetch('http://jdevalik.fr/api/mycities/delfav.php', {
        method: 'POST', 
        body: formdata, 
        headers: {
            "Content-Type": "multipart/form-data"
        },})

        this.setState({bd_favorite:false});

}

test(){
    const {favs} = this.props;
    console.log(favs);
}

showpicture(){
    let pic_i = this.state.current_pic;
    return <Image source={{uri:`http://jdevalik.fr/api/mycities/photos/uploads/${this.state.pictures[pic_i]}jpg`}}
    style={styles.picture}
/>
    
}

nextpic(){
    let ind = this.state.current_pic * 1;
    ind++;
    console.log(ind);
     if(ind > this.state.max_pic){
        ind = 0;
        this.setState({current_pic:ind});
    }else{
        this.setState({current_pic:ind})}
}

prevpic(){
    let ind = this.state.current_pic * 1;
    ind = ind-1;
    console.log(ind);
     if(ind < 0){
        ind = this.state.max_pic;
        this.setState({current_pic:ind});
    }else{
        this.setState({current_pic:ind})}
}


render(){
    const {navigate} = this.props.navigation;
    let buildid = {id:this.props.route.params.id};
    let admin = false;
    let connected = false;
    const {crnt_role} = this.props;
    if(crnt_role == "a" || crnt_role == "u"){connected = true};
    if(crnt_role == "a"){admin = true}
    return(
        <View style={styles.container}>
            <Title val= {this.state.bd_name}/>
            <View style={styles.info}>
            <Text>Adresse : {this.state.bd_address}</Text>
            <Text>Année : {this.state.bd_year}</Text>
            <Text>Ville : {this.state.cit_name}</Text>
            <Text>Description : {this.state.bd_description}</Text>
            </View>

            <View style={styles.picontainer}>
            <TouchableOpacity><AntDesign  onPress={() => this.prevpic()} name="leftcircleo" size={24} color="white" /></TouchableOpacity>
            {this.showpicture()}
            <TouchableOpacity><AntDesign  onPress={() => this.nextpic()} name="rightcircleo" size={24} color="white" /></TouchableOpacity>
            </View>

            <View style={styles.buttons1}>

        {connected ? 
            <WhiteButton onPress={
                !this.state.bd_favorite ? this.addToFavorite : this.removeFavorite
                }val={!this.state.bd_favorite ? "Ajouter en favori" : "Enlever des favoris" }/>: ""}
            </View>

            <View style={styles.buttons}>
            {admin ? 
            <WhiteButton   val="Modifier ce bâtiment"onPress={() => navigate("modifbuilding",{id:buildid.id})}/> : ""}


        {connected ?   
            <WhiteButton val="Ajouter une photo" onPress={()=> navigate("camera",{id:buildid.id})}></WhiteButton> : <Text style={styles.text}>Connectez vous pour ajouter une photo à ce bâtiment</Text>}

         
            </View>

        </View>
    )
}
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#545454',
      alignItems: 'center',
      justifyContent: 'center',
      columnGap:5
    },
  
    text:{
        color:"white",
    },

    buttons1:{
        flex:1,
        justifyContent:"flex-end"
    },

    buttons:{
        flex: 1,
        margin:10,
        flexDirection: 'row',
    
    },



    info:{
        flex:1,
        backgroundColor: 'white',
        borderWidth: 5,
        borderColor: "black",
        justifyContent:"flex-start",
        margin:5
    },

    picture:{
        flex:1,
        height:270,
        width:350
    },

    picontainer:{
        flex:2,
        margin:5,
        flexDirection:"row",
        alignItems:"center"
        
    }
  });


const mapStateToProps = (state)=>{
    return state;}
export default connect(mapStateToProps)(Building);