with open("figma-cache/Admin panel core.yaml", "r") as f:
    lines = f.readlines()

def print_frame(start_id, stop_id=None):
    recording = False
    frame_lines = []
    for line in lines:
        if f"- id: {start_id}" in line:
            recording = True
        elif recording and stop_id and f"- id: {stop_id}" in line:
            break
        elif recording and line.startswith("      - id:"):
            # Next top-level frame
            if not f"- id: {start_id}" in line:
                break
        if recording:
            frame_lines.append(line)
    return "".join(frame_lines)

open("scratch/frame_1015_7243.yaml", "w").write(print_frame("1015:7243"))
open("scratch/frame_1015_7534.yaml", "w").write(print_frame("1015:7534"))
open("scratch/frame_1015_7533.yaml", "w").write(print_frame("1015:7533"))
open("scratch/frame_1015_7535.yaml", "w").write(print_frame("1015:7535"))
open("scratch/frame_1015_7536.yaml", "w").write(print_frame("1015:7536"))
open("scratch/frame_1022_7537.yaml", "w").write(print_frame("1022:7537"))
print("Wrote frames successfully")
