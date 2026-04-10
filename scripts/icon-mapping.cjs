/**
 * icon-mapping.js
 * 
 * Maps Ant Design icons to their lucide-react equivalents.
 * This helps migrate from Ant Design icons to lucide-react.
 * 
 * Usage:
 *   node scripts/icon-mapping.js [ant-icon-name]
 *   node scripts/icon-mapping.js --list
 *   node scripts/icon-mapping.js --export > icon-mapping.json
 */

const iconMapping = {
  // Navigation & Layout
  'home': 'Home',
  'menu': 'Menu',
  'bars': 'Menu',
  'unordered-list': 'List',
  'appstore': 'LayoutGrid',
  'appstore-add': 'LayoutGrid',
  'dashboard': 'LayoutDashboard',
  'control': 'Settings',
  'setting': 'Settings',
  'settings': 'Settings',
  'shrink': 'Minimize2',
  'arrows-alt': 'Maximize2',
  'pic-center': 'Scissors',
  'pic-left': 'AlignLeft',
  'pic-right': 'AlignRight',
  'vertical-left': 'PanelLeft',
  'vertical-right': 'PanelRight',
  'vertical-align-bottom': 'AlignBottom',
  'vertical-align-middle': 'AlignCenter',
  'vertical-align-top': 'AlignTop',
  'export': 'Download',
  'import': 'Upload',
  'download': 'Download',
  'upload': 'Upload',
  'cloud-download': 'CloudDownload',
  'cloud-upload': 'CloudUpload',
  'swap': 'Swap',
  'swap-left': 'ArrowLeftRight',
  'swap-right': 'ArrowLeftRight',
  'arrow-up': 'ArrowUp',
  'arrow-down': 'ArrowDown',
  'arrow-left': 'ArrowLeft',
  'arrow-right': 'ArrowRight',
  'arrow-left-top': 'NorthWest',
  'arrow-left-bottom': 'SouthWest',
  'arrow-right-top': 'NorthEast',
  'arrow-right-bottom': 'SouthEast',
  'arrows-up-down': 'ArrowUpDown',
  'arrows-left-right': 'ArrowLeftRight',
  'up': 'ChevronUp',
  'down': 'ChevronDown',
  'left': 'ChevronLeft',
  'right': 'ChevronRight',
  'up-circle': 'CircleArrowUp',
  'down-circle': 'CircleArrowDown',
  'left-circle': 'CircleArrowLeft',
  'right-circle': 'CircleArrowRight',
  'up-square': 'SquareArrowUp',
  'down-square': 'SquareArrowDown',
  'left-square': 'SquareArrowLeft',
  'right-square': 'SquareArrowRight',
  'login': 'LogIn',
  'logout': 'LogOut',
  'check-circle': 'CheckCircle',
  'check-square': 'CheckSquare',
  'check': 'Check',
  'close-circle': 'XCircle',
  'close-square': 'XSquare',
  'close': 'X',
  'plus-circle': 'PlusCircle',
  'plus-square': 'PlusSquare',
  'plus': 'Plus',
  'minus-circle': 'MinusCircle',
  'minus-square': 'MinusSquare',
  'minus': 'Minus',
  'plus-minus': 'PlusMinus',
  'question-circle': 'HelpCircle',
  'question': 'HelpCircle',
  'info-circle': 'Info',
  'info': 'Info',
  'exclamation-circle': 'AlertCircle',
  'warning': 'AlertTriangle',
  'warning-circle': 'AlertTriangle',
  'alert': 'AlertTriangle',
  'alert-triangle': 'AlertTriangle',
  'alert-circle': 'AlertCircle',

  // Action & User Interaction
  'edit': 'Edit',
  'EditOutlined': 'Edit',
  'edit-square': 'Edit2',
  'form': 'FileText',
  'pencil': 'Pencil',
  'pencil-square': 'Pencil',
  'delete': 'Trash2',
  'DeleteOutlined': 'Trash2',
  'delete-row': 'Trash2',
  'delete-column': 'Trash2',
  'scissor': 'Scissors',
  'tool': 'Wrench',
  'ethernet': 'Ethernet',
  'exception': 'AlertOctagon',
  'global': 'Globe',
  'internet': 'Globe',
  'link': 'Link',
  'unlink': 'Link2Off',
  'paper-clip': 'Paperclip',
  'attachment': 'Paperclip',
  'eye': 'Eye',
  'eye-invisible': 'EyeOff',
  'eye-invisible-o': 'EyeOff',
  'eyesight': 'Eye',
  'eye-o': 'Eye',
  'save': 'Save',
  'save-as': 'Save',
  'sensitivity': 'Scan',
  'scan': 'Scan',
  'scan-dash': 'Scan',
  'scan': 'Scan',
  'qrcode': 'QrCode',
  'barcode': 'Barcode',
  'audio': 'Volume2',
  'audio-muted': 'VolumeX',
  'bell': 'Bell',
  'bell-disabled': 'BellOff',
  'bell-o': 'Bell',
  'music': 'Music',
  'music-o': 'Music',
  'container': 'Package',
  'database': 'Database',
  'share-alt': 'Share2',
  'share-alt2': 'Share2',
  'share': 'Share2',
  'sharing': 'Share2',
  'wallet': 'Wallet',
  'credit-card': 'CreditCard',
  'credit-card-o': 'CreditCard',
  'shopping-cart': 'ShoppingCart',
  'shopping': 'ShoppingBag',
  'shopping-o': 'ShoppingBag',
  'bag': 'ShoppingBag',
  'bag-s': 'ShoppingBag',
  'bakcup': 'HardDrive',
  'safety': 'Shield',
  'security-scan': 'ShieldCheck',
  'safety-certificate': 'ShieldCheck',
  'insurance': 'Shield',
  'insurance-o': 'Shield',
  'fire': 'Flame',
  'gun': 'Crosshair',
  'thunderbolt': 'Zap',
  'key': 'Key',
  'unlock': 'Unlock',
  'lock': 'Lock',
  'lock-o': 'Lock',
  'security': 'Lock',
  'protect': 'Shield',
  'protect-o': 'Shield',
  'crown': 'Crown',
  'crown-o': 'Crown',
  'flag': 'Flag',
  'flag-o': 'Flag',
  'tag': 'Tag',
  'tags': 'Tags',
  'trophy': 'Trophy',
  'trophy-o': 'Trophy',
  'medal': 'Award',
  'star': 'Star',
  'star-o': 'Star',
  'like': 'ThumbsUp',
  'like-o': 'ThumbsUp',
  'dislike': 'ThumbsDown',
  'dislike-o': 'ThumbsDown',
  'heart': 'Heart',
  'heart-o': 'Heart',
  'unlike': 'HeartOff',
  'calendar': 'Calendar',
  'calendar-o': 'Calendar',
  'calendar-check': 'CalendarCheck',
  'clock-circle': 'Clock',
  'clock-circle-o': 'Clock',
  'clock': 'Clock',
  'time': 'Clock',
  'schedule': 'Clock',
  'timer': 'Timer',
  'stopwatch': 'Timer',
  'hourglass': 'Hourglass',
  'history': 'History',
  'reload': 'RotateCcw',
  'sync': 'RefreshCw',
  'refresh': 'RefreshCw',
  'redo': 'RotateCw',
  'undo': 'Undo2',
  'rollback': 'RotateCcw',
  'retweet': 'Repeat',
  'repeat': 'Repeat',
  'scan': 'Scan',
  'fight': 'Swords',
  'copyright': 'Copyright',
  'trademark': 'Trademark',
  'sound': 'Volume2',
  'customer-service': 'Headphones',
  'customerservice': 'Headphones',
  'contacts': 'UserCheck',
  'contacts-o': 'UserCheck',
  'user': 'User',
  'user-add': 'UserPlus',
  'user-delete': 'UserMinus',
  'usergroup-add': 'Users',
  'group': 'Users',
  'group-add': 'Users',
  'team': 'Users',
  'usercircle': 'UserCircle',
  'contacts-o': 'Contact',
  'idcard': 'CreditCard',
  'card': 'CreditCard',
  'solution': 'FileCheck',
  'profile': 'UserCheck',
  'manual': 'BookOpen',
  'book': 'Book',
  'book-o': 'Book',
  'pushpin': 'MapPin',
  'pushpin-o': 'MapPin',
  'location': 'MapPin',
  'map': 'Map',
  'environment': 'MapPin',
  'compass': 'Compass',
  'enviroment': 'MapPin',

  // File & Document
  'file': 'File',
  'file-text': 'FileText',
  'file-add': 'FilePlus',
  'file-add-o': 'FilePlus',
  'file-excel': 'FileSpreadsheet',
  'file-ppt': 'FilePresentation',
  'file-word': 'FileText',
  'file-pdf': 'FileText',
  'file-markdown': 'FileText',
  'file-image': 'FileImage',
  'file-zip': 'FileArchive',
  'file-jpg': 'FileImage',
  'file-png': 'FileImage',
  'file-gif': 'FileImage',
  'file-doc': 'FileText',
  'file.unknown': 'File',
  'file-protect': 'FileCheck',
  'file-search': 'FileSearch',
  'file-copy': 'Copy',
  'copy': 'Copy',
  'CopyOutlined': 'Copy',
  'copy-o': 'Copy',
  'cut': 'Scissors',
  'snippets': 'FileCode',
  'diff': 'GitCompare',
  'highlight': 'Highlighter',
  'new': 'FilePlus',
  'newfile': 'FilePlus',
  'newfolder': 'FolderPlus',
  'folder': 'Folder',
  'folder-add': 'FolderPlus',
  'folder-open': 'FolderOpen',
  'folder-view': 'FolderOpen',
  'folder-o': 'Folder',
  'files': 'Files',
  'doc': 'FileText',
  'document': 'FileText',

  // Data & Charts
  'area-chart': 'AreaChart',
  'bar-chart': 'BarChart3',
  'bar-chart-o': 'BarChart3',
  'line-chart': 'LineChart',
  'line-chart-up': 'TrendingUp',
  'line-chart-down': 'TrendingDown',
  'pie-chart': 'PieChart',
  'pie-chart-o': 'PieChart',
  'dot-chart': 'Activity',
  'fund': 'DollarSign',
  'fund-view': 'DollarSign',
  'fund-o': 'DollarSign',
  'fall': 'TrendingDown',
  'rise': 'TrendingUp',
  'table': 'Table',
  'table-o': 'Table',
  'bug': 'Bug',
  'dns': 'Server',
  'grid': 'LayoutGrid',
  'filter': 'Filter',
  'funnel-plot': 'Filter',
  'pie': 'PieChart',
  'apartment': 'Building',
  'audit': 'ClipboardCheck',
  'bank': 'Building2',
  'barcode': 'Barcode',
  'block': 'Ban',
  'gateway': 'Network',
  'gateway-o': 'Network',
  'global': 'Globe',
  'gold': 'Coin',
  'alibaba': 'Cloud',
  'amazon': 'ShoppingCart',
  'aliyun': 'Cloud',
  'drive': 'HardDrive',
  'google': 'Globe',
  'html5': 'FileCode',
  'ie': 'Globe',
  'instagram': 'Camera',
  'skype': 'Phone',
  'slack': 'Hash',
  'taobao': 'ShoppingBag',
  'weibo': 'Globe',
  'windows': 'Monitor',
  'yahoo': 'Globe',
  'youtube': 'Play',

  // UI & Feedback
  'loading': 'Loader',
  'loading-3-quarters': 'Loader',
  'loading-quarter': 'Loader',
  'spin': 'Loader',
  'bulb': 'Lightbulb',
  'bulb-o': 'Lightbulb',
  'sun': 'Sun',
  'moon': 'Moon',
  'shop': 'Store',
  'gift': 'Gift',
  'gift-o': 'Gift',
  'mail': 'Mail',
  'mail-o': 'Mail',
  'inbox': 'Inbox',
  'envelope': 'Mail',
  'envelope-o': 'Mail',
  'mail-send': 'Send',
  'send': 'Send',
  'printer': 'Printer',
  'printer-o': 'Printer',
  'robot': 'Bot',
  'schedule': 'Calendar',
  'shop': 'Store',
  'desktop': 'Monitor',
  'mobile': 'Smartphone',
  'tablet': 'Tablet',
  'laptop': 'Laptop',
  'poweroff': 'Power',
  'disconnect': 'Unplug',
  'wifi': 'Wifi',
  'usb': 'Usb',
  'app': 'Grid',
  'apple-o': 'Apple',
  'android-o': 'Android',
  'android': 'Android',
  'chrome': 'Globe',
  'api': 'Braces',
  'api-o': 'Braces',
  'message': 'MessageSquare',
  'message-o': 'MessageSquare',
  'chat': 'MessageSquare',
  'chat-o': 'MessageSquare',
  'comment': 'MessageSquare',
  'comment-o': 'MessageSquare',
  'feedback': 'MessageSquare',
  'feedback-o': 'MessageSquare',
  'phone': 'Phone',
  'phone-o': 'Phone',
  'telephone': 'Phone',
  'contacts': 'AddressBook',
  'contacts-o': 'AddressBook',
  'pushpin': 'MapPin',
  'pushpin-o': 'MapPin',
  'notification': 'Bell',
  'notification-o': 'Bell',
  'bell': 'Bell',
  'bell-o': 'Bell',
  'wangwang': 'MessageCircle',
  'customer-service': 'Headphones',
  'service': 'Headphones',
  'shop': 'Store',
  'video': 'Video',
  'video-camera': 'Video',
  'video-camera-add': 'VideoPlus',
  'videocamera': 'Video',
  'sound': 'Volume2',
  'audio': 'Volume2',
  'headset': 'Headphones',
  'microphone': 'Mic',
  'mic': 'Mic',
  'mic-o': 'Mic',
  'image': 'Image',
  'image-o': 'Image',
  'camera': 'Camera',
  'camera-o': 'Camera',
  'video': 'Video',
  'rocket': 'Rocket',
  'coffee': 'Coffee',
  'dashboard-o': 'LayoutDashboard',
  'car': 'Car',
  'car-o': 'Car',
  'truck': 'Truck',
  'taxi': 'Car',
  'phone': 'Phone',
  'phone-o': 'Phone',
  'contacts': 'Users',
  'idcard-o': 'IdCard',
  'bank-o': 'Building2',
  'trophy-o': 'Trophy',
  'meh-o': 'Meh',
  'smile-o': 'Smile',
  'smile': 'Smile',
  'frown-o': 'Frown',
  'meh': 'Meh',
  'sad': 'Frown',
  'happy': 'Smile',
  'coffee-o': 'Coffee',
  'restaurant': 'UtensilsCrossed',
  'cafe': 'Coffee',
  'hospital': 'Building',
  'coffeescript': 'Coffee',
  'COD': 'Truck',
  'HN': 'DollarSign',
  'RMB': 'YenSign',
  'dollar': 'DollarSign',
  'euro': 'EuroSign',
  'euro-o': 'EuroSign',
  'money-collect': 'DollarSign',
  'font-size': 'Type',
  'font-size-o': 'Type',
  'font': 'Type',
  'medium': 'Newspaper',
  'medium-workmark': 'Newspaper',
  'strikethrough': 'Strikethrough',
  'underline': 'Underline',
  'italic': 'Italic',
  'bold': 'Bold',
  'red-envelope': 'Gift',
  'shake': 'Shake',
  'marker': 'MapPin',
  'shake-o': 'Shake',
  'number': 'Hash',
  'bold': 'Bold',
  'calculator': 'Calculator',
  'calculator-o': 'Calculator',
  'build': 'Wrench',
  'build-o': 'Wrench',
  'add-item': 'Plus',
  'remove-item': 'Minus',
  'merge': 'GitMerge',
  'fork': 'GitBranch',
  'shrink-item': 'Minimize2',
  'enlarge-item': 'Maximize2',
  'border-outer': 'Square',
  'border': 'Square',
  'radius-up-left': 'CornerDownLeft',
  'radius-up-right': 'CornerDownRight',
  'radius-down-left': 'CornerUpLeft',
  'radius-bottomright': 'CornerUpRight',
  'radius-bottomleft': 'CornerUpRight',
  'radius-upleft': 'CornerDownLeft',
  'fullscreen': 'Maximize',
  'fullscreen-exit': 'Minimize',
  'question': 'HelpCircle',
  'questions': 'HelpCircle',
  'one-to-one': 'One',
  'batch-fold': 'FolderClosed',
  'batch-default': 'Folder',
  'batch-operations': 'Settings',
  'vertical-align-middle': 'AlignVerticalJustifyCenter',
  'vertical-align-top': 'AlignVerticalJustifyStart',
  'vertical-align-bottom': 'AlignVerticalJustifyEnd',
  'diploma': 'GraduationCap',
  'account-book': 'BookOpen',
  'red-flag': 'Flag',
  'interaction': 'Zap',
  'dashboard': 'LayoutDashboard',
  'indent': 'Indent',
  'outdent': 'Outdent',
};

/**
 * Get lucide-react icon name for an Ant Design icon
 * @param {string} antIconName - Ant Design icon name (e.g., 'check-circle')
 * @returns {string|null} Lucide-react icon name or null if not found
 */
function getLucideIcon(antIconName) {
  const normalized = antIconName.toLowerCase().replace(/-o$/, '');
  return iconMapping[normalized] || null;
}

/**
 * Generate import statement for mapped icons
 * @param {string[]} antIcons - Array of Ant Design icon names
 * @returns {string} Import statement
 */
function generateImports(antIcons) {
  const lucideIcons = new Set();
  
  antIcons.forEach(antIcon => {
    const lucide = getLucideIcon(antIcon);
    if (lucide) {
      lucideIcons.add(lucide);
    }
  });

  if (lucideIcons.size === 0) {
    return '// No icons to import';
  }

  const imports = Array.from(lucideIcons).sort();
  return `import { ${imports.join(', ')} } from 'lucide-react';`;
}

/**
 * Generate JSX replacements for icons
 * @param {string[]} antIcons - Array of Ant Design icon names
 * @returns {Object} Mapping of Ant Design JSX to Lucide JSX
 */
function generateJsxReplacements(antIcons) {
  const replacements = {};
  
  antIcons.forEach(antIcon => {
    const lucide = getLucideIcon(antIcon);
    if (lucide) {
      // Ant Design JSX pattern: <IconName />
      replacements[`&lt;${antIcon} /&gt;`] = `<${lucide} />`;
      replacements[`&lt;${antIcon}&gt;`] = `<${lucide}>`;
      replacements[`&lt;/${antIcon}&gt;`] = `</${lucide}>`;
    }
  });

  return replacements;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║         Ant Design to Lucide React Icon Mapping               ║
╠══════════════════════════════════════════════════════════════╣
║  Usage:                                                        ║
║    node scripts/icon-mapping.js [ant-icon-name]                ║
║    node scripts/icon-mapping.js --list                         ║
║    node scripts/icon-mapping.js --export > mapping.json        ║
║    node scripts/icon-mapping.js --react [icon1 icon2 ...]     ║
╚══════════════════════════════════════════════════════════════╝
`);
    return;
  }

  if (args[0] === '--list') {
    console.log('\n📋 Ant Design to Lucide React Icon Mapping:\n');
    const entries = Object.entries(iconMapping);
    entries.sort((a, b) => a[0].localeCompare(b[0]));
    entries.forEach(([ant, lucide]) => {
      console.log(`  ${ant.padEnd(30)} → ${lucide}`);
    });
    console.log(`\n Total: ${entries.length} mappings\n`);
    return;
  }

  if (args[0] === '--export') {
    console.log(JSON.stringify(iconMapping, null, 2));
    return;
  }

  if (args[0] === '--react') {
    const icons = args.slice(1);
    if (icons.length === 0) {
      console.log('Please provide icon names to generate imports');
      return;
    }
    console.log('\n📦 Import Statement:\n');
    console.log(generateImports(icons));
    console.log('\n🔄 JSX Replacements:\n');
    const replacements = generateJsxReplacements(icons);
    Object.entries(replacements).forEach(([ant, lucide]) => {
      console.log(`  ${ant} → ${lucide}`);
    });
    console.log('');
    return;
  }

  // Look up single icon
  const iconName = args[0];
  const lucideIcon = getLucideIcon(iconName);
  
  if (lucideIcon) {
    console.log(`\n${iconName} → ${lucideIcon}\n`);
  } else {
    console.log(`\n⚠️  No mapping found for: ${iconName}\n`);
    console.log('Available alternatives:');
    const similar = Object.keys(iconMapping).filter(k => k.includes(iconName));
    similar.forEach(k => console.log(`  - ${k}`));
    console.log('');
  }
}

main();

module.exports = { iconMapping, getLucideIcon, generateImports, generateJsxReplacements };
