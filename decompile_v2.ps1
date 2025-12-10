$classesDir = "target\classes\com\project"
$sourceDir = "src\main\java"
$tempDir = "decompiled_temp"

# Create temp directory
if (Test-Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

# Get all .class files recursively
$classFiles = Get-ChildItem -Path $classesDir -Filter *.class -Recurse

Write-Host "Found $($classFiles.Count) class files to decompile"

foreach ($classFile in $classFiles) {
    # Decompile to temp directory
    Write-Host "Decompiling: $($classFile.Name)"
    java -jar cfr.jar $classFile.FullName --outputdir $tempDir --caseinsensitivefs true 2>&1 | Out-Null
}

Write-Host "`nMoving decompiled files to source directory..."

# Find all decompiled .java files in temp directory
$decompiledFiles = Get-ChildItem -Path $tempDir -Filter *.java -Recurse

foreach ($file in $decompiledFiles) {
    # Find the corresponding path in src/main/java
    # The decompiled file should maintain the package structure
    $content = Get-Content $file.FullName -Raw
    
    # Extract package name from the file
    if ($content -match 'package\s+([\w\.]+);') {
        $packageName = $matches[1]
        $packagePath = $packageName.Replace('.', '\')
        
        # Determine target path
        $targetDir = Join-Path $sourceDir $packagePath
        $targetFile = Join-Path $targetDir $file.Name
        
        # Create directory if it doesn't exist
        if (-not (Test-Path $targetDir)) {
            New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
        }
        
        # Copy the decompiled file
        Write-Host "Copying: $($file.Name) -> $targetFile"
        Copy-Item -Path $file.FullName -Destination $targetFile -Force
    }
}

# Clean up temp directory
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "`nDecompilation complete! All files have been replaced with proper Java source code."
