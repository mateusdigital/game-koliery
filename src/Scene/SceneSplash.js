const SPLASH_SCENE_FONT_SIZE = 40;

class SceneSplash
    extends Base_Scene
{
    //--------------------------------------------------------------------------
    constructor()
    {
        super();

        //
        // iVars.
        // Properties.
        this.stdmattText  = new Text("stdmatt",  SPLASH_SCENE_FONT_SIZE);
        this.presentsText = new Text("presents", SPLASH_SCENE_FONT_SIZE);

        //
        // Initialize.
        const screen_size = Get_Screen_Size();

        this.stdmattText.pivot.set(0.5);
        this.stdmattText.x = (screen_size.x * 0.5);
        this.stdmattText.y = (screen_size.y * 0.5) - this.stdmattText.height;

        this.presentsText.pivot.set(0.5);
        this.presentsText.x = (screen_size.x * 0.5);
        this.presentsText.y = (screen_size.y * 0.5) + this.presentsText.height;

        this.addChild(this.stdmattText );
        this.addChild(this.presentsText);
    } // ctor

}; // class SceneSplash
