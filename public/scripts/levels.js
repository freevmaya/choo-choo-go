
var GAME_PARAMS = {
    "START": {
        "ENV": {
            "BACKGROUND_COLOR": 12303359,
            "GROUND_COLOR": 8930389,
            "KEY_LIGHT_COLOR": 16777215,
            "RIM_LIGHT_COLOR": 8490232,
            "FILL_LIGHT_COLOR": 6529416,
            "AMBIENT_LIGHT_INTENSITY": 1,
            "KEY_LIGHT_INTENSITY": 150,
            "FILL_LIGHT_INTENSITY": 2,
            "RIM_LIGHT_INTENSITY": 0.6,
            "GAME_MODE": "PlayAndEdit",
            "DESCRIPTION": "start-description",
            "task": [
                "connect",
                "finish"
            ]
        },
        "items": [
            {
                "type": "ForkTrack",
                "location": [
                    0,
                    -1,
                    3
                ],
                "expect": "end-track:0:pushAnim",
                "user_action_event": ["user-set-current-path-1"],
                "fixed": true
            },
            {
                "type": "StraightTrack",
                "location": [
                    0,
                    -2,
                    0
                ],
                "fixed": true
            },
            {
                "type": "PointTrack",
                "location": [
                    0,
                    -3,
                    0
                ],
                "fixed": true
            },
            {
                "type": "StraightTrack",
                "location": [
                    1,
                    -1,
                    1
                ],
                "fixed": true
            },
            {
                "type": "EndTrack",
                "location": [
                    2,
                    -1,
                    1
                ],
                "taskName": "end-track",
                "fixed": true
            },
            {
                "type": "ForkTrack",
                "location": [
                    0,
                    0,
                    1
                ],
                "expect": "connect",
                "user_action_event": ["user-set-current-path-2"],
                "fixed": true
            },
            {
                "type": "StraightTrack",
                "location": [
                    -1,
                    0,
                    1
                ],
                "fixed": true
            },
            {
                "type": "EndTrack",
                "location": [
                    -2,
                    0,
                    3
                ],
                "fixed": true
            },
            {
                "type": "PointTrack",
                "location": [
                    0,
                    2,
                    0
                ],
                "title": "finish",
                "taskName": "finish",
                "fixed": true
            },
            {
                "type": "StraightTrack",
                "location": [
                    0,
                    1,
                    1
                ],
                "expect": ["user-set-current-path-2"],
                "user_action_event": ["user-turn-track"]
            }
        ],
        "objects": [
            {
                "type": "SimpleTree",
                "location": [
                    1,
                    -3,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    2,
                    -3,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    2,
                    -2,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    2,
                    1,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -2,
                    -2,
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
                    -2,
                    -3,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    0,
                    -4,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -1,
                    -5,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    0,
                    -5,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    2,
                    2,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    2,
                    3,
                    0
                ]
            }
        ],
        "carts": [
            {
                "type": "Train",
                "location": [
                    0,
                    -3,
                    true
                ],
                "expect": ["created-game-objects:0:rightMoveAnim",
                            "user-set-current-path-1:0:leftMoveAnim",
                            "user-turn-track:0:rightUpMoveAnim"]
            },
            {
                "type": "Wagon",
                "location": [
                    -2,
                    0,
                    true
                ],
                "trackPos": {
                    "pathIndex": 0,
                    "indexPosInChain": 0,
                    "forwardInTrack": true
                },
                "taskName": "connect"
            }
        ]
    },
    "LEVEL-2": {
        "ENV": {
            "BACKGROUND_COLOR": "#4444AA",
            "GROUND_COLOR": "#4444AA",
            "KEY_LIGHT_COLOR": 16777215,
            "RIM_LIGHT_COLOR": 8490232,
            "FILL_LIGHT_COLOR": 6529416,
            "AMBIENT_LIGHT_INTENSITY": 1,
            "KEY_LIGHT_INTENSITY": 150,
            "FILL_LIGHT_INTENSITY": 2,
            "RIM_LIGHT_INTENSITY": 0.6,
            "GAME_MODE": "Play",
            "DESCRIPTION": "level-2-description",
            "task": [
                "finish",
                "blue-placed"
            ]
        },
        "items": [
            {
                "type": "StraightTrack",
                "location": [
                    1,
                    0,
                    1
                ]
            },
            {
                "type": "PointTrack",
                "location": [
                    2,
                    0,
                    1
                ],
                "title": "finish",
                "taskName": "finish"
            },
            {
                "type": "EndTrack",
                "location": [
                    0,
                    -2,
                    2
                ],
                "color": 4886745,
                "taskName": "blue-placed",
                "cart_name": "blue"
            },
            {
                "type": "ForkTrack",
                "location": [
                    -1,
                    1,
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
                    0,
                    2,
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
                "type": "CurvedTrack",
                "location": [
                    -2,
                    1,
                    3
                ]
            },
            {
                "type": "EndTrack",
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
                "type": "CrossTrack",
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
                    -1,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -1,
                    0,
                    2
                ]
            }
        ],
        "tracks": [],
        "objects": [
            {
                "type": "DeciduousTree",
                "location": [
                    1,
                    -2,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    1,
                    -1,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    3,
                    -2,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    2,
                    2,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    1,
                    3,
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
                    0,
                    3,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    -2,
                    -2,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    -3,
                    -2,
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
            },
            {
                "type": "SimpleTree",
                "location": [
                    -4,
                    0,
                    0
                ]
            }
        ],
        "carts": [
            {
                "type": "Train",
                "location": [
                    -2,
                    -1,
                    false
                ]
            },
            {
                "type": "Wagon",
                "location": [
                    1,
                    0,
                    true
                ],
                "name": "blue",
                "expect": ["blue-placed:0:pushAnim:remove-chain"],
                "user_action_event": ["train-remove-chain"]
            }
        ]
    },
    "LEVEL-3": {
        "ENV": {
            "BACKGROUND_COLOR": "#334466",
            "GROUND_COLOR": "#334466",
            "KEY_LIGHT_COLOR": 16777215,
            "RIM_LIGHT_COLOR": 8490232,
            "FILL_LIGHT_COLOR": 6529416,
            "AMBIENT_LIGHT_INTENSITY": 1,
            "KEY_LIGHT_INTENSITY": 150,
            "FILL_LIGHT_INTENSITY": 2,
            "RIM_LIGHT_INTENSITY": 0.6,
            "DESCRIPTION": "level-3-description",
            "GAME_MODE": "GenCycle",
            "task": [
                "blue"
            ],
            "expect": [
                {
                    "event": "created-game-objects",
                    "element": "span[data-lang=\"shop\"]",
                    "animClass": "pushAnimUp"
                },
                {
                    "event": "add-purchased",
                    "element": "#inventory",
                    "animClass": "pushAnimUp"
                },
                {
                    "event": "created-library",
                    "element": ".library-block .container-items",
                    "animClass": "rightMoveAnim",
                    "delay": 500
                },
                {
                    "event": "show-shop",
                    "element": '.shop [data-type="ForkTrack"]',
                    "animClass": "pushAnim",
                    "delay": 1000
                },
                {
                    "event": "to-basket.ForkTrack",
                    "element": '#shop .btn.pay',
                    "animClass": "pushAnim",
                    "delay": 500
                },
                {
                    "event": "drop-elem.ForkTrack",
                    "animClass": "pushAnim",
                    "delay": 500
                }
            ]
        },
        "items": [
            {
                "type": "EndTrack",
                "location": [
                    0,
                    -2,
                    2
                ],
                "color": "#6AF",
                "cart_name": "blue",
                "taskName": "blue"
            },
            {
                "type": "EndTrack",
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
                    -1,
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
                    1,
                    0,
                    1
                ]
            },
            {
                "type": "EndTrack",
                "location": [
                    2,
                    0,
                    1
                ]
            }
        ],
        "objects": [
            {
                "type": "DeciduousTree",
                "location": [
                    2,
                    -4,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    3,
                    -3,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    3,
                    -2,
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
                    2,
                    3,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -2,
                    2,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -3,
                    2,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -3,
                    1,
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
                    -2,
                    -4,
                    0
                ]
            }
        ],
        "carts": [
            {
                "type": "Train",
                "location": [
                    0,
                    -1,
                    true
                ],
                "chain": []
            },
            {
                "type": "Wagon",
                "location": [
                    0,
                    2,
                    true
                ],
                "color": "#6AF",
                "name": "blue"
            }
        ]
    },
    "LEVEL-4": {
        "ENV": {
            "BACKGROUND_COLOR": "#666666",
            "GROUND_COLOR": "#666666",
            "KEY_LIGHT_COLOR": 16777215,
            "RIM_LIGHT_COLOR": 8490232,
            "FILL_LIGHT_COLOR": 6529416,
            "AMBIENT_LIGHT_INTENSITY": 1,
            "KEY_LIGHT_INTENSITY": 150,
            "FILL_LIGHT_INTENSITY": 2,
            "RIM_LIGHT_INTENSITY": 0.6,
            "DESCRIPTION": "red-green-level-description",
            "GAME_MODE": "GenCycle",
            "task": [
                "blue",
                "red"
            ],
            "expect": [
                {
                    'event': 'created-game-objects',
                    'element': 'span[data-lang="shop"]',
                    'animClass': 'pushAnimUp'
                },
                {
                    'event': 'add-purchased',
                    'element': '#inventory',
                    'animClass': 'pushAnimUp'
                },
                {
                    'event': 'created-library',
                    'element': '.library-block .container-items',
                    'animClass': 'rightMoveAnim',
                    'delay': 500
                }
            ]
        },
        "items": [
            {
                "type": "EndTrack",
                "location": [
                    1,
                    -3,
                    2
                ],
                "color": "#D33",
                "cart_name": "red",
                "taskName": "red"
            },
            {
                "type": "EndTrack",
                "location": [
                    -1,
                    -3,
                    2
                ],
                "color": "#33D",
                "cart_name": "blue",
                "taskName": "blue"
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
                "type": "EndTrack",
                "location": [
                    0,
                    2,
                    0
                ]
            },
            {
                "type": "EndTrack",
                "location": [
                    -2,
                    -1,
                    3
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
                "type": "ForkTrack",
                "location": [
                    -1,
                    -1,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    1,
                    -2,
                    0
                ]
            }
        ],
        "objects": [
            {
                "type": "SimpleTree",
                "location": [
                    1,
                    -5,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    0,
                    -5,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    -1,
                    -4,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    2,
                    1,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    2,
                    2,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    -2,
                    1,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    -2,
                    2,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    0,
                    4,
                    0
                ]
            }
        ],
        "carts": [
            {
                "type": "Train",
                "location": [
                    0,
                    2,
                    false
                ],
                "chain": []
            },
            {
                "type": "Wagon",
                "location": [
                    1,
                    -3,
                    true
                ],
                "color": "#33D",
                "name": "blue"
            },
            {
                "type": "Wagon",
                "location": [
                    -2,
                    -1,
                    true
                ],
                "color": "#D33",
                "name": "red"
            }
        ]
    },
    "LEVEL-5": {
        "ENV": {
            "BACKGROUND_COLOR": "#33AA33",
            "GROUND_COLOR": "#33AA33",
            "KEY_LIGHT_COLOR": 16777215,
            "RIM_LIGHT_COLOR": 8490232,
            "FILL_LIGHT_COLOR": 6529416,
            "AMBIENT_LIGHT_INTENSITY": 1,
            "KEY_LIGHT_INTENSITY": 150,
            "FILL_LIGHT_INTENSITY": 2,
            "RIM_LIGHT_INTENSITY": 0.6,
            "DESCRIPTION": "three-wagon-description",
            "GAME_MODE": "GenCycle",
            "task": [
                "black",
                "yellow",
                "green"
            ]
        },
        "items": [
            {
                "type": "CrossTrack",
                "location": [
                    -1,
                    0,
                    0
                ]
            },
            {
                "type": "EndTrack",
                "location": [
                    1,
                    0,
                    1
                ],
                "color": "yellow",
                "cart_name": "yellow",
                "taskName": "yellow"
            },
            {
                "type": "EndTrack",
                "location": [
                    1,
                    1,
                    1
                ],
                "color": "black",
                "cart_name": "black",
                "taskName": "black"
            },
            {
                "type": "EndTrack",
                "location": [
                    -1,
                    -3,
                    2
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
                    -1,
                    0
                ]
            },
            {
                "type": "ForkRStTrack",
                "location": [
                    -1,
                    1,
                    3
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -2,
                    0,
                    1
                ]
            },
            {
                "type": "EndTrack",
                "location": [
                    -4,
                    0,
                    3
                ]
            },
            {
                "type": "EndTrack",
                "location": [
                    -4,
                    1,
                    3
                ],
                "color": "green",
                "cart_name": "green",
                "taskName": "green"
            },
            {
                "type": "StraightTrack",
                "location": [
                    -2,
                    1,
                    1
                ]
            },
            {
                "type": "ForkRStTrack",
                "location": [
                    -3,
                    1,
                    3
                ]
            },
            {
                "type": "ForkLStTrack",
                "location": [
                    -3,
                    0,
                    3
                ]
            },
            {
                "type": "ForkRStTrack",
                "location": [
                    0,
                    0,
                    1
                ]
            },
            {
                "type": "ForkLStTrack",
                "location": [
                    0,
                    1,
                    1
                ]
            }
        ],
        "objects": [
            {
                "type": "DeciduousTree",
                "location": [
                    -2,
                    -4,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -3,
                    -4,
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
                    -4,
                    -2,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    0,
                    -4,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    1,
                    -4,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    2,
                    -3,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    2,
                    -2,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    2,
                    2,
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
                    1,
                    3,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    0,
                    3,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    -3,
                    3,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    -4,
                    3,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    -5,
                    3,
                    0
                ]
            }
        ],
        "carts": [
            {
                "type": "Wagon",
                "location": [
                    -1,
                    -3,
                    true
                ],
                "color": "black",
                "name": "black"
            },
            {
                "type": "Wagon",
                "location": [
                    -1,
                    -2,
                    false
                ],
                "color": "yellow",
                "name": "yellow"
            },
            {
                "type": "Wagon",
                "location": [
                    -4,
                    0,
                    false
                ],
                "color": "green",
                "name": "green"
            },
            {
                "type": "Train",
                "location": [
                    -4,
                    1,
                    true
                ],
                "chain": []
            }
        ]
    },
    "TEST": {
        "ENV": {
            "BACKGROUND_COLOR": 12303359,
            "GROUND_COLOR": 8930389,
            "KEY_LIGHT_COLOR": 16777215,
            "RIM_LIGHT_COLOR": 8490232,
            "FILL_LIGHT_COLOR": 6529416,
            "AMBIENT_LIGHT_INTENSITY": 1,
            "KEY_LIGHT_INTENSITY": 150,
            "FILL_LIGHT_INTENSITY": 2,
            "RIM_LIGHT_INTENSITY": 0.6,
            "DESCRIPTION": "lead-wagon-to-finish",
            "task": ["connect", "finish"]
        },
        "items": [
            {
                "type": "PointTrack",
                "location": [
                    1,
                    -3,
                    0
                ]
            },
            {
                "type": "PointTrack",
                "location": [
                    -4,
                    1,
                    0
                ],
                "title": "finish",
                "taskName": "finish"
            },
            {
                "type": "StraightTrack",
                "location": [
                    1,
                    -2,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    1,
                    -1,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    0,
                    -1,
                    1
                ]
            },
            {
                "type": "ForkTrack",
                "location": [
                    -1,
                    -1,
                    2
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
                "type": "ForkTrack",
                "location": [
                    -1,
                    1,
                    3
                ]
            },
            {
                "type": "EndTrack",
                "location": [
                    0,
                    1,
                    1
                ]
            },
            {
                "type": "ForkTrack",
                "location": [
                    -1,
                    2,
                    1
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -1,
                    3,
                    0
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
                "type": "EndTrack",
                "location": [
                    -3,
                    3,
                    3
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -2,
                    2,
                    3
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -2,
                    1,
                    0
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
                "type": "ForkTrack",
                "location": [
                    -2,
                    -1,
                    2
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
                "type": "EndTrack",
                "location": [
                    -4,
                    2,
                    0
                ]
            }
        ],
        "objects": [
            {
                "type": "DeciduousTree",
                "location": [
                    -1,
                    -3,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -2,
                    -3,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -3,
                    -3,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    2,
                    -1,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    3,
                    -3,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    2,
                    -2,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    2,
                    0,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    2,
                    1,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    2,
                    2,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    1,
                    3,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    2,
                    3,
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
            }
        ],
        "carts": [
            {
                "type": "Wagon",
                "location": [
                    -3,
                    3,
                    true
                ],
                "trackPos": {
                    "pathIndex": 0,
                    "indexPosInChain": 0,
                    "forwardInTrack": true
                },
                "taskName": "connect"
            },
            {
                "type": "Train",
                "location": [
                    1,
                    -3,
                    true
                ],
                "trackPos": {
                    "pathIndex": 0,
                    "indexPosInChain": 0,
                    "forwardInTrack": true
                },
                "chain": []
            }
        ]
    },
    "THREE_WAGONS": {
        "ENV": {
            "BACKGROUND_COLOR": "#4444AA",
            "GROUND_COLOR": 7819366,
            "KEY_LIGHT_COLOR": 16777215,
            "RIM_LIGHT_COLOR": 8490232,
            "FILL_LIGHT_COLOR": 6529416,
            "AMBIENT_LIGHT_INTENSITY": 0.8,
            "KEY_LIGHT_INTENSITY": 150,
            "FILL_LIGHT_INTENSITY": 2,
            "RIM_LIGHT_INTENSITY": 0.6,
            "GAME_MODE": "GenCycle",
            "AMOUNT_TIME": 200,
            "DESCRIPTION": "three-wagon-description",
            "task": [
                "green-placed",
                "blue-placed",
                "gray-placed"
            ]
        },
        "items": [
            {
                "type": "StraightTrack",
                "location": [
                    0,
                    -3,
                    0
                ]
            },
            {
                "type": "ForkTrack",
                "location": [
                    0,
                    -2,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    1,
                    -1,
                    0
                ]
            },
            {
                "type": "ForkTrack",
                "location": [
                    0,
                    0,
                    2
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    1,
                    0,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -1,
                    -1,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -1,
                    0,
                    3
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
                "type": "PointTrack",
                "location": [
                    0,
                    -4,
                    0
                ],
                "color": 34816,
                "title": "green",
                "taskName": "green-placed",
                "cart_name": "green"
            },
            {
                "type": "PointTrack",
                "location": [
                    0,
                    3,
                    0
                ],
                "color": 17544,
                "title": "blue",
                "taskName": "blue-placed",
                "cart_name": "blue"
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
                "type": "ForkTrack",
                "location": [
                    1,
                    -2,
                    2
                ]
            },
            {
                "type": "ForkTrack",
                "location": [
                    -1,
                    -2,
                    2
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    2,
                    -2,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    2,
                    -3,
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
                "type": "CurvedTrack",
                "location": [
                    -2,
                    -3,
                    2
                ]
            },
            {
                "type": "EndTrack",
                "location": [
                    1,
                    -3,
                    3
                ],
                "color": 4473924,
                "taskName": "gray-placed",
                "cart_name": "gray"
            },
            {
                "type": "EndTrack",
                "location": [
                    -1,
                    -3,
                    1
                ],
                "color": 4473924,
                "taskName": "gray-placed",
                "cart_name": "gray"
            }
        ],
        "tracks": [],
        "objects": [
            {
                "type": "DeciduousTree",
                "location": [
                    3,
                    -3,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    3,
                    -2,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    3,
                    -1,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    0,
                    -5,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    1,
                    -5,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    -1,
                    -5,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    -3,
                    -4,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    -4,
                    -3,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    3,
                    1,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    2,
                    2,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    2,
                    3,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -4,
                    0,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -4,
                    1,
                    0
                ]
            }
        ],
        "carts": [
            {
                "type": "Train",
                "location": [
                    0,
                    1,
                    true
                ],
                "trackPos": {
                    "pathIndex": 0,
                    "indexPosInChain": 0,
                    "forwardInTrack": false
                },
                "chain": []
            },
            {
                "type": "Wagon",
                "location": [
                    1,
                    -1,
                    true
                ],
                "trackPos": {
                    "pathIndex": 0,
                    "indexPosInChain": 0,
                    "forwardInTrack": true
                },
                "color": 34816,
                "name": "green",
                "expect": "green-placed:0:pushAnim",
                "user_action_event": ["train-remove-chain"]
            },
            {
                "type": "Wagon",
                "location": [
                    -1,
                    -1,
                    false
                ],
                "trackPos": {
                    "pathIndex": 0,
                    "indexPosInChain": 0,
                    "forwardInTrack": true
                },
                "color": 17544,
                "name": "blue"
            },
            {
                "type": "Wagon",
                "location": [
                    0,
                    2,
                    false
                ],
                "trackPos": {
                    "pathIndex": 0,
                    "indexPosInChain": 0,
                    "forwardInTrack": true
                },
                "color": 4473924,
                "name": "gray"
            }
        ]
    },
    "PICKUP-BASE": {
        "ENV": {
            "BACKGROUND_COLOR": 12303359,
            "KEY_LIGHT_COLOR": 16777215,
            "RIM_LIGHT_COLOR": 8490232,
            "FILL_LIGHT_COLOR": 6529416,
            "AMBIENT_LIGHT_INTENSITY": 1,
            "KEY_LIGHT_INTENSITY": 150,
            "FILL_LIGHT_INTENSITY": 2,
            "RIM_LIGHT_INTENSITY": 0.6,
            "task": [
                "pickup",
                "unload",
                "blue"
            ],
            "DESCRIPTION": "pickup-wagon-passangers"
        },
        "items": [
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
                    3,
                    0,
                    0
                ]
            },
            {
                "type": "EndTrack",
                "location": [
                    0,
                    0,
                    2
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -3,
                    0,
                    0
                ]
            },
            {
                "type": "ForkLStTrack",
                "location": [
                    0,
                    -3,
                    1
                ]
            },
            {
                "type": "EndTrack",
                "location": [
                    0,
                    -4,
                    2
                ],
                "color": "#33A",
                "cart_name": "blue",
                "taskName": "blue"
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
                "taskName": "pickup"
            },
            {
                "type": "RailwayPlatform",
                "location": [
                    -4,
                    2,
                    3
                ],
                "peopleCount": 0,
                "taskName": "unload",
                "score": 100
            }
        ],
        "carts": [
            {
                "type": "PassengerWagon",
                "location": [
                    0,
                    1,
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
                    -2,
                    3,
                    true
                ],
                "trackPos": {
                    "pathIndex": 0,
                    "indexPosInChain": 0,
                    "forwardInTrack": false
                },
                "chain": []
            },
            {
                "type": "Wagon",
                "location": [
                    -3,
                    -2,
                    true
                ],
                "color": "#33A",
                "name": "blue"
            }
        ]
    },
    "PATH": {
        "ENV": {
            "BACKGROUND_COLOR": 12303359,
            "KEY_LIGHT_COLOR": 16777215,
            "RIM_LIGHT_COLOR": 8490232,
            "FILL_LIGHT_COLOR": 6529416,
            "AMBIENT_LIGHT_INTENSITY": 1,
            "KEY_LIGHT_INTENSITY": 150,
            "FILL_LIGHT_INTENSITY": 2,
            "RIM_LIGHT_INTENSITY": 0.6,
            "GAME_MODE": "PlayAndEdit",
            "DESCRIPTION": "restore-path-and-pick-up-wagon",
            "task": ["connect", "finish"]
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
                "title": "start",
                "fixed": true
            },
            {
                "type": "PointTrack",
                "location": [
                    -3,
                    4,
                    0
                ],
                "title": "finish",
                "taskName": "finish",
                "fixed": true
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
                "type": "EndTrack",
                "location": [
                    2,
                    -3,
                    2
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
                "taskName": "connect"
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
                "chain": []
            }
        ]
    },
    "PICKUP-PASSENGERS": {
        "ENV": {
            "BACKGROUND_COLOR": 12303359,
            "GROUND_COLOR": 8930389,
            "KEY_LIGHT_COLOR": 16777215,
            "RIM_LIGHT_COLOR": 8490232,
            "FILL_LIGHT_COLOR": 6529416,
            "AMBIENT_LIGHT_INTENSITY": 1,
            "KEY_LIGHT_INTENSITY": 150,
            "FILL_LIGHT_INTENSITY": 2,
            "RIM_LIGHT_INTENSITY": 0.6,
            "GAME_MODE": "PlayAndEdit",
            "DESCRIPTION": "pickup-wagon-passangers",
            "task": ["pickup", "finish"]
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
            },
            {
                "type": "EndTrack",
                "location": [
                    -1,
                    4,
                    0
                ]
            },
            {
                "type": "EndTrack",
                "location": [
                    -4,
                    4,
                    0
                ]
            },
            {
                "type": "EndTrack",
                "location": [
                    2,
                    0,
                    0
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
                "peopleCount": 5,
                "taskName": "pickup"
            },
            {
                "type": "RailwayPlatform",
                "location": [
                    -5,
                    3,
                    3
                ],
                "peopleCount": 0,
                "taskName": "finish"
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
                "type": "PassengerWagon",
                "location": [
                    -1,
                    3,
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
                    -3,
                    -1,
                    true
                ],
                "trackPos": {
                    "pathIndex": 0,
                    "indexPosInChain": 0,
                    "forwardInTrack": true
                },
                "chain": []
            }
        ]
    },

    "DROP-GAME-1" :{
        "ENV": {
            "BACKGROUND_COLOR": "#4469AA",
            "TRAIN_FORCE": 1,
            "MAX_VELOCITY": 1,
            "GROUND_COLOR": "#4469AA",
            "KEY_LIGHT_COLOR": "#EEEEEE",
            "RIM_LIGHT_COLOR": "#000000",
            "FILL_LIGHT_COLOR": "#000000",
            "AMBIENT_LIGHT_INTENSITY": 1,
            "KEY_LIGHT_INTENSITY": 150,
            "FILL_LIGHT_INTENSITY": 2,
            "RIM_LIGHT_INTENSITY": 0.6,
            "DESCRIPTION": "drop-game-description",
            "GAME_MODE": "DropGame",
            "task": ["finish"]
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
                ],
                "fixed": true
            },
            {
                "type": "PointTrack",
                "location": [
                    -3,
                    4,
                    0
                ],
                "title": "finish",
                "taskName": "finish",
                "fixed": true
            },
            {
                "type": "StraightTrack",
                "location": [
                    -3,
                    3,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    2,
                    -3,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    1,
                    -3,
                    2
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    1,
                    -2,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    1,
                    0,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    1,
                    -1,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    0,
                    0,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -1,
                    0,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -2,
                    0,
                    1
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -3,
                    0,
                    2
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
                    2,
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
                "color": "#333333",
                "wait": true,
                "noStop": true,
                "noDrag": true,
                "chain": []
            }
        ]
    },
    "DROP-AND-WAGON": {
        "ENV": {
            "GROUND_COLOR": '#EEAA00',
            "KEY_LIGHT_COLOR": 16777215,
            "RIM_LIGHT_COLOR": 8490232,
            "FILL_LIGHT_COLOR": 6529416,
            "AMBIENT_LIGHT_INTENSITY": 1,
            "KEY_LIGHT_INTENSITY": 150,
            "FILL_LIGHT_INTENSITY": 2,
            "RIM_LIGHT_INTENSITY": 0.6,
            "GAME_MODE": "DropGame",
            "DESCRIPTION": "drop-game-description",
            "task": ["wagon", "finish"]
        },
        "items": [
            {
                "type": "PointTrack",
                "location": [
                    2,
                    -5,
                    0
                ],
                "fixed": true
            },
            {
                "type": "PointTrack",
                "location": [
                    -4,
                    4,
                    0
                ],
                "title": "finish",
                "taskName": "finish",
                "fixed": true
            },
            {
                "type": "StraightTrack",
                "location": [
                    2,
                    -4,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    2,
                    -3,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    2,
                    -2,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    1,
                    -2,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    0,
                    -2,
                    1
                ]
            },
            {
                "type": "ForkTrack",
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
                "type": "EndTrack",
                "location": [
                    -1,
                    -5,
                    2
                ],
                "fixed": true
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -2,
                    -2,
                    2
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -2,
                    -1,
                    0
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
                "type": "StraightTrack",
                "location": [
                    -2,
                    1,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -2,
                    2,
                    0
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -3,
                    2,
                    2
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
                "type": "CurvedTrack",
                "location": [
                    -4,
                    3,
                    2
                ]
            }
        ],
        "tracks": [],
        "objects": [
            {
                "type": "DeciduousTree",
                "location": [
                    -4,
                    2,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -4,
                    1,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -4,
                    0,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -4,
                    -1,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    0,
                    -3,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    0,
                    -5,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    0,
                    -4,
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
                    3,
                    1,
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
                    2,
                    1,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -1,
                    0,
                    0
                ]
            }
        ],
        "carts": [
            {
                "type": "Wagon",
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
                "taskName": "wagon"
            },
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
                "color": "#333333",
                "noStop": true,
                "noDrag": true,
                "chain": []
            }
        ]
    },
    "SORTING": {
        "ENV": {
            "BACKGROUND_COLOR": "#4444AA",
            "GROUND_COLOR": 8930389,
            "KEY_LIGHT_COLOR": 16777215,
            "RIM_LIGHT_COLOR": 8490232,
            "FILL_LIGHT_COLOR": 6529416,
            "AMBIENT_LIGHT_INTENSITY": 1,
            "KEY_LIGHT_INTENSITY": 150,
            "FILL_LIGHT_INTENSITY": 2,
            "RIM_LIGHT_INTENSITY": 0.6,
            "GAME_MODE": "GenCycle"
        },
        "items": [
            {
                "type": "EndTrack",
                "location": [
                    -4,
                    1,
                    3
                ],
                "period": 30,
                "spawner": "blue",
                "color": "magenta",
                "cart_name": "magenta"
            },
            {
                "type": "EndTrack",
                "location": [
                    -4,
                    -1,
                    3
                ],
                "period": 30,
                "spawner": "magenta",
                "color": "blue",
                "cart_name": "blue"
            },
            {
                "type": "EndTrack",
                "location": [
                    0,
                    4,
                    0
                ],
                "period": 30,
                "spawner": "green"
            },
            {
                "type": "EndTrack",
                "location": [
                    0,
                    -4,
                    2
                ],
                "period": 30,
                "spawner": "red"
            },
            {
                "type": "StraightTrack",
                "location": [
                    2,
                    -1,
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
                "type": "EndTrack",
                "location": [
                    3,
                    -1,
                    1
                ],
                "cart_name": "green",
                "color": "green"
            },
            {
                "type": "EndTrack",
                "location": [
                    3,
                    1,
                    1
                ],
                "period": 5,
                "cart_name": "red",
                "color": "red"
            },
            {
                "type": "StraightTrack",
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
                    -3,
                    0
                ]
            },
            {
                "type": "ForkTrack",
                "location": [
                    -2,
                    0,
                    3
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -1,
                    0,
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
                "type": "StraightTrack",
                "location": [
                    -3,
                    1,
                    1
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -2,
                    -1,
                    1
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
                "type": "ForkTrack",
                "location": [
                    0,
                    0,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    1,
                    -1,
                    1
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
                "type": "StraightTrack",
                "location": [
                    0,
                    2,
                    0
                ]
            },
            {
                "type": "ForkRStTrack",
                "location": [
                    0,
                    -1,
                    2
                ]
            },
            {
                "type": "ForkLStTrack",
                "location": [
                    0,
                    1,
                    0
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    1,
                    1,
                    1
                ]
            }
        ],
        "tracks": [],
        "objects": [
            {
                "type": "SimpleTree",
                "location": [
                    -2,
                    -4,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    -3,
                    -4,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    -2,
                    -3,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    2,
                    -4,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    2,
                    -3,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    3,
                    -3,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -2,
                    4,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -2,
                    3,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    3,
                    4,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    2,
                    4,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    3,
                    3,
                    0
                ]
            }
        ],
        "carts": [
            {
                "type": "Train",
                "location": [
                    -1,
                    0,
                    false
                ],
                "trackPos": {
                    "pathIndex": 0,
                    "indexPosInChain": -0.21977322444642639,
                    "forwardInTrack": false
                },
                "chain": []
            },
            {
                "type": "Wagon",
                "location": [
                    0,
                    -4,
                    true
                ],
                "trackPos": {
                    "pathIndex": 0,
                    "indexPosInChain": 0,
                    "forwardInTrack": true
                },
                "color": "red",
                "name": "red"
            },
            {
                "type": "Wagon",
                "location": [
                    0,
                    4,
                    true
                ],
                "trackPos": {
                    "pathIndex": 0,
                    "indexPosInChain": 0,
                    "forwardInTrack": true
                },
                "color": "green",
                "name": "green"
            },
            {
                "type": "Wagon",
                "location": [
                    -4,
                    -1,
                    true
                ],
                "color": "magenta",
                "name": "magenta"
            },
            {
                "type": "Wagon",
                "location": [
                    -4,
                    1,
                    true
                ],
                "color": "blue",
                "name": "blue"
            }
        ]
    },
    "MIN_GEN": {
        "ENV": {
            "BACKGROUND_COLOR": 12303359,
            "GROUND_COLOR": 8930389,
            "KEY_LIGHT_COLOR": 16777215,
            "RIM_LIGHT_COLOR": 8490232,
            "FILL_LIGHT_COLOR": 6529416,
            "AMBIENT_LIGHT_INTENSITY": 1,
            "KEY_LIGHT_INTENSITY": 150,
            "FILL_LIGHT_INTENSITY": 2,
            "RIM_LIGHT_INTENSITY": 0.6,
            "GAME_MODE": "GenCycle"
        },
        "items": [
            {
                "type": "EndTrack",
                "location": [
                    0,
                    -2,
                    2
                ],
                "spawner": "wagon"
            },
            {
                "type": "ForkTrack",
                "location": [
                    0,
                    -1,
                    3
                ]
            },
            {
                "type": "EndTrack",
                "location": [
                    0,
                    0,
                    0
                ],
                "cart_name": "wagon"
            },
            {
                "type": "StraightTrack",
                "location": [
                    1,
                    -1,
                    1
                ]
            },
            {
                "type": "EndTrack",
                "location": [
                    2,
                    -1,
                    1
                ]
            }
        ],
        "tracks": [],
        "objects": [],
        "carts": [
            {
                "type": "Wagon",
                "location": [
                    0,
                    -2,
                    true
                ],
                "trackPos": {
                    "pathIndex": 0,
                    "indexPosInChain": 0,
                    "forwardInTrack": true
                },
                "name": "wagon"
            },
            {
                "type": "Train",
                "location": [
                    2,
                    -1,
                    true
                ],
                "trackPos": {
                    "pathIndex": 0,
                    "indexPosInChain": 0,
                    "forwardInTrack": true
                },
                "chain": []
            }
        ]
    },
    "CONSTUCTOR": {
        "ENV": {
            "BACKGROUND_COLOR": '#336622',
            "GROUND_COLOR": '#336622',
            "KEY_LIGHT_COLOR": 16777215,
            "RIM_LIGHT_COLOR": 8490232,
            "FILL_LIGHT_COLOR": 6529416,
            "AMBIENT_LIGHT_INTENSITY": 1,
            "KEY_LIGHT_INTENSITY": 150,
            "FILL_LIGHT_INTENSITY": 2,
            "RIM_LIGHT_INTENSITY": 0.6,
            "AMOUNT_TIME": 260,
            "DESCRIPTION": "repare-way-and-place-wagons",
            "GAME_MODE": "GenCycle",
            "task": ["green", "red"]
        },
        "items": [
            {
                "type": "CrossTrack",
                "location": [
                    0,
                    0,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -2,
                    0,
                    1
                ]
            },
            {
                "type": "EndTrack",
                "location": [
                    2,
                    0,
                    1
                ],
                "period": 15
            },
            {
                "type": "EndTrack",
                "location": [
                    0,
                    -3,
                    2
                ],
                "period": 15
            },
            {
                "type": "EndTrack",
                "location": [
                    0,
                    3,
                    0
                ],
                "color": "#228800",
                "cart_name": "green",
                "taskName": "green"
            },
            {
                "type": "EndTrack",
                "location": [
                    -3,
                    0,
                    3
                ],
                "color": "#880022",
                "cart_name": "red",
                "taskName": "red"
            }
        ],
        "objects": [
            {
                "type": "SimpleTree",
                "location": [
                    2,
                    -3,
                    0
                ]
            },
            {
                "type": "SimpleTree",
                "location": [
                    2,
                    -2,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    2,
                    2,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    2,
                    3,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -3,
                    4,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -4,
                    4,
                    0
                ]
            },
            {
                "type": "DeciduousTree",
                "location": [
                    -2,
                    -2,
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
            }
        ],
        "carts": [
            {
                "type": "Train",
                "location": [
                    -3,
                    0,
                    true
                ],
                "trackPos": {
                    "pathIndex": 0,
                    "indexPosInChain": 0,
                    "forwardInTrack": false
                },
                "chain": []
            }, {
                "location": [
                    0,
                    -3,
                    true
                ],
                "type": "Wagon",
                "color": "#228800",
                "name": "green"
            },
            {
                "location": [
                    0,
                    3,
                    true
                ],
                "type": "Wagon",
                "color": "#880022",
                "name": "red"
            }
        ]
    }
}