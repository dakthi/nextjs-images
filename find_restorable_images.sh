#!/bin/bash

# Get all products currently missing images
missing=$(jq '.products[] | select(.images.topLeft == "/vllondon-logo.jpeg" and .images.topRight == "/vllondon-logo.jpeg" and .images.bottomLeft == "/vllondon-logo.jpeg") | .id' data/products-generated.json | tr -d '"')

echo "Checking which missing products had real images in pre-rename backup..."
echo ""

for product_id in $missing; do
  images=$(jq ".products[] | select(.id == \"$product_id\") | .images" data/products-generated.json.pre-rename-backup 2>/dev/null)
  
  if [ -n "$images" ] && [ "$images" != "null" ]; then
    topLeft=$(echo "$images" | jq -r '.topLeft // empty')
    topRight=$(echo "$images" | jq -r '.topRight // empty')
    bottomLeft=$(echo "$images" | jq -r '.bottomLeft // empty')
    
    # Check if any image is NOT the logo placeholder
    if [[ ! "$topLeft" =~ "vllondon-logo" ]] || [[ ! "$topRight" =~ "vllondon-logo" ]] || [[ ! "$bottomLeft" =~ "vllondon-logo" ]]; then
      echo "$product_id:"
      echo "  topLeft: $topLeft"
      echo "  topRight: $topRight"
      echo "  bottomLeft: $bottomLeft"
    fi
  fi
done
