
/// @XXX(stdmatt): Read the documentation of graphics. that there's some stuff
//  that we need to do to remove the graphics without a leak...

//----------------------------------------------------------------------------//
// Block                                                                      //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const BLOCK_COLOR_INDEX_COUNT = 2;
const BLOCK_BORDER_SIZE       = 1;
const BLOCK_DESTROY_TWEEN_DURATION_MS = 3500;
const BLOCK_DESTROY_TWEEN_EASING      = TWEEN.Easing.Circular.In

//------------------------------------------------------------------------------
let S_BLOCK_OBJECT_ID = 0;

//------------------------------------------------------------------------------
function Create_Random_Block(boardRef)
{
    let color_index = Random_Int(0, BLOCK_COLOR_INDEX_COUNT);
    let block       = new Block(boardRef, color_index);

    return block;
} // Create_Random_Block

//------------------------------------------------------------------------------
class Block
    extends PIXI.Container
{
    //--------------------------------------------------------------------------
    constructor(boardRef, colorIndex)
    {
        super();

        //
        // iVars
        // References.
        this.boardRef = boardRef;
        // HouseKeeping.
        this.objectId     = S_BLOCK_OBJECT_ID++;
        this.coordInBoard = Vector_Create(0, 0);
        this.colorIndex   = colorIndex;
        this.isDestroying = false;
        this.destroyValue = 0;

        // Drawing.
        this.graphics = new PIXI.Graphics();
        this._DrawGraphics();
        this.addChild(this.graphics);

        // Debug.
        let text = new PIXI.Text(this.objectId,{fontFamily : 'Arial', fontSize: 24, fill : 0xFFFFFF, align : 'left'});
        text.x = this.width  / 2 - text.width  / 2;
        text.y = this.height / 2 - text.height / 2;
        this.addChild(text);
    } // ctor

    //--------------------------------------------------------------------------
    SetCoordInBoard(x, y)
    {
        this.coordInBoard.set(x, y);
    } // SetCoordInBoard

    //--------------------------------------------------------------------------
    StartDestroyAnimation()
    {
        this.isDestroying = true;
        this.destroyValue = 0;

        let curr = {value: 0};
        let end  = {value: 1};

        let tween = new TWEEN.Tween(curr, this.boardRef.destroyTweenGroup)
            .to(end, BLOCK_DESTROY_TWEEN_DURATION_MS)
            .onUpdate(()=>{
                this.destroyValue = curr.value;
                this._DrawGraphics();
            })
            .onComplete(()=>{
                this.graphics.destroy();
                this.boardRef.RemoveBlock(this);
            })
            .easing(BLOCK_DESTROY_TWEEN_EASING)
            .start();
    } // StartDestroyAnimation

    //--------------------------------------------------------------------------
    _DrawGraphics()
    {
        const size  = this.boardRef.blockSize;
        const color = gPalette.GetBlockColor(this.colorIndex);

        this.graphics.clear();
        const x = BLOCK_BORDER_SIZE;
        const y = size.y * (this.destroyValue / 2) + (BLOCK_BORDER_SIZE / 2);
        const w = size.x - BLOCK_BORDER_SIZE;
        const h = size.y - (y * 2) - BLOCK_BORDER_SIZE;


        // @XXX(stdmatt): chroma get a function to get the packed rgb value.
        let a = chroma(color).darken(1).hex().substr(1);
        let b = parseInt(a, 16);

        // debugger;
        this.graphics.lineStyle(BLOCK_BORDER_SIZE * 2, b, 1);
        this.graphics.beginFill(color, 1);
            // this.graphics.drawRoundedRect(x, y, w, h, 4 * (1 - this.destroyValue));
            this.graphics.drawRect(x, y, w, h);
        this.graphics.endFill();
    }
}; // class Block
