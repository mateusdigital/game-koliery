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
const BOARD_FIELD_COLUMNS = 8;
const BOARD_FIELD_ROWS    = 22;
const BLOCK_SIZE = 32
// States : Playing
const BOARD_STATE_PLAYING = "BOARD_STATE_PLAYING";
// States : Destroying Blocks.
const BOARD_STATE_DESTROYING_PIECES          = "BOARD_STATE_DESTROYING_PIECES";
const BOARD_STATE_DESTROYING_PIECES_FINISHED = "BOARD_STATE_DESTROYING_PIECES_FINISHED";
// States : Falling Blocks.
const BOARD_STATE_FALLING_PIECES          = "BOARD_STATE_FALLING_PIECES";
const BOARD_STATE_FALLING_PIECES_FINISHED = "BOARD_STATE_FALLING_PIECES_FINISHED";

//------------------------------------------------------------------------------
class Board
    extends PIXI.Container
{
    //--------------------------------------------------------------------------
    constructor(board)
    {
        super();

        const screen_size = Get_Screen_Size();
        var bg = new PIXI.Sprite(PIXI.Texture.WHITE);
        bg.tint = 0xff0000;
        bg.alpha = 0.2;
        bg.x = 0;
        bg.y = 0;
        bg.width  = BLOCK_SIZE * BOARD_FIELD_COLUMNS;
        bg.height = BLOCK_SIZE * BOARD_FIELD_ROWS;
        this.addChild(bg);

        //
        // iVars
        // State
        this.prevState = null;
        this.currState = BOARD_STATE_PLAYING;

        // Field.
        this.field     = Array_Create2D(BOARD_FIELD_ROWS, BOARD_FIELD_COLUMNS);
        this.blockSize = Create_Point(BLOCK_SIZE, BLOCK_SIZE);

        // // Piece.
        this.currPiece = this._GeneratePiece();
        // this.nextPiece = this._GeneratePiece();
        this.pieceSpeed = 220;

        // Drawing.
        // this.width  = (BOARD_FIELD_COLUMNS * this.blockSize.x);
        // this.height = (BOARD_FIELD_ROWS    * this.blockSize.y)
    } // ctor

    //--------------------------------------------------------------------------
    Update(dt)
    {
        if(this.currPiece == null) {
            return;
        }

        this.currPiece.Update(dt);
        if(IsKeyPress(KEY_SPACE)) {
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
        let new_position_y = this.currPiece.GetBottomPositionY() + (this.pieceSpeed * dt);
        new_coord.y = Math_Int(new_position_y / this.blockSize.y);

        if(new_coord.y >= BOARD_FIELD_ROWS) {
            this.PlacePiece(this.currPiece, new_coord.x, new_coord.y);
        } else if(!this.IsBoardEmptyAt(new_coord.x, new_coord.y)) {
            this.PlacePiece(this.currPiece, new_coord.x, curr_coord.y);
        } else {
            this.currPiece.x = (new_coord.x * this.blockSize.x);
            this.currPiece.SetBottomPositionY(new_position_y);
        }
    } // Update


    //--------------------------------------------------------------------------
    PlacePiece(piece, indexX, indexY)
    {
        for(let i = 0; i < PIECE_BLOCKS_COUNT; ++i) {
            let block = piece.blocks[i];
            this._SetBlockAt(block, indexX, (indexY - i -1));
        }
        this.currPiece = null;
    } // PlacePiece

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
    _DestroyBlocks()
    {
    } // _DestroyBlocks

    //--------------------------------------------------------------------------
    _FallBlocks()
    {
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
        this.field[indexY][indexX] = null;
        this.ascii();
    } // _RemoveBlockAt

    //--------------------------------------------------------------------------
    _SetBlockAt(block, indexX, indexY)
    {
        block.parent.removeChild(block);
        this.addChild(block);

        block.x = (this.blockSize.x * indexX);
        block.y = (this.blockSize.y * indexY);

        this.field[indexY][indexX] = block;
        this.ascii();
    } // _SetBlockAt

    //--------------------------------------------------------------------------
    _GeneratePiece()
    {
        let piece = new Piece(this);
        this.addChild(piece);

        const x = (BOARD_FIELD_COLUMNS / 2) * this.blockSize.x;
        const y = (3) * this.blockSize.x;

        piece.x = x
        piece.SetBottomPositionY(y)

        return piece;
    } // _GeneratePiece

    //--------------------------------------------------------------------------
    _CalculateCoordPositionInBoard(indexX, indexY)
    {
        return Create_Point(
            this.blockSize.x * indexX + this.blockSize.x * 0.5,
            this.blockSize.y * indexY + this.blockSize.y * 0.5
        );
    } // _CalculateCoordPositionInBoard

    //--------------------------------------------------------------------------
    _ChangeState(newState)
    {
        // debugger;
        this.prevState = this.currState;
        this.currState = newState;
    } // _ChangeState

    //--------------------------------------------------------------------------
    ascii()
    {
        let s = "";
        for(let i = 0; i < BOARD_FIELD_ROWS; ++i) {
            for(let j = 0; j < BOARD_FIELD_COLUMNS; ++j) {
                let p = this.GetBlockAt(j, i);
                if(p == null) {
                    s += ". ";
                } else {
                    s += p.objectId;
                    if(p.objectId < 10) s += " ";
                }
                s += " ";
            }
            s += "\n";
        }
        console.log(s);
    }
}; // class Board
