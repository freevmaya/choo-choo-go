@echo off
echo Running obfuscate.js...
node obfuscate.js

echo Updating version...
powershell -ExecutionPolicy Bypass -File "update-version.ps1"

echo Copying files...
xcopy ".\public\index-vk.html" ".\prepare\mini\index-vk.html" /Y
xcopy ".\public\scripts\main.mini.js" ".\prepare\mini\scripts\main.mini.js" /Y
xcopy ".\public\scripts\core\VKUser.js" ".\prepare\mini\scripts\core\VKUser.js" /Y
xcopy ".\public\scripts\core\VKStateManager.js" ".\prepare\mini\scripts\core\VKStateManager.js" /Y
xcopy ".\public\scripts\languages" ".\prepare\mini\scripts\languages" /Y

xcopy ".\public\images" ".\prepare\mini\images" /E /I /Y /H /R
xcopy ".\public\styles" ".\prepare\mini\styles" /E /I /Y /H /R
xcopy ".\public\sounds" ".\prepare\mini\sounds" /E /I /Y /H /R
xcopy ".\public\data" ".\prepare\mini\data" /E /I /Y /H /R

xcopy ".\public\index.html" ".\prepare\yandex\index.html" /Y
xcopy ".\public\scripts\main.mini.js" ".\prepare\yandex\scripts\main.mini.js" /Y
xcopy ".\public\scripts\core\YaUser.js" ".\prepare\yandex\scripts\core\YaUser.js" /Y
xcopy ".\public\scripts\languages" ".\prepare\yandex\scripts\languages" /Y

xcopy ".\public\images" ".\prepare\yandex\images" /E /I /Y /H /R
xcopy ".\public\styles" ".\prepare\yandex\styles" /E /I /Y /H /R
xcopy ".\public\sounds" ".\prepare\yandex\sounds" /E /I /Y /H /R
xcopy ".\public\data" ".\prepare\yandex\data" /E /I /Y /H /R

echo Done!
pause