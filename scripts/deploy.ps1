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
##  File      : deploy.ps1                                                    ##
##  Project   : Koliery                                                       ##
##  Date      : 2024-03-19                                                    ##
##  License   : See project's COPYING.TXT for full info.                      ##
##  Author    : mateus.digital <hello@mateus.digital>                         ##
##  Copyright : mateus.digital - 2024                                         ##
##                                                                            ##
##  Description :                                                             ##
##   Deploys the output of scripts/build-static.ps1 to the remote server.     ##
##   Current user should have remote ssh keys installed on the server.        ##
##---------------------------------------------------------------------------~##

##
##  Directories
##

##------------------------------------------------------------------------------
$SOURCE_FOLDER="./out";
$REMOTE_SERVER="mateus@mateus.digital";
$REMOTE_FOLDER="/var/www/mateus.digital/html/koliery";

scp -r                                 `
    "${SOURCE_FOLDER}/*"               `
    "${REMOTE_SERVER}:${REMOTE_FOLDER}"
