// scripts/constants.js

// ========== КОНСТАНТЫ ==========
// Дерево
const TREE_COLOR = 0xA67C52;
const TREE_HEIGHT = 20;
const TEXTURE_SCALE_Y = 1.5;
const MAIN_RADIUS = 0.8;
const MAIN_DIAMETER = MAIN_RADIUS * 2;

// Параметры изгиба ствола
const TRUNK_CURVE_STRENGTH = 0.5; // Сила максимального изгиба ствола
const TRUNK_SEGMENTS = 12; // Количество сегментов на весь ствол (больше = более плавный изгиб)

// Ветки
const BRANCH_MIN_RADIUS = 0.1; // Минимальная толщина ветки у основания
const BRANCH_MAX_RADIUS = 0.3; // Максимальная толщина ветки у основания
const BRANCH_MIN_LENGTH = 2; // Минимальная длина ветки
const BRANCH_MAX_LENGTH = 3; // Максимальная длина ветки
const BRANCH_ANGLE_MIN = 0.2; // Минимальный угол наклона ветки (от горизонтали)
const BRANCH_ANGLE_MAX = 0.5; // Максимальный угол наклона ветки (от горизонтали)
const BRANCH_CURVE_STRENGTH = 0.5; // Сила изгиба ветки
const BRANCH_SEGMENTS = 5; // Количество сегментов для изогнутой ветки

// Параметры хвои (иголок)
const NEEDLE_COUNT_PER_BRANCH = 3; // Количество пучков хвои на ветку
const NEEDLE_TEXTURE_PATH = 'textures/needle.png'; // Путь к текстуре хвои с альфа-каналом
const NEEDLE_SIZE = 1.5; // Размер плоскости с хвоей
const NEEDLE_COLOR_VARIATION = 0.2; // Вариация цвета хвои (0-1)

// Выступы и площадки на дереве
const STICK_OUT = 0.1 * MAIN_DIAMETER;
const PLATFORM_RADIUS = 0.5;
const PLATFORM_HEIGHT = 0.2;
const CYLINDER_HALF_HEIGHT = TREE_HEIGHT / 2;
const PLATFORM_DENSITY = 0.6;
const PLATFORM_COUNT = Math.floor(TREE_HEIGHT * PLATFORM_DENSITY);
const PLATFORM_DISTANCE = 1.3;

// Базовая платформа
const BASE_PLATFORM_TOP_Y = -CYLINDER_HALF_HEIGHT;

// Управление мышью
const ROTATION_SPEED = 0.025;
const ROTATION_SMOOTH = 0.5;
const INERTIA = 0.6;

// Цвета
const BALL_COLOR = 0xff6b6b;
const AMBIENT_LIGHT_COLOR = 0x88FFFF;
const KEY_LIGHT_COLOR = 0xffffff;
const FILL_LIGHT_COLOR = 0x63a188;
const RIM_LIGHT_COLOR = 0x818cf8;
const WIREFRAME_COLOR = 0xC4956A;
const BACKGROUND_COLOR = 0xBBBBFF;

// Свет
const AMBIENT_LIGHT_INTENSITY = 1;
const KEY_LIGHT_INTENSITY = 3;
const FILL_LIGHT_INTENSITY = 2;
const RIM_LIGHT_INTENSITY = 0.6;
const RIM_LIGHT_DISTANCE = 12;

// Пути к текстурам
const BARK_TEXTURE_PATH = 'textures/bark.jpg';
const BARK_NORMAL_PATH = 'textures/bark-normal.jpg';
const PLATFORM_TEXTURE_PATH = 'textures/platform.jpg';
const KILLER_PLATFORM_TEXTURE_PATH = 'textures/killer_platform.jpg';
const BACKGROUND_IMAGE_PATH = 'images/bk1.jpg';
const GRASS_IMAGE_PATH = 'textures/grass-s.png';
const GROUND_IMAGE_PATH = 'textures/ground.jpg';

// Цвета для платформ
const PLATFORM_NORMAL_COLOR = 0xA67C52; // Используем существующий TREE_COLOR для обычных платформ
const PLATFORM_KILLER_COLOR = 0xFF3333; // Ярко-красный для платформ-убийц

const HUMAN_HEIGHT = 0.6;

// Звания пользователей - ИНДЕКСЫ для локализации
const USER_TITLES = {
    Novice: {
        step: 500
    },
    Warrior: {
        step: 800
    },
    Knight: {
        step: 1000
    },
    Lord: {
        step: 1200
    },
    Legend: {
        step: 1500
    },
}

const DEFAULT_LEVEL = {
    ENV: {
        BACKGROUND_COLOR: 0xBBBBFF,
        GROUND_COLOR: 0x884455,
        KEY_LIGHT_COLOR: 0xffffff,
        RIM_LIGHT_COLOR: 0x818cf8,
        FILL_LIGHT_COLOR: 0x63a188,
        AMBIENT_LIGHT_INTENSITY: 1,
        KEY_LIGHT_INTENSITY: 150,
        FILL_LIGHT_INTENSITY: 2,
        RIM_LIGHT_INTENSITY: 0.6,
        GAME_MODE: 'Play'
    },
    items: [],
    tracks: [],
    objects: []
};

const START_GAME = 'START';
const PI_HALF = Math.PI / 2;

// Камера
const CAMERA_FOLLOW_SPEED = 6;
const CAMERA_HEIGHT_OFFSET = 40;
const MAXSCREENSIZE = 1024;

const PRICES = {
    UNLOCK_LEVEL: 400
}

// Настройки игры
const GAME_SETTINGS = {
    TRAIN_FORCE: 3,               // Мощность паровозика 
    TRAIN_BRACK: 1,
    TRAIN_WEIGHT: 0.5,
    TRAIN_WHEEL_RADIUS : 0.18,
    TRAIN_LEIGHT: 1.5,
    MAX_VELOCITY: 1.5,
    MIN_VELOCITY: 0.5,

    WAGON_WEIGHT: 0.1,

    CELL_SIZE: 2.0,                 // Размер одной ячейки сетки в 3D пространстве
    CAMERA_FOLLOW_SPEED: 5.0,       // Скорость следования камеры
    MAX_UNDO_HISTORY: 10,           // Максимальная история для отмены действий
    ANIMATION_DURATION: 0.3,        // Длительность анимаций в секундах
    DEFAULT_WAGON_COUNT: 1,          // Количество вагонов по умолчанию

    SLEEPER_SIZE: 0.17,
    SLEEPER_HEIGHT: 0.06,
    SLEEPER_LENGTH: 1.2,
    SLEEPER_STEP: 0.4,

    MIN_TREE_HEIGHT: 3,
    MAX_TREE_HEIGHT: 5,

    RAIL_WIDTH: 0.08,
    RAIL_HEIGHT: 0.12,
    RAIL_SPACE: 0.7,

    BASE_PLATFORM_SIZE: 10,
    GROUND_DENSITY: 2,

    GROUND_COLOR: 0x336633,

    START_CELL: {x: 0, y: 0},
    CAMERA_FOCUS: [25, 15],

    DEFAULT_TASK_SCORE: 20,
    GAME_MODE: 'Play'
};