import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Link, useLocation} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleInfo, faInfo} from "@fortawesome/free-solid-svg-icons";
import {MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import {FilterTable} from "../Components/FilterTable/FilterTable";
import {child, getDatabase, ref, get} from "firebase/database";

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

    return (<div className="flex bg-gray-200 flex-col scrollbar-thumb-blue-900 background-custom">

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
            <div className="flex w-full mt-16 ml-16 mr-16 p-8 bg-white rounded-md shadow-md hover:shadow-lg transition ease-in">
                {/* Device Header */}
                <div className="flex flex-col basis-1/2">
                    <span className="text-3xl font-bold text-admin-slate-dark">Device -<span
                        className="font-normal ml-2">{data.uniqueId}</span></span>
                    <span
                        className="text-lg font-bold text-admin-slate">Snapshot date: <span>{new Date(data.snapshotData.snapshotDate.time).toLocaleString()}</span></span>
                    <span className="text-lg font-bold text-admin-slate">Last known IP: <span>{data.snapshotData.externalIp}</span></span>
                    <span
                        className="text-lg font-bold text-admin-slate">Location: <span>{ipData.city}, {ipData.region}, {ipData.country}</span></span>
                    <span className="text-lg font-bold text-admin-slate">ISP: <span>{ipData.isp}</span></span>
                    <div className="flex items-center mt-4">
                        <input
                            className="shadow appearance-none border border-admin-blue border-2 basis-6/12 rounded py-2 pl-4 text-gray-700 focus:outline-none focus:shadow-outline"
                            placeholder="Remote command"/>
                        <button
                            onClick={()=> alert("Not Implemented")}
                            className="px-4 mx-2 basis-2/12 py-2 rounded text-white shadow-md bg-admin-blue hover:bg-admin-red-dark transition duration-100"
                        >Execute
                        </button>
                    </div>

                    <div className="flex mt-4">
                        <a
                            className="py-2 px-4 basis-4/12 rounded text-white shadow-md border-white border-separate text-center bg-admin-red hover:bg-admin-red-dark transition duration-100"
                            type="button"
                            href={`data:text/json;charset=utf-8,${encodeURIComponent(
                                JSON.stringify(data)
                            )}`}
                            download="data.json"
                        >
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
                            className="px-4 py-2 basis-4/12 mx-2 rounded text-white shadow-md bg-admin-red hover:bg-admin-red-dark transition duration-100"
                        >Refresh
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
            <div className="flex flex-col basis-1/4 m-8 bg-white p-8 shadow-md rounded-md hover:shadow-lg transition ease-in">
                <h1 className="text-3xl font-bold text-dark-blue mb-2">
                    Build Summary
                </h1>
                <p className="text-orange-900">A summary of all the basic build details from the device</p>
                <table className="table-fixed flex flex-col grow rounded-md overflow-hidden text-sm w-full border-2 border-admin-slate-dark mt-2">
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
                    <p className="text-orange-900">A list of installed applications enumerated through the device. This
                        includes both system and user installed applications</p>
                </div>
                <div className="flex mb-2">
                    <p><span className="font-bold text-dark-blue">Application Items:</span><span
                        className="ml-2 mr-4">{data.appData.appCount}</span></p>
                    <p><span className="font-bold text-dark-blue">User Installed:</span><span
                        className="ml-2 mr-4">{data.appData.systemCount}</span></p>
                    <p><span className="font-bold text-dark-blue">System Installed:</span><span
                        className="ml-2 mr-4">{data.appData.userCount}</span></p>
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
            <div className="grow bg-white p-8 shadow-md hover:shadow-lg transition ease-in">
                <div className="mb-2">
                    <h1 className="text-3xl font-bold text-dark-blue mb-2">
                        Device Files
                    </h1>
                    <div className="flex flex-col">
                        <p>
                            <span className="font-bold text-dark-blue">File Count:</span>
                            <span className="ml-2">{data.storageData.fileCount}</span>
                        </p>
                        <p>
                            <span className="font-bold text-dark-blue">Storage Space:</span>
                            <span className="ml-2">
                                    {(data.storageData.megAvailable / 1024).toFixed(2)}GB/
                                {(data.storageData.megTotal / 1024).toFixed(2)}GB
                                    <span
                                        className="ml-2">({(data.storageData.percentage * 100).toFixed(2)}% full)</span>
                                </span>
                        </p>
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
            <div className="grow mr-16 basis-5/12 ml-16 bg-white p-8 shadow-md rounded-md hover:shadow-lg transition ease-in">
                <h1 className="text-3xl font-bold text-dark-blue mb-2">
                    Bluetooth Devices
                </h1>
                <div className="h-96 overflow-y-scroll">
                    <table className="table overflow-y-scroll table-fixed w-full">
                        <th className="bg-admin-black sticky top-0 text-white font-normal">Address</th>
                        <th className="bg-admin-black sticky top-0 text-white font-normal">Name</th>

                        {data.btData.bluetoothItems.map(item => {
                            return <tr className="text-center">
                                <td>{item.address}</td>
                                <td className="truncate">{item.name ? item.name : "Unknown"}</td>
                            </tr>
                        })}
                    </table>
                </div>
            </div>

            {/* Wi-Fi */}
            <div className="grow mr-16 basis-1/2 bg-white p-8 shadow-md hover:shadow-lg transition ease-in">
                <h1 className="text-3xl font-bold text-dark-blue mb-2">
                    Nearby Scanned Wi-Fi
                </h1>
                <div className="flex overflow-y-scroll h-96">
                    <table className="table table-fixed overflow-y-hidden w-full h-fit">
                        <th className="bg-admin-black sticky p-2 top-0 text-white font-normal">DBM</th>
                        <th className="bg-admin-black sticky p-2 top-0 text-white font-normal">SSID</th>
                        <th className="bg-admin-black sticky top-0  p-2 text-white font-normal">BSSID</th>

                        {data.wifiData.wifiItems.map(item => {
                            return <tr className="text-sm truncate">
                                <td className="truncate">{item.dbm}</td>
                                <td className="truncate">{item.ssid}</td>
                                <td className="truncate">{item.bssid}</td>
                            </tr>
                        })}
                    </table>
                </div>

            </div>

            {/* Process */}
            <div className="grow mr-16 basis-5/12 bg-white p-8 shadow-md hover:shadow-lg transition ease-in">
                <h1 className="text-3xl font-bold text-dark-blue mb-2">
                    Processes
                </h1>
                <div className="flex overflow-y-scroll h-96">
                    <table className="table table-fixed overflow-y-hidden w-full h-fit">
                        <th className="bg-admin-black sticky w-2/12 p-2 top-0 text-white font-normal">ID</th>
                        <th className="bg-admin-black sticky w-6/12 p-2 top-0 text-white font-normal">Name</th>
                        <th className="bg-admin-black sticky w-2/12 p-2 top-0 text-white font-normal">UID</th>
                        <th className="bg-admin-black sticky w-2/12 p-2 top-0 text-white font-normal">Imp.</th>

                        {data.procData.processItems.map(item => {
                            return <tr className="text-sm truncate">
                                <td className="truncate">{item.pid}</td>
                                <td className="truncate">{item.processName}</td>
                                <td className="truncate">{item.uid}</td>
                                <td className="truncate">{item.importance}</td>
                            </tr>
                        })}
                    </table>
                </div>

            </div>

        </div>

        {/* Footer */}
        <div className="flex h-32 bg-dark-blue items-center justify-between">
            <h1 className="text-2xl text-dark-blue border-l-dark-blue ml-24 text-white">Device Enumeration
                Dashboard</h1>
            <FontAwesomeIcon
                className="text-white text-2xl mr-24 hover:cursor-pointer hover:text-orange-dark transition ease-in"
                icon={faCircleInfo}/>
        </div>

    </div>);
};

Devices.propTypes = {};

export default Devices;