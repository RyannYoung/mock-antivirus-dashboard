import React, {useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleInfo, faFileDownload, faRefresh} from "@fortawesome/free-solid-svg-icons";
import {MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import {FilterTable} from "../Components/FilterTable/FilterTable";
import {child, getDatabase, ref, get} from "firebase/database";

function Footer() {
    return <div
        className="flex h-32 px-56 bg-gradient-to-r from-admin-slate-dark to-admin-slate items-center justify-between">
        <h1 className="text-2xl text-admin-white">Device Enumeration
            Dashboard</h1>
        <FontAwesomeIcon
            className="text-white text-2xl mr-24 hover:cursor-pointer hover:text-orange-dark transition ease-in"
            icon={faCircleInfo}/>
    </div>;
}

const Devices = () => {


    const [data, setData] = useState(useLocation().state)
    const [ipData, setIpData] = useState("")

    useEffect(() => {
        fetch("http://ip-api.com/json/" + data.snapshotData.externalIp)
            .then(res => res.json())
            .then(result => {
                setIpData(result)
            })
    }, [])

    return <div className="flex bg-gray-200 flex-col scrollbar-thumb-blue-900 background-custom">

        {/* Background */}
        <div className="absolute bg-blue-300">

        </div>

        {/* Header */}
        <div
            className="flex h-16 z-10 bg-gradient-to-r from-admin-slate-dark to-admin-slate border-b-white items-center justify-between drop-shadow-xl">
            <h1 className="text-2xl text-admin-white border-l-dark-blue ml-24 text-white">Device Enumeration
                Dashboard</h1>
            <div className="flex items-center">
                <Link to={"/"}>
                    <button
                        className="text-admin-white bg-admin-red mx-8 px-6 py-2 rounded shadow-md transition ease-in hover:bg-admin-red-dark">
                        Device List
                    </button>
                </Link>
                <FontAwesomeIcon
                    className="text-white text-2xl mr-24 hover:cursor-pointer hover:text-admin-red-dark transition ease-in"
                    icon={faCircleInfo}/>
            </div>
        </div>


        <div className="flex z-10">
            <div
                className="flex w-full mt-16 ml-16 mr-16 p-8 bg-white rounded-md shadow-md hover:shadow-lg transition ease-in">
                {/* Device Header */}
                <div className="flex flex-col basis-1/2">
                    <span className="text-3xl font-bold text-admin-slate-dark">Device -<span
                        className="font-normal ml-2">{data.uniqueId}</span></span>
                    <span
                        className="text-lg font-bold text-admin-slate">Snapshot date: <span>{new Date(data.snapshotData.snapshotDate.time).toLocaleString()}</span></span>
                    <span
                        className="text-lg font-bold text-admin-slate">Last known IP: <span>{data.snapshotData.externalIp}</span></span>
                    <span
                        className="text-lg font-bold text-admin-slate">Location: <span>{ipData.city}, {ipData.region}, {ipData.country}</span></span>
                    <span className="text-lg font-bold text-admin-slate">ISP: <span>{ipData.isp}</span></span>
                    <div className="flex items-center mt-4">
                        <input
                            className="shadow appearance-none border border-admin-blue border-2 basis-4/12 rounded py-2 pl-4 text-gray-700 focus:outline-none focus:shadow-outline"
                            placeholder="Remote command"/>
                        <button
                            onClick={() => alert("Not Implemented")}
                            className="px-4 mx-2 basis-2/12 py-2 rounded text-white shadow-md bg-admin-blue hover:bg-admin-blue-dark transition duration-100"
                        >Execute
                        </button>
                    </div>

                    <div className="flex mt-4">
                        <a
                            className="py-2 px-4 basis-1/4 rounded text-white shadow-md border-white border-separate text-center bg-admin-red hover:bg-admin-red-dark transition duration-100"
                            type="button"
                            href={`data:text/json;charset=utf-8,${encodeURIComponent(
                                JSON.stringify(data)
                            )}`}
                            download="data.json"
                        >
                            <FontAwesomeIcon className="mr-2" icon={faFileDownload}/>
                            Download JSON
                        </a>
                        <button
                            onClick={() => {
                                const dbRef = ref(getDatabase());
                                get(child(dbRef, "/")).then((snapshot) => {
                                    if (snapshot.exists()) {
                                        setData(snapshot.val().Devices[data.uniqueId])
                                    } else {
                                        console.log("No data available");
                                    }
                                }).catch((error) => {
                                    console.error(error);
                                });
                            }}
                            className="px-4 py-2 mx-2 basis-1/4 rounded text-white shadow-md bg-admin-red hover:bg-admin-red-dark transition duration-100"
                        >
                            <FontAwesomeIcon className="mr-2" icon={faRefresh}/>
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Map */}
                <div className="shadow-lg basis-1/2 rounded-md border-2 border-admin-slate-dark overflow-hidden">
                    {ipData.lat ? <MapContainer center={[ipData.lat, ipData.lon]} zoom={13} className="h-full w-full"
                                                scrollWheelZoom={false}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[51.505, -0.09]}>
                                <Popup>
                                    A pretty CSS3 popup. <br/> Easily customizable.
                                </Popup>
                            </Marker>
                        </MapContainer> :
                        <div className="w-full h-full animate-pulse bg-blue-50 flex justify-center items-center"><span
                            className>Loading Map...</span></div>}
                </div>
            </div>
        </div>

        {/* Row 1 */}
        <div className="flex m-8 z-10">
            {/* Device */}
            <div
                className="flex flex-col basis-1/4 m-8 bg-white p-8 shadow-md rounded-md hover:shadow-lg transition ease-in">
                <h1 className="text-3xl font-bold text-dark-blue mb-2">
                    Build Summary
                </h1>
                <p className="text-admin-blue">Device hardware related information collected through the <code>Build</code> class in Android</p>
                <table
                    className="table-fixed flex flex-col grow rounded-md overflow-hidden text-sm w-full border-2 border-admin-slate-dark mt-2">
                    {data.buildData.buildItemList.map(item => {
                        return <div className="flex h-full items-center grow">
                            <div className="bg-admin-slate h-full px-4 max-w-[10rem] py-2 text-white basis-5/12">
                                {item.title}
                            </div>
                            <div className="flex-1 px-4 basis-7/12 overflow-x-hidden truncate">
                                {item.description}
                            </div>
                        </div>

                        //
                        // <p><span className="font-bold text-dark-blue">{item.title}:</span><span
                        //     className="ml-2">{item.description.length < 40 ? item.description : item.description.substring(0, 30)}</span>
                        // </p>
                    })}
                </table>

            </div>

            {/* Applications */}
            <div
                className="grow basis-3/4 m-8 p-8 bg-white shadow-md rounded-md flex flex-col flex-wrap hover:shadow-lg transition ease-in">
                <h1 className="text-3xl font-bold text-dark-blue mb-2">Installed Applications</h1>
                <div className="my-2">
                    <p className="text-admin-blue">A collection of all the installed applications on the target device. This includes both system and user based applications</p>
                </div>
                <div className="flex mb-2 gap-4">
                    <div className="px-4 py-2 bg-admin-purple text-admin-white text-xs rounded-md shadow">
                        <span className="mr-1">Application Items:</span>
                        <span>{data.appData.appCount}</span>
                    </div>

                    <div className="px-4 py-2 bg-admin-purple text-admin-white text-xs rounded-md shadow">
                        <span className="mr-1">System Installed:</span>
                        <span>{data.appData.systemCount}</span>
                    </div>

                    <div className="px-4 py-2 bg-admin-purple text-admin-white text-xs rounded-md shadow">
                        <span className="mr-1">User Installed:</span>
                        <span>{data.appData.userCount}</span>
                    </div>
                </div>

                <FilterTable
                    columns={[
                        {
                            Header: 'App Type',
                            accessor: 'appType'
                        }, {
                            Header: 'SDK',
                            accessor: 'compileSdkVersionCodename'
                        }, {
                            Header: 'Directory',
                            accessor: 'dataDir'
                        }, {
                            Header: 'Package Name',
                            accessor: 'packageName'
                        }
                    ]}

                    data={data.appData.applicationItems}
                />
            </div>
        </div>

        {/* Row 2 */}
        <div className="flex ml-16 mr-16 mb-16">
            <div className="grow bg-white p-8 shadow-md hover:shadow-lg transition ease-in rounded-md">
                <div className="mb-2">
                    <h1 className="text-3xl font-bold text-dark-blue mb-2">
                        Device Files
                    </h1>
                    <p className="text-admin-blue">All files found on the user's device if the <code>MANAGE_ALL_FILES</code> permission is granted (including hidden files).</p>

                    <div className="flex gap-4 mt-2">

                        <div className="px-4 py-2 bg-admin-purple text-admin-white text-xs w-fit rounded-md shadow">
                            <span className="mr-1">File Count:</span>
                            <span>{data.storageData.fileCount}</span>
                        </div>

                        <div className="px-4 py-2 bg-admin-purple text-admin-white text-xs rounded-md shadow">
                            <span className="mr-1">Storage Used:</span>
                            <span>{(data.storageData.megAvailable / 1024).toFixed(2)}GB / {(data.storageData.megTotal / 1024).toFixed(2)}GB</span>
                        </div>

                        <div className="px-4 py-2 bg-admin-purple text-admin-white text-xs rounded-md shadow">
                            <span className="mr-1">Percentage Utilised: </span>
                            <span>{(data.storageData.percentage * 100).toFixed(2)}%</span>
                        </div>
                    </div>
                </div>

                <FilterTable
                    columns={[
                        {
                            Header: 'Last Modified',
                            accessor: row => {
                                return new Date(row.lastModified.time).toLocaleString()
                            }
                        }, {
                            Header: 'Name',
                            accessor: 'fileName'
                        }, {
                            Header: 'Hidden',
                            accessor: row => {
                                return row.isHidden.toString()
                            }
                        }, {
                            Header: 'Path',
                            accessor: 'filePath'
                        }
                    ]}

                    data={data.storageData.storageItems}
                />
            </div>
        </div>

        {/* Row 3 */}
        <div className="flex mb-16">
            {/* Bluetooth */}
            <div
                className="grow mr-16 basis-5/12 ml-16 bg-white p-8 shadow-md rounded-md hover:shadow-lg transition ease-in">
                <h1 className="text-3xl font-bold text-dark-blue mb-2">
                    Bluetooth Devices
                </h1>
                <p className="text-admin-blue">All bluetooth signals detected on the device during the 5-sec interval of the snapshot</p>

                <div className="h-96 overflow-y-scroll rounded-md border-2 border-admin-slate-dark mt-2">
                    <table className="table overflow-y-scroll table-fixed w-full">
                        <th className="bg-admin-slate-dark py-2 sticky top-0 text-white font-normal">Address</th>
                        <th className="bg-admin-slate-dark py-2 sticky top-0 text-white font-normal">Name</th>

                        {data.btData.bluetoothItems.map(item => {
                            return <tr>
                                <td className="px-4 truncate">{item.address}</td>
                                <td className="px-4 truncate">{item.name ? item.name : "Unknown"}</td>
                            </tr>
                        })}
                    </table>
                </div>
            </div>

            {/* Wi-Fi */}
            <div className="flex flex-col grow mr-16 basis-1/2 bg-white p-8 shadow-md hover:shadow-lg transition ease-in rounded-md">
                <h1 className="text-3xl font-bold text-dark-blue mb-2">
                    Nearby Scanned Wi-Fi
                </h1>
                <p className="text-admin-blue mb-2">All wifi signals detected on the device during the 5-sec interval of the snapshot</p>

                <div className="flex overflow-y-scroll h-96 rounded-md overflow-hidden border-2 border-admin-slate-dark mt-auto">
                    <table className="table table-fixed overflow-scroll w-full h-full">
                        <th className="bg-admin-slate-dark sticky p-2 top-0 text-admin-white font-normal">DBM</th>
                        <th className="bg-admin-slate-dark sticky p-2 top-0 text-admin-white font-normal">SSID</th>
                        <th className="bg-admin-slate-dark sticky top-0  p-2 text-admin-white font-normal">BSSID</th>

                        {data.wifiData.wifiItems.map(item => {
                            return <tr className="text-sm truncate">
                                <td className="px-4 truncate">{item.dbm}</td>
                                <td className="px-4 truncate">{item.ssid}</td>
                                <td className="px-4 truncate">{item.bssid}</td>
                            </tr>
                        })}
                    </table>
                </div>

            </div>

            {/* Process */}
            <div className="flex flex-col grow mr-16 basis-5/12 bg-white p-8 shadow-md hover:shadow-lg transition ease-in rounded-md">
                <h1 className="text-3xl font-bold text-dark-blue mb-2">
                    Processes
                </h1>
                <p className="text-admin-blue mb-2">All currently active running process on the device. Note: This feature has been locked down in Android API 29</p>
                <div className="flex overflow-y-scroll h-96 rounded-md overflow-hidden border-2 border-admin-slate-dark mt-auto bg-blue">
                    <table className="table table-fixed overflow-y-hidden w-full h-fit">
                        <th className="bg-admin-slate-dark sticky w-2/12 p-2 top-0 text-white font-normal">ID</th>
                        <th className="bg-admin-slate-dark sticky w-6/12 p-2 top-0 text-white font-normal">Name</th>
                        <th className="bg-admin-slate-dark sticky w-2/12 p-2 top-0 text-white font-normal">UID</th>
                        <th className="bg-admin-slate-dark sticky w-2/12 p-2 top-0 text-white font-normal">Imp.</th>

                        {data.procData.processItems.map(item => {
                            return <tr className=" text-sm truncate">
                                <td className="px-4 truncate">{item.pid}</td>
                                <td className="px-4 truncate">{item.processName}</td>
                                <td className="px-4 truncate">{item.uid}</td>
                                <td className="px-4 truncate">{item.importance}</td>
                            </tr>
                        })}
                    </table>
                </div>

            </div>

        </div>

        {/* Footer */}
        <Footer/>

    </div>;
};

Devices.propTypes = {};

export default Devices;