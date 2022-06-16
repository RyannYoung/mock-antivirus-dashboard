import React from 'react'

export const GlobalFilter = ({preFilter, filter, setFilter}) => {

    return (
        <span>
            <input
                className="shadow appearance-none border border-blue-900 border-2 rounded py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Search"
                value={filter || ''}
                onChange={e => setFilter(e.target.value)}
            />
        </span>
    )
}