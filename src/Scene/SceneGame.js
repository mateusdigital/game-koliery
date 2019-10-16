//----------------------------------------------------------------------------//
// SceneGame                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
// Level
const SCENE_GAME_LEVEL_EASY   = 0;
const SCENE_GAME_LEVEL_MEDIUM = 1;
const SCENE_GAME_LEVEL_HARD   = 2;
// Tween
const SCENE_GAME_BOARD_BORDER_TWEEN_SHOW_DURATION_MS = 1000;
const SCENE_GAME_BOARD_BORDER_TWEEN_SHOW_DELAY_MS    = 500;

const SCENE_GAME_BOARD_BLINK_TWEEN_DURATION_MS = 500;
// State
const SCENE_GAME_STATE_INITIALING = 0;
const SCENE_GAME_STATE_PLAYING    = 1;
const SCENE_GAME_STATE_PAUSED     = 2;
const SCENE_GAME_STATE_EXITING    = 3;

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
        this.hud       = new GameHud();
        this.board     = new Board  ();
        this.hiscore   = 0;
        this.prevState = null;
        this.currState = null;

        // Board Border.
        this.boardBorder           = new BoardBorder(this.board);
        this.boardBorderTweenGroup = null;
        this.boardBorderTween      = null;

        // State Texts.
        this.pauseText       = null;
        this.exitText        = null;
        this.stateTweenGroup = Tween_CreateGroup();

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

        // State.
        this._ChangeState(SCENE_GAME_STATE_INITIALING);

        this._InitializeStateTexts();
    } // ctor

    //--------------------------------------------------------------------------
    Update(dt)
    {
        // Initialize.
        if(this.currState == SCENE_GAME_STATE_INITIALING) {
            this.boardBorderTweenGroup.update();
        }
        // Play.
        else if(this.currState == SCENE_GAME_STATE_PLAYING) {
            this.board      .visible = true;
            this.boardBorder.visible = true;

            this.board.Update(dt);

            // Change state.
            if(IsKeyPress(KEY_P)) {
                this._ChangeState(SCENE_GAME_STATE_PAUSED);
            } else if(IsKeyPress(KEY_ESC)) {
                this._ChangeState(SCENE_GAME_STATE_EXITING);
            }
        }
        // Paused.
        else if(this.currState == SCENE_GAME_STATE_PAUSED) {
            this.board.visible = false;
            this.stateTweenGroup.update();
        }
        // Exit.
        else if(this.currState == SCENE_GAME_STATE_EXITING) {
            this.board      .visible = false;
            this.boardBorder.visible = false;
            this.exitText   .visible = true;
        }
    } // Update

    //--------------------------------------------------------------------------
    _ChangeState(newState)
    {
        // debugger;
        this.prevState = this.currState;
        this.currState = newState;

        console.log("[STATE] ", this.prevState, " -> ", this.currState);
    } // _ChangeState

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
            this._ChangeState(SCENE_GAME_STATE_PLAYING);
            this.board.Start();
        })
        .start();
    } // _InitializeBoardBorderTween

    //--------------------------------------------------------------------------
    _InitializeStateTexts()
    {
        const screen_size = Get_Screen_Size();
        const color       = chroma("black");

        // Pause Text.
        this.pauseText = Create_Normal_Text("PAUSED", 42);
        this.pauseText.x = screen_size.x * 0.5;
        this.pauseText.y = screen_size.y * 0.4;
        this.pauseText.visible = false;

        Apply_TextGradientEffect(this.pauseText, color);
        this.addChild(this.pauseText);

        // Exit Text.
        {
            this.exitText = new PIXI.Container();

            let l0 = Create_Normal_Text("ARE YOU SURE?", 40);
            Apply_TextGradientEffect(l0, color);
            this.exitText.addChild(l0);

            let l1 = Create_Normal_Text("PRESS ESC AGAIN TO EXIT", 24);
            l1.y = (l0.y + l0.height + l1.height);
            Apply_TextGradientEffect(l1, color);
            this.exitText.addChild(l1);

            let l2 = Create_Normal_Text("OR ENTER TO CONTINUE", 24);
            l2.y = (l1.y + l1.height);
            Apply_TextGradientEffect(l2, color);
            this.exitText.addChild(l2);

            this.exitText.x = screen_size.x * 0.5;
            this.exitText.y = screen_size.y * 0.4;
            this.exitText.visible = false;

            this.addChild(this.exitText);
        }

        // Blink tween.
        this.blinkTween = Tween_CreateBasic(
            SCENE_GAME_BOARD_BLINK_TWEEN_DURATION_MS,
            this.stateTweenGroup
        )
        .repeat(Infinity)
        .onRepeat(()=>{
            this.pauseText.visible = !this.pauseText.visible;
        })
        .start();
    } // _InitializeStateTexts
}; // class SceneGame
