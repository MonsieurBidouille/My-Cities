import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { List } from 'react-native-paper'
import {connect} from "react-redux";

class BuildForm extends React.Component
{
    constructor(props) 
    {
        super(props);
        this.state = 
        {
            latitude: 0,
            longitude: 0,
            building_name: "test",
            building_year: 1234,
            building_description: "desc",
            building_town:1,
            building_address:"1, rue du dev",
            type:[],
            expanded:true,
            type_id: 1,
        };
    }

    componentDidMount()
    {
        this.setState({latitude: this.props.route.params.latitude})
        this.setState({longitude: this.props.route.params.longitude})

        
        fetch('http://jdevalik.fr/api/mycities/gettypes.php',
        {
            method:"POST",
            headers:
            {
                "Content-Type":"multipart/form-data"
            },
        })
        .then((res) => res.json())
        .then((json) => 
        {
            if(json != false)
            {
                const arr = []
                for(let i=0; i<json.length; i++)
                {
                    arr.push({id:json[i].type_id, lib:json[i].type_lib})
                }
                this.setState({type: arr})
            }
        })
    }

    handlePress = () =>
    {
        this.setState({expanded: !this.state.expanded})
    }

    addBuild(cit_id)
    {
        const {crnt_id} = this.props;
        const {crnt_role} = this.props;
        const formdata = new FormData;

        formdata.append("name", this.state.building_name);
        formdata.append("desc", this.state.building_description);
        formdata.append("adress", this.state.building_address);
        formdata.append("year", this.state.building_year);
        formdata.append("city",cit_id);
        formdata.append("lat", this.state.latitude);
        formdata.append("long", this.state.longitude);
        formdata.append("admin", crnt_role);
        formdata.append("type",this.state.type_id);

        fetch('http://jdevalik.fr/api/mycities/addbuilding.php',
        {
            method:"POST",
            body:formdata,
            headers:
            {
                "Content-Type":"multipart/form-data"
            },
        })
        .then((response) => response.json())
        .then((json) => {
            if(json != false){   
                console.log("test123",json[0])
                if(crnt_role != 'a'){this.addpending(json[0].id);}
                Alert.alert('Succès', "Ajout des détails du bâtiment réussi !",
                [ {text: 'OK'}]
                )
                //this.props.navigation.navigate("AddBuild")
            }
            else
            {
                Alert.alert('Erreur', "Impossible d'ajouter les détails !",
                [
                    {text: 'OK'}
                ]
                )
            }
        })
        .catch((error) => 
        {
            console.error(error)
        })
    }


    checkcity(){
        let formdata = new FormData;
        formdata.append("city",this.state.building_town)
        fetch('http://jdevalik.fr/api/mycities/checkcity.php', {
            method: 'POST', 
            body: formdata, 
            headers: {
                "Content-Type": "multipart/form-data"
            },
        })
        .then((response) => response.json())
        .then((json) => {
            if(json != false){
                this.addBuild(json[0].id);
        }
    })
    }

    addpending(bid){
        const {crnt_id} = this.props;
        let formdata = new FormData;
        formdata.append('user_id',crnt_id);
        formdata.append('building_id',bid);
        fetch('http://jdevalik.fr/api/mycities/addpenduser.php', {
            method: 'POST', 
            body: formdata, 
            headers: {
                "Content-Type": "multipart/form-data"
            },
        })
    }

    render() 
    {
        
        return (
          <View>
            <Text>Latitude : {this.state.latitude}</Text>
            <Text>Longitude : {this.state.longitude}</Text>
            <TextInput 
                placeholder="Insérer le nom du bâtiment" 
                onChangeText=
                {
                    inputText => this.setState({building_name: inputText})
                }
            />
            <TextInput 
                placeholder="Insérer l'année du bâtiment"
                onChangeText=
                {
                    inputText => this.setState({building_year: inputText})
                }
            />
            <TextInput 
                placeholder="Insérer la description du bâtiment"
                onChangeText=
                {
                    inputText => this.setState({building_description: inputText})
                }
            />
            <TextInput 
                placeholder="Insérer la ville du bâtiment"
                onChangeText=
                {
                    inputText => this.setState({building_town: inputText})
                }
            />
            <Text>InputText(Nom:{this.state.building_name}, Année:{this.state.building_year}, Description:{this.state.building_description})</Text>
            <List.Section title="Détails du bâtiment">
                <List.Accordion
                    title="Types"
                    left={props => <List.Icon {...props} icon="store" />}
                    expanded={this.state.expanded}
                    onPress={this.handlePress}>
                    {
                        this.state.type.map((item, i) => (
                            <List.Item
                                key={i}
                                title={item.lib}
                                onPress={()=>{this.setState({expanded:false}); this.setState({type_id:this.state.type[i].id});}}
                            />
                        )
                        
                        )
                    }
                </List.Accordion>
                </List.Section>
            <Button 
                title="Ajouter le bâtiment"
                //onPress={() => this.props.navigation.navigate('Geolocation')}
                onPress={() => this.checkcity()}
            />
            <Text>Type id : {this.state.type_id}</Text>
          </View>  
        );
    }
}




const mapStateToProps = (state)=>{
    return state;}
export default connect(mapStateToProps)(BuildForm);