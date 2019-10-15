
/// @XXX(stdmatt): Read the documentation of graphics. that there's some stuff
//  that we need to do to remove the graphics without a leak...

//----------------------------------------------------------------------------//
// Block                                                                      //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const BLOCK_COLOR_INDEX_COUNT = 5;
const BLOCK_BORDER_SIZE       = 1;

// Tweens
const BLOCK_DESTROY_TWEEN_DURATION_MS = 500;
const BLOCK_DESTROY_TWEEN_EASING      = TWEEN.Easing.Circular.In

const BLOCK_FALL_TWEEN_DURATION_MS = 600;
const BLOCK_FALL_TWEEN_EASING      = TWEEN.Easing.Back.Out

const BLOCK_BLINK_TWEEN_DURATION_MS       = 150;
const BLOCK_BLINK_TWEEN_BLINK_COUNT       = 2;
const BLOCK_BLINK_TWEEN_BLINK_DURATION_MS = (BLOCK_BLINK_TWEEN_DURATION_MS / BLOCK_BLINK_TWEEN_BLINK_COUNT);


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

        const size = Vector_Copy(this.boardRef.blockSize);
        size.x -= 0;
        size.y -= 1;

        this.sprite = Sprite_White(size);
        Apply_BlockTintEffect(this.sprite, gPalette.GetBlockColor(this.colorIndex));
        this.addChild(this.sprite);

        // Debug.
        // let text = new PIXI.Text(this.objectId,{fontFamily : 'Arial', fontSize: 24, fill : 0xFFFFFF, align : 'left'});
        // text.x = this.width  / 2 - text.width  / 2;
        // text.y = this.height / 2 - text.height / 2;
        // this.addChild(text);
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

        const blink  = this._CreateBlinkAnimation();
        blink.start();
    } // StartDestroyAnimation

    //--------------------------------------------------------------------------
    StartFallAnimation(targetCoord)
    {
        let position = Vector_Copy(this.position);
        let target   = Vector_Create(position.x, targetCoord.y * this.boardRef.blockSize.y);

        // debugger;
        let tween = new TWEEN.Tween(position, this.boardRef.fallTweenGroup)
            .to(target, BLOCK_FALL_TWEEN_DURATION_MS)
            .onUpdate(()=>{
                this.x = position.x;
                this.y = position.y;
            })
            .onComplete(()=>{
               this.boardRef.RemoveBlock(this);
               this.boardRef.SetBlock(this, targetCoord);
            })
            .easing(BLOCK_FALL_TWEEN_EASING)
            .start();
    }


    //--------------------------------------------------------------------------
    _CreateSquashAnimation()
    {
        let tween = Tween_CreateBasic(
            BLOCK_DESTROY_TWEEN_DURATION_MS,
            this.boardRef.destroyTweenGroup
        )
        .onComplete(()=>{
            this.boardRef.RemoveBlock(this);
        })
        .easing(BLOCK_DESTROY_TWEEN_EASING)

        return tween;
    } // _CreateSquashAnimation

    //--------------------------------------------------------------------------
    _CreateBlinkAnimation()
    {
        // @notice(stdmatt): Just to make easier to think how much the block
        // should blink. So when we think that it needs to blink 2 times,
        // we need to actually blink 4, because the tween actually "counts"
        // each transition as a blink.
        const repeat_ms = (BLOCK_BLINK_TWEEN_BLINK_COUNT  % 2 == 0)
            ? BLOCK_BLINK_TWEEN_BLINK_COUNT + 2
            : BLOCK_BLINK_TWEEN_BLINK_COUNT + 1;

        let tween = Tween_CreateBasic(
            BLOCK_BLINK_TWEEN_BLINK_DURATION_MS
        )
        .repeat(repeat_ms)
        .yoyo(true)
        .onRepeat(()=>{
            const color = (!tween._reversed)
                ? gPalette.GetBlockColor     (this.colorIndex)
                : gPalette.GetBlockBlinkColor(this.colorIndex);

            this.sprite.blockTintEffect.SetColor(color);
        })
        .onComplete(()=>{
            const squash = this._CreateSquashAnimation();
            Apply_BlockSquashEffect(this.sprite, squash);
            squash.start();
        });

        return tween;
    } // _CreateBlinkAnimation
}; // class Block
