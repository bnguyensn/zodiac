'use strict';

import React, {Component} from 'react';
import ZodiacControl from './ZodiacControl';
import '../css/main.css';



class Main extends Component {
    render() {
        return (
            <div id='main-canvas'>
                <h1 id='title'>What's Your Chinese Zodiac Animal?</h1>
                <ZodiacControl />
            </div>
        )
    }
}

export default Main