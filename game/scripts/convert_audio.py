#!/usr/bin/env python
##----------------------------------------------------------------------------##
##                       __      __                  __   __                  ##
##               .-----.|  |_.--|  |.--------.---.-.|  |_|  |_                ##
##               |__ --||   _|  _  ||        |  _  ||   _|   _|               ##
##               |_____||____|_____||__|__|__|___._||____|____|               ##
##                                                                            ##
##  File      : generate_bitmap_fonts.py                                      ##
##  Project   : columns                                                       ##
##  Date      : Nov 03, 2019                                                  ##
##  License   : GPLv3                                                         ##
##  Author    : stdmatt <stdmatt@pixelwizards.io>                             ##
##  Copyright : stdmatt - 2019                                                ##
##                                                                            ##
##  Description :                                                             ##
##                                                                            ##
##----------------------------------------------------------------------------##

##----------------------------------------------------------------------------##
## Imports                                                                    ##
##----------------------------------------------------------------------------##
import json;
import os;
import os.path;
import shutil;

##----------------------------------------------------------------------------##
## Constants                                                                  ##
##----------------------------------------------------------------------------##
MUSIC_DIR_PATH    = "./res/music";
OUTPUT_DIR_PATH   = os.path.join(MUSIC_DIR_PATH, "generated");
MUSIC_JS_FILENAME = os.path.join(OUTPUT_DIR_PATH, "Music.js");


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

##------------------------------------------------------------------------------
def call_ffmpeg(input_path, output_path):
    if(input_path.endswith(".mp3")): ## Already mp3, just copy.
        shutil.copyfile(input_path, output_path);
    else:
        cmd = "ffmpeg -y -i  {audio_filename} -acodec libmp3lame {output_filename}".format(
            audio_filename  = input_path,
            output_filename = output_path
        );
        os.system(cmd);

##----------------------------------------------------------------------------##
## Entry Point                                                                ##
##----------------------------------------------------------------------------##
##------------------------------------------------------------------------------
def main():
    ## Change the CWD to the Project Root.
    script_dir    = os.path.dirname(os.path.realpath(__file__));
    proj_root_dir = os.path.join(script_dir, "..");
    os.chdir(proj_root_dir);

    output_contents = create_output_contents_header();
    output_path     = OUTPUT_DIR_PATH;
    os.system("mkdir -p {path}".format(path=output_path));

    for curr_filename in os.listdir(MUSIC_DIR_PATH):
        ## Hidden or ./, ../
        if(curr_filename.startswith(".")):
            continue;

        ## Not an audio file.
        filename, ext = os.path.splitext(curr_filename);
        if(ext not in [".wav", ".mp3"]):
            continue;

        input_filename  = os.path.join(MUSIC_DIR_PATH, curr_filename);
        output_filename = os.path.join(OUTPUT_DIR_PATH, filename) + ".mp3";
        call_ffmpeg(input_filename, output_filename);

        output_contents += "const {name} = \"{size}\";\n".format(
            name = "MUSIC_" + filename.upper(),
            size = output_filename
        );

    ## Find all the generated audios on the output folder and add this
    ## to the "generated audios array" on the output JS.
    ## This will allow us to load all the audios on the main of game.
    output_contents += "\n\n";
    output_contents += "const MUSICS_TO_LOAD = [\n";
    for filename in os.listdir(OUTPUT_DIR_PATH):
        if(filename.endswith(".mp3")):
            output_contents += "    \"{filename}\",\n".format(
                filename=os.path.join(OUTPUT_DIR_PATH, filename)
            );
    output_contents += "];";


    ## Write the JS file.
    f = open(MUSIC_JS_FILENAME, "w");
    f.write(output_contents);
    f.close();


##------------------------------------------------------------------------------
main();
