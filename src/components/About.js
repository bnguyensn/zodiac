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
                        <h2>Methodology</h2>
                        <ol>
                            <li>For a given date, identify the Chinese New Year Day of that year</li>
                            <li>If the date</li>
                        </ol>
                    </section>
                    <section>
                        <h2>Credits</h2>
                        Formulas to calculate phases of the Moon come from <a href='https://en.wikipedia.org/wiki/Jean_Meeus' target='_blank'>Jean Meeus</a>' <a href='http://www.willbell.com/math/mc1.HTM' target='_blank'>Astronomical Algorithms</a>.
                        <br/><br/>
                        Chinese New Year calculations are derived from <a href='http://www.math.nus.edu.sg/aslaksen/' target='_blank'>Helmer Aslaksen</a>'s <a href='http://www.math.nus.edu.sg/aslaksen/calendar/chinese.shtml' target='_blank'>The Mathematics of the Chinese Calendar</a>.
                        <br/><br/>
                        Special thanks to <a href='http://www.astropixels.com/main/espenak.html' target='_blank'>Fred Espenak</a> of <a href='http://astropixels.com/' target='_blank'>AstroPixels</a>, who led me to Jean Meeus' book.
                        <br/><br/>
                        The zodiac icons come from Google's <a href='https://github.com/googlei18n/noto-emoji' target='_blank'>Noto Emoji</a> project, background pattern is made by <a href='http://stephen.io/' target='_blank'>Stephen Gilbert</a>, and font is <a href='https://twitter.com/@SteveMatteson1' target='_blank'>Steve Matteson</a>'s <a href='https://fonts.google.com/specimen/Open+Sans' target='_blank'>Open Sans</a>.
                    </section>
                    <section>
                        <h2>Technology</h2>
                        This website is powered by Facebook's <a href='https://reactjs.org/' target='_blank'>React</a>, with backend running on <a href='https://nodejs.org/en/' target='_blank'>Node.js</a> and <a href='https://expressjs.com/' target='_blank'>Express</a>.
                    </section>
                </section>
            </div>
        )
    }
}

export default About