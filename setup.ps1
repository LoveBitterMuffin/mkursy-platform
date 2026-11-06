<#
.SYNOPSIS
    MKursy Platform - 1-Click Zero-Download Bootstrap Installer & Updater
.DESCRIPTION
    Downloads or updates the latest version of MKursy Platform from GitHub
    directly to drive C:\ (C:\mkursy-platform), validates Node.js, installs
    dependencies and starts the server automatically.
#>

[CmdletBinding()]
param (
    [string]$TargetDir = "C:\mkursy-platform",
    [switch]$NoLaunch
)

$ErrorActionPreference = 'Stop'

function Write-BoxHeader {
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

Write-BoxHeader "MKursy Platform - Automated Zero-Download Setup"

# 1. Check Drive C:
if (-not (Test-Path "C:\")) {
    Write-Fatal "Drive C:\ was not found in the filesystem!"
    exit 1
}

# 2. Check Node.js
Write-Info "Step 1/4: Checking system environment (Node.js & npm)..."
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue

if (-not $nodeCmd) {
    # Check if node.exe exists in standard Program Files location
    if (Test-Path "C:\Program Files\nodejs\node.exe") {
        $env:Path = "$env:Path;C:\Program Files\nodejs"
        $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
    }
}

$needNodeInstall = $false
if ($nodeCmd) {
    $currentVerRaw = (& node -v).Trim()
    $currentMajor = [int]($currentVerRaw.TrimStart('v').Split('.')[0])
    if ($currentMajor -lt 18) {
        Write-Warning "Detected outdated Node.js ($currentVerRaw). Node.js >= 18.0.0 is required."
        $needNodeInstall = $true
    }
} else {
    Write-Warning "Node.js is not installed on this machine."
    $needNodeInstall = $true
}

if ($needNodeInstall) {
    $installed = $false

    # 2a. Try winget first if available
    $wingetCmd = Get-Command winget -ErrorAction SilentlyContinue
    if ($wingetCmd) {
        Write-Info "Attempting automatic Node.js installation via winget..."
        try {
            & winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
            $machinePath = [System.Environment]::GetEnvironmentVariable("Path","Machine")
            $userPath = [System.Environment]::GetEnvironmentVariable("Path","User")
            $env:Path = "$machinePath;$userPath;C:\Program Files\nodejs"
            $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
            if ($nodeCmd) { $installed = $true }
        } catch {
            Write-Warning "winget install failed or was cancelled."
        }
    }

    # 2b. Direct MSI download from nodejs.org if winget was not available or failed
    if (-not $installed) {
        Write-Info "Downloading official Node.js LTS installer directly from nodejs.org..."
        $arch = if ([System.Environment]::Is64BitOperatingSystem) { "x64" } else { "x86" }
        $msiUrl = "https://nodejs.org/dist/v20.18.0/node-v20.18.0-$arch.msi"
        try {
            [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 -bor [Net.SecurityProtocolType]::Tls13
            $index = Invoke-RestMethod -Uri "https://nodejs.org/dist/index.json" -UseBasicParsing -TimeoutSec 5
            $lts = $index | Where-Object { $_.lts -ne $false } | Select-Object -First 1
            if ($lts -and $lts.version) {
                $msiUrl = "https://nodejs.org/dist/$($lts.version)/node-$($lts.version)-$arch.msi"
            }
        } catch {
            # Use safe fallback URL
        }

        $tempMsi = Join-Path $env:TEMP "nodejs-setup.msi"
        Write-Info "Downloading Node.js: $msiUrl..."
        try {
            Invoke-WebRequest -Uri $msiUrl -OutFile $tempMsi -UseBasicParsing
            Write-Info "Running silent installation (msiexec)..."
            $proc = Start-Process msiexec.exe -ArgumentList "/i `"$tempMsi`" /qn /norestart" -Wait -PassThru
            if ($proc.ExitCode -ne 0) {
                # Attempt with elevation request if standard execution lacked permission
                Start-Process msiexec.exe -ArgumentList "/i `"$tempMsi`" /qn /norestart" -Wait -Verb RunAs
            }
            Remove-Item -Force $tempMsi -ErrorAction SilentlyContinue

            $machinePath = [System.Environment]::GetEnvironmentVariable("Path","Machine")
            $userPath = [System.Environment]::GetEnvironmentVariable("Path","User")
            $env:Path = "$machinePath;$userPath;C:\Program Files\nodejs"
            $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
            if ($nodeCmd) { $installed = $true }
        } catch {
            Write-Warning "Direct MSI download/install encountered an issue: $_"
        }
    }

    if (-not $nodeCmd) {
        if (Test-Path "C:\Program Files\nodejs\node.exe") {
            $env:Path = "$env:Path;C:\Program Files\nodejs"
            $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
        }
    }

    if (-not $nodeCmd) {
        Write-Fatal "Node.js >= 18 is required. Please install it from: https://nodejs.org/"
        Start-Process "https://nodejs.org/" -ErrorAction SilentlyContinue
        exit 1
    }
}

$nodeVer = (& node -v).Trim()
$majorVer = [int]($nodeVer.TrimStart('v').Split('.')[0])
if ($majorVer -lt 18) {
    Write-Fatal "Node.js version is too old ($nodeVer). Version >= 18.0.0 is required."
    exit 1
}
Write-Success "Node.js detected: $nodeVer (>= 18.0.0)"

$npmCmd = Get-Command npm -ErrorAction SilentlyContinue
if (-not $npmCmd) {
    Write-Fatal "npm is not found in PATH!"
    exit 1
}
Write-Success "npm is ready"

# 3. Download or update to latest version on Drive C:\
Write-Host ""
Write-Info "Step 2/4: Getting latest version in $TargetDir..."

$repoUrl = "https://github.com/LoveBitterMuffin/mkursy-platform.git"
$zipUrl  = "https://github.com/LoveBitterMuffin/mkursy-platform/archive/refs/heads/main.zip"
$gitCmd  = Get-Command git -ErrorAction SilentlyContinue

if ($gitCmd) {
    if (Test-Path (Join-Path $TargetDir ".git")) {
        Write-Info "Target $TargetDir already exists. Updating to latest main commit..."
        Push-Location $TargetDir
        try {
            & git fetch origin main
            & git reset --hard origin/main
            & git pull origin main
            Write-Success "Successfully updated to latest version from GitHub!"
        } finally {
            Pop-Location
        }
    } else {
        if (Test-Path $TargetDir) {
            Write-Info "Cleaning existing target directory before clone..."
            Remove-Item -Recurse -Force $TargetDir -ErrorAction SilentlyContinue
        }
        Write-Info "Cloning repository via Git..."
        & git clone --depth 1 $repoUrl $TargetDir
        if ($LASTEXITCODE -ne 0) {
            Write-Fatal "Failed to clone repository."
            exit $LASTEXITCODE
        }
        Write-Success "Repository cloned successfully to $TargetDir!"
    }
} else {
    Write-Warning "Git is not installed. Downloading latest ZIP archive directly from GitHub..."
    $tempZip = Join-Path $env:TEMP "mkursy-latest.zip"
    $tempExtract = Join-Path $env:TEMP "mkursy-extract"

    if (Test-Path $tempZip) { Remove-Item -Force $tempZip }
    if (Test-Path $tempExtract) { Remove-Item -Recurse -Force $tempExtract }

    Write-Info "Downloading archive: $zipUrl..."
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 -bor [Net.SecurityProtocolType]::Tls13
    Invoke-WebRequest -Uri $zipUrl -OutFile $tempZip -UseBasicParsing

    Write-Info "Extracting archive..."
    Expand-Archive -Path $tempZip -DestinationPath $tempExtract -Force

    if (-not (Test-Path $TargetDir)) {
        New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
    }

    $unpackedFolder = Get-ChildItem -Path $tempExtract -Directory | Select-Object -First 1
    Copy-Item -Path "$($unpackedFolder.FullName)\*" -Destination $TargetDir -Recurse -Force

    Remove-Item -Force $tempZip -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force $tempExtract -ErrorAction SilentlyContinue
    Write-Success "Archive extracted to $TargetDir!"
}

# 4. Check and install all dependencies
Write-Host ""
Write-Info "Step 3/4: Checking and installing dependencies in $TargetDir..."

Push-Location $TargetDir
try {
    if (Test-Path ".\start.ps1") {
        & powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\start.ps1" -InstallOnly
    } else {
        & npm install
    }
} finally {
    Pop-Location
}

# 5. Create Desktop shortcut
try {
    $desktopPath = [System.Environment]::GetFolderPath('Desktop')
    $shortcutPath = Join-Path $desktopPath "MKursy.lnk"
    $wscriptShell = New-Object -ComObject WScript.Shell
    $shortcut = $wscriptShell.CreateShortcut($shortcutPath)
    $shortcut.TargetPath = Join-Path $TargetDir "start.bat"
    $shortcut.WorkingDirectory = $TargetDir
    $shortcut.Description = "MKursy - Start Math Education Platform"
    $shortcut.Save()
    Write-Success "Desktop shortcut created: MKursy.lnk"
} catch {
    # Non-critical, continue
}

# 6. Launch platform
if (-not $NoLaunch) {
    Write-Host ""
    Write-Info "Step 4/4: Launching MKursy platform..."
    Push-Location $TargetDir
    try {
        & powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\start.ps1"
    } finally {
        Pop-Location
    }
} else {
    Write-Success "Setup completed successfully. You can launch MKursy anytime from $TargetDir\start.bat or Desktop shortcut."
}
