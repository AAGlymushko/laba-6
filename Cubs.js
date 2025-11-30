import { ctx } from './constants.js';

import { GameObject } from './GameObject.js'

import { Coordinates } from './Coordinates.js'

export class Cubs extends GameObject
{
    constructor(id = "id/cubs/", coord = new Coordinates(0, 0), size = new Coordinates(100, 100))
    {
        super(id, coord, size);
    }
    paint()
    {
        const [x, y] = this.get_coord();
        const [w, h] = this.get_size();

        const sprite = new Image();
        sprite.src = "пол.png";
    
        const Size = 600;

        ctx.save();
    
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.clip();
    
        for (let yy = 0; yy < h; yy += Size) 
            for (let xx = 0; xx < w; xx += Size) 
                ctx.drawImage(sprite, x + xx, y + yy, Size, Size);

        ctx.restore();
    }
}