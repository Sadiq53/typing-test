importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyDlfICp8aysfMWNzW4OM1SYWTC5HLUnh0w",
    authDomain: "typing-test-57f38.firebaseapp.com",
    projectId: "typing-test-57f38",
    storageBucket: "typing-test-57f38.appspot.com", // Note: This should be `.appspot.com` for storage
    messagingSenderId: "28188305393",
    appId: "1:28188305393:web:1e78d187ece6867f358650",
    measurementId: "G-LF6LEW1HXE"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "./aasets/images/logo 2.svg"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
