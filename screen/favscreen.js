import React from "react";
import { FlatList, SafeAreaView, View, Text, TouchableOpacity } from "react-native";



export default class Favlist extends React.Component
{
    constructor(props) 
    {
        super(props);
        this.state = 
        {
            favBatArray: []
        };
    }
    
    componentDidMount()
    {
        formData = new FormData()
        const c_id = 1
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
                console.log("Nom : " + this.state.favBatArray[0][0])
            }
            )
        .catch(e => console.log(e));
    }

    renderItem = ({ item }) => 
    {
        return (
            <View>
                <TouchableOpacity
                    onPress={() => 
                        {
                            console.log("Navigate to the details!")
                            this.props.navigation.navigate("building", {id:item[1]})
                        }
                }
                >
                    <Text>{item[0]}</Text>
                </TouchableOpacity>
            </View>
            );
    }

    render() 
    {
        
        return (
          <SafeAreaView>
                <FlatList
                    data={this.state.favBatArray}
                    keyExtractor={(item) => item.build_id}
                    renderItem={this.renderItem}
                />
          </SafeAreaView> 
        );
    }
}