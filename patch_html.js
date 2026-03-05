
const fs = require('fs');
const path = require('path');

const targetFiles = ['ncert-notes.html', 'ncert-notes-full.html'];
const chaptersHtml = fs.readFileSync('chapters_html.txt', 'utf8');

targetFiles.forEach(fileName => {
    const filePath = path.join('c:\\Users\\Laptop\\Downloads\\neet', fileName);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // Update Counts
    content = content.replace(/22 Chapters/g, '32 Chapters');
    content = content.replace(/All 22 chapters/g, 'All 32 chapters');

    // Update Grid
    // We look for the start of the grid and replace the entire grid content
    // For ncert-notes.html, the grid is between <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"> and </div>
    // However, the "More chapters..." placeholder makes it tricky.
    // I'll use a more robust regex or just replace the inner content of the grid container.

    const gridStartTag = '<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">';
    const gridStartIndex = content.indexOf(gridStartTag);

    if (gridStartIndex !== -1) {
        const startOfContent = gridStartIndex + gridStartTag.length;
        // Find the closing div of the grid. It's the one before </section>
        const restOfContent = content.substring(startOfContent);
        const sectionEndTag = '</section>';
        const sectionEndIndex = restOfContent.indexOf(sectionEndTag);

        if (sectionEndIndex !== -1) {
            // Find the last </div> before the section ends
            const sectionContent = restOfContent.substring(0, sectionEndIndex);
            const lastDivIndex = sectionContent.lastIndexOf('</div>');

            if (lastDivIndex !== -1) {
                const newContent = content.substring(0, startOfContent) + chaptersHtml + '\n            ' + content.substring(startOfContent + lastDivIndex);
                fs.writeFileSync(filePath, newContent);
                console.log(`Patched ${fileName}`);
            }
        }
    }
});
