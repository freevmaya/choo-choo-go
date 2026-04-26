function When(conditionFn, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const check = setInterval(() => {
      if (conditionFn()) {
        clearInterval(check);
        resolve();
      } else if (Date.now() - startTime > timeout) {
        clearInterval(check);
        reject(new Error('Таймаут ожидания условия'));
      }
    }, 100);
  });
}

function strEnum(number, pattern, lang = 'ru', show_number = true) {
    const match = pattern.match(/^([^\[]+)\[([^\]]+)\]$/);
    if (!match) {
        return `${number} ${pattern}`;
    }
    
    const base = match[1];
    const forms = match[2].split(',');

    const leftpart = show_number ? `${number} `: '';
    
    if (lang === 'ru') {
        const num = Math.abs(Number(number));
        
        if ((num == 0) || (num % 10 === 1 && num % 100 !== 11)) {
            return `${leftpart}${base}${forms[0]}`;
        } else if (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)) {
            return `${leftpart}${base}${forms[1]}`;
        } else {
            return `${leftpart}${base}${forms[2]}`;
        }
    }
    else if (lang === 'en') {
        const num = Math.abs(Number(number));
        return num === 1 
            ? `${leftpart}${base}${forms[0]}` 
            : `${leftpart}${base}${forms[2] || forms[0] + 's'}`;
    }
    else {
        return `${leftpart}${base}`;
    }
}

function randomArray(length, density) {
  const result = new Array(length).fill(0);
  const onesCount = Math.floor(length * density);
  
  for (let i = 0; i < onesCount; i++) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * length);
    } while (result[randomIndex]);
    
    result[randomIndex] = true;
  }
  
  return result;
}

function enumerateTo(fromNum, toNum, totalTime, callback, finishCallBack = null) {
  let tik = 60;
  let tcount = Math.ceil(totalTime / tik);
  let i = 0;
  let timerId = setInterval(()=>{
    if (i > tcount) {
      clearInterval(timerId);
      callback(toNum);
      if (finishCallBack)
        finishCallBack();
    } else callback(fromNum + (toNum - fromNum) * i / tcount);
    i++;
  }, tik);
}

function sawToSine(x, t = 0.5) {
  // Нормализуем t от 0 до 1
  t = Math.max(0, Math.min(1, t));
  const saw = 2 * (x / (2 * Math.PI) - Math.floor(0.5 + x / (2 * Math.PI)));
  const sine = Math.sin(x);
  return (1 - t) * saw + t * sine;
}

function debounce(func, wait, start = null) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        clearTimeout(timeout);
        if (start) start();
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}

function getClassName(obj) { 
   var funcNameRegex = /function (.{1,})\(/;
   var results = (funcNameRegex).exec((obj).constructor.toString());
   return (results && results.length > 1) ? results[1] : "";
};


async function Ajax(params, after = null, userData = null) {

    var formData;
    if (getClassName(params) == 'FormData') 
        formData = params
    else {
        formData = new FormData();
        for (let key in params) {
            let data = params[key];
            formData.append(key, (typeof data == 'string') ? data : JSON.stringify(data));
        }

        if ((typeof jsdata !== 'undefined') && typeof(jsdata.ajaxRequestId) != 'undefined')
            formData.append('ajax-request-id', jsdata.ajaxRequestId);
    }

    let headers = {};
    let token = (typeof X_CSRF_Token === 'string') ? X_CSRF_Token : null;

    if (token) {
        headers['X-CSRF-Token'] = token;
        formData.append('token', token);
    }

    headers['X-Requested-With'] = 'XMLHttpRequest';

    const request = new Request(document.location.origin + "?page=ajax", {
        method: "POST",
        headers: headers,
        body: formData
    });

    let result = null;
    let serverTime = Date.now();
    try {

        const response = await fetch(request);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        if (response.headers.has('Server-Time'))
            serverTime = Date.parse(response.headers.get('Server-Time'));

        if (response.headers.has('X-CSRF-Token')) {
            X_CSRF_Token = response.headers.get('X-CSRF-Token');
        }

        result = await response.json();

        if (result.error && (result.message == 'The token has expired') && (token != X_CSRF_Token)) {
        }
    } catch (error) {
        tracer.error(error.message);
    }
    if (after != null) after(result, serverTime, userData);
    return result;
}

function onAllImagesLoaded(callback, includeCSS = true, includeImg = true) {
  const promises = [];
  
  // Ждем загрузки тегов <img>
  if (includeImg) {
    document.querySelectorAll('img').forEach(img => {
      if (!img.complete) {
        promises.push(new Promise(resolve => {
          img.onload = img.onerror = resolve;
        }));
      }
    });
  }
  
  // Ждем загрузки CSS фонов
  if (includeCSS) {
    const bgImages = new Set();
    
    document.querySelectorAll('*').forEach(el => {
      const style = window.getComputedStyle(el);
      const bgImage = style.backgroundImage;
      
      if (bgImage && bgImage !== 'none') {
        const matches = bgImage.match(/url\(["']?([^"')]+)["']?\)/g);
        if (matches) {
          matches.forEach(match => {
            const url = match.replace(/url\(["']?|["']?\)/g, '');
            if (!url.startsWith('data:')) {
              bgImages.add(url);
            }
          });
        }
      }
    });
    
    bgImages.forEach(url => {
      promises.push(new Promise(resolve => {
        const img = new Image();
        img.onload = img.onerror = resolve;
        img.src = url;
      }));
    });
  }
  
  Promise.all(promises).then(callback);
}

function btnOnClick(selector, onClick, wait = 3000) {
  const btn = $(selector);
  if (btn.length > 0) {
    btn.on('click', () => {
      btn[0].disabled = true;
      setTimeout(()=>{
        btn[0].disabled = false;
      }, wait);
      onClick();
    });
  }
}

function delayAnimation(ms, callback) {
  const start = performance.now();
  
  function check(time) {
    if (time - start >= ms) {
      callback();
    } else {
      requestAnimationFrame(check);
    }
  }
  
  requestAnimationFrame(check);
}

function getScriptParam(paramName) {
  const scripts = document.getElementsByTagName('script');
  const currentScript = document.currentScript || scripts[scripts.length - 1];
  
  if (currentScript && currentScript.src) {
    const url = new URL(currentScript.src, window.location.href);
    return url.searchParams.get(paramName);
  }
  return null;
}

function collectPaths(obj) {
  const paths = [];
  
  function recursiveCollect(current) {
    if (current && typeof current === 'object') {
      Object.entries(current).forEach(([key, value]) => {
        // Проверяем, оканчивается ли ключ на _PATH (регистронезависимо)
        if (key.toUpperCase().endsWith('_PATH') && typeof value === 'string') {
          paths.push(value);
        }
        // Рекурсивно обходим вложенные объекты
        if (value && typeof value === 'object') {
          recursiveCollect(value);
        }
      });
    }
  }
  
  recursiveCollect(obj);
  return paths;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function lerp(min, max, t) {
    // t - коэффициент от 0 до 1
    return min + (max - min) * clamp(t, 0, 1);
}

function isSubClass(Child, Parent) {
    // Проверяем, что оба - классы (не экземпляры)
    if (typeof Child !== 'function' || typeof Parent !== 'function') {
        return false;
    }
    
    // Проверяем цепочку прототипов
    return Child.prototype instanceof Parent || 
           Child === Parent;
}

function toThreeColor(color) {
    if (color instanceof THREE.Color) {
        return color.clone();
    }
    if (typeof color === 'number') {
        return new THREE.Color(color);
    }
    if (typeof color === 'string') {
        return new THREE.Color(color);
    }
    return new THREE.Color(0xffffff);
}

function rndColorBetween(color1, color2) {
    const start = toThreeColor(color1);
    const end = toThreeColor(color2);
    const t = Math.random();
    return start.clone().lerp(end, t);
}

function getRandomColorWithIntensity(saturation = 0.8, lightness = 0.5) {
    const hue = Math.random();
    return new THREE.Color().setHSL(hue, saturation, lightness);
}

THREE.Object3D.prototype.setWorldPosition = function(worldPosition) {
    if (!this.parent) {
        this.position.copy(worldPosition);
        return;
    }
    const parentMatrix = this.parent.matrixWorld;
    const inverseMatrix = new THREE.Matrix4().copy(parentMatrix).invert();
    const localPosition = worldPosition.clone().applyMatrix4(inverseMatrix);
    this.position.copy(localPosition);
    return this;
};

THREE.Object3D.prototype.worldToLocalDirection = function(globalDirection) {
    const parentQuaternion = this.parent ? this.parent.quaternion : new THREE.Quaternion();
    const inverseQuaternion = parentQuaternion.clone().conjugate();
    return globalDirection.clone().applyQuaternion(inverseQuaternion);
};

THREE.Object3D.prototype.worldDirection = function() {
    const direction = new THREE.Vector3();
    this.getWorldDirection(direction);
    return direction;
};

THREE.Object3D.prototype.contains = function(child) {
    if (this === child) return true;
    return this.children.some(c => c === child || c.contains(child));
};

class Bounds {
    constructor(x = 0, y = 0, w = 0, h = 0) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    // Создать Bounds из DOM элемента
    static fromElement(el) {
        const rect = el.getBoundingClientRect();
        return new Bounds(rect.left, rect.top, rect.width, rect.height);
    }

    // Проверка, содержит ли область точку
    containsPoint(px, py) {
        return px >= this.x && px <= this.x + this.w &&
               py >= this.y && py <= this.y + this.h;
    }

    // Расширить область на величину (равномерно со всех сторон)
    expand(amount) {
        this.x -= amount;
        this.y -= amount;
        this.w += amount * 2;
        this.h += amount * 2;
        return this;
    }

    // Клонирование
    clone() {
        return new Bounds(this.x, this.y, this.w, this.h);
    }

    // Геттеры для удобства
    get left()   { return this.x; }
    get top()    { return this.y; }
    get right()  { return this.x + this.w; }
    get bottom() { return this.y + this.h; }
}

function addIgnoreSign(a, b) {
  return (Math.abs(a) + b) * Math.sign(a);
}

function hasParam(paramName) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has(paramName);
}

function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    
    script.onload = () => {
        if (callback) callback();
    };
    
    script.onerror = () => {
        console.error(`Ошибка загрузки: ${src}`);
    };
    
    document.head.appendChild(script);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function sprintf(str, ...args) {
    return str.replace(/{(\d+)}/g, (match, index) => {
        return args[index] !== undefined ? args[index] : match;
    });
}

function createText(text, color = '#FFFFFF', font="Bold 60px Arial") {
  // Создаем canvas элемент
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 512;
  canvas.height = 512;

  // Рисуем текст на canvas
  context.font = font;
  context.fillStyle = color;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  // Создаем текстуру из canvas
  const texture = new THREE.CanvasTexture(canvas);

  // Создаем материал с текстурой
  const text_material = new THREE.MeshBasicMaterial({ 
      map: texture,
      side: THREE.DoubleSide,
      transparent: true
  });

  // Создаем плоскость и накладываем текст
  const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(3, 3),
      text_material
  );
  return plane;
}