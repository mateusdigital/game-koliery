#!/usr/bin/env python3
##~---------------------------------------------------------------------------##
##                        _      _                 _   _                      ##
##                    ___| |_ __| |_ __ ___   __ _| |_| |_                    ##
##                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   ##
##                   \__ \ || (_| | | | | | | (_| | |_| |_                    ##
##                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   ##
##                                                                            ##
##  File      : gen_font_defs.py                                              ##
##  Project   : koliery                                                       ##
##  Date      : Jul 22, 2020                                                  ##
##  License   : GPLv3                                                         ##
##  Author    : stdmatt <stdmatt@pixelwizards.io>                             ##
##  Copyright : stdmatt - 2020                                                ##
##                                                                            ##
##  Description :                                                             ##
##                                                                            ##
##  This tool scans the res/ directory, find all .fnt files on it,            ##
##  process and export it to src/FontDefs.Generated.js                        ##
##                                                                            ##
##  - font face to be the keys of the dictionary.                             ##
##  - sizes a list of that key.                                               ##
##  - each font face will have a var if it's name in upper case.              ##
##                                                                            ##
##---------------------------------------------------------------------------~##
##----------------------------------------------------------------------------##
## Imports                                                                    ##
##----------------------------------------------------------------------------##
import sys;
import os;
import os.path;
from pathlib import Path;
from xml.dom import minidom
import json;
## PixWiz
from pw_py_core import *


##----------------------------------------------------------------------------##
## Constants                                                                  ##
##----------------------------------------------------------------------------##
SCRIPT_DIR = pw_get_script_dir();
ROOT_DIR   = os.path.normpath(os.path.join(SCRIPT_DIR, ".."));
RES_DIR    = os.path.join(ROOT_DIR, "res");
SRC_DIR    = os.path.join(ROOT_DIR, "src");

OUTPUT_FILENAME = os.path.join(SRC_DIR, "FontDefs.Generated.js");


##----------------------------------------------------------------------------##
## Functions                                                                  ##
##----------------------------------------------------------------------------##
##------------------------------------------------------------------------------
def gen_font_defs():
    glob_pattern      = "**/*.{0}".format("fnt");
    extension_pattern = ".{0}"    .format("fnt");
    root_path         = ROOT_DIR + "/";

    font_defs = {};
    for path in Path(RES_DIR).glob(glob_pattern):
        path = str(path);

        fnt_doc = minidom.parse(path);
        info_   = fnt_doc.getElementsByTagName("info")[0]; ## @todo: report errors...

        font_family = info_.attributes["face"].value;
        font_size   = info_.attributes["size"].value;

        if(font_family not in font_defs):
            font_defs[font_family] = set();

        prev_size = len(font_defs[font_family]);
        font_defs[font_family].add(int(font_size));
        curr_size = len(font_defs[font_family]);

        if(curr_size == prev_size):
            pw_log_fatal(
                "Processing font file with the same family and size.",
                "  Font Family: {0}",
                "  Font Size  : {1}",
                "  .fnt Path  : ({2})",
                font_family,
                font_size,
                path
            );

    ## Font defs var.
    output_text = "";
    output_text += "//" + "-" * 80 + "\n";
    font_def_var_content = "{\n";
    for family, sizes in font_defs.items():
        font_def_var_content += "{0} : {1},\n".format(
            family,
            list(sizes)
        );
    font_def_var_content += "\n}";
    output_text += "const FONT_DEFS = {0}".format(font_def_var_content);
    output_text += "\n\n";

    ## Family var names.
    output_text += "//" + "-" * 80 + "\n";
    for family in font_defs.keys():
        var_name = pw_str_make_valid_var_name(family, is_upper_case=True);
        quoted   = pw_str_quote              (family, is_double_quotes=True);

        output_text += "const FONT_{0} = {1};\n".format(var_name, quoted);

    pw_file_write_all_text(OUTPUT_FILENAME, output_text);



gen_font_defs();
