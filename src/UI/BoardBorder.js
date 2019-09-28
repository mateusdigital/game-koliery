//----------------------------------------------------------------------------//
//                       __      __                  __   __                  //
//               .-----.|  |_.--|  |.--------.---.-.|  |_|  |_                //
//               |__ --||   _|  _  ||        |  _  ||   _|   _|               //
//               |_____||____|_____||__|__|__|___._||____|____|               //
//                                                                            //
//  File      : BoardBorder.js                                                //
//  Project   : columns                                                       //
//  Date      : Sep 27, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//

class BoardBorder
    extends PIXI.Container
{
    //--------------------------------------------------------------------------
    constructor(boardRef)
    {
        super();
        //
        // iVars.
        // Properties.
        this.boardRef = boardRef;
        this.graphics = new PIXI.Graphics();

        //
        // Initialize.
        this._DrawGraphics();

        // Make the board be positioned inside the border...
        this.boardRef.x = this.boardRef.blockSize.x;
        this.boardRef.y = this.boardRef.blockSize.y / 2;

        this.addChild(this.graphics);
        this.addChild(this.boardRef);
    } // ctor

    //--------------------------------------------------------------------------
    _DrawGraphics()
    {
        const blocks_y_count = (BOARD_FIELD_ROWS    * 2) + 3;
        const blocks_x_count = (BOARD_FIELD_COLUMNS * 2) + 4;
        const block_size     = (this.boardRef.blockSize.x / 2);
        const colors         = gPalette.GetBlockColors();

        for(let i = 0; i < blocks_y_count; ++i) {
            for(let j = 0; j < blocks_x_count / 2; ++j) {
                if(j > 1 && i < blocks_y_count -2) {
                    continue;
                }

                let p = Math.abs(colors.length - i + j) % colors.length;
                let c = colors[p];

                this.graphics.beginFill(c, 1);
                    // Left side.
                    this.graphics.drawRect(
                        block_size * j,
                        block_size * i,
                        block_size,
                        block_size
                    );
                    // Right side.
                    this.graphics.drawRect(
                        (blocks_x_count * block_size) - (j+1) * block_size,
                        block_size * i,
                        block_size,
                        block_size
                    );
                this.graphics.endFill()
            }
        }
    } // _DrawGraphics
}; // BoardBorder
