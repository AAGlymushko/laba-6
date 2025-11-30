import { ctx } from './constants.js';
import { GameObject } from './GameObject.js'
import { Coordinates } from './Coordinates.js'

export class Enemy extends GameObject {
    static sprites = [
        "Ниндя 2.png",
        "Ниндя 1.png",
        "Ниндя 3.png",
        "Ниндя 1.png"
    ].map(src => {
        const img = new Image();
        img.src = src;
        return img;
    });

    #step;
    #is_right;
    #rate_correct;
    #radius_plus;
    #radius_minus;
    #cadr;
    #animationSpeed;

    constructor(id = "id/Enemy/",
        step = 2,
        is_right = (Math.random() * 100 > 50),
        rate_correct = 10,
        coord = new Coordinates(3000, 0),
        size = new Coordinates(100, 100),
        radius = 50)
    {
        super(id, coord, size);

        this.#step = step;
        this.#is_right = is_right;
        this.#rate_correct = rate_correct;
        const [x] = this.get_coord();
        this.#radius_plus  = +Math.abs(radius) + x;
        this.#radius_minus = -Math.abs(radius) + x;
        this.#cadr = 0;
        this.#animationSpeed = 0.1;
    }

    paint() {
        const [x, y] = this.get_coord();
        const [w, h] = this.get_size();

        const frameIndex = Math.floor(this.#cadr) % Enemy.sprites.length;
        const sprite = Enemy.sprites[frameIndex];

        if (this.#is_right) {
            ctx.drawImage(sprite, x, y, w, h);
        } else {
            ctx.save();
            ctx.translate(x + w, y);
            ctx.scale(-1, 1);
            ctx.drawImage(sprite, 0, 0, w, h);
            ctx.restore();
        }
    }

    update() {
        let [x, y] = this.get_coord();
        x += this.#step * (this.#is_right ? +1 : -1);

        if (x >= this.#radius_plus) {
            x = this.#radius_plus;
            this.#is_right = false;
        } else if (x <= this.#radius_minus) {
            x = this.#radius_minus;
            this.#is_right = true;
        }

        if (Math.round(Math.random() * this.#rate_correct) === this.#rate_correct) {
            this.#is_right = !this.#is_right;
        }

        this.#cadr += this.#animationSpeed;
        if (this.#cadr >= Enemy.sprites.length) this.#cadr = 0;

        this.set_coord(x, y);
    }
}
