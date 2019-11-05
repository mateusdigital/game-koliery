
//----------------------------------------------------------------------------//
// Audio Player                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
// Background
AUDIO_PLAYER_BACKGROUND_1 = "./res/music/blocks_of_fun.mp3";
// Sound Effects
AUDIO_PLAYER_EFFECT_MENU = "./res/music/Pickup_Coin2.mp3";

//------------------------------------------------------------------------------
class AudioPlayer
{
    //--------------------------------------------------------------------------
    constructor()
    {
        this.loaded  = false;
        this.enabled = false;
        this.isMuted = false;

        this.sounds     = [];

        this.soundName  = null;
        this.effectName = null;

        this.preloadCount = 0;
    } // ctor

    //--------------------------------------------------------------------------
    PreloadSounds(soundsToPreload)
    {
        this.preloadCount += soundsToPreload.length;
        this.loaded        = false;

        for(let i = 0; i < soundsToPreload.length; ++i) {
            const name = soundsToPreload[i];

            PIXI.sound.Sound.from({
                url     : name,
                preload : true,
                loaded  : (err, sound) => {
                    if(err != null) {
                        debugger;
                    }

                    this.sounds[name] = sound;
                    if(--this.preloadCount == 0) {
                        this.loaded = true;
                    }
                }
            });
        }
    } // PreloadSounds

    //--------------------------------------------------------------------------
    PlayEffect(name)
    {
        const playing_effect = this.sounds[this.effectName];
        if(playing_effect) {
            playing_effect.stop();
        }

        const effect_to_play = this.sounds[name];
        if(!effect_to_play) {
            debugger;
            return;
        }

        effect_to_play.play();
    } // PlayEffect

    //--------------------------------------------------------------------------
    Play(name, restartIfPlaying)
    {
        const sound_to_play = this.sounds[name];
        if(!sound_to_play) {
            debugger;
            return;
        }

        const playing_sound = this.sounds[this.soundName];
        if(this.soundName != name) {
            if(playing_sound) {
                playing_sound.stop();
            }
            sound_to_play.play();
        } else if(restartIfPlaying) {
            playing_sound.stop();
            sound_to_play.play();
        }

        this.soundName = name;
    } // Play


    //--------------------------------------------------------------------------
    ToggleMute()
    {
        this.isMuted = !this.isMuted;
        if(this.soundName) {
            const sound = this.sounds[this.soundName];
            sound.volume = this.isMuted ? 0 : 1;
        }
    } // ToggleMute
} // AudioPlayer
