import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome} from "@fortawesome/free-solid-svg-icons";

const SideButton = props => {
    return (
        <div className={`box-border flex gap-x-4 px-4 py-2 items-center border-r-8 border-r-admin-slate text-lg hover:bg-admin-slate-dark hover:border-admin-blue transition duration-200 hover:cursor-pointer ${props.className} ${props.selected && ("border-r-8 border-admin-blue")}`}>
            <FontAwesomeIcon className="basis-1/6" icon={props.icon}/>
            <span className="basis-5/6 text-admin-white">{props.name}</span>
        </div>
    );
};

SideButton.propTypes = {
    name: PropTypes.string.isRequired,
    icon: PropTypes.any.isRequired,
};

export default SideButton;