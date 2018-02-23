'use strict';

import React, {Component} from 'react';
import ZodiacControl from './ZodiacControl';
import About from './About';
import '../css/main.css';

function NavLink(props) {
    function navigate(e) {
        e.preventDefault();
        window.history.pushState({url: props.link}, '', props.link);
        props.navigate(props.link);
    }

    return (
        <a className='nav-link' href={props.link} onClick={navigate}>
            {props.content}
        </a>
    )
}

function Header(props) {
    return (
        <header id='header-canvas'>
            {props.children}
        </header>
    )
}

function Content(props) {
    return (
        <section id='content-canvas'>
            {props.children}
        </section>
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
                <ZodiacControl />
                <About />
            </div>
        )
    }
}

export default Main