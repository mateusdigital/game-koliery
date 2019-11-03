//----------------------------------------------------------------------------//
//                       __      __                  __   __                  //
//               .-----.|  |_.--|  |.--------.---.-.|  |_|  |_                //
//               |__ --||   _|  _  ||        |  _  ||   _|   _|               //
//               |_____||____|_____||__|__|__|___._||____|____|               //
//                                                                            //
//  File      : SceneHighScore.js                                             //
//  Project   : columns                                                       //
//  Date      : Oct 09, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//
// SceneHighScore                                                             //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const HIGHSCORE_SCENE_FONT_SIZE                     = 40;
const HIGHSCORE_SCENE_TEXT_EFFECT_DURATION_MS       = 300;
const HIGHSCORE_SCENE_TEXT_EFFECT_DELAY_DURATION_MS = 300;

const HISCORE_SCENE_OPTIONS_NONE                  = 0;
const HISCORE_SCENE_OPTIONS_GO_BACK_AUTOMATICALLY = 1;
const HISCORE_SCENE_OPTIONS_EDITABLE              = 2;

const HISCORE_SCENE_BOARD_BLINK_TWEEN_DURATION_MS      = 500;
const HISCORE_SCENE_DELAY_TO_GO_BACK_TO_OTHER_SCENE_MS = 500;

//------------------------------------------------------------------------------
class SceneHighScore
    extends Base_Scene
{
    //--------------------------------------------------------------------------
    constructor(sceneToGoBackClass, options)
    {
        super();

        //
        // iVars.
        // Properties.
        this.scoresInfo         = HIGHSCORE_MANAGER.GetScores();
        this.sceneToGoBackClass = sceneToGoBackClass;
        this.options            = options;

        // Title.
        this.titleText  = null;
        this.titleLine  = null;
        // Score Panel.
        this.scoreTexts      = [];
        this.scoreTweenGroup = Tween_CreateGroup();
        // Edit.
        this.editTitle          = null;
        this.editField          = null;
        this.editFieldChars     = [];
        this.editFadeTweenGroup = null;
        this.editFadeTween      = null;
        this.editLocked         = false;

        this.blinkTweenGroup = null;
        this.blinkTween      = null;

        //
        // Initialize.
        // If player is out of ranks make the scene non editable...
        if(HIGHSCORE_MANAGER.GetCurrentScorePosition() == HIGHSCORE_SCORE_POSITION_OUT_OF_RANK) {
            this.options = HISCORE_SCENE_OPTIONS_NONE;
        }

        this._CreateTitleUI();
        this._CreateScoreUI();
        this._CreateEditUI ();
    } // ctor

    //--------------------------------------------------------------------------
    OnEnter()
    {
        if(this.options == HISCORE_SCENE_OPTIONS_EDITABLE) {
            Input_AddKeyboardListener(this);
        }
    } // OnEnter

    //--------------------------------------------------------------------------
    OnExit()
    {
        if(this.options == HISCORE_SCENE_OPTIONS_EDITABLE) {
            Input_RemoveKeyboardListener(this);
        }
    } // OnExit

    //--------------------------------------------------------------------------
    OnKeyUp(keyCode)
    {
        // Do nothing...
    } // OnKeyUp

    //--------------------------------------------------------------------------
    OnKeyDown(keyCode)
    {
        if(this.options != HISCORE_SCENE_OPTIONS_EDITABLE) {
            return;
        }

        // Erase
        if(keyCode == KEY_BACKSPACE) {
            Array_RemoveLast(this.editFieldChars);
        }
        // Enter char
        else if(keyCode >= 65 && keyCode < 65 + 26) {
            if(this.editFieldChars.length < 3) {
                let c = String.fromCharCode(keyCode);
                this.editFieldChars.push(c);
            }
        }
        // Confirm
        else if(keyCode == KEY_ENTER && !this.editLocked) {
            this.editLocked = true;
            Apply_TextUncoverEffect (this.editTitle, this.editFadeTween);
            Apply_TextUncoverEffect (this.editField, this.editFadeTween);
            this.editFadeTween.start();
            this.editFadeTween._reversed = true; // @XXX Accessing private var...
        }

        this._UpdateEditFieldText();
    } // OnKeyDown

    //--------------------------------------------------------------------------
    Update(dt)
    {
        this.scoreTweenGroup.update();

        // Viewing high cores.
        if(this.options != HISCORE_SCENE_OPTIONS_EDITABLE) {
            if(IsKeyPress(KEY_SPACE) || IsKeyPress(KEY_ENTER)) {
                Go_To_Scene(this.sceneToGoBackClass);
            }
        }

        // Adding new high score.
        else if(this.options == HISCORE_SCENE_OPTIONS_EDITABLE) {
            this.editFadeTweenGroup.update();
        }

        if(this.blinkTweenGroup) {
            this.blinkTweenGroup.update();
        }
    } // Update

    //--------------------------------------------------------------------------
    _CreateTitleUI()
    {
        const screen_size = Get_Screen_Size();

        // Title Text.
        this.titleText = Create_Normal_Text("HIGH SCORES", SCENE_HIGHSCORE_TITLE_FONT_SIZE);
        Apply_TextGradientEffect(this.titleText, gPalette.GetScoreColor(0));

        this.titleText.x = (screen_size.x         * 0.5);
        this.titleText.y = (this.titleText.height * 0.5) + 50;
        this.addChild(this.titleText);

        // Title Line.
        this.titleLine = new PIXI.Sprite(PIXI.Texture.WHITE);
        Apply_TextGradientEffect(this.titleLine, chroma("#5a5a5a"));

        this.titleLine.width  = this.titleText.width;
        this.titleLine.height = 15;

        this.titleLine.x = this.titleText.x - (this.titleText.width  * 0.5);
        this.titleLine.y = this.titleText.y + (this.titleText.height * 0.5);

        this.addChild(this.titleLine);
    } // _CreateTitleUI

    //--------------------------------------------------------------------------
    _CreateScoreUI()
    {
        const screen_size = Get_Screen_Size();
        const initial_y   = this.titleLine.y + this.titleLine.height + 20;

        for(let i = 0; i < this.scoresInfo.length; ++i) {
            // Tween.
            const tween = Tween_CreateBasic(
                HIGHSCORE_SCENE_TEXT_EFFECT_DURATION_MS,
                this.scoreTweenGroup
            )
            .delay(HIGHSCORE_SCENE_TEXT_EFFECT_DELAY_DURATION_MS * (i + 1))
            .start();

            // Text.
            const info  = this.scoresInfo[i];
            const str   = this._BuildScoreString(i + 1, info);
            const color = chroma(gPalette.GetScoreColor(i));

            const text   = Create_Normal_Text(str, SCENE_HIGHSCORE_SCORE_ITEM_FONT_SIZE);
            const height = SCENE_HIGHSCORE_SCORE_ITEM_FONT_SIZE;
            // @BUG(stdmatt): By some reason glypher is generating the fonts with
            // different height - 40 and 41. So the calculations are messed up with
            // this.
            // To overcome the bug we are setting the height as the font size
            // as it should be anyways, but we REALLY need to take a look
            // why this is happening.
            Apply_TextUncoverEffect (text, tween);
            Apply_TextGradientEffect(text, color);

            text.x = (screen_size.x * 0.5);
            text.y = initial_y + (height * i) + (height * 0.5);

            this.addChild(text);
            this.scoreTexts.push(text);
        }

        // Animation Finished.
        if(this.options == HISCORE_SCENE_OPTIONS_GO_BACK_AUTOMATICALLY) {
            this.scoreTweenGroup.onComplete(()=>{
                 // @XXX This should be encapsulated in a library functionality.
                 // This way the application will have control how to handle
                 // the timing itself. Right now I have no idea what's behind
                 // the setTimeout function.
                setTimeout(()=>{
                    Go_To_Scene(this.sceneToGoBackClass);
                }, HISCORE_SCENE_DELAY_TO_GO_BACK_TO_OTHER_SCENE_MS)
            });
        }

        if(this.options == HISCORE_SCENE_OPTIONS_EDITABLE) {
            const index = HIGHSCORE_MANAGER.GetCurrentScorePosition();
            if(index == HIGHSCORE_SCORE_POSITION_OUT_OF_RANK) {
                return;
            }

            const info = this.scoresInfo[index];
            info.name  = "---";
            this.scoreTexts[index].text = this._BuildScoreString(index + 1, info);

            this.scoreTweenGroup.onComplete(()=>{
                this.blinkTweenGroup = Tween_CreateGroup();
                this.blinkTween      = Tween_CreateBasic(
                    HISCORE_SCENE_BOARD_BLINK_TWEEN_DURATION_MS,
                    this.blinkTweenGroup
                )
                .repeat(Infinity)
                .onRepeat(()=>{
                    this.scoreTexts[index].visible = !this.scoreTexts[index].visible;
                })
                .start();
            });
        }

    } // _CreateScoreUI

    //--------------------------------------------------------------------------
    _CreateEditUI()
    {
        if(this.options != HISCORE_SCENE_OPTIONS_EDITABLE) {
            return;
        }

        const screen_size     = Get_Screen_Size();
        const last_score_text = Array_GetLast(this.scoreTexts);

        // Edit Title.
        this.editTitle = Create_Normal_Text("Enter your initials", SCENE_HIGHSCORE_EDIT_TITLE_FONT_SIZE);
        Apply_TextGradientEffect(this.editTitle, chroma("gray"));

        this.editTitle.x = screen_size.x * 0.5;
        this.editTitle.y = last_score_text.y + last_score_text.height + 40;

        this.addChild(this.editTitle);

        // Edit Field.
        this.editField = Create_Normal_Text("_ _ _", SCENE_HIGHSCORE_EDIT_FIELD_FONT_SIZE);
        Apply_TextGradientEffect(this.editField, chroma("gray"));

        this.editField.x = screen_size.x * 0.5;
        this.editField.y = this.editTitle.y + this.editField.height

        this.addChild(this.editField);

        this.editFadeTweenGroup = Tween_CreateGroup();
        this.editFadeTween      = Tween_CreateBasic(400, this.editFadeTweenGroup)

        this.editFadeTweenGroup.onComplete(()=>{
            this.editField.visible = false;
            this.editTitle.visible = false;

            this.options = HISCORE_SCENE_OPTIONS_NONE;

            const index = HIGHSCORE_MANAGER.GetCurrentScorePosition();
            const info  = this.scoresInfo[index];
            info.name   = "";
            for(let i = 0; i < this.editFieldChars.length; ++i) {
                info.name += this.editFieldChars[i];
            }

            this.scoreTexts[index].text = this._BuildScoreString(index + 1, info);
            HIGHSCORE_MANAGER.UploadScore(info.name);
        });
    } // _CreateEditUI

    //--------------------------------------------------------------------------
    _BuildScoreString(index, info)
    {
        const pos_str   = Build_Digits_String("", 2, index);
        const name_str  = info.name;
        const score_str = Build_Digits_String("", HIGHSCORE_MAX_DIGITS, info.score);

        return String_Cat(pos_str, " ", name_str, " ", score_str);
    } // _BuildScoreString

    //--------------------------------------------------------------------------
    _UpdateEditFieldText()
    {
        let arr = ["_", " ", "_", " ", "_"];
        for(let i = 0; i < this.editFieldChars.length; ++i) {
            arr[2 * i] = this.editFieldChars[i];
        }
        let s = "";
        for(let i = 0; i < arr.length; ++i) {
            s += arr[i];
        }
        this.editField.text = s;
    }
}; // class SceneHighScore
