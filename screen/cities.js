import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput
} from 'react-native';
import {connect} from "react-redux";
import WhiteButton from '../components/white_button';
import Title from '../components/title';




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
            let emptyarr = [];
            this.setState({cities:emptyarr})
          }
    })
}



render(){
    const {navigate} = this.props.navigation;
    return(
        <View style={styles.container}>
          <View style={styles.container2}>
          <Title val = "Sélection de ville"/>
            <TextInput style={styles.input} value={this.state.city} onChangeText={text=> this.setState({city:text})}  placeholder="Chercher une ville" keyboardType="text"/>
            <WhiteButton  val="Valider" onPress={() => this.valid()}/>
            
            {this.state.cities.map((city, City) => (
          <View  key={City}>
                  <View >
                   <TouchableOpacity style={styles.cities} onPress={() => navigate("buildings",{id:city[1]})}><Text style={styles.citiesText}>{city[0]}</Text></TouchableOpacity>
                  </View>
                
        </View>))}
        </View>
        </View>)}
}
const styles = StyleSheet.create({
container:{
    flex: 1,
    backgroundColor: '#545454',
    alignItems: 'center',
  },

container2:{
  marginTop:100,
  flex: 1,
  alignItems: 'center',
  },

  cities: {
    alignItems: 'center',
    marginBottom:10,
    height:30,
  },
  citiesText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine:"underline"
  },

  input:{
    backgroundColor:"white",
    width:250,
    height:35,
    margin:5,
    borderWidth:1,
  }
}
)

const mapStateToProps = (state)=>{
    return state;}
export default connect(mapStateToProps)(Cities);

