'use strict';

import React, {Component, PureComponent} from 'react';
import * as cny from '../js/cny';
import * as validation from '../js/validation';
import * as zodiacimg from '../js/imgimp';
import '../css/zodiaccontrol.css';

function addAnimationClass(target, animation_class) {
    target.classList.remove(animation_class);
    void target.offsetWidth;  // Trigger a document re-flow. This is needed for CSS animation resetting to work.
    target.classList.add(animation_class);
}

class DateInput extends PureComponent {
    constructor(props) {
        super(props);
        this.handleAnimationEnd = this.handleAnimationEnd.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
    }

    handleAnimationEnd(e) {
        e.target.classList.remove(e.animationName);
    }

    handleFocus(e) {
        e.target.select();
    }

    render() {
        return (
            <label>
                <input className='date-control' id={this.props.name} type='tel'
                       name={this.props.name} maxLength={this.props.size}
                       value={this.props.value} placeholder={this.props.placeholder}
                       onChange={this.props.handleChange}
                       onAnimationEnd={this.handleAnimationEnd}
                       onFocus={this.handleFocus} />
                <span className='date-control-desc'>{this.props.name}</span>
            </label>
        )
    }
}

/**
 * @return {null | React.Component} Return null if no zodiac was passed, otherwise return results
 * */
class ZodiacResult extends PureComponent {
    constructor(props) {
        super(props);
        this.handleAnimationEnd = this.handleAnimationEnd.bind(this);
    }

    componentDidMount() {
        const element = document.getElementById('zodiac-result-icon');
        if (element !== null) {
            addAnimationClass(document.getElementById('zodiac-result-icon'), 'spin');
        }
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        console.log('ZodiacResult did update!');
        const element = document.getElementById('zodiac-result-icon');
        if (element !== null) {
            addAnimationClass(document.getElementById('zodiac-result-icon'), 'spin');
        }
    }

    handleAnimationEnd(e) {
        e.target.classList.remove(e.animationName);
    }

    handleClick(e) {
        addAnimationClass(e.target, 'spin');
    }

    render() {
        if (this.props.zodiac === '') {
            return null;
        }

        return (
            <div id='zodiac-result'>
                <span id='zodiac-result-text'>{`You are a ${this.props.zodiac.charAt(0).toUpperCase()}${this.props.zodiac.substr(1)}!`}</span>
                <img id='zodiac-result-icon'
                     className='spin'
                     src={zodiacimg[this.props.zodiac.toLowerCase()]} alt={this.props.zodiac}
                     onAnimationEnd={this.handleAnimationEnd}
                     onClick={this.handleClick}/>
                <span id='zodiac-result-about'>See the calculation method <a href='about'>here</a></span>
            </div>
        )
    }
}

class ZodiacControl extends Component {
    constructor(props) {
        super(props);
        this.flashInput = this.flashInput.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.updateResults = this.updateResults.bind(this);
        this.autoMoveFocus = this.autoMoveFocus.bind(this);

        this.state = {
            date: {
                year: '',
                month: '',
                day: '',
            },
            zodiac: ''
        }
    }

    componentDidMount() {
        document.getElementById('year').focus();
    }

    flashInput(target, colour) {
        addAnimationClass(target, colour);
    }

    handleDateChange(e) {
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
                this.setState({
                    date: date_shallow_clone
                }, this.updateResults(date_shallow_clone));

                // Move the focus to the next input if the maximum length has been reached
                this.autoMoveFocus(target, value);
            } else {
                this.flashInput(target, 'flash-red');
            }
        } else {
            this.flashInput(target, 'flash-red');
        }
    }

    updateResults(date) {

        // Note that this.state.zodiac here refers to the prevState's zodiac
        // Also note that date.month is per user's input i.e. 1-indexed. We thus remove 1 from it for our getZodiac()
        if (date.year !== '' && date.month !== '' && date.day !== '') {
            const d = new Date(date.year, date.month - 1, date.day);
            this.setState({
                zodiac: cny.getZodiac(d)
            });
        } else if ((date.year === '' || date.month === '' || date.day === '') && this.state.zodiac !== '') {
            this.setState({
                zodiac: ''
            });
        }
    }

    autoMoveFocus(original_input, input_value) {
        if (input_value.length === Number(original_input.getAttribute('maxlength'))) {
            original_input.parentNode.nextElementSibling.firstElementChild.focus();
        }
    }

    render() {
        return (
            <div id='zodiac-control-canvas'>
                <div id='zodiac-control-inputs'>
                    <h1 id='title'>What's Your Chinese Zodiac Animal?</h1>
                    <span>Your date of birth: </span>
                    <br/>
                    <DateInput name='year' size={4} placeholder='Y' value={this.state.date.year} handleChange={this.handleDateChange} />
                    <DateInput name='month' size={2} placeholder='M' value={this.state.date.month} handleChange={this.handleDateChange} />
                    <DateInput name='day' size={2} placeholder='D' value={this.state.date.day} handleChange={this.handleDateChange} />
                </div>
                <ZodiacResult zodiac={this.state.zodiac} />
            </div>
        )
    }
}

export default ZodiacControl