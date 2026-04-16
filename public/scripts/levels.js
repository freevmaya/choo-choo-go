
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
            "GAME_MODE": "Play",
            "AMOUNT_TIME": 800,
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
            "task": ['pickup', 'unload'],
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
                    0,
                    -3,
                    1
                ]
            },
            {
                "type": "StraightTrack",
                "location": [
                    -3,
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
                "taskName": "unload"
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
    "TEST-7": {
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
            "GAME_MODE": "Play",
            "task": [
                "finish"
            ]
        },
        "items": [
            {
                "type": "PointTrack",
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
                    0,
                    0
                ]
            },
            {
                "type": "ForkRStTrack",
                "location": [
                    0,
                    -1,
                    0
                ]
            },
            {
                "type": "ForkLStTrack",
                "location": [
                    -1,
                    -1,
                    0
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
                    0,
                    0
                ]
            },
            {
                "type": "CrossTrack",
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
            },
            {
                "type": "EndTrack",
                "location": [
                    2,
                    1,
                    1
                ]
            },
            {
                "type": "CurvedTrack",
                "location": [
                    -1,
                    1,
                    3
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
                "type": "EndTrack",
                "location": [
                    0,
                    3,
                    0
                ]
            }
        ],
        "tracks": [],
        "objects": [],
        "carts": [
            {
                "type": "Train",
                "location": [
                    0,
                    -2,
                    false
                ],
                "chain": []
            }, {
                "type": "Train",
                "location": [
                    1,
                    1,
                    false
                ],
                "chain": []
            }
        ]
    }
}