//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Vector.js                                                     //
//  Project   : pw_js_core                                                    //
//  Date      : Mar 12, 2020                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt 2020                                                  //
//                                                                            //
//  Description :                                                             //
//---------------------------------------------------------------------------~//

//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
function pw_Vector_Zero () { return pw_Vector_Create(0, 0); }
function pw_Vector_One  () { return pw_Vector_Create(1, 1); }

function pw_Vector_Left () { return pw_Vector_Create(-1, 0); }
function pw_Vector_Right() { return pw_Vector_Create(+1, 0); }
function pw_Vector_Up   () { return pw_Vector_Create(0, -1); }
function pw_Vector_Down () { return pw_Vector_Create(0, +1); }

class pw_Vector
{
    constructor(x, y)
    {
        this.x = 0;
        this.y = 0;

        if(x != undefined) {
            this.x = x;
        }
        if(y != undefined) {
            this.y = y;
        }
    }

    Clone()
    {
        return new pw_Vector(this.x, this.y);
    }
}

//----------------------------------------------------------------------------//
// Functions                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function
pw_Vector_Mul(v, s)
{
    return pw_Vector_Create(v.x * s, v.y *s);
}

//------------------------------------------------------------------------------
function
pw_Vector_Copy(a)
{
    return pw_Vector_Create(a.x, a.y);
}

//------------------------------------------------------------------------------
function
pw_Vector_Equals(a, b)
{
    return a.x == b.x && a.y == b.y;
}

//------------------------------------------------------------------------------
function
pw_Vector_Distance(a, b)
{
    return pw_Math_Distance(a.x, a.y, b.x, b.y);
}

//------------------------------------------------------------------------------
function
pw_Vector_FromPolar(angle, mag)
{
    return pw_Vector_Create(mag * pw_Math_Cos(angle), mag * pw_Math_Sin(angle));
}

function
pw_Vector_Dot(a, b)
{
    return (a.x * b.x) + (a.y * b.y);
}


//------------------------------------------------------------------------------
function
pw_Vector_Length(v)
{
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

//------------------------------------------------------------------------------
function
pw_Vector_Unit(v)
{
    let l = pw_Vector_Length(v);
    return pw_Vector_Create(v.x / l, v.y / l);
}

//------------------------------------------------------------------------------
function
pw_Vector_Add(a, b)
{
    return pw_Vector_Create(a.x + b.x, a.y + b.y);
}

//------------------------------------------------------------------------------
function
pw_Vector_Sub(a, b)
{
    return pw_Vector_Create(a.x - b.x, a.y - b.y);
}

//------------------------------------------------------------------------------
function
pw_Vector_Create(x, y)
{
    let v = new pw_Vector(x, y);
    return v;
}
