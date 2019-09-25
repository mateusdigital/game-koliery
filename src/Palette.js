const PALETTE_BLOCK_COLORS_COUNT = 10;

class Palette
{
    //--------------------------------------------------------------------------
    constructor()
    {
        this.blockColors = [];
        this._InitializeBlockColors();
    } // ctor


    //--------------------------------------------------------------------------
    GetBlockColor(colorIndex)
    {
        return this.blockColors[colorIndex];
    }

    //--------------------------------------------------------------------------
    _InitializeBlockColors()
    {
        for(let i = 0; i < PALETTE_BLOCK_COLORS_COUNT; ++i) {
            let color = 0xFFFFFF * Math_Random();
            this.blockColors.push(color);
        }
    }


}; // class Palette
