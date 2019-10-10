const SCENE_GAME_LEVEL_EASY   = 0;
const SCENE_GAME_LEVEL_MEDIUM = 1;
const SCENE_GAME_LEVEL_HARD   = 2;


function Tween_Create(group)
{
    return new TWEEN.Tween(null, group);
}
function Tween_CreateGroup()
{
    return new TWEEN.Group();

}
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
        this.boardBorderTweenGroup = Tween_CreateGroup();
        this.boardBorderTween      = Tween_Create(this.boardBorderTweenGroup);

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

        Apply_BoardBorderEffect(this.boardBorder, this.boardBorderTween);
        this._SetupBoardCallbacks       ();
        this._InitializeBoardBorderTween();
    } // ctor

    //--------------------------------------------------------------------------
    Update(dt)
    {
        this.board.Update(dt);
        this.boardBorderTweenGroup.update();
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

    _OnMatch()
    {
        const match_info = this.board.matchInfo;
        debugger;
    } // _OnMatch

    //--------------------------------------------------------------------------
    _InitializeBoardBorderTween()
    {
        const start = {t:0};
        const final = {t:1};
        this.boardBorderTween
            .from(start)
            .delay(500)
            .to(final, 1000)
            .onComplete(()=>{
                this.board.Start();
            })
            .start();
    } // _InitializeBoardBorderTween
}; // class SceneGame
