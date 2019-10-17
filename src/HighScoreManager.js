//----------------------------------------------------------------------------//
// HighscoreManager                                                           //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const HIGHSCORE_MANAGER_ENDPOINT        = "";
const HIGHSCORE_MANAGER_ENDPOINT_FETCH  = "";
const HIGHSCORE_MANAGER_ENDPOINT_INSERT = "";

const HIGHSCORE_MAX_DIGITS   = 5;
const HIGHSCORE_MAX_ENTRIES = 10;

const HIGHSCORE_MOCK_SCORE_MIN =  100;
const HIGHSCORE_MOCK_SCORE_MAX = 5000;


//------------------------------------------------------------------------------
function _Create_MockScores()
{
    data = [];
    const names = ["std", "ale", "sol", "don", "pin"];
    for(let i = 1; i <= HIGHSCORE_MAX_ENTRIES; ++i) {
        const name  = names[Random_Int(0, names.length)];
        const score = Random_Int(HIGHSCORE_MOCK_SCORE_MIN, HIGHSCORE_MOCK_SCORE_MAX);
        data.push({
            name  : name,
            score : score
        });
    }

    data.sort((d1, d2)=>{
        return d2.score - d1.score;
    });

    return data;
}

//------------------------------------------------------------------------------
async function _Fetch_Async(url)
{
    let data = null;
    try {
        const response = await fetch(url);
        data = await response.json();
    } catch (e){
        debugger;
        console.log("Failed to get scores... Mocking it...");
        data = _Create_MockScores();
    }

    return data;
}

//------------------------------------------------------------------------------
async function _Insert_Async(url)
{
    try {
        const response = await fetch(url);
    } catch (e){
        // debugger;
    }
}

//------------------------------------------------------------------------------
class HighscoreManager
{
    //--------------------------------------------------------------------------
    constructor()
    {
        this.scores       = null;
        this.highestScore = 0;
        this.currScore    = 0;
    } // ctor

    //--------------------------------------------------------------------------
    async FetchScores()
    {
        const url  = String_Cat(HIGHSCORE_MANAGER_ENDPOINT, HIGHSCORE_MANAGER_FILENAME);
        const data = await _Fetch_Async(url);

        this.scores       = data;
        this.highestScore = this.scores[0].score;
    } // FetchScores

    //--------------------------------------------------------------------------
    UpdateCurrentScoreValue(score)
    {
        this.currScore = score;
        if(this.currScore > this.highestScore) {
            this.highestScore = this.currScore;
        }
    } // UpdateCurrentScoreValue

    //--------------------------------------------------------------------------
    GetHighScoreValue()
    {
        return this.highestScore;
    } // GetHighScoreValue


    //--------------------------------------------------------------------------
    GetScores()
    {
        return this.scores;
    } // GetScores

} // class HighscoreManager

//------------------------------------------------------------------------------
const HIGHSCORE_MANAGER = new HighscoreManager();
