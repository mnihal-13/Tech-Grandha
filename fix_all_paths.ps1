$root = "n:\#0Brinit\Tech-Grandha"
cd $root

Get-ChildItem -Recurse -Filter "*.html" | ForEach-Object {
    $path = $_.FullName
    $isSubdir = $path -match '\\(courses|competitions)\\' -and -not $path -match '\\\.'
    
    $content = Get-Content $path -Raw
    
    # Replace all /courses/ paths
    $content = $content -replace '="/courses/', '="./courses/'
    
    # Replace all /competitions.html
    $content = $content -replace '="/competitions\.html"', '"./competitions.html"'
    
    # Replace all /login.html, /register.html, etc
    $content = $content -replace '="/login\.html"', '"./login.html"'
    $content = $content -replace '="/register\.html"', '"./register.html"'
    $content = $content -replace '="/quizzes\.html"', '"./quizzes.html"'
    $content = $content -replace '="/terms\.html"', '"./terms.html"'
    $content = $content -replace '="/privacy-policy\.html"', '"./privacy-policy.html"'
    $content = $content -replace '="/author\.html"', '"./author.html"'
    
    # For subdirectory files, convert ./ paths to ../
    if ($isSubdir) {
        $content = $content -replace '="\./(courses|competitions|login|register|quizzes|terms|privacy|author)', '"../$1'
    }
    
    Set-Content $path -Value $content
    Write-Host "✓ Fixed: $($_.Name)"
}

Write-Host "`n✓ All paths fixed successfully!"
