//----------------------------------------------------------------------------//
//                       __      __                  __   __                  //
//               .-----.|  |_.--|  |.--------.---.-.|  |_|  |_                //
//               |__ --||   _|  _  ||        |  _  ||   _|   _|               //
//               |_____||____|_____||__|__|__|___._||____|____|               //
//                                                                            //
//  File      : MatchInfo.js                                                  //
//  Project   : columns                                                       //
//  Date      : Sep 25, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//

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
        this.infos = [];
    } // CTOR

    //--------------------------------------------------------------------------
    Reset()
    {
        this.allMatchedBlocks = [];
        this.infos            = [];
        this.hasMatches       = false;
    } // Reset

    //--------------------------------------------------------------------------
    FindMatches(blocksToCheck)
    {
        this.Reset();
        for(let i = 0; i < blocksToCheck.length; ++i) {
            const block = blocksToCheck[i];
            const info  = this._CheckMatches(block);
            this.infos.push(info);
        }
    } // FindMatches

    //--------------------------------------------------------------------------
    _CheckMatches(targetBlock)
    {
        let info = {};
        info.horizontal_blocks = [];
        info.vertical_blocks   = [];
        info.diagonal1_blocks  = [];
        info.diagonal2_blocks  = [];
        info.has_match         = false;

        this._GetMatchingBlocks(targetBlock, VECTOR_LEFT , info.horizontal_blocks);
        this._GetMatchingBlocks(targetBlock, VECTOR_RIGHT, info.horizontal_blocks);

        this._GetMatchingBlocks(targetBlock, VECTOR_TOP   , info.vertical_blocks);
        this._GetMatchingBlocks(targetBlock, VECTOR_BOTTOM, info.vertical_blocks);

        this._GetMatchingBlocks(targetBlock, Vector_Create(-1, -1), info.diagonal1_blocks);
        this._GetMatchingBlocks(targetBlock, Vector_Create(+1, +1), info.diagonal1_blocks);

        this._GetMatchingBlocks(targetBlock, Vector_Create(+1, -1), info.diagonal2_blocks);
        this._GetMatchingBlocks(targetBlock, Vector_Create(-1, +1), info.diagonal2_blocks);

        if(info.horizontal_blocks.length + 1 >= 3) {
            info.has_match = true;
            info.horizontal_blocks.push(targetBlock);
            this._AddUnique(info.horizontal_blocks);
        }
        if(info.vertical_blocks.length + 1 >= 3) {
            info.has_match = true;
            info.vertical_blocks.push(targetBlock);
            this._AddUnique(info.vertical_blocks);
        }
        if(info.diagonal1_blocks.length + 1 >= 3) {
            info.has_match = true;
            info.diagonal1_blocks.push(targetBlock);
            this._AddUnique(info.diagonal1_blocks);
        }
        if(info.diagonal2_blocks.length + 1 >= 3) {
            info.has_match = true;
            info.diagonal2_blocks.push(targetBlock);
            this._AddUnique(info.diagonal2_blocks);
        }

        if(info.has_match) {
            this.hasMatches = true;
            this.allMatchedBlocks.push(targetBlock);
        }

        return info;
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
