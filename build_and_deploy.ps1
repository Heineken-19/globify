# Útvonalak
$jarPath = "E:\globifyBE\build\libs\globifyBE.jar"
$libsPath = "E:\globifyBE\libs"
$dockerPath = "E:\debian-dev"

# Ellenőrizzük, hogy a .jar fájl létezik-e
if (!(Test-Path $jarPath)) {
    Write-Host "❌ A globifyBE.jar nem található. Ellenőrizd a buildet."
    exit 1
}

# Ellenőrizzük, hogy a libs mappa létezik-e
if (!(Test-Path $libsPath)) {
    Write-Host "❌ A libs mappa nem található. Ellenőrizd a buildet."
    exit 1
}

# Másoljuk a .jar fájlt és a libs mappát a Docker mappába
Write-Host "✅ A legfrissebb globifyBE.jar és a libs mappa másolása a Docker mappába..."
Copy-Item $jarPath "$dockerPath\globifyBE.jar" -Force
Remove-Item "$dockerPath\libs" -Recurse -Force -ErrorAction Ignore
Copy-Item $libsPath "$dockerPath\libs" -Recurse -Force

# Docker build és indítás
Write-Host "🚀 Docker build és indítás..."
cd $dockerPath
docker-compose up --build -d

# Várakozás a konténer indulására
Start-Sleep -Seconds 5

# Ellenőrizzük, hogy a konténer fut-e
$containers = docker ps --filter "name=spring-app" --format "{{.ID}}"
if ($containers -eq $null) {
    Write-Host "❌ A Docker konténer nem futott el. Ellenőrizzük a naplókat..."
    docker logs spring-app --tail 50
} else {
    Write-Host "✅ A Docker konténer sikeresen fut."
    Write-Host "📄 A naplókat itt találod: E:\debian-dev\logs\globify.log"
}
