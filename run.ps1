# RURAL-GO - Scripts útiles para Windows

Write-Host "🚀 RURAL-GO Backend & Frontend Manager" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Comandos disponibles:" -ForegroundColor Yellow
Write-Host "1. .\run.ps1 dev:all      - Ejecutar backend + frontend" -ForegroundColor Green
Write-Host "2. .\run.ps1 dev:backend  - Solo backend" -ForegroundColor Green
Write-Host "3. .\run.ps1 dev:frontend - Solo frontend" -ForegroundColor Green
Write-Host "4. .\run.ps1 build:all    - Build frontend + sync Android" -ForegroundColor Green
Write-Host "5. .\run.ps1 test:api     - Testear API" -ForegroundColor Green
Write-Host ""

param([string]$command)

switch ($command) {
    "dev:all" {
        Write-Host "🔥 Iniciando backend..." -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "cd server; npm run dev"
        Start-Sleep -Seconds 3
        Write-Host "🎨 Iniciando frontend..." -ForegroundColor Yellow
        npm run dev
    }
    
    "dev:backend" {
        Write-Host "🔥 Iniciando backend..." -ForegroundColor Yellow
        cd server
        npm run dev
    }
    
    "dev:frontend" {
        Write-Host "🎨 Iniciando frontend..." -ForegroundColor Yellow
        npm run dev
    }
    
    "build:all" {
        Write-Host "📦 Compilando frontend..." -ForegroundColor Yellow
        npm run build
        Write-Host "📱 Sincronizando con Android..." -ForegroundColor Yellow
        npx cap sync android
        Write-Host "✅ Listo para Android!" -ForegroundColor Green
    }
    
    "test:api" {
        Write-Host "🧪 Testeando API..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "1. Registrar usuario:" -ForegroundColor Cyan
        
        $body = @{
            name = "Test User"
            email = "test@example.com"
            password = "test123"
            phone = "123456789"
            role = "passenger"
        } | ConvertTo-Json
        
        Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
            -Method POST `
            -ContentType "application/json" `
            -Body $body | ConvertTo-Json
    }
    
    default {
        Write-Host "Comando no reconocido. Usa:" -ForegroundColor Red
        Write-Host "  .\run.ps1 dev:all" -ForegroundColor Gray
        Write-Host "  .\run.ps1 dev:backend" -ForegroundColor Gray
        Write-Host "  .\run.ps1 dev:frontend" -ForegroundColor Gray
        Write-Host "  .\run.ps1 build:all" -ForegroundColor Gray
        Write-Host "  .\run.ps1 test:api" -ForegroundColor Gray
    }
}
