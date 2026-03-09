# Function to update version.json
function Update-Version {
    $path = "D:\Tyl\src\version.json"
    $json = Get-Content $path | ConvertFrom-Json
    $json.version = $json.version + 1
    $json | ConvertTo-Json | Set-Content $path
    Write-Host ">>> Version bumped to $($json.version)" -ForegroundColor Green
    return $json.version
}

Write-Host "🚀 Starting Production Sync & Cache Reset..." -ForegroundColor Cyan

# 1. Bump version
$newVer = Update-Version

# 2. Git operations
Write-Host "📦 Committing changes..." -ForegroundColor Yellow
git add .
git commit -m "build: reset cache & optimize production (v$newVer)"

# 3. Push to Github
Write-Host "📤 Pushing to Production..." -ForegroundColor Yellow
git push origin main

Write-Host "✅ Deployment triggered! Vercel will reset all caches in ~60 seconds." -ForegroundColor Green
