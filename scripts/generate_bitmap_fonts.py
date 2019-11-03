#!/usr/bin/env python

##----------------------------------------------------------------------------##
## Imports                                                                    ##
##----------------------------------------------------------------------------##
import json;
import os;
import os.path;

##----------------------------------------------------------------------------##
## Constants                                                                  ##
##----------------------------------------------------------------------------##
FONTS_DIR_PATH     = "./res/fonts";
FONTS_DEF_FILENAME = "FontSizes.json";
FONTS_JS_FILENAME  = "Fonts.js"

GLYPHER_BIN = "/Users/stdmatt/Documents/Projects/stdmatt/tools/glypher/build.xcode/Debug/glypher";

##----------------------------------------------------------------------------##
## Functions                                                                  ##
##----------------------------------------------------------------------------##
##------------------------------------------------------------------------------
def create_output_contents_header():
    s  = "//" + "-" * 76 + "//\n";
    s += "//" + " " * 76 + "//\n";
    s += "// [AUTO GENERATED] " + __file__ + " changes will be lost\n";
    s += "// [AUTO GENERATED] " + __file__ + " changes will be lost\n";
    s += "//" + " " * 76 + "//\n";
    s += "//" + "-" * 76 + "//\n";
    s += "\n\n";

    return s;


def call_glypher(size, font_filename):
    cmd_args = [
        "-V",
        # "--no-gui",

        "--font-file",
        font_filename,

        "--font-size",
        str(size),

        "--output-file",
        FONTS_DIR_PATH,

        "--glyphs-string",
        "upper,digits,special",

        "--fill-color",
        "FFFFFFFF",
    ];

    args_str = " ".join(cmd_args);
    cmd_str  = "{bin} {args}".format(bin=GLYPHER_BIN, args=args_str);
    os.system(cmd_str);


##------------------------------------------------------------------------------
def main():
    ## Change the CWD to the Project Root.
    script_dir    = os.path.dirname(os.path.realpath(__file__));
    proj_root_dir = os.path.join(script_dir, "..");
    os.chdir(proj_root_dir);

    ## Read the json with the font sizes.
    f = open(os.path.join(FONTS_DIR_PATH, FONTS_DEF_FILENAME));
    fonts_def_contents = "\n".join(f.readlines());
    fonts_def          = json.loads(fonts_def_contents);
    f.close();

    ## For each font create the bitmap and append the info
    ## into the final js output file.
    output_contents = create_output_contents_header();
    for font_def in fonts_def:
        name = font_def["name"];
        size = font_def["size"];
        font = font_def["font"];

        font_filename = os.path.join(FONTS_DIR_PATH, font) + ".ttf";
        call_glypher(size, font_filename);

        output_contents += "const {name} = {size}\n".format(name=name, size=size);

    ## Find all the generated fonts on the output folder and add this
    ## to the "generated fonts array" on the output JS.
    ## This will allow us to load all the fonts on the main of game.
    output_contents += "\n\n";
    output_contents += "FONTS_TO_LOAD = [\n";
    for filename in os.listdir(FONTS_DIR_PATH):
        if(filename.endswith(".fnt")):
            output_contents += "    \"{filename}\",\n".format(
                filename=os.path.join(FONTS_DIR_PATH, filename)
            );
    output_contents += "];";


    ## Write the JS file.
    f = open(os.path.join(FONTS_DIR_PATH, FONTS_JS_FILENAME), "w");
    f.write(output_contents);
    f.close();



main();
