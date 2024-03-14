//----------------------------------------------------------------------------//
// SceneManager                                                              //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
class pw_Scene_Manager
{
    //--------------------------------------------------------------------------
    constructor()
    {
        this.currScene         = null;
        this.sceneStack        = [];
        this.registered_scenes = {};
    } // ctor

    //--------------------------------------------------------------------------
    RegisterScenes(...args)
    {
        for(let i = 0; i < args.length; ++i) {
            const scene = args[i];
            const name  = scene.GetName();
            this.registered_scenes[name] = scene;
        }
    } // RegisterScenes

    //--------------------------------------------------------------------------
    StartWithQueryString()
    {
        const query_obj  = pw_Utils_GetQueryString();
        if(!query_obj) {
            return false;
        }

        const target_scene_name = query_obj.get("scene");
        if(!target_scene_name) {
            return false;
        }

        const keys = Object.keys(this.registered_scenes);
        for(let i = 0; i < keys.length; ++i) {
            const scene_name = keys[i];
            const contains   = pw_String_Contains(scene_name, target_scene_name, PW_STR_IGNORE_CASE);
            if(contains) {
                // @incomplete: Find a way to pass parameters....
                const scene_class    = this.registered_scenes[scene_name];
                const scene_instance = new scene_class();
                this.SetScene(scene_instance);
                return true;
            }
        }

        return false;
    } // StartWithQueryString


    //--------------------------------------------------------------------------
    PushScene(scene)
    {
        // Pushing the same scene....
        if(this.currScene != null &&
           this.currScene.rtvar_objectId == scene.rtvar_objectId)
        {
            debugger;
            return;
        }

        if(this.currScene) {
            this.currScene.OnExit();
            this.currScene.parent.removeChild(this.currScene);
        }

        this.currScene = scene;
        this.currScene.OnLoad();

        this.sceneStack.push(scene);
        _pw_App.stage.addChild(this.currScene);

        this.currScene.OnEnter();
    } // Push Scene

    //--------------------------------------------------------------------------
    SetScene(scene)
    {
        while(this.sceneStack.length != 0) {
            this.PopScene();
        }
        this.currScene = null;
        this.PushScene(scene);
    } // Set Scene

    //--------------------------------------------------------------------------
    PopScene()
    {
        const scene = pw_Array_GetBack(this.sceneStack);
        scene.OnExit();

        if(scene.parent != null) {
            scene.parent.removeChild(scene);
        }

        scene.OnUnload();
        pw_Array_RemoveLast(this.sceneStack);

        const prev_scene = pw_Array_GetBack(this.sceneStack);
        if(prev_scene) {
            _pw_App.stage.addChild(prev_scene);
            prev_scene.OnEnter();
            this.currScene = prev_scene;
        }
    }

    //--------------------------------------------------------------------------
    Update(dt)
    {
        this.currScene.Update(dt);
    }

    //--------------------------------------------------------------------------
    Resize(width, height)
    {
        this.currScene.OnSizeChanged(width, height);
    }
}; // class SceneManager


//------------------------------------------------------------------------------
const PW_SCENE_MANAGER = new pw_Scene_Manager();
