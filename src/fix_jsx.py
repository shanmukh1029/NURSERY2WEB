import re

file_path = '/Users/shanmukhpatamsetti/Desktop/plant ecommercial/leafora-react/src/App.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix stroke-width to strokeWidth
content = content.replace('stroke-width', 'strokeWidth')

# Fix string styles to object styles
content = content.replace('style="margin-top: 30px;"', 'style={{ marginTop: "30px" }}')
content = content.replace('style="background:#4a8c3f;"', 'style={{ background: "#4a8c3f" }}')
content = content.replace('style="background:rgba(255,255,255,0.3);"', 'style={{ background: "rgba(255,255,255,0.3)" }}')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixes applied.")
