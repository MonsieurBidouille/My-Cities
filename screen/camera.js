import React, { memo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';


export default class Camera_screen extends React.Component 
{
    constructor(props) {
        super(props);
        this.state = {
            hasPermission: null,
            type: Camera.Constants.Type.back,
            uri: null,
            photoName : "nomdelaphoto",
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

    async upload()
    {
        const formdata = new FormData()
        formdata.append('file_attachment', {uri: this.state.uri, name: `${this.state.photoName}.jpg`, type:'image/jpeg'});
        formdata.append('buildid', this.state.building_id);
        formdata.append('name', this.state.photoName);
        console.log("image uri : " + this.state.uri);
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
                Alert.alert('Succès', "Ajout du fichier dans la base de données réussi !",
                [
                    {text: 'OK'}
                ]
                )

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
                            style={styles.button}
                            onPress={() => {
                                this.setState({type:
                                    this.state.type === Camera.Constants.Type.back
                                        ? Camera.Constants.Type.front
                                        : Camera.Constants.Type.back
                                });
                            }}>
                            <Text style={styles.text}> Flip </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonSnap}
                            onPress={() => {
                                this.snap()
                            }}>
                            <Text style={styles.text}> Take photo </Text>
                        </TouchableOpacity>
                    </View>
                </Camera>
                
                <View style={styles.buttonContainer}>
                    <Image style={{flex: 1}} source={{uri: this.state.uri ? this.state.uri : 'https://reactnative.dev/img/tiny_logo.png'}}/>
                </View>
                
                <View>
                <TouchableOpacity
                    onPress={() => 
                        {
                            this.save(this.state.uri)
                        }}
                >
                            <Text style={{color: "red"}}> Save</Text>
                        </TouchableOpacity>
                </View>

                <View>
                <TouchableOpacity
                    onPress={() => 
                        {
                            this.search()
                        }}
                >
                            <Text style={{color: "red"}}> Search </Text>
                        </TouchableOpacity>
                </View>
                <View>
                    <TextInput 
                        placeholder="Insérer le nom de la photo"
                        onChangeText=
                        {
                            inputText => this.setState({photoName: inputText})
                        }
                    />
                </View>
                <View>
                    <TouchableOpacity
                        onPress={() => 
                        {
                            this.upload()
                        }}
                    >
                            <Text style={{color: "red"}}> Upload </Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        onPress={() => 
                        {
                            this.display()
                        }}
                    >
                            <Text style={{color: "red"}}> Display </Text>
                    </TouchableOpacity>
                    
                    <Image 
                        source={{uri:`http://jdevalik.fr/api/mycities/photos/uploads/${this.state.arrN}.jpg`}}
                        style=
                        {{
                            width:200,
                            height:200
                        }}
                    />
                </View>
                <View>
                    <Text>{`http://jdevalik.fr/api/mycities/photos/uploads/${this.state.arrN}.jpg`}</Text>
                </View>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    camera: {
        flex: 1,
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
});
