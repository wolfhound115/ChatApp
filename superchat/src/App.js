import React from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore' // Database
import 'firebase/compat/auth' // User Auth

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useState } from 'react'

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
  const [user] = useAuthState(auth);


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
  console.log("Render sign in")
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
  console.log("Render chat room")

  // react will re-render whenever this obj of messages changes
  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault(); // prevents default page refresh when form submitted
    const {uid, photoURL} = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue(''); // reset form value

  }

  /*
  in project > firestore > rules

  rules_version = '2';

  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if false;
      }
    }
  }

  change to 
  
  rules_version = '2';

  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if request.auth.uid!=null;
      }
    }
  }
  */
 
  return (
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
      </div>

      <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>

      <button type="submit">🫡</button>


      </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  
  return <div className={`message ${messageClass}`}>
    <img src={photoURL} />
    <p>{text}</p>
  </div>

}

export default App;
