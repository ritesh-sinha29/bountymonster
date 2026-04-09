$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

function Invoke-Step {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Label,

        [Parameter(Mandatory = $true)]
        [string[]]$Arguments
    )

    Write-Host ""
    Write-Host "==> $Label" -ForegroundColor Cyan

    & pnpm.cmd @Arguments

    if ($LASTEXITCODE -ne 0) {
        throw "Step failed: $Label"
    }
}

function Start-BackgroundStep {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Label,

        [Parameter(Mandatory = $true)]
        [string[]]$Arguments
    )

    Write-Host ""
    Write-Host "==> $Label" -ForegroundColor Cyan

    $process = Start-Process -FilePath "cmd.exe" `
        -ArgumentList (@("/c", "pnpm.cmd") + $Arguments) `
        -WorkingDirectory $scriptRoot `
        -PassThru

    if (-not $process) {
        throw "Failed to start: $Label"
    }
}

Push-Location $scriptRoot

try {
    Invoke-Step -Label "Installing dependencies" -Arguments @("install")
    Invoke-Step -Label "Running linter" -Arguments @("run", "lint")
    Invoke-Step -Label "Building application" -Arguments @("run", "build")
    Start-BackgroundStep -Label "Starting Convex dev" -Arguments @("dlx", "convex", "dev")
    Invoke-Step -Label "Starting application" -Arguments @("run", "start")
}
finally {
    Pop-Location
}
