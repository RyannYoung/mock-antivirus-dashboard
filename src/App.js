import './App.css';
import {initializeApp} from "firebase/app";
import DataTable from "./Components/DataTable/DataTable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faChartLine,
    faClock, faClose,
    faCog, faCross,
    faHome, faInfo, faMagnifyingGlass,
    faMobile,
    faMobileAndroidAlt,
    faRefresh,
    faTable, faTrashCan, faVirus
} from "@fortawesome/free-solid-svg-icons";
import {faAndroid} from "@fortawesome/free-brands-svg-icons";
import SideButton from "./Components/SideButton";
import {useState} from "react";
import DataCard from "./Components/DataCard";
import {child, getDatabase, ref, remove, get} from "firebase/database";
import {useNavigate} from "react-router-dom"
import {Transition} from '@headlessui/react'

const firebaseConfig = {
    apiKey: "AIzaSyAsb9BRX0hWovf0ETi6KsRi1vDIlPsGla8",
    authDomain: "device-enumeration.firebaseapp.com",
    databaseURL: "https://device-enumeration-default-rtdb.firebaseio.com",
    projectId: "device-enumeration",
    storageBucket: "device-enumeration.appspot.com",
    messagingSenderId: "1058751811590",
    appId: "1:1058751811590:web:c3ad2d5da68c4a50707387"
};

initializeApp(firebaseConfig);

function App() {

    const [count, setCount] = useState(0);
    const [lastData, setLastDate] = useState();
    const [page, setPage] = useState(1); // 1 = Home, 2 = Device

    const [activeData, setActiveData] = useState(); // The active device to search

    const [isDel, setIsDel] = useState(false);

    const navigate = useNavigate();

    const getDevice = id => {
        let value = ''
        const dbRef = ref(getDatabase());
        get(child(dbRef, `Devices/${id}`))
            .then(snapshot => {
                if (snapshot.exists()) {
                    console.log("Win")
                    console.log(snapshot.val());
                    navigate.push('devices', snapshot.val())
                } else {
                    console.log("Error")
                }
            }).catch(error => {
            console.error(error);
        })
    }


    const pull_data = (data) => {
        setCount(data)
    }
    const pull_date = (data) => {
        setLastDate(data)
    }

    return (
        <div className="flex flex-col h-screen scrollbar bg-admin-white">

            <div className="absolute flex right-0 top-0 m-8 text-admin-white">
                <button
                    className="px-4 py-2 shadow-md bg-admin-red hover:bg-admin-red-dark transition duration-100 rounded-lg">
                    <FontAwesomeIcon className="mr-2" icon={faCog}/>
                    Settings
                </button>
            </div>

            {/* Navbar + Dashboard */}
            <div className="flex">
                <div className="h-screen flex flex-col max-w-xs text-white bg-admin-slate">
                    <h1 className="text-xl p-8 border-b border-b-admin-slate-dark">
                        <FontAwesomeIcon className="mr-2" icon={faVirus}/>
                        Mock Anti-virus Dashboard</h1>
                    <p className="px-4 py-2 mt-4 text-admin-white bold text-sm">PAGES</p>
                    <SideButton className="" name="Home" icon={faHome} selected/>
                    <SideButton name="Device List" icon={faTable}/>
                    <SideButton name="Active Device" icon={faMobile}/>

                    <p className="px-4 py-2 mt-4 text-admin-white bold text-sm">UTILITIES</p>
                    <button
                        className="px-4 py-2 my-1 shadow-md bg-admin-red hover:bg-admin-red-dark transition duration-100 mx-4 rounded-lg">
                        <FontAwesomeIcon className="mr-2" icon={faRefresh}/>
                        Refresh
                    </button>
                    <button
                        // todo: Add functionality
                        className="px-4 py-2 my-1 shadow-md bg-admin-red hover:bg-admin-red-dark transition duration-100 mx-4 rounded-lg">
                        <FontAwesomeIcon
                            className="mr-2" icon={faTrashCan}/>
                        Delete Data
                    </button>
                    <button
                        className="px-4 py-2 mx-4 my-1 shadow-md bg-admin-purple hover:bg-admin-red-dark transition duration-100 rounded-lg">
                        <FontAwesomeIcon className="mr-2" icon={faAndroid}/>
                        App Download Link
                    </button>

                    <p className="px-4 py-2 mt-4 text-admin-white bold text-sm">COMMANDS</p>

                    <div className="px-4 py-2 mt-2 flex flex-col bg-admin-slate-dark">
                        <span className="text-sm">Remove Single Device</span>
                        <div className="flex items-center">
                            <input id="removeSingleDevice"
                                   className="text-admin-slate-dark mx-2 my-2 px-4 py-2 rounded-md"
                                   placeholder="Device ID"/>
                            <button
                                onClick={() => {
                                    const item = document.getElementById("removeSingleDevice").value;
                                    const db = getDatabase();
                                    remove(ref(db, "Devices/" + item)).then(() => {
                                        setIsDel(true)
                                    })
                                }}
                                className="w-10 h-10 shadow-md bg-admin-red hover:bg-admin-red-dark transition duration-100 rounded-lg">
                                <FontAwesomeIcon icon={faTrashCan}/>
                            </button>
                        </div>

                        <Transition
                            show={isDel}
                            enter="transition-opacity duration-200"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity duration-150"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div
                                className={`flex items-center bg-admin-green transition text-white text-sm px-4 py-2 rounded-md`}
                                role="alert">
                                <FontAwesomeIcon className="mr-2 text-" icon={faInfo}/>
                                <p>Device has been deleted</p>
                                <FontAwesomeIcon onClick={()=>{setIsDel(false)}} className="ml-auto hover:cursor-pointer" icon={faClose}/>
                            </div>
                        </Transition>

                    </div>

                    <div className="px-4 py-2 mb-2 flex flex-col bg-admin-slate-dark transition ease-in">
                        <span className="text-sm">View Single Device<span
                            className="text-xs ml-1">(sets active device)</span></span>
                        <div className="flex items-center">
                            <input id="getDevicebyId" className="mx-2 my-2 px-4 py-2 rounded-md text-admin-slate-dark"
                                   placeholder="Device ID"/>

                            <button
                                onClick={() => {
                                    const inputRef = document.getElementById("getDevicebyId").value;
                                    getDevice(inputRef)
                                }}
                                className="w-10 h-10 shadow-md bg-admin-red hover:bg-admin-red-dark transition duration-100 rounded-lg">
                                <FontAwesomeIcon icon={faMagnifyingGlass}/>
                            </button>

                        </div>
                    </div>
                    <SideButton className="mt-auto" name="Settings" icon={faCog}/>
                    <p className="text-sm px-4 py-1 text-gray-400">made by ryan young</p>


                </div>

                <div className="w-10/12 flex flex-col">
                    <div className="basis-1/4 p-8">
                        <div className="mb-8">
                            <h1 className="text-4xl font-sans font-display font-semibold text-admin-slate">
                                <FontAwesomeIcon className="text-admin-green mr-2" icon={faChartLine}/>
                                Device
                                Dashboard</h1>
                            <p className="pt-2 font-display">A list of all the devices enumerated through the <span
                                className="font-bold text-admin-slate">mock anti-virus mobile application</span></p>
                            <div className="mt-4 text-admin-slate-dark">
                                <h3 className="font-bold">QRG Commands</h3>
                                <code className="mr-2">/></code>
                                <code className="select-all">firebase --project device-enumeration
                                    database:remove</code>
                            </div>
                        </div>

                        {/* Quick Summary Containers*/}
                        <div className="flex gap-4">

                            {/* Total Devices */}
                            <DataCard data={new Date(lastData).toLocaleTimeString()} icon={faClock}
                                      description="(last snapshot)"/>
                            <DataCard data={count} icon={faMobileAndroidAlt} description="total device(s)"/>

                        </div>


                    </div>
                    <hr/>
                    <div className="basis-3/4">
                        <h2 className="pt-8 pl-8 text-3xl text-admin-slate font-bold">
                            <FontAwesomeIcon className="mr-2 text-admin-green" icon={faTable}/>
                            Device Table</h2>

                        <DataTable func={pull_data} funcDate={pull_date}/>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default App;
