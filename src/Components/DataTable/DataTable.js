import React, {useEffect, useState} from 'react';
import {getDatabase, onValue, ref} from "firebase/database";

const DataTable = () => {

    // Get the different states
    const [dataList, setDataList] = useState();
    const [keyList, setKeyList] = useState();

    // Listen for the changes
    useEffect(() =>{
        const dbRef = getDatabase();
        const dbVal = ref(dbRef, "/");
        onValue(dbVal, snapshot =>{
            const dataVals = snapshot.val();
            const dataValList = [];
            for (let id in dataVals){
                dataValList.push(dataVals[id]);
            }
            console.log(Object.keys(dataValList))
            setKeyList(Object.keys(dataValList[0]));
            setDataList(dataValList);
        })
    }, [])

    // return the element
    return (
        <div className="flex justify-center m-12">
            <table className="table-auto border-collapse border border-slate-500 border border-slate-600 shadow-md border-collapse border border-slate-500 rounded-md bg-white">
                <thead>
                <tr className="bg-gray-100 rounded-md">
                    <th className="px-6 py-2 font-display">Date</th>
                    <th className="px-6 py-2 font-display">Device ID</th>
                    <th className="px-6 py-2 font-display">Last known IP</th>
                    <th className="px-6 py-2 font-display">Storage Space</th>
                    <th className="px-6 py-2 font-display">Apps Count</th>
                </tr>
                </thead>
                <thead>
                <tr className="bg-gray-100 rounded-md">
                    <th className="px-4 py-2 font-display text-xs font-normal italic">The date of when the snapshot was taken</th>
                    <th className="px-4 py-2 font-display text-xs font-normal italic">Unique device identifier</th>
                    <th className="px-4 py-2 font-display text-xs font-normal italic">Last known external IP</th>
                    <th className="px-4 py-2 font-display text-xs font-normal italic">Current and remaining device storage</th>
                    <th className="px-4 py-2 font-display text-xs font-normal italic">App related information</th>
                </tr>
                </thead>
                <tbody>
                    {keyList ? keyList.map((key, index)=>{
                        const data = dataList[index][key]
                        console.log(data)
                        return<tr>
                            <td className="px-4 py-2">{key}</td>
                            <td className="px-4 py-2">{data.storageData.megAvailable}</td>
                            <td className="px-4 py-2">{data.appData.appCount}</td>
                        </tr>
                    }): "Loading..."}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;