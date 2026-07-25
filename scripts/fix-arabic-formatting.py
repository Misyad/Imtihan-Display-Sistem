import json
import re
import shutil
from datetime import datetime

ARABIC_CHARS = re.compile(r'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]')

ARABIC_BLOCK = re.compile(r'([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s\u060C\u061B\u061F\u0640]+)')

def has_arabic(text):
    return bool(ARABIC_CHARS.search(text))

def convert_commas(text):
    result = re.sub(
        r'(?<=[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF])\s*,\s*(?=[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF])',
        '\u060C ',
        text
    )
    result = re.sub(
        r'(?<=[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF])\s*,\s*$',
        '\u060C',
        result
    )
    return result

def is_short_item(item):
    stripped = item.strip()
    diacritics = range(0x064B, 0x0653)
    arabic_count = len([c for c in stripped if '\u0600' <= c <= '\u06FF' and ord(c) not in diacritics or '\u0750' <= c <= '\u077F' or '\u08A0' <= c <= '\u08FF'])
    return arabic_count <= 4

def break_arabic_lists(text):
    def process_block(m):
        block = m.group(1)
        if '\u060C' not in block:
            return block
        items = block.split('\u060C')
        all_short = all(is_short_item(item) for item in items)
        if all_short:
            return block
        block = re.sub(r'\u060C\s*', '\n', block)
        return block
    return ARABIC_BLOCK.sub(process_block, text)

with open('data/questions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

backup_path = f'data/questions.json.backup.{datetime.now().strftime("%Y%m%d_%H%M%S")}'
shutil.copy2('data/questions.json', backup_path)
print(f"Backup: {backup_path}")

modified = 0
for q in data:
    soal = q.get('soal', '')
    jawaban = q.get('jawaban', '')
    new_soal = soal
    new_jawaban = jawaban
    if has_arabic(soal):
        new_soal = convert_commas(soal)
        new_soal = break_arabic_lists(new_soal)
    if has_arabic(jawaban):
        new_jawaban = convert_commas(jawaban)
        new_jawaban = break_arabic_lists(new_jawaban)
    if new_soal != soal or new_jawaban != jawaban:
        q['soal'] = new_soal
        q['jawaban'] = new_jawaban
        modified += 1
        print(f"  Q{q['nomor']}: updated")

with open('data/questions.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\nDone! {modified} questions modified.")
