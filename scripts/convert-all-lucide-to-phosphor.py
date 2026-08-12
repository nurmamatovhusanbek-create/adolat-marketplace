#!/usr/bin/env python3
"""
Batch convert lucide-react imports to @phosphor-icons/react/dist/ssr
across all .tsx files in src/components/ and src/hooks/.

Handles:
- Import statement replacement
- Icon name mapping (lucide → Phosphor)
- JSX usage replacement (opening tags, closing tags, references)
- Adds weight="regular" to Phosphor icons that don't have a weight prop
"""
import re
import os
from pathlib import Path

# Complete icon mapping: lucide name → (phosphor name, default_weight)
ICON_MAP = {
    # UI primitive icons (with Icon suffix)
    "CheckIcon": ("Check", "bold"),
    "ChevronDownIcon": ("CaretDown", "regular"),
    "ChevronRightIcon": ("CaretRight", "regular"),
    "ChevronLeftIcon": ("CaretLeft", "regular"),
    "ChevronUpIcon": ("CaretUp", "regular"),
    "CircleIcon": ("Circle", "regular"),
    "GripVerticalIcon": ("DotsSixVertical", "regular"),
    "MinusIcon": ("Minus", "regular"),
    "PanelLeftIcon": ("SquareHalfLeft", "regular"),
    "SearchIcon": ("MagnifyingGlass", "regular"),
    "XIcon": ("X", "regular"),
    # Non-ui icons
    "AlertCircle": ("WarningCircle", "regular"),
    "ArrowRight": ("ArrowRight", "regular"),
    "ArrowLeft": ("ArrowLeft", "regular"),
    "ArrowDown": ("ArrowDown", "regular"),
    "ArrowUp": ("ArrowUp", "regular"),
    "Briefcase": ("Briefcase", "regular"),
    "Clock": ("Clock", "regular"),
    "Download": ("DownloadSimple", "regular"),
    "Facebook": ("FacebookLogo", "regular"),
    "FileText": ("FileText", "regular"),
    "Instagram": ("InstagramLogo", "regular"),
    "Loader2": ("Spinner", "regular"),
    "Lock": ("Lock", "regular"),
    "Mail": ("Envelope", "regular"),
    "MapPin": ("MapPin", "regular"),
    "Phone": ("Phone", "regular"),
    "Scale": ("Scales", "regular"),
    "Send": ("PaperPlaneTilt", "regular"),
    "ShieldCheck": ("ShieldCheck", "regular"),
    "Sparkles": ("Sparkle", "fill"),
    "Star": ("Star", "fill"),
    "Tag": ("Tag", "regular"),
    "User": ("User", "regular"),
    "Youtube": ("YoutubeLogo", "regular"),
    "Plus": ("Plus", "regular"),
    "Minus": ("Minus", "regular"),
    "Check": ("Check", "bold"),
    "X": ("X", "regular"),
    "Search": ("MagnifyingGlass", "regular"),
    "Menu": ("List", "regular"),
    "Users": ("Users", "regular"),
    "Shield": ("Shield", "regular"),
    "HelpCircle": ("Question", "regular"),
    "LogIn": ("SignIn", "regular"),
    "LogOut": ("SignOut", "regular"),
    "LayoutDashboard": ("SquaresFour", "regular"),
    "Eye": ("Eye", "regular"),
    "EyeOff": ("EyeSlash", "regular"),
    "Settings": ("Gear", "regular"),
    "Bell": ("Bell", "regular"),
    "Calendar": ("Calendar", "regular"),
    "Trash2": ("Trash", "regular"),
    "Edit": ("PencilSimple", "regular"),
    "Copy": ("Copy", "regular"),
    "ExternalLink": ("ArrowUpRight", "regular"),
    "RefreshCw": ("ArrowClockwise", "regular"),
    "MoreVertical": ("DotsThreeVertical", "regular"),
    "MoreHorizontal": ("DotsThree", "regular"),
    "ChevronDown": ("CaretDown", "regular"),
    "ChevronRight": ("CaretRight", "regular"),
    "ChevronLeft": ("CaretLeft", "regular"),
    "ChevronUp": ("CaretUp", "regular"),
    "Filter": ("Funnel", "regular"),
    "SlidersHorizontal": ("SlidersHorizontal", "regular"),
    "Zap": ("Lightning", "fill"),
    "CheckCircle2": ("CheckCircle", "regular"),
    "CheckCircle": ("CheckCircle", "regular"),
    "XCircle": ("XCircle", "regular"),
    "AlertTriangle": ("Warning", "regular"),
    "Info": ("Info", "regular"),
    "Home": ("House", "regular"),
    "File": ("File", "regular"),
    "Folder": ("Folder", "regular"),
    "Image": ("Image", "regular"),
    "Link": ("Link", "regular"),
    "Save": ("FloppyDisk", "regular"),
    "Upload": ("UploadSimple", "regular"),
    "Heart": ("Heart", "regular"),
    "Bookmark": ("Bookmark", "regular"),
    "Share2": ("ShareNetwork", "regular"),
    "Globe": ("Globe", "regular"),
    "TrendingUp": ("TrendUp", "regular"),
    "TrendingDown": ("TrendDown", "regular"),
    "Activity": ("Pulse", "regular"),
    "Wallet": ("Wallet", "regular"),
    "Fire": ("Fire", "fill"),
    "Flame": ("Fire", "fill"),
    "Building2": ("BuildingOffice", "regular"),
    "Building": ("BuildingOffice", "regular"),
    "Gavel": ("Gavel", "regular"),
    "Receipt": ("Receipt", "regular"),
    "Lightbulb": ("Lightbulb", "regular"),
    "Stamp": ("Stamp", "regular"),
    "UserCheck": ("UserCheck", "regular"),
    "Inbox": ("Tray", "regular"),
    "Paperclip": ("Paperclip", "regular"),
    "CheckCheck": ("Checks", "regular"),
    "Pause": ("Pause", "regular"),
    "Play": ("Play", "regular"),
    "Volume2": ("SpeakerHigh", "regular"),
    "VolumeX": ("SpeakerSlash", "regular"),
    "Maximize": ("ArrowsOutSimple", "regular"),
    "Minimize": ("ArrowsInSimple", "regular"),
    "RotateCw": ("ArrowClockwise", "regular"),
    "RotateCcw": ("ArrowCounterClockwise", "regular"),
    "ZoomIn": ("MagnifyingGlassPlus", "regular"),
    "ZoomOut": ("MagnifyingGlassMinus", "regular"),
    "Grid3x3": ("GridFour", "regular"),
    "Grid": ("GridFour", "regular"),
    "LayoutGrid": ("SquaresFour", "regular"),
    "Layers": ("Stack", "regular"),
    "Factory": ("Factory", "regular"),
    "Megaphone": ("Megaphone", "regular"),
    "Tags": ("Tag", "regular"),
    "Trophy": ("Trophy", "regular"),
    "Award": ("Medal", "regular"),
    "Link2": ("Link", "regular"),
    "Sun": ("Sun", "regular"),
    "Moon": ("Moon", "regular"),
    "ArrowLeftRight": ("ArrowsLeftRight", "regular"),
    "Wallet": ("Wallet", "regular"),
    "BarChart3": ("ChartBar", "regular"),
    "Download": ("DownloadSimple", "regular"),
    "MinusCircle": ("MinusCircle", "regular"),
    "Copy": ("Copy", "regular"),
    "CalendarDays": ("Calendar", "regular"),
    "CheckCheck": ("Checks", "regular"),
    "ArrowUpRight": ("ArrowUpRight", "regular"),
}

# Default weights for specific icons
WEIGHT_OVERRIDES = {
    "Sparkle": "fill",
    "Star": "fill",
    "Lightning": "fill",
    "Fire": "fill",
    "Check": "bold",
    "SealCheck": "fill",
}

def convert_file(filepath: Path) -> bool:
    content = filepath.read_text(encoding="utf-8")
    if 'from "lucide-react"' not in content:
        return False

    # Find the import statement
    import_match = re.search(r'import\s*\{([^}]+)\}\s*from\s*"lucide-react"', content)
    if not import_match:
        return False

    imported_icons = [name.strip() for name in import_match.group(1).split(",")]

    phosphor_imports = []
    icon_aliases = {}  # old_name -> new_name
    missing = []

    for icon in imported_icons:
        icon = icon.strip()
        if not icon:
            continue
        # Handle "X as Y" aliases
        if " as " in icon:
            old_name, alias = [s.strip() for s in icon.split(" as ")]
            mapping = ICON_MAP.get(old_name)
            if mapping:
                phosphor_name, _ = mapping
                if phosphor_name != alias:
                    icon_aliases[alias] = phosphor_name
                phosphor_imports.append(phosphor_name)
            else:
                missing.append(icon)
                phosphor_imports.append(old_name)  # keep as-is
        else:
            mapping = ICON_MAP.get(icon)
            if mapping:
                phosphor_name, _ = mapping
                if phosphor_name != icon:
                    icon_aliases[icon] = phosphor_name
                phosphor_imports.append(phosphor_name)
            else:
                missing.append(icon)
                phosphor_imports.append(icon)  # keep as-is

    # Dedupe
    seen = set()
    unique_phosphor = []
    for name in phosphor_imports:
        if name not in seen:
            seen.add(name)
            unique_phosphor.append(name)

    # Build new import line
    if len(unique_phosphor) <= 3:
        new_import = f'import {{ {", ".join(unique_phosphor)} }} from "@phosphor-icons/react/dist/ssr";'
    else:
        new_import = 'import {\n  ' + ',\n  '.join(sorted(unique_phosphor)) + ',\n} from "@phosphor-icons/react/dist/ssr";'

    # Replace import statement
    content = content[:import_match.start()] + new_import + content[import_match.end():]

    # Replace JSX usages
    for old_name, new_name in icon_aliases.items():
        # Opening tags: <OldName or <OldName.something
        content = re.sub(r'<' + re.escape(old_name) + r'(?=[\s/>.])', f'<{new_name}', content)
        # Closing tags: </OldName>
        content = re.sub(r'</' + re.escape(old_name) + r'>', f'</{new_name}>', content)
        # References in props: icon={OldName} or {OldName}
        content = re.sub(r'\b' + re.escape(old_name) + r'\b(?=\s*[},)])', new_name, content)

    # Add weight prop to Phosphor icons that don't have one
    for phosphor_name in unique_phosphor:
        if phosphor_name in missing:
            continue
        weight = WEIGHT_OVERRIDES.get(phosphor_name, "regular")

        def add_weight(match):
            full = match.group(0)
            if 'weight=' in full:
                return full
            return full.replace(f'<{phosphor_name}', f'<{phosphor_name} weight="{weight}"', 1)

        content = re.sub(
            r'<' + re.escape(phosphor_name) + r'(?=[\s>|/])',
            add_weight,
            content
        )

    filepath.write_text(content, encoding="utf-8")

    if missing:
        print(f"  ⚠️  {filepath.name}: missing mappings for {missing}")
    return True


def main():
    project_root = Path("/home/z/my-project")
    # Find all .tsx files that import from lucide-react
    files = []
    for root, dirs, filenames in os.walk(project_root / "src"):
        for f in filenames:
            if f.endswith(".tsx") or f.endswith(".ts"):
                filepath = Path(root) / f
                content = filepath.read_text(encoding="utf-8")
                if 'from "lucide-react"' in content:
                    files.append(filepath)

    print(f"Found {len(files)} files with lucide-react imports")
    converted = 0
    for f in sorted(files):
        try:
            if convert_file(f):
                converted += 1
                print(f"  ✓  {f.relative_to(project_root)}")
        except Exception as e:
            print(f"  ✗  {f}: {e}")

    print(f"\n{converted} files converted")


if __name__ == "__main__":
    main()
