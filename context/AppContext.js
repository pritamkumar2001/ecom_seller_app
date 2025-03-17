import React, { createContext, useState, useEffect } from 'react';
import { publicAxiosRequest } from "../src/services/HttpMethod";
import { loginURL } from "../src/services/ConstantServies";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCompanyInfo } from '../src/services/authServices';
import axios from "axios";
import { useRouter } from 'expo-router';
import NetInfo from '@react-native-community/netinfo';
import NetworkErrorModal from '../src/components/NetworkErrorModal';

const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [companyInfo, setCompanyInfo] = useState(null);
    const [dbName, setDbName] = useState(null);
    const [isConnected, setIsConnected] = useState(true);

    const router = useRouter();

    const checkNetwork = async () => {
        const netState = await NetInfo.fetch();
        setIsConnected(netState.isConnected);
        return netState.isConnected;
    };
    const onRetry = async () => {
        const networkStatus = await checkNetwork();
        if (networkStatus) {
            setIsConnected(true); // Update state to reflect network restoration
        }
    };
    

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        return () => unsubscribe();
    }, []);

    const login = async (username, password) => {
        setIsLoading(true);
        if (!isConnected) {
            setIsLoading(false);
            return;
        }

        try {
            if (!username.includes("@")) {
                const userDetailResponse = await axios.get(`https://www.atomwalk.com/api/get_user_detail/?user_id=${username}`);
                username = userDetailResponse.data.username;
            }
            const res = await publicAxiosRequest.post(loginURL, { username, password });
            const userToken = res.data['key'];
            await AsyncStorage.multiSet([
                ['userToken', userToken],
                ['Password', password],
                ['username', username],
            ]);
            setUserToken(userToken);
            router.replace({ pathname: 'home' });
        } catch (err) {
            console.log('Login error:', err);
        }

        try {
            const res = await getCompanyInfo();
            const companyInfo = res.data;
            const db_name = companyInfo.db_name.substr(3);
            await AsyncStorage.multiSet([
                ['companyInfo', JSON.stringify(companyInfo)],
                ['dbName', db_name],
            ]);
            setCompanyInfo(companyInfo);
            setDbName(db_name);
        } catch (error) {
            console.log('Company Info Fetch Error:', error);
        }

        setIsLoading(false);
    };

    const logout = async () => {
        setIsLoading(true);
        await AsyncStorage.clear();
        setUserToken(null);
        setCompanyInfo(null);
        setDbName(null);
        setIsLoading(false);
        router.replace('AuthScreen');
    };

    const isLoggedIn = async () => {
        const networkStatus = await checkNetwork();
        if (!networkStatus) {
            return;
        }

        try {
            setIsLoading(true);
            const userToken = await AsyncStorage.getItem('userToken');
            if (!userToken) {
                router.replace('AuthScreen');
                return;
            }
            setUserToken(userToken);
            const dbName = await AsyncStorage.getItem('dbName');
            setDbName(dbName);
            const storedCompanyInfo = await AsyncStorage.getItem('companyInfo');
            if (storedCompanyInfo) {
                setCompanyInfo(JSON.parse(storedCompanyInfo));
            }
        } catch (e) {
            console.log('Login Status Error:', e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AppContext.Provider value={{
            login,
            logout,
            isLoading,
            userToken,
            companyInfo,
            dbName,
            isConnected,
            checkNetwork,
            setIsLoading
        }}>
            {children}
            {/* Show Network Error Modal only when disconnected */}
            <NetworkErrorModal 
                visible={!isConnected} 
                onRetry={onRetry} 
                onNetworkRestore={() => setIsConnected(true)} 
            />

        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };
