import {
    canvas,
    ctx,
    STEP_ALONG_Y,
    STEP_ALONG_X,
    MAX_Y, MIN_Y,
    MAX_X, MIN_X,
    SIZE_X, SIZE_Y,
    MAX_ADD_SPEED,
    START_SPEED_JUMP,
    STEP_FALL,
    READUCTION_FACTOR,
    SQUARE,
    WORLD_WIDTH,
    WORLD_HEIGHT,
    CAMERA_OFFSET_X,
    CAMERA_OFFSET_Y
} from './constants.js';

import { Enemy } from './enemy.js';

import { Hero } from './Hero.js';

import { Cubs } from './Cubs.js';

import { Coordinates } from './Coordinates.js'

import { Portals } from './Portal.js'

import { Finish } from './Finish.js'

import { MovingPlatform } from './MovingPlatform.js';

import { Wall } from './wall.js';

import { levels } from "./levels.js";

function intersection(first, second)
{
    const [x0, y0] = first.get_coord();
    const [w0, h0] = first.get_size();
    const [x1, y1] = second.get_coord();
    const [w1, h1] = second.get_size();

    return ((x0 < x1 + w1 && x0 + w0 > x1 && y0 < y1 + h1 && y0 + h0 > y1));
}

function colision(first, second)
{
    const [x0, y0] = first.get_coord();
    const [w0, h0] = first.get_size();
    const [x1, y1] = second.get_coord();
    const [w1, h1] = second.get_size();

    if (!(x0 < x1 + w1 && x0 + w0 > x1 && y0 < y1 + h1 && y0 + h0 > y1)) return false;

    let [new_x1, new_y1] = [x1, y1];

    const overlapX = Math.min(x0 + w0 - x1, x1 + w1 - x0);
    const overlapY = Math.min(y0 + h0 - y1, y1 + h1 - y0);

    if (overlapX < overlapY) 
    {
        new_x1 = (x1 + w1 / 2 < x0 + w0 / 2) ? x0 - w1 : x0 + w0;
    } 
    else 
    {
        new_y1 = (y1 + h1 / 2 < y0 + h0 / 2) ? y0 - h1 : y0 + h0;
    }
    
    second.set_coord(new_x1, new_y1);

    return true;
}

export class Round 
{
    #left;
    #right;

    #objects;
    #last_processed_object;
    
    #y_minus_add;
    #x_plus_add;
    #x_minus_add;

    #jump;
    #fall;
    #jump_permit;
    
    #hero;
    #camera_x;
    #camera_y;

    #interval;

    #victory;
    #isFinish;

    #update_camera()
    {
        const [hero_x, hero_y] = this.#hero.get_coord();
        const [hero_width, hero_height] = this.#hero.get_size();
        
        const hero_center_x = hero_x + hero_width / 2;
        const hero_center_y = hero_y + hero_height / 2;
        
        this.#camera_x = hero_center_x - CAMERA_OFFSET_X;
        this.#camera_y = hero_center_y - CAMERA_OFFSET_Y;
        
        this.#camera_x = Math.max(0, Math.min(this.#camera_x, WORLD_WIDTH - canvas.width));
        this.#camera_y = Math.max(0, Math.min(this.#camera_y, WORLD_HEIGHT - canvas.height));
    }
    
    #hero_check()
    {
        if (this.#last_processed_object != null) 
        {
            for (let i = 0; i < this.#last_processed_object; ++i)
            {
                this.#interaction(this.#objects[i], this.#hero);
            }
        }
    }

    #interaction(first, second) 
    {
        const full_col = (first, second)=> {
            const [x1, y1] = second.get_coord();
            
            let is_cool = colision(first, second);

            const [new_x1, new_y1] = second.get_coord();

            if (new_y1 < y1) 
            {
                this.#jump_permit = true;
                this.#fall = Math.min(this.#fall, 0);
            }
            
            return is_cool;
        };

        switch (first.get_id()) 
        {
            case "id/cubs/": 
            {
                switch (second.get_id()) 
                {
                    case "id/hero/": 
                    {
                        full_col(first, second);
                    }
                }
            } break;
            case "id/Enemy/": 
            {
                switch (second.get_id()) 
                {
                    case "id/hero/": 
                    {
                        const [sx, sy] = second.get_coord();
                        const [sw, sh] = second.get_size();
                        const [fx, fy] = first.get_coord();
                        const [fw, fh] = first.get_size();
                        
                        if (full_col(first, second))
                        if (sy + sh < fy + fh) 
                        {
                            this.#remove_enemy(first);
                            this.#fall = START_SPEED_JUMP / 2;
                        } 
                    } break;
                }
            } break;
            case "id/portals/":
            {
                const [portal1, portal2] = first.get_portal();

                const teleportation = (portal1, portal2, obj) => {
                    const [p1x, p1y] = portal1.get_coord();
                    const [p1w, p1h] = portal1.get_size();

                    const [p2x, p2y] = portal2.get_coord();
                    const [p2w, p2h] = portal2.get_size();

                    const [ox, oy]   = obj.get_coord();
                    const [ow, oh]   = obj.get_size();
                
                    const newX = (ox + ow / 2 > p1x + p1w / 2) ? p2x - ow - 50 : p2x + p2w + 50;
                
                    const newY = (oy + oh / 2 > p1y + p1h / 2) ? p2y - oh - 50 : p2y + p2h + 50;

                    obj.set_coord(newX, newY);
                };
                
                if (intersection(portal1, second)) teleportation(portal1, portal2, second);
                else if (intersection(portal2, second)) teleportation(portal2, portal1, second);

            } break;
            case "id/finish/":
            {
                switch (second.get_id()) 
                {
                    case "id/hero/": 
                    {
                        if (colision(first, second)) 
                        {
                            this.stop();
                            this.#victory = true;
                        }
                    } break;
                }
            } break;
            case "id/moving_platform/":
            {
                switch (second.get_id()) 
                {
                    case "id/hero/": 
                    {
                        full_col(first, second);
                    } break;
                }                   
            } break;
            default: break;
        }
    }
    
    #remove_enemy(enemy)
    {
        const index = this.#objects.indexOf(enemy);
        if (index !== -1) 
        {
            this.#objects.splice(index, 1);
            this.#last_processed_object = this.#objects.length;
        }
    }
    
    #movement() 
    {
        const adjustBonus = (active, value) =>
        {
            return active ? Math.min(value + 1, MAX_ADD_SPEED) : Math.max(value - 1, 0);
        }
    
        let [x, y] = this.#hero.get_coord();
        const [x_size, y_size] = this.#hero.get_size();
    
        if (this.#jump && this.#jump_permit) 
        {
            this.#jump_permit = false;
            this.#fall = START_SPEED_JUMP;
        } 
        else this.#fall -= this.#fall / READUCTION_FACTOR;

        y += STEP_FALL;
        y -= this.#fall + this.#y_minus_add;
        x += this.#x_plus_add + (this.#right ? STEP_ALONG_X : 0);
        x -= this.#x_minus_add + (this.#left ? STEP_ALONG_X : 0);
    
        this.#y_minus_add = adjustBonus(this.#jump,  this.#y_minus_add);
        this.#x_plus_add  = adjustBonus(this.#right, this.#x_plus_add);
        this.#x_minus_add = adjustBonus(this.#left,  this.#x_minus_add);
    
        y = Math.min(Math.max(y, MIN_Y), WORLD_HEIGHT - y_size);
        x = Math.min(Math.max(x, MIN_X), WORLD_WIDTH - x_size);
    
        this.#hero.set_coord(x, y);
    }

    #input() 
    {
        document.addEventListener('keydown', (event) => 
        {
            if (event.code === 'KeyA') this.#left  = true;
            if (event.code === 'KeyD') this.#right = true;
            if (event.code === 'KeyW') this.#jump  = true;
        });

        document.addEventListener('keyup', (event) => 
        {
            if (event.code === 'KeyA') this.#left  = false;
            if (event.code === 'KeyD') this.#right = false;
            if (event.code === 'KeyW') this.#jump  = false;
        });
    }

    #processing() 
    {
        if (this.#last_processed_object != null) 
        {
            for (let i = 0; i < this.#last_processed_object; ++i) 
            {
                switch (this.#objects[i].get_id())
                {
                    case "id/Enemy/":
                    case "id/moving_platform/":
                    {
                        this.#objects[i].update();
                    }
                    break;
                    default: break;
                }
            }
        }
        this.#movement();
        this.#update_camera();
        this.#hero_check();
    }

    #output() 
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.save();
        ctx.translate(-this.#camera_x, -this.#camera_y);
        
        if (this.#last_processed_object != null) 
        {
            for (let i = 0; i < this.#last_processed_object; ++i) this.#objects[i].paint();
        }
        
        this.#hero.paint();
        
        ctx.restore();

        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
    }

    constructor(objects) 
    {
        this.#isFinish = false;

        this.#jump = false;
        this.#left  = false;
        this.#right = false;
        
        this.#y_minus_add = 0;
        this.#x_plus_add  = 0;
        this.#x_minus_add = 0;

        this.#jump_permit = true;
        this.#fall = 0;
        this.#camera_x = 0;
        this.#camera_y = 0;

        this.#victory = false;
        
        this.#objects = objects;

        this.#last_processed_object = this.#objects.length;
        
        this.#hero = new Hero("id/hero/", new Coordinates(100, WORLD_HEIGHT - 350), new Coordinates(100, 100));
    }

    play() 
    {
        this.#input();

        const update = () => {
            this.#processing(); 
            this.#output(); 
            if (this.#victory) 
            {
                ctx.font = "bold 48px 'Times New Roman'";
                ctx.textAlign = "center";
                ctx.fillText("Victory!!!", SIZE_X / 2, SIZE_Y / 2);
            }
        }
        this.#interval = setInterval(update, 20);
    }

    stop()
    {
        if (this.#interval)
        {
            clearInterval(this.#interval);
            this.#interval = null;
            this.#isFinish = true;
        }
    }

    forcedStop()
    {
        if (this.#interval)
        {
            clearInterval(this.#interval);
            this.#interval = null;
        }
    }

    getIsFinish() { return this.#isFinish; }
    setIsFinish(isFinish) { this.#isFinish = isFinish; }
}