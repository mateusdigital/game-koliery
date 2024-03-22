#!/usr/bin/env bash
##~---------------------------------------------------------------------------##
##                               *       +                                    ##
##                         '                  |                               ##
##                     ()    .-.,="``"=.    - o -                             ##
##                           '=/_       \     |                               ##
##                        *   |  '=._    |                                    ##
##                             \     `=./`,        '                          ##
##                          .   '=.__.=' `='      *                           ##
##                 +                         +                                ##
##                      O      *        '       .                             ##
##                                                                            ##
##  File      : generate-release-zip.ps1                                      ##
##  Project   : Same Game                                                     ##
##  Date      : 2024-03-21                                                    ##
##  License   : See project's COPYING.TXT for full info.                      ##
##  Author    : mateus.digital <hello@mateus.digital>                         ##
##  Copyright : mateus.digital - 2024                                         ##
##                                                                            ##
##  Description :                                                             ##
##    Generates the release zip file.                                         ##
##---------------------------------------------------------------------------~##


$PLATFORM_NAME     = "web";
$PROJECT_NAME      = "koliery";
$PROJECT_VERSION="$(git describe --abbrev=0 --tags)";
if($PROJECT_VERSION.Length -eq 0) {
    $PROJECT_VERSION="pre-release";
}
$FULL_PROJECT_NAME ="${PROJECT_NAME}_${PROJECT_VERSION}";

$OUTPUT_DIR    = "dist/${FULL_PROJECT_NAME}";
$ZIP_FULL_PATH = "dist/${FULL_PROJECT_NAME}_${PLATFORM_NAME}.zip";


Write-Output "==> Generating release zip ($PLATFORM_NAME)...";

## Create the directory.
if(Test-Path "$OUTPUT_DIR") {
    Remove-Item -Path "$OUTPUT_DIR" -Force -Recurse;
}
New-Item -ItemType Directory -Path "$OUTPUT_DIR";

## Copy resources.
Copy-Item -Path "out/*"                        -Destination $OUTPUT_DIR -Verbose -Recurse;
Copy-Item -Path "resources/readme-release.txt" -Destination $OUTPUT_DIR -Verbose;

## NMake the zip
Compress-Archive -Path "$OUTPUT_DIR" -DestinationPath "$ZIP_FULL_PATH" -Force;

Write-Output "==> Done...";
