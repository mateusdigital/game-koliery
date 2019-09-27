class Starfield
    extends PIXI.Container
{
    constructor(bounds)
    {
        super();

        this.graphics = new PIXI.Graphics();
        this.stars    = [];
        this.bounds   = bounds;

        const screen_size = Get_Screen_Size();
        for(let i = 0; i < 100; ++i) {
            let star = this._CreateStar()
            this.stars.push(star);
        }

        this.addChild(this.graphics);
    }

    _CreateStar()
    {
        return {
            x : Math_RandomInt(this.bounds.x, this.bounds.width),
            y : Math_RandomInt(this.bounds.y, this.bounds.height),
            z : Math_Random   (0.5, 2),
        }
    }

    _ResetStar(star)
    {
        star.x = 0;
        star.y = Math_RandomInt(this.bounds.y, this.bounds.height);
        star.z = Math_Random   (0.5, 2);
    }

    Update(dt)
    {
        this.graphics.clear();
        const screen_size = Get_Screen_Size();

        this.graphics.beginFill(0xFFFFFF, 1);
        for(let i = 0; i < this.stars.length; ++i) {
            let star = this.stars[i];
            star.x += 50 * star.z * dt;
            if(star.x > screen_size.x) {
                this._ResetStar(star);
            }

            this.graphics.drawRect(
                    star.x,
                    star.y,
                    2 * star.z,
                    1 * star.z
                );

        }
        this.graphics.endFill();
    }

}; // class Starfield
