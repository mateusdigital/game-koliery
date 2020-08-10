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
const PIECE_ANCHOR       = 0.5;
const PIECE_BLOCKS_COUNT = 3;

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
        this.coord  = pw_Vector_Create(0, 0);
        this.locked = false;

        this._InitializeBlocks();
    } // ctor

    //--------------------------------------------------------------------------
    Rotate()
    {
        if(this.locked) {
            return;
        }

        // @XXX(stdmatt): How js handles the assignments???
        let new_arr = []
        for(let i = 0; i < PIECE_BLOCKS_COUNT; ++i) {
            let ni = (i+1) % PIECE_BLOCKS_COUNT;
            new_arr.push(this.blocks[ni]);
        }

        this.blocks = new_arr;
        this._FixBlocksPositions();
    } // Rotate

    //--------------------------------------------------------------------------
    MoveHorizontal(dir)
    {
        if(this.locked) {
            return;
        }

        this.x += (this.boardRef.blockSize.x * dir);
        this.UpdateCoords();
    } // MoveHorizontal

    //--------------------------------------------------------------------------
    UpdateCoords()
    {
        const x = this.x;
        const y = this.y + (this.boardRef.blockSize.y * PIECE_BLOCKS_COUNT);
        this.coord.x = pw_Math_Int(x / this.boardRef.blockSize.x);
        this.coord.y = pw_Math_Int(y / this.boardRef.blockSize.y);
    } // UpdateCoords

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
    } // _FixBlocksPositions

}; // class Piece
