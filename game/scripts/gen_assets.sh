#!/usr/bin/env bash

source /usr/local/src/stdmatt/shellscript_utils/main.sh

SCRIPT_DIR="$(pw_get_script_dir)";
pw_pushd "$SCRIPT_DIR";

./gen_font_defs.py
./gen_var_names.py

pw_popd;
