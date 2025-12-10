# Move decompiled files from the nested directory structure to the correct location
$sourceRoot = "src\main\java\com\project\nloads\licensetracker\target\classes\com\project\com\project"
$targetRoot = "src\main\java\com\project"

# Check if the nested directory exists
if (Test-Path $sourceRoot) {
    Write-Host "Moving decompiled files from nested structure..."
    
    # Get all .java files from the nested directory
    $javaFiles = Get-ChildItem -Path $sourceRoot -Filter *.java -Recurse
    
    foreach ($file in $javaFiles) {
        # Get relative path from source root
        $relativePath = $file.FullName.Substring($sourceRoot.Length + 1)
        $targetPath = Join-Path $targetRoot $relativePath
        
        # Create target directory if it doesn't exist
        $targetDir = Split-Path $targetPath -Parent
        if (-not (Test-Path $targetDir)) {
            New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
        }
        
        # Move the file (overwrite if exists)
        Write-Host "Moving: $relativePath"
        Copy-Item -Path $file.FullName -Destination $targetPath -Force
    }
    
    # Clean up the nested directory
    Remove-Item -Path "src\main\java\com\project\nloads" -Recurse -Force
    Write-Host "Cleanup complete!"
}
else {
    Write-Host "Nested directory not found. Checking alternative locations..."
}
