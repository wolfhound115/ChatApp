import React from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore' // Database
import 'firestore/auth' // User Auth

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  // Config rom https://console.firebase.google.com/u/0/project/chat-app-a06b7/overview
  apiKey: "AIzaSyBwyBq6J0qUktcCsfPf-_1HEn71wa6EG5s",
  authDomain: "chat-app-a06b7.firebaseapp.com",
  projectId: "chat-app-a06b7",
  storageBucket: "chat-app-a06b7.appspot.com",
  messagingSenderId: "947244649506",
  appId: "1:947244649506:web:85a5ea6920ad0715678e7b",
  measurementId: "G-95RGBHLG0T"
})

// SDKs as global variables
const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  // if user signed in -> user is an obj
  // if user signed out -> user is null
  const [user] = userAuthState(auth);


  return (
    <div className="App">
      <header>

      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  
  return  (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {

  return auth.currentUser && (

    <button onClick={() => auth.SignOut()}>Sign Out</button>
  )
}

function ChatRoom(){

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(20);

  // react will re-render whenever this obj of messages changes
  const [messages] = userCollectionData(query, {idField: 'id'});

  return (
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
      </div>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid } = props.message;

  return <p>{text}</p>

}

export default App;
