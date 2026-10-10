from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import subprocess
import sys

ROOT = Path(__file__).resolve().parent.parent


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.references = []
        self.ids = []
        self.metadata = set()
        self.inline_scripts = []
        self.current_script = None

    def handle_starttag(self, tag, attributes):
        values = dict(attributes)
        if "id" in values:
            self.ids.append(values["id"])
        for attribute in ("src", "href"):
            if attribute in values:
                self.references.append(values[attribute])
        if tag == "meta":
            self.metadata.add(values.get("name") or values.get("property"))
        if tag == "script" and "src" not in values:
            self.current_script = []

    def handle_data(self, data):
        if self.current_script is not None:
            self.current_script.append(data)

    def handle_endtag(self, tag):
        if tag == "script" and self.current_script is not None:
            self.inline_scripts.append("".join(self.current_script))
            self.current_script = None


paths = [ROOT / "index.html", *sorted((ROOT / "guide" / "pages").rglob("*.html"))]
pages = {}
errors = []
for path in paths:
    page = Page()
    page.feed(path.read_text())
    pages[path] = page
    if len(page.ids) != len(set(page.ids)):
        errors.append(f"{path.relative_to(ROOT)}: duplicate id")
    if not {"description", "og:title", "og:image", "twitter:card"} <= page.metadata:
        errors.append(f"{path.relative_to(ROOT)}: missing page metadata")
    if "</br>" in path.read_text():
        errors.append(f"{path.relative_to(ROOT)}: invalid closing br tag")
    for script in page.inline_scripts:
        if script.strip():
            result = subprocess.run(["node", "--check"], input=script, text=True, capture_output=True)
            if result.returncode:
                errors.append(f"{path.relative_to(ROOT)}: {result.stderr}")

for path, page in pages.items():
    for reference in page.references:
        parts = urlsplit(reference)
        if parts.scheme or parts.netloc:
            continue
        target = (path.parent / unquote(parts.path)).resolve() if parts.path else path
        if not target.is_relative_to(ROOT) or not target.exists():
            errors.append(f"{path.relative_to(ROOT)}: missing reference {reference}")
        elif parts.fragment and target in pages and unquote(parts.fragment) not in pages[target].ids:
            errors.append(f"{path.relative_to(ROOT)}: missing anchor {reference}")

scripts = [*sorted((ROOT / "scripts").glob("*.js")), *sorted((ROOT / "guide" / "scripts").rglob("*.js"))]
for script in scripts:
    result = subprocess.run(["node", "--check", str(script)], capture_output=True, text=True)
    if result.returncode:
        errors.append(result.stderr)

if errors:
    print("\n".join(errors), file=sys.stderr)
    sys.exit(1)
print(f"Validated {len(pages)} pages, local references, anchors, metadata and {len(scripts)} scripts.")
