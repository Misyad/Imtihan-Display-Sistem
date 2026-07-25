from PIL import Image
from pathlib import Path
import os
import re

# ======================================
# KONFIGURASI
# ======================================
INPUT_DIR = "input"
OUTPUT_DIR = "output"

SUPPORTED_EXT = {".jpg", ".jpeg", ".png", ".webp"}

os.makedirs(OUTPUT_DIR, exist_ok=True)

# ======================================
# NATURAL SORT
# ======================================
def natural_sort_key(path):
    return [
        int(text) if text.isdigit() else text.lower()
        for text in re.split(r"(\d+)", path.stem)
    ]

# ======================================
# AMBIL SEMUA FILE
# ======================================
files = sorted(
    [
        f
        for f in Path(INPUT_DIR).iterdir()
        if f.is_file() and f.suffix.lower() in SUPPORTED_EXT
    ],
    key=natural_sort_key,
)

if len(files) < 3:
    print("Minimal harus ada Slide1, Slide2, dan Slide3.")
    exit()

print(f"Ditemukan {len(files)} gambar.")
print("Slide1 akan diabaikan.\n")

# ======================================
# MULAI DARI SLIDE2
# ======================================
for i in range(1, len(files) - 1, 2):

    img1 = Image.open(files[i]).convert("RGB")
    img2 = Image.open(files[i + 1]).convert("RGB")

    # Samakan lebar
    target_width = max(img1.width, img2.width)

    if img1.width != target_width:
        h = int(img1.height * target_width / img1.width)
        img1 = img1.resize((target_width, h), Image.LANCZOS)

    if img2.width != target_width:
        h = int(img2.height * target_width / img2.width)
        img2 = img2.resize((target_width, h), Image.LANCZOS)

    # Gabungkan vertikal
    merged = Image.new(
        "RGB",
        (target_width, img1.height + img2.height),
        "white",
    )

    merged.paste(img1, (0, 0))
    merged.paste(img2, (0, img1.height))

    # Nomor slide
    num1 = re.search(r"\d+", files[i].stem).group()
    num2 = re.search(r"\d+", files[i + 1].stem).group()

    output_name = f"Slide{num1}-{num2}.JPG"

    merged.save(
        os.path.join(OUTPUT_DIR, output_name),
        quality=95,
        optimize=True,
    )

    print(f"{files[i].name} + {files[i+1].name} -> {output_name}")

print("\nSelesai.")