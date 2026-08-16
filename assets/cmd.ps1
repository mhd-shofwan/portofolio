Get-ChildItem *.jpg | ForEach-Object {
    $input = $_.FullName
    $output = Join-Path $_.DirectoryName ($_.BaseName + ".jpg")

    $quality = 90

    do {
        magick "$input" -strip -quality $quality "$output"
        $size = (Get-Item "$output").Length / 1KB
        $quality -= 5
    } while ($size -gt 110 -and $quality -ge 40)

    Write-Host "$($_.Name) -> $([math]::Round($size,1)) KB | Quality $($quality+5)"
}