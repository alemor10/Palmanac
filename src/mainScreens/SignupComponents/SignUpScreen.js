import React, { Component } from 'react';

import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import { Container, Header, Content, Body, Title, Form, Item, Input, Label, Button } from 'native-base';

import isEmail from "validator/lib/isEmail";

import firebase from 'react-native-firebase'


import {signUpToFirebase} from '../../firebase/firestoreAPI'




let password;

export default class SignUp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      disabled: true,
      formErrors: {
        userName: "",
        email: "",
        password: "",
        confPassword: "",
        loginError: ""
      }

    };

  }


  handleChange = e => {
    e.preventDefault();

    let formErrors = this.state.formErrors;
    const { name, value } = e.target;

    switch (name) {
        case "email":
            formErrors.email = isEmail(value)
                ? ""
                : "Invalid email address";
            break;
        case "password":
            formErrors.password =
                value.length < 6 ? "Minimum 6 characters required" : "";
            password = value;

            break;
        case "confPassword":
            formErrors.confPassword =
                password !== value
                    ? "Your password and confirmation password do not match"
                    : "";
            break;
        default:
            break;
    }
    this.setState({
      formErrors,
      [name]: value,
      disabled:
          formErrors.email ||
          !this.state.email ||
          (formErrors.password || !this.state.password) ||
          (formErrors.confPassword || !this.state.confPassword)
  });
};



  signUp = e => {
    e.preventDefault();
    const { email, password} = this.state;
    signUpToFirebase (email, password)
        .then(userCredential => {
            return userCredential.user
        })
        .then(async () => {
          this.props.navigation.navigate('GetUserInfo')
        })
        .catch(error => {
            this.setState(prevState => ({
                formErrors: {
                    ...prevState.formErrors,
                    loginError: error.message
                }
            }));
            console.error(this.state.formErrors.loginError);
        });
};



  render() {
    const { formErrors, disabled } = this.state;
    const { classes } = this.props;

    return (
      <Container style={styles.container}>
        <Header>
          <Body>
            <Title>Sign Up Screen</Title>
          </Body>
        </Header>
        <Content>
          <Form>
            <Item floatingLabel >
              <Label>Email</Label>
              <Input  onChangeText={(text)  => this.setState({ email: text })} 
                      value = {this.state.email}
                      onChange = {this.handleChange} 
              />
            </Item>
            <Item floatingLabel >
              <Label>Password</Label>
              <Input  onChangeText={(text)  => this.setState({ password: text })} 
                      value = {this.state.password}
                      onChange = {this.handleChange} 
              />
            </Item>
            <Item floatingLabel >
              <Label>Confirm Password</Label>
              <Input  onChangeText={(text)  => this.setState({ confirmPassword: text })} 
                      value = {this.state.confirmPassword}
                      onChange = {this.handleChange} 
              />
            </Item>
            <Button block style={styles.buttons} onPress = {this.signUp}>
              <Text>Register</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({

  buttons: {
    margin: 10
  }
});