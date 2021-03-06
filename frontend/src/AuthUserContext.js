import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import ToastNotification from './components/ToastNotification/ToastNotification';

const socket = io('/');

export const UserContext = createContext();



const UserContextProvider = (props) => {

    const [user, setUser] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [dataToast, setDataToast] = useState({});

    const handleToast = (cash) => {
        setDataToast(cash);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false); 
            setDataToast({});
        }, 5000);
    }

    // when user changes, remove old subsription and add new
    useEffect(() => {

        // this might be overkill but why not
        const functionReference = handleToast;

        if (user) {

            socket.on(`transaction-${user._id}`, functionReference);
            registerPushNotifications();

        }

        return () => {

            if (user) {

                socket.off(`transaction-${user._id}`, functionReference)
                unregisterPushNotifications();

            }

        }

    }, [user]);

    const keepAuthUser = (newUser) => {

        setUser(newUser);

    }

    const destroyAuthUser = async () => {

        setUser('');

    }

    return (
        <UserContext.Provider value={{ user, keepAuthUser: keepAuthUser, destroyAuthUser: destroyAuthUser }}>
            {props.children}
            {showToast ? <ToastNotification data={dataToast} showMe={true} /> : null}
        </UserContext.Provider>
    );
}

async function registerPushNotifications() {

    if ('Notification' in window) {

        Notification.requestPermission(() => null);

    }

    if ('serviceWorker' in navigator) {

        const registration = await navigator.serviceWorker.getRegistration();

        const publicVapidKey = 'BPb93HRRyEZ00LbioKa_aoteLs3aE_PqabHPw0zskO6SDJ8ol0_wiyCrB4yL5QY2OJ9Q9tRYwj1vKQ59gK9Pa90';

        const subscription = await registration.pushManager.getSubscription() || await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });

        await fetch('/api/push-subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscription }),
        });

    }

}

async function unregisterPushNotifications() {

    if ('serviceWorker' in navigator) {

        const registration = await navigator.serviceWorker.getRegistration();

        if (registration) {

            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {

                subscription.unsubscribe();

                await fetch('/api/push-unsubscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ subscription }),
                });

            }

        }

    }

}

function urlBase64ToUint8Array(base64String) {

    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


export default UserContextProvider;


