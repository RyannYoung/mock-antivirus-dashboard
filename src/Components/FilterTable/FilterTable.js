import React, {useMemo} from "react";
import {useTable, useGlobalFilter} from 'react-table';
import MOCK_DATA from './MOCK_DATA.json'
import {COLUMNS} from './columns'
import {GlobalFilter} from "./GlobalFilter";

export const FilterTable = (props) => {
    const columns = useMemo(() => props.columns, [])
    const data = useMemo(() => props.data, [])

    const {
        getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state, setGlobalFilter
    } = useTable({
        columns, data
    }, useGlobalFilter)

    const {globalFilter} = state

    return (<div className="flex flex-col">
        <GlobalFilter
            filter={globalFilter}
            setFilter={setGlobalFilter}/>
        <div className="h-96 overflow-y-scroll overflow-hidden rounded-md border-2 shadow border-admin-slate-dark scrollbar scrollbar-thumb-admin-slate-dark scrollbar-track-transparent scrollbar-thin">
        <table className="table table-fixed w-full max-w-full" {...getTableProps()}>
            <thead>
            {headerGroups.map(headerGroup => (<tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (<th className="bg-admin-slate sticky w-4/12 p-2 top-0 text-white font-normal" {...column.getHeaderProps()}>
                    {column.render('Header')}
                </th>))}
            </tr>))}
            <tr>
                <th></th>
            </tr>
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map(row => {
                prepareRow(row)
                return (<tr className="text-sm truncate hover:bg-gray-200" {...row.getRowProps()}>
                    {row.cells.map(cell => {
                        return <td className="truncate px-4" {...cell.getCellProps()}>
                            {cell.render('Cell')}
                        </td>
                    })}
                </tr>)
            })}
            </tbody>
        </table>
        </div>
    </div>)

}