# -*- coding: utf-8 -*-
import re

filePath = r'C:\Users\13609\Projects\crm-ui-upgrade\src\forms\ContactPersonForm.tsx'

with open(filePath, 'r', encoding='utf-8') as f:
    content = f.read()

# 修复 genderOptions
content = re.sub(r'\{ label: "[^"]*", value: "[^"]*" \}', '{ label: "男", value: "男" }', content, count=1)
content = re.sub(r'\{ label: "[^"]*", value: "[^"]*" \}', '{ label: "女", value: "女" }', content, count=1)

# 修复 decisionRoleOptions
content = content.replace('决策者', '决策者')
content = content.replace('影响者', '影响者')
content = content.replace('使用者', '使用者')
content = content.replace('把关者', '把关者')

# 修复 educationOptions  
content = content.replace('高中及以下', '高中及以下')

with open(filePath, 'w', encoding='utf-8') as f:
    f.write(content)

print('修复完成！')
