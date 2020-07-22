#!/usr/bin/env python3
##~---------------------------------------------------------------------------##
##                        _      _                 _   _                      ##
##                    ___| |_ __| |_ __ ___   __ _| |_| |_                    ##
##                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   ##
##                   \__ \ || (_| | | | | | | (_| | |_| |_                    ##
##                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   ##
##                                                                            ##
##  File      : gen_var_names.py                                              ##
##  Project   : koliery                                                       ##
##  Date      : Jul 22, 2020                                                  ##
##  License   : GPLv3                                                         ##
##  Author    : stdmatt <stdmatt@pixelwizards.io>                             ##
##  Copyright : stdmatt - 2020                                                ##
##                                                                            ##
##  Description :                                                             ##
##                                                                            ##
##  Scans the ./res directory and create arrays and const var names with      ##
##  the path of the file.                                                     ##
##                                                                            ##
##  For a given path like:        path/to/file/filename.ext                   ##
##  it will generate a var like:  PATH_TO_FILE_FILENAME_EXT                   ##
##                                                                            ##
##  This will enable us to reference that files easily on the js code.        ##
##                                                                            ##
##  Currently, we have the following types that are accepted and the names    ##
##  of the vars generated:                                                    ##
##      .png  -> TEXTURES_TO_LOAD                                             ##
##      .frag -> SHADERS_TO_LOAD                                              ##
##      .fnt  -> FONTS_TO_LOAD                                                ##
##      .wav  -> SOUNDS_TO_LOAD                                               ##
##      .mp3  -> MUSIC_TO_LOAD                                                ##
##                                                                            ##
##  The arrays are be generated even if they're empty                         ##
##---------------------------------------------------------------------------~##

##----------------------------------------------------------------------------##
## Imports                                                                    ##
##----------------------------------------------------------------------------##
from pathlib import Path
import sys;
import os;
import os.path;
## PixWiz
from pw_py_core import *


##----------------------------------------------------------------------------##
## Constants                                                                  ##
##----------------------------------------------------------------------------##
SCRIPT_DIR = pw_get_script_dir();
ROOT_DIR   = os.path.normpath(os.path.join(SCRIPT_DIR, ".."));
RES_DIR    = os.path.join(ROOT_DIR, "res");
SRC_DIR    = os.path.join(ROOT_DIR, "src");

OUTPUT_FILENAME = os.path.join(SRC_DIR, "Resources.Generated.js");


##----------------------------------------------------------------------------##
## Vars                                                                       ##
##----------------------------------------------------------------------------##
output_filename = None;
output_text     = "";


##----------------------------------------------------------------------------##
## Functions                                                                  ##
##----------------------------------------------------------------------------##
##------------------------------------------------------------------------------
def gen_assets_names(type_extension, variable_name):
    global output_text;
    output_text += "//" + "-" * 80 + "\n";

    filenames = [];
    decls     = [];

    glob_pattern      = "**/*.{0}".format(type_extension);
    extension_pattern = ".{0}"    .format(type_extension);
    root_path         = ROOT_DIR + "/";

    for path in Path(RES_DIR).glob(glob_pattern):
        quoted_path = pw_str_remove_all("\"{0}\"".format(path), root_path);
        filenames.append(quoted_path);

        var_name = pw_str_remove_all(str(path), "./", root_path);
        var_name = pw_str_make_valid_var_name(var_name, is_upper_case=True);

        decl = "const {varname} = {filename}".format(
            varname  = var_name,
            filename = quoted_path
        );
        decls.append(decl);

    output_text += "\n".join(decls);
    output_text += "\n\n";
    output_text += "const {0} = [ {1} ] \n".format(
        variable_name,
        ",\n".join(filenames)
    );
    output_text += "\n"



##----------------------------------------------------------------------------##
## Script                                                                     ##
##----------------------------------------------------------------------------##
gen_assets_names("png",  "TEXTURES_TO_LOAD");
gen_assets_names("frag", "SHADERS_TO_LOAD" );
gen_assets_names("fnt",  "FONTS_TO_LOAD"   );
gen_assets_names("wav",  "SOUNDS_TO_LOAD"  );
gen_assets_names("mp3",  "MUSIC_TO_LOAD"   );

print("Writting on: ", OUTPUT_FILENAME);
with open(OUTPUT_FILENAME, "w") as f:
    f.write(output_text);
