//----------------------------------------------------------------------------//
//                       __      __                  __   __                  //
//               .-----.|  |_.--|  |.--------.---.-.|  |_|  |_                //
//               |__ --||   _|  _  ||        |  _  ||   _|   _|               //
//               |_____||____|_____||__|__|__|___._||____|____|               //
//                                                                            //
//  File      : Board.js                                                      //
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
// Board                                                                      //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const BOARD_FIELD_COLUMNS     = 8;
const BOARD_FIELD_ROWS        = 21;
const BLOCK_SIZE              = 27
const BLOCK_TIME_TO_MOVE_FAST = 0.025;
const BLOCK_MOVE_SUBSTEPS     = 2;
// Tweens
const BOARD_DESTROY_PIECES_TWEEN_TIME_MS = 500;
const BOARD_FALL_PIECES_TWEEN_TIME_MS    = 500;
const BOARD_DESTROY_EASING               = TWEEN.Easing.Circular.In
const BOARD_FALL_EASING                  = TWEEN.Easing.Back.Out
// State: Playing / Game Over
const BOARD_STATE_PLAYING                    = "BOARD_STATE_PLAYING";
const BOARD_STATE_GAME_OVER                  = "BOARD_STATE_GAME_OVER";
// State: Generating Piece
const BOARD_STATE_GENERATING_PIECE           = "BOARD_STATE_GENERATING_PIECE";
const BOARD_STATE_GENERATING_PIECE_FINISHED  = "BOARD_STATE_GENERATING_PIECE_FINISHED";
// State: Placing Piece
const BOARD_STATE_PLACING_PIECE              = "BOARD_STATE_PLACING_PIECE";
const BOARD_STATE_PLACING_PIECE_FINISHED     = "BOARD_STATE_PLACING_PIECE_FINISHED";
// State: Finding Matches
const BOARD_STATE_FINDING_MATCHES            = "BOARD_STATE_FINDING_MATCHES";
const BOARD_STATE_FINDING_MATCHES_FINISHED   = "BOARD_STATE_FINDING_MATCHES_FINISHED";
// State: Destroying Pieces
const BOARD_STATE_DESTROYING_PIECES          = "BOARD_STATE_DESTROYING_PIECES";
const BOARD_STATE_DESTROYING_PIECES_FINISHED = "BOARD_STATE_DESTROYING_PIECES_FINISHED";
// State: Finding Fall
const BOARD_STATE_FINDING_FALL               = "BOARD_STATE_FINDING_FALL";
const BOARD_STATE_FINDING_FALL_FINISHED      = "BOARD_STATE_FINDING_FALL_FINISHED";
// State: Falling Pieces
const BOARD_STATE_FALLING_PIECES             = "BOARD_STATE_FALLING_PIECES";
const BOARD_STATE_FALLING_PIECES_FINISHED    = "BOARD_STATE_FALLING_PIECES_FINISHED";


//------------------------------------------------------------------------------
class Board
    extends PIXI.Container
{
    //--------------------------------------------------------------------------
    constructor(board)
    {
        super();

        //
        // iVars
        // State
        this.prevState = null;
        this.currState = null;
        this._ChangeState(BOARD_STATE_GENERATING_PIECE);

        // Field.
        this.field     = Array_Create2D(BOARD_FIELD_ROWS, BOARD_FIELD_COLUMNS);
        this.blockSize = Create_Point(BLOCK_SIZE, BLOCK_SIZE);

        // Infos.
        this.matchInfo            = new MatchInfo(this);
        this.fallInfo             = new FallInfo (this);
        this.blocksToTryFindMatch = null;

        // Piece.
        this.currPiece           = null;
        this.currPiecePlaceCoord = null;
        this.currTimeToMove      = 0;
        this.maxTimeToMove       = 0.5;
        this.movingFast          = false;

        // Tweens.
        this.destroyTweenGroup = new TWEEN.Group();
        this.fallTweenGroup    = new TWEEN.Group();
    } // ctor


    //--------------------------------------------------------------------------
    Update(dt)
    {
        // State : Playing / Game Over
        if(this.currState == BOARD_STATE_PLAYING) {
            this._UpdateState_Playing(dt);
        }
        else if(this.currState == BOARD_STATE_GAME_OVER) {

        }

        //
        // State : Generating Piece
        else if(this.currState == BOARD_STATE_GENERATING_PIECE) {
            this._GeneratePiece();
        }
        else if(this.currState == BOARD_STATE_GENERATING_PIECE_FINISHED) {
            this._ChangeState(BOARD_STATE_PLAYING);
        }

        //
        // State: Placing Piece
        else if(this.currState == BOARD_STATE_PLACING_PIECE) {
            this._PlacePiece();
        }
        else if(this.currState == BOARD_STATE_PLACING_PIECE_FINISHED) {
            this._ChangeState(BOARD_STATE_FINDING_MATCHES);
        }

        //
        // State: Finding Matches
        else if(this.currState == BOARD_STATE_FINDING_MATCHES) {
            this._FindMatches();
        }
        else if(this.currState == BOARD_STATE_FINDING_MATCHES_FINISHED) {
            if(this.matchInfo.hasMatches) {
                this._DestroyBlocks();
            } else {
                this._CheckGameOver();
            }
        }

        //
        // State : Destroying Pieces
        else if(this.currState == BOARD_STATE_DESTROYING_PIECES) {
            const done = (this.destroyTweenGroup.update() == false);
            if(done) {
                this._ChangeState(BOARD_STATE_DESTROYING_PIECES_FINISHED);
            }
        }
        else if(this.currState == BOARD_STATE_DESTROYING_PIECES_FINISHED) {
            this._ChangeState(BOARD_STATE_FINDING_FALL);
        }

        //
        // State : Find Falling Pieces
        else if(this.currState == BOARD_STATE_FINDING_FALL) {
            this._FindBlocksToFall();
        }
        else if(this.currState == BOARD_STATE_FINDING_FALL_FINISHED) {
            if(this.fallInfo.hasBlocksToFall) {
                this._FallBlocks();
            } else {
                this._ChangeState(BOARD_STATE_GENERATING_PIECE);
            }
        }

        //
        // State : Falling Pieces
        else if(this.currState == BOARD_STATE_FALLING_PIECES) {
            const done = (this.fallTweenGroup.update() == false);
            if(done) {
                this._ChangeState(BOARD_STATE_FALLING_PIECES_FINISHED);
            }
        }
        else if(this.currState == BOARD_STATE_FALLING_PIECES_FINISHED) {
            this.blocksToTryFindMatch = this.fallInfo.allFallingBlocks;
            this._ChangeState(BOARD_STATE_FINDING_MATCHES);
        }
    } // Update

    //--------------------------------------------------------------------------
    _UpdateState_Playing(dt)
    {
        if(IsKeyDown(KEY_SPACE) && !this.movingFast) {
            this.currTimeToMove = 0;
            this.movingFast     = true;
        } else if(IsKeyUp(KEY_SPACE) && this.movingFast) {
            this.movingFast = false;
        }

        this.currPiece.Update(dt);
        if(IsKeyPress(KEY_ARROW_DOWN) || IsKeyPress(KEY_ARROW_UP)) {
            this.currPiece.Rotate();
        }

        let dir_x = 0;
        if(IsKeyPress(KEY_ARROW_LEFT)) {
            dir_x = -1;
        } else if(IsKeyPress(KEY_ARROW_RIGHT)) {
            dir_x = +1;
        }

        const curr_coord = this.currPiece.coord;
        let   new_coord  = Copy_Point(curr_coord);

        //
        // Try to move horizontally.
        //   Horizontal movement is block based - So we just check if there's
        //   room to move and set the new coord to that position.
        if(dir_x != 0                                 &&
           this.IsCoordXValid (curr_coord.x + dir_x)  &&
           this.IsBoardEmptyAt(curr_coord.x + dir_x, curr_coord.y))
        {
            new_coord.x = (curr_coord.x + dir_x)
        }

        //
        // Try to move vertically.
        //   Vertical movement is "pixel" based - So we need to move the piece
        //   by that amount of pixels and check if the resulting coord is valid.
        let new_position_y = this.currPiece.GetBottomPositionY();

        this.currTimeToMove -= dt;
        if(this.currTimeToMove <= 0) {
            this.currTimeToMove += (this.movingFast)
                ? BLOCK_TIME_TO_MOVE_FAST
                : this.maxTimeToMove;

            new_position_y += (BLOCK_SIZE / BLOCK_MOVE_SUBSTEPS);
            new_coord.y = Math_Int(new_position_y / this.blockSize.y);
        }

        if(new_coord.y >= BOARD_FIELD_ROWS ||
           !this.IsBoardEmptyAt(new_coord.x, new_coord.y))
        {
            this.currPiecePlaceCoord = new_coord;
            this._ChangeState(BOARD_STATE_PLACING_PIECE);
        } else {
            this.currPiece.x = (new_coord.x * this.blockSize.x);
            this.currPiece.SetBottomPositionY(new_position_y);
        }
    } // _UpdateState_Playing


    //--------------------------------------------------------------------------
    IsBoardEmptyAt(indexX, indexY)
    {
        return this.GetBlockAt(indexX, indexY) == null;
    } // IsBoardEmptyAt

    //--------------------------------------------------------------------------
    IsCoordXValid(indexX)
    {
        return indexX >= 0 && indexX < BOARD_FIELD_COLUMNS;
    } // IsCoordXValid

    //--------------------------------------------------------------------------
    IsCoordYValid(indexY)
    {
        return indexY >= 0 && indexY < BOARD_FIELD_ROWS;
    } // IsCoordYValid

    //--------------------------------------------------------------------------
    IsCoordValid(indexX, indexY)
    {
        return this.IsCoordXValid(indexX) && this.IsCoordYValid(indexY);
    } // IsValidCoord


    //--------------------------------------------------------------------------
    _GeneratePiece()
    {
        let piece = new Piece(this);
        this.addChild(piece);

        const x = (BOARD_FIELD_COLUMNS / 2) * this.blockSize.x;
        const y = (3) * this.blockSize.x;

        piece.x = x
        piece.SetBottomPositionY(y)

        this.currPiece = piece;
        this._ChangeState(BOARD_STATE_GENERATING_PIECE_FINISHED);
    } // _GeneratePiece

    //--------------------------------------------------------------------------
    _PlacePiece()
    {
        const index_x = this.currPiecePlaceCoord.x;
        const index_y = this.currPiecePlaceCoord.y;

        this.blocksToTryFindMatch = [];
        for(let i = 0; i < PIECE_BLOCKS_COUNT; ++i) {
            let block = this.currPiece.blocks[i];

            this.blocksToTryFindMatch.push(block);
            this._SetBlockAt(block, index_x, (index_y - i -1));
        }

        // Reset the state vars...
        this.currPiece           = null;
        this.currPiecePlaceCoord = null;

        this._ChangeState(BOARD_STATE_PLACING_PIECE_FINISHED);
    } // _PlacePiece

    //--------------------------------------------------------------------------
    _FindMatches()
    {
        this.matchInfo.FindMatches(this.blocksToTryFindMatch);
        this._ChangeState(BOARD_STATE_FINDING_MATCHES_FINISHED);
    } // _FindMatches

    //--------------------------------------------------------------------------
    _DestroyBlocks()
    {
        this._ChangeState(BOARD_STATE_DESTROYING_PIECES);

        if(!this.matchInfo.hasMatches) {
            this._ChangeState(BOARD_STATE_DESTROYING_PIECES_FINISHED);
            return;
        }

        for(let i = 0; i < this.matchInfo.allMatchedBlocks.length; ++i) {
            let block = this.matchInfo.allMatchedBlocks[i];
            this._CreateDestroyBlockAnimation(block);
        }
    } // _DestroyBlocks

    //--------------------------------------------------------------------------
    _FindBlocksToFall()
    {
        this.fallInfo.FindAllBlocksToFall(this.matchInfo.allMatchedBlocks);
        this._ChangeState(BOARD_STATE_FINDING_FALL_FINISHED);
    }

    //--------------------------------------------------------------------------
    _FallBlocks()
    {
        this._ChangeState(BOARD_STATE_FALLING_PIECES);

        if(!this.fallInfo.hasBlocksToFall) {
            this._ChangeState(BOARD_STATE_FALLING_PIECES_FINISHED);
            return;
        }

        for(let i = 0; i < this.fallInfo.allFallingBlocks.length; ++i) {
            let block = this.fallInfo.allFallingBlocks[i];
            let coord = this.fallInfo.allTargetCoords [i];

            this._CreateFallBlockAnimation(block, coord);
        }
    } // _FallBlocks


    //--------------------------------------------------------------------------
    GetBlockAt(indexX, indexY)
    {
        if(!this.IsCoordValid(indexX, indexY)) {
            return null;
        }
        return this.field[indexY][indexX];
    } // GetBlockAt

    //--------------------------------------------------------------------------
    _RemoveBlockAt(indexX, indexY)
    {
        let block = this.field[indexY][indexX];
        if(block != null && block.parent != null) {
            block.parent.removeChild(block);
        }

        this.field[indexY][indexX] = null;

        // this.ascii();
    } // _RemoveBlockAt

    //--------------------------------------------------------------------------
    _SetBlockAt(block, indexX, indexY)
    {
        if(block.parent != null) {
            block.parent.removeChild(block);
        }
        this.addChild(block);

        block.x = (this.blockSize.x * indexX);
        block.y = (this.blockSize.y * indexY);

        block.coordInBoard = Create_Point(indexX, indexY);
        this.field[indexY][indexX] = block;

        // this.ascii();
    } // _SetBlockAt


    //--------------------------------------------------------------------------
    _CheckGameOver()
    {
        for(let j = 0; j < BOARD_FIELD_COLUMNS; ++j) {
            if(this.GetBlockAt(j, 0) != null) {
               this._ChangeState(BOARD_STATE_GAME_OVER);
               return;
            }
        }

        this._ChangeState(BOARD_STATE_GENERATING_PIECE);
    }

    //--------------------------------------------------------------------------
    _ChangeState(newState)
    {
        // debugger;
        this.prevState = this.currState;
        this.currState = newState;

        console.log("[STATE] ", this.prevState, " -> ", this.currState);
    } // _ChangeState


    //--------------------------------------------------------------------------
    _CreateDestroyBlockAnimation(block)
    {
        let curr = {value: 0};
        let end  = {value: 1};

        block.StartDestroyAnimation();
        let tween = new TWEEN.Tween(curr, this.destroyTweenGroup)
            .to(end, BOARD_DESTROY_PIECES_TWEEN_TIME_MS)
            .onUpdate(()=>{
                block.SetDestroyAnimationValue(curr.value);
            })
            .onComplete(()=>{
                // @XXX(stdmatt): Destroy piece....
                this._RemoveBlockAt(block.coordInBoard.x, block.coordInBoard.y);
            })
            .easing(BOARD_DESTROY_EASING)
            .start();
    } // _CreateDestroyBlockAnimation

    //--------------------------------------------------------------------------
    _CreateFallBlockAnimation(block, targetCoord)
    {
        let position = Copy_Point(block.position);
        let target   = Create_Point(position.x, targetCoord.y * this.blockSize.y);

        let tween = new TWEEN.Tween(position, this.fallTweenGroup)
            .to(target, BOARD_FALL_PIECES_TWEEN_TIME_MS)
            .onUpdate(()=>{
                block.x = position.x;
                block.y = position.y;
            })
            .onComplete(()=>{
               this._RemoveBlockAt(block.coordInBoard.x, block.coordInBoard.y);
               this._SetBlockAt(block, targetCoord.x, targetCoord.y);
            })
            .easing(BOARD_FALL_EASING)
            .start();

    } // _CreateFallBlockAnimation


    //--------------------------------------------------------------------------
    ascii()
    {
        let s = "";
        for(let i = 0; i < BOARD_FIELD_ROWS; ++i) {
            if(i < 10) {
                s += " ";
            }

            s += String_Cat(" (", i, ") ");
            for(let j = 0; j < BOARD_FIELD_COLUMNS; ++j) {
                let p = this.GetBlockAt(j, i);
                if(p == null) {
                    s += ". ";
                } else {
                    // let v = p.objectId;
                    let v = p.colorIndex;
                    s += v;
                    if(v < 10) s += " ";
                }
                s += " ";
            }
            s += String_Cat(" (", i, ")\n")
        }
        console.log(s);
    }
}; // class Board
