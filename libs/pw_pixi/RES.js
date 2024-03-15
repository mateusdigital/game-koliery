//----------------------------------------------------------------------------//
// Pixi Aliases                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const _PW_PIXI_LOADER     = PIXI.Loader.shared;;
const _PW_PIXI_LOADER_RES = PIXI.Loader.shared.resources;


//------------------------------------------------------------------------------
function
pw_RES_LoadResources(callback, ...args)
{
    let expanded_args = [];
    for(let i = 0; i < args.length; ++i) {
        const curr_arg = args[i];
        if(Array.isArray(curr_arg)) {
            expanded_args = expanded_args.concat(curr_arg);
        } else {
            expanded_args.push(curr_arg);
        }
    }

    _PW_PIXI_LOADER.add(expanded_args).load(callback);

    // _pw_PIXI_LOADER.onProgress.add((_, r) => {dlog(r.name, "onProgress" )});
    // _pw_PIXI_LOADER.onError   .add((_, r) => {dlog(r.name, "onError"    )});
    // _pw_PIXI_LOADER.onLoad    .add((_, r) => {dlog(r.name, "onLoad"     )});
    // _pw_PIXI_LOADER.onComplete.add((_, r) => {dlog(r.name, "onComplete" )});
}

//----------------------------------------------------------------------------//
// Textures                                                                   //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function
pw_Texture_Get(name)
{
    const resource = _PW_PIXI_LOADER_RES[name];
    if(!resource) {
        dlog("Can't find texture - Name:(", name, ")");
        debugger;
    }

    return resource.texture;
}

//------------------------------------------------------------------------------
function
pw_Data_Get(name)
{
    const resource = _PW_PIXI_LOADER_RES[name];
    if(!resource) {
        dlog("Can't find data - Name:(", name, ")");
        debugger;
    }

    return resource.data;
}

//----------------------------------------------------------------------------//
// Fonts                                                                      //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
// @notice(stdmatt): Pretty sure that we can do better with:
//    https://pixijs.download/dev/docs/PIXI.loaders.Loader.html
async function
pw_Font_Load(fontFace, path)
{
    let font_face = new FontFace(
        fontFace,
        "url(" + path + ")"
    );

    await font_face.load();
    document.fonts.add(font_face);
}


//----------------------------------------------------------------------------//
// Sprite                                                                     //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function
pw_Sprite_Create(textureName)
{
    return new PIXI.Sprite(pw_Texture_Get(textureName));
}

//------------------------------------------------------------------------------
function
pw_Texture_GetFromCoords(texture, x, y, w, h)
{
    return new PIXI.Texture(texture, new PIXI.Rectangle(x, y, w, h));
}


//------------------------------------------------------------------------------
function
pw_Sprite_White(width, height)
{
    const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    if(width && height) {
        sprite.width  = width;
        sprite.height = height;
    }

    return sprite;
}
