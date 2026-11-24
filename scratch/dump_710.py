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

def get_template_text(t_name):
    content = templates.get(t_name, "")
    t_match = re.search(r"text:\s*(.+)", content)
    if t_match:
        val = t_match.group(1).strip()
        if (val.startswith("'") and val.endswith("'")) or (val.startswith('"') and val.endswith('"')):
            val = val[1:-1]
        return val
    return None

lines = text.splitlines()

with open("scratch/resolved_710_21270.txt", "w") as out:
    for idx in range(19122, 19714):
        line = lines[idx]
        indent = len(line) - len(line.lstrip())
        prefix = " " * indent
        
        # Check if text is direct
        t_match = re.search(r'text="([^"]+)"', line)
        if t_match:
            out.write(f"{idx+1}:{prefix}[TEXT] {t_match.group(1)}\n")
            continue
        
        # Check template
        tpl_match = re.search(r'template=(EL-[a-zA-Z0-9_-]+)', line)
        if tpl_match:
            tpl_id = tpl_match.group(1)
            tpl_txt = get_template_text(tpl_id)
            tag_match = re.search(r'\[([A-Z-]+)\](?:\s+"([^"]+)")?', line)
            tag = tag_match.group(1) if tag_match else ""
            name = tag_match.group(2) if tag_match and tag_match.group(2) else ""
            if tpl_txt:
                out.write(f"{idx+1}:{prefix}[{tag}] {name} => TEXT: '{tpl_txt}'\n")
            else:
                out.write(f"{idx+1}:{prefix}[{tag}] {name} ({tpl_id})\n")
            continue
            
        tag_match = re.search(r'\[([A-Z-]+)\](?:\s+"([^"]+)")?', line)
        if tag_match:
            tag = tag_match.group(1)
            name = tag_match.group(2) if tag_match.group(2) else ""
            out.write(f"{idx+1}:{prefix}[{tag}] {name}\n")
