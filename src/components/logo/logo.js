import React from 'react';
import './logo.css';

const Logo = ({place}) => {
    const logoStyle = `logo logo_place_${place}`;
    return (
        <div className={logoStyle}>
            <div className="logo__circle"></div>
            <div className="logo__rectangle"></div>
            <div className="logo__circle"></div>
            <div className="logo__rectangle logo__rectangle_shape_tr"></div>
        </div>
    )
}

export default Logo;