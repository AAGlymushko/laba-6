export class Coordinates 
{
    #x;
    #y;
    
    constructor(x = 0, y = 0) 
    {
        this.#x = x;
        this.#y = y;
    }
    
    get() 
    {
        return [this.#x, this.#y]; 
    }
    
    set(x, y) 
    {
        this.#x = x;
        this.#y = y;
    }
}