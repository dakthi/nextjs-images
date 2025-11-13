#!/bin/bash

# Get all products with missing images
products=$(jq '.products[] | select(.images.topLeft == "/vllondon-logo.jpeg" and .images.topRight == "/vllondon-logo.jpeg" and .images.bottomLeft == "/vllondon-logo.jpeg") | .id' data/products-generated.json | tr -d '"')

for product_id in $products; do
  # Extract product number (e.g., "product-210" -> "210")
  prod_num=$(echo "$product_id" | sed 's/product-//')
  
  # Get the old image names from pre-rename backup
  old_images=$(jq ".products[] | select(.id == \"$product_id\") | .images" data/products-generated.json.pre-rename-backup 2>/dev/null)
  
  if [ -n "$old_images" ] && [ "$old_images" != "null" ]; then
    echo "=== $product_id ==="
    echo "$old_images" | jq '.'
    
    # Try to find these files in public-organized
    topLeft=$(echo "$old_images" | jq -r '.topLeft // empty' | sed 's/^\/*//')
    topRight=$(echo "$old_images" | jq -r '.topRight // empty' | sed 's/^\/*//')
    bottomLeft=$(echo "$old_images" | jq -r '.bottomLeft // empty' | sed 's/^\/*//')
    
    echo "Searching in public-organized..."
    [ -n "$topLeft" ] && find public-organized -name "$topLeft" 2>/dev/null && echo "Found: $topLeft"
    [ -n "$topRight" ] && find public-organized -name "$topRight" 2>/dev/null && echo "Found: $topRight"
    [ -n "$bottomLeft" ] && find public-organized -name "$bottomLeft" 2>/dev/null && echo "Found: $bottomLeft"
    echo ""
  fi
done
