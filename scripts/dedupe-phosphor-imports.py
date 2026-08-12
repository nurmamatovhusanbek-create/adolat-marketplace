#!/usr/bin/env python3
"""Deduplicate Phosphor icon imports in tsx files."""
import re
from pathlib import Path

def dedupe_imports(filepath: Path) -> bool:
    content = filepath.read_text(encoding="utf-8")

    # Match: import {\n  Name,\n  Name,\n  ...\n} from "@phosphor-icons/react/dist/ssr";
    pattern = r'import\s*\{([^}]+)\}\s*from\s*"@phosphor-icons/react/dist/ssr";'

    def dedupe(match):
        names_block = match.group(1)
        names = [n.strip() for n in names_block.split(",") if n.strip()]
        # Dedupe while preserving order
        seen = set()
        unique = []
        for n in names:
            # Handle "Name as Alias"
            base = n.split(" as ")[0].strip()
            if base not in seen:
                seen.add(base)
                unique.append(n)
        # Format as multi-line import
        if len(unique) <= 3:
            return f'import {{ {", ".join(unique)} }} from "@phosphor-icons/react/dist/ssr";'
        return 'import {\n  ' + ',\n  '.join(unique) + ',\n} from "@phosphor-icons/react/dist/ssr";'

    new_content = re.sub(pattern, dedupe, content)

    if new_content != content:
        filepath.write_text(new_content, encoding="utf-8")
        return True
    return False


import subprocess
files = subprocess.run(
    ["grep", "-rl", "@phosphor-icons/react/dist/ssr", "src/components/"],
    capture_output=True, text=True, cwd="/home/z/my-project"
).stdout.strip().split("\n")

for f in files:
    if f:
        p = Path("/home/z/my-project") / f
        if dedupe_imports(p):
            print(f"  ✓  {f}")
