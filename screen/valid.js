import React from 'react';
import WhiteButton from '../components/white_button';
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  Image,
  Alert,
} from 'react-native';
import {connect} from "react-redux";


class Validation extends React.Component{
    constructor(props){
        super(props);
       
}

deco(){
  const {navigate} = this.props.navigation ;
  const action = {type:"crnt_user",value:""} ;
  this.props.dispatch(action);
  const action2 = {type:"crnt_id",value:""} ;
  this.props.dispatch(action2);
  const action3 = {type:"crnt_role",value:""} ;
  this.props.dispatch(action3);
  navigate("Homepage");
}

modif(){
  const {navigate} = this.props.navigation ;
  navigate("modify");
}

test(){
  const {favs} = this.props;
  console.log(favs);
}

    render(){
        
        const {crnt_usr} = this.props;
        const {crnt_role} = this.props;
        const {crnt_id} = this.props;
        const {navigate} = this.props.navigation;
        const logo = require('../assets/logo3.png');

        console.log(this.props.crnt_role);

        return (
          <SafeAreaView style={styles.container}>
            <Image source={logo} style={styles.logo}/>    
            <View style={styles.btngroups}>
                  <View style={styles.btngroup}>
                      <WhiteButton style={{height: 20}} val = "Modifier profil"  onPress={() => this.modif()}></WhiteButton> 
                      <WhiteButton style={{height: 20}} val = "Chercher par ville"  onPress={() => navigate("city")}></WhiteButton>
                      <WhiteButton style={{height: 20}} val = "Ajouter bâtiment"  onPress={() => navigate("addbuild")}></WhiteButton>
                      <WhiteButton style={{height: 20}} val = "Déconnexion"  onPress={() => this.deco()}></WhiteButton>
                      
                  </View>
                  <View style={styles.btngroup}>
                      <WhiteButton style={{height: 20}} val = "Carte intéractive"  onPress={() => navigate("buildingsmap")}></WhiteButton>
                      <WhiteButton val="Filtrer bâtiments"onPress={() => navigate("buildfilter")}></WhiteButton>
                      <WhiteButton style={{height: 20}} val = "Favoris"  onPress={() => navigate("favlist")}></WhiteButton>
                      {crnt_role == "a" ?
                      <WhiteButton  val="Administrer"onPress={() => navigate("admin")}/> : ""}
                      
                  </View>
            </View>
          </SafeAreaView>
            

          
        )
    }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#545454',
      alignItems: 'center',
    },
  btngroups:{
    alignItems: 'center',
    justifyContent: 'center',
    flex:0.5,
    flexDirection:"row"
  },

btngroup:{
  margin:10
}

  });


const mapStateToProps = (state)=>{
    return state;}
export default connect(mapStateToProps)(Validation);