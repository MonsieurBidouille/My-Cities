import React from 'react';
import { SafeAreaView, StyleSheet, Text, Alert, View, Image, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {connect} from "react-redux";
const { width, height } = Dimensions.get('window');
const KEY = 'AIzaSyDf1Hc8jbjnb5r140li7xkAW3IyJlC3-9o';

class Itinerary extends React.Component 
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
            distance : 0,
            duration : 0,
            arrayFavo : [{
                id: 1,
                name : "",
                latitude : 0,
                longitude : 0
            }],
        };
        this.onRegionChange = this.onRegionChange.bind(this)
        this.mapView = null
    }


    componentDidMount()
    {
        this.useEffect()
        const {crnt_id} = this.props
        formData = new FormData()
        
        formData.append('id', crnt_id)
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
                    arr.push({id:json[i].build_id, name: json[i].build_name, latitude: json[i].build_lat, longitude: json[i].build_long})
                }
                this.setState({arrayFavo:arr})
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

    render() 
    {
        
       

        return (
            <SafeAreaView style={styles.container}>

                <MapView
                    ref={c=>this.mapView = c}
                    style={styles.map}
                    initialRegion={this.state.region}
                    onRegionChange={this.onRegionChange}
                    onPress=
                    {
                        (e) => 
                        {
                            const eCoord = e.nativeEvent.coordinate
                            Alert.alert('Double clic', 'ses coords => latitude : ' + eCoord.latitude + ', longitude : ' + eCoord.longitude, 
                                    [
                                        {
                                            text: 'OK',
                                            onPress: () => 
                                            {
                                                console.log('Bouton OK pressé');
                                            }
                                        }
                                    ]);
                        }
                    }
                    
                >
                    {
                        this.state.arrayFavo.map((mark, i) => (
                            
                        <Marker 
                            key={i}
                            coordinate={{latitude : mark.latitude, longitude : mark.longitude}}
                            title="Bâtiment"
                            onCalloutPress=
                            {() =>
                                {
                                    
                                    Alert.alert('bâtiment', mark.name, 
                                    [
                                        {
                                            text: 'OK',
                                            onPress: () => 
                                            {
                                                console.log('Bouton OK pressé');
                                            }

                                        }
                                    ]);
            
                                }
                            }
                            pinColor={i==0  ? 'red' : (i==this.state.arrayFavo.length - 1 ? 'green' : 'blue')}
                        >
                            <Image source={i==0 ? require('../assets/ligne-de-depart.png'): (i == this.state.arrayFavo.length - 1 ? require('../assets/ligne-darrivee.png') : require('../assets/etape-importante.png'))}/>
                            <Callout>
                                <View>
                                    <Text>{this.state.arrayFavo[i].name} étape numéro : {i}</Text>
                                </View>
                                </Callout>
                        </Marker>
                        ))
                    }
                        <MapViewDirections
                            origin={
                                {
                                    latitude: parseFloat(this.state.arrayFavo[0].latitude),
                                    longitude: parseFloat(this.state.arrayFavo[0].longitude)
                                }
                            }
                            destination={
                                {
                                    latitude: parseFloat(this.state.arrayFavo[this.state.arrayFavo.length-1].latitude),
                                    longitude: parseFloat(this.state.arrayFavo[this.state.arrayFavo.length-1].longitude)
                                }
                            }
                            apikey={KEY}
                            language="FR"
                            waypoints={(this.state.arrayFavo.length > 2) ? this.state.arrayFavo.slice(1, -1) : undefined}
                            strokeColor="hotpink"
                            strokeWidth={3}
                            onStart={(params) => {
                                console.log(`Itinéraire entre "${params.origin}" et "${params.destination}"`);
                              }}
                            onReady={res => 
                                {
                                    console.log("Distance: " + res.distance + " kms");
                                    this.setState({distance : res.distance})
                                    console.log("Durée: " + res.duration + " min");
                                    this.setState({duration : res.duration});
                                    
                                    this.mapView.fitToCoordinates(res.coordinates, {
                                        edgePadding: 
                                        {
                                          right: (width / 20),
                                          bottom: (height / 20),
                                          left: (width / 20),
                                          top: (height / 20),
                                        }
                                      });
                                }}
                        />
                </MapView>
                <Text style={styles.dist}>Distance : {this.state.distance} kms</Text>
                <Text style={styles.dura}>Durée : {Math.floor(this.state.duration/60)}h{parseInt(this.state.duration % 60)}min</Text>      
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#545454'
    },
    map:
    {
        width: '100%',
        height: '75%',
    },
    dist:
    {
        color:'white',
        fontSize: 20
    },
    dura:
    {
        color:'white',
        fontSize: 20
    }
});



const mapStateToProps = (state)=>{
    return state;}
export default connect(mapStateToProps)(Itinerary);