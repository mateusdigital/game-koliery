//----------------------------------------------------------------------------//
//                       __      __                  __   __                  //
//               .-----.|  |_.--|  |.--------.---.-.|  |_|  |_                //
//               |__ --||   _|  _  ||        |  _  ||   _|   _|               //
//               |_____||____|_____||__|__|__|___._||____|____|               //
//                                                                            //
//  File      : SceneCredits.js                                               //
//  Project   : columns                                                       //
//  Date      : Nov 07, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//
// SceneCredits                                                               //
//----------------------------------------------------------------------------//
const SCENE_CREDITS_TEXT_TWEEN_DURATION_MS = 300;
const SCENE_CREDITS_TEXT_TWEEN_DELAY_MS    = 300;

const SCENE_CREDITS_SECTION_TITLE_FONT_SIZE = 22;
const SCENE_CREDITS_SECTION_TEXT_FONT_SIZE  = 32;

// Sound
const SCENE_CREDITS_MUSIC_BACKGROUND = RES_AUDIO_ROLEMUSIC_W1X_MP3;
const SCENE_CREDITS_EFFECT_MENU      = RES_AUDIO_MENU_INTERACTION_WAV;


//------------------------------------------------------------------------------
class SceneCredits
    extends pw_Base_Scene
{
    //--------------------------------------------------------------------------
    constructor()
    {
        super();

        //
        // iVars.
        // Properties.
        this.sceneTweenGroup  = pw_Tween_CreateGroup();
        this.creditsStructure = null;

        //
        // Initialize.
        this._CreateCreditsStructure();
        this._CreateTexts           ();

        gAudio.Play(SCENE_CREDITS_MUSIC_BACKGROUND);
        gStarfield.SetSpeedModifier(1);
    } // ctor

    //--------------------------------------------------------------------------
    Update(dt)
    {
        gStarfield.Update(dt);

        if(pw_Keyboard_IsClick(PW_KEY_SPACE) ||
           pw_Keyboard_IsClick(PW_KEY_ENTER) ||
           pw_Keyboard_IsClick(PW_KEY_ESC))
        {
            gAudio.PlayEffect(SCENE_CREDITS_EFFECT_MENU);
            Go_To_Scene(SceneMenu);
        }

        this.sceneTweenGroup.update();
    } // Update

    //--------------------------------------------------------------------------
    _CreateCreditsStructure()
    {
        this.creditsStructure = [
            {
                title: ["Programming"],
                texts: ["mateusdigital"],
                gap  : 0,
            },
            {
                title: ["Inspired by"],
                texts: ["iss colours", "sega columns"],
                gap  : 15,
            },
            {
                title: ["Made using"],
                texts: ["pixi.js", "chroma.js", "Bfxr"],
                gap  : 15,
            },
            {
                title: ["Original Songs by"],
                texts: ["Rolemusic", "KOMIKU", "OurMusicBox"],
                gap  : 15,
            },
            {
               title: ["mateusdigital - MMXX", "gplv3 - hack, share it"],
                   texts: ["\n#blacklivesmatter"],
               gap: 25
            }
        ];
    } // _CreateCreditsStructure

    //--------------------------------------------------------------------------
    _CreateTexts()
    {

        const total_text_count = 10;
        const screen_size      = Get_Design_Size();
        const create_text_func = (str, font_size, pos_y, color, index) => {
            // Tween.
            const tween = pw_Tween_CreateBasic(
                SCENE_CREDITS_TEXT_TWEEN_DURATION_MS,
                this.sceneTweenGroup
            )
            .delay(
                (SCENE_CREDITS_TEXT_TWEEN_DELAY_MS * index)
            )
            .start();

            const text = new pw_Text(str.toUpperCase(), FONT_COMMODORE, font_size);
            text.anchor.set(0.5, 0.5);
            text.x = (screen_size.x * 0.5);
            text.y = curr_y;

            Apply_TextGradientEffect(text, color);
            Apply_TextUncoverEffect (text, tween);

            text_layer.addChild(text);
        }

        const text_layer = new PIXI.Container();
        let curr_y       = 0;
        let text_count   = 0;
        let index        = 0;

        for(let i = 0; i < this.creditsStructure.length; ++i) {
            const section    = this.creditsStructure[i];
            const texts_strs = section.texts;
            const gap        = section.gap;
            curr_y += gap;
            for(let j = 0; j < section.title.length; ++j) {
                create_text_func(
                    section.title[j],
                    SCENE_CREDITS_SECTION_TITLE_FONT_SIZE,
                    curr_y,
                    chroma("gray"),
                    ++index
                );
                curr_y += SCENE_CREDITS_SECTION_TITLE_FONT_SIZE;
                curr_y += 5;
            }

            for(let j = 0; j < texts_strs.length; ++j) {
                const text_str  = texts_strs[j].toUpperCase();
                const color     = chroma.hsl((360 / total_text_count) * text_count, 0.7, 0.5);

                create_text_func(
                    text_str,
                    SCENE_CREDITS_SECTION_TEXT_FONT_SIZE,
                    curr_y,
                    color,
                    ++index
                );

                ++text_count;
                curr_y += SCENE_CREDITS_SECTION_TEXT_FONT_SIZE;
                curr_y += 2;
            }
        }

        text_layer.y = (screen_size.y * 0.5) - (text_layer.height * 0.5);
        this.addChild(text_layer);

        // Apply_Debug_Filter(text_layer);
    } // _CreateTexts
}; // class SceneCredits
