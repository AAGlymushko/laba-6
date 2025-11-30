import { ctx } from './constants.js';
import { GameObject } from './GameObject.js'
import { Coordinates } from './Coordinates.js'

export class Portal extends GameObject
{
    constructor(id = "id/portal/", coord = new Coordinates(0, 0), size = new Coordinates(50, 50))
    {
        super(id, coord, size);
        this.sprite = new Image();
        this.sprite.src = "Портал.png";
    }
    
    paint()
    {
        const [x, y] = this.get_coord();
        const [w, h] = this.get_size();

        const sprite = new Image();
        sprite.src = "портал.png";
    
        const Size = 100;

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

export class Portals
{
    #id;
    #portal1;
    #portal2;

    constructor(id = "id/portals/",
         [coord1, size1] = [new Coordinates(0, 0), new Coordinates(50, 50)],
          [coord2, size2] = [new Coordinates(0, 0), new Coordinates(50, 50)])
    {
        this.#id = id;
        this.#portal1 = new Portal("id/portal1/", coord1, size1);
        this.#portal2 = new Portal("id/portal2/", coord2, size2);
    }

    get_id() { return this.#id; }

    get_portal() { return [this.#portal1, this.#portal2]; }
    
    paint()
    {
        this.#portal1.paint();
        this.#portal2.paint();
    }
}