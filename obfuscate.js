// obfuscate-bundle.js
const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

// Список файлов для объединения (в нужном порядке)
const filesToBundle = [
    'utils/Utils',
    'utils/ClassRegistry',
    'utils/Vector2Int',
    'languages/Lang',
    'constants',
    'levels',
    'GameState',
    'core/PositionCart',
    'core/BaseGame',
    'core/Cells',
    'core/RendererManager',
    'core/LevelLoader',
    'core/state-manager',
    'models/BaseStateMashine',
    'models/BaseGameObject',
    'models/BaseCellObject',
    'models/BaseTrack',
    'models/BaseCurveTrack',
    'models/StraightTrack',
    'models/CurvedTrack',
    'models/ForkTrack',
    'models/PointTrack',
    'models/EndTrack',
    'models/Ground',
    'models/Queue',

    'models/BaseCart',
    'models/Train',
    'models/Wagon',
    'models/PassengerWagon',

    'models/ChristmasTree',
    'models/SimpleTree',
    'models/DeciduousTree',
    'models/Snow',
    'models/RailwayPlatform',
    'models/Human',

    'controls/RaycasterManager',
    'controls/BaseCameraController',
    'controls/CameraController',
    'controls/DropGameCamera',
    'controls/HandTouch',
    'utils/EventEmitter',
    'utils/TextureLoader',
    'utils/MathUtils',
    'utils/crypto-js.min',
    'effects/SparkEffect',
    'effects/ParticleSystem',
    'audio/SoundManager',
    'audio/GSoundManager',
    'UI/Swipeable',
    'UI/RailwaySpawner',
    'UI/Library',
    'UI/ToastMessage',
    'utils/DevTools',
    'modes/BaseModeModule',
    'modes/Play',
    'modes/Editor',
    'modes/Delete',
    'modes/PlayAndEdit',
    'modes/DropGame',
    'main'
];

// Функция объединения файлов
function bundleFiles(filePaths) {
    let combined = '';
    for (const filePath of filePaths) {
        let fullPath = `public/scripts/${filePath}.js`;
        if (fs.existsSync(fullPath)) {
            const content = fs.readFileSync(fullPath, 'utf8');
            combined += content;
            combined += '\n;\n'; // Разделитель между файлами
            console.log(`✓ Добавлен: ${filePath}.js`);
        } else {
            console.warn(`✗ Файл не найден: ${fullPath}`);
        }
    }
    return combined;
}

// Исправленные опции обфускации
const obfuscationOptions = {
    // --- Core Compression ---
    compact: true,              // Убирает все пробелы и переносы строк [citation:4][citation:10]
    simplify: true,            // Упрощает константные выражения [citation:1]

    // --- Renames (Minification) ---
    identifierNamesGenerator: 'mangled', // Генерирует самые короткие имена (a, b, c...) [citation:10]
    renameGlobals: false,      // НЕ трогаем глобальные переменные (риск сломать код) [citation:4]

    // --- Strings ---
    stringArray: false,        // ПОЛНОСТЬЮ отключаем, это уменьшает размер [citation:1]
    unicodeEscapeSequence: false, // Не кодируем в Unicode (сильно увеличивает размер) [citation:4]

    // --- Advanced Protection (DISABLED for size) ---
    controlFlowFlattening: false,   // Выключено — увеличивает код в 1.5-2 раза [citation:9]
    deadCodeInjection: false,       // Выключено — увеличивает код до 200% [citation:6]
    selfDefending: false,           // Выключено — добавляет ~1.5 КБ служебного кода [citation:1]
    debugProtection: false,         // Выключено
    transformObjectKeys: false,     // Выключено
    numbersToExpressions: false,    // Выключено (превращает 100 в (99+1) — увеличивает код)
    splitStrings: false             // Выключено
};

// Объединение файлов
console.log('=== Начало объединения файлов ===');
const combinedCode = bundleFiles(filesToBundle);
console.log(`Объединено ${combinedCode.length} символов`);

if (!combinedCode.trim()) {
    console.error('Ошибка: Нет данных для обфускации!');
    process.exit(1);
}

// Обфускация
console.log('\n=== Обфускация ===');
try {
    const obfuscatedCode = JavaScriptObfuscator.obfuscate(combinedCode, obfuscationOptions);
    
    // Сохранение результата
    const outputPath = 'prepare/mini/scripts/main.mini.js';
    fs.writeFileSync(outputPath, obfuscatedCode.getObfuscatedCode());
    const stats = fs.statSync(outputPath);
    console.log(`\n✅ Готово! Результат сохранен в ${outputPath}`);
    console.log(`📦 Размер файла: ${(stats.size / 1024).toFixed(2)} KB`);
} catch (error) {
    console.error('❌ Ошибка при обфускации:', error.message);
    process.exit(1);
}