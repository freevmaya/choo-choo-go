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
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: false,
    debugProtectionInterval: 0,  // Исправлено: число (0 = выключено, >0 = интервал в мс)
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: true,
    renameGlobals: false,
    selfDefending: true,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 10,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayEncoding: ['rc4'],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 2,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 4,
    stringArrayWrappersType: 'function',
    stringArrayThreshold: 0.75,
    transformObjectKeys: true,
    unicodeEscapeSequence: false,
    sourceMap: false,  // Отключаем source map для экономии места
    target: 'browser'  // Указываем цель
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
    const outputPath = 'public/scripts/main.mini.js';
    fs.writeFileSync(outputPath, obfuscatedCode.getObfuscatedCode());
    const stats = fs.statSync(outputPath);
    console.log(`\n✅ Готово! Результат сохранен в ${outputPath}`);
    console.log(`📦 Размер файла: ${(stats.size / 1024).toFixed(2)} KB`);
} catch (error) {
    console.error('❌ Ошибка при обфускации:', error.message);
    process.exit(1);
}