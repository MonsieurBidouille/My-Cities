import React from "react";
import {
    View,
    Text,
    StyleSheet
  } from 'react-native';

export default class Title extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        const {val} = this.props;
        return (
            <View>
                <Text style={styles.title}>{val}</Text>
            </View>
        )
    }
}



const styles = StyleSheet.create({
    title:{
        fontSize: 35,
        fontWeight: 'bold',
        color: '#d9ddde',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 10,
      },
    });
    