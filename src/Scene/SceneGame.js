//----------------------------------------------------------------------------//
//                       __      __                  __   __                  //
//               .-----.|  |_.--|  |.--------.---.-.|  |_|  |_                //
//               |__ --||   _|  _  ||        |  _  ||   _|   _|               //
//               |_____||____|_____||__|__|__|___._||____|____|               //
//                                                                            //
//  File      : SceneGame.js                                                  //
//  Project   : columns                                                       //
//  Date      : Oct 08, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//

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

const SCENE_GAME_PAUSED_FONT_SIZE            = 42;
const SCENE_GAME_EXIT_PROMPT_TITLE_FONT_SIZE = 42;
const SCENE_GAME_EXIT_PROMPT_MSG_FONT_SIZE   = 24;

// Sounds
// @todo(stdmatt): Different sounds for each difficulty
const SCENE_GAME_MUSIC_BACKGROUND_EASY   = "" /// MUSIC_BLOCKS_OF_FUN;
const SCENE_GAME_MUSIC_BACKGROUND_MEDIUM = "" // MUSIC_BLOCKS_OF_FUN;
const SCENE_GAME_MUSIC_BACKGROUND_HARD   = "" // MUSIC_BLOCKS_OF_FUN;

const SCENE_GAME_EFFECT_PROMPT  = "" // MUSIC_MENU_INTERACTION;
const SCENE_GAME_EFFECT_CONFIRM = "" // MUSIC_MENU_INTERACTION2;


//------------------------------------------------------------------------------
class SceneGame
    extends pw_Base_Scene
{
    //--------------------------------------------------------------------------
    constructor(difficulty = SCENE_GAME_LEVEL_EASY)
    {
        super();

        //
        // iVars
        // State.
        this.prevState  = null;
        this.currState  = null;
        this.difficulty = difficulty;

        // Board.
        this.board                 = null;
        this.boardBorder           = null;
        this.boardBorderTweenGroup = null;
        this.boardBorderTween      = null;

        // State Texts.
        this.pauseText       = null;
        this.exitText        = null;
        this.stateTweenGroup = pw_Tween_CreateGroup();

        //
        // Initialize.
        this._CreateHud               ();
        this._CreateProgressionHandler();
        this._CreateBoard             ();
        this._CreateStateTexts        ();

        this._ChangeState(SCENE_GAME_STATE_INITIALING);
        this._OnScoreChanged();

        if(this.difficulty == SCENE_GAME_LEVEL_EASY) {
            const sound_name = SCENE_GAME_MUSIC_BACKGROUND_EASY;
            gAudio.Play(sound_name);
            gAudio.SetSpeed(0.7);
        } else if(this.difficulty == SCENE_GAME_LEVEL_MEDIUM) {
            const sound_name = SCENE_GAME_MUSIC_BACKGROUND_MEDIUM;
            gAudio.Play(sound_name);
            gAudio.SetSpeed(1.0);
        } else if(this.difficulty == SCENE_GAME_LEVEL_HARD) {
            const sound_name = SCENE_GAME_MUSIC_BACKGROUND_HARD;
            gAudio.Play(sound_name);
            gAudio.SetSpeed(1.3);
        }
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
            // Game Hud Update.
            this.hud.Update(dt);

            // Board Visibility.
            this.board      .visible = true;
            // this.boardBorder.visible = true;

            // Board Update.
            this.board.Update(dt);
            if(this.board.GetState() == BOARD_STATE_GAME_OVER) {
                Go_To_Scene(SceneHighScore, SceneMenu, SCENE_HIGHSCORE_OPTIONS_EDITABLE);
            }

            // Change state.
            if(pw_Keyboard_IsClick(PW_KEY_P)) {
                gAudio.PlayEffect(SCENE_GAME_EFFECT_PROMPT);
                this._ChangeState(SCENE_GAME_STATE_PAUSED);
            } else if(pw_Keyboard_IsClick(PW_KEY_ESC)) {
                gAudio.PlayEffect(SCENE_GAME_EFFECT_PROMPT);
                this._ChangeState(SCENE_GAME_STATE_EXITING);
            }
        }

        // Paused.
        else if(this.currState == SCENE_GAME_STATE_PAUSED) {
            this.board.visible = false;
            this.stateTweenGroup.update();

            // Change state.
            if(pw_Keyboard_IsClick(PW_KEY_P)) {
                this.pauseText.visible = false;
                gAudio.PlayEffect(SCENE_GAME_EFFECT_CONFIRM);
                this._ChangeState(SCENE_GAME_STATE_PLAYING);
            }
        }
        // Exit.
        else if(this.currState == SCENE_GAME_STATE_EXITING) {
            this.board      .visible = false;
            this.boardBorder.visible = false;
            this.exitText   .visible = true;

            // Change state.
            if(pw_Keyboard_IsClick(PW_KEY_ESC)) {
                gAudio.PlayEffect(SCENE_GAME_EFFECT_CONFIRM);
                Go_To_Scene(SceneMenu);
            } else if(pw_Keyboard_IsClick(PW_KEY_ENTER)) {
                this.exitText.visible = false;
                gAudio.PlayEffect(SCENE_GAME_EFFECT_CONFIRM);
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

        // console.log("[STATE] ", this.prevState, " -> ", this.currState);
    } // _ChangeState


    //--------------------------------------------------------------------------
    _OnLevelChanged()
    {
        this.hud.SetLevel(this.progressionHandler.level);
    } // _OnLevelChanged

    //--------------------------------------------------------------------------
    _OnScoreChanged()
    {
        const score   = this.progressionHandler.score;
        const hiscore = HIGHSCORE_MANAGER.UpdateCurrentScoreValue(score);

        this.hud.SetScore(score, hiscore);
    } // _OnScoreChanged

    //--------------------------------------------------------------------------
    _OnMatch()
    {

    } // _OnMatch

    //--------------------------------------------------------------------------
    _CreateHud()
    {
        this.hud = new GameHud();
        this.hud.y += SCENE_GAME_SCREEN_GAP

        this.addChild(this.hud);
    } // _CreateHud

    //--------------------------------------------------------------------------
    _CreateProgressionHandler()
    {
        // Create
        this.progressionHandler = new ProgressionHandler(this.difficulty, 0);

        // Set the callbacks.
        this.progressionHandler.onLevelChangedCallback = ()=>{ this._OnLevelChanged() };
        this.progressionHandler.onScoreChangeCallback  = ()=>{ this._OnScoreChanged() };
        this.progressionHandler.onMatchCallback        = ()=>{ this._OnMatch       () };
    } // _CreateProgressionHandler


    //--------------------------------------------------------------------------
    _CreateBoard()
    {
        const screen_size = Get_Screen_Size();

        this.board = new Board(this.progressionHandler);
        pw_Anchor_Center(this.board);
        this.board.x = screen_size.x * 0.5;
        this.board.y = screen_size.y * 0.5;
        this.addChild(this.board);

        // this.boardBorder = new BoardBorder(this.board             );
        // this.addChild(this.boardBorder);

        // const game_hud_bottom_y = (this.hud.y + this.hud.height + SCENE_GAME_SCREEN_GAP);

        // this.boardBorder.x = (screen_size.x / 2) - (this.boardBorder.width / 2);
        // this.boardBorder.y = (game_hud_bottom_y);

        // Create the Board Border Tween.
        this.boardBorderTweenGroup = pw_Tween_CreateGroup();
        this.boardBorderTween      = pw_Tween_CreateBasic(
                SCENE_GAME_BOARD_BORDER_TWEEN_SHOW_DURATION_MS,
                this.boardBorderTweenGroup
            )
            .delay(SCENE_GAME_BOARD_BORDER_TWEEN_SHOW_DELAY_MS)
            .onComplete(()=>{
                this._ChangeState(SCENE_GAME_STATE_PLAYING);
                this.board.Start();
            })
            .start();

        // Apply_BoardBorderEffect(this.boardBorder, this.boardBorderTween);
    } // _CreateBoard

    //--------------------------------------------------------------------------
    _CreateStateTexts()
    {
        const screen_size = Get_Screen_Size();
        const color       = chroma("black");

        // Pause Text.
        this.pauseText = new pw_Text("PAUSED", FONT_COMMODORE, SCENE_GAME_PAUSED_FONT_SIZE);
        pw_Anchor_Center(this.pauseText);
        this.pauseText.x = screen_size.x * 0.5;
        this.pauseText.y = screen_size.y * 0.4;
        this.pauseText.visible = false;

        Apply_TextGradientEffect(this.pauseText, color);
        this.addChild(this.pauseText);

        // Exit Text.
        {
            this.exitText = new PIXI.Container();

            let l0 = new pw_Text("ARE YOU SURE?", FONT_COMMODORE, SCENE_GAME_EXIT_PROMPT_TITLE_FONT_SIZE);
            pw_Anchor_Center(l0);
            l0.x = screen_size.x * 0.5;
            l0.y = screen_size.y * 0.4;
            Apply_TextGradientEffect(l0, color);
            this.exitText.addChild(l0);

            let l1 = new pw_Text("PRESS ESC AGAIN TO EXIT", FONT_COMMODORE, SCENE_GAME_EXIT_PROMPT_MSG_FONT_SIZE);
            pw_Anchor_Center(l1);
            l1.x = l0.x;
            l1.y = (l0.y + l0.height * 0.5 + l1.height * 0.5) + l1.height;
            Apply_TextGradientEffect(l1, color);
            this.exitText.addChild(l1);

            let l2 = new pw_Text("OR ENTER TO CONTINUE", FONT_COMMODORE, SCENE_GAME_EXIT_PROMPT_MSG_FONT_SIZE);
            pw_Anchor_Center(l2);
            l2.x = l1.x;
            l2.y = (l1.y + l1.height * 0.5 + l2.height * 0.5);
            Apply_TextGradientEffect(l2, color);
            this.exitText.addChild(l2);

            this.exitText.visible = false;
            this.addChild(this.exitText);
        }

        // Blink tween.
        this.blinkTween = pw_Tween_CreateBasic(
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
