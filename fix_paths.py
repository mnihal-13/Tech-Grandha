#!/usr/bin/env python3
import os
import re
from pathlib import Path

def fix_paths_in_file(filepath, is_subdir=False):
    """Fix all absolute paths to relative paths in HTML file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Determine prefix based on directory depth
    prefix = "../" if is_subdir else "./"
    
    # Replace asset paths
    content = re.sub(r'href="()/assets/', rf'href="{prefix}assets/', content)
    content = re.sub(r'src="()/assets/', rf'src="{prefix}assets/', content)
    
    # Replace course paths
    content = re.sub(r'href="()/courses/', rf'href="{prefix}courses/', content)
    
    # Replace competition paths
    if not is_subdir:
        content = re.sub(r'href="()/competitions\.html"', rf'href="./competitions.html"', content)
        content = re.sub(r'href="()/competitions"(?!\.html)', rf'href="./competitions.html"', content)
    else:
        content = re.sub(r'href="()/competitions\.html"', rf'href="../competitions.html"', content)
        content = re.sub(r'href="()/competitions"(?!\.html)', rf'href="../competitions.html"', content)
    
    # Replace other page links (root files only)
    if not is_subdir:
        content = re.sub(r'href="()/login\.html"', r'href="./login.html"', content)
        content = re.sub(r'href="()/register\.html"', r'href="./register.html"', content)
        content = re.sub(r'href="()/terms\.html"', r'href="./terms.html"', content)
        content = re.sub(r'href="()/privacy-policy\.html"', r'href="./privacy-policy.html"', content)
        content = re.sub(r'href="()/author\.html"', r'href="./author.html"', content)
        content = re.sub(r'href="()/quizzes\.html"', r'href="./quizzes.html"', content)
    else:
        content = re.sub(r'href="()/login\.html"', r'href="../login.html"', content)
        content = re.sub(r'href="()/register\.html"', r'href="../register.html"', content)
        content = re.sub(r'href="()/quizzes\.html"', r'href="../quizzes.html"', content)
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

# Fix all HTML files
root_dir = Path('.')
html_files = list(root_dir.rglob('*.html'))

print(f"Found {len(html_files)} HTML files")

for html_file in html_files:
    is_subdir = str(html_file).count(os.sep) > 1 and not str(html_file).startswith('.')
    if fix_paths_in_file(str(html_file), is_subdir):
        print(f"✓ Fixed: {html_file}")
    else:
        print(f"  No changes: {html_file}")

print("\n✓ All paths have been fixed!")
