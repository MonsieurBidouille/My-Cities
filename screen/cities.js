import React from 'react';
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  useEffect,
  setInterval,
  TextInput
} from 'react-native';
import {connect} from "react-redux";




 class Cities extends React.Component{
    constructor(props){
        super(props);
        this.state={
            city:"",
            cities:[]
        }      
}




valid(){
    const formdata = new FormData;
    formdata.append("name",this.state.city);
    fetch('http://jdevalik.fr/api/mycities/citybyname.php', {
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
                arr.push([json[i].cit_name,json[i].cit_id]);
            }
            console.log(arr);
            this.setState({cities:arr});
          }else{
            console.log('salut');
            let emptyarr = new Array();
            this.setState({cities:emptyarr})
          }
    })
}



render(){
    const {navigate} = this.props.navigation;
    return(
        <View style={styles.container}>
            <TextInput  value={this.state.city} onChangeText={text=> this.setState({city:text})}  placeholder="Tapez une ville" keyboardType="text"/>
            <Button color='blue'  title="Valider" onPress={() => this.valid()}/>
            
            {this.state.cities.map((city, City) => (
          <View  key={City}>
                  <View >
                   <TouchableOpacity onPress={() => navigate("buildings",{id:city[1]})}><Text>{city[0]}</Text></TouchableOpacity>
                  </View>
                  
        </View>))}
        </View>)}
}
const styles = StyleSheet.create({
container:{
    flex: 1,
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
}
)

const mapStateToProps = (state)=>{
    return state;}
export default connect(mapStateToProps)(Cities);