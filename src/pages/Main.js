'use strict';

import React, {Component} from 'react';
import * as cny from '../js/cny';
import '../css/main.css';

class Main extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            year: 1992,
            month: 8,
            day: 2,
            res1: '',
            res2: ''
        }
    }

    handleClick(e) {
        const d = new Date(this.state.year, this.state.month, this.state.day);

        const r1 = cny.getCNY(this.state.year).toString();
        const r2 = cny.getZodiac(d);

        this.setState({
            res1: r1,
            res2: r2
        });
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        return (
            <div>
                <input type='number' name='year' value={this.state.year} onChange={this.handleChange} />
                <input type='number' name='month' value={this.state.month} onChange={this.handleChange} />
                <input type='number' name='day' value={this.state.day} onChange={this.handleChange} />
                <input type='button' value='Click me!' onClick={this.handleClick}/>
                <br/>
                {this.state.res1}
                <br/>
                {this.state.res2}
            </div>
        )
    }
}

export default Main