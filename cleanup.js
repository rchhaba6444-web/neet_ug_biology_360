
const fs = require('fs');
const path = require('path');

const targetFiles = ['ncert-notes.html', 'ncert-notes-full.html'];

targetFiles.forEach(fileName => {
    const filePath = path.join('c:\\Users\\Laptop\\Downloads\\neet', fileName);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // Remove any potential double BOM or weird characters at the start of the snippet
    // The snippet was inserted after grid start tag
    const gridStartTag = '<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">';
    const gridStartIndex = content.indexOf(gridStartTag);

    if (gridStartIndex !== -1) {
        const startOfSnippet = gridStartIndex + gridStartTag.length;
        // Search for the first '<!--' or '<div' after grid start
        let snippetPart = content.substring(startOfSnippet);
        // Remove leading non-tag characters (like the weird )
        snippetPart = snippetPart.replace(/^[^\w<]+/, '');

        content = content.substring(0, startOfSnippet) + '\n' + snippetPart;

        // Count chapters to verify
        const chapterCount = (content.match(/<!-- Chapter \d+ -->/g) || []).length;
        console.log(`${fileName}: Found ${chapterCount} chapters.`);

        fs.writeFileSync(filePath, content, 'utf8');
    }
});
