/*
 *
 *  Push Notifications codelab
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

// Version 0.1

'use strict';

// console.log('Started', self);

self.addEventListener('install', function(event) {
    //self.skipWaiting();
    // console.log('Installed', event);
});

self.addEventListener('activate', function(event) {
    // console.log('Activated', event);
});

self.addEventListener('push', function(event) {
    // Read json data from push event
    const pushPayload = event.data.json();
    console.log(pushPayload)

    const notifyOptions = {
        body: pushPayload.body,
        icon: pushPayload.icon,
        tag: pushPayload.tag,
        data: pushPayload.data,
    }

    if (pushPayload.image) notifyOptions.image = pushPayload.image;

    event.waitUntil(
        self.registration.showNotification(pushPayload.title, notifyOptions)
    );
});

self.addEventListener('notificationclick', function(event) {
    const notification = event.notification;
    const targetUrl = notification.data.url;

    console.log('On notification click: ', notification);
    // Android doesn't close the notification when you click on it
    // See: http://crbug.com/463146
    event.notification.close();

    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(
        clients.matchAll({
            type: "window"
        })
            .then(function(clientList) {
                for (var i = 0; i < clientList.length; i++) {
                    var client = clientList[i];
                    if (client.url == targetUrl && 'focus' in client) return client.focus();
                }
                if (clients.openWindow) {
                    return clients.openWindow(targetUrl);
                }
            })
    );
});