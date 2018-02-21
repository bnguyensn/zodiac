'use strict';

import React, {Component} from 'react';
import '../css/main.css';

class Header extends Component {

}

function NavLink(props) {
    function navigate(e) {
        e.preventDefault();
        window.history.pushState({url: props.link}, '', props.link);
        props.navigate(props.link);
    }

    return (
        <a className='lnk' href={props.link} onClick={navigate}>
            {props.content}
        </a>
    )
}

class Main extends Component {
    constructor(props) {
        super(props);
        this.navigate = this.navigate.bind(this);

        this.state = {
            active_link: '',
            cur_pg: null
        };

        this.import_dict = {
            '/': () => import(/* webpackChunkName: "zodiaccontrol" */ './ZodiacControl'),
            '/about': () => import(/* webpackChunkName: "about" */ './About'),
        };

        // Browser history button navigation
        window.onpopstate = (e) => {
            if (e.state) {
                this.navigate(e.state.url);
            }
        }

        // First load navigation
        this.navigate(window.location.pathname);
    }

    navigate(link) {
        const importFunc = this.import_dict[link];

        importFunc().then((module) => {
            const Module = module.default;
            this.setState({
                active_link: link,
                cur_pg: <Module />
            })
        })
    }

    render() {
        return (
            <div id='main-canvas'>
                <NavLink link='/' content='HOME' navigate={this.navigate}/>
                <NavLink link='/about' content='ABOUT' navigate={this.navigate}/>
                {this.state.cur_pg}
            </div>
        )
    }
}

export default Main