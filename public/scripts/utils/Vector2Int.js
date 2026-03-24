class Vector2Int {
    // Конструктор
    constructor(x = 0, y = 0) {
        this.x = Math.floor(x);
        this.y = Math.floor(y);
    }

    // ========== Базовые операции ==========
    
    // Установка значений
    set(x, y) {
        this.x = Math.floor(x);
        this.y = Math.floor(y);
        return this;
    }

    // Клонирование
    clone() {
        return new Vector2Int(this.x, this.y);
    }

    // Копирование из другого вектора
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    // ========== Арифметические операции ==========
    
    // Сложение
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    addScalar(s) {
        this.x += Math.floor(s);
        this.y += Math.floor(s);
        return this;
    }

    // Вычитание
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    subScalar(s) {
        this.x -= Math.floor(s);
        this.y -= Math.floor(s);
        return this;
    }

    // Умножение
    multiply(v) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }

    multiplyScalar(s) {
        this.x *= Math.floor(s);
        this.y *= Math.floor(s);
        return this;
    }

    // Деление (целочисленное)
    divide(v) {
        if (v.x !== 0) this.x = Math.floor(this.x / v.x);
        if (v.y !== 0) this.y = Math.floor(this.y / v.y);
        return this;
    }

    divideScalar(s) {
        const divisor = Math.floor(s);
        if (divisor !== 0) {
            this.x = Math.floor(this.x / divisor);
            this.y = Math.floor(this.y / divisor);
        }
        return this;
    }

    // ========== Сравнения ==========
    
    equals(v) {
        return this.x === v.x && this.y === v.y;
    }

    // ========== Статические методы ==========
    
    static add(a, b) {
        return new Vector2Int(a.x + b.x, a.y + b.y);
    }

    static sub(a, b) {
        return new Vector2Int(a.x - b.x, a.y - b.y);
    }

    static multiply(a, b) {
        return new Vector2Int(a.x * b.x, a.y * b.y);
    }

    static divide(a, b) {
        return new Vector2Int(
            b.x !== 0 ? Math.floor(a.x / b.x) : 0,
            b.y !== 0 ? Math.floor(a.y / b.y) : 0
        );
    }

    static min(a, b) {
        return new Vector2Int(Math.min(a.x, b.x), Math.min(a.y, b.y));
    }

    static max(a, b) {
        return new Vector2Int(Math.max(a.x, b.x), Math.max(a.y, b.y));
    }

    // ========== Расстояния и длины ==========
    
    distanceTo(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    distanceToSquared(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return dx * dx + dy * dy;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }

    manhattanDistance(v) {
        return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
    }

    // ========== Округление (для совместимости) ==========
    
    round() {
        return this; // Уже целые числа
    }

    floor() {
        return this; // Уже целые числа
    }

    ceil() {
        return this; // Уже целые числа
    }

    // ========== Преобразования ==========
    
    toVector2() {
        return new THREE.Vector2(this.x, this.y);
    }

    toVector3(y = 0) {
        return new THREE.Vector3(this.x, y, this.y);
    }

    toArray() {
        return [this.x, this.y];
    }

    toJSON() {
        return { x: this.x, y: this.y };
    }

    toString() {
        return `Vector2Int(${this.x}, ${this.y})`;
    }

    // ========== Направления ==========
    
    static up() {
        return new Vector2Int(0, 1);
    }

    static down() {
        return new Vector2Int(0, -1);
    }

    static left() {
        return new Vector2Int(-1, 0);
    }

    static right() {
        return new Vector2Int(1, 0);
    }

    static one() {
        return new Vector2Int(1, 1);
    }

    static zero() {
        return new Vector2Int(0, 0);
    }

    // ========== Операции с сеткой ==========
    
    // Получение соседних клеток (4 направления)
    getNeighbors4() {
        return [
            this.clone().add(Vector2Int.up()),
            this.clone().add(Vector2Int.down()),
            this.clone().add(Vector2Int.left()),
            this.clone().add(Vector2Int.right())
        ];
    }

    // Получение соседних клеток (8 направлений, включая диагонали)
    getNeighbors8() {
        const neighbors = [];
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                neighbors.push(new Vector2Int(this.x + dx, this.y + dy));
            }
        }
        return neighbors;
    }

    // Проверка нахождения в пределах сетки
    isWithinBounds(minX, minY, maxX, maxY) {
        return this.x >= minX && this.x <= maxX && this.y >= minY && this.y <= maxY;
    }

    // ========== Манхэттенское расстояние ==========
    
    manhattanDistanceTo(v) {
        return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
    }

    // ========== Операторы (через методы) ==========
    
    // Инкремент/декремент
    increment() {
        this.x++;
        this.y++;
        return this;
    }

    decrement() {
        this.x--;
        this.y--;
        return this;
    }

    // Нормализация (для целых чисел - приведение к единичному вектору)
    normalize() {
        const len = this.length();
        if (len === 0) return this;
        this.x = Math.round(this.x / len);
        this.y = Math.round(this.y / len);
        return this;
    }

    // ========== Полезные методы ==========
    
    // Ограничение значений
    clamp(minX, minY, maxX, maxY) {
        this.x = Math.max(minX, Math.min(maxX, this.x));
        this.y = Math.max(minY, Math.min(maxY, this.y));
        return this;
    }

    // Абсолютные значения
    abs() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        return this;
    }

    // Скалярное произведение
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
}