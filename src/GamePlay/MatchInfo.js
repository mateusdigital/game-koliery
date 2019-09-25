//----------------------------------------------------------------------------//
// MatchInfo                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
class MatchInfo
{
    //--------------------------------------------------------------------------
    constructor(boardRef)
    {
        //
        // iVars
        // Refs.
        this.boardRef = boardRef;
        // Properties.
        this.allMatchedBlocks = [];
        this.hasMatch         = false;
    } // CTOR

    //--------------------------------------------------------------------------
    Reset()
    {
        this.allMatchedBlocks = [];
        this.hasMatch         = false;
    } // Reset

    //--------------------------------------------------------------------------
    FindMatches(startCoord)
    {
        for(let i = 0; i < PIECE_BLOCKS_COUNT; ++i) {
            let block = this.boardRef.GetBlockAt(startCoord.x, startCoord.y - i);
            // this._CheckMatches(block);
        }

    } // FindMatches

    //--------------------------------------------------------------------------
    _CheckMatches(targetBlock)
    {
        let left_blocks = [];
        this._GetMatchingBlocks(targetBlock, POINT_LEFT , left_blocks);

        let right_blocks = [];
        this._GetMatchingBlocks(targetBlock, POINT_RIGHT, right_blocks);

        let top_blocks = [];
        this._GetMatchingBlocks(targetBlock, POINT_TOP , top_blocks);

        let bottom_blocks = [];
        this._GetMatchingBlocks(targetBlock, POINT_BOTTOM, bottom_blocks);

        let has_match = false;
        if(left_blocks.length + right_blocks.length + 1 >= 3) {
            for(let i = 0; i < left_blocks.length; ++i) {
                let cp = left_blocks[i];
                this._AddUnique(this.allMatchedBlocks, cp, (p)=>{p.objectId == cp.objectId});
            }
            for(let i = 0; i < right_blocks.length; ++i) {
                let cp = right_blocks[i];
                this._AddUnique(this.allMatchedBlocks, cp, (p)=>{p.objectId == cp.objectId});
            }
            has_match = true;
        }

        if(top_blocks.length + bottom_blocks.length + 1 >= 3) {
            for(let i = 0; i < top_blocks.length; ++i) {
                let cp = top_blocks[i];
                this._AddUnique(this.allMatchedBlocks, cp, (p)=>{p.objectId == cp.objectId});
            }
            for(let i = 0; i < bottom_blocks.length; ++i) {
                let cp = bottom_blocks[i];
                this._AddUnique(this.allMatchedBlocks, cp, (p)=>{
                    p.objectId == cp.objectId
                });
            }
            has_match = true
        }

        if(has_match) {
            this.hasMatch = true;
            this.allMatchedBlocks.push(targetBlock);
        }
    } // _CheckMatches

    //--------------------------------------------------------------------------
    _AddUnique(arr, o, f)
    {
        if(Array_Contains(arr, f)) {
            return false;
        } else {
            arr.push(o);
            return true;
        }
    } // _AddUnique

    //--------------------------------------------------------------------------
    _GetMatchingBlocks(targetBlock, dir, matchedArr)
    {
        let start_coord = targetBlock.coordInBoard.clone();
        let match_count = 0;
        while(true) {
            let curr_block = this.boardRef.GetBlockAt(
                start_coord.x + dir.x,
                start_coord.y + dir.y
            );
            // Out of bounds.
            if(curr_block == null) {
                break;
            }
            // Not same color.
            if(curr_block.colorIndex != targetBlock.colorIndex) {
                break;
            }
            // Already added to matched blocks.
            let found = Array_Contains(matchedArr, (block)=>{
                block.objectId == targetBlock.objectId;
            });
            if(found) {
                break;
            }

            matchedArr.push(curr_block);
            ++match_count;

            start_coord.x += dir.x;
            start_coord.y += dir.y;
        }
        return match_count;
    } // _GetMatchingBlocks
} // class MatchInfo
