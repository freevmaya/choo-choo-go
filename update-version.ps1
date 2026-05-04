# update-version.ps1
$files = @('.\public\index.html', '.\public\index-vk.html')

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw -Encoding UTF8
        if ($content -match '\?v=(\d+)') {
            $newVersion = [int]$matches[1] + 1
            $newContent = $content -replace '\?v=\d+', "?v=$newVersion"
            Set-Content $file $newContent -NoNewline -Encoding UTF8
            Write-Host "Updated $file to version $newVersion"
        }
    }
}