//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Shake.js                                                      //
//  Project   : pw_js_core                                                    //
//  Date      : Sep 22, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt 2019, 2020                                            //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//

//----------------------------------------------------------------------------//
// Shake                                                                      //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
class pw_Shake
{
    //--------------------------------------------------------------------------
    constructor(duration, frequency)
    {
        this.curr_time  = 0;
        this.max_time   = duration;

        this.t         = 0;
        this.frequency = frequency;

        this.samples = [];

        const sample_count = (this.max_time) * frequency;
        for(let i = 0; i < sample_count; ++i) {
            this.samples.push(Math.random() * 2 - 1);
        }

        this.is_done  = false;
        this.started = false;
    } // ctor

    //--------------------------------------------------------------------------
    Start()
    {
        this.curr_time = 0;
        this.t         = 0;
        this.is_done   = false;
        this.started   = true;
    } // Reset

    //--------------------------------------------------------------------------
    Update(dt)
    {
        if(!this.started || this.is_done) {
            return;
        }

        this.curr_time += dt;
        if(this.curr_time > this.max_time) {
            this.t       = 1.0;
            this.is_done  = true;
            this.started = false;
        }

        this.t = this.curr_time / this.max_time;
    } // Update

    //--------------------------------------------------------------------------
    Value()
    {
        if(!this.started || this.is_done) {
            return 0;
        }

        let s = this.t * this.frequency;
        let s0 = Math.floor(s);
        let s1 = s0 + 1;

        let k = (this.max_time - this.curr_time) / this.max_time;
        return (this.Noise(s0) + (s - s0)*(this.Noise(s1) - this.Noise(s0))) * k;
    } // Value

    //--------------------------------------------------------------------------
    Noise(s)
    {
        if(s >= this.samples.length) {
            return 0;
        }
        return this.samples[s];
    } // Noise
}; // class Shake
