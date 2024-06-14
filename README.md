# cliqueof10

## Setup Firebase

- Create a Firebase project in the Firebase Console.
- Get your Firebase config credentials.

### Steps to Get This Configuration

#### server

Go to Firebase Console:

- Open the Firebase Console.
- Select your project.
- Open project settings.
- Go to the "Service accounts" tab.
- Click on "Generate new private key". This will download a JSON file containing your Firebase project credentials.

#### client

Go to Firebase Console:

- Open the Firebase Console.
- Select your project.
- Open project settings.
- Go to the "General" tab.
- Scroll down to "Your apps"
- Copy `const firebaseConfig`

## Setup Cliqueof10 App

- Clone the githib repository (https://github.com/lesansley/cliqueof10.git) to your loacal machine.
- Run `npm install` in the `client` and `server` folders.

## Setup environemental variables

### client

Create a .env file in the root folder.

```txt
REACT_APP_FIREBASE_APIKEY = <apiKey>
REACT_APP_FIREBASE_AUTHDOMAIN = <authDomain>
REACT_APP_FIREBASE_PROJECT_ID = <projectId>
REACT_APP_FIREBASE_STORAGE_BUCKET = <storageBucket>
REACT_APP_FIREBASE_DATABASE_URL = <databaseURL>
REACT_APP_FIREBASE_MESSAGING_SENDER_ID = <messagingSenderId>
REACT_APP_FIREBASE_APP_ID = <appId>
REACT_APP_SERVER_URL=<url>
```

### server

Create a .env file in the root folder.

```txt
FIREBASE_APIKEY = <apiKey>
FIREBASE_AUTHDOMAIN = <authDomain>
FIREBASE_PROJECT_ID = <projectId>
FIREBASE_STORAGE_BUCKET = <storageBucket>
FIREBASE_MESSAGING_SENDER_ID = <messagingSenderId>
FIREBASE_APP_ID = <appId>
FIREBASE_MEASUREMENT_ID = "G-P9LMFXL211"
FIREBASE_DATABASE_URL = <databaseURL>
FIREBASE_TYPE = <type>
FIREBASE_PRIVATE_KEY_ID = <private_key_id>
FIREBASE_PRIVATE_KEY = <private_key>
FIREBASE_CLIENT_EMAIL = <client_email>
FIREBASE_CLIENT_ID = <client_id>
FIREBASE_AUTH_URI = <auth_uri>
FIREBASE_TOKEN_URI = <token_uri>
FIREBASE_AUTH_PROVIDER_X509_CERT_URL = <auth_provider_x509_cert_url>
FIREBASE_CLIENT_X509_CERT_URL = <client_x509_cert_url>
FIREBASE_UNIVERSE_DOMAIN = <universe_domain>
PORT = <port>
```

Navigate into `server` folder
Run `npm start` to initialise the projects.
Default url is `http:localhost:3000`

Navigate into `client` folder
Run `npm start` to initialise the projects.
Default url is `http:localhost:3001`

Users are able to:

- register
- login
- update profile
- add hobbies
- see potential friends
- submit friend requests
- accept friend request
- reject friend requests
- initiate chats with friends
- remove friends

Potential friends are presented on the basis of having two or more interests in common.

An admin dashboard (`/admin`) allows basic management of users. No access control has been implemented on this.
