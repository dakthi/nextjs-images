#!/usr/bin/env python3
import csv
import os
import subprocess
from pathlib import Path
import re

# Configuration
csv_file = '/Users/dakthi/Documents/Factory-Tech/nextjs/vl-london/caption-writing-2025-10-20/delivered_post.csv'
output_dir = '/Users/dakthi/Documents/Factory-Tech/nextjs/vl-london/caption-writing-2025-10-20/extracted_posts'

# Create output directory
Path(output_dir).mkdir(parents=True, exist_ok=True)

def sanitize_filename(text):
    """Create a safe folder name from text"""
    # Take first 50 chars of first line
    first_line = text.split('\n')[0] if text else 'untitled'
    first_line = first_line[:50]
    # Remove special characters
    safe_name = re.sub(r'[^\w\s-]', '', first_line)
    safe_name = re.sub(r'[-\s]+', '-', safe_name)
    return safe_name.strip('-') or 'untitled'

def download_image(url, filepath):
    """Download image using curl"""
    if not url or not url.strip():
        return False

    try:
        result = subprocess.run(
            ['curl', '-s', '-L', url, '-o', filepath],
            timeout=30,
            capture_output=True
        )
        # Check if file was created and has content
        if os.path.exists(filepath) and os.path.getsize(filepath) > 0:
            return True
        return False
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return False

# Read CSV
print("Reading CSV file...")
with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)

    for idx, row in enumerate(reader, start=1):
        caption = row['Post Description']
        image_url = row['Post Image']
        date = row['Post Date']
        contributor = row['Contributor']

        # Create folder name
        folder_name = f"{idx:04d}-{sanitize_filename(caption)}"
        folder_path = os.path.join(output_dir, folder_name)
        Path(folder_path).mkdir(parents=True, exist_ok=True)

        # Save caption
        caption_file = os.path.join(folder_path, 'caption.txt')
        with open(caption_file, 'w', encoding='utf-8') as cf:
            cf.write(caption)

        # Save metadata
        meta_file = os.path.join(folder_path, 'metadata.txt')
        with open(meta_file, 'w', encoding='utf-8') as mf:
            mf.write(f"Date: {date}\n")
            mf.write(f"Contributor: {contributor}\n")
            mf.write(f"Image URL: {image_url}\n")

        # Download image if URL exists
        if image_url and image_url.strip():
            # Determine file extension
            if '.png' in image_url.lower():
                ext = 'png'
            elif '.jpeg' in image_url.lower() or '.jpg' in image_url.lower():
                ext = 'jpg'
            elif '.webp' in image_url.lower():
                ext = 'webp'
            else:
                ext = 'jpg'

            image_file = os.path.join(folder_path, f'image.{ext}')

            if download_image(image_url, image_file):
                print(f"✓ Post {idx:04d} complete with image: {folder_name}")
            else:
                print(f"○ Post {idx:04d} caption saved (image failed): {folder_name}")
        else:
            print(f"○ Post {idx:04d} complete (no image): {folder_name}")

        # Progress indicator every 50 posts
        if idx % 50 == 0:
            print(f"--- Processed {idx} posts ---")

print(f"\n✅ All posts extracted to: {output_dir}")
print(f"Total posts processed: {idx}")
