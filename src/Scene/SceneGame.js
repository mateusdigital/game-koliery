//----------------------------------------------------------------------------//
// SceneGame                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const SCENE_GAME_LEVEL_EASY   = 0;
const SCENE_GAME_LEVEL_MEDIUM = 1;
const SCENE_GAME_LEVEL_HARD   = 2;

const SCENE_GAME_BOARD_BORDER_TWEEN_SHOW_DURATION_MS = 1000;
const SCENE_GAME_BOARD_BORDER_TWEEN_SHOW_DELAY_MS    = 500;

//------------------------------------------------------------------------------
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
        this.hud     = new GameHud();
        this.board   = new Board  ();
        this.hiscore = 0;

        // Board Border
        this.boardBorder           = new BoardBorder(this.board);
        this.boardBorderTweenGroup = null;
        this.boardBorderTween      = null;

        //
        // Initialize.
        // Hud
        this.hud.y += SCREEN_GAP;

        // Board
        this._SetupBoardCallbacks       ();
        this._InitializeBoardBorderTween();
        Apply_BoardBorderEffect(this.boardBorder, this.boardBorderTween);

        const screen_size       = Get_Screen_Size();
        const GAME_HUD_BOTTOM_Y = (this.hud.y + this.hud.height + SCREEN_GAP);

        this.boardBorder.x = (screen_size.x / 2) - (this.boardBorder.width / 2);
        this.boardBorder.y = (GAME_HUD_BOTTOM_Y);

        this.addChild(this.hud);
        this.addChild(this.boardBorder);
    } // ctor

    //--------------------------------------------------------------------------
    Update(dt)
    {
        this.board.Update(dt);
        if(!this.boardBorderTweenGroup.isCompleted()) {
            this.boardBorderTweenGroup.update();
        }
    } // Update

    //--------------------------------------------------------------------------
    _SetupBoardCallbacks()
    {
        this.board.onScoreChangeCallback = ()=>{ this._OnScoreChanged() };
        this.board.onMatchCallback       = ()=>{ this._OnMatch       () };
    } // _SetupBoardCallbacks

    //--------------------------------------------------------------------------
    _OnScoreChanged()
    {
        const score = this.board.score;
        if(score >= this.hiscore) {
            this.hiscore = score;
        }

        this.hud.SetScore(score, this.hiscore);
    } // _OnScoreChanged

    //--------------------------------------------------------------------------
    _OnMatch()
    {
        const match_info = this.board.matchInfo;
    } // _OnMatch

    //--------------------------------------------------------------------------
    _InitializeBoardBorderTween()
    {
        this.boardBorderTweenGroup = Tween_CreateGroup();
        this.boardBorderTween = Tween_CreateBasic(
            SCENE_GAME_BOARD_BORDER_TWEEN_SHOW_DURATION_MS,
            this.boardBorderTweenGroup
        )
        .delay(SCENE_GAME_BOARD_BORDER_TWEEN_SHOW_DELAY_MS)
        .onComplete(()=>{
            this.board.Start();
        })
        .start();
    } // _InitializeBoardBorderTween
}; // class SceneGame
