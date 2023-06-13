import React, { useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, Alert, View, TextInput, Button, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const { width, height } = Dimensions.get('window');
const KEY = 'AIzaSyDf1Hc8jbjnb5r140li7xkAW3IyJlC3-9o';

export default class Itinerary extends React.Component 
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
            arrayFavo : [],
            arrayFavoLat : [],
            arrayFavoLong : [],
            arrayMark: [],
            aWayp : []
        };
        this.onRegionChange = this.onRegionChange.bind(this)
        this.mapView = null
    }


    componentDidMount()
    {
        this.useEffect()
        let a = []
        let aLat = []
        let aLong = []
        for(let i=0; i<this.props.route.params.arrayFav.length; i++)
        {
            a.push({latitude : this.props.route.params.arrayFav[i].latitude, longitude : this.props.route.params.arrayFav[i].longitude})
            aLat.push(this.props.route.params.arrayFav[i].latitude)
            aLong.push(this.props.route.params.arrayFav[i].longitude)
        }
       
        console.log("Copie l : " + aLat)
        console.log("Copie o : " + aLong)
        this.setState({arrayFavo: a})
        this.setState({arrayFavoLat: aLat})
        this.setState({arrayFavoLong: aLong})

        let aWay = []
        if(this.props.route.params.arrayFav.length > 2)
        {
        for(let i=1; i<this.props.route.params.arrayFav.length - 1; i++)
        {
            aWay.push({latitude : this.props.route.params.arrayFav[i].latitude, longitude : this.props.route.params.arrayFav[i].longitude})
           
        }
        console.log("Copie AWA: " + aWay[0].longitude)
        this.setState({aWayp: aWay})
        console.log("AWAYP : " + this.state.aWayp)
        }
        formData = new FormData()
        const c_id = 46
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
                            Alert.alert('bâtiment', 'ses coords => latitude : ' + eCoord.latitude + ', longitude : ' + eCoord.longitude, 
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
                            pinColor='blue'
                        >
                            <Callout>
                                <View>
                                    <Text>{this.props.route.params.arrayFav[i].name} étape numéro : {i}</Text>
                                </View>
                                </Callout>
                        </Marker>
                        ))
                    }
                        <MapViewDirections
                            origin={
                                {
                                    latitude: parseFloat(this.state.arrayFavoLat[0]),
                                    longitude: parseFloat(this.state.arrayFavoLong[0])

                                }
                            }
                            destination={
                                {
                                    
                                    latitude: parseFloat(this.state.arrayFavoLat[this.state.arrayFavoLat.length-1]),
                                    longitude: parseFloat(this.state.arrayFavoLong[this.state.arrayFavoLong.length-1])

                                }
                            }
                            apikey={KEY}
                            language="FR"
                            
                            //waypoints={(this.state.array.length > 2) ? this.state.array.slice(1, -1): undefined}
                            waypoints={(this.state.arrayFavo.length > 2) ? this.state.aWayp : undefined}
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
                <Text>Distance : {this.state.distance} kms</Text>
                <Text>Durée : {this.state.duration} min</Text>      
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
    }
});