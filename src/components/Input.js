'use strict';

import React, {PureComponent} from 'react';

class Input extends PureComponent {
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
        const ipw = (!!this.props.width) ? `ipw${this.props.width}` : '';

        return (
            <label className='input-label'>
                <input className={`input-control ${ipw}`} id={this.props.name} type='tel'
                       name={this.props.name} maxLength={this.props.size}
                       value={this.props.value} placeholder={this.props.placeholder}
                       onChange={this.props.handleChange}
                       onAnimationEnd={this.handleAnimationEnd}
                       onFocus={this.handleFocus} />
                <span className='input-control-desc'>{this.props.desc}</span>
            </label>
        )
    }
}

export default Input