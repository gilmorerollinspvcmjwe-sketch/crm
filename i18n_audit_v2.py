#!/usr/bin/env python3
"""i18n Translation Audit Script - Improved Version with Noise Filtering"""
import os
import re
import json
from collections import defaultdict

# Project paths
PROJECT_ROOT = r'C:\Users\13609\.openclaw\workspace\self-research-crm-demo\frontend-integrated'
SRC_DIR = os.path.join(PROJECT_ROOT, 'src')
EN_JSON = os.path.join(SRC_DIR, 'i18n', 'locales', 'en.json')
ZH_JSON = os.path.join(SRC_DIR, 'i18n', 'locales', 'zh.json')

def flatten_keys(obj, prefix=''):
    """Recursively flatten nested JSON keys with dot notation"""
    keys = set()
    for k, v in obj.items():
        full_key = f'{prefix}.{k}' if prefix else k
        if isinstance(v, dict):
            keys.update(flatten_keys(v, full_key))
        else:
            keys.add(full_key)
    return keys

def is_valid_translation_key(key):
    """Filter out false positives"""
    # Skip import paths (containing / or \ or starting with ./ or ../)
    if '/' in key or '\\' in key:
        return False
    # Skip date format strings
    if re.match(r'^[YMDHms\-\s:]+$', key):
        return False
    # Skip very short keys (likely noise)
    if len(key) < 2:
        return False
    # Skip single character keys that are just letters
    if re.match(r'^[a-zA-Z]$', key):
        return False
    # Skip status codes that look like enums
    if key in ['PENDING_VERIFY', 'REJECTED', 'VERIFIED']:
        return False
    # Skip whitespace-only keys
    if key.strip() != key or key.strip() == '':
        return False
    return True

def extract_t_keys_from_file(filepath):
    """Extract all t('key') and t("key") from a file"""
    keys = set()
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        # Pattern for t('xxx') or t("xxx")
        pattern = re.compile(r"t\(['\"]([^'\"]+)['\"]\)")
        matches = pattern.findall(content)
        for m in matches:
            if is_valid_translation_key(m):
                keys.add(m)
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
    return keys

def scan_code_for_t_keys(src_dir):
    """Scan all .tsx/.ts files for t() keys"""
    keys_by_file = defaultdict(set)
    all_keys = set()
    
    for root, dirs, files in os.walk(src_dir):
        for f in files:
            if f.endswith(('.tsx', '.ts')):
                fp = os.path.join(root, f)
                rel_path = os.path.relpath(fp, src_dir)
                file_keys = extract_t_keys_from_file(fp)
                if file_keys:
                    keys_by_file[rel_path] = file_keys
                    all_keys.update(file_keys)
    
    return all_keys, keys_by_file

def check_hardcoded_chinese(src_dir):
    """Find .tsx files with hardcoded Chinese but no useTranslation"""
    chinese_pattern = re.compile(r'[\u4e00-\u9fff]+')
    use_translation_pattern = re.compile(r'useTranslation')
    results = {}
    
    for root, dirs, files in os.walk(src_dir):
        for f in files:
            if f.endswith('.tsx'):
                fp = os.path.join(root, f)
                rel_path = os.path.relpath(fp, src_dir)
                try:
                    with open(fp, 'r', encoding='utf-8', errors='ignore') as file:
                        content = file.read()
                    chinese_matches = chinese_pattern.findall(content)
                    has_use_translation = use_translation_pattern.search(content)
                    
                    if chinese_matches and not has_use_translation:
                        # Count unique Chinese strings
                        unique_chinese = set(chinese_matches)
                        results[rel_path] = len(unique_chinese)
                except Exception as e:
                    print(f"Error reading {fp}: {e}")
    
    return results

def main():
    print("=" * 60)
    print("i18n Translation Audit Report (Filtered)")
    print("=" * 60)
    print()
    
    # Step 1: Scan code for t() keys
    print("Step 1: Scanning code for t() keys...")
    code_keys, keys_by_file = scan_code_for_t_keys(SRC_DIR)
    print(f"  Found {len(code_keys)} valid translation keys in code")
    print()
    
    # Step 2: Load translation files
    print("Step 2: Loading translation files...")
    en_keys = set()
    zh_keys = set()
    
    try:
        with open(EN_JSON, 'r', encoding='utf-8') as f:
            en_data = json.load(f)
            en_keys = flatten_keys(en_data)
        print(f"  en.json: {len(en_keys)} keys")
    except Exception as e:
        print(f"  Error loading en.json: {e}")
    
    try:
        with open(ZH_JSON, 'r', encoding='utf-8') as f:
            zh_data = json.load(f)
            zh_keys = flatten_keys(zh_data)
        print(f"  zh.json: {len(zh_keys)} keys")
    except Exception as e:
        print(f"  Error loading zh.json: {e}")
    print()
    
    # Step 3: Find missing keys
    print("Step 3: Analyzing missing keys...")
    
    # Keys used in code but missing in translations
    missing_in_en = code_keys - en_keys
    missing_in_zh = code_keys - zh_keys
    
    # Keys in one translation but not the other
    en_only = en_keys - zh_keys
    zh_only = zh_keys - en_keys
    
    print(f"  Keys used in code but missing in en.json: {len(missing_in_en)}")
    print(f"  Keys used in code but missing in zh.json: {len(missing_in_zh)}")
    print(f"  Keys in en.json but not in zh.json: {len(en_only)}")
    print(f"  Keys in zh.json but not in en.json: {len(zh_only)}")
    print()
    
    # Step 4: Check hardcoded Chinese
    print("Step 4: Checking for hardcoded Chinese...")
    hardcoded_chinese = check_hardcoded_chinese(SRC_DIR)
    print(f"  Files with hardcoded Chinese (no useTranslation): {len(hardcoded_chinese)}")
    print()
    
    # Generate report
    report_lines = []
    report_lines.append("# i18n 翻译审计报告")
    report_lines.append("")
    report_lines.append(f"> 生成时间: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    report_lines.append("")
    
    # Section 1: 统计概览
    report_lines.append("## 1. 统计概览")
    report_lines.append("")
    report_lines.append(f"| 项目 | 数量 |")
    report_lines.append(f"|------|------|")
    report_lines.append(f"| 代码中使用的有效 key 总数 | {len(code_keys)} |")
    report_lines.append(f"| en.json 中的 key 总数 | {len(en_keys)} |")
    report_lines.append(f"| zh.json 中的 key 总数 | {len(zh_keys)} |")
    report_lines.append(f"| **代码中使用但 en.json 缺失** | **{len(missing_in_en)}** |")
    report_lines.append(f"| **代码中使用但 zh.json 缺失** | **{len(missing_in_zh)}** |")
    report_lines.append("")
    
    # Section 2: 缺失的翻译 key（按文件分组）
    report_lines.append("## 2. 缺失的翻译 key（按文件分组）")
    report_lines.append("")
    report_lines.append("以下是代码中使用了 `t('key')` 但翻译文件中不存在的 key，这就是页面上显示 raw key 的原因。")
    report_lines.append("")
    
    if missing_in_en or missing_in_zh:
        # Group by file
        for filepath, file_keys in sorted(keys_by_file.items()):
            file_missing_en = file_keys & missing_in_en
            file_missing_zh = file_keys & missing_in_zh
            
            if file_missing_en or file_missing_zh:
                report_lines.append(f"### `{filepath}`")
                report_lines.append("")
                
                if file_missing_en:
                    report_lines.append("**英文缺失 (en.json):**")
                    report_lines.append("```")
                    for k in sorted(file_missing_en):
                        report_lines.append(k)
                    report_lines.append("```")
                    report_lines.append("")
                
                if file_missing_zh:
                    report_lines.append("**中文缺失 (zh.json):**")
                    report_lines.append("```")
                    for k in sorted(file_missing_zh):
                        report_lines.append(k)
                    report_lines.append("```")
                    report_lines.append("")
    else:
        report_lines.append("✅ 所有代码中使用的 key 都已在翻译文件中定义")
        report_lines.append("")
    
    # Section 3: 中英文不一致的 key
    report_lines.append("## 3. 中英文不一致的 key")
    report_lines.append("")
    
    if en_only:
        report_lines.append("### en.json 有但 zh.json 没有")
        report_lines.append("")
        report_lines.append("```")
        for k in sorted(en_only):
            report_lines.append(k)
        report_lines.append("```")
        report_lines.append("")
    
    if zh_only:
        report_lines.append("### zh.json 有但 en.json 没有")
        report_lines.append("")
        report_lines.append("```")
        for k in sorted(zh_only):
            report_lines.append(k)
        report_lines.append("```")
        report_lines.append("")
    
    if not en_only and not zh_only:
        report_lines.append("✅ 中英文翻译 key 完全一致")
        report_lines.append("")
    
    # Section 4: 仍有硬编码中文的文件
    report_lines.append("## 4. 仍有硬编码中文的文件")
    report_lines.append("")
    report_lines.append("（包含中文字符但未使用 useTranslation 的 .tsx 文件）")
    report_lines.append("")
    
    if hardcoded_chinese:
        report_lines.append("| 文件 | 中文字符串数量 |")
        report_lines.append("|------|----------------|")
        for filepath, count in sorted(hardcoded_chinese.items(), key=lambda x: -x[1]):
            report_lines.append(f"| `{filepath}` | {count} |")
        report_lines.append("")
    else:
        report_lines.append("✅ 没有发现硬编码中文的文件")
        report_lines.append("")
    
    # Section 5: 待添加的翻译 key 列表（JSON 格式，可直接复制）
    report_lines.append("## 5. 待添加的翻译 key 列表（可直接复制到 JSON 文件）")
    report_lines.append("")
    
    # Filter out noise from missing keys
    true_missing_en = sorted([k for k in missing_in_en if is_valid_translation_key(k)])
    true_missing_zh = sorted([k for k in missing_in_zh if is_valid_translation_key(k)])
    
    report_lines.append("### 需要添加到 en.json")
    report_lines.append("")
    report_lines.append("```json")
    for k in true_missing_en:
        # Generate placeholder English value
        placeholder = k.split('.')[-1].replace('([a-z])([A-Z])', r'\1 \2').title()
        report_lines.append(f'  "{k}": "{placeholder}",')
    report_lines.append("```")
    report_lines.append("")
    
    report_lines.append("### 需要添加到 zh.json")
    report_lines.append("")
    report_lines.append("```json")
    for k in true_missing_zh:
        report_lines.append(f'  "{k}": "",  // TODO: 添加中文翻译')
    report_lines.append("```")
    report_lines.append("")
    
    # Write report
    docs_dir = os.path.join(PROJECT_ROOT, 'docs')
    os.makedirs(docs_dir, exist_ok=True)
    report_path = os.path.join(docs_dir, 'I18N_AUDIT_REPORT.md')
    
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(report_lines))
    
    print(f"Report saved to: {report_path}")
    print()
    print("=" * 60)
    print("Summary")
    print("=" * 60)
    print(f"Valid code keys: {len(code_keys)}")
    print(f"Missing in en.json: {len(missing_in_en)}")
    print(f"Missing in zh.json: {len(missing_in_zh)}")
    print(f"Hardcoded Chinese files: {len(hardcoded_chinese)}")
    
    if missing_in_en:
        print(f"\nTop 10 missing keys (en.json):")
        for k in sorted(missing_in_en)[:10]:
            print(f"  - {k}")
    
    return {
        'code_keys': len(code_keys),
        'en_keys': len(en_keys),
        'zh_keys': len(zh_keys),
        'missing_in_en': len(missing_in_en),
        'missing_in_zh': len(missing_in_zh),
        'hardcoded_files': len(hardcoded_chinese)
    }

if __name__ == '__main__':
    main()