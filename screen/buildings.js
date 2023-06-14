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
import {connect} from "react-redux";
import Title from '../components/title';




 class Buildings extends React.Component{
    constructor(props){
        super(props);
        this.state={
            buildings:[],
            type:[],
            favs:[]
        }      
}


componentDidMount(){
    
    let buildid = {id:this.props.route.params.id};
    let formdata = new FormData;
    formdata.append("id",buildid.id);
    fetch('http://jdevalik.fr/api/mycities/buildingsbycity.php', {
        method: 'POST', 
        body: formdata, 
        headers: {
            "Content-Type": "multipart/form-data"
        },
    }).then((response) => response.json())
        .then((json) => {
          if(json != false){
            let arr = [];
            for(let i=0;i<json.length;i++){
                arr.push([json[i].build_name,json[i].build_id]);
            }
            this.setState({buildings:arr});
          }else{
            console.log('salut');
            let emptyarr = new Array();
            this.setState({buildings:emptyarr})
          }
    })

    const {crnt_id} = this.props;

    let formdata2 = new FormData

    formdata2.append("id",crnt_id);
    fetch('http://jdevalik.fr/api/mycities/getfavsbyid.php', {
        method: 'POST', 
        body: formdata2, 
        headers: {
            "Content-Type": "multipart/form-data"
        },
    }).then((response) => response.json())
        .then((json) => {
          if(json != false){
            let arr = [];
            for(let i=0;i<json.length;i++){
                arr.push(json[i].fav_build_id);
            }
            console.log("l'arr",arr);
            this.setState({favs:arr});
          }
    })


}


render(){
    const {navigate} = this.props.navigation;

    return(
        <View style={styles.container}>
          <Title style={styles.title} val="Liste des bâtiments" />
            
        {this.state.buildings.map((building, Building) => (
        <View key={Building}>
          
                <View >
                <TouchableOpacity onPress={() => navigate("building",{id:building[1]})}><Text style={styles.builds}>{building[0]}{this.state.favs.includes(building[1])?"⭐":""}</Text></TouchableOpacity>
                </View>
        </View>))}

        </View>)}
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#545454',
      alignItems: "center",
      justifyContent: "flex-start",
    },

    title:{
      padding:100
    },

    builds:{
      fontSize:20,
      color:"white",
      textDecorationLine:"underline"
    },
}
)

const mapStateToProps = (state)=>{
    return state;}
export default connect(mapStateToProps)(Buildings);
