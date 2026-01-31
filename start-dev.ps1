# Hey Kerala - Development Server Starter
# This script helps you start both backend and frontend servers

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Hey Kerala - Development Servers" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Choose an option:" -ForegroundColor Yellow
Write-Host "1. Start Backend Server (port 5000)" -ForegroundColor Green
Write-Host "2. Start Frontend Server (port 3000)" -ForegroundColor Green
Write-Host "3. Start Both (requires 2 terminals)" -ForegroundColor Green
Write-Host ""

$choice = Read-Host "Enter your choice (1, 2, or 3)"

switch ($choice) {
    "1" {
        Write-Host "Starting Backend Server..." -ForegroundColor Yellow
        Set-Location backend
        npm run dev
    }
    "2" {
        Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
        Set-Location client
        npm run dev
    }
    "3" {
        Write-Host ""
        Write-Host "To start both servers, open 2 terminals:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Terminal 1 (Backend):" -ForegroundColor Cyan
        Write-Host "  cd backend" -ForegroundColor White
        Write-Host "  npm run dev" -ForegroundColor White
        Write-Host ""
        Write-Host "Terminal 2 (Frontend):" -ForegroundColor Cyan
        Write-Host "  cd client" -ForegroundColor White
        Write-Host "  npm run dev" -ForegroundColor White
        Write-Host ""
        Write-Host "Or run this script twice and choose option 1, then 2" -ForegroundColor Yellow
    }
    default {
        Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
    }
}






