const fs = require('fs');
try {
    // PowerShell redirection often creates UTF-16LE files
    let content = fs.readFileSync('temp_keys.json', 'utf16le');
    // Remove BOM if present
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }

    let keys;
    try {
        keys = JSON.parse(content);
    } catch (e) {
        // Try UTF-8 if UTF-16LE failed to parse
        content = fs.readFileSync('temp_keys.json', 'utf8');
        keys = JSON.parse(content);
    }

    const myKey = keys.find(k => k.displayName === 'Gemini Chatbot Key');
    if (myKey) {
        console.log('KEY_NAME:' + myKey.name);
    } else {
        console.log('KEY_NOT_FOUND');
        console.log('Available keys:', keys.map(k => k.displayName).join(', '));
    }
} catch (e) {
    console.error('Error:', e.message);
}
