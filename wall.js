import { ctx, WORLD_WIDTH, WORLD_HEIGHT } from './constants.js';

import { GameObject } from './GameObject.js';

import { Coordinates } from './Coordinates.js';

export class Wall extends GameObject 
{
    constructor(id = "id/wall/", coord = new Coordinates(0, 0), size = new Coordinates(WORLD_WIDTH, WORLD_HEIGHT)) 
    {
        super(id, coord, size);
    }

    paint() 
    {
        const [x, y] = this.get_coord();
        const [w, h] = this.get_size();

        const sprite = new Image();
        sprite.src = "фон.png";

        for (let y = 0; y < WORLD_HEIGHT; y += 300) 
            for (let x = 0; x < WORLD_WIDTH; x += 600) 
                ctx.drawImage(sprite, x, y, 600, 300);
    }
}
