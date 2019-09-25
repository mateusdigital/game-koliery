//----------------------------------------------------------------------------//
// FallInfo                                                                   //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
class FallInfo
{
    //--------------------------------------------------------------------------
    constructor(boardRef)
    {
        //
        // iVars
        // Refs.
        this.boardRef = boardRef;
        // Properties.
        this.allFallingBlocks = [];
        this.allTargetCoords  = [];
        this.hasBlocksToFall  = false;
    } // ctor

    //--------------------------------------------------------------------------
    Reset()
    {
        this.allFallingBlocks = [];
        this.allTargetCoords  = [];
        this.hasBlocksToFall  = false;
    } // Reset

    //--------------------------------------------------------------------------
    FindAllBlocksToFall(destroyedBlocksArr)
    {
        this.Reset();

        // @implementation-detail:(stdmatt):
        //   The way the the algorithm in implemented we need to check
        //   from the bottom to the top. Otherwise the top-ish blocks will not
        //   fall correctly, but just one spot.
        //
        //   To fix that we're sorting the array of destroyed blocks based
        //   upon how deep the block are in the board (p1.y > p2.y);
        destroyedBlocksArr.sort((p1, p2)=>{
            return p2.coordInBoard.y - p1.coordInBoard.y;
        });

        for(let i = 0; i < destroyedBlocksArr.length; ++i) {
            let destroyed_coord = destroyedBlocksArr[i].coordInBoard;

            // @optimization(stdmatt):
            //   We are checking the ys even we if know that
            //   they're are all nulls...
            const x = destroyed_coord.x;
            for(let y = destroyed_coord.y; y >= 0; --y) {
                let block = this._FindFirstNonNullBlock(x, y-1);
                if(block != null) {
                    this.allFallingBlocks.push(block);
                    this.allTargetCoords .push(Create_Point(x, y));
                }
            }
        }

        this.hasBlocksToFall = (this.allFallingBlocks.length != 0);
    } // FindAllBlocksToFall

    //--------------------------------------------------------------------------
    _FindFirstNonNullBlock(indexX, indexY) {
        for(let i = indexY; i >= 0; i--) {
            let block = this.boardRef.GetBlockAt(indexX, i);
            if(block != null) {
                let contains = Array_Contains(this.allFallingBlocks, (p)=>{
                   return p.objectId == block.objectId;
                });
                if(contains) {
                    continue;
                }
                return block;
            }
        }
        return null;
    } // _FindFirstNonNullBlock
}; // FallInfo
