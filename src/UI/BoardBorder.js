class BoardBorder
    extends PIXI.Container
{
    constructor(boardRef)
    {
        super();
        this.graphics = new PIXI.Graphics();

        const blocks_y_count = BOARD_FIELD_ROWS * 2 + 3;
        const blocks_x_count = BOARD_FIELD_COLUMNS * 2 + 4;
        const block_size     = BLOCK_SIZE / 2 ;
        const colors         = gPalette.GetBlockColors();
        // debugger;


        for(let i = 0; i < blocks_y_count; ++i) {
            let c1 = colors[(i     % colors.length)];
            let c2 = colors[((i+1) % colors.length)];

            for(let j = 0; j < blocks_x_count / 2; ++j) {
                if(j > 1 && i < blocks_y_count -2) {
                    continue;
                }

                let p = Math.abs(colors.length - i + j) % colors.length;
                let c = colors[p];

                this.graphics.beginFill(c, 1);
                    this.graphics.drawRect(
                        block_size * j,
                        block_size * i,
                        block_size,
                        block_size
                    );
                    this.graphics.drawRect(
                        (blocks_x_count * block_size) - (j+1) * block_size,
                        block_size * i,
                        block_size,
                        block_size
                    );
                this.graphics.endFill()

                // this.graphics.beginFill(c2);
                //     this.graphics.drawRect(j *-block_size, block_size * i, block_size, block_size);
                //     this.graphics.drawRect(board_width + 2 * block_size, block_size * i, block_size, block_size);
                // this.graphics.endFill()
            }
        }

        boardRef.x = BLOCK_SIZE;
        boardRef.y = BLOCK_SIZE / 2;
        this.addChild(this.graphics);
        this.addChild(boardRef)

    } // ctor



}; // BoardBorder
