'use strict';

// Function to convert base64 to Uint8Array for applicationServerKey
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

function setCookie(cname, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + value + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

const serviceWorkerPath = '/assets/push/service-worker.js?v=' + (+ new Date());

async function checkAndRequestPermission() {
    if (typeof Notification !== "function" || Notification.permission == 'denied') {
        console.log('Notification not allowed or denied');
        return;
    }

    if (Notification.permission == 'default') {
        // Yeu cau quyen push
        let granted = await requestPushPermission();
        if (!granted) {
            console.warn('user denied push permission');
            return;
        }
    }

    // Da cho phep, tien hanh dang ky push
    // console.log('access granted');
    registerServiceWorker().then(async () => {
        var subscription = await subscribeUserToPush(vapidPublicKey);

        var subscriptionJson = JSON.parse(JSON.stringify(subscription));

        // So sanh voi cookie, neu trung khop thi ko gui len sv nua
        const cookie = getCookie('sub_endpoint');
        if (cookie != subscriptionJson.endpoint) {
            setCookie('sub_endpoint', subscriptionJson.endpoint, 1);
        }
    }).catch(err => {
        console.log('registerServiceWorker error', err);
    });
}

checkAndRequestPermission().then();

function registerServiceWorker() {
    return navigator.serviceWorker
        .register(serviceWorkerPath)
        .then(function (registration) {
            // console.log('Service worker successfully registered.');
            return registration;
        })
        .catch(function (err) {
            console.warn('Unable to register service worker.', err);
            throw err;
        });
}

function waitMs(ms) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve();
        }, ms);
    })
}

function subscribeUserToPush(vapidPublicKey) {
    return navigator.serviceWorker
        .register(serviceWorkerPath)
        .then(async function (registration) {
            // console.log('subscribeUserToPush, waiting until activated');

            // wait until ready
            while (!(registration.active && registration.active.state == 'activated')) await waitMs(500);

            const subscribeOptions = {
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
            };

            return registration.pushManager.subscribe(subscribeOptions);
        });
}

function requestPushPermission() {
    return navigator.serviceWorker
        .register(serviceWorkerPath)
        .then(() => {
            return Notification.requestPermission();
        })
        .then(permission => {
            return permission === 'granted';
        })
}
