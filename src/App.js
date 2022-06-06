import logo from './logo.svg';
import './App.css';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get, onValue } from "firebase/database";
import DataTable from "./Components/DataTable/DataTable";

const firebaseConfig = {
    apiKey: "AIzaSyAsb9BRX0hWovf0ETi6KsRi1vDIlPsGla8",
    authDomain: "device-enumeration.firebaseapp.com",
    databaseURL: "https://device-enumeration-default-rtdb.firebaseio.com",
    projectId: "device-enumeration",
    storageBucket: "device-enumeration.appspot.com",
    messagingSenderId: "1058751811590",
    appId: "1:1058751811590:web:c3ad2d5da68c4a50707387"
};

const app = initializeApp(firebaseConfig);


function App() {
    return (
      <div className="flex p-24 flex-col h-screen bg-gray-50">
          <h1 className="text-2xl font-sans text-center font-display">Device Dashboard</h1>
          <DataTable />
      </div>
  );
}

export default App;
