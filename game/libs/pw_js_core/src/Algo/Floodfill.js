//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Floodfill.js                                                  //
//  Project   : pw_js_core                                                    //
//  Date      : May 10, 2020                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2020                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//

//------------------------------------------------------------------------------
function
pw_Algo_FloodFind(container, start_x, start_y,  predicate)
{
    const XY   = (x, y)  => { return {x:x, y:y}     };
    const COPY = (xy)    => { return XY(xy.x, xy.y) };
    const GET  = (c, xy) => { return c[xy.y][xy.x]  };

    // @TODO(stdmatt): Can use a Set so instead O(N) be O(logN).
    const VISITED = (c, xy) => {
        return pw_Array_Contains(c, (_xy) => {
            let b = _xy.x == xy.x && _xy.y == xy.y
            return b;
        }
    )};

    let result  = [];
    let queue   = [XY(start_x, start_y)];
    let visited = [];

    while(queue.length != 0) {
        let coord    = pw_Array_PopFront(queue);
        let matching = [];

        if(VISITED(visited, coord)) {
            continue;
        }
        visited.push(coord);

        const item = GET(container, coord);
        if(!predicate(item)) {
            continue;
        }
        result.push(item);

        // Search left...
        for(let left_coord = XY(coord.x -1, coord.y);
            left_coord.x >= 0;
            --left_coord.x)
        {
            const item = GET(container, left_coord);
            if(!predicate(item)) {
                break;
            }
            matching.push(COPY(left_coord));
        }

        // Search right...
        for(let right_coord = XY(coord.x + 1, coord.y);
            right_coord.x < container[right_coord.y].length;
            ++right_coord.x)
        {
            const item = GET(container, right_coord);
            if(!predicate(item)) {
                break;
            }
            matching.push(COPY(right_coord));
        }

        // Search top...
        for(let top_coord = XY(coord.x, coord.y -1);
            top_coord.y >= 0;
            --top_coord.y)
        {
            const item = GET(container, top_coord);
            if(!predicate(item)) {
                break;
            }
            matching.push(COPY(top_coord));
        }

        // Search bottom...
        for(let bottom_coord = XY(coord.x, coord.y +1);
            bottom_coord.y < container.length;
            ++bottom_coord.y)
        {
            const item = GET(container, bottom_coord);
            if(!predicate(item)) {
                break;
            }
            matching.push(COPY(bottom_coord));
        }

        for(let i = 0; i < matching.length; ++i) {
            const match_coord = matching[i]
            queue.push(match_coord);
        }
    }

    return result;
}
