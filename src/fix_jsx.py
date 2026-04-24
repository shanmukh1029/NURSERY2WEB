import sys

with open('/Users/shanmukhpatamsetti/Desktop/plant ecommercial/leafora-react/src/App.jsx', 'r') as f:
    lines = f.readlines()

def count_tags(tag_open, tag_close, content):
    opens = content.count(tag_open)
    closes = content.count(tag_close)
    return opens, closes

content = "".join(lines)
# Simplified check for common tags
tags = ['<div', '<section', '<motion.section', '<main', '<footer', '<form', '<motion.div', '<motion.button', '<motion.a', '<>']
# We need to be careful with closed tags like <div /> but these are rare in this codebase

for tag in tags:
    open_count = content.count(tag + ' ') + content.count(tag + '>') + content.count(tag + '\n')
    close_tag = tag.replace('<', '</') + '>'
    if tag == '<>': close_tag = '</>'
    close_count = content.count(close_tag)
    print(f"{tag}: {open_count} open, {close_count} closed. Diff: {open_count - close_count}")

# Check brackets
braces_open = content.count('{')
braces_close = content.count('}')
print(f"Braces: {braces_open} open, {braces_close} closed. Diff: {braces_open - braces_close}")

parens_open = content.count('(')
parens_close = content.count(')')
print(f"Parens: {parens_open} open, {parens_close} closed. Diff: {parens_open - parens_close}")
