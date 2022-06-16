import React, {useEffect, useState} from 'react';
import {getDatabase, onValue, ref} from "firebase/database";
import {Link} from "react-router-dom";
import * as PropTypes from "prop-types";
import {Marker, Popup, TileLayer} from "leaflet/dist/leaflet-src.esm";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClipboard, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {FilterTable} from "../FilterTable/FilterTable";

function MapContainer(props) {
    return null;
}

MapContainer.propTypes = {
    scrollWheelZoom: PropTypes.bool,
    center: PropTypes.arrayOf(PropTypes.number),
    zoom: PropTypes.number,
    children: PropTypes.node
};
const DataTable = (props) => {

    // Get the different states
    const [dataList, setDataList] = useState();
    const [deviceCount, setDeviceCount] = useState(0);
    const [lastDate, setLastDate] = useState(0);

    useEffect(()=>{
        props.func(deviceCount)
    }, [deviceCount])

    useEffect(()=>{
    }, [lastDate])


    // Listen for the changes
    useEffect(() =>{
        const dbRef = getDatabase();
        const dbVal = ref(dbRef, "/");
        onValue(dbVal, snapshot =>{
            const dataVals = snapshot.val();
            const dataValList = [];
            for (let id in dataVals){
                dataValList.push(dataVals[id]);

                console.log(dataVals[id])

            }
            setDeviceCount(dataValList.length);
            setDataList(dataValList);
        })
    }, [])

    const thStyle = "px-6 py-4 font-display font-normal bg-admin-slate-dark text-admin-white"
    const thSecondary = "px-4 p-2 font-display text-sm font-normal bg-white text-admin-red font-bold"

    // return the element
    return (
        <div className="flex flex-col p-8 md:items-center lg:items-start  max-h-full overflow-hidden">

            <table className="table-auto w-fit max-h-full shadow-md rounded-md bg-white overflow-hidden">
                <thead className="rounded-md">
                <tr className="rounded-md h-fit">
                    <th className={thStyle}>Snapshot Date</th>
                    <th className={thStyle}>Device ID</th>
                    <th className={thStyle}>Last known IP</th>
                    <th className={thStyle}>Storage Space</th>
                    <th className={thStyle}>Model</th>
                    <th className={thStyle}>Apps Count</th>
                    <th className={thStyle}></th>

                </tr>
                </thead>
                <thead>
                <tr className="rounded-md border-b">
                    <th className={thSecondary}>The date of when the snapshot was taken</th>
                    <th className={thSecondary}>Unique device identifier</th>
                    <th className={thSecondary}>Last known external IP</th>
                    <th className={thSecondary}>Current and remaining device storage</th>
                    <th className={thSecondary}>The detected device model</th>
                    <th className={thSecondary}>App related information</th>
                    <th className={thSecondary}></th>
                </tr>
                </thead>
                <tbody>
                    {dataList ? dataList.map((snapshot, index)=>{

                        const key = Object.keys(snapshot)[index]
                        const data = dataList[index][key]

                        if(data?.snapshotData?.snapshotDate?.time > lastDate){
                            props.funcDate(data.snapshotData.snapshotDate.time)
                        }
                        data.uniqueId = key

                        return<tr className="text-center text-admin-slate">
                            <td className="px-4 py-2 font-display">{new Date(data?.snapshotData?.snapshotDate?.time).toLocaleString()}</td>
                            <td className="px- py-2 font-display"><span className="select-all">{data.uniqueId}</span>
                            <FontAwesomeIcon className="mx-2 hover:text-admin-blue transition duration-100 hover:cursor-pointer"
                                             onClick={() => {
                                                 navigator.clipboard.writeText(data.uniqueId);
                                             }}
                                             icon={faClipboard}/>
                            </td>
                            <td className="px-4 py-2 font-display">{data?.snapshotData?.externalIp}</td>
                            <td className="px-4 py-2 font-display">
                                {(data?.storageData?.megAvailable / 1024).toFixed(2)}/{(data?.storageData?.megTotal / 1024).toFixed(2)} ({(data?.storageData?.percentage * 100).toFixed(2)}%)
                            </td>
                            <td className="px-4 py-2 font-display">{data?.buildData?.buildItemList[0].description}</td>
                            <td className="px-4 py-2 font-display">{data?.appData?.appCount}</td>
                            <td className="px-4 py-2 font-display">
                                <div className="p-2">
                                    <Link
                                        className="py-2 px-6 w-12 bg-admin-red rounded-2xl shadow-md whitespace-nowrap text-white hover:bg-orange-dark transition ease-in"
                                        to={"devices"}
                                        state={data}>
                                            <FontAwesomeIcon className="mr-2" icon={faMagnifyingGlass}/>
                                        View
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    }):<tr className="w-full">
                        <LoadingBar/>
                        <LoadingBar/>
                        <LoadingBar/>
                        <LoadingBar/>
                        <LoadingBar/>
                        <LoadingBar/>
                    </tr>}


                </tbody>
            </table>
        </div>
    );
};

const LoadingBar = () => {
    return <td><div className="animate-pulse h-2 bg-slate-400 m-4 rounded basis-full"/></td>
}

export default DataTable;