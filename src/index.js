'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Main from './components/Main';
import Footer from './components/Footer';
import './css/index.css';

ReactDOM.render(
    <div id="root-canvas">
        <Main />
        <Footer />
    </div>,
    document.getElementById('root')
);

// Hot Module Replacement
if (module.hot) {
    module.hot.accept('./components/Main', () => {
        console.log('Accepting the updated module.');
        const Next = require('./components/Main');
        ReactDOM.render(<Next />, document.getElementById('root'));
    });
}