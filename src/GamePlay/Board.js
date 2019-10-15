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
const BOARD_FIELD_COLUMNS  = 8;
const BOARD_FIELD_ROWS     = 21;
const BOARD_BLOCK_SIZE     = 27;

const BOARD_BLOCK_TIME_TO_MOVE_FAST = 0.025;
const BOARD_BLOCK_MOVE_SUBSTEPS     = 2;

const BOARD_SCORE_VALUE_MOVING_FAST = 1;
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
    constructor()
    {
        super();

        //
        // iVars
        // State
        this.paused    = true;
        this.prevState = null;
        this.currState = null;
        this._ChangeState(BOARD_STATE_GENERATING_PIECE);

        // Field.
        this.field     = Array_Create2D(BOARD_FIELD_ROWS, BOARD_FIELD_COLUMNS);
        this.blockSize = Vector_Create(BOARD_BLOCK_SIZE, BOARD_BLOCK_SIZE);

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
        this.destroyTweenGroup = Tween_CreateGroup();
        this.fallTweenGroup    = Tween_CreateGroup();

        // Score.
        this.score = 0;

        // Callbacks.
        this.onScoreChangeCallback = null;
        this.onMatchCallback       = null;

        this.blocksToTryFindMatch = [
            new Block(this, 0),
            new Block(this, 0),
            new Block(this, 0),
        ];


        for(let i = BOARD_FIELD_ROWS-1; i >= BOARD_FIELD_ROWS-12; --i) {
            for(let j = 0; j < BOARD_FIELD_COLUMNS; ++j) {
                this._SetBlockAt(Create_Random_Block(this), j, i);
            }
        }
    } // ctor


    //--------------------------------------------------------------------------
    Start()
    {
        this.paused = false;
    } // Start

    //--------------------------------------------------------------------------
    Pause()
    {
        this.paused = true;
    } // Pause


    //--------------------------------------------------------------------------
    Update(dt)
    {
        if(this.paused) {
            return;
        }

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
            this.destroyTweenGroup.update();
            if(this.destroyTweenGroup.isCompleted()) {
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
            this.fallTweenGroup.update();
            if(this.fallTweenGroup.isCompleted()) {
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
        let   new_coord  = Vector_Copy(curr_coord);

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
                ? BOARD_BLOCK_TIME_TO_MOVE_FAST
                : this.maxTimeToMove;

            new_position_y += (this.blockSize.y / BOARD_BLOCK_MOVE_SUBSTEPS);
            new_coord.y     = Math_Int(new_position_y / this.blockSize.y);

            if(this.movingFast) {
                this._AddScore(BOARD_SCORE_VALUE_MOVING_FAST)
            }
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

        if(this.matchInfo.hasMatches) {
            this.onMatchCallback();
            this._AddScore(1234);
        }
    } // _FindMatches

    //--------------------------------------------------------------------------
    _DestroyBlocks()
    {
        this._ChangeState(BOARD_STATE_DESTROYING_PIECES);

        if(!this.matchInfo.hasMatches) {
            this._ChangeState(BOARD_STATE_DESTROYING_PIECES_FINISHED);
            return;
        }

        this.destroyTweenGroup = Tween_CreateGroup();
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
    SetBlock(block, coord)
    {
        this._SetBlockAt(block, coord.x, coord.y);
    }
    //--------------------------------------------------------------------------
    RemoveBlock(block)
    {
        this._RemoveBlockAt(block.coordInBoard.x, block.coordInBoard.y);
    }

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

        block.coordInBoard = Vector_Create(indexX, indexY);
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

        // console.log("[STATE] ", this.prevState, " -> ", this.currState);
    } // _ChangeState


    //--------------------------------------------------------------------------
    _CreateDestroyBlockAnimation(block)
    {
        block.StartDestroyAnimation();
    } // _CreateDestroyBlockAnimation

    //--------------------------------------------------------------------------
    _CreateFallBlockAnimation(block, targetCoord)
    {
        block.StartFallAnimation(targetCoord);
    } // _CreateFallBlockAnimation


    //--------------------------------------------------------------------------
    _AddScore(value)
    {
        this.score += value;
        this.onScoreChangeCallback();
    }


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
