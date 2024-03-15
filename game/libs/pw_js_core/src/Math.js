//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Math.js                                                       //
//  Project   : pw_js_core                                                    //
//  Date      : Feb 28, 2020                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt 2020                                                  //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//

//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const PW_MATH_PI     = Math.PI;
const PW_MATH_2PI    = PW_MATH_PI * 2;
const MATH_PI_OVER_2 = PW_MATH_PI * 0.5;


//----------------------------------------------------------------------------//
// Functions                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const pw_Math_Cos = Math.cos;
const pw_Math_Sin = Math.sin;
const pw_Math_Int = Math.trunc;
const pw_Math_Min = Math.min;
const pw_Math_Max = Math.max;
const pw_Math_Abs = Math.abs;
const pw_Math_Pow = Math.pow


//------------------------------------------------------------------------------
function
pw_Math_IntDiv(a, b)
{
    return pw_Math_Int(a / b);
}

//------------------------------------------------------------------------------
function
pw_Math_IntMod(a, b)
{
    return pw_Math_Int(a % b);
}


//------------------------------------------------------------------------------
function
pw_Math_Clamp(m, M, v)
{
    if(v < m) return m;
    if(v > M) return M;
    return v;
}

//------------------------------------------------------------------------------
function
pw_Math_Wrap(m, M, v)
{
    if(v < m) return M;
    if(v > M) return m;
    return v;
}

//------------------------------------------------------------------------------
function
pw_Math_Lerp(v0, v1, t)
{
    return (1 - t) * v0 + t * v1;
}

//------------------------------------------------------------------------------
function
pw_Math_Normalize(value, m, M)
{
    let normalized = (value - m) / (M - m);
    return normalized;
}

//------------------------------------------------------------------------------
function
pw_Math_Denormalize(normalized, m, M)
{
    let denormalized = (normalized * (M - m) + m);
    return denormalized;
}

//------------------------------------------------------------------------------
function
pw_Math_Map(value, s1, e1, s2, e2)
{
    if(s1 == e1 || s2 == e2) {
        return e2;
    }

    let normalized   = pw_Math_Normalize  (value,      s1, e1);
    let denormalized = pw_Math_Denormalize(normalized, s2, e2);

    return pw_Math_Clamp(
        pw_Math_Min(s2, e2),
        pw_Math_Max(s2, e2),
        denormalized
    );
}


//------------------------------------------------------------------------------
function
pw_Math_Distance(x1, y1, x2, y2)
{
    let x = (x2 - x1);
    let y = (y2 - y1);
    return Math.sqrt(x*x + y*y);
}

//------------------------------------------------------------------------------
function
pw_Math_DistanceSqr(x1, y1, x2, y2)
{
    const x = (x2 - x1);
    const y = (y2 - y1);
    return x*x + y*y;
}


//------------------------------------------------------------------------------
function
pw_Math_Radians(d)
{
    return d * (PW_MATH_PI / 180);
}

//------------------------------------------------------------------------------
function
pw_Math_Degrees(r)
{
    return r * (180 / PW_MATH_PI);
}


//------------------------------------------------------------------------------
function
pw_Math_RectContainsPoint(rx, ry, rw, rh, px, py)
{
    if(px < rx     ) return false; // To the left
    if(px > rx + rw) return false; // To the right
    if(py < ry     ) return false; // To the top
    if(py > ry + rh) return false; // To the bottom

    return true;
}

//------------------------------------------------------------------------------
function
pw_Math_RectIntersects(
    rx1, ry1, rw1, rh1,
    rx2, ry2, rw2, rh2)
{
    if(rx1 + rw1 < rx2) { return false; } // r1 is on the left.
    if(ry1 + rh1 < ry2) { return false; } // r1 is on the top.
    if(rx1 > rx2 + rw2) { return false; } // r1 is on the right.
    if(ry1 > ry2 + rh2) { return false; } // r1 is on the bottom.

    return true;
}


//------------------------------------------------------------------------------
function
pw_Math_CircleContainsPoint(cx, cy, cr, px, py)
{
    return pw_Math_Distance(cx, cy, px, py) < cr;
}
