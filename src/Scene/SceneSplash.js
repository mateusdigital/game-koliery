const SPLASH_SCENE_FONT_SIZE = 35;

class SceneSplash
    extends Base_Scene
{
    //--------------------------------------------------------------------------
    constructor()
    {
        super();

        this.stdmattText  = new Text("stdmatt",  SPLASH_SCENE_FONT_SIZE);
        this.presentsText = new Text("presents", SPLASH_SCENE_FONT_SIZE);

        this.addChild(this.stdmattText );
        this.addChild(this.presentsText);
    } // ctor

}; // class SceneSplash
