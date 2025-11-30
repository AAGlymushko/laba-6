import { Coordinates } from './Coordinates.js'

export class GameObject
{
    #id;
    #coord;
    #size;

    constructor(id = "base_id", coord = new Coordinates(0, 0), size = new Coordinates(50, 50))
    {
        this.#id = id;
        this.#coord = coord;
        this.#size = size;
    }

    get_id() { return this.#id; }

    get_size() { return this.#size.get(); }

    get_coord() { return this.#coord.get(); }

    set_coord(x = 0, y = 0) { return this.#coord.set(x, y); }

    draw() {}
}