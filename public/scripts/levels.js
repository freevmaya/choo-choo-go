
// Параметры игры - ИНДЕКСЫ для локализации названий уровней
var GAME_PARAMS = {
    TEST: {
        NAME: 'difficulty_test', // Индекс для локализации
        ENV: {
            BACKGROUND_COLOR: 0xBBBBFF,
            GROUND_COLOR: 0x884455,
            KEY_LIGHT_COLOR: 0xffffff,
            RIM_LIGHT_COLOR: 0x818cf8,
            FILL_LIGHT_COLOR: 0x63a188,
            AMBIENT_LIGHT_INTENSITY: 1,
            KEY_LIGHT_INTENSITY: 3,
            FILL_LIGHT_INTENSITY: 2,
            RIM_LIGHT_INTENSITY: 0.6
        },
        "items":[{"type":"StraightTrack","location":[-3,1,0]},{"type":"ForkTrack","location":[-3,2,0]},{"type":"CurvedTrack","location":[-2,2,1]},{"type":"StraightTrack","location":[-2,3,0]},{"type":"CurvedTrack","location":[-2,4,3]},{"type":"StraightTrack","location":[-1,4,1]},{"type":"StraightTrack","location":[0,4,1]},{"type":"CurvedTrack","location":[1,4,0]},{"type":"StraightTrack","location":[1,3,0]},{"type":"StraightTrack","location":[1,2,0]},{"type":"StraightTrack","location":[-4,2,1]},{"type":"CurvedTrack","location":[-5,2,3]},{"type":"StraightTrack","location":[-5,1,0]},{"type":"StraightTrack","location":[-5,0,0]},{"type":"StraightTrack","location":[-5,-1,0]},{"type":"CurvedTrack","location":[-5,-2,2]},{"type":"StraightTrack","location":[-4,-2,1]},{"type":"PointTrack","location":[-3,0,0]},{"type":"FinishTrack","location":[1,1,0]}],"objects":[{"type":"SimpleTree","location":[0,2,0]},{"type":"SimpleTree","location":[2,0,0]},{"type":"SimpleTree","location":[-3,-1,0]}],"carts":[{"type":"Train","location":[-3,1,true],"trackPos":{"pathIndex":0,"indexPosInChain":0,"forwardInTrack":true},"chain":[]},{"type":"Wagon","location":[-2,3,true],"trackPos":{"pathIndex":0,"indexPosInChain":0,"forwardInTrack":true}},{"type":"Wagon","location":[-5,0,true],"trackPos":{"pathIndex":0,"indexPosInChain":0,"forwardInTrack":true}}]
     },
    SIMPLE: {
        NAME: 'simple_level', // Индекс для локализации
        ENV: {
            BACKGROUND_COLOR: 0xBBBBFF,
            KEY_LIGHT_COLOR: 0xffffff,
            RIM_LIGHT_COLOR: 0x818cf8,
            FILL_LIGHT_COLOR: 0x63a188,
            AMBIENT_LIGHT_INTENSITY: 1,
            KEY_LIGHT_INTENSITY: 3,
            FILL_LIGHT_INTENSITY: 2,
            RIM_LIGHT_INTENSITY: 0.6
        },
        "items": [{"type":"StraightTrack","location":[-4,0,1]},{"type":"ForkTrack","location":[-3,0,1]},{"type":"StraightTrack","location":[-3,-1,0]},{"type":"StraightTrack","location":[-3,1,0]},{"type":"StraightTrack","location":[-3,-2,0]},{"type":"StraightTrack","location":[-3,2,0]},{"type":"CurvedTrack","location":[-3,-3,2]},{"type":"StraightTrack","location":[-2,-3,1]},{"type":"StraightTrack","location":[-1,-3,1]},{"type":"ForkTrack","location":[0,-3,0]},{"type":"StraightTrack","location":[1,-3,1]},{"type":"StraightTrack","location":[2,-3,1]},{"type":"CurvedTrack","location":[3,-3,1]},{"type":"StraightTrack","location":[3,-2,0]},{"type":"StraightTrack","location":[3,-1,0]},{"type":"ForkTrack","location":[3,0,3]},{"type":"StraightTrack","location":[4,0,1]},{"type":"StraightTrack","location":[3,1,0]},{"type":"StraightTrack","location":[3,2,0]},{"type":"CurvedTrack","location":[3,3,0]},{"type":"CurvedTrack","location":[-3,3,3]},{"type":"StraightTrack","location":[-2,3,1]},{"type":"StraightTrack","location":[-1,3,1]},{"type":"StraightTrack","location":[1,3,1]},{"type":"StraightTrack","location":[2,3,1]},{"type":"ForkTrack","location":[0,3,0]},{"type":"StraightTrack","location":[0,0,0]},{"type":"StraightTrack","location":[0,1,0]},{"type":"StraightTrack","location":[0,2,0]},{"type":"StraightTrack","location":[0,-4,0]},{"type":"StraightTrack","location":[0,-5,0]}],
        "objects": [{"type":"SimpleTree","location":[1,-1,0]},{"type":"SimpleTree","location":[1,0,0]},{"type":"SimpleTree","location":[1,1,0]},{"type":"SimpleTree","location":[0,-1,0]},{"type":"SimpleTree","location":[-1,-1,0]},{"type":"SimpleTree","location":[-1,0,0]},{"type":"SimpleTree","location":[-1,1,0]}],
        "carts": [{"type":"Wagon","location":[0,0,true],"trackPos":{"pathIndex":0,"indexPosInChain":0,"forwardInTrack":true}},{"type":"Train","location":[-3,-2,true],"trackPos":{"pathIndex":0,"indexPosInChain":0,"forwardInTrack":true},"chain":[]},{"type":"PassengerWagon","location":[-3,1,true],"trackPos":{"pathIndex":0,"indexPosInChain":0,"forwardInTrack":true}},{"type":"PassengerWagon","location":[-2,3,true],"trackPos":{"pathIndex":0,"indexPosInChain":0,"forwardInTrack":true}}]
    },

    PICKUP: {
        NAME: 'PICKUP', // Индекс для локализации
        ENV: {
            MAX_VELOCITY: 1,
            BACKGROUND_COLOR: 0x33BBFF,
            GROUND_COLOR: 0x888888,
            KEY_LIGHT_COLOR: 0xffffff,
            RIM_LIGHT_COLOR: 0x818cf8,
            FILL_LIGHT_COLOR: 0x63a188,
            AMBIENT_LIGHT_INTENSITY: 1,
            KEY_LIGHT_INTENSITY: 3,
            FILL_LIGHT_INTENSITY: 2,
            RIM_LIGHT_INTENSITY: 0.6
        },
        "items":[{"type":"PointTrack","location":[-1,-5,0]},{"type":"FinishTrack","location":[-1,4,0]},{"type":"StraightTrack","location":[-1,-4,0]},{"type":"CurvedTrack","location":[-1,-2,1]},{"type":"CurvedTrack","location":[-2,-2,3]},{"type":"ForkTrack","location":[-2,-1,1]},{"type":"StraightTrack","location":[-3,-1,2]},{"type":"StraightTrack","location":[-4,-1,1]},{"type":"CurvedTrack","location":[-2,0,0]},{"type":"CurvedTrack","location":[-1,0,1]},{"type":"StraightTrack","location":[-1,1,1]},{"type":"StraightTrack","location":[-1,2,0]},{"type":"StraightTrack","location":[-1,3,0]},{"type":"ForkTrack","location":[-1,-3,3]},{"type":"StraightTrack","location":[0,-3,0]}],"objects":[],"carts":[{"type":"PassengerWagon","location":[-4,-1,true],"trackPos":{"pathIndex":0,"indexPosInChain":0,"forwardInTrack":true}},{"type":"Train","location":[-1,-5,true],"trackPos":{"pathIndex":0,"indexPosInChain":0,"forwardInTrack":true},"chain":[]}]
    },

    PATH: {
        NAME: 'path_level', // Индекс для локализации
        ENV: {
            BACKGROUND_COLOR: 0xBBBBFF,
            KEY_LIGHT_COLOR: 0xffffff,
            RIM_LIGHT_COLOR: 0x818cf8,
            FILL_LIGHT_COLOR: 0x63a188,
            AMBIENT_LIGHT_INTENSITY: 1,
            KEY_LIGHT_INTENSITY: 3,
            FILL_LIGHT_INTENSITY: 2,
            RIM_LIGHT_INTENSITY: 0.6
        },
        "items":[{"type":"StraightTrack","location":[0,-4,0]},{"type":"CurvedTrack","location":[0,-3,0]},{"type":"CurvedTrack","location":[-1,-3,3]},{"type":"CurvedTrack","location":[-1,-2,1]},{"type":"StraightTrack","location":[-2,-2,2]},{"type":"StraightTrack","location":[0,-2,0]},{"type":"CurvedTrack","location":[-2,-3,1]},{"type":"CurvedTrack","location":[-3,-2,2]},{"type":"CurvedTrack","location":[-3,-3,3]},{"type":"ForkTrack","location":[-3,-1,0]},{"type":"CurvedTrack","location":[-2,-1,2]},{"type":"StraightTrack","location":[-2,0,0]},{"type":"CurvedTrack","location":[-2,1,0]},{"type":"StraightTrack","location":[-1,1,1]},{"type":"CurvedTrack","location":[0,1,1]},{"type":"StraightTrack","location":[0,0,0]},{"type":"ForkTrack","location":[0,-1,2]},{"type":"StraightTrack","location":[1,-1,3]},{"type":"CurvedTrack","location":[-4,-1,2]},{"type":"StraightTrack","location":[-1,-4,1]},{"type":"StraightTrack","location":[1,-3,0]},{"type":"CurvedTrack","location":[3,-1,2]},{"type":"StraightTrack","location":[3,0,2]},{"type":"CurvedTrack","location":[3,1,1]},{"type":"CurvedTrack","location":[2,1,0]},{"type":"CurvedTrack","location":[2,0,2]},{"type":"CurvedTrack","location":[1,0,2]},{"type":"StraightTrack","location":[1,1,0]},{"type":"CurvedTrack","location":[1,2,0]},{"type":"StraightTrack","location":[0,2,1]},{"type":"CurvedTrack","location":[-1,2,3]},{"type":"CurvedTrack","location":[-1,3,1]},{"type":"CurvedTrack","location":[-2,3,0]},{"type":"CurvedTrack","location":[-2,2,2]},{"type":"StraightTrack","location":[-3,2,1]},{"type":"CurvedTrack","location":[-4,2,3]},{"type":"CurvedTrack","location":[-4,3,1]},{"type":"CurvedTrack","location":[-3,3,0]},{"type":"PointTrack","location":[0,-5,0]},{"type":"FinishTrack","location":[-3,4,0]},{"type":"ForkTrack","location":[2,-1,0]},{"type":"StraightTrack","location":[2,-2,3]},{"type":"StraightTrack","location":[2,-3,0]}],"objects":[{"type":"SimpleTree","location":[2,-5,0]},{"type":"SimpleTree","location":[3,-5,0]},{"type":"SimpleTree","location":[3,-4,0]},{"type":"SimpleTree","location":[-3,-5,0]},{"type":"SimpleTree","location":[-4,-5,0]},{"type":"SimpleTree","location":[-4,-4,0]},{"type":"SimpleTree","location":[-5,0,0]},{"type":"SimpleTree","location":[-5,-1,0]},{"type":"SimpleTree","location":[-5,1,0]},{"type":"SimpleTree","location":[4,3,0]},{"type":"SimpleTree","location":[4,4,0]},{"type":"SimpleTree","location":[3,4,0]},{"type":"SimpleTree","location":[1,4,0]}],"carts":[{"type":"PassengerWagon","location":[3,0,true],"trackPos":{"pathIndex":0,"indexPosInChain":0,"forwardInTrack":true}},{"type":"Train","location":[0,-5,true],"trackPos":{"pathIndex":0,"indexPosInChain":0,"forwardInTrack":true},"chain":[]}]
    },
}