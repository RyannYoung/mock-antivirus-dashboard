import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock} from "@fortawesome/free-solid-svg-icons";

const DataCard = props => {
    return (
        <div className="h-36 aspect-[16/6] rounded-md bg-white shadow-sm hover:shadow-md transition p-4 flex">
            <div className="basis-1/3 text-6xl mb-2 flex justify-center items-center">
                <FontAwesomeIcon className="text-admin-red drop-shadow" icon={props.icon}/>
            </div>
            <div className="basis-2/3 flex flex-col justify-center">
                <div className="flex justify-center items-center">
                    <p className="text-4xl text-center text-admin-red font-bold">{props.data}</p>
                </div>
                <div className="flex justify-center items-center">
                    <span className="text-md">{props.description}</span>
                </div>
            </div>
        </div>
    );
};

DataCard.propTypes = {
    description: PropTypes.string,
    data: PropTypes.any,
    icon: PropTypes.any
};

export default DataCard;