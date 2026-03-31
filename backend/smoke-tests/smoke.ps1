param(
  [Parameter(Mandatory = $false)]
  [string]$ApiBase = "http://localhost:8000/api"
)

$ErrorActionPreference = "Stop"

function Assert-JsonSuccess {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [Parameter(Mandatory = $true)][string]$Url
  )

  Write-Host "==> $Name" -ForegroundColor Cyan
  Write-Host "GET $Url"

  try {
    $res = Invoke-RestMethod -Method Get -Uri $Url -Headers @{ "Accept" = "application/json" }
  } catch {
    Write-Host "FAILED: request error" -ForegroundColor Red
    throw
  }

  if ($null -eq $res) {
    throw "FAILED: empty response for $Name"
  }

  if ($res.PSObject.Properties.Name -notcontains "success") {
    throw "FAILED: response missing 'success' for $Name"
  }

  if (-not $res.success) {
    $err = if ($res.PSObject.Properties.Name -contains "error") { $res.error } else { "(no error field)" }
    throw "FAILED: success=false for $Name. error=$err"
  }

  Write-Host "OK" -ForegroundColor Green
}

Write-Host "Backend smoke tests" -ForegroundColor Yellow
Write-Host "API_BASE = $ApiBase"
Write-Host ""

Assert-JsonSuccess -Name "classes" -Url "$ApiBase/classes.php"
Assert-JsonSuccess -Name "sessions" -Url "$ApiBase/sessions.php"
Assert-JsonSuccess -Name "membership_plans" -Url "$ApiBase/membership_plans.php"

Write-Host ""
Write-Host "All smoke tests passed." -ForegroundColor Green

