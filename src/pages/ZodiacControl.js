'use strict';

import React, {Component} from 'react';
import * as cny from '../js/cny';
import * as validation from '../js/validation';
import '../css/zodiaccontrol.css';

function DateInput(props) {
    function handleAnimationEnd(e) {
        e.target.classList.remove(e.animationName);
    }

    function handleFocus(e) {
        e.target.select();
    }

    return (
        <input className='date-control' id={props.name} type='tel'
               name={props.name} value={props.value} placeholder={props.placeholder}
               onChange={props.handleChange}
               onAnimationEnd={handleAnimationEnd}
               onFocus={handleFocus} />
    )
}

class ZodiacControl extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.flashInput = this.flashInput.bind(this);

        const today = new Date();

        this.state = {
            date: {
                year: today.getFullYear(),
                month: today.getMonth() + 1,
                day: today.getDate(),
            },
            res1: '',
            res2: ''
        }
    }

    handleClick(e) {
        const d = new Date(this.state.date.year, this.state.date.month, this.state.date.day);

        const r1 = cny.getCNY(this.state.date.year).toString();
        const r2 = cny.getZodiac(d);

        this.setState({
            res1: r1,
            res2: r2
        });
    }

    flashInput(target, colour) {
        target.classList.remove(colour);
        void target.offsetWidth;  // Trigger a document re-flow. This is needed for CSS animation resetting to work.
        target.classList.add(colour);
    }

    handleChange(e) {
        const target = e.target;
        const name = target.name;
        let value = target.value;

        // Make sure only digit characters are allowed in our input
        if (!validation.checkNonDigits(value)) {

            // Check date validity
            const date_shallow_clone = Object.assign({}, this.state.date);
            date_shallow_clone[name] = value;
            if (validation.validateDate(date_shallow_clone)) {

                // Re-render happens here and only happens if all validations pass
                console.log('Input validations pass!');
                this.setState({
                    date: date_shallow_clone
                });
            } else {
                this.flashInput(target, 'flash-red');
            }
        }
    }

    render() {
        return (
            <div id='zodiac-control-canvas'>
                <span>Enter your date of birth: </span>
                <DateInput name='year' placeholder='Y' value={this.state.date.year} handleChange={this.handleChange} />
                <DateInput name='month' placeholder='M' value={this.state.date.month} handleChange={this.handleChange} />
                <DateInput name='day' placeholder='D' value={this.state.date.day} handleChange={this.handleChange} />
                <input type='button' value='Click me!' onClick={this.handleClick}/>
                <br/>
                {this.state.res1}
                <br/>
                {this.state.res2}
            </div>
        )
    }
}

export default ZodiacControl