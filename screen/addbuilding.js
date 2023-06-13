import React from 'react';
import { SafeAreaView, StyleSheet, Text, Alert, View } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';

export default class AddBuilding extends React.Component 
{
    constructor(props) 
    {
        super(props);
        this.state = 
        {
            location: null,
            errMessage: null,
            region: {
                latitude: 46.5984807,
                longitude: 2.4952946,
                latitudeDelta: 10.0,
                longitudeDelta: 10.0,
            },
            buildMarker : {
                latitude : 0,
                longitude : 0
            },
        };
        this.onRegionChange = this.onRegionChange.bind(this)
    }


    componentDidMount()
    {
        this.useEffect()
    }

    async useEffect()
    {
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


    render() 
    {
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
                            this.setState(
                            { 
                                buildMarker : e.nativeEvent.coordinate 
                            }); 
                            console.log(this.state.buildMarker);
                        }
                    }
                >
                    {
                        this.state.buildMarker &&
                        <Marker 
                            coordinate={this.state.buildMarker}
                            title="Nouveau bâtiment"
                            onCalloutPress=
                            {() =>
                                {
                                    
                                    Alert.alert('Ajout du bâtiment', 'Ajouter ce bâtiment ?', 
                                    [
                                        {
                                            text: 'Non',
                                            onPress: () => 
                                            {
                                                console.log('Bouton Annuler pressé');
                                            },
                                            style: 'cancel',
                                        },
                                        {
                                            text: 'Oui', 
                                            onPress: () => 
                                            {
                                                console.log('Navigate to BuildForm.js');
                                                this.props.navigation.navigate('buildform', {latitude : this.state.buildMarker.latitude, longitude: this.state.buildMarker.longitude});
                                            }
                                        },
                                    ]);
            
                                }
                            }
                            pinColor='blue'
                        >
                            <Callout>
                                <View>
                                    <Text>Ajout du bâtiment</Text>
                                </View>
                                </Callout>
                        </Marker>
                    }
                        
                </MapView>

                <View style={{margin:30}}>
                    <Text style={styles.text}>Veuillez placer un marqueur à l'emplacement de votre bâtiment puis appuyer sur le marqueur pour valider l'ajout.</Text>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#545454',
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
        fontSize: 20,
        color: 'white',
    },
    map:
    {
        width: '100%',
        height: '75%',
    },



});