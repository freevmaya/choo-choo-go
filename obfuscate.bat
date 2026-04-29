node obfuscate.js
xcopy ".\public\index.html" ".\prepare\mini\index.html" /Y
xcopy ".\public\index-vk.html" ".\prepare\mini\index-vk.html" /Y

xcopy ".\public\scripts\main.mini.js" ".\prepare\mini\scripts\main.mini.js" /Y
xcopy ".\public\scripts\core\VKStateManager.js" ".\prepare\mini\scripts\core\VKStateManager.js" /Y

xcopy ".\public\scripts\languages" ".\prepare\mini\scripts\languages" /Y

xcopy ".\public\images" ".\prepare\mini\images" /E /I /Y /H /R
xcopy ".\public\styles" ".\prepare\mini\styles" /E /I /Y /H /R
xcopy ".\public\sounds" ".\prepare\mini\sounds" /E /I /Y /H /R