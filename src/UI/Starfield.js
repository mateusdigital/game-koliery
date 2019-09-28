//----------------------------------------------------------------------------//
//                       __      __                  __   __                  //
//               .-----.|  |_.--|  |.--------.---.-.|  |_|  |_                //
//               |__ --||   _|  _  ||        |  _  ||   _|   _|               //
//               |_____||____|_____||__|__|__|___._||____|____|               //
//                                                                            //
//  File      : Starfield.js                                                  //
//  Project   : columns                                                       //
//  Date      : Sep 27, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//
// Starfield                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const STARFIELD_STARS_COUNT   = 80;
const START_FIELD_START_Z_MIN = 0.5
const START_FIELD_START_Z_MAX = 2.0
const STARFIELD_STAR_COLOR    = 0xFFffFF;
const STARFIELD_BASE_SPEED    = 50;

//------------------------------------------------------------------------------
class Starfield
    extends PIXI.Container
{
    //--------------------------------------------------------------------------
    constructor(bounds)
    {
        super();

        //
        // iVars
        // Properties
        this.graphics   = new PIXI.Graphics();
        this.bounds     = bounds;
        this.stars      = [];
        this.starsSpeed = STARFIELD_BASE_SPEED;

        //
        // Initialize.
        for(let i = 0; i < 100; ++i) {
            let star = this._CreateStar()
            this.stars.push(star);
        }

        this.addChild(this.graphics);
    } // constructor

    //--------------------------------------------------------------------------
    _CreateStar()
    {
        return {
            x : Math_RandomInt(this.bounds.x, this.bounds.width ),
            y : Math_RandomInt(this.bounds.y, this.bounds.height),
            z : Math_Random   (START_FIELD_START_Z_MIN, START_FIELD_START_Z_MAX)
        }
    } // _CreateStar

    //--------------------------------------------------------------------------
    _ResetStar(star)
    {
        star.x = 0;
        star.y = Math_RandomInt(this.bounds.y, this.bounds.height);
        star.z = Math_Random   (START_FIELD_START_Z_MIN, START_FIELD_START_Z_MAX)
    } // _ResetStar

    //--------------------------------------------------------------------------
    Update(dt)
    {
        this.graphics.clear();
        const screen_size = Get_Screen_Size();

        this.graphics.beginFill(STARFIELD_STAR_COLOR, 1);
        for(let i = 0; i < this.stars.length; ++i) {
            let star = this.stars[i];
            star.x += (this.starsSpeed * star.z) * dt;

            if(star.x > screen_size.x) {
                this._ResetStar(star);
            }

            this.graphics.drawRect(star.x, star.y, 2 * star.z, star.z);
        }
        this.graphics.endFill();
    } // update

}; // class Starfield
