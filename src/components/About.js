'use strict';

import React, {Component} from 'react';
import classnames from 'classnames';
import Input from './Input';
import '../css/about.css';

class Expandable extends Component {
    constructor(props) {
        super(props);
        this.toggleExpandable = this.toggleExpandable.bind(this);
        this.handleExpandAnimEnd = this.handleExpandAnimEnd.bind(this);

        this.state = {
            to_expand: true,
            visibility: 'hidden-vis'
        }
    }

    handleExpandAnimEnd(e) {
        this.setState((prevState, props) => {
            return {
                visibility: prevState.to_expand ? 'hidden-vis' : prevState.visibility
            }
        })
    }

    toggleExpandable() {
        this.setState((prevState, props) => {
            return {
                to_expand: !prevState.to_expand,
                visibility: prevState.to_expand ? 'shown-vis' : prevState.visibility
            }
        });
    }

    render() {
        const expandable_cls = classnames({
            'expandable': true,
            'expand': !this.state.to_expand,
            [this.state.visibility]: true
        });

        return (
            <section className='expandable-container'>
                <button className='expandable-btn' type='button'
                        onClick={this.toggleExpandable}>{this.props.btnName}</button>
                <section className={expandable_cls} onTransitionEnd={this.handleExpandAnimEnd}>
                    {this.props.children}
                </section>
            </section>
        )
    }
}

class About extends Component {
    render() {
        return (
            <div id='about-canvas'>
                <Expandable btnName='ABOUT'>
                    <section id='about-methodology'>
                        <h2>Methodology</h2>
                        <ol>
                            <li>Calculate the Chinese New Year day for a given year using phases of the Moon</li>
                            <li>If the given date of birth falls after the Chinese New Year day, the zodiac is that year's zodiac, otherwise it's prior year's zodiac</li>
                        </ol>
                        <br/>
                        Currently supports UTC years 1 - 9999.
                        <br/><br/>
                        You can request a JSON file containing a list of calculated Chinese New Year dates here:
                        <br/>
                    </section>
                    <section>
                        <h2>Acknowledgements</h2>
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
                </Expandable>
            </div>
        )
    }
}

export default About