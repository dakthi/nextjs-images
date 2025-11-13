#!/bin/bash

for id in 297 297-1 297-2; do
  for pos in topLeft topRight bottomLeft; do
    jpg_file="public/product-$id-$pos.jpg"
    webp_file="public/product-$id-$pos.webp"
    
    if [ -f "$jpg_file" ]; then
      cwebp -q 80 "$jpg_file" -o "$webp_file"
      echo "✓ Converted product-$id-$pos.jpg to webp"
      rm "$jpg_file"
    fi
  done
done

echo ""
echo "=== WebP Files Created ==="
ls -lh public/product-297*.webp
