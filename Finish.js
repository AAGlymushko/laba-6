import { ctx } from './constants.js';

import { GameObject } from './GameObject.js'

import { Coordinates } from './Coordinates.js'

export class Finish extends GameObject
{
    constructor(id = "id/finish/", coord = new Coordinates(0, 0), size = new Coordinates(25, 100))
    {
        super(id, coord, size);
        this.sprite = new Image();
    }
    paint()
    {
        const [x, y] = this.get_coord();
        const [w, h] = this.get_size();

        const sprite = new Image();
        sprite.src = "Флаг.png";
    
        ctx.drawImage(sprite, x, y, w, h);
    }
}