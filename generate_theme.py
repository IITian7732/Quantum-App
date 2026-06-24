import json
import re

config_path = "tailwind.config.js"
css_path = "src/index.css"

light_colors = {
    "tertiary": "#735c00",
    "surface-tint": "#4858ab",
    "surface-container-low": "#eef5f7",
    "inverse-on-surface": "#ebf2f4",
    "primary-container": "#5c6bc0",
    "outline-variant": "#c6c5d3",
    "on-primary-container": "#f8f6ff",
    "secondary-fixed-dim": "#adcebd",
    "on-primary-fixed": "#00105b",
    "surface-container-high": "#e2e9ec",
    "tertiary-fixed": "#ffe088",
    "on-secondary-fixed": "#022016",
    "primary": "#4352a5",
    "on-tertiary-container": "#4f3d00",
    "on-error-container": "#93000a",
    "on-primary": "#ffffff",
    "on-tertiary-fixed": "#241a00",
    "on-secondary-fixed-variant": "#2f4d40",
    "inverse-surface": "#2b3234",
    "error": "#ba1a1a",
    "on-surface-variant": "#454651",
    "surface-bright": "#f4fafd",
    "surface-dim": "#d4dbdd",
    "surface-container-highest": "#dde4e6",
    "on-tertiary-fixed-variant": "#574500",
    "surface-variant": "#dde4e6",
    "inverse-primary": "#bac3ff",
    "on-surface": "#161d1f",
    "secondary-container": "#c8ead8",
    "on-error": "#ffffff",
    "on-secondary": "#ffffff",
    "on-secondary-container": "#4c6b5d",
    "primary-fixed-dim": "#bac3ff",
    "on-primary-fixed-variant": "#2f3f92",
    "secondary-fixed": "#c8ead8",
    "surface": "#f8f9fa",
    "on-tertiary": "#ffffff",
    "error-container": "#ffdad6",
    "secondary": "#466557",
    "tertiary-fixed-dim": "#e9c349",
    "background": "#f8f9fa",
    "tertiary-container": "#cca730",
    "outline": "#767683",
    "surface-container": "#e8eff1",
    "on-background": "#161d1f",
    "primary-fixed": "#dee0ff",
    "surface-container-lowest": "#ffffff",
    "brand-primary": "#4352a5",
    "ethereal-bg": "#F8F9FA",
    "ethereal-text": "#161d1f",
    "ethereal-text-variant": "#454651"
}

# Generate some reasonable dark mode colors
# For surfaces: invert to dark grays (e.g. #121212, #1e1e1e)
# For text on surface: invert to white/light gray
# For primary: slightly lighter/desaturated version for dark mode

dark_colors = {}
for k, v in light_colors.items():
    if "surface-container" in k or "background" in k or "surface" in k or "ethereal-bg" in k:
        if k == "on-surface" or k == "on-background" or k == "ethereal-text":
            dark_colors[k] = "#e3e3e3"
        elif k == "on-surface-variant" or k == "ethereal-text-variant":
            dark_colors[k] = "#c4c7c5"
        elif k == "inverse-surface":
            dark_colors[k] = "#e3e3e3"
        elif k == "inverse-on-surface":
            dark_colors[k] = "#1e1e1e"
        else:
            # map backgrounds to dark
            if "lowest" in k: dark_colors[k] = "#0f1416"
            elif "low" in k: dark_colors[k] = "#161d1f"
            elif "high" in k: dark_colors[k] = "#252b2d"
            elif "highest" in k: dark_colors[k] = "#2f3638"
            elif k == "surface-variant": dark_colors[k] = "#454651"
            else: dark_colors[k] = "#111416"
    elif k == "primary" or k == "brand-primary":
        dark_colors[k] = "#bac3ff" # use light variant
    elif k == "on-primary":
        dark_colors[k] = "#00105b"
    elif k == "primary-container":
        dark_colors[k] = "#2f3f92"
    elif k == "on-primary-container":
        dark_colors[k] = "#dee0ff"
    elif k == "secondary":
        dark_colors[k] = "#adcebd"
    elif k == "on-secondary":
        dark_colors[k] = "#022016"
    elif k == "secondary-container":
        dark_colors[k] = "#2f4d40"
    elif k == "on-secondary-container":
        dark_colors[k] = "#c8ead8"
    elif k == "error":
        dark_colors[k] = "#ffb4ab"
    elif k == "on-error":
        dark_colors[k] = "#690005"
    elif k == "outline":
        dark_colors[k] = "#8f9099"
    elif k == "outline-variant":
        dark_colors[k] = "#454651"
    else:
        # Fallback invert logic
        dark_colors[k] = v

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return f"{int(hex_color[0:2], 16)} {int(hex_color[2:4], 16)} {int(hex_color[4:6], 16)}"

root_vars = [f"  --color-{k}: {hex_to_rgb(v)};" for k, v in light_colors.items()]
dark_vars = [f"  --color-{k}: {hex_to_rgb(v)};" for k, v in dark_colors.items()]

css_additions = f'''
@layer base {{
  :root {{
{chr(10).join(root_vars)}
  }}
  .dark {{
{chr(10).join(dark_vars)}
  }}
}}
'''

with open(css_path, "r") as f:
    css_content = f.read()

if "@layer base {" in css_content:
    css_content = css_content.replace("@layer base {", css_additions.strip() + "\\n\\n@layer base {")
else:
    css_content += "\\n" + css_additions

with open(css_path, "w") as f:
    f.write(css_content)

# Update tailwind.config.js
with open(config_path, "r") as f:
    tw_content = f.read()

new_colors = {k: f"rgb(var(--color-{k}) / <alpha-value>)" for k in light_colors.keys()}
new_colors_str = json.dumps(new_colors, indent=8).replace('"', '"').replace("}", "      }")

# We need to replace the colors object in tailwind config
tw_content = re.sub(r'colors:\s*\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', f'colors: {new_colors_str}', tw_content)

with open(config_path, "w") as f:
    f.write(tw_content)

print("Successfully updated CSS and Tailwind config.")
