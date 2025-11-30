import { ctx } from './constants.js';
import { GameObject } from './GameObject.js'
import { Coordinates } from './Coordinates.js'

export class Hero extends GameObject 
{
    constructor(id = "id/hero/", coord = new Coordinates(0, 0), size = new Coordinates(100, 100)) 
    {
        super(id, coord, size);
        this.vect = false;

        document.addEventListener('keydown', (event) => 
        {
            if (event.code === 'KeyA') this.vect = true;
            if (event.code === 'KeyD') this.vect = false;
        });

        this.sprite = new Image();
        this.sprite.src = "Герой.png";
    }

    paint() 
    {
        const [x, y] = this.get_coord();
        const [w, h] = this.get_size();
        
        if (!this.vect) ctx.drawImage(this.sprite, x, y, w, h);
        else
        {
            ctx.save();
            ctx.translate(x + w, y);
            ctx.scale(-1, 1);
            ctx.drawImage(this.sprite, 0, 0, w, h);
            ctx.restore();
        }
    }
}
