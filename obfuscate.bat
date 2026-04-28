node obfuscate.js
xcopy ".\public\scripts\language\ru.js" ".\prepare\mini\scripts\language\ru.js" /Y
xcopy ".\public\images" ".\prepare\mini\images" /E /I /Y /H /R
xcopy ".\public\styles" ".\prepare\mini\styles" /E /I /Y /H /R
xcopy ".\public\sounds" ".\prepare\mini\sounds" /E /I /Y /H /R