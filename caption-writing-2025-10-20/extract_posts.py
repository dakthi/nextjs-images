#!/usr/bin/env python3
import csv
import os
import requests
from pathlib import Path
import re

# Read the CSV file
csv_file = '/Users/dakthi/Documents/Factory-Tech/nextjs/vl-london/caption-writing-2025-10-20/delivered_post.csv'
output_dir = '/Users/dakthi/Documents/Factory-Tech/nextjs/vl-london/caption-writing-2025-10-20/extracted_posts'

# Create output directory
Path(output_dir).mkdir(parents=True, exist_ok=True)

def sanitize_filename(text):
    """Create a safe folder name from text"""
    # Take first 50 chars, remove special characters
    text = text[:50]
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')

def download_image(url, filepath):
    """Download image from URL"""
    try:
        response = requests.get(url, timeout=30)
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                f.write(response.content)
            return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
    return False

# Read CSV
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
            image_ext = '.png' if '.png' in image_url else '.jpg'
            image_file = os.path.join(folder_path, f'image{image_ext}')
            print(f"Downloading image {idx}...")
            if download_image(image_url, image_file):
                print(f"✓ Post {idx} complete: {folder_name}")
            else:
                print(f"✗ Post {idx} caption saved but image failed: {folder_name}")
        else:
            print(f"✓ Post {idx} complete (no image): {folder_name}")

print(f"\n✅ All posts extracted to: {output_dir}")
