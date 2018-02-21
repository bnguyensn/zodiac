'use strict';

import chicken from '../img/chicken.png';
import dog from '../img/dog.png';
import dragon from '../img/dragon.png';
import goat from '../img/goat.png';
import horse from '../img/horse.png';
import monkey from '../img/monkey.png';
import mouse from '../img/mouse.png';
import ox from '../img/ox.png';
import pig from '../img/pig.png';
import rabbit from '../img/rabbit.png';
import snake from '../img/snake.png';
import tiger from '../img/tiger.png';

/**
 * file-loader will instruct webpack to emit the above imports as file, and return their public URL
 * The exports below are these public URLs
 * */
module.exports = {
    chicken: chicken,
    dog: dog,
    dragon: dragon,
    goat: goat,
    horse: horse,
    monkey: monkey,
    mouse: mouse,
    ox: ox,
    pig: pig,
    rabbit: rabbit,
    snake: snake,
    tiger: tiger
};
