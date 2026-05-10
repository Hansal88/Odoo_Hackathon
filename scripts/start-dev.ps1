# PowerShell script to start both frontend and backend
# Start both servers: .\scripts\start-dev.ps1

Write-Host "🚀 Starting Traveloop Development Environment..." -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Function to handle Ctrl+C
$null = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action {
    Write-Host "Stopping servers..." -ForegroundColor Yellow
    Get-Job | Stop-Job
    exit
}

# Start backend in background
Write-Host "📡 Starting Backend Server..." -ForegroundColor Blue
$backendJob = Start-Job -ScriptBlock {
    Set-Location backend
    npm run dev
}

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend in background
Write-Host "⚛️  Starting Frontend Server..." -ForegroundColor Blue
$frontendJob = Start-Job -ScriptBlock {
    Set-Location frontend
    npm run dev
}

Write-Host ""
Write-Host "✓ Servers are starting..." -ForegroundColor Green
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "  API Docs: http://localhost:5000/api/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Wait for jobs to complete
Get-Job | Wait-Job
