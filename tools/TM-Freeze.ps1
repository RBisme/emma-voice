Clear-Host

Write-Host ""
Write-Host "========== TradesMagic Freeze Utility =========="
Write-Host ""

git log --oneline -20

Write-Host ""
$FirstCommit = Read-Host "Enter FIRST commit hash"
$LastCommit  = Read-Host "Enter LAST commit hash"

Write-Host ""
Write-Host "Files included in freeze:"
Write-Host ""

git diff --name-only "$($FirstCommit)^..$LastCommit"

Write-Host ""
Pause