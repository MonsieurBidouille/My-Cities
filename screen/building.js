import { SafeAreaView, View, Text, Image, Button, Alert } from "react-native";
import React from "react";
import {connect} from "react-redux";
import WhiteButton from "../components/white_button";


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
            bd_favorite : false
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
                    }else{
                        navigate('Homepage');
                    }
                })
                .catch((error) => {
                        console.error(error);
                    }
                );
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


render(){
    const {navigate} = this.props.navigation;
    let buildid = {id:this.props.route.params.id};
    let admin = false;
    const {crnt_role} = this.props;
    if(crnt_role == "a"){admin = true}
    return(
        <SafeAreaView>
            <View>
                <Text>URL image : {this.bd_image}</Text>
                <Image source={this.bd_image}/>
            </View>
            <Text>id : {this.state.bd_id}</Text>
            <Text>name : {this.state.bd_name}</Text>
            <Text>description : {this.state.bd_description}</Text>
            <Text>latitude : {this.state.bd_region.latitude}</Text>
            <Text>longitude : {this.state.bd_region.longitude}</Text>
            <Text>latitudeDelta : {this.state.bd_region.latitudeDelta}</Text>
            <Text>longitudeDelta : {this.state.bd_region.longitudeDelta}</Text>
            <Text>adresse : {this.state.bd_address}</Text>
            <Text>année : {this.state.bd_year}</Text>
            <Text>architecte : {this.state.bd_architect}</Text>
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

            {admin ? <Button  title="Modifier ce bâtiment"onPress={() => navigate("modifbuilding",{id:buildid.id})}/> : ""}

        </SafeAreaView>
    )
}
}


const mapStateToProps = (state)=>{
    return state;}
export default connect(mapStateToProps)(Building);