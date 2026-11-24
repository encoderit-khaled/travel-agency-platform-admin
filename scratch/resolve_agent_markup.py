import re

with open("figma-cache/B2B agent portal.yaml", "r") as f:
    text = f.read()

templates = {}
for match in re.finditer(r"^(EL-[a-zA-Z0-9_-]+):", text, re.MULTILINE):
    name = match.group(1)
    start = match.end()
    next_m = re.search(r"^(EL-[a-zA-Z0-9_-]+):", text[start:], re.MULTILINE)
    end = start + next_m.start() if next_m else len(text)
    templates[name] = text[start:end]

def get_text_from_template(t_name):
    content = templates.get(t_name, "")
    t_match = re.search(r"text:\s*(.+)", content)
    if t_match:
        val = t_match.group(1).strip()
        if (val.startswith("'") and val.endswith("'")) or (val.startswith('"') and val.endswith('"')):
            val = val[1:-1]
        return val
    return None

test_templates = [
    "EL-4180c4a3", "EL-24654020", "EL-9192d1f4", "EL-e95943f4",
    "EL-f335631f", "EL-0f91364b", "EL-028b778d", "EL-b0f1a06b",
    "EL-2811e7df", "EL-47fd5523", "EL-4d579255", "EL-bf3706d3", "EL-e7176502", "EL-92321688",
    "EL-1472cd12", "EL-93d543dc", "EL-44b34f1e", "EL-83c4fdf7", "EL-dd0042e0",
    "EL-944c8723", "EL-dcd43a44", "EL-25a16843", "EL-4a9ab66a", "EL-8340f657"
]

for t in test_templates:
    print(f"{t} ==> {get_text_from_template(t)}")
