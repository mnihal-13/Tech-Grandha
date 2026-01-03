import os
import glob

root_dir = r"n:\#0Brinit\Tech-Grandha"
os.chdir(root_dir)

# Find all HTML files
html_files = glob.glob("**/*.html", recursive=True)

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Check if file is in a subdirectory
    is_subdir = os.sep in filepath and "courses" in filepath or "competitions" in filepath
    
    # Replace patterns
    content = content.replace('="/courses/', '="./courses/')
    content = content.replace('="/competitions.html"', '"./competitions.html"')
    content = content.replace('="/login.html"', '"./login.html"')
    content = content.replace('="/register.html"', '"./register.html"')
    content = content.replace('="/quizzes.html"', '"./quizzes.html"')
    content = content.replace('="/terms.html"', '"./terms.html"')
    content = content.replace('="/privacy-policy.html"', '"./privacy-policy.html"')
    content = content.replace('="/author.html"', '"./author.html"')
    
    # For subdirectory files, adjust paths
    if is_subdir:
        content = content.replace('="./courses/', '="../courses/')
        content = content.replace('="./competitions.html"', '"../competitions.html"')
        content = content.replace('="./login.html"', '"../login.html"')
        content = content.replace('="./register.html"', '"../register.html"')
        content = content.replace('="./quizzes.html"', '"../quizzes.html"')
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✓ Fixed: {filepath}")

print("\n✓ All paths have been fixed successfully!")
