// frontend/src/components/SettingsWrapper.js

import React from 'react';
import Settings from './Settings';

const SettingsWrapper = ({ children }) => {
    return (
        <>
            <Settings />
            {children}
        </>
    );
};

export default SettingsWrapper;
