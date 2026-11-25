import re

with open("figma-cache/Admin panel core.yaml", "r") as f:
    full_text = f.read()

# Load all templates
templates = {}
# templates section starts after nodes:
for match in re.finditer(r"^  (EL-[a-zA-Z0-9_-]+):", full_text, re.MULTILINE):
    name = match.group(1).strip()
    start = match.end()
    next_m = re.search(r"^  (EL-[a-zA-Z0-9_-]+):", full_text[start:], re.MULTILINE)
    end = start + next_m.start() if next_m else len(full_text)
    templates[name] = full_text[start:end]

lines = full_text.splitlines()

start_idx = None
end_idx = None
for i, line in enumerate(lines):
    if "id: 984:976" in line:
        start_idx = i
        break

for i in range(start_idx + 1, len(lines)):
    if re.match(r"^      - id:", lines[i]):
        end_idx = i
        break
if not end_idx:
    end_idx = len(lines)

node_text = "\n".join(lines[start_idx:end_idx])

with open("scratch/admin_roles_raw.txt", "w") as f:
    f.write(node_text)

print(f"Written scratch/admin_roles_raw.txt ({len(lines[start_idx:end_idx])} lines)")

# Let's inspect all texts in node_text and templates referenced
used_templates = set(re.findall(r"EL-[a-zA-Z0-9_-]+", node_text))
print(f"Used templates count: {len(used_templates)}")

# Check template texts
def get_template_info(t_name):
    content = templates.get(t_name, "")
    t_match = re.search(r"text:\s*(.+)", content)
    text_val = None
    if t_match:
        text_val = t_match.group(1).strip()
        if (text_val.startswith("'") and text_val.endswith("'")) or (text_val.startswith('"') and text_val.endswith('"')):
            text_val = text_val[1:-1]
    name_match = re.search(r"name:\s*(.+)", content)
    type_match = re.search(r"type:\s*(.+)", content)
    return text_val, name_match.group(1) if name_match else None, type_match.group(1) if type_match else None

# Let's do a recursive / structured dump of node 984:976
# Each line has indentation
output_lines = []
for line in lines[start_idx:end_idx]:
    indent = len(line) - len(line.lstrip())
    t_m = re.search(r"template:\s*(EL-[a-zA-Z0-9_-]+)", line)
    id_m = re.search(r"id:\s*([0-9:]+)", line)
    name_m = re.search(r"name:\s*(.+)", line)
    text_m = re.search(r"text:\s*(.+)", line)
    
    extra = []
    if id_m:
        extra.append(f"id={id_m.group(1)}")
    if name_m:
        extra.append(f"name='{name_m.group(1)}'")
    if text_m:
        extra.append(f"text='{text_m.group(1)}'")
    if t_m:
        t_name = t_m.group(1)
        t_text, t_node_name, t_type = get_template_info(t_name)
        extra.append(f"tpl={t_name}")
        if t_type:
            extra.append(f"type={t_type}")
        if t_node_name:
            extra.append(f"tpl_name='{t_node_name}'")
        if t_text:
            extra.append(f"tpl_text='{t_text}'")
            
    output_lines.append(" " * indent + " ".join(extra))

with open("scratch/admin_roles_resolved.txt", "w") as f:
    f.write("\n".join(output_lines))

print("Written scratch/admin_roles_resolved.txt")
