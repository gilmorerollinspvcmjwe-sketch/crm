import os, re

src = r'C:\Users\13609\.openclaw\workspace\self-research-crm-demo\frontend-integrated\src'
chinese_pattern = re.compile(r'[\u4e00-\u9fff]+')

results = []
for root, dirs, files in os.walk(src):
    for f in files:
        if f.endswith('.tsx') or f.endswith('.ts'):
            fp = os.path.join(root, f)
            try:
                with open(fp, 'r', encoding='utf-8') as fh:
                    content = fh.read()
            except:
                continue
            has_i18n = 'useTranslation' in content
            chinese_matches = chinese_pattern.findall(content)
            if chinese_matches:
                rel = os.path.relpath(fp, src)
                results.append((rel, has_i18n, len(chinese_matches)))

# Sort by chinese count desc
results.sort(key=lambda x: -x[2])
print(f'Total files with Chinese: {len(results)}')
print('-' * 80)
for rel, has_i18n, count in results:
    print(f'{rel} | i18n: {has_i18n} | chinese: {count}')