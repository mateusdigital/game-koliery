//----------------------------------------------------------------------------//
// HighscoreManager                                                           //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const HIGHSCORE_MANAGER_ENDPOINT = "http://0.0.0.0:8000/";
const HIGHSCORE_MANAGER_FILENAME = "highscores.json";

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
    } catch {
        data = _Create_MockScores();
    }

    return data;
}

//------------------------------------------------------------------------------
class HighscoreManager
{
    //--------------------------------------------------------------------------
    constructor()
    {
        this.scores = null;
    } // ctor

    //--------------------------------------------------------------------------
    async FetchScores()
    {
        const url  = String_Cat(HIGHSCORE_MANAGER_ENDPOINT, HIGHSCORE_MANAGER_FILENAME);
        const data = await _Fetch_Async(url);

        this.scores = data;
    } // FetchScores

    //--------------------------------------------------------------------------
    GetScores()
    {
        return this.scores;
    } // GetScores

} // class HighscoreManager

//------------------------------------------------------------------------------
const HIGHSCORE_MANAGER = new HighscoreManager();
