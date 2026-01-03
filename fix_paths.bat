@echo off
cd "n:\#0Brinit\Tech-Grandha"

REM Use PowerShell to do the replacements
powershell -Command "^
  $files = Get-ChildItem -Recurse -Filter '*.html';^
  foreach ($file in $files) {^
    $content = (Get-Content $file.FullName) -replace '=\"/courses/', '=\"./courses/';^
    $content = $content -replace '=\"/competitions\.html\"', '\"./competitions.html\"';^
    $content = $content -replace '=\"/login\.html\"', '\"./login.html\"';^
    $content = $content -replace '=\"/register\.html\"', '\"./register.html\"';^
    $content = $content -replace '=\"/quizzes\.html\"', '\"./quizzes.html\"';^
    $content = $content -replace '=\"/terms\.html\"', '\"./terms.html\"';^
    $content = $content -replace '=\"/privacy-policy\.html\"', '\"./privacy-policy.html\"';^
    $content = $content -replace '=\"/author\.html\"', '\"./author.html\"';^
    Set-Content $file.FullName -Value $content;^
    Write-Host ('Fixed: ' + $file.Name)^
  }^
"
echo All paths fixed!
pause
