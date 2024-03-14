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

    OnSizeChanged(width, height)
    {
        var design = Get_Design_Size();
        var screen = Get_Screen_Size();

        this.x = screen.x * 0.5 - design.x * 0.5;
        this.y = screen.y * 0.5 - design.y * 0.5;
    }
}; // class BaseScene
