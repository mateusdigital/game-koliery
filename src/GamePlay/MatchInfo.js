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

function _PRINT_OBJECTS_ID(col)
{
    let s ="";
    for(let i = 0; i < col.length; ++i) {
        s += col[i].blockId + ",";
    }
    // console.log(s);
}

function _SORT_OBJECTS_ID(col)
{
    col.sort((a, b)=>{
        return a.blockId - b.blockId;
    });
}

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

        let blocks_to_check = [...blocksToCheck];
        for(let i = 0; i < blocksToCheck.length; ++i) {
            // debugger;
            const block = blocksToCheck[i];
            const flood_fill_result = this._FloodFill(block, block.colorIndex);
            blocks_to_check = blocks_to_check.concat(flood_fill_result);
        }

        blocks_to_check = [...new Set(blocks_to_check)];
        _SORT_OBJECTS_ID(blocks_to_check);
        _PRINT_OBJECTS_ID(blocks_to_check);

        for(let i = 0; i < blocks_to_check.length; ++i) {
            const block = blocks_to_check[i];

            // const contains = pw_Array_Contains(this.allMatchedBlocks, (b)=>{
            //     return b.blockId == block.blockId;
            // });
            // if(contains) {
            //     continue;
            // }

            // console.log(i, " - Checking block: ", block.blockId);
            const info = this._CheckMatches(block);
            if(info.horizontal_blocks.length != 0) {
                // console.log("Horizontal");
                _PRINT_OBJECTS_ID(info.horizontal_blocks)
            }
            if(info.vertical_blocks.length != 0) {
                // console.log("vertical");
                _PRINT_OBJECTS_ID(info.vertical_blocks)
            }
            if(info.diagonal1_blocks.length != 0) {
                // console.log("diagonal1_blocks");
                _PRINT_OBJECTS_ID(info.diagonal1_blocks)
            }
            if(info.diagonal2_blocks.length != 0) {
                // console.log("diagonal2_blocks");
                _PRINT_OBJECTS_ID(info.diagonal2_blocks)
            }

            // console.log("ALL MATCHED");
            _SORT_OBJECTS_ID (this.allMatchedBlocks);
            _PRINT_OBJECTS_ID(this.allMatchedBlocks);
            // console.log("-----");
            if(info.has_match) {
                this.infos.push(info);
            }
            // debugger;
        }
    } // FindMatches

    //--------------------------------------------------------------------------
    _FloodFill(startBlock, targetColorIndex)
    {
        let matched_blocks = [];
        let coords_to_check = pw_Coords_GetSurrounding(startBlock.coordInBoard);
        for(let i = 0; i < coords_to_check.length; ++i) {
            const coord = coords_to_check[i];
            // Outside bounds.
            if(!this.boardRef.IsCoordValid(coord.x, coord.y)) {
                continue;
            }

            const block = this.boardRef.GetBlockAt(coord.x, coord.y);
            // Empty coord
            if(block == null) {
                continue;
            }

            // Not same color.
            if(block.colorIndex != targetColorIndex) {
                continue;
            }

            const test_coords = pw_Coords_GetSurrounding(block.coordInBoard);
            for(let j = 0; j < test_coords.length; ++j) {
                const test_coord = test_coords[j];
                // There's no point to try to check an invalid coord.
                if(!this.boardRef.IsCoordValid(test_coord.x, test_coord.y)) {
                    continue;
                }

                // We already processed it?
                let contains = coords_to_check.some((c)=>{
                    return (c.x == test_coord.x)
                        && (c.y == test_coord.y);
                });

                if(!contains) {
                    coords_to_check.push(test_coord);
                }
            }

            matched_blocks.push(block);
        }


        _SORT_OBJECTS_ID(matched_blocks);
        _PRINT_OBJECTS_ID(matched_blocks);
        return matched_blocks;
    } // _FloodFill

    //--------------------------------------------------------------------------
    _CheckMatches(targetBlock)
    {
        let info = {};
        info.horizontal_blocks = [];
        info.vertical_blocks   = [];
        info.diagonal1_blocks  = [];
        info.diagonal2_blocks  = [];
        info.has_match         = false;

        this._GetMatchingBlocks(targetBlock, pw_Vector_Left (), info.horizontal_blocks);
        this._GetMatchingBlocks(targetBlock, pw_Vector_Right(), info.horizontal_blocks);

        this._GetMatchingBlocks(targetBlock, pw_Vector_Up  (),   info.vertical_blocks);
        this._GetMatchingBlocks(targetBlock, pw_Vector_Down(), info.vertical_blocks);

        this._GetMatchingBlocks(targetBlock, pw_Vector_Create(-1, -1), info.diagonal1_blocks);
        this._GetMatchingBlocks(targetBlock, pw_Vector_Create(+1, +1), info.diagonal1_blocks);

        this._GetMatchingBlocks(targetBlock, pw_Vector_Create(+1, -1), info.diagonal2_blocks);
        this._GetMatchingBlocks(targetBlock, pw_Vector_Create(-1, +1), info.diagonal2_blocks);

        if(info.horizontal_blocks.length + 1 >= 3) {
            info.has_match = true;
            info.horizontal_blocks.push(targetBlock);
            _SORT_OBJECTS_ID(info.horizontal_blocks);
            this._AddUnique(info.horizontal_blocks);
        } else {
            info.horizontal_blocks = [];
        }
        if(info.vertical_blocks.length + 1 >= 3) {
            info.has_match = true;
            info.vertical_blocks.push(targetBlock);
            _SORT_OBJECTS_ID(info.vertical_blocks);
            this._AddUnique(info.vertical_blocks);
        } else {
            info.vertical_blocks = [];
        }
        if(info.diagonal1_blocks.length + 1 >= 3) {
            info.has_match = true;
            info.diagonal1_blocks.push(targetBlock);
            _SORT_OBJECTS_ID(info.diagonal1_blocks);
            this._AddUnique(info.diagonal1_blocks);
        } else {
            info.diagonal1_blocks = [];
        }
        if(info.diagonal2_blocks.length + 1 >= 3) {
            info.has_match = true;
            info.diagonal2_blocks.push(targetBlock);
            _SORT_OBJECTS_ID(info.diagonal2_blocks);
            this._AddUnique(info.diagonal2_blocks);
        } else {
            info.diagonal2_blocks = [];
        }

        if(info.has_match) {
            this.hasMatches = true;
        }

        return info;
    } // _CheckMatches

    //--------------------------------------------------------------------------
    _AddUnique(arr)
    {
        for(let i = 0; i < arr.length; ++i) {
            let cp = arr[i];
            let contains = pw_Array_Contains(this.allMatchedBlocks, (p)=>{
                return p.blockId == cp.blockId
            });
            if(!contains) {
                this.allMatchedBlocks.push(cp);
            }
        }
    } // _AddUnique

    //--------------------------------------------------------------------------
    _GetMatchingBlocks(targetBlock, dir, matchedArr)
    {
        let start_coord = targetBlock.coordInBoard.Clone();
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
            let found = pw_Array_Contains(matchedArr, (block)=>{
                block.blockId == targetBlock.blockId;
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
