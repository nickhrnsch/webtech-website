import React from 'react';
import './FensterStyle.css';

function Fenster({ title }) {
    return (
        <div className="fenster-container">
            <div className="fenster-header">
                <h3>{title}</h3>
            </div>
            {/* <div className="fenster-content">
                {children}
            </div> */}
        </div>
    );
}

export default Fenster; 