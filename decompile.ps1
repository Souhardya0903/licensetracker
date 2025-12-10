$classesDir = "target\classes\com\project"
$sourceDir = "src\main\java\com\project"

# Get all .class files recursively
$classFiles = Get-ChildItem -Path $classesDir -Filter *.class -Recurse

Write-Host "Found $($classFiles.Count) class files to decompile"

foreach ($classFile in $classFiles) {
    # Get relative path from classes directory
    $relativePath = $classFile.FullName.Substring($classesDir.Length + 1)
    
    # Calculate output directory
    $relativeDir = Split-Path $relativePath -Parent
    if ($relativeDir) {
        $outputDir = Join-Path $sourceDir $relativeDir
    } else {
        $outputDir = $sourceDir
    }
    
    # Decompile the class file
    Write-Host "Decompiling: $relativePath"
    java -jar cfr.jar $classFile.FullName --outputdir $outputDir --caseinsensitivefs true
}

Write-Host "Decompilation complete!"
