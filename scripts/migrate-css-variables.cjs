/**
 * migrate-css-variables.js
 * 
 * Migrates CSS custom properties (variables) from design-tokens.css
 * to Tailwind CSS configuration.
 * 
 * Usage:
 *   node scripts/migrate-css-variables.js [input-file] [output-file]
 * 
 * Example:
 *   node scripts/migrate-css-variables.js ./src/styles/tokens.css ./tailwind.tokens.json
 */

const fs = require('fs');
const path = require('path');

/**
 * Parse CSS variables from a CSS file content
 * @param {string} cssContent - Raw CSS content
 * @returns {Object} Parsed CSS variables grouped by category
 */
function parseCssVariables(cssContent) {
  const variables = {
    colors: {},
    spacing: {},
    borderRadius: {},
    shadows: {},
    typography: {},
    other: {}
  };

  // Match CSS custom properties: --variable-name: value;
  const varRegex = /--([a-zA-Z0-9-]+):\s*([^;]+);/g;
  let match;

  while ((match = varRegex.exec(cssContent)) !== null) {
    const [, name, value] = match;
    const cleanName = name.trim();
    const cleanValue = value.trim();

    // Categorize based on variable name prefix
    if (cleanName.startsWith('color') || cleanName.includes('color') || cleanName.includes('background') || cleanName.includes('foreground')) {
      variables.colors[cleanName] = cleanValue;
    } else if (cleanName.startsWith('spacing') || cleanName.includes('space') || cleanName.includes('gap')) {
      variables.spacing[cleanName] = cleanValue;
    } else if (cleanName.includes('radius') || cleanName.includes('rounded')) {
      variables.borderRadius[cleanName] = cleanValue;
    } else if (cleanName.includes('shadow')) {
      variables.shadows[cleanName] = cleanValue;
    } else if (cleanName.includes('font') || cleanName.includes('text') || cleanName.includes('line-height')) {
      variables.typography[cleanName] = cleanValue;
    } else {
      variables.other[cleanName] = cleanValue;
    }
  }

  return variables;
}

/**
 * Convert a CSS color value to Tailwind HSL format
 * @param {string} cssColor - CSS color value (hex, rgb, hsl, etc.)
 * @returns {string} Tailwind-compatible HSL format
 */
function convertColorToTailwind(cssColor) {
  const color = cssColor.trim();

  // Handle hsl() format
  const hslMatch = color.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/);
  if (hslMatch) {
    const [, h, s, l] = hslMatch;
    return `'hsl(var(--${h}${s}${l}))'`; // Keep as CSS variable reference
  }

  // Handle rgb() format
  const rgbMatch = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    // Convert to HSL for Tailwind
    const [h, s, l] = rgbToHsl(parseInt(r), parseInt(g), parseInt(b));
    return `'hsl(var(--${h}${s}${l}))'`;
  }

  // Handle hex format
  const hexMatch = color.match(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/);
  if (hexMatch) {
    const hex = hexMatch[1];
    const fullHex = hex.length === 3 
      ? hex.split('').map(c => c + c).join('')
      : hex;
    const r = parseInt(fullHex.substr(0, 2), 16);
    const g = parseInt(fullHex.substr(2, 2), 16);
    const b = parseInt(fullHex.substr(4, 2), 16);
    const [h, s, l] = rgbToHsl(r, g, b);
    return `'hsl(var(--${h}${s}${l}))'`;
  }

  // Return as-is if can't parse (might be a CSS variable reference)
  return `'${color}'`;
}

/**
 * Convert RGB to HSL
 */
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/**
 * Convert spacing values to Tailwind format
 * @param {string} spacing - CSS spacing value
 * @returns {string} Tailwind-compatible spacing
 */
function convertSpacing(spacing) {
  // Handle px values
  const pxMatch = spacing.match(/(\d+)px/);
  if (pxMatch) {
    const px = parseInt(pxMatch[1]);
    // Tailwind uses 0.25rem units, so convert px to rem-like values
    const rem = px / 16;
    return rem;
  }

  // Handle rem values
  const remMatch = spacing.match(/(\d+(?:\.\d+)?)rem/);
  if (remMatch) {
    return parseFloat(remMatch[1]);
  }

  // Handle numeric values
  const numMatch = spacing.match(/^(\d+(?:\.\d+)?)$/);
  if (numMatch) {
    return parseFloat(numMatch[1]);
  }

  return spacing;
}

/**
 * Generate Tailwind config section from CSS variables
 */
function generateTailwindConfig(variables) {
  const config = {
    colors: {},
    spacing: {},
    borderRadius: {},
    boxShadow: {}
  };

  // Process colors
  for (const [name, value] of Object.entries(variables.colors)) {
    const keyName = name.replace(/-/g, '_');
    config.colors[keyName] = convertColorToTailwind(value);
  }

  // Process spacing
  for (const [name, value] of Object.entries(variables.spacing)) {
    const keyName = name.replace(/--spacing-/g, '');
    config.spacing[keyName] = convertSpacing(value);
  }

  // Process border radius
  for (const [name, value] of Object.entries(variables.borderRadius)) {
    const keyName = name.replace(/--radius-/g, '');
    config.borderRadius[keyName] = value;
  }

  // Process shadows
  for (const [name, value] of Object.entries(variables.shadows)) {
    const keyName = name.replace(/--shadow-/g, '');
    config.boxShadow[keyName] = value;
  }

  return config;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  let inputFile = args[0] || 'design-tokens.css';
  let outputFile = args[1] || 'tailwind-migrated.json';

  console.log(`📁 Reading CSS file: ${inputFile}`);

  if (!fs.existsSync(inputFile)) {
    console.error(`❌ File not found: ${inputFile}`);
    console.log('\nUsage: node scripts/migrate-css-variables.js [input-file] [output-file]');
    process.exit(1);
  }

  const cssContent = fs.readFileSync(inputFile, 'utf-8');
  const variables = parseCssVariables(cssContent);
  const tailwindConfig = generateTailwindConfig(variables);

  console.log('\n📊 Parsed CSS Variables:');
  console.log(`   Colors: ${Object.keys(variables.colors).length}`);
  console.log(`   Spacing: ${Object.keys(variables.spacing).length}`);
  console.log(`   Border Radius: ${Object.keys(variables.borderRadius).length}`);
  console.log(`   Shadows: ${Object.keys(variables.shadows).length}`);
  console.log(`   Typography: ${Object.keys(variables.typography).length}`);
  console.log(`   Other: ${Object.keys(variables.other).length}`);

  console.log('\n⚙️  Generated Tailwind Config:');
  console.log(JSON.stringify(tailwindConfig, null, 2));

  fs.writeFileSync(outputFile, JSON.stringify(tailwindConfig, null, 2));
  console.log(`\n✅ Saved to: ${outputFile}`);

  // Also output a suggested tailwind.config.js snippet
  console.log('\n📝 Suggested Tailwind Config Snippet:');
  console.log(`
module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(tailwindConfig.colors, null, 4).replace(/"/g, "'")},
      spacing: ${JSON.stringify(tailwindConfig.spacing, null, 4)},
      borderRadius: ${JSON.stringify(tailwindConfig.borderRadius, null, 4)},
      boxShadow: ${JSON.stringify(tailwindConfig.boxShadow, null, 4)},
    },
  },
}
`);
}

main();
