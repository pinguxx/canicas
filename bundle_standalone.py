import re
from pathlib import Path

def bundle():
    public_dir = Path('/home/antigravity/canicas/public')
    out_path = Path('/home/antigravity/.gemini/jetski/brain/v1/default/jetski_remote_agents_3p/143cf043-69e7-4522-a9a7-374945eb16f3/canicas_mexicanas_3d.html')

    html = (public_dir / 'index.html').read_text(encoding='utf-8')
    css = (public_dir / 'style.css').read_text(encoding='utf-8')
    qrcode_js = (public_dir / 'qrcode.min.js').read_text(encoding='utf-8')
    audio_js = (public_dir / 'audio.js').read_text(encoding='utf-8')
    app_js = (public_dir / 'app.js').read_text(encoding='utf-8')

    # Replace style
    html = re.sub(
        r'<link\s+rel="stylesheet"\s+href="/style\.css[^"]*"\s*/?>',
        lambda m: f'<style>\n{css}\n</style>',
        html
    )

    # Replace scripts
    html = re.sub(
        r'<script\s+src="/qrcode\.min\.js[^"]*"></script>',
        lambda m: f'<script>\n{qrcode_js}\n</script>',
        html
    )

    html = re.sub(
        r'<script\s+src="/audio\.js[^"]*"></script>',
        lambda m: f'<script>\n{audio_js}\n</script>',
        html
    )

    html = re.sub(
        r'<script\s+src="/app\.js[^"]*"></script>',
        lambda m: f'<script>\n{app_js}\n</script>',
        html
    )

    out_path.write_text(html, encoding='utf-8')
    print(f'Successfully bundled standalone artifact to {out_path} ({len(html)} bytes)')

if __name__ == '__main__':
    bundle()
