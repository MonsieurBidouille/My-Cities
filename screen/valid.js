import React from 'react';
import WhiteButton from '../components/white_button';
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  Alert,
} from 'react-native';
import {connect} from "react-redux";


class Validation extends React.Component{
    constructor(props){
        super(props);
       
}

deco(){
  const {navigate} = this.props.navigation ;
  const action2 = {type:"crnt_user",value:null} ;
  this.props.dispatch(action2);
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

        console.log(this.props.crnt_role);

        return (
            <View style={styles.container}>
                      <Text style={{color:'blue',fontSize: 22 , textAlign:'center'}}>Vous êtes connecté</Text>
                      <View style={{height: 20}}/>
                      <Text>Bienvenue {crnt_usr} {crnt_role} {crnt_id} sur notre application d'inscription connection.</Text>
                      <View style={{height: 20}}/>
                      <WhiteButton style={{height: 20}} val = "Modification"  onPress={() => this.modif()}></WhiteButton>
                      <WhiteButton style={{height: 20}} val = "Déconnexion"  onPress={() => this.deco()}></WhiteButton>
                      <WhiteButton style={{height: 20}} val = "test"  onPress={() => this.test()}></WhiteButton>
                      <WhiteButton style={{height: 20}} val = "city"  onPress={() => navigate("city")}></WhiteButton>
                      <WhiteButton style={{height: 20}} val = "addbuild"  onPress={() => navigate("addbuild")}></WhiteButton>
                      <View style={{height: 20}}/>
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


const mapStateToProps = (state)=>{
    return state;}
export default connect(mapStateToProps)(Validation);