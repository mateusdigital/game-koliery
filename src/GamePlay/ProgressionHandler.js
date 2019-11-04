//----------------------------------------------------------------------------//
// Progression Handler                                                        //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
class ProgressionHandler
{

    constructor(difficulty, level)
    {
        //
        // iVars.
        // State.
        this.difficulty = difficulty;
        this.level      = level;
        this.score      = 0;

        //
        this.maxTimeToMove      = 0;
        this.scoreForMovingFast = 1;

        // Callbacks.
        this.onLevelChangeCallback = null;
        this.onScoreChangeCallback = null;
        this.onMatchCallback       = null;

        //
        // Initialize.
        this._CalculateStats();
    }

    //--------------------------------------------------------------------------
    AddScoreForMovingFast()
    {
        this.score += scoreForMovingFast;
        this.onScoreChangeCallback();

        this._CalculateStats();
    } // AddScoreForMovingFast

    //--------------------------------------------------------------------------
    AddScoreWithMatchInfo(matchInfo)
    {
        this.score += 500;
        this.onScoreChangeCallback();

        this._CalculateStats();
    } // AddScoreWithMatchInfo


    //--------------------------------------------------------------------------
    _CalculateStats()
    {

    } // _CalculateStats

}; // class ProgressionHandler
