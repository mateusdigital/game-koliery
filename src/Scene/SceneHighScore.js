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
const SCENE_HIGHSCORE_TITLE_FONT_SIZE       = 50;
const SCENE_HIGHSCORE_SCORE_ITEM_FONT_SIZE  = 40;
const SCENE_HIGHSCORE_EDIT_TITLE_FONT_SIZE  = 22;
const SCENE_HIGHSCORE_EDIT_FIELD_FONT_SIZE  = 40;

const SCENE_HIGHSCORE_TEXT_EFFECT_DURATION_MS       = 300;
const SCENE_HIGHSCORE_TEXT_EFFECT_DELAY_DURATION_MS = 300;

const SCENE_HIGHSCORE_OPTIONS_NONE                  = 0;
const SCENE_HIGHSCORE_OPTIONS_GO_BACK_AUTOMATICALLY = 1;
const SCENE_HIGHSCORE_OPTIONS_EDITABLE              = 2;

const SCENE_HIGHSCORE_BOARD_BLINK_TWEEN_DURATION_MS      = 500;
const SCENE_HIGHSCORE_DELAY_TO_GO_BACK_TO_OTHER_SCENE_MS = 500;

// Sound
const SCENE_HIGHSCORE_MUSIC_BACKGROUND = RES_AUDIO_ROLEMUSIC_W1X_MP3;
const SCENE_HIGHSCORE_EFFECT_MENU      = RES_AUDIO_MENU_INTERACTION_WAV;


//------------------------------------------------------------------------------
class SceneHighScore
    extends pw_Base_Scene
{
    //--------------------------------------------------------------------------
    constructor(sceneToGoBackClass, options)
    {
        super();

        //
        // iVars.
        // Properties.
        // @XXX(stdamtt): Check this properties....
        this.sceneToGoBackClass = sceneToGoBackClass;
        this.options            = options;

        this.score_texts       = [];
        this.score_tween_group = null;

        // Title.
        this.titleText  = null;
        this.titleLine  = null;

        // Fetch Status.
        this.fetch_status_text  = null;
        this.fetch_status_tween = null;

        this.editFieldChars = [];

        this.readyForInput = false;

        //
        // Initialize.
        this._CreateTitleUI();

        this._CreateFetchUI();
        HIGHSCORE_MANAGER.FetchScoresWithCallback(()=>{
            this._DismissFetchUI();
            this._CreateScoreUI ();
            this._CreateEditUI  ();

            this.readyForInput = true;
        });

        gAudio.Play(SCENE_HIGHSCORE_MUSIC_BACKGROUND);
    } // ctor


    //--------------------------------------------------------------------------
    OnKeyDown(keyCode)
    {
        if(this.readyForInput == false) {
            return;
        }

        if(this.options != SCENE_HIGHSCORE_OPTIONS_EDITABLE) {
            return;
        }

        const leaderboard_index = HIGHSCORE_MANAGER.GetCurrentScorePosition();
        if(leaderboard_index == HIGHSCORE_SCORE_POSITION_OUT_OF_RANK) {
            return;
        }

        // Erase
        if(keyCode == PW_KEY_BACKSPACE) {
            pw_Array_RemoveLast(this.editFieldChars);
        }

        // Enter char
        else if(keyCode >= 65 && keyCode < 65 + 26) {
            if(this.editFieldChars.length < 3) {
                let c = String.fromCharCode(keyCode);
                this.editFieldChars.push(c);
            }
        }

        // Confirm
        else if(keyCode == PW_KEY_ENTER && !this.editLocked) {
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
        gStarfield.Update(dt);

        if(this.score_tween_group) {
            this.score_tween_group.update();
        }

        // Viewing highscores.
        if(this.options != SCENE_HIGHSCORE_OPTIONS_EDITABLE) {
            if(pw_Keyboard_IsClick(PW_KEY_SPACE) || pw_Keyboard_IsClick(PW_KEY_ENTER)) {
                gAudio.PlayEffect(SCENE_HIGHSCORE_EFFECT_MENU);
                Go_To_Scene(this.sceneToGoBackClass);
            }
        }
        // Setting highscore.
        else {
            const leaderboard_index = HIGHSCORE_MANAGER.GetCurrentScorePosition();
            if(leaderboard_index == HIGHSCORE_SCORE_POSITION_OUT_OF_RANK) {
                if(pw_Keyboard_IsClick(PW_KEY_SPACE) || pw_Keyboard_IsClick(PW_KEY_ENTER)) {
                    gAudio.PlayEffect(SCENE_HIGHSCORE_EFFECT_MENU);
                    Go_To_Scene(this.sceneToGoBackClass);
                }
            } else {
                if(this.editFadeTweenGroup) {
                    this.editFadeTweenGroup.update();
                }
            }
        }

        if(this.blinkTweenGroup) {
            this.blinkTweenGroup.update();
        }
    } // Update

    //--------------------------------------------------------------------------
    _CreateTitleUI()
    {
        const screen_size = Get_Design_Size();

        // Title Text.
        this.titleText = new pw_Text("HIGH SCORES", FONT_COMMODORE, SCENE_HIGHSCORE_TITLE_FONT_SIZE);
        Apply_TextGradientEffect(this.titleText, gPalette.GetScoreColor(0));
        pw_Anchor_Center(this.titleText);
        this.titleText.x = (screen_size.x         * 0.5);
        this.titleText.y = (this.titleText.height * 0.5) + 50;

        // Title Line.
        this.titleLine = new PIXI.Sprite(PIXI.Texture.WHITE);
        Apply_TextGradientEffect(this.titleLine, chroma("#5a5a5a"));
        pw_Anchor_Center(this.titleLine);
        this.titleLine.width  = this.titleText.width;
        this.titleLine.height = 15;

        this.titleLine.x = this.titleText.x;
        this.titleLine.y = this.titleText.y + this.titleText.height * 0.5 + this.titleLine.height * 0.5;

        pw_Add_To_Parent(this, this.titleText, this.titleLine);
    } // _CreateTitleUI

    //--------------------------------------------------------------------------
    _CreateScoreUI()
    {
        const screen_size = Get_Design_Size();
        const initial_y   = this.titleLine.y + this.titleLine.height + 20;
        const scores      = this.scoresInfo = HIGHSCORE_MANAGER.GetScores();

        if(this.options == SCENE_HIGHSCORE_OPTIONS_EDITABLE) {
            const leaderboard_index = HIGHSCORE_MANAGER.GetCurrentScorePosition();
            const curr_score        = HIGHSCORE_MANAGER.GetCurrentScoreValue();
            if(leaderboard_index != HIGHSCORE_SCORE_POSITION_OUT_OF_RANK) {
                const new_entry = {name:"---", score: curr_score }
                this.scoresInfo.splice(leaderboard_index, 0, new_entry);
                this.scoresInfo.pop();
            }
        }

        this.score_tween_group = pw_Tween_CreateGroup();

        for(let i = 0; i < scores.length; ++i) {
            // Uncover Tween.
            const tween = pw_Tween_CreateBasic(
                SCENE_HIGHSCORE_TEXT_EFFECT_DURATION_MS,
                this.score_tween_group
            )
            .delay(SCENE_HIGHSCORE_TEXT_EFFECT_DELAY_DURATION_MS * (i + 1))
            .start();

            // Text.
            const curr_score = scores[i];
            const str        = this._BuildScoreString(i + 1, curr_score);
            const color      = chroma(gPalette.GetScoreColor(i));

            const text   = new pw_Text(str, FONT_COMMODORE, SCENE_HIGHSCORE_SCORE_ITEM_FONT_SIZE);
            const height = SCENE_HIGHSCORE_SCORE_ITEM_FONT_SIZE;

            Apply_TextUncoverEffect (text, tween);
            Apply_TextGradientEffect(text, color);

            pw_Anchor_Center(text);
            text.x = (screen_size.x * 0.5);
            text.y = initial_y + (height * i) + (height * 0.5);

            this.addChild(text);
            this.score_texts.push(text);
        }

        // Animation Finished.
        if(this.options == SCENE_HIGHSCORE_OPTIONS_GO_BACK_AUTOMATICALLY) {
            this.score_tween_group.onComplete(()=>{
                 // @XXX This should be encapsulated in a library functionality.
                 // This way the application will have control how to handle
                 // the timing itself. Right now I have no idea what's behind
                 // the setTimeout function.
                setTimeout(()=>{
                    Go_To_Scene(this.sceneToGoBackClass);
                }, SCENE_HIGHSCORE_DELAY_TO_GO_BACK_TO_OTHER_SCENE_MS)
            });
        }
    } // _CreateScoreUI

    //--------------------------------------------------------------------------
    _CreateFetchUI()
    {
        const screen_size = Get_Design_Size();
        const min_pos_y =  (screen_size.y * 0.5) - 100;
        const max_pos_y =  (screen_size.y * 0.5) + 100;
        // @CleanUp - Remove magic numbers...

        //
        //
        this.fetch_status_text = new pw_Text("FETCHING SCORES", FONT_COMMODORE, 30);
        Apply_TextGradientEffect(this.fetch_status_text, gPalette.GetScoreColor(0));
        pw_Anchor_Center(this.fetch_status_text);
        this.fetch_status_text.x = (screen_size.x * 0.5);
        this.fetch_status_text.y = min_pos_y;
        pw_Add_To_Parent(this, this.fetch_status_text);

        //
        //
        this.fetch_status_tween = pw_Tween_CreateBasic(1500)
            .repeat(Infinity)
            .yoyo  (true)
            .onRepeat(()=>{
                const color = gPalette.GetRandomScoreColor();
                Apply_TextGradientEffect(this.fetch_status_text, color);
            })
            .onUpdate((v)=>{
                const value = pw_Math_Map(
                    v.value,
                    0, 1,
                    min_pos_y, max_pos_y
                );
                this.fetch_status_text.y = value;
            })
            .easing(TWEEN.Easing.Cubic.InOut)
            .start();
    }

    //--------------------------------------------------------------------------
    _DismissFetchUI()
    {
        // @TODO: Create animation to scale down the text....
        this.fetch_status_tween.stop();
        this.fetch_status_tween = null;

        pw_Remove_From_Parent(this.fetch_status_text);
    }


    //--------------------------------------------------------------------------
    _CreateEditUI()
    {
        if(this.options != SCENE_HIGHSCORE_OPTIONS_EDITABLE) {
            return;
        }

        const leaderboard_index = HIGHSCORE_MANAGER.GetCurrentScorePosition();
        if(leaderboard_index == HIGHSCORE_SCORE_POSITION_OUT_OF_RANK) {
            return;
        }

        this.scoresInfo = HIGHSCORE_MANAGER.GetScores();

        const info = this.scoresInfo[leaderboard_index];
        this.score_texts[leaderboard_index].text = this._BuildScoreString(leaderboard_index + 1, info);

        const screen_size     = Get_Design_Size();
        const last_score_text = this.score_texts[this.score_texts.length -1];

        // Edit Title.
        this.editTitle = new pw_Text("Enter your initials", FONT_COMMODORE, SCENE_HIGHSCORE_EDIT_TITLE_FONT_SIZE);
        Apply_TextGradientEffect(this.editTitle, chroma("gray"));

        this.editTitle.x = screen_size.x * 0.5;
        this.editTitle.y = last_score_text.y + last_score_text.height + 40;

        this.addChild(this.editTitle);

        // Edit Field.
        this.editField = new pw_Text("_ _ _", FONT_COMMODORE, SCENE_HIGHSCORE_EDIT_FIELD_FONT_SIZE);
        Apply_TextGradientEffect(this.editField, chroma("gray"));

        this.editField.x = screen_size.x * 0.5;
        this.editField.y = this.editTitle.y + this.editField.height

        this.addChild(this.editField);

        this.editFadeTweenGroup = pw_Tween_CreateGroup();
        this.editFadeTween      = pw_Tween_CreateBasic(400, this.editFadeTweenGroup)

        this.editFadeTweenGroup.onComplete(()=>{

            this.editField.visible = false;
            this.editTitle.visible = false;

            this.options = SCENE_HIGHSCORE_OPTIONS_NONE;
            const info  = this.scoresInfo[leaderboard_index];
            info.name   = "";
            for(let i = 0; i < this.editFieldChars.length; ++i) {
                info.name += this.editFieldChars[i];
            }
            while(info.name.length != 3) {
                info.name += " ";
            }
            if(info.name.length == 3 && info.name == "   "){
                info.name = "???";
            }

            this.score_texts[leaderboard_index].text = this._BuildScoreString(leaderboard_index + 1, info);
            HIGHSCORE_MANAGER.UploadScore(info.name);
        });


        this.score_tween_group.onComplete(()=>{
            this.blinkTweenGroup = pw_Tween_CreateGroup();
            this.blinkTween      = pw_Tween_CreateBasic(
                SCENE_HIGHSCORE_BOARD_BLINK_TWEEN_DURATION_MS,
                this.blinkTweenGroup
            )
            .repeat(Infinity)
            .onRepeat(()=>{
                this.score_texts[leaderboard_index].visible = !this.score_texts[leaderboard_index].visible;
            })
            .start();
        });
    } // _CreateEditUI

    //--------------------------------------------------------------------------
    _BuildScoreString(index, info)
    {
        const pos_str   = Build_Digits_String("", 2, index);
        const name_str  = pw_String_ToUpper(info.name);
        const score_str = Build_Digits_String("", HIGHSCORE_MAX_DIGITS, info.score);

        return pw_String_Cat(pos_str, " ", name_str, " ", score_str);
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
