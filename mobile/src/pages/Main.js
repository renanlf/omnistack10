import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import api from '../services/api';
import { subscribeToNewDevs, disconnect, connect } from '../services/socket';


function Main({ navigation }){
    const [ currentRegion, setCurrentRegion ] = useState(null);
    const [ devs, setDevs ] = useState([]);

    const [ techs, setTechs ] = useState('');

    useEffect(() => {
        async function loadInitialPosition(){
            const { granted } = await requestPermissionsAsync();

            if(granted){
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true,
                });

                const { latitude, longitude } = coords;

                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04,
                });
            }
        }

        loadInitialPosition();
    }, []);

    useEffect(() => {
        subscribeToNewDevs((dev) => setDevs([...devs, dev]));
    }, [devs]);

    function setupWebSocket(){
        disconnect();

        const { latitude, longitude } = currentRegion;

        connect(latitude, longitude, techs);
    }

    async function loadDevs(){
        const { latitude, longitude } = currentRegion;

        const response = await api.get('/search', {
            params : {
                latitude,
                longitude,
                techs,
            }
        });

        setDevs(response.data.devs);
        setupWebSocket();
    }

    function handleChangeRegion(region) {
        setCurrentRegion(region);
    }

    if(!currentRegion){
        return null;
    }

    // para carregar os devs assim que o app abrir
    loadDevs();

    return (
        <>
            <MapView
                onRegionChangeComplete={handleChangeRegion}
                initialRegion={currentRegion} 
                style={styles.map}
            >
                {devs.map(dev => (
                    <Marker 
                        key={dev._id} 
                        coordinate={{ 
                            latitude  : dev.location.coordinates[1], 
                            longitude : dev.location.coordinates[0] }}
                    >
                        <Image style={styles.avatar} source={{ uri:  dev.avatar_url}} />
                        <Callout onPress={() => {
                            navigation.navigate('Profile', { 
                                github_username: dev.github_username,
                                email: dev.email,
                            })
                        }}>
                            <View style={styles.callout}>
                                <Text style={styles.devName}>{dev.name}</Text>
                                <Text style={styles.devBio}>{dev.bio}</Text>
                                <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
            <View style={styles.searchForm}>
                <TextInput 
                    style={styles.searchInput} 
                    placeholder='Buscar devs por techs...'
                    placeholderTextColor='#999999'
                    autoCapitalize='words'
                    autoCorrect={false}
                    value={techs}
                    onChangeText={setTechs}
                />
                <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
                    <MaterialIcons name='my-location' size={20} color='#ffffff'/>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    searchForm: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: "row"
    },
    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#FFFFFF',
        color: '#333333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4,
        },
        elevation: 2
    },
    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: '#8e4dff',
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 15,
    },avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#7d40e7'
    },
    callout: {
        width: 260,
    },
    devName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    devTechs: {
        marginTop: 5,
    },
    devBio: {
        color: '#666666',
        marginTop: 5,
    },
});

export default Main;