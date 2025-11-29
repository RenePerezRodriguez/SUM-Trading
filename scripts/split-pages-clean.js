// scripts/split-pages-clean.js
const fs = require('fs');
const path = require('path');

function splitLocale(locale) {
    // Resolve paths relative to the project root (process.cwd())
    const srcDir = path.join(process.cwd(), 'src', 'locales', locale);
    const pagesFile = path.join(srcDir, 'pages.json');
    const pages = JSON.parse(fs.readFileSync(pagesFile, 'utf8'));

    const outDir = path.join(srcDir, 'pages');
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    // Write each top‑level key to its own JSON file
    Object.entries(pages).forEach(([key, value]) => {
        const filePath = path.join(outDir, `${key}.json`);
        fs.writeFileSync(filePath, JSON.stringify({ [key]: value }, null, 2));
    });

    // Generate index.ts that re‑exports all sections
    const imports = Object.keys(pages)
        .map(k => `import ${k} from './${k}.json';`)
        .join('\n');
    const exportObj = `export default { ${Object.keys(pages).join(', ')} };`;
    const indexContent = `${imports}\n\n${exportObj}\n`;
    fs.writeFileSync(path.join(outDir, 'index.ts'), indexContent);
}

['es', 'en'].forEach(splitLocale);
console.log('✅ Split pages completed');
