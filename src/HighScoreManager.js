//----------------------------------------------------------------------------//
// HighscoreManager                                                           //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const HIGHSCORE_MANAGER_ENDPOINT        = "https://stdmatt.com/";
const HIGHSCORE_MANAGER_ENDPOINT_FETCH  = "test.php";
const HIGHSCORE_MANAGER_ENDPOINT_INSERT = "insert.php";

const HIGHSCORE_MAX_DIGITS   = 5;
const HIGHSCORE_MAX_ENTRIES = 10;

const HIGHSCORE_MOCK_SCORE_MIN =  100;
const HIGHSCORE_MOCK_SCORE_MAX = 5000;

const HIGHSCORE_SCORE_POSITION_OUT_OF_RANK = -1;

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
        debugger;
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
        const url  = String_Cat(HIGHSCORE_MANAGER_ENDPOINT, HIGHSCORE_MANAGER_ENDPOINT_FETCH);
        const data = await _Fetch_Async(url);

        this.scores       = data;
        this.highestScore = this.scores[0].score;
    } // FetchScores

    //--------------------------------------------------------------------------
    async UploadScore(name)
    {
        if(this.GetCurrentScorePosition() == HIGHSCORE_SCORE_POSITION_OUT_OF_RANK) {
            return;
        }

        const url = String_Cat(
            HIGHSCORE_MANAGER_ENDPOINT,
            HIGHSCORE_MANAGER_ENDPOINT_INSERT,
            "?name=", name,
            "&score=", this.currScore
        );

        await _Insert_Async(url);
        this.FetchScores();
    } // UploadScore

    //--------------------------------------------------------------------------
    UpdateCurrentScoreValue(score)
    {
        this.currScore = score;
        if(this.currScore > this.highestScore) {
            this.highestScore = this.currScore;
        }
    } // UpdateCurrentScoreValue

    //--------------------------------------------------------------------------
    GetCurrentScorePosition()
    {
        for(let i = 0; i < this.scores.length; ++i) {
            const item = this.scores[i];
            if(this.currScore >= item.score) {
                return i;
            }
        }
        return HIGHSCORE_SCORE_POSITION_OUT_OF_RANK;
    }

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
