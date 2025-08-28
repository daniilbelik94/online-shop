#!/usr/bin/env node

/**
 * Script to optimize MUI imports for better tree-shaking
 * Converts barrel imports to specific imports
 */

const fs = require('fs');
const path = require('path');

const muiComponents = [
  'AppBar', 'Toolbar', 'Typography', 'Button', 'Box', 'TextField',
  'InputAdornment', 'IconButton', 'Menu', 'MenuItem', 'Container',
  'useMediaQuery', 'useTheme', 'Drawer', 'List', 'ListItem',
  'ListItemText', 'ListItemIcon', 'Badge', 'Snackbar', 'Alert',
  'Avatar', 'Divider', 'Paper', 'ListItemButton', 'Chip',
  'LinearProgress', 'Card', 'CardContent', 'Popper',
  'ClickAwayListener', 'Grow', 'MenuList', 'Stack', 'Tooltip', 'Link'
];

function optimizeFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file has MUI barrel imports
    if (content.includes('from \'@mui/material\'')) {
      console.log(`Optimizing: ${filePath}`);
      
      // Extract imports from barrel import
      const importMatch = content.match(/import\s*{([^}]+)}\s*from\s*['"]@mui\/material['"];?/);
      if (importMatch) {
        const imports = importMatch[1]
          .split(',')
          .map(imp => imp.trim())
          .filter(imp => muiComponents.includes(imp.split(' as ')[0].trim()));
        
        // Replace with specific imports
        const specificImports = imports
          .map(imp => {
            const [component, alias] = imp.split(' as ').map(s => s.trim());
            return `import ${alias || component} from '@mui/material/${component}';`;
          })
          .join('\n');
        
        content = content.replace(importMatch[0], specificImports);
        
        // Write optimized file
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Optimized ${imports.length} imports in ${filePath}`);
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      walkDir(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      optimizeFile(filePath);
    }
  });
}

// Start optimization
console.log('🚀 Starting MUI import optimization...');
walkDir('./src');
console.log('✅ Import optimization complete!');