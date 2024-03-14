function
pw_DOM_CreateButton(text, on_click, parent, id)
{

    const div    = document.createElement("div");
    const button = document.createElement("input");

    button.type    = "button";
    button.value   = text;
    button.onclick = on_click;

    if(id) {
        div   .id = id;
        button.id = pw_String_Cat(id, "_button");
    }

    div.appendChild(button);
    div.button = button;

    if(parent) {
        parent.appendChild(div);
    }

    return div;
}

function
pw_DOM_CreateSlider(text, min, max, initial_ratio, step, on_input, on_change, parent, id)
{
    const div    = document.createElement("div");
    const label  = document.createElement("label");
    const value  = document.createElement("label");
    const slider = document.createElement("input");

    slider.type = "range";
    slider.min  = min;
    slider.max  = max;
    slider.step = step;
    slider.value = (min + max) * initial_ratio;

    slider.oninput = ()=>{
        value.innerHTML = slider.value;
        if(on_input) {
            on_input(parseFloat(slider.value));
        }
    }
    slider.onchange = ()=>{
        if(on_change) {
            on_change(parseFloat(slider.value));
        }
    }

    label.innerHTML = text;
    value.innerHTML = slider.value;

    if(id) {
        div   .id = id;
        label .id = pw_String_Cat(id, "_label");
        slider.id = pw_String_Cat(id, "_slider");
        value. id = pw_String_Cat(id, "_value");
    }


    div.appendChild(label);
    div.appendChild(slider);
    div.appendChild(value);

    div.slider = slider;

    if(parent) {
        parent.appendChild(div);
    }

    return div;
}


function
pw_DOM_CreateCheckbox(text, is_checked, on_change, parent, id)
{

    const div   = document.createElement("div");
    const label = document.createElement("label");
    const check = document.createElement("input");

    check.type    = "checkbox";
    check.checked = is_checked;

    check.onchange = ()=>{
        if(on_change) {
            on_change(check.checked);
        }
    }

    label.innerHTML = text;

    if(id) {
        div  .id = id;
        label.id = pw_String_Cat(id, "_label");
        check.id = pw_String_Cat(id, "_checkbox");
    }


    div.appendChild(check);
    div.appendChild(label);
    div.checkbox = check;

    if(parent) {
        parent.appendChild(div);
    }

    return div;
}
