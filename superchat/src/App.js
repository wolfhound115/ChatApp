import React from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore' // Database
import 'firestore/auth' // User Auth

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

function App() {
  return (
    <div className="App">
      <header className="App-header">

      </header>
    </div>
  );
}

export default App;
