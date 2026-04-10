/**
 * Ant Design Icons 到 Lucide React 迁移脚本
 * Ant Design Icons → Lucide React Migration Script
 * 
 * 功能：
 * - 扫描 src/ 目录所有 TSX/TS 文件
 * - 识别 @ant-design/icons 的 import 语句
 * - 根据映射表替换为 lucide-react 的 import
 * - 替换 JSX 中的图标组件使用
 * - 生成迁移报告
 * 
 * 使用方法：
 *   node migrate-icons.js                    # 扫描并预览
 *   node migrate-icons.js --apply            # 执行迁移
 *   node migrate-icons.js --dry-run         # 预览不执行
 *   node migrate-icons.js --file <path>     # 处理单个文件
 *   node migrate-icons.js --dir <path>      # 处理指定目录
 */

const fs = require('fs');
const path = require('path');

// 导入映射表
const { iconMapping } = require('./icon-mapping.cjs');

// 配置
const config = {
  sourceDir: path.join(__dirname, '..', 'src'),
  patterns: ['**/*.tsx', '**/*.ts'],
  excludePatterns: ['**/node_modules/**', '**/*.d.ts'],
  dryRun: false,
  verbose: false
};

// 统计信息
const stats = {
  filesScanned: 0,
  filesModified: 0,
  iconsFound: {},
  iconsMapped: 0,
  iconsNotMapped: [],
  errors: []
};

/**
 * 递归扫描目录获取文件列表
 */
function scanDirectory(dir, patterns, excludePatterns) {
  const files = [];
  
  function shouldExclude(filePath) {
    return excludePatterns.some(pattern => {
      if (pattern.includes('**')) {
        // Convert glob pattern to regex: **/foo -> .*/foo, foo/** -> foo/.*
        const regexPattern = pattern
          .replace(/\*\*/g, '.*')
          .replace(/\*/g, '[^/]*');
        const regex = new RegExp(regexPattern);
        return regex.test(filePath);
      }
      return filePath.includes(pattern);
    });
  }
  
  function scan(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (shouldExclude(fullPath)) continue;
      
      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(fullPath);
        if (patterns.some(pattern => {
          const regex = new RegExp(pattern.replace('**', '[^/]*').replace('*', '[^/]*') + '$');
          return regex.test(ext) || regex.test(fullPath);
        })) {
          files.push(fullPath);
        }
      }
    }
  }
  
  scan(dir);
  return files;
}

/**
 * 从 import 语句中提取图标名称
 */
function extractIconImports(content) {
  const imports = new Set();
  
  // 匹配 import { xxx } from '@ant-design/icons'
  const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]@ant-design\/icons['"]/g;
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    const importContent = match[1];
    const iconNames = importContent.split(',').map(s => s.trim());
    
    iconNames.forEach(name => {
      // 处理别名: import { XXX as YYY }
      const aliasMatch = name.match(/^(\w+)\s+as\s+\w+$/);
      if (aliasMatch) {
        imports.add(aliasMatch[1]);
      } else {
        imports.add(name);
      }
    });
  }
  
  // 匹配 import Icon from '@ant-design/icons'
  const defaultImportRegex = /import\s+(\w+)\s+from\s+['"]@ant-design\/icons['"]/g;
  while ((match = defaultImportRegex.exec(content)) !== null) {
    imports.add(match[1]);
  }
  
  return Array.from(imports);
}

/**
 * 转换 import 语句
 */
function transformImports(content, filePath) {
  let result = content;
  const mappings = [];
  
  // 处理命名导入: import { IconName } from '@ant-design/icons'
  const namedImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"]@ant-design\/icons['"]/g;
  
  result = result.replace(namedImportRegex, (match, importContent) => {
    const iconNames = importContent.split(',').map(s => s.trim());
    const newIcons = [];
    const iconAliases = [];
    
    iconNames.forEach(name => {
      // 处理别名: IconName as Alias
      const aliasMatch = name.match(/^(\w+)\s+as\s+(\w+)$/);
      let iconName, alias;
      
      if (aliasMatch) {
        iconName = aliasMatch[1];
        alias = aliasMatch[2];
      } else {
        iconName = name;
        alias = null;
      }
      
      if (iconMapping[iconName]) {
        if (alias) {
          iconAliases.push(`${iconMapping[iconName]} as ${alias}`);
        } else {
          newIcons.push(iconMapping[iconName]);
        }
        mappings.push({ from: iconName, to: iconMapping[iconName], type: 'named' });
        stats.iconsMapped++;
      } else {
        // 没有映射的图标
        if (!stats.iconsNotMapped.includes(iconName)) {
          stats.iconsNotMapped.push(iconName);
        }
        mappings.push({ from: iconName, to: null, type: 'unmapped' });
      }
    });
    
    // 组合新的 import 语句
    const allIcons = [...newIcons, ...iconAliases];
    if (allIcons.length === 0) {
      // 所有图标都没有映射，保留原 import 但标记为 TODO
      return `// TODO: ${match}\nimport { /* 需要手动迁移 */ } from '@ant-design/icons'`;
    }
    
    return `import { ${allIcons.join(', ')} } from 'lucide-react';`;
  });
  
  // 处理默认导入: import IconName from '@ant-design/icons'
  const defaultImportRegex = /import\s+(\w+)\s+from\s+['"]@ant-design\/icons['"]/g;
  
  result = result.replace(defaultImportRegex, (match, iconName) => {
    if (iconMapping[iconName]) {
      mappings.push({ from: iconName, to: iconMapping[iconName], type: 'default' });
      stats.iconsMapped++;
      return `import { ${iconMapping[iconName]} } from 'lucide-react';`;
    } else {
      if (!stats.iconsNotMapped.includes(iconName)) {
        stats.iconsNotMapped.push(iconName);
      }
      mappings.push({ from: iconName, to: null, type: 'unmapped' });
      return `// TODO: ${match}`;
    }
  });
  
  return { content: result, mappings };
}

/**
 * 转换 JSX 中的图标组件使用
 */
function transformJSX(content, filePath) {
  let result = content;
  const transformations = [];
  
  // 遍历所有映射的图标
  for (const [antIcon, lucideIcon] of Object.entries(iconMapping)) {
    // 匹配 <IconName ... /> 或 <IconName ...></IconName> 或 <IconName ...>
    const jsxRegex = new RegExp(`<(${antIcon})(\\s[^>]*)?>(<\\/\\1>)?`, 'g');
    
    result = result.replace(jsxRegex, (match, iconName, props, selfClose) => {
      transformations.push({ from: iconName, to: lucideIcon });
      
      // 处理特殊属性
      let newProps = props || '';
      
      // spin 属性 -> className with animate-spin
      if (newProps.includes('spin')) {
        if (newProps.includes('className')) {
          newProps = newProps.replace(/className="([^"]*)"/, 'className="$1 animate-spin"');
        } else {
          newProps = `${newProps} className="animate-spin"`;
        }
        newProps = newProps.replace(/\s*spin/, '');
      }
      
      // rotate 属性转换
      const rotateMatch = newProps.match(/rotate=\{(\d+)\}/);
      if (rotateMatch) {
        const degrees = parseInt(rotateMatch[1]);
        if (newProps.includes('className')) {
          newProps = newProps.replace(/className="([^"]*)"/, `className="$1"`);
        }
        // 使用 style transform
        const rotation = degrees === 90 ? '-90' : degrees === 180 ? '180' : degrees === 270 ? '90' : '0';
        if (newProps.includes('style=')) {
          newProps = newProps.replace(/style=\{([^}]+)\}/, `style={{ transform: 'rotate(${rotation}deg)', $1 }}`);
        } else {
          newProps = `${newProps} style={{ transform: 'rotate(${rotation}deg)' }}`;
        }
        newProps = newProps.replace(/\s*rotate=\{[^}]+\}/, '');
      }
      
      newProps = newProps.trim();
      
      if (selfClose || match.endsWith('/>')) {
        return `<${lucideIcon}${newProps ? ' ' + newProps : ''} />`;
      } else {
        return `<${lucideIcon}${newProps ? ' ' + newProps : ''}></${lucideIcon}>`;
      }
    });
  }
  
  return { content: result, transformations };
}

/**
 * 处理单个文件
 */
function processFile(filePath, dryRun = false) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // 检查是否包含 @ant-design/icons
    if (!content.includes('@ant-design/icons')) {
      return { skipped: true };
    }
    
    // 提取并记录图标
    const icons = extractIconImports(content);
    icons.forEach(icon => {
      if (!stats.iconsFound[icon]) {
        stats.iconsFound[icon] = [];
      }
      stats.iconsFound[icon].push(filePath);
    });
    
    if (dryRun) {
      return {
        file: filePath,
        icons: icons,
        wouldModify: true
      };
    }
    
    // 转换 imports
    let { content: transformedContent, mappings: importMappings } = transformImports(content, filePath);
    
    // 转换 JSX
    let { content: finalContent, transformations: jsxTransformations } = transformJSX(transformedContent, filePath);
    
    // 写入文件
    fs.writeFileSync(filePath, finalContent, 'utf-8');
    
    return {
      file: filePath,
      importMappings,
      jsxTransformations,
      success: true
    };
    
  } catch (error) {
    stats.errors.push({ file: filePath, error: error.message });
    return { file: filePath, error: error.message };
  }
}

/**
 * 生成迁移报告
 */
function generateReport(results, options = {}) {
  const report = [];
  
  report.push('='.repeat(60));
  report.push('Ant Design Icons → Lucide React 迁移报告');
  report.push('='.repeat(60));
  report.push('');
  report.push(`扫描时间: ${new Date().toLocaleString('zh-CN')}`);
  report.push(`扫描目录: ${config.sourceDir}`);
  report.push(`文件总数: ${stats.filesScanned}`);
  report.push(`修改文件: ${stats.filesModified}`);
  report.push(`图标映射: ${stats.iconsMapped}`);
  report.push('');
  
  if (stats.iconsNotMapped.length > 0) {
    report.push('-'.repeat(60));
    report.push('⚠️  未映射的图标 (需要手动处理):');
    report.push('-'.repeat(60));
    stats.iconsNotMapped.forEach(icon => {
      report.push(`  • ${icon}`);
    });
    report.push('');
  }
  
  if (stats.errors.length > 0) {
    report.push('-'.repeat(60));
    report.push('❌ 处理错误的文件:');
    report.push('-'.repeat(60));
    stats.errors.forEach(err => {
      report.push(`  • ${err.file}: ${err.error}`);
    });
    report.push('');
  }
  
  // 详细的文件变更
  if (options.verbose) {
    report.push('-'.repeat(60));
    report.push('📝 详细变更:');
    report.push('-'.repeat(60));
    
    results.forEach(result => {
      if (result.error) {
        report.push(`\n❌ ${result.file}`);
        report.push(`   错误: ${result.error}`);
      } else if (!result.skipped) {
        report.push(`\n📄 ${result.file}`);
        
        if (result.importMappings && result.importMappings.length > 0) {
          report.push('   Imports:');
          result.importMappings.forEach(m => {
            if (m.to) {
              report.push(`     ${m.from} → ${m.to}`);
            } else {
              report.push(`     ⚠️ ${m.from} → (未映射)`);
            }
          });
        }
        
        if (result.jsxTransformations && result.jsxTransformations.length > 0) {
          report.push('   JSX:');
          result.jsxTransformations.forEach(t => {
            if (t.to) {
              report.push(`     ${t.from} → ${t.to}`);
            }
          });
        }
      }
    });
  }
  
  // 使用说明
  report.push('');
  report.push('-'.repeat(60));
  report.push('💡 下一步操作:');
  report.push('-'.repeat(60));
  report.push('1. 安装 lucide-react: npm install lucide-react');
  report.push('2. 检查上方的未映射图标，手动处理');
  report.push('3. 运行项目验证迁移结果');
  report.push('4. 如有需要，运行格式化工具: npm run format');
  
  report.push('');
  report.push('='.repeat(60));
  
  return report.join('\n');
}

/**
 * 打印使用说明
 */
function printUsage() {
  console.log(`
Ant Design Icons → Lucide React 迁移脚本

用法:
  node migrate-icons.js [选项]

选项:
  --apply          执行迁移（默认只预览）
  --dry-run        预览不执行（默认行为）
  --file <path>    处理单个文件
  --dir <path>     处理指定目录
  --verbose        显示详细变更
  --help           显示帮助信息

示例:
  node migrate-icons.js                                    # 预览所有变更
  node migrate-icons.js --apply                            # 执行迁移
  node migrate-icons.js --file ./src/components/Button.tsx # 处理单个文件
  node migrate-icons.js --dir ./src/components --apply     # 处理目录
  `);
}

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2);
  
  // 解析命令行参数
  let options = {
    dryRun: true,
    file: null,
    dir: null,
    verbose: false
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--apply':
        options.dryRun = false;
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--file':
        options.file = args[++i];
        break;
      case '--dir':
        options.dir = args[++i];
        break;
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
      case '--help':
      case '-h':
        printUsage();
        process.exit(0);
      default:
        if (arg.startsWith('--')) {
          console.warn(`未知选项: ${arg}`);
        }
    }
  }
  
  console.log('\n🔍 Ant Design Icons → Lucide React 迁移工具\n');
  
  const results = [];
  
  if (options.file) {
    // 处理单个文件
    const filePath = path.resolve(options.file);
    if (fs.existsSync(filePath)) {
      stats.filesScanned++;
      const result = processFile(filePath, options.dryRun);
      results.push(result);
      if (!result.skipped && !result.error) {
        stats.filesModified++;
      }
    } else {
      console.error(`❌ 文件不存在: ${filePath}`);
      process.exit(1);
    }
  } else {
    // 扫描目录
    const scanDir = options.dir 
      ? path.resolve(options.dir) 
      : config.sourceDir;
    
    console.log(`📂 扫描目录: ${scanDir}`);
    
    if (!fs.existsSync(scanDir)) {
      console.error(`❌ 目录不存在: ${scanDir}`);
      process.exit(1);
    }
    
    const files = scanDirectory(scanDir, config.patterns, config.excludePatterns);
    console.log(`📋 找到 ${files.length} 个 TypeScript 文件\n`);
    
    files.forEach(file => {
      stats.filesScanned++;
      const result = processFile(file, options.dryRun);
      results.push(result);
      if (!result.skipped && !result.error) {
        stats.filesModified++;
      }
    });
  }
  
  // 生成报告
  const report = generateReport(results, { verbose: options.verbose || config.verbose });
  console.log(report);
  
  // 保存报告到文件
  const reportPath = path.join(__dirname, 'migration-report.txt');
  fs.writeFileSync(reportPath, report, 'utf-8');
  console.log(`📄 报告已保存: ${reportPath}`);
  
  // 如果是 dry-run，提示用户
  if (options.dryRun) {
    console.log('\n⚠️  这是预览模式，未实际修改文件。');
    console.log('   使用 --apply 选项来执行迁移。\n');
  } else {
    console.log('\n✅ 迁移完成！\n');
  }
}

// 运行
main();
