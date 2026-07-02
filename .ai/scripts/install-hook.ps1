param(
  [string]$Stack = "node"
)

$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$src = Join-Path $root ".ai\hooks\pre-commit-$Stack.sh"
$dst = Join-Path $root ".git\hooks\pre-commit"

if (-not (Test-Path (Join-Path $root ".git"))) {
  throw "Not a git repository: $root"
}
if (-not (Test-Path $src)) {
  throw "Unknown hook stack '$Stack'. Expected $src"
}

New-Item -ItemType Directory -Path (Split-Path -Parent $dst) -Force | Out-Null
Copy-Item -Path $src -Destination $dst -Force
Write-Host "Installed Prodige $Stack pre-commit hook at .git/hooks/pre-commit"
