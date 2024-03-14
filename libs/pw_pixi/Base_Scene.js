class pw_Base_Scene
    extends PIXI.Container
{

    //--------------------------------------------------------------------------
    static
    GetName()
    {
        // @notice: This "this" does not refer to a "object instance" in the
        // common sense, but to the class object that is used to construct
        // the object. This means that for subclasses it will be the
        // name of the subclass, which is exactly what we want ;D
        //
        // Javascript sucks, but it's nice at same time... until it bites
        // you again ;DD
        //
        // stdmatt - Jul 23, 2020
        return this.name;
    }


    //--------------------------------------------------------------------------
    constructor()
    {
        super();
        this.rtvar_objectId = pw_Utils_UniqueId();
    } // scene

    //--------------------------------------------------------------------------
    Update(dt)
    {
        // Do nothing...
    }

    //--------------------------------------------------------------------------
    OnLoad()
    {
        // Do nothing...
    }

    //--------------------------------------------------------------------------
    OnUnload()
    {
        // Do nothing...
    }

    //--------------------------------------------------------------------------
    OnEnter()
    {
        // Do nothing...
    }

    //--------------------------------------------------------------------------
    OnExit()
    {
        // Do nothing...
    }

    OnSizeChanged()
    {
        const design = Get_Design_Size();
        const screen = Get_Screen_Size();
        const actual = Get_Actual_Size();

        let x, y;
        if(screen.x < design.x || screen.y < design.y) {
            this.scale.x = actual.x / design.x;
            this.scale.y = actual.y / design.y;

            x = screen.x * 0.5 - actual.x * 0.5;
            y = screen.y * 0.5 - actual.y * 0.5;
        } else {
            x = screen.x * 0.5 - design.x * 0.5;
            y = screen.y * 0.5 - design.y * 0.5;
        }

        this.x =  x;
        this.y =  y;
    }


}; // class BaseScene
