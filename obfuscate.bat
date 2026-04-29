node obfuscate.js
xcopy ".\public\index.html" ".\prepare\mini\index.html" /Y
xcopy ".\public\index-vk.html" ".\prepare\mini\index-vk.html" /Y
xcopy ".\public\scripts\languages" ".\prepare\mini\scripts\languages" /E /I /Y /H /R
xcopy ".\public\images" ".\prepare\mini\images" /E /I /Y /H /R
xcopy ".\public\styles" ".\prepare\mini\styles" /E /I /Y /H /R
xcopy ".\public\sounds" ".\prepare\mini\sounds" /E /I /Y /H /R