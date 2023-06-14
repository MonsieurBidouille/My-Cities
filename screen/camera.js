import React, { memo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import WhiteButton from '../components/white_button';
import {connect} from "react-redux";


export default class Camera_screen extends React.Component 
{
    constructor(props) {
        super(props);
        this.state = {
            hasPermission: null,
            type: Camera.Constants.Type.back,
            uri: null,
            photoName : "",
            arr: [],
            arrN: "",
            building_id:0
        };
    }
    componentDidMount(){
        this.useEffect();
        let buildid = {id:this.props.route.params.id};
        this.setState({building_id:buildid.id});
    }

    async useEffect(){
        const {status} = await Camera.requestCameraPermissionsAsync();
        this.setState({hasPermission: status === 'granted'});
    }

    async snap(){
        if (this.camera) {
            let photo = await this.camera.takePictureAsync();
            console.log(photo)
            this.setState({uri: photo.uri})
        }
    }

    async search()
    {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
      
          console.log("res : " + result);
      
          if (!result.canceled) 
          {
            this.setState({uri:result.assets[0].uri})
          } 
          else
          {
            alert("Pas de sélection d'image")
          }   
    }
    
    async save(item)
    {
        const permission = await MediaLibrary.requestPermissionsAsync();
        if (permission.granted) {
          try {
            const asset = await MediaLibrary.createAssetAsync(item);
            MediaLibrary.createAlbumAsync('Images', asset, false)
              .then(() => {
                console.log('Réussite du fichier sauvegardé !');
              })
              .catch(() => {
                console.log('Erreur de sauvegarde de fichier!');
              });
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log('Besoin de permission pour sauvegarder le fichier');
        }    
    }

    async upload(arg_name){
        const {navigate} = this.props.navigation
        let role = {role:this.props.route.params.role}; 
        if(this.state.photoName == ""){
            Alert.alert("Veuillez entrer un nom pour la photo.");
            return false ;
        }
        const formdata = new FormData()
        formdata.append('file_attachment', {uri: this.state.uri, name: `${arg_name}.jpg`, type:'image/jpeg'});
        formdata.append('buildid', this.state.building_id);
        formdata.append('name', arg_name);
        role.role == "a" ? formdata.append('valid', 1) : formdata.append('valid', 0) ;
        return await fetch('http://jdevalik.fr/api/mycities/photos/upload.php',
        {
            method:'POST',
            body:formdata,
            headers:
            {
                'content-type': 'multipart/form-data'
            }
        }
        )
        .then((res) => res.json)
        .then((json) =>
        {
            if(json != false)
            {
            
                Alert.alert('Succès', "Ajout du fichier dans la base de données réussi !",[{text: 'OK',onPress: () => navigate('valid')}])
            
            }
            else
            {
                Alert.alert('Échec', "Erreur ajout du fichier dans la base de données !",
                [
                    {text: 'OK'}
                ]
                )
            }
        }
        )
    }


    checkname(){
        let name = this.state.photoName;
        formdata = new FormData;
        formdata.append("name", name);
        fetch('http://jdevalik.fr/api/mycities/checkpicname.php', {
            method: 'POST', 
            body: formdata, 
            headers: {
                "Content-Type": "multipart/form-data"
            },
        }).then((response) => response.json())
            .then((json) => {
              if(json != false){
                newname = name+"x";
                console.log(newname);
                this.upload(newname);
              }else{
                this.upload(name);
              }
        })
    }

    async display()
    {
        return await fetch('http://jdevalik.fr/api/mycities/getpictures.php',
        {
            method: 'POST',
            headers:
            {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((res) => res.json())
        .then((json) =>
        {
            if(json != false) 
            {
                let ar = []
                for(let i=0; i<json.length; i++)
                {
                    ar.push([json[i].pic_id, json[i].pic_name])
                }
                console.log("ar : " + ar)
                console.log("name: " + ar[0][1].toString())
                this.setState({arr:ar})
                this.setState({arrN:ar[0][1].toString()})
            }
            else
            {
                let emptyArr = new Array()
                this.setState({arr:emptyArr})
            }
        }
        )

    }

    render() {
        if (this.state.hasPermission === null) {
            return <View/>;
        }
        if (this.state.hasPermission === false) {
            return <Text>Pas d'accès à la camera</Text>;
        }

        return (
            <View style={styles.container}>
                <Camera style={styles.camera} type={this.state.type} ref={ref => {
                    this.camera = ref;
                }}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.buttonflip}
                            onPress={() => {
                                this.setState({type:
                                    this.state.type === Camera.Constants.Type.back
                                        ? Camera.Constants.Type.front
                                        : Camera.Constants.Type.back
                                });
                            }}>
                            <Text style={styles.textflip}>🔁</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonSnap}
                            onPress={() => {
                                this.snap()
                            }}>
                            <Text style={styles.point}>⚪</Text>
                        </TouchableOpacity>
                    </View>
                </Camera>
                

                
                <View style={styles.menu}>
                    

                    <TextInput style={styles.input} placeholder="Veuillez entrer le nom de la photo" value={this.state.photoName} onChangeText={inputText => this.setState({photoName: inputText})}/>
                    
                    <View style={styles.parcsav}> 
                    <WhiteButton  val="parcourir" onPress={() => {this.search()}}/>
                    <WhiteButton  val="Sauvegarder" onPress={() => {this.save(this.state.uri)}}/>
                    </View>
                    {this.state.uri ? 
                    <View style={styles.send}>
                    <WhiteButton val="Envoyer" onPress={() => {this.checkname()}}/>
                    </View> : ""}

                </View>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#545454',
        flexDirection: 'column'
    },
    camera: {
        flex: 3,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent:"center",
        margin: 20,
    },
    buttonflip: {
        flex: 0.1,
        alignSelf:"flex-end",
        alignItems: 'center',
        fontSize:50,

    },
    buttonSnap: {
        marginTop: 20,
        flex: 0.3,
        alignSelf:"flex-end",
        alignItems: 'center',

    },
    textflip: {
        fontSize: 33,
        color: 'white',
        backgroundColor:"black",
    },

    point:{
        fontSize:50,
        color:"white",
    },
    input:{
        backgroundColor:"white"
    },
    menu:{
        flex:2,
    },

    parcsav:{
        flex:1,
        flexDirection:"row",
        justifyContent:"center",
        alignItems: 'center'
    },

    send:{
        flex:1,
        justifyContent:"center",
        alignItems: 'center'
    },
});

