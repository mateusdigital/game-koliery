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
const BOARD_FIELD_COLS = 8;
const BOARD_FIELD_ROWS = 21;
const BOARD_BLOCK_SIZE = 27;

const BOARD_BLOCK_TIME_TO_MOVE_FAST = 0.025;
const BOARD_BLOCK_MOVE_SUBSTEPS     = 10;

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
    constructor(progressionHandler)
    {
        super();

        //
        // iVars
        // State
        this.paused             = true;
        this.prevState          = null;
        this.currState          = null;
        this.progressionHandler = progressionHandler;

        // Field.
        this.field     = pw_Array_Create2D(BOARD_FIELD_ROWS, BOARD_FIELD_COLS);
        this.blockSize = pw_Vector_Create (BOARD_BLOCK_SIZE, BOARD_BLOCK_SIZE);

        // Infos.
        this.matchInfo            = new MatchInfo(this);
        this.fallInfo             = new FallInfo (this);
        this.blocksToTryFindMatch = null;

        // Piece.
        this.currPiece           = null;
        this.currPiecePlaceCoord = null;
        this.movingFast          = false;

        // Tweens.
        this.destroyTweenGroup = pw_Tween_CreateGroup();
        this.fallTweenGroup    = pw_Tween_CreateGroup();

        //
        // Initialize.
        this._ChangeState(BOARD_STATE_GENERATING_PIECE);


        //
        // Create the Filler and the Mask for the board.
        {
            const board_height = BOARD_FIELD_ROWS * BOARD_BLOCK_SIZE;
            const board_width  = BOARD_FIELD_COLS * BOARD_BLOCK_SIZE;

            // Filler
            // @notice: We need that because PIXI.js containers can't have
            // a size without have children, and we need a specific size
            // to make the positions to work correct.
            this.board_filler_sprite = pw_Sprite_White(board_width, board_height);
            this.board_filler_sprite.tint  = 0xFF00FF;
            this.board_filler_sprite.alpha = 0;
            this.board_filler_sprite.x     = 0;
            this.board_filler_sprite.y     = 0;

            // Mask
            // @notice: This is what will make the blocks to not appear on the
            // screen until the entered the actual board spoce.
            this.board_mask_sprite      = pw_Sprite_White(board_width, board_height);
            this.board_mask_sprite.tint = 0x000000;
            this.board_mask_sprite.x  = 0;
            this.board_mask_sprite.y  = 0;

            pw_Add_To_Parent(this, this.board_filler_sprite, this.board_mask_sprite);
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
            return;
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
        if(!this.movingFast && pw_Keyboard_IsDown(PW_KEY_SPACE)) {
            this.movingFast     = true;
            gAudio.PlayEffect(RES_AUDIO_PIECE_MOVE_WAV);
            console.log("FAST");
        } else if(pw_Keyboard_IsUp(PW_KEY_SPACE) && this.movingFast) {
            this.movingFast = false;

            console.log("SLOW");
        }

        if(pw_Keyboard_IsClick(PW_KEY_ARROW_DOWN) || pw_Keyboard_IsClick(PW_KEY_ARROW_UP)) {
            console.log("cick")
            gAudio.PlayEffect(RES_AUDIO_PIECE_ROTATE_WAV);
            this.currPiece.Rotate();
        }

        if(this.movingFast) {
            this.progressionHandler.AddScoreForMovingFast();
        }

        //
        // Try to move horizontally.
        {
            let dir_x = 0;
            if(pw_Keyboard_IsClick(PW_KEY_ARROW_LEFT)) {
                gAudio.PlayEffect(RES_AUDIO_PIECE_MOVE_WAV);
                dir_x = -1;
            } else if(pw_Keyboard_IsClick(PW_KEY_ARROW_RIGHT)) {
                gAudio.PlayEffect(RES_AUDIO_PIECE_MOVE_WAV);
                dir_x = +1;
            }

            const curr_coord = this.currPiece.coord;
            if(dir_x != 0                                 &&
               this.IsCoordXValid (curr_coord.x + dir_x)  &&
               this.IsBoardEmptyAt(curr_coord.x + dir_x, curr_coord.y))
            {
                this.currPiece.MoveHorizontal(dir_x);
            }
        }

        //
        // Try to move vertically.
        {
            const speed = (this.movingFast)
                ? this.progressionHandler.pieceFastSpeed
                : this.progressionHandler.pieceSpeed;

            this.currPiece.y += (speed * dt)
            this.currPiece.UpdateCoords();

            if(this.currPiece.coord.y >= BOARD_FIELD_ROWS ||
               !this.IsBoardEmptyAt(this.currPiece.coord.x, this.currPiece.coord.y))
            {
                this.currPiecePlaceCoord = pw_Vector_Copy(this.currPiece.coord);
                this._ChangeState(BOARD_STATE_PLACING_PIECE);
            }
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
        return indexX >= 0 && indexX < BOARD_FIELD_COLS;
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
        const piece = new Piece(this);
        this.addChild(piece);

        const x = (BOARD_FIELD_COLS / 2) * this.blockSize.x;
        const y = -this.blockSize.y * 0.5; //PIECE_BLOCKS_COUNT * this.blockSize.x;

        piece.x = x;
        piece.y = y;

        this.currPiece = piece;
        this._ChangeState(BOARD_STATE_GENERATING_PIECE_FINISHED);
    } // _GeneratePiece

    //--------------------------------------------------------------------------
    _PlacePiece()
    {
        this.currPiece.locked = true; // Prevent the piece to do anything else.

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

        gAudio.PlayEffect(RES_AUDIO_PIECE_PLACE_WAV);
        this._ChangeState(BOARD_STATE_PLACING_PIECE_FINISHED);
    } // _PlacePiece

    //--------------------------------------------------------------------------
    _FindMatches()
    {
        // debugger;
        this.matchInfo.FindMatches(this.blocksToTryFindMatch);
        this._ChangeState(BOARD_STATE_FINDING_MATCHES_FINISHED);

        if(this.matchInfo.hasMatches) {
            this.progressionHandler.AddScoreWithMatchInfo(this.matchInfo);
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

        gAudio.PlayEffect(RES_AUDIO_PIECE_DESTROY_WAV);
        this.destroyTweenGroup = pw_Tween_CreateGroup();
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

        block.coordInBoard = pw_Vector_Create(indexX, indexY);
        this.field[indexY][indexX] = block;
        // this.ascii();
    } // _SetBlockAt

    //--------------------------------------------------------------------------
    _CheckGameOver()
    {
        for(let j = 0; j < BOARD_FIELD_COLS; ++j) {
            if(this.GetBlockAt(j, 0) != null) {
               this._ChangeState(BOARD_STATE_GAME_OVER);
               return;
            }
        }

        this._ChangeState(BOARD_STATE_GENERATING_PIECE);
    }

    //--------------------------------------------------------------------------
    GetState()
    {
        return this.currState;
    } // GetState

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
    ascii()
    {
        let s = "";
        for(let i = 0; i < BOARD_FIELD_ROWS; ++i) {
            if(i < 10) {
                s += " ";
            }

            s += pw_String_Cat(" (", i, ") ");
            for(let j = 0; j < BOARD_FIELD_COLS; ++j) {
                let p = this.GetBlockAt(j, i);
                if(p == null) {
                    s += ". ";
                } else {
                    // let v = p.blockId;
                    let v = p.colorIndex;
                    s += v;
                    if(v < 10) s += " ";
                }
                s += " ";
            }
            s += pw_String_Cat(" (", i, ")\n")
        }
        console.log(s);
    }
}; // class Board
