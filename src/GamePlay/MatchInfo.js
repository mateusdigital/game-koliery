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
        this.hasMatches       = false;
    } // CTOR

    //--------------------------------------------------------------------------
    Reset()
    {
        this.allMatchedBlocks = [];
        this.hasMatches         = false;
    } // Reset

    //--------------------------------------------------------------------------
    FindMatches(blocksToCheck)
    {
        this.Reset();
        for(let i = 0; i < blocksToCheck.length; ++i) {
            let block = blocksToCheck[i];
            this._CheckMatches(block);
        }
    } // FindMatches

    //--------------------------------------------------------------------------
    _CheckMatches(targetBlock)
    {
        let horizontal_blocks = [];
        this._GetMatchingBlocks(targetBlock, POINT_LEFT , horizontal_blocks);
        this._GetMatchingBlocks(targetBlock, POINT_RIGHT, horizontal_blocks);

        let vertical_blocks = [];
        this._GetMatchingBlocks(targetBlock, POINT_TOP   , vertical_blocks);
        this._GetMatchingBlocks(targetBlock, POINT_BOTTOM, vertical_blocks);

        let diagonal1_blocks = [];
        this._GetMatchingBlocks(targetBlock, Create_Point(-1, -1), diagonal1_blocks);
        this._GetMatchingBlocks(targetBlock, Create_Point(+1, +1), diagonal1_blocks);

        let diagonal2_blocks = [];
        this._GetMatchingBlocks(targetBlock, Create_Point(+1, -1), diagonal2_blocks);
        this._GetMatchingBlocks(targetBlock, Create_Point(-1, +1), diagonal2_blocks);

        let has_match = false;
        if(horizontal_blocks.length + 1 >= 3) {
            has_match = true;
            this._AddUnique(horizontal_blocks);
        }
        if(vertical_blocks.length + 1 >= 3) {
            has_match = true;
            this._AddUnique(vertical_blocks);
        }
        if(diagonal1_blocks.length + 1 >= 3) {
            has_match = true;
            this._AddUnique(diagonal1_blocks);
        }
        if(diagonal2_blocks.length + 1 >= 3) {
            has_match = true;
            this._AddUnique(diagonal2_blocks);
        }

        if(has_match) {
            this.hasMatches = true;
            this.allMatchedBlocks.push(targetBlock);
        }
    } // _CheckMatches

    //--------------------------------------------------------------------------
    _AddUnique(arr)
    {
        for(let i = 0; i < arr.length; ++i) {
            let cp = arr[i];
            let contains = Array_Contains(this.allMatchedBlocks, (p)=>{p.objectId == cp.objectId});
            if(!contains) {
                this.allMatchedBlocks.push(cp);
            }
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
