import {
    WORLD_WIDTH,
    WORLD_HEIGHT,
} from './constants.js';

import { Round } from "./game.js";
import { Enemy } from './enemy.js';
import { Cubs } from './Cubs.js';
import { Coordinates } from './Coordinates.js'
import { Portals } from './Portal.js'
import { Finish } from './Finish.js'
import { MovingPlatform } from './MovingPlatform.js';
import { Wall } from './wall.js';

export var levels = [];

function makeLevel(data) {
    return {
        passed: false,
        data: data
    };
}

levels.push(makeLevel([
    new Wall("id/wall/", new Coordinates(0, 0), new Coordinates(WORLD_WIDTH, WORLD_HEIGHT)),
    new Cubs("id/cubs/", new Coordinates(0, WORLD_HEIGHT - 300), new Coordinates(5000, 300)),
    new Cubs("id/cubs/", new Coordinates(0, 0), new Coordinates(5000, 300)),
    new Cubs("id/cubs/", new Coordinates(750, WORLD_HEIGHT - 700), new Coordinates(500, 400)),
    new Cubs("id/cubs/", new Coordinates(500, WORLD_HEIGHT - 450), new Coordinates(250, 50)),
    new Cubs("id/cubs/", new Coordinates(600, WORLD_HEIGHT - 600), new Coordinates(150, 50)),
    new Portals("id/portals/", 
        [new Coordinates(0, WORLD_HEIGHT - 700), new Coordinates(75, 75)], 
        [new Coordinates(1250, WORLD_HEIGHT - 400), new Coordinates(1000, 100)]), 
    new Cubs("id/cubs/", new Coordinates(1700, WORLD_HEIGHT - 700), new Coordinates(150, 50)),
    new Cubs("id/cubs/", new Coordinates(2250, WORLD_HEIGHT - 700), new Coordinates(500, 500)),
    new Enemy("id/Enemy/", 1, true, 60, new Coordinates(2850, WORLD_HEIGHT - 500), new Coordinates(200, 200), 70),
    new MovingPlatform("id/moving_platform/", 2, true, new Coordinates(3000, WORLD_HEIGHT - 700), new Coordinates(600, 100), 200),
    new Cubs("id/cubs/", new Coordinates(3500, WORLD_HEIGHT - 400), new Coordinates(500, 100)),
    new Finish("id/finish/", new Coordinates(4800, WORLD_HEIGHT - 500), new Coordinates(110, 200))
]));

levels.push(makeLevel([
    new Wall("id/wall/", new Coordinates(0, 0), new Coordinates(WORLD_WIDTH, WORLD_HEIGHT)),
    new Cubs("id/cubs/", new Coordinates(0, WORLD_HEIGHT - 300), new Coordinates(1250, 300)),
    new Portals("id/portals/", 
        [new Coordinates(0, WORLD_HEIGHT - 1100), new Coordinates(75, 75)], 
        [new Coordinates(1250, WORLD_HEIGHT - 300), new Coordinates(WORLD_WIDTH - 1250, 300)]),
    new Cubs("id/cubs/", new Coordinates(0, 0), new Coordinates(5000, 300)),
    new Cubs("id/cubs/", new Coordinates(1500, WORLD_HEIGHT - 400), new Coordinates(300, 400)),
    new MovingPlatform("id/moving_platform/", 3, true, new Coordinates(2400, WORLD_HEIGHT - 400), new Coordinates(300, 50), 400),
    new Cubs("id/cubs/", new Coordinates(3300, WORLD_HEIGHT - 400), new Coordinates(300, 400)),
    new Cubs("id/cubs/", new Coordinates(3950, WORLD_HEIGHT - 400), new Coordinates(300, 400)),
    new Cubs("id/cubs/", new Coordinates(4500, WORLD_HEIGHT - 500), new Coordinates(500, 500)),
    new Finish("id/finish/", new Coordinates(4800, WORLD_HEIGHT - 700), new Coordinates(110, 200))
]));

levels.push(makeLevel([
    new Wall("id/wall/", new Coordinates(0, 0), new Coordinates(WORLD_WIDTH, WORLD_HEIGHT)),
    new Cubs("id/cubs/", new Coordinates(0, WORLD_HEIGHT - 300), new Coordinates(5000, 300)),
    new Cubs("id/cubs/", new Coordinates(0, 0), new Coordinates(5000, 300)),
    new Enemy("id/Enemy/", 1, true, 60, new Coordinates(1000, WORLD_HEIGHT - 500), new Coordinates(200, 200), 70),
    new Cubs("id/cubs/", new Coordinates(1500, WORLD_HEIGHT - 450), new Coordinates(200, 450)),
    new Enemy("id/Enemy/", 1, true, 60, new Coordinates(2000, WORLD_HEIGHT - 500), new Coordinates(200, 200), 70),
    new Cubs("id/cubs/", new Coordinates(2500, WORLD_HEIGHT - 450), new Coordinates(200, 450)),
    new MovingPlatform("id/moving_platform/", 10, true, new Coordinates(3200, WORLD_HEIGHT - 550), new Coordinates(500, 250), 400),
    new Cubs("id/cubs/", new Coordinates(4100, WORLD_HEIGHT - 1000), new Coordinates(200, 200)),
    new Cubs("id/cubs/", new Coordinates(4100, WORLD_HEIGHT - 650), new Coordinates(200, 350)),
    new Finish("id/finish/", new Coordinates(4800, WORLD_HEIGHT - 500), new Coordinates(110, 200))
]));

export class GameManager 
{
    constructor(levels) 
    {
        this.levels = levels;
        this.round = null;
    }

    startLevel(index)
    {
        if (index > 0 && !this.levels[index - 1].passed) return;
        this.round = new Round(this.levels[index].data);
        this.round.onStop = () => {
            if (this.round.getIsFinish()) { this.levels[index].passed = true; }
        };
        this.round.play();
    }

    deleteLevel()
    {
        if (this.round !== null) 
        {
            this.round.forcedStop();
            if (typeof this.round.onStop === "function")  this.round.onStop();
        }

        this.round = null;
    }
}