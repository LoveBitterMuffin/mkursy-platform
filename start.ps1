[CmdletBinding()]
param (
    [switch]$NoBrowser,
    [switch]$InstallOnly
)

$ErrorActionPreference = 'Stop'
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

function Write-StepHeader {
    param([string]$Title)
    Write-Host ""
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host "   $Title" -ForegroundColor Magenta
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Success {
    param([string]$Message)
    Write-Host " [OK] " -ForegroundColor Green -NoNewline
    Write-Host $Message
}

function Write-Info {
    param([string]$Message)
    Write-Host " [INFO] " -ForegroundColor Cyan -NoNewline
    Write-Host $Message
}

function Write-Warning {
    param([string]$Message)
    Write-Host " [WARN] " -ForegroundColor Yellow -NoNewline
    Write-Host $Message
}

function Write-Fatal {
    param([string]$Message)
    Write-Host " [FAIL] " -ForegroundColor Red -NoNewline
    Write-Host $Message -ForegroundColor Red
}

Write-StepHeader "MKursy - Math Education Platform Launcher"

# 1. Check Node.js
Write-Info "Step 1/3: Checking system environment..."
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCmd) {
    Write-Fatal "Node.js is not found on your system!"
    Write-Host "Please install Node.js (version 18 or newer): https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

$nodeVerRaw = (& node -v).Trim()
Write-Success "Node.js detected: $nodeVerRaw"

$majorVer = [int]($nodeVerRaw.TrimStart('v').Split('.')[0])
if ($majorVer -lt 18) {
    Write-Fatal "Node.js version is too old ($nodeVerRaw). Node.js 18.0.0 or newer is required."
    exit 1
}

# 2. Check npm
$npmCmd = Get-Command npm -ErrorAction SilentlyContinue
if (-not $npmCmd) {
    Write-Fatal "npm is not found in PATH!"
    exit 1
}
$npmVer = (& npm -v).Trim()
Write-Success "npm detected: v$npmVer"

# 3. Check Git
$gitCmd = Get-Command git -ErrorAction SilentlyContinue
if ($gitCmd) {
    $gitVer = (& git --version).Trim()
    Write-Success "$gitVer"
} else {
    Write-Warning "Git is not detected in PATH (recommended for version control)."
}

# 4. Check dependencies
Write-Host ""
Write-Info "Step 2/3: Checking project dependencies..."

$packageJsonPath = Join-Path $ScriptDir "package.json"
$nodeModulesPath = Join-Path $ScriptDir "node_modules"

if (-not (Test-Path $packageJsonPath)) {
    Write-Fatal "package.json not found in $packageJsonPath"
    exit 1
}

$needInstall = $false

if (-not (Test-Path $nodeModulesPath)) {
    Write-Warning "node_modules folder is missing."
    $needInstall = $true
} else {
    $criticalModules = @("vite", "react", "react-dom", "tailwindcss", "katex", "lucide-react")
    foreach ($mod in $criticalModules) {
        $modPath = Join-Path $nodeModulesPath $mod
        if (-not (Test-Path $modPath)) {
            Write-Warning "Missing critical module: $mod"
            $needInstall = $true
            break
        }
    }
}

if ($needInstall) {
    Write-Info "Installing dependencies: npm install..."
    & npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Fatal "npm install failed with exit code $LASTEXITCODE"
        exit $LASTEXITCODE
    }
    Write-Success "All dependencies successfully installed!"
} else {
    Write-Success "All dependencies are installed and ready."
}

if ($InstallOnly) {
    Write-Success "Setup completed successfully (--InstallOnly)."
    exit 0
}

# 5. Check port and run Vite server
Write-Host ""
Write-Info "Step 3/3: Starting development server..."

$port = 5173
$portInUse = $false
try {
    $tcpListener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, $port)
    $tcpListener.Start()
    $tcpListener.Stop()
} catch {
    $portInUse = $true
}

if ($portInUse) {
    Write-Warning "Port $port is currently in use. Vite will automatically use the next available port."
}

Write-Host ""
Write-Host "======================================================" -ForegroundColor Green
Write-Host " Development server starting at: http://localhost:5173" -ForegroundColor Green
Write-Host " Press Ctrl + C to stop the server." -ForegroundColor Gray
Write-Host "======================================================" -ForegroundColor Green
Write-Host ""

if (-not $NoBrowser) {
    Start-Process "http://localhost:5173" -ErrorAction SilentlyContinue
}

& npm run dev
