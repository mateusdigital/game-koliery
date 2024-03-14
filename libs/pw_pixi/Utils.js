
//-----------------------------------------------------------------------------
function
pw_Remove_From_Parent(obj)
{
    if(obj && obj.parent) {
        obj.parent.removeChild(obj);
    }
}

//-----------------------------------------------------------------------------
function
pw_Add_To_Parent(parent, ...args)
{
    // parent.addChild(args);
    for(let i = 0; i < args.length; ++i) {
        parent.addChild(args[i]);
    }
}

//-----------------------------------------------------------------------------
function
pw_Anchor_Set(obj, x, y)
{
    if(pw_Utils_IsNullOrUndefined(y)) {
        y = x;
    }

    if(obj.anchor) {
        obj.anchor.set(x, y);
    } else {
        obj.pivot.set(
            x * obj.width / obj.scale.x,
            y * obj.height / obj.scale.y
        )
    }
}

//-----------------------------------------------------------------------------
function
pw_Anchor_Center(obj)
{
    pw_Anchor_Set(obj, 0.5, 0.5);
}




class pw_Text
    extends pw_Base_BMPText
{
    constructor(str, family, size, color = "white")
    {
        const font_sizes = FONT_DEFS[family];

        let best_size = null;
        for(let i = 0; i < font_sizes.length; ++i) {
            const curr_size = font_sizes[i];
            const diff_size = pw_Math_Abs(curr_size - size);

            if(!best_size || diff_size < best_size) {
                best_size = diff_size;
            }
        }

        super(str, family, size, color);
    } // CTOR
} // class pw_Text
