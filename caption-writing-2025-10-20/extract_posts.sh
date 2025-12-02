#!/bin/bash

CSV_FILE="/Users/dakthi/Documents/Factory-Tech/nextjs/vl-london/caption-writing-2025-10-20/delivered_post.csv"
OUTPUT_DIR="/Users/dakthi/Documents/Factory-Tech/nextjs/vl-london/caption-writing-2025-10-20/extracted_posts"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Counter for folder numbering
counter=1

# Read CSV line by line (skip header)
tail -n +2 "$CSV_FILE" | while IFS=',' read -r description image_url date contributor; do
    # Remove quotes from fields
    description=$(echo "$description" | sed 's/^"//;s/"$//')
    image_url=$(echo "$image_url" | sed 's/^"//;s/"$//')
    date=$(echo "$date" | sed 's/^"//;s/"$//')
    contributor=$(echo "$contributor" | sed 's/^"//;s/"$//')

    # Create folder name (padded number + first 40 chars of description)
    folder_name=$(printf "%04d" $counter)
    first_line=$(echo "$description" | head -n1 | cut -c1-40 | sed 's/[^a-zA-Z0-9]/-/g' | sed 's/-*$//')
    folder_name="${folder_name}-${first_line}"

    folder_path="$OUTPUT_DIR/$folder_name"
    mkdir -p "$folder_path"

    # Save caption
    echo "$description" > "$folder_path/caption.txt"

    # Save metadata
    {
        echo "Date: $date"
        echo "Contributor: $contributor"
        echo "Image URL: $image_url"
    } > "$folder_path/metadata.txt"

    # Download image if URL exists
    if [ -n "$image_url" ] && [ "$image_url" != '""' ]; then
        # Determine file extension
        if [[ "$image_url" == *".png"* ]]; then
            ext="png"
        elif [[ "$image_url" == *".jpeg"* ]] || [[ "$image_url" == *".jpg"* ]]; then
            ext="jpg"
        else
            ext="jpg"
        fi

        echo "Downloading post $counter..."
        curl -s -L "$image_url" -o "$folder_path/image.$ext"

        if [ $? -eq 0 ]; then
            echo "✓ Post $counter complete: $folder_name"
        else
            echo "✗ Post $counter: caption saved but image download failed"
        fi
    else
        echo "✓ Post $counter complete (no image): $folder_name"
    fi

    ((counter++))
done

echo ""
echo "✅ All posts extracted to: $OUTPUT_DIR"
echo "Total posts: $((counter - 1))"
