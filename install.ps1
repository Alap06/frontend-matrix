# Script d'installation automatique pour SGE Frontend
# À exécuter dans PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Installation SGE Frontend ISSAT KR   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Node.js est installé
Write-Host "Vérification de Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js installé: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js n'est pas installé!" -ForegroundColor Red
    Write-Host "Téléchargez Node.js depuis: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Vérifier si npm est installé
Write-Host "Vérification de npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm installé: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm n'est pas installé!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Installation des dépendances..." -ForegroundColor Yellow
Write-Host "Cela peut prendre quelques minutes..." -ForegroundColor Gray
Write-Host ""

# Installer les dépendances
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Installation terminée avec succès!" -ForegroundColor Green
    Write-Host ""
    
    # Créer le fichier .env s'il n'existe pas
    if (-not (Test-Path ".env")) {
        Write-Host "Création du fichier .env..." -ForegroundColor Yellow
        Copy-Item ".env.example" ".env"
        Write-Host "✓ Fichier .env créé" -ForegroundColor Green
        Write-Host "  → Vous pouvez modifier .env pour changer l'URL de l'API" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "   Installation Complète!               " -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Pour démarrer le serveur de développement:" -ForegroundColor Yellow
    Write-Host "  npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "Pour créer un build de production:" -ForegroundColor Yellow
    Write-Host "  npm run build" -ForegroundColor White
    Write-Host ""
    Write-Host "L'application sera accessible sur:" -ForegroundColor Yellow
    Write-Host "  http://localhost:3000" -ForegroundColor White
    Write-Host ""
    
} else {
    Write-Host ""
    Write-Host "✗ Erreur lors de l'installation!" -ForegroundColor Red
    Write-Host "Veuillez vérifier les messages d'erreur ci-dessus." -ForegroundColor Yellow
    exit 1
}
