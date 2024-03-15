//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Timer.js                                                      //
//  Project   : pw_js_core                                                    //
//  Date      : Sep 10, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt 2019, 2020                                            //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//

//----------------------------------------------------------------------------//
// Timer                                                                      //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
class pw_Timer
{
    //--------------------------------------------------------------------------
    constructor(duration)
    {
        this.current  = 0;
        this.duration = duration;
        this.ratio    = 0;

        this.started = false;
        this.is_done = false;
    } // ctor

    //--------------------------------------------------------------------------
    Start()
    {
        this.current = 0;
        this.ratio   = 0;

        this.started = true;
        this.is_done = false;
    } // update

    //--------------------------------------------------------------------------
    Update(dt)
    {
        if(!this.started || this.is_done) {
            return;
        }

        this.current += dt;
        if(this.current >= this.duration) {
            this.current = this.duration;
            this.is_done  = true;
        }

        this.ratio = this.current / this.duration;
    } // update

}; // class pw_Timer
