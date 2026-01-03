# PowerShell script to fix all paths
$patterns = @(
    @{ pattern = '="/courses/'; replacement = '="./courses/' },
    @{ pattern = '="/competitions\.html"'; replacement = '"./competitions.html"' },
    @{ pattern = '="/competitions"(?!\.html)'; replacement = '"./competitions.html"' }
    @{ pattern = '="/login\.html"'; replacement = '"./login.html"' },
    @{ pattern = '="/register\.html"'; replacement = '"./register.html"' },
    @{ pattern = '="/terms\.html"'; replacement = '"./terms.html"' },
    @{ pattern = '="/privacy-policy\.html"'; replacement = '"./privacy-policy.html"' },
    @{ pattern = '="/author\.html"'; replacement = '"./author.html"' }
)

Get-ChildItem -Recurse -Filter "*.html" | ForEach-Object {
    $content = Get-Content $_.FullName
    $isSubdir = $_.FullName -match '\\(courses|competitions)\\' -and -not $_.FullName -match '\\\.'
    
    foreach ($rule in $patterns) {
        if ($isSubdir -and $rule.pattern -like '=/courses/*') {
            $content = $content -replace $rule.pattern, '="../courses/'
        } elseif (-not $isSubdir) {
            $content = $content -replace $rule.pattern, $rule.replacement
        }
    }
    
    Set-Content $_.FullName -Value $content
    Write-Host "✓ Processed: $($_.Name)"
}

Write-Host "`n✓ All paths fixed!"
