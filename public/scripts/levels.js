
// РџР°СЂР°РјРµС‚СЂС‹ РёРіСЂС‹ - РРќР”Р•РљРЎР« РґР»СЏ Р»РѕРєР°Р»РёР·Р°С†РёРё РЅР°Р·РІР°РЅРёР№ СѓСЂРѕРІРЅРµР№
var GAME_PARAMS = {
    "TEST": {
        "NAME": "difficulty_test",
        "ENV": {
            "BACKGROUND_COLOR": 12303359,
            "GROUND_COLOR": 8930389,
            "KEY_LIGHT_COLOR": 16777215,
            "RIM_LIGHT_COLOR": 8490232,
            "FILL_LIGHT_COLOR": 6529416,
            "AMBIENT_LIGHT_INTENSITY": 1,
            "KEY_LIGHT_INTENSITY": 3,
            "FILL_LIGHT_INTENSITY": 2,
            "RIM_LIGHT_INTENSITY": 0.6
        },
        "items": [
            {
                "type": "StraightTrack",
                "location": [
                    -3,
                    1,
                    0
                ]
            },
            {
                "type": "ForkTrack",
                "location": [
                    -3,
                    2,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -2,
                    2,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -2,
                    3,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -2,
                    4,
                    3
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -1,
                    4,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    0,
                    4,
                    1
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    1,
                    4,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    1,
                    3,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    1,
                    2,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -4,
                    2,
                    1
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -5,
                    2,
                    3
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -5,
                    1,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -5,
                    0,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -5,
                    -1,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -5,
                    -2,
                    2
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -4,
                    -2,
                    1
                ]
            },
            {
                "type": "PointTrack",
                "location": [
                    -3,
                    0,
                    0
                ],
                title: 'start'
            },
            {
                "type": "PointTrack",
                "location": [
                    1,
                    1,
                    0
                ],
                title: 'finish',
                taskName: 'finish'
            }
        ],
        "objects": [
            {
                "type": "SimpleTree",
                "location": [
                    0,
                    2,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    2,
                    0,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    -3,
                    -1,
                    0
                ]
            }
        ],
        "carts": [
            {
                "type": "Train",
                "location": [
                    -3,
                    1,
                    true
                ],
                "trackPos": {
                    "pathIndex": 0,
                    "indexPosInChain": 0,
                    "forwardInTrack": true
                },
                "chain": [],
                task: ['connect1', 'connect2', 'finish']
            },
            {
                "type": "Wagon",
                "location": [
                    -2,
                    3,
                    true
                ],
                "trackPos": {
                    "pathIndex": 0,
                    "indexPosInChain": 0,
                    "forwardInTrack": true
                },
                taskName: 'connect2'
            },
            {
                "type": "Wagon",
                "location": [
                    -5,
                    0,
                    true
                ],
                "trackPos": {
                    "pathIndex": 0,
                    "indexPosInChain": 0,
                    "forwardInTrack": true
                },
                taskName: 'connect1'
            }
        ]
    },
    "SIMPLE": {
        "NAME": "simple_level",
        "ENV": {
            "BACKGROUND_COLOR": 12303359,
            "KEY_LIGHT_COLOR": 16777215,
            "RIM_LIGHT_COLOR": 8490232,
            "FILL_LIGHT_COLOR": 6529416,
            "AMBIENT_LIGHT_INTENSITY": 1,
            "KEY_LIGHT_INTENSITY": 3,
            "FILL_LIGHT_INTENSITY": 2,
            "RIM_LIGHT_INTENSITY": 0.6
        },
        "items": [
            {
                "type": "StraightTrack",
                "location": [
                    -4,
                    0,
                    1
                ]
            },
            {
                "type": "ForkTrack",
                "location": [
                    -3,
                    0,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -3,
                    -1,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -3,
                    1,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -3,
                    -2,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -3,
                    2,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -3,
                    -3,
                    2
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -2,
                    -3,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -1,
                    -3,
                    1
                ]
            },
            {
                "type": "ForkTrack",
                "location": [
                    0,
                    -3,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    1,
                    -3,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    2,
                    -3,
                    1
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    3,
                    -3,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    3,
                    -2,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    3,
                    -1,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    3,
                    1,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    3,
                    2,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    3,
                    3,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -3,
                    3,
                    3
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -2,
                    3,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -1,
                    3,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    1,
                    3,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    2,
                    3,
                    1
                ]
            },
            {
                "type": "ForkTrack",
                "location": [
                    0,
                    3,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    0,
                    0,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    0,
                    1,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    0,
                    2,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    0,
                    -4,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    0,
                    -5,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    3,
                    0,
                    0
                ]
            }
        ],
        "objects": [
            {
                "type": "SimpleTree",
                "location": [
                    1,
                    -1,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    1,
                    0,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    1,
                    1,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    0,
                    -1,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    -1,
                    -1,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    -1,
                    0,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    -1,
                    1,
                    0
                ]
            },
            {
                "type": "RailwayPlatform",
                "location": [
                    4,
                    -2,
                    1
                ],
                "peopleCount": 5,
                taskName: 'pickup'
            },
            {
                "type": "RailwayPlatform",
                "location": [
                    -4,
                    2,
                    3
                ],
                "peopleCount": 0,
                taskName: 'unload'
            }
        ],
        "carts": [
            {
                "type": "Train",
                "location": [
                    -3,
                    -2,
                    true
                ],
                "trackPos": {
                    "pathIndex": 0,
                    "indexPosInChain": 0,
                    "forwardInTrack": true
                },
                "chain": [],
                task: ['pickup', 'unload']
            },
            {
                "type": "PassengerWagon",
                "location": [
                    0,
                    0,
                    true
                ],
                "trackPos": {
                    "pathIndex": 0,
                    "indexPosInChain": 0,
                    "forwardInTrack": true
                }
            }
        ]
    },
    "PICKUP": {
        "NAME": "PICKUP",
        "ENV": {
            "MAX_VELOCITY": 1,
            "BACKGROUND_COLOR": 3390463,
            "GROUND_COLOR": 8947848,
            "KEY_LIGHT_COLOR": 16777215,
            "RIM_LIGHT_COLOR": 8490232,
            "FILL_LIGHT_COLOR": 6529416,
            "AMBIENT_LIGHT_INTENSITY": 1,
            "KEY_LIGHT_INTENSITY": 3,
            "FILL_LIGHT_INTENSITY": 2,
            "RIM_LIGHT_INTENSITY": 0.6,
            "GAME_MODE": 'playAndEdit'
        },
        "items": [
            {
                "type": "PointTrack",
                "location": [
                    -1,
                    -5,
                    0
                ],
                title: 'start'
            },
            {
                "type": "PointTrack",
                "location": [
                    -1,
                    4,
                    0
                ],
                title: 'finish',
                taskName: 'finish'
            },
            {
                "type": "StraightTrack",
                "location": [
                    -1,
                    -4,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -1,
                    -2,
                    1
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -2,
                    -2,
                    3
                ]
            },
            {
                "type": "ForkTrack",
                "location": [
                    -2,
                    -1,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -3,
                    -1,
                    2
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -4,
                    -1,
                    1
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -2,
                    0,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -1,
                    0,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -1,
                    1,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -1,
                    2,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -1,
                    3,
                    0
                ]
            },
            {
                "type": "ForkTrack",
                "location": [
                    -1,
                    -3,
                    3
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    0,
                    -3,
                    0
                ]
            }
        ],
        "objects": [],
        "carts": [
            {
                "type": "PassengerWagon",
                "location": [
                    -4,
                    -1,
                    true
                ],
                "trackPos": {
                    "pathIndex": 0,
                    "indexPosInChain": 0,
                    "forwardInTrack": true
                }
            },
            {
                "type": "Train",
                "location": [
                    -1,
                    -5,
                    true
                ],
                "trackPos": {
                    "pathIndex": 0,
                    "indexPosInChain": 0,
                    "forwardInTrack": true
                },
                "chain": [],
                "task": ['finish']
            }
        ]
    },
    "PATH": {
        "NAME": "path_level",
        "ENV": {
            "BACKGROUND_COLOR": 12303359,
            "KEY_LIGHT_COLOR": 16777215,
            "RIM_LIGHT_COLOR": 8490232,
            "FILL_LIGHT_COLOR": 6529416,
            "AMBIENT_LIGHT_INTENSITY": 1,
            "KEY_LIGHT_INTENSITY": 3,
            "FILL_LIGHT_INTENSITY": 2,
            "RIM_LIGHT_INTENSITY": 0.6
        },
        "items": [
            {
                "type": "StraightTrack",
                "location": [
                    0,
                    -4,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    0,
                    -3,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -1,
                    -3,
                    3
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -1,
                    -2,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -2,
                    -2,
                    2
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    0,
                    -2,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -2,
                    -3,
                    1
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -3,
                    -2,
                    2
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -3,
                    -3,
                    3
                ]
            },
            {
                "type": "ForkTrack",
                "location": [
                    -3,
                    -1,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -2,
                    -1,
                    2
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -2,
                    0,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -2,
                    1,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -1,
                    1,
                    1
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    0,
                    1,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    0,
                    0,
                    0
                ]
            },
            {
                "type": "ForkTrack",
                "location": [
                    0,
                    -1,
                    2
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    1,
                    -1,
                    3
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -4,
                    -1,
                    2
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -1,
                    -4,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    1,
                    -3,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    3,
                    -1,
                    2
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    3,
                    0,
                    2
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    3,
                    1,
                    1
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    2,
                    1,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    2,
                    0,
                    2
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    1,
                    0,
                    2
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    1,
                    1,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    1,
                    2,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    0,
                    2,
                    1
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -1,
                    2,
                    3
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -1,
                    3,
                    1
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -2,
                    3,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -2,
                    2,
                    2
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -3,
                    2,
                    1
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -4,
                    2,
                    3
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -4,
                    3,
                    1
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -3,
                    3,
                    0
                ]
            },
            {
                "type": "PointTrack",
                "location": [
                    0,
                    -5,
                    0
                ],
                title: 'start'
            },
            {
                "type": "PointTrack",
                "location": [
                    -3,
                    4,
                    0
                ],
                title: 'finish',
                taskName: 'finish'
            },
            {
                "type": "ForkTrack",
                "location": [
                    2,
                    -1,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    2,
                    -2,
                    3
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    2,
                    -3,
                    0
                ]
            }
        ],
        "objects": [
            {
                "type": "SimpleTree",
                "location": [
                    2,
                    -5,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    3,
                    -5,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    3,
                    -4,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    -3,
                    -5,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    -4,
                    -5,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    -4,
                    -4,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    -5,
                    0,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    -5,
                    -1,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    -5,
                    1,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    4,
                    3,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    4,
                    4,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    3,
                    4,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    1,
                    4,
                    0
                ]
            }
        ],
        "carts": [
            {
                "type": "PassengerWagon",
                "location": [
                    3,
                    0,
                    true
                ],
                "trackPos": {
                    "pathIndex": 0,
                    "indexPosInChain": 0,
                    "forwardInTrack": true
                },
                taskName: 'connect'
            },
            {
                "type": "Train",
                "location": [
                    0,
                    -5,
                    true
                ],
                "trackPos": {
                    "pathIndex": 0,
                    "indexPosInChain": 0,
                    "forwardInTrack": true
                },
                "chain": [],
                task: ['connect', 'finish']
            }
        ]
    },
    "TEST-4": {
        "NAME": "TEST-4",
        "ENV": {
            "BACKGROUND_COLOR": 12303359,
            "GROUND_COLOR": 8930389,
            "KEY_LIGHT_COLOR": 16777215,
            "RIM_LIGHT_COLOR": 8490232,
            "FILL_LIGHT_COLOR": 6529416,
            "AMBIENT_LIGHT_INTENSITY": 1,
            "KEY_LIGHT_INTENSITY": 3,
            "FILL_LIGHT_INTENSITY": 2,
            "RIM_LIGHT_INTENSITY": 0.6
        },
        "items": [
            {
                "type": "StraightTrack",
                "location": [
                    3,
                    -4,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    3,
                    -3,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    3,
                    -2,
                    0
                ]
            },
            {
                "type": "ForkTrack",
                "location": [
                    3,
                    -1,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    4,
                    -1,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    4,
                    0,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    4,
                    1,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    2,
                    -1,
                    2
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    2,
                    0,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    3,
                    1,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    2,
                    1,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    1,
                    1,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    0,
                    1,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -1,
                    0,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -2,
                    -1,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -3,
                    -1,
                    1
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -4,
                    -1,
                    2
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -4,
                    0,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -4,
                    1,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -4,
                    2,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -4,
                    3,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -4,
                    4,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -1,
                    2,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -1,
                    3,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -1,
                    4,
                    0
                ]
            },
            {
                "type": "ForkTrack",
                "location": [
                    -1,
                    1,
                    3
                ]
            },
            {
                "type": "ForkTrack",
                "location": [
                    -1,
                    -1,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -1,
                    -2,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -1,
                    -3,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -1,
                    -4,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -1,
                    -5,
                    2
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    0,
                    -5,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    1,
                    -5,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    2,
                    -5,
                    1
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    3,
                    -5,
                    1
                ]
            }
        ],
        "tracks": [],
        "objects": [
            {
                "type": "RailwayPlatform",
                "location": [
                    4,
                    -3,
                    1
                ],
                "peopleCount": 5
            },
            {
                "type": "RailwayPlatform",
                "location": [
                    -5,
                    3,
                    3
                ],
                "peopleCount": 0
            },
            {
                "type": "DeciduousTree",
                "location": [
                    1,
                    -2,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    2,
                    3,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    3,
                    3,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    1,
                    4,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -5,
                    -1,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -3,
                    -2,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -4,
                    -3,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -5,
                    -3,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    0,
                    0,
                    0
                ]
            }
        ],
        "carts": [
            {
                "type": "Train",
                "location": [
                    2,
                    -5,
                    true
                ],
                "trackPos": {
                    "pathIndex": 0,
                    "indexPosInChain": 0,
                    "forwardInTrack": true
                },
                "chain": []
            },
            {
                "type": "PassengerWagon",
                "location": [
                    1,
                    -5,
                    true
                ],
                "trackPos": {
                    "pathIndex": 0,
                    "indexPosInChain": 0,
                    "forwardInTrack": true
                }
            }
        ]
    },

    "TEST-5" :{
        "NAME": "TEST-5",
        "UI": {
            "RailwaySpawner": {}
        },
        "ENV": {
            "BACKGROUND_COLOR": "#4469AA",
            "GROUND_COLOR": "#4469AA",
            "KEY_LIGHT_COLOR": "#EEEEEE",
            "RIM_LIGHT_COLOR": "#000000",
            "FILL_LIGHT_COLOR": "#000000",
            "AMBIENT_LIGHT_INTENSITY": 1,
            "KEY_LIGHT_INTENSITY": 3,
            "FILL_LIGHT_INTENSITY": 2,
            "RIM_LIGHT_INTENSITY": 0.6,
            "GAME_MODE": "dropGame"
        },
        "items": [
            {
                "type": "StraightTrack",
                "location": [
                    2,
                    -4,
                    0
                ]
            },
            {
                "type": "PointTrack",
                "location": [
                    2,
                    -5,
                    0
                ]
            },
            {
                "type": "FinishTrack",
                "location": [
                    -3,
                    4,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -3,
                    3,
                    0
                ]
            }
        ],
        "tracks": [],
        "objects": [
            {
                "type": "DeciduousTree",
                "location": [
                    -1,
                    -1,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -1,
                    1,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    3,
                    0,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    4,
                    1,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    3,
                    2,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    3,
                    1,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -4,
                    -2,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    4,
                    3,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -5,
                    -1,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -5,
                    -3,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -5,
                    -2,
                    0
                ]
            }
        ],
        "carts": []
    }
}