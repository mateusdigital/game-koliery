//----------------------------------------------------------------------------//
//                       __      __                  __   __                  //
//               .-----.|  |_.--|  |.--------.---.-.|  |_|  |_                //
//               |__ --||   _|  _  ||        |  _  ||   _|   _|               //
//               |_____||____|_____||__|__|__|___._||____|____|               //
//                                                                            //
//  File      : Helpers.js                                                    //
//  Project   : match3                                                        //
//  Date      : Sep 23, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//
//                                                                            //
// Game General Functions                                                     //
//                                                                            //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Get_Screen_Size()
{
    // @TODO(stdmatt): cache the values...
    return Create_Point(GAME_DESIGN_WIDTH, GAME_DESIGN_HEIGHT);
}

//------------------------------------------------------------------------------
function Get_Texture(name)
{
    let fullname = String_Cat("res/textures/", name, ".png");
    let texture  = gPixiLoaderRes[fullname].texture;
    return texture;

    // return gSpriteSheet.textures[name];
}

//------------------------------------------------------------------------------
function Create_Sprite(textureName)
{
    return new PIXI.Sprite(Get_Texture(textureName));
}

//------------------------------------------------------------------------------
function Create_Point(x, y)
{
    return new PIXI.Point(x, y);
}

//------------------------------------------------------------------------------
function Copy_Point(p)
{
    return new PIXI.Point(p.x, p.y);
}

//------------------------------------------------------------------------------
function Points_Are_Orthogonal(p1, p2)
{
    return p1.x == p2.x || p1.y == p2.y;
}

//------------------------------------------------------------------------------
function Points_Are_Valid_For_Swap(p1, p2)
{
    if(!Points_Are_Orthogonal(p1, p2)) {
        return false;
    }

    let dx = Math.abs(p1.x - p2.x);
    let dy = Math.abs(p1.y - p2.y);

    return (dx == 1 && dy == 0)
        || (dx == 0 && dy == 1);
}

//------------------------------------------------------------------------------
const POINT_LEFT   = Create_Point(-1, 0);
const POINT_RIGHT  = Create_Point(+1, 0);
const POINT_TOP    = Create_Point(0, -1);
const POINT_BOTTOM = Create_Point(0, +1);




//------------------------------------------------------------------------------
// @notice(stdmatt): Pretty sure that we can do better with:
//    https://pixijs.download/dev/docs/PIXI.loaders.Loader.html
async function
LoadFont(fontFace, path)
{
    let font_face = new FontFace(
        fontFace,
        "url(" + path + ")"
    );
    console.log("before await");
    await font_face.load();
    document.fonts.add(font_face);
    console.log("after await");
}

//----------------------------------------------------------------------------//
//                                                                            //
// Array                                                                      //
//                                                                            //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Array_Create2D(h, w, defaultValue = null)
{
    let arr = [];
    for(let i = 0; i < h; ++i) {
        arr.push([]);
        for(let j = 0; j < w; ++j) {
            arr[i].push(defaultValue);
        }
    }
    return arr;
}


//------------------------------------------------------------------------------
function Array_Contains(arr, func)
{
    let r = arr.find(func);
    if(r == undefined) {
        return false;
    }
    return true;
}

//----------------------------------------------------------------------------//
//                                                                            //
// Math                                                                       //
//                                                                            //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Math_Int(n)
{
    return Math.trunc(n);
}

function mulberry32(a) {
    console.log("SEEEEED: ", a);
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

//------------------------------------------------------------------------------
// let s = mulberry32(Math.random() * 1000);
let s = mulberry32(122);
// let s = mulberry32(743.7057032014294); // Nice seed to test MathInfo...
function Math_Random(m, M)
{
    if(m == undefined) {
        m = 0; M = 1;
    } else if(M == undefined) {
        M = m; m = 0;
    }

    let v = s();
    return m + (v * (M - m));
}

//------------------------------------------------------------------------------
function Math_RandomInt(m, M)
{
    return Math.floor(Math_Random(m, M));
}

//----------------------------------------------------------------------------//
//                                                                            //
// String                                                                     //
//                                                                            //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function String_Cat()
{
    let s = "";
    for(let i = 0; i < arguments.length; ++i) {
        s += arguments[i];
    }
    return s;
}
