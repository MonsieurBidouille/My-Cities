import React, { useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, Alert, View, TextInput, Image } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';


export default class Buildingsmap extends React.Component 
{
    constructor(props) 
    {
        super(props);
        this.state = 
        {
            location: null,
            errMessage: null,
            region: {
                latitude: 48.858370,
                longitude: 2.294481,
                latitudeDelta: 10.0922,
                longitudeDelta: 10.0421,
            },
            buildMarker : {
                latitude : 0,
                longitude : 0
            },
            distance : 0,
            duration : 0,
            array: [],
            arrayMark: []
        };
        this.onRegionChange = this.onRegionChange.bind(this)
    }


    componentDidMount()
    {
        this.useEffect()
        fetch('http://jdevalik.fr/api/mycities/getallbuildings.php',
        {
            method:"POST",
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
                    arr.push({id:json[i].build_id, name:json[i].build_name, lat:json[i].build_lat, long:json[i].build_long})
                }
                this.setState({arrayMark:arr})
                console.log(this.state.arrayMark)
            }
            )
        .catch(e => console.log(e));
    }

    async useEffect(){
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            this.setState({errMessage: 'Permission to access location was denied'});
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        this.setState({location: location});
        console.log(location)
    }

    onRegionChange = (reg) => 
    {
        this.setState({
            region: reg           
        });
    }


    render() {
        const {navigate} = this.props.navigation ;
        return (
            <SafeAreaView style={styles.container}>

                <MapView
                    style={styles.map}
                    initialRegion={this.state.region}
                    onRegionChange={this.onRegionChange}
                    onPress=
                    {
                        (e) => 
                        {
                            const eCoord = e.nativeEvent.coordinate
                            Alert.alert('Ajout du bâtiment', 'Ajout avec ses coords => latitude : ' + eCoord.latitude + ', longitude : ' + eCoord.longitude, 
                                    [
                                        {
                                            text: 'Annuler',
                                            onPress: () => 
                                            {
                                                console.log('Bouton Annuler pressé');
                                            },
                                            style: 'cancel',
                                        },
                                        {
                                            text: 'Ajouter ce bâtiment', 
                                            onPress: () => 
                                            {
                                                this.setState({ buildMarker : eCoord }); 
                                                console.log(this.state.buildMarker);
                    
                                                this.state.array.push(eCoord)
                                                console.log(this.state.array);
                                            }
                                        },
                                    ]);
                                
                        }
                    }
                >
                    {
                        //this.state.buildMarker &&
                        this.state.arrayMark.map((mark, i) => (
                            
                        <Marker 
                            key={i}
                            //coordinate={this.state.buildMarker}
                            coordinate={{latitude : mark.lat, longitude : mark.long}}
                            title="Nouveau bâtiment"
                            onCalloutPress=
                            {() =>{navigate("building",{id:mark.id})}}
                            pinColor='blue'
                        >
                            <Callout>
                                <View>
                                    <Text>{mark.name}</Text>
                                </View>
                                </Callout>
                        </Marker>
                        ))
                    }
                    {
                    }
 
                </MapView>
            
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
    },
    button: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    buttonSnap: {
        marginTop: 20,
        flex: 0.3,
        alignSelf: 'flex-start',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    map:
    {
        width: '100%',
        height: '100%',
    }
});