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
            year: 2018,
            res: ''
        }
    }

    handleClick(e) {
        const r = cny.getCNY(this.state.year).toString();

        this.setState({
            res: r
        });
    }

    handleChange(e) {
        console.log('!!!');
        this.setState({
            year: e.target.value
        })
    }

    render() {
        return (
            <div>
                <input type='number' value={this.state.year} onChange={this.handleChange} />
                <input type='button' value='Click me!' onClick={this.handleClick}/>
                <br/>
                {this.state.res}
            </div>
        )
    }
}

export default Main