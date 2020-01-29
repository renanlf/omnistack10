import React from 'react';
import { TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';


function Profile({ navigation }){
    console.log(navigation);
    console.log(navigation.getParam('github_username'));
    const githubUsername = navigation.getParam('github_username');
    const email = navigation.getParam('email');

    return (<>
                <WebView 
                    style={{flex: 1}} 
                    source={{ uri: `https://github.com/${githubUsername}`}} 
                />
                <TouchableOpacity
                    style={styles.sendEmail}
                    disabled={!email}
                    onPress={() => Linking.openURL(`mailto:${email}`)} 
                >
                    <MaterialIcons name='email' size={20} color='#ffffff'/>
                </TouchableOpacity>
            </>);
}

const styles = StyleSheet.create({
    sendEmail: {
        width: 50,
        height: 50,
        backgroundColor: '#8e4dff',
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 15,
    }
});

export default Profile;