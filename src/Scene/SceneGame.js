const SCENE_GAME_LEVEL_EASY   = 0;
const SCENE_GAME_LEVEL_MEDIUM = 1;
const SCENE_GAME_LEVEL_HARD   = 2;

class SceneGame
    extends Base_Scene
{
    //--------------------------------------------------------------------------
    constructor(level)
    {
        super();

        const SCREEN_GAP = 10;

        //
        // iVars
        this.hud         = new GameHud();
        this.board       = new Board();
        this.boardBorder = new BoardBorder(this.board);

        //
        // Initialize.
        // Hud
        this.hud.y += SCREEN_GAP;

        // Board
        const screen_size       = Get_Screen_Size();
        const GAME_HUD_BOTTOM_Y = (this.hud.y + this.hud.height + SCREEN_GAP);

        this.boardBorder.x = (screen_size.x / 2) - (this.boardBorder.width / 2);
        this.boardBorder.y = (GAME_HUD_BOTTOM_Y);

        this.addChild(this.hud);
        this.addChild(this.boardBorder);
    } // ctor

    Update(dt)
    {
        this.board.Update(dt);
    }

}; // class SceneGame
