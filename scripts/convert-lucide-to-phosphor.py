#!/usr/bin/env python3
"""
Batch convert lucide-react imports to @phosphor-icons/react/dist/ssr
in marketplace components, plus update icon JSX usage (add weight prop).

Icon mapping (lucide name → phosphor name + default weight):
"""
import re
import os
import sys
from pathlib import Path

ICON_MAP = {
    # Format: "lucide_name": ("phosphor_name", "default_weight")
    "Search": ("MagnifyingGlass", "regular"),
    "FileText": ("FileText", "regular"),
    "Users": ("Users", "regular"),
    "Briefcase": ("Briefcase", "regular"),
    "Plus": ("Plus", "regular"),
    "HelpCircle": ("Question", "regular"),
    "LogIn": ("SignIn", "regular"),
    "LogOut": ("SignOut", "regular"),
    "LayoutDashboard": ("SquaresFour", "regular"),
    "Shield": ("Shield", "regular"),
    "ArrowLeft": ("ArrowLeft", "regular"),
    "ArrowRight": ("ArrowRight", "regular"),
    "ArrowDown": ("ArrowDown", "regular"),
    "ArrowUp": ("ArrowUp", "regular"),
    "Menu": ("List", "regular"),
    "Scale": ("Scales", "regular"),
    "Mail": ("Envelope", "regular"),
    "Phone": ("Phone", "regular"),
    "MapPin": ("MapPin", "regular"),
    "Send": ("PaperPlaneTilt", "regular"),
    "Instagram": ("InstagramLogo", "regular"),
    "Facebook": ("FacebookLogo", "regular"),
    "Youtube": ("YoutubeLogo", "regular"),
    "Star": ("Star", "regular"),
    "ShieldCheck": ("ShieldCheck", "regular"),
    "Sparkles": ("Sparkle", "regular"),
    "BadgeCheck": ("SealCheck", "regular"),
    "Zap": ("Lightning", "regular"),
    "MessageSquare": ("ChatCircle", "regular"),
    "Download": ("DownloadSimple", "regular"),
    "Clock": ("Clock", "regular"),
    "Eye": ("Eye", "regular"),
    "Wallet": ("Wallet", "regular"),
    "Fire": ("Fire", "regular"),
    "Flame": ("Fire", "regular"),
    "Building2": ("BuildingOffice", "regular"),
    "User": ("User", "regular"),
    "CheckCircle2": ("CheckCircle", "regular"),
    "CheckCircle": ("CheckCircle", "regular"),
    "Check": ("Check", "regular"),
    "X": ("X", "regular"),
    "XIcon": ("X", "regular"),
    "ChevronLeft": ("CaretLeft", "regular"),
    "ChevronRight": ("CaretRight", "regular"),
    "ChevronDown": ("CaretDown", "regular"),
    "ChevronUp": ("CaretUp", "regular"),
    "TrendingUp": ("TrendUp", "regular"),
    "Activity": ("Activity", "regular"),
    "Paperclip": ("Paperclip", "regular"),
    "CheckCheck": ("Checks", "regular"),
    "Loader2": ("Spinner", "regular"),
    "AlertCircle": ("WarningCircle", "regular"),
    "Tag": ("Tag", "regular"),
    "Filter": ("Funnel", "regular"),
    "SlidersHorizontal": ("SlidersHorizontal", "regular"),
    "Quote": ("Quotes", "fill"),
    "Lock": ("Lock", "regular"),
    "Eye": ("Eye", "regular"),
    "EyeOff": ("EyeSlash", "regular"),
    "Copy": ("Copy", "regular"),
    "Edit": ("PencilSimple", "regular"),
    "Trash2": ("Trash", "regular"),
    "Trash": ("Trash", "regular"),
    "Settings": ("Gear", "regular"),
    "Bell": ("Bell", "regular"),
    "Calendar": ("Calendar", "regular"),
    "Clock": ("Clock", "regular"),
    "Save": ("FloppyDisk", "regular"),
    "Plus": ("Plus", "regular"),
    "Minus": ("Minus", "regular"),
    "Upload": ("UploadSimple", "regular"),
    "File": ("File", "regular"),
    "Folder": ("Folder", "regular"),
    "Image": ("Image", "regular"),
    "Link": ("Link", "regular"),
    "MoreVertical": ("DotsThreeVertical", "regular"),
    "MoreHorizontal": ("DotsThree", "regular"),
    "RefreshCw": ("ArrowClockwise", "regular"),
    "ExternalLink": ("ArrowUpRight", "regular"),
    "Home": ("House", "regular"),
    "Info": ("Info", "regular"),
    "Lock": ("Lock", "regular"),
    "Mail": ("Envelope", "regular"),
    "Phone": ("Phone", "regular"),
    "UserPlus": ("UserPlus", "regular"),
    "UserMinus": ("UserMinus", "regular"),
    "Users": ("Users", "regular"),
    "XCircle": ("XCircle", "regular"),
    "Pause": ("Pause", "regular"),
    "Play": ("Play", "regular"),
    "Volume2": ("SpeakerHigh", "regular"),
    "VolumeX": ("SpeakerSlash", "regular"),
    "Bookmark": ("Bookmark", "regular"),
    "Heart": ("Heart", "regular"),
    "Share2": ("ShareNetwork", "regular"),
    "ThumbsUp": ("ThumbsUp", "regular"),
    "ThumbsDown": ("ThumbsDown", "regular"),
    "ChevronsLeft": ("CaretDoubleLeft", "regular"),
    "ChevronsRight": ("CaretDoubleRight", "regular"),
    "ChevronsUp": ("CaretDoubleUp", "regular"),
    "ChevronsDown": ("CaretDoubleDown", "regular"),
    "CornerDownRight": ("ArrowBendDownRight", "regular"),
    "CornerUpRight": ("ArrowBendUpRight", "regular"),
    "Grid": ("GridFour", "regular"),
    "List": ("List", "regular"),
    "Maximize": ("ArrowsOutSimple", "regular"),
    "Minimize": ("ArrowsInSimple", "regular"),
    "Move": ("ArrowsOutCardinal", "regular"),
    "RotateCw": ("ArrowClockwise", "regular"),
    "RotateCcw": ("ArrowCounterClockwise", "regular"),
    "ZoomIn": ("MagnifyingGlassPlus", "regular"),
    "ZoomOut": ("MagnifyingGlassMinus", "regular"),
    "Gavel": ("Gavel", "regular"),
    "Scale": ("Scales", "regular"),
    "Languages": ("Translate", "regular"),
    "Award": ("Medal", "regular"),
    "Trophy": ("Trophy", "regular"),
    "FileCheck": ("FileCheck", "regular"),
    "FileCheck2": ("FileCheck", "regular"),
    "FilePlus": ("FilePlus", "regular"),
    "FilePlus2": ("FilePlus", "regular"),
    "FileSearch": ("FileSearch", "regular"),
    "FileX": ("FileX", "regular"),
    "FileX2": ("FileX", "regular"),
    "FileType": ("File", "regular"),
    "FolderPlus": ("FolderPlus", "regular"),
    "FolderOpen": ("FolderOpen", "regular"),
    "FolderMinus": ("FolderMinus", "regular"),
    "HardDrive": ("HardDrive", "regular"),
    "Cloud": ("Cloud", "regular"),
    "CloudUpload": ("CloudArrowUp", "regular"),
    "CloudDownload": ("CloudArrowDown", "regular"),
    "Database": ("Database", "regular"),
    "Server": ("Server", "regular"),
    "Terminal": ("TerminalWindow", "regular"),
    "Code": ("Code", "regular"),
    "GitBranch": ("GitBranch", "regular"),
    "GitCommit": ("GitCommit", "regular"),
    "GitMerge": ("GitMerge", "regular"),
    "GitPullRequest": ("GitPullRequest", "regular"),
    "Github": ("GithubLogo", "regular"),
    "Twitter": ("XLogo", "regular"),
    "Linkedin": ("LinkedinLogo", "regular"),
    "Slack": ("SlackLogo", "regular"),
    "Telegram": ("TelegramLogo", "regular"),
    "Whatsapp": ("WhatsappLogo", "regular"),
    "PhoneCall": ("PhoneCall", "regular"),
    "PhoneForwarded": ("PhoneForwarded", "regular"),
    "Voicemail": ("Voicemail", "regular"),
    "Printer": ("Printer", "regular"),
    "Camera": ("Camera", "regular"),
    "Video": ("VideoCamera", "regular"),
    "Mic": ("Microphone", "regular"),
    "Headphones": ("Headphones", "regular"),
    "Speaker": ("SpeakerHigh", "regular"),
    "Radio": ("Radio", "regular"),
    "Tv": ("Television", "regular"),
    "Film": ("FilmSlate", "regular"),
    "Music": ("MusicNote", "regular"),
    "Headphone": ("Headphones", "regular"),
    "Volume1": ("SpeakerLow", "regular"),
    "PlayCircle": ("PlayCircle", "regular"),
    "PauseCircle": ("PauseCircle", "regular"),
    "StopCircle": ("StopCircle", "regular"),
    "Rewind": ("Rewind", "regular"),
    "FastForward": ("FastForward", "regular"),
    "SkipBack": ("SkipBack", "regular"),
    "SkipForward": ("SkipForward", "regular"),
    "Shuffle": ("Shuffle", "regular"),
    "Repeat": ("Repeat", "regular"),
    "Repeat1": ("RepeatOnce", "regular"),
    "Volume": ("SpeakerHigh", "regular"),
    "MicOff": ("MicrophoneSlash", "regular"),
    "VideoOff": ("VideoCameraSlash", "regular"),
    "BellOff": ("BellSlash", "regular"),
    "EyeClosed": ("EyeClosed", "regular"),
    "LockOpen": ("LockOpen", "regular"),
    "Unlock": ("LockOpen", "regular"),
    "Key": ("Key", "regular"),
    "Keyhole": ("Keyhole", "regular"),
    "Fingerprint": ("Fingerprint", "regular"),
    "Passcode": ("Password", "regular"),
    "ShieldAlert": ("ShieldWarning", "regular"),
    "ShieldCheck": ("ShieldCheck", "regular"),
    "ShieldX": ("ShieldX", "regular"),
    "ShieldOff": ("ShieldSlash", "regular"),
    "ShieldQuestion": ("ShieldQuestion", "regular"),
    "ShieldHalf": ("ShieldStar", "regular"),
    "Car": ("Car", "regular"),
    "Plane": ("Airplane", "regular"),
    "Train": ("Train", "regular"),
    "Bus": ("Bus", "regular"),
    "Bike": ("Bicycle", "regular"),
    "Boat": ("Boat", "regular"),
    "Rocket": ("Rocket", "regular"),
    "Fuel": ("GasPump", "regular"),
    "Zap": ("Lightning", "regular"),
    "Battery": ("Battery", "regular"),
    "BatteryCharging": ("BatteryCharging", "regular"),
    "BatteryFull": ("BatteryFull", "regular"),
    "BatteryLow": ("BatteryLow", "regular"),
    "BatteryMedium": ("BatteryMedium", "regular"),
    "BatteryWarning": ("BatteryWarning", "regular"),
    "Plug": ("Plug", "regular"),
    "Power": ("Power", "regular"),
    "Sun": ("Sun", "regular"),
    "Moon": ("Moon", "regular"),
    "CloudSun": ("CloudSun", "regular"),
    "CloudMoon": ("CloudMoon", "regular"),
    "CloudRain": ("CloudRain", "regular"),
    "CloudSnow": ("CloudSnow", "regular"),
    "CloudFog": ("CloudFog", "regular"),
    "CloudLightning": ("CloudLightning", "regular"),
    "CloudDrizzle": ("CloudDrizzle", "regular"),
    "CloudHail": ("CloudHail", "regular"),
    "CloudMoon": ("CloudMoon", "regular"),
    "CloudSun": ("CloudSun", "regular"),
    "Wind": ("Wind", "regular"),
    "Umbrella": ("Umbrella", "regular"),
    "Snowflake": ("Snowflake", "regular"),
    "Thermometer": ("Thermometer", "regular"),
    "ThermometerSun": ("ThermometerSun", "regular"),
    "ThermometerSnow": ("ThermometerSnow", "regular"),
    "Droplet": ("Drop", "regular"),
    "Droplets": ("Drops", "regular"),
    "Waves": ("Waveform", "regular"),
    "Anchor": ("Anchor", "regular"),
    "Compass": ("Compass", "regular"),
    "Map": ("Map", "regular"),
    "Navigation": ("NavigationArrow", "regular"),
    "Mountain": ("Mountains", "regular"),
    "Trees": ("Trees", "regular"),
    "Flower": ("Flower", "regular"),
    "Leaf": ("Leaf", "regular"),
    "Sprout": ("Plant", "regular"),
    "Feather": ("Feather", "regular"),
    "Bird": ("Bird", "regular"),
    "Fish": ("Fish", "regular"),
    "Bug": ("Bug", "regular"),
    "Dog": ("Dog", "regular"),
    "Cat": ("Cat", "regular"),
    "Rabbit": ("Rabbit", "regular"),
    "Mouse": ("Mouse", "regular"),
    "Horse": ("Horse", "regular"),
    "Squirrel": ("Squirrel", "regular"),
    "Turtle": ("Turtle", "regular"),
    "Snail": ("Snail", "regular"),
    "Bee": ("Bee", "regular"),
    "Butterfly": ("Butterfly", "regular"),
    "Ant": ("Ant", "regular"),
    "Spider": ("Spider", "regular"),
    "PawPrint": ("PawPrint", "regular"),
    "Egg": ("Egg", "regular"),
    "Bone": ("Bone", "regular"),
    # Additional missing mappings from the run
    "Globe": ("Globe", "regular"),
    "GraduationCap": ("GraduationCap", "regular"),
    "BookOpen": ("BookOpen", "regular"),
    "Receipt": ("Receipt", "regular"),
    "Lightbulb": ("Lightbulb", "regular"),
    "FileSignature": ("FileText", "regular"),
    "Stamp": ("Stamp", "regular"),
    "UserCheck": ("UserCheck", "regular"),
    "Inbox": ("Inbox", "regular"),
}

# Default weights for icons that look better with a specific weight
WEIGHT_OVERRIDES = {
    "Sparkle": "fill",
    "Star": "fill",
    "SealCheck": "fill",
    "ShieldCheck": "regular",
    "Check": "bold",
    "CheckCircle": "regular",
    "Plus": "bold",
    "Lightning": "fill",
    "Fire": "fill",
    "ArrowRight": "bold",
    "ArrowLeft": "regular",
    "Quotes": "fill",
    "Spinner": "regular",
    "Scales": "duotone",
}

def convert_file(filepath: Path) -> bool:
    """Convert a single file. Returns True if file was modified."""
    content = filepath.read_text(encoding="utf-8")

    # Skip if no lucide imports
    if 'from "lucide-react"' not in content:
        return False

    # 1. Find all lucide imports
    import_match = re.search(r'import\s*\{([^}]+)\}\s*from\s*"lucide-react"', content)
    if not import_match:
        return False

    imported_icons = [name.strip() for name in import_match.group(1).split(",")]

    # Map each imported icon to its phosphor equivalent
    phosphor_imports = []
    icon_aliases = {}  # lucide_name -> phosphor_name (could be duplicates)
    missing = []

    for icon in imported_icons:
        # Handle 'X as Y' aliases
        if " as " in icon:
            old_name, alias = [s.strip() for s in icon.split(" as ")]
            mapping = ICON_MAP.get(old_name)
            if mapping:
                phosphor_name, _ = mapping
                # If phosphor name differs from alias, we need to alias
                if phosphor_name != alias:
                    icon_aliases[alias] = phosphor_name
                # Add to imports (dedupe later)
                phosphor_imports.append(phosphor_name)
            else:
                missing.append(icon)
        else:
            mapping = ICON_MAP.get(icon)
            if mapping:
                phosphor_name, _ = mapping
                if phosphor_name != icon:
                    icon_aliases[icon] = phosphor_name
                phosphor_imports.append(phosphor_name)
            else:
                missing.append(icon)
                # Keep original name as fallback
                phosphor_imports.append(icon)

    # Dedupe phosphor imports while preserving order
    seen = set()
    unique_phosphor = []
    for name in phosphor_imports:
        if name not in seen:
            seen.add(name)
            unique_phosphor.append(name)

    # Build new import line
    new_import = f'import {{\n  {",\n  ".join(sorted(unique_phosphor))},\n}} from "@phosphor-icons/react/dist/ssr";'

    # If we have aliases, we need to rename usage in JSX too
    # e.g., if lucide imported "Search" and we alias to "MagnifyingGlass",
    # we need to replace <Search with <MagnifyingGlass in JSX

    # Replace import statement
    content = content[:import_match.start()] + new_import + content[import_match.end():]

    # Replace JSX usage of aliased icons
    # Match <IconName or </IconName or IconName as JSX
    for old_name, new_name in icon_aliases.items():
        # Replace opening tags: <IconName or <IconName.something
        content = re.sub(
            rf'<{re.escape(old_name)}(?=[\s/>.])',
            f'<{new_name}',
            content
        )
        # Replace closing tags: </IconName>
        content = re.sub(
            rf'</{re.escape(old_name)}>',
            f'</{new_name}>',
            content
        )
        # Replace references: {IconName} or icon={IconName}
        # Use string concatenation to avoid f-string brace issues
        pattern = r'\b' + re.escape(old_name) + r'\b(?=\s*[},)])'
        content = re.sub(pattern, new_name, content)
        # Replace: icon={<OldName ... />} → icon={<NewName ... />}
        # Already handled by opening tag replacement

    # Add weight prop to Phosphor icons in JSX if not already present
    # This is a heuristic — finds <IconName ... /> or <IconName ...>...</IconName>
    # and adds weight="regular" if no weight is present
    for phosphor_name in unique_phosphor:
        if phosphor_name in missing:
            continue
        weight = WEIGHT_OVERRIDES.get(phosphor_name, "regular")

        # Pattern: <IconName followed by space or >, but not containing weight=
        # This is tricky — let's just add weight to all instances that don't have it
        # We'll match <IconName ... /> and check if weight= is in the attributes
        def add_weight(match):
            full = match.group(0)
            if 'weight=' in full:
                return full
            # Add weight right after the tag name
            return full.replace(f'<{phosphor_name}', f'<{phosphor_name} weight="{weight}"', 1)

        # Match opening tag with attributes
        content = re.sub(
            rf'<{re.escape(phosphor_name)}(?=\s|>|/)',
            add_weight,
            content
        )

    # Handle className h-X w-X → size-X (lucide uses h-4 w-4, phosphor uses size-4)
    # This is a common pattern but we'll be conservative — only convert
    # patterns like className="h-4 w-4" or className="h-4 w-4 ..."
    # Actually, leave this alone — Tailwind's h-4 w-4 still works

    filepath.write_text(content, encoding="utf-8")

    if missing:
        print(f"  ⚠️  {filepath.name}: missing mappings for {missing}")

    return True


def main():
    # Files to process
    files = [
        "src/components/marketplace/advocate-detail-modal.tsx",
        "src/components/marketplace/document-listing.tsx",
        "src/components/marketplace/document-detail-modal.tsx",
        "src/components/marketplace/requests-page.tsx",
        "src/components/marketplace/advocate-listing.tsx",
        "src/components/marketplace/how-it-works-page.tsx",
        "src/components/marketplace/for-advocates-page.tsx",
        "src/components/marketplace/dynamic-icon.tsx",
        "src/components/auth/auth-modal.tsx",
        "src/components/chat/chat-panel.tsx",
        "src/components/admin/admin-panel.tsx",
        "src/components/advocate/advocate-dashboard.tsx",
        "src/components/editor/document-editor.tsx",
        "src/components/dashboard/dashboard.tsx",
    ]

    project_root = Path("/home/z/my-project")
    converted = 0
    for rel_path in files:
        full_path = project_root / rel_path
        if not full_path.exists():
            print(f"  ✗  {rel_path}: file not found")
            continue
        try:
            if convert_file(full_path):
                converted += 1
                print(f"  ✓  {rel_path}")
            else:
                print(f"  -  {rel_path} (no lucide imports)")
        except Exception as e:
            print(f"  ✗  {rel_path}: {e}")

    print(f"\n{converted} files converted")


if __name__ == "__main__":
    main()
