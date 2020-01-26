import React from 'react';
import { WebView } from 'react-native-webview';


function Profile({ navigation }){
    console.log(navigation);
    console.log(navigation.getParam('github_username'));
    const githubUsername = navigation.getParam('github_username');

    return <WebView style={{flex: 1}} source={{ uri: `https://github.com/${githubUsername}`}} />
}

export default Profile;