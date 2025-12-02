#!/usr/bin/env python3
"""
Export Markdown to Nicely Formatted HTML or PDF
Converts markdown files to rendered HTML with styling
"""

import markdown
import os
from pathlib import Path

try:
    from weasyprint import HTML
    WEASYPRINT_AVAILABLE = True
except ImportError:
    WEASYPRINT_AVAILABLE = False


def export_md_to_html(md_file_path, output_dir=None):
    """
    Convert markdown file to styled HTML

    Args:
        md_file_path: Path to markdown file
        output_dir: Output directory (default: same as input file)
    """
    md_path = Path(md_file_path)

    if not md_path.exists():
        print(f"Error: File not found: {md_file_path}")
        return

    # Read markdown content
    with open(md_path, 'r', encoding='utf-8') as f:
        md_content = f.read()

    # Convert markdown to HTML
    html_content = markdown.markdown(
        md_content,
        extensions=[
            'extra',  # Tables, fenced code, etc.
            'codehilite',  # Syntax highlighting
            'toc',  # Table of contents
            'nl2br',  # Newline to <br>
        ]
    )

    # HTML template with nice styling
    html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{md_path.stem}</title>
    <style>
        @page {{
            margin: 1.5cm 1cm;
            @bottom-center {{
                content: element(footer);
            }}
        }}
        .footer {{
            position: running(footer);
            text-align: center;
            padding-top: 8px;
            border-top: 1px solid #ddd;
            font-size: 9px;
            color: #7f8c8d;
        }}
        .footer p {{
            margin: 2px 0;
        }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.4;
            max-width: 100%;
            margin: 0;
            padding: 20px;
            color: #333;
            background: #fff;
            font-size: 12px;
        }}
        h1 {{
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 5px;
            margin-top: 0;
            margin-bottom: 12px;
            font-size: 20px;
        }}
        h2 {{
            color: #34495e;
            border-bottom: 1px solid #ecf0f1;
            padding-bottom: 4px;
            margin-top: 16px;
            margin-bottom: 8px;
            font-size: 16px;
            break-after: avoid;
        }}
        h3 {{
            color: #7f8c8d;
            margin-top: 12px;
            margin-bottom: 6px;
            font-size: 14px;
            font-weight: 600;
            break-after: avoid;
        }}
        code {{
            background: #f8f9fa;
            padding: 2px 5px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 11px;
        }}
        pre {{
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            border-left: 4px solid #3498db;
        }}
        pre code {{
            background: none;
            padding: 0;
        }}
        ul {{
            padding-left: 20px;
            margin-top: 6px;
            margin-bottom: 10px;
        }}
        li {{
            margin: 4px 0;
            line-height: 1.4;
        }}
        input[type="checkbox"] {{
            margin-right: 8px;
        }}
        blockquote {{
            border-left: 3px solid #3498db;
            padding-left: 12px;
            margin: 10px 0;
            color: #7f8c8d;
            font-style: italic;
        }}
        p {{
            margin: 6px 0;
        }}
        table {{
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
        }}
        th, td {{
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }}
        th {{
            background-color: #3498db;
            color: white;
        }}
        tr:nth-child(even) {{
            background-color: #f8f9fa;
        }}
        hr {{
            border: none;
            border-top: 1px solid #ecf0f1;
            margin: 15px 0;
        }}
        strong {{
            color: #2c3e50;
        }}
        a {{
            color: #3498db;
            text-decoration: none;
        }}
        a:hover {{
            text-decoration: underline;
        }}
        @media print {{
            body {{
                max-width: 100%;
            }}
        }}
    </style>
</head>
<body>
    {html_content}

    <div class="footer">
        <p>VLDirect | vldirect.uk | Research & Development</p>
        <p>Confidential - Internal Use Only</p>
    </div>
</body>
</html>
"""

    # Determine output path
    if output_dir:
        output_path = Path(output_dir) / f"{md_path.stem}.html"
    else:
        output_path = md_path.parent / f"{md_path.stem}.html"

    # Write HTML file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_template)

    print(f"✓ Exported HTML: {output_path}")
    return output_path


def export_md_to_pdf(md_file_path, output_dir=None):
    """
    Convert markdown file to PDF

    Args:
        md_file_path: Path to markdown file
        output_dir: Output directory (default: same as input file)
    """
    if not WEASYPRINT_AVAILABLE:
        print("Warning: WeasyPrint not installed. Install with: pip install weasyprint")
        print("Falling back to HTML export only.")
        return export_md_to_html(md_file_path, output_dir)

    md_path = Path(md_file_path)

    if not md_path.exists():
        print(f"Error: File not found: {md_file_path}")
        return

    # First create HTML
    html_path = export_md_to_html(md_file_path, output_dir)

    # Determine PDF output path
    if output_dir:
        pdf_path = Path(output_dir) / f"{md_path.stem}.pdf"
    else:
        pdf_path = md_path.parent / f"{md_path.stem}.pdf"

    # Convert HTML to PDF
    try:
        HTML(filename=str(html_path)).write_pdf(str(pdf_path))
        print(f"✓ Exported PDF: {pdf_path}")
        return pdf_path
    except Exception as e:
        print(f"Error creating PDF: {e}")
        return None


def export_all_md_in_folder(folder_path, output_dir=None, to_pdf=False):
    """
    Export all markdown files in a folder to HTML/PDF

    Args:
        folder_path: Path to folder containing markdown files
        output_dir: Output directory (default: same as input folder)
        to_pdf: Export to PDF instead of HTML
    """
    folder = Path(folder_path)

    if not folder.exists():
        print(f"Error: Folder not found: {folder_path}")
        return

    md_files = list(folder.glob("*.md"))

    if not md_files:
        print(f"No markdown files found in: {folder_path}")
        return

    print(f"Found {len(md_files)} markdown file(s)")

    for md_file in md_files:
        if to_pdf:
            export_md_to_pdf(md_file, output_dir)
        else:
            export_md_to_html(md_file, output_dir)

    print(f"\n✓ All files exported successfully!")


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage:")
        print("  Export to PDF:       python export_markdown.py <file.md>")
        print("  Export to HTML:      python export_markdown.py <file.md> --html")
        print("  Export folder:       python export_markdown.py <folder_path> [--html]")
        print("\nExamples:")
        print("  python export_markdown.py project/research-tasks-vietnamese.md")
        print("  python export_markdown.py project/research-tasks-vietnamese.md --html")
        print("  python export_markdown.py project/")
        print("\nNote: PDF export requires WeasyPrint:")
        print("  pip install markdown weasyprint")
        sys.exit(1)

    input_path = Path(sys.argv[1])
    to_html_only = "--html" in sys.argv
    output_dir = None

    # Check for output directory argument
    for i, arg in enumerate(sys.argv[2:], start=2):
        if arg != "--html" and not arg.startswith("-"):
            output_dir = arg
            break

    if input_path.is_file():
        if to_html_only:
            export_md_to_html(input_path, output_dir)
        else:
            export_md_to_pdf(input_path, output_dir)
    elif input_path.is_dir():
        export_all_md_in_folder(input_path, output_dir, to_pdf=not to_html_only)
    else:
        print(f"Error: Invalid path: {input_path}")
