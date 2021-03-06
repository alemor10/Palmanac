import React, { Component } from 'react'
import {  View, StyleSheet, Image, TouchableOpacity,Text } from 'react-native'
import { Container,Icon,Title, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base'

import ImagePicker from 'react-native-image-picker'
import firebase from 'react-native-firebase'

import MaterialIcons from "react-native-vector-icons/MaterialIcons"
export default class Profile extends Component {

    static navigationOptions = {

        tabBarIcon: ({ tintColor }) => (
            <Icon name="person" style={{ color: tintColor }} />
            
        )
    };
    

  

    constructor(props) {
        super(props);
        this.state = {
          userName: '',
          firstName: '',
          lastName: '',
          photoURL: '',
          errorMessage: null,
          isLoading: false,
          Following: 0,
          Followers: 0, 

        };
    }
    

async componentDidMount() {



      const {currentUser} = await firebase.auth();
      const displayName = currentUser.displayName;
      this.setState({userName: displayName});
      this.setFollowerAndFollowingCount();
      const ref = firebase.firestore().collection('users').doc(this.state.userName);
      return ref.get().then(doc => {
        if (doc.exists) {
          let data = doc.data()
          this.setState({firstName : data.firstName, lastName : data.lastName, photoURL:data.photoURL})
        } 
        else {
            console.error("No such user!");
        }
    })
        .catch(function (error) {
            console.error("Error getting user:", error);
        })
}

goToFollowers =() => {
  this.props.navigation.navigate({routeName: "Followers"})
}

goToFollowing = () => {
  this.props.navigation.navigate({routeName: "Following" })
}

goToMessages = () => {
  this.props.navigation.navigate({routeName:"Messages"})
}



setFollowerAndFollowingCount = () =>{

  const ref  = firebase.firestore().collection("users").doc(this.state.userName).collection('following')
  const ref2  = firebase.firestore().collection("users").doc(this.state.userName).collection('followers')
  followerCount = 0 
  followingCount = 0 
  ref.onSnapshot((querySnapshot)=>{
    querySnapshot.forEach((doc)=> {
      followerCount +=1
    })
    this.setState({Following:followerCount})
  })


  ref2.onSnapshot((querySnapshot)=>{
    querySnapshot.forEach((doc)=> {
      followingCount +=1
    })
    this.setState({Followers:followingCount})
  })
  
}



render() {
  return (

    <View style={styles.container}>
        <Header>
        <View style={{ justifyContent: 'center', flex: 3, alignItems: 'center', paddingRight: 45 }}>
            <Title>Pal Search</Title>
        </View>
        <Right>
        <TouchableOpacity
            style={{ paddingLeft: 0 }}
            onPress = {() => this.goToMessages()}
        >
            <MaterialIcons
                name='message'
                color='white'
                size={35}
                style={{ padding: 10 }}
                underlayColor='transparent'
            />
        </TouchableOpacity>
        </Right>
    </Header>
        <View style={styles.header}></View>
        <Image style={styles.avatar} source={{uri:this.state.photoURL}}/>
        <View style={styles.body}>
          <View style={styles.bodyContent}>
          <Text style={styles.name}> {this.state.userName}</Text>
          <Text style={styles.info}>{this.state.firstName} {this.state.lastName}</Text> 
        
          <View style={{flexDirection: "row"}}>
          <Button style={{ flex: 1, alignItems: 'flex-start', paddingLeft: 10 }}
                  onPress = {() => this.goToFollowers()}>
          <Text style={styles.info}>Followers {this.state.Followers}</Text>
          </Button>
          
          <Button style={{ flex: 1, alignItems: 'flex-end', paddingLeft: 10 }}
                  onPress = {() => this.goToFollowing()}>
          <Text style={styles.info}>Following {this.state.Following}</Text>
          </Button>
          </View>
          </View>
      </View>
    </View>
  );
}

}


const styles = StyleSheet.create({
header:{
  backgroundColor: "#000FFF",
  height:200,
},
avatar: {
  width: 130,
  height: 130,
  borderRadius: 63,
  borderWidth: 4,
  borderColor: "white",
  marginBottom:10,
  alignSelf:'center',
  position: 'absolute',
  marginTop:130
},
name:{
  fontSize:22,
  color:"#FFFFFF",
  fontWeight:'600',
},
body:{
  marginTop:40,
},
bodyContent: {
  flex: 1,
  alignItems: 'center',
  padding:30,
},
name:{
  fontSize:28,
  color: "#696969",
  fontWeight: "600"
},
info:{
  fontSize:16,
  color: "#00BFFF",
  marginTop:10
},
description:{
  fontSize:16,
  color: "#696969",
  marginTop:10,
  textAlign: 'center'
},
buttonContainer: {
  marginTop:10,
  height:45,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom:20,
  width:250,
  borderRadius:30,
  backgroundColor: "#00BFFF",
},
});
