# PowerShell version of setup script for Windows
# 🚀 Traveloop Development Setup Script

Write-Host "🚀 Starting Traveloop Setup..." -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Blue
$nodeVersion = node --version
if ($null -eq $nodeVersion) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 16+" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Node.js $nodeVersion" -ForegroundColor Green

# Check npm
Write-Host "Checking npm..." -ForegroundColor Blue
$npmVersion = npm --version
if ($null -eq $npmVersion) {
    Write-Host "❌ npm is not installed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ npm $npmVersion" -ForegroundColor Green

# Check Git
Write-Host "Checking Git..." -ForegroundColor Blue
$gitVersion = git --version
if ($null -eq $gitVersion) {
    Write-Host "❌ Git is not installed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ $gitVersion" -ForegroundColor Green

# Install backend dependencies
Write-Host "`nInstalling Backend Dependencies..." -ForegroundColor Blue
Set-Location backend
npm install
Write-Host "✓ Backend dependencies installed" -ForegroundColor Green

# Setup backend .env
if (-Not (Test-Path .env)) {
    Write-Host "Creating backend .env file..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "⚠️ Edit backend\.env with your configuration" -ForegroundColor Yellow
} else {
    Write-Host "✓ backend\.env exists" -ForegroundColor Green
}

Set-Location ..

# Install frontend dependencies
Write-Host "`nInstalling Frontend Dependencies..." -ForegroundColor Blue
Set-Location frontend
npm install
Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green

# Setup frontend .env
if (-Not (Test-Path .env.local)) {
    Write-Host "Creating frontend .env.local file..." -ForegroundColor Yellow
    Copy-Item .env.example .env.local
    Write-Host "⚠️ Edit frontend\.env.local with your configuration" -ForegroundColor Yellow
} else {
    Write-Host "✓ frontend\.env.local exists" -ForegroundColor Green
}

Set-Location ..

# Summary
Write-Host "`n================================" -ForegroundColor Green
Write-Host "✓ Setup Complete!" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Green

Write-Host "Next Steps:" -ForegroundColor Blue
Write-Host "1. Configure environment variables:"
Write-Host "   - Edit backend\.env"
Write-Host "   - Edit frontend\.env.local"
Write-Host ""
Write-Host "2. Start MongoDB:"
Write-Host "   - Local: mongod"
Write-Host "   - Or use MongoDB Atlas connection string"
Write-Host ""
Write-Host "3. Start development:"
Write-Host "   - npm run dev (from root)"
Write-Host ""
Write-Host "Useful Commands:" -ForegroundColor Blue
Write-Host "  npm run dev        - Start frontend & backend"
Write-Host "  npm run backend    - Start backend only"
Write-Host "  npm run frontend   - Start frontend only"
