import { SafeAreaView, View, Text, Image, Button, Alert, StyleSheet,TouchableOpacity } from "react-native";
import React from "react";
import {connect} from "react-redux";
import WhiteButton from "../components/white_button";
import { AntDesign } from '@expo/vector-icons';


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
    const formdata = new FormData;

    const {favs} = this.props;
    if(favs.includes(buildid.id)){this.setState({bd_favorite:true});}

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
                    .catch((error) => {
                            console.error(error);
                        }
                    );
    
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
    const {favs} = this.props;
    arr = favs;
    arr.push(buildid.id);
    const action5 = {type:"add_fav",value:arr};
    this.props.dispatch(action5);

    this.setState({bd_favorite : true})
}

removeFavorite = () =>
{
    let buildid = {id:this.props.route.params.id};
    const {favs} = this.props;
    arr = favs.filter(function(a){return a !== buildid.id})

    const action5 = {type:"add_fav",value:arr};
    this.props.dispatch(action5);

    this.setState({bd_favorite : false})
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
    const {crnt_role} = this.props;
    if(crnt_role == "a"){admin = true}
    return(
        <SafeAreaView style={styles.container}>
            <View>
                <Text>URL image : {this.bd_image}</Text>
                <Image source={this.bd_image}/>
            </View>
            <Text>id : {this.state.bd_id}</Text>
            <Text>name : {this.state.bd_name}</Text>
            <Text>description : {this.state.bd_description}</Text>
            <Text>adresse : {this.state.bd_address}</Text>
            <Text>année : {this.state.bd_year}</Text>
            <Text>Ville : {this.state.cit_name}</Text>
            <Button onPress={
                    
                    !this.state.bd_favorite ? this.addToFavorite : this.removeFavorite
                }
                title=
                {
                    !this.state.bd_favorite ? "Ajouter en favori" : "Enlever des favoris"
                }
            />
            <Text>dans favoris : {this.state.bd_favorite.toString()}</Text>
            <WhiteButton style={{height: 20}} val = "test"  onPress={() => this.test()}></WhiteButton>
            <View style={styles.picontainer}>
            <TouchableOpacity><AntDesign  onPress={() => this.prevpic()} name="leftcircleo" size={24} color="black" /></TouchableOpacity>
            {this.showpicture()}
            <TouchableOpacity><AntDesign  onPress={() => this.nextpic()} name="rightcircleo" size={24} color="black" /></TouchableOpacity>
            </View>
            {admin ? <Button  title="Modifier ce bâtiment"onPress={() => navigate("modifbuilding",{id:buildid.id})}/> : ""}

        </SafeAreaView>
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
  
    picture:{

        height:250,
        width:250
    },

    picontainer:{
        flex:1,
        flexDirection:"row",
        alignItems:"center"
        
    }
  });


const mapStateToProps = (state)=>{
    return state;}
export default connect(mapStateToProps)(Building);