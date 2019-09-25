
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
        this.pieceSpeed = 30;

        // Drawing.
        // this.width  = (BOARD_FIELD_COLUMNS * this.blockSize.x);
        // this.height = (BOARD_FIELD_ROWS    * this.blockSize.y)
    } // ctor

    //--------------------------------------------------------------------------
    Update(dt)
    {
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

        const coord_x = Math_Int(this.currPiece.x / this.blockSize.x);
        const coord_y = Math_Int(this.currPiece.y / this.blockSize.y);

        console.log(coord_x, coord_y);
        let new_coord_x = null;
        if(dir_x != 0 && this.IsCoordValid(coord_x + dir_x, coord_y)) {
            new_coord_x = coord_x + dir_x;
        }

        if(new_coord_x != null) {
            this.currPiece.x = (this.blockSize.x * new_coord_x);
        }

        // Move
        let   new_position_y = this.currPiece.y + (this.pieceSpeed * dt);
        const new_coord_y    = Math_Int(new_position_y / this.blockSize.y);
        if(new_coord_y >= BOARD_FIELD_ROWS) {
            new_position_y = (BOARD_FIELD_ROWS * this.blockSize.y);
        }
        this.currPiece.y = new_position_y;

    } // Update

    //--------------------------------------------------------------------------
    IsCoordValid(indexX, indexY)
    {
        return indexX >= 0 && indexX < BOARD_FIELD_COLUMNS
            && indexY >= 0 && indexY < BOARD_FIELD_ROWS;
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
    _SetBlockAt(piece, indexX, indexY)
    {
        let pos = this._CalculateCoordPositionInBoard(indexX, indexY);

        let s = Get_Screen_Size();
        piece.x = 0; pos.x;
        piece.y = 0; pos.y;

        piece.SetCoordInBoard(indexX, indexY);
        this.field[indexY][indexX] = piece;

        this.ascii();
    } // _SetBlockAt

    //--------------------------------------------------------------------------
    _GeneratePiece()
    {
        let piece = new Piece(this);
        this.addChild(piece);
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
