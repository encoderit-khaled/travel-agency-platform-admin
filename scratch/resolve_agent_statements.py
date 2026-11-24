import re

with open('figma-cache/B2B agent portal.yaml', 'r') as f:
    text = f.read()

# Collect templates
templates = {}
for match in re.finditer(r'^(EL-[a-zA-Z0-9_-]+):', text, re.MULTILINE):
    name = match.group(1)
    start = match.end()
    next_m = re.search(r'^(EL-[a-zA-Z0-9_-]+):', text[start:], re.MULTILINE)
    end = start + next_m.start() if next_m else len(text)
    templates[name] = text[start:end]

def get_template_info(t_name):
    content = templates.get(t_name, '')
    info = {}
    t_match = re.search(r'text:\s*(.+)', content)
    if t_match:
        val = t_match.group(1).strip()
        if (val.startswith("'") and val.endswith("'")) or (val.startswith('"') and val.endswith('"')):
            val = val[1:-1]
        info['text'] = val
    f_match = re.search(r'fills:\s*(.+)', content)
    if f_match:
        info['fills'] = f_match.group(1).strip()
    return info

lines = text.splitlines()

with open('scratch/agent_statements_resolved.txt', 'w') as out:
    for idx in range(23008, 23890):
        line = lines[idx]
        indent = len(line) - len(line.lstrip())
        prefix = ' ' * indent
        
        # Check direct text
        t_match = re.search(r'text="([^"]+)"', line)
        
        # Check template
        tpl_match = re.search(r'template=(EL-[a-zA-Z0-9_-]+)', line)
        
        tag_match = re.search(r'\[([A-Z-]+)\](?:\s+"([^"]+)")?', line)
        tag = tag_match.group(1) if tag_match else ''
        name = tag_match.group(2) if tag_match and tag_match.group(2) else ''
        node_id_match = re.search(r'(#\d+:\d+)', line)
        node_id = node_id_match.group(1) if node_id_match else ''
        
        details = []
        if t_match:
            details.append(f'TEXT: "{t_match.group(1)}"')
        
        if tpl_match:
            tpl_id = tpl_match.group(1)
            t_info = get_template_info(tpl_id)
            if 'text' in t_info:
                details.append(f'TPL_TEXT: "{t_info["text"]}"')
            if 'fills' in t_info:
                details.append(f'TPL_FILLS: {t_info["fills"]}')
            details.append(f'({tpl_id})')
            
        out.write(f'{idx+1}:{prefix}[{tag}] "{name}" {node_id} {" ".join(details)}\n')
        if 'layout=' in line:
            l_match = re.search(r'layout=({[^}]+}|\S+)', line)
            if l_match:
                out.write(f'{idx+1}:{prefix}  -> layout: {l_match.group(1)}\n')
        if 'fills=' in line:
            fills_match = re.search(r'fills=([^\s]+|"[^"]+")', line)
            if fills_match:
                out.write(f'{idx+1}:{prefix}  -> fills: {fills_match.group(1)}\n')

print('Wrote scratch/agent_statements_resolved.txt successfully')
