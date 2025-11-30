import { ctx } from './constants.js';
import { GameObject } from './GameObject.js'
import { Coordinates } from './Coordinates.js'

export class MovingPlatform extends GameObject
{
    #step;
    #is_right;
    #radius_plus;
    #radius_minus;

    constructor(id = "id/moving_platform/",
        step = 2,
        is_right = (Math.random() * 100 > 50),
        coord = new Coordinates(3000, 0),
        size = new Coordinates(100, 100),
        radius = 50)
    {
        super(id, coord, size);

        this.#step = step;
        this.#is_right = is_right;
        const [x] = this.get_coord();
        this.#radius_plus  = +Math.abs(radius) + x;
        this.#radius_minus = -Math.abs(radius) + x;
    }

    paint()
    {
        const [x, y] = this.get_coord();
        const [w, h] = this.get_size();

        const sprite = new Image();
        sprite.src = "платформа.png";
    
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

    update()
    {
        let [x, y] = this.get_coord();
        
        x += this.#step * (this.#is_right ? +1 : -1);
        
        if (x >= this.#radius_plus)
        {
            x = this.#radius_plus;
            this.#is_right = false;
        }
        else if (x <= this.#radius_minus)
        {
            x = this.#radius_minus;
            this.#is_right = true;
        }
        
        this.set_coord(x, y);
    }
}