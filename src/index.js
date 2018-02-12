'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Main from './pages/Main';
import './css/index.css';

ReactDOM.render(
    <div id="root-canvas">
        <Main />
    </div>,
    document.getElementById('root')
);

// Hot Module Replacement
if (module.hot) {
    module.hot.accept('./pages/Main', () => {
        console.log('Accepting the updated module.');
        const Next = require('./pages/Main');
        ReactDOM.render(<Next />, document.getElementById('root'));
    });
}