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
const SCENE_GAME_BOARD_BLINK_TWEEN_DURATION_MS       = 500;
// State
const SCENE_GAME_STATE_INITIALING = 0;
const SCENE_GAME_STATE_PLAYING    = 1;
const SCENE_GAME_STATE_PAUSED     = 2;
const SCENE_GAME_STATE_EXITING    = 3;
// UI
const SCENE_GAME_SCREEN_GAP = 10;

//------------------------------------------------------------------------------
class SceneGame
    extends Base_Scene
{
    //--------------------------------------------------------------------------
    constructor(level)
    {
        super();

        //
        // iVars
        // State.
        this.prevState = null;
        this.currState = null;

        // Board.
        this.board                 = null;
        this.boardBorder           = null;
        this.boardBorderTweenGroup = null;
        this.boardBorderTween      = null;

        // State Texts.
        this.pauseText       = null;
        this.exitText        = null;
        this.stateTweenGroup = Tween_CreateGroup();

        //
        // Initialize.
        this._CreateHud       ();
        this._CreateBoard     ();
        this._CreateStateTexts();

        this._ChangeState(SCENE_GAME_STATE_INITIALING);
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
            if(this.board.GetState() == BOARD_STATE_GAME_OVER) {
                Go_To_Scene(SceneHighScore, SceneMenu, HISCORE_SCENE_OPTIONS_EDITABLE);
            }

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

            // Change state.
            if(IsKeyPress(KEY_P)) {
                this.pauseText.visible = false;
                this._ChangeState(SCENE_GAME_STATE_PLAYING);
            }
        }
        // Exit.
        else if(this.currState == SCENE_GAME_STATE_EXITING) {
            this.board      .visible = false;
            this.boardBorder.visible = false;
            this.exitText   .visible = true;

            // Change state.
            if(IsKeyPress(KEY_ESC)) {
                Go_To_Scene(SceneMenu);
            } else if(IsKeyPress(KEY_ENTER)) {
                this.exitText.visible = false;
                this._ChangeState(SCENE_GAME_STATE_PLAYING);
            }
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
    _OnScoreChanged()
    {
        HIGHSCORE_MANAGER.UpdateCurrentScoreValue(this.board.score);
        this.hud.SetScore(this.board.score, HIGHSCORE_MANAGER.GetHighScoreValue());
    } // _OnScoreChanged

    //--------------------------------------------------------------------------
    _OnMatch()
    {
        const match_info = this.board.matchInfo;
    } // _OnMatch


    //--------------------------------------------------------------------------
    _CreateHud()
    {
        this.hud = new GameHud();
        this.hud.y += SCENE_GAME_SCREEN_GAP

        this.addChild(this.hud);
    } // _CreateHud

    //--------------------------------------------------------------------------
    _CreateBoard()
    {
        this.board       = new Board();
        this.boardBorder = new BoardBorder(this.board);
        this.addChild(this.boardBorder);

        const screen_size       = Get_Screen_Size();
        const game_hud_bottom_y = (this.hud.y + this.hud.height + SCENE_GAME_SCREEN_GAP);

        this.boardBorder.x = (screen_size.x / 2) - (this.boardBorder.width / 2);
        this.boardBorder.y = (game_hud_bottom_y);

        // Setup Callbacks.
        this.board.onScoreChangeCallback = ()=>{ this._OnScoreChanged() };
        this.board.onMatchCallback       = ()=>{ this._OnMatch       () };

        // Create the Board Border Tween.
        this.boardBorderTweenGroup = Tween_CreateGroup();
        this.boardBorderTween      = Tween_CreateBasic(
                SCENE_GAME_BOARD_BORDER_TWEEN_SHOW_DURATION_MS,
                this.boardBorderTweenGroup
            )
            .delay(SCENE_GAME_BOARD_BORDER_TWEEN_SHOW_DELAY_MS)
            .onComplete(()=>{
                this._ChangeState(SCENE_GAME_STATE_PLAYING);
                this.board.Start();
            })
            .start();

        Apply_BoardBorderEffect(this.boardBorder, this.boardBorderTween);


    } // _CreateBoard

    //--------------------------------------------------------------------------
    _CreateStateTexts()
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
    } // _CreateStateTexts
}; // class SceneGame
