'use strict';

import React, {Component} from 'react';
import '../css/about.css';

class About extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='about-canvas'>
                <a href='#'>Show calculation method</a>
                <section id='about-expandable'>
                    <section>
                        Chinese New Years are based on phases of the moon.
                    </section>
                </section>
            </div>
        )
    }
}

export default About