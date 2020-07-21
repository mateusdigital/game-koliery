//----------------------------------------------------------------------------//
//                       __      __                  __   __                  //
//               .-----.|  |_.--|  |.--------.---.-.|  |_|  |_                //
//               |__ --||   _|  _  ||        |  _  ||   _|   _|               //
//               |_____||____|_____||__|__|__|___._||____|____|               //
//                                                                            //
//  File      : Piece.js                                                      //
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
// Piece                                                                      //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const PIECE_ANCHOR                   = 0.5;
const PIECE_BLOCKS_COUNT             = 3;
const PIECE_ROTATE_COOLDOWN_DURATION = 0.5;

//------------------------------------------------------------------------------
class Piece
    extends PIXI.Container
{
    //--------------------------------------------------------------------------
    constructor(boardRef)
    {
        super();

        //
        // iVars
        // Refs.
        this.boardRef = boardRef;
        // Properties
        this.blocks = [];
        this._InitializeBlocks();

        this.rotateTimer = new Base_Timer(PIECE_ROTATE_COOLDOWN_DURATION);
        this.rotateTimer.Start();

        this.coord = Vector_Create(0, 0);
    } // ctor

    //--------------------------------------------------------------------------
    Update(dt)
    {
        this.rotateTimer.Update(dt);

        this.coord.x = Math_Int(this.x                    / this.boardRef.blockSize.x);
        this.coord.y = Math_Int(this.GetBottomPositionY() / this.boardRef.blockSize.y);
    }

    //--------------------------------------------------------------------------
    Rotate()
    {
        // @XXX(stdmatt): How js handles the assignments???
        let new_arr = []
        for(let i = 0; i < PIECE_BLOCKS_COUNT; ++i) {
            let ni = (i+1) % PIECE_BLOCKS_COUNT;
            new_arr.push(this.blocks[ni]);
        }

        this.blocks = new_arr;
        this._FixBlocksPositions();

        this.rotateTimer.Start();
    }

    //--------------------------------------------------------------------------
    SetBottomPositionY(y)
    {
        this.y = (y - this.height);
    } // GetBottomPositionY

    //--------------------------------------------------------------------------
    GetBottomPositionY()
    {
        return this.y + this.height;
    } // GetBottomPositionY

    //--------------------------------------------------------------------------
    _InitializeBlocks()
    {
        for(let i = 0; i < PIECE_BLOCKS_COUNT; ++i) {
            let block = Create_Random_Block(this.boardRef);
            this.addChild(block);
            this.blocks.push(block);
        }

        this._FixBlocksPositions();
    } // _InitializeBlocks

    //--------------------------------------------------------------------------
    _FixBlocksPositions()
    {
        for(let i = 0; i < PIECE_BLOCKS_COUNT; ++i) {
            let block = this.blocks[i];
            block.y = this.boardRef.blockSize.y * (PIECE_BLOCKS_COUNT - i -1);
        }
    }
}; // class Piece
