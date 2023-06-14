import React from "react";
import { FlatList, SafeAreaView, View, Text, TouchableOpacity,StyleSheet } from "react-native";
import {connect} from "react-redux";
import Title from "../components/title";
import WhiteButton from "../components/white_button";



class Favlist extends React.Component
{
    constructor(props) 
    {
        super(props);
        this.state = 
        {
            favBatArray: [],
            
        };
    }
    
    componentDidMount()
    {
        const {crnt_id} = this.props;
        formData = new FormData()
        const c_id = crnt_id;
        formData.append('id', c_id)
        fetch('http://jdevalik.fr/api/mycities/getfavsbyid.php',
        {
            method:"POST",
            body:formData,
            header:
            {
                "Content-Type":"multipart/form-data"
            },
        }
        )
        .then(res => res.json())
        .then(json =>
            {
                let arr = [];
                for(let i = 0; i < json.length ; i++){
                    arr.push([json[i].build_name,json[i].build_id])
                }
                this.setState({favBatArray:arr})
             })
        .catch(e => console.log(e));

        
    }

    renderItem = ({ item }) => 
    {
        return (
            <View style={styles.views}>
                <TouchableOpacity
                    onPress={() => 
                        {
                            console.log("Navigate to the details!")
                            this.props.navigation.navigate("building", {id:item[1]})
                        }
                }
                >
                    <Text style={styles.text}>{item[0]}</Text>
                </TouchableOpacity>
            </View>
            );
    }

    render() {
        const {navigate} = this.props.navigation; 
        
        return (
          <SafeAreaView style={styles.container}>
            <Title val="Vos Favoris"/>
                <FlatList style={styles.flist}
                    data={this.state.favBatArray}
                    keyExtractor={(item) => item.build_id}
                    renderItem={this.renderItem}
                />
                <WhiteButton val="itinéraire" onPress={() => navigate("Itineraire")} />
          </SafeAreaView> 
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#545454',
        alignItems: 'center',
        justifyContent: 'center',
    },

    views:{
        backgroundColor:"grey"

    },

    text:{
        fontSize:22,
        textDecorationLine:"underline",
        color:"white",
        margin:10,
    },

    flist:{

    },
  
  });







const mapStateToProps = (state)=>{
    return state;}
export default connect(mapStateToProps)(Favlist);