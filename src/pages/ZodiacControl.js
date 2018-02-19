'use strict';

import React, {Component, PureComponent} from 'react';
import * as cny from '../js/cny';
import * as validation from '../js/validation';
import '../css/zodiaccontrol.css';

class DateInput extends PureComponent {
    constructor(props) {
        super(props);
        this.handleAnimationEnd = this.handleAnimationEnd.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        console.log('DateInput did update!');
    }

    handleAnimationEnd(e) {
        e.target.classList.remove(e.animationName);
    }

    handleFocus(e) {
        e.target.select();
    }

    render() {
        return (
            <input className='date-control' id={this.props.name} type='tel'
                   name={this.props.name} value={this.props.value} placeholder={this.props.placeholder}
                   onChange={this.props.handleChange}
                   onAnimationEnd={this.handleAnimationEnd}
                   onFocus={this.handleFocus} />
        )
    }
}

/**
 * @return {null | React.Component} Return null if no zodiac was passed, otherwise return results
 * */
class ZodiacResult extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        console.log('ZodiacResult did update!');
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
                     src={`/img/${this.props.zodiac.toLowerCase()}.png`} alt={this.props.zodiac} />
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

        this.state = {
            date: {
                year: '',
                month: '',
                day: '',
            },
            zodiac: ''
        }
    }

    flashInput(target, colour) {
        target.classList.remove(colour);
        void target.offsetWidth;  // Trigger a document re-flow. This is needed for CSS animation resetting to work.
        target.classList.add(colour);
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

    render() {
        return (
            <div id='zodiac-control-canvas'>
                <div id='zodiac-control-inputs'>
                    <span>Your date of birth: </span>
                    <DateInput name='year' placeholder='Y' value={this.state.date.year} handleChange={this.handleDateChange} />
                    <DateInput name='month' placeholder='M' value={this.state.date.month} handleChange={this.handleDateChange} />
                    <DateInput name='day' placeholder='D' value={this.state.date.day} handleChange={this.handleDateChange} />
                </div>
                <ZodiacResult zodiac={this.state.zodiac} />
            </div>
        )
    }
}

export default ZodiacControl