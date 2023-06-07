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




 class Buildings extends React.Component{
    constructor(props){
        super(props);
        this.state={
            buildings:[],
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
            console.log(arr);
            this.setState({buildings:arr});
          }else{
            console.log('salut');
            let emptyarr = new Array();
            this.setState({buildings:emptyarr})
          }
    })

}


render(){
    const {favs} = this.props;
    const {navigate} = this.props.navigation;
    return(
        <View style={styles.container}>
            
        {this.state.buildings.map((building, Building) => (
        <View  key={Building}>
                <View >
                <TouchableOpacity onPress={() => navigate("building",{id:building[1]})}><Text>{building[0]}{favs.includes(building[1])?"⭐":""}</Text></TouchableOpacity>
                </View>
        </View>))}

        </View>)}
}

const styles = StyleSheet.create({
container:{
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
}
)

const mapStateToProps = (state)=>{
    return state;}
export default connect(mapStateToProps)(Buildings);