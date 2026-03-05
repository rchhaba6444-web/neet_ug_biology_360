
const fs = require('fs');
const path = require('path');

const chapters = [
    "The Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom",
    "Morphology of Flowering Plants", "Anatomy of Flowering Plants", "Structural Organisation in Animals",
    "Cell: The Unit of Life", "Biomolecules", "Cell Cycle and Cell Division",
    "Photosynthesis in Higher Plants", "Respiration in Plants", "Plant Growth and Development",
    "Breathing and Exchange of Gases", "Body Fluids and Circulation", "Excretory Products and their Elimination",
    "Locomotion and Movement", "Neural Control and Coordination", "Chemical Coordination and Integration",
    "Sexual Reproduction in Flowering Plants", "Human Reproduction", "Reproductive Health",
    "Principles of Inheritance and Variation", "Molecular Basis of Inheritance", "Evolution",
    "Human Health and Disease", "Microbes in Human Welfare", "Biotechnology: Principles and Processes",
    "Biotechnology and its Applications", "Organisms and Populations", "Ecosystem", "Biodiversity and Conservation"
];

const adminOptions = chapters.map((name, i) => `                            <option value="${i + 1}">Chapter ${i + 1}: ${name}</option>`).join('\n');

const apiChaptersList = chapters.map((name, i) => `      { id: ${i + 1}, name: '${name}', subject: 'Biology' }`).join(',\n');

// Patch admin-content.html
const adminHtmlPath = 'c:\\Users\\Laptop\\Downloads\\neet\\admin-content.html';
if (fs.existsSync(adminHtmlPath)) {
    let content = fs.readFileSync(adminHtmlPath, 'utf8');
    const selectTag = '<select id="contentCategory" name="chapter_id"';
    const startIndex = content.indexOf(selectTag);
    if (startIndex !== -1) {
        const selectEndTag = '</select>';
        const closingIndex = content.indexOf(selectEndTag, startIndex);
        if (closingIndex !== -1) {
            const openBracketIndex = content.indexOf('>', startIndex);
            content = content.substring(0, openBracketIndex + 1) + '\n' + adminOptions + '\n                        ' + content.substring(closingIndex);
            fs.writeFileSync(adminHtmlPath, content, 'utf8');
            console.log('Patched admin-content.html');
        }
    }
}

// Patch server.js
const serverJsPath = 'c:\\Users\\Laptop\\Downloads\\neet\\server.js';
if (fs.existsSync(serverJsPath)) {
    let content = fs.readFileSync(serverJsPath, 'utf8');
    const chaptersRoute = "app.get('/api/chapters', (req, res) => {";
    const routeIndex = content.indexOf(chaptersRoute);
    if (routeIndex !== -1) {
        const chaptersListStart = "chapters: [";
        const listStartIndex = content.indexOf(chaptersListStart, routeIndex);
        if (listStartIndex !== -1) {
            const listEndBracket = "]";
            const listEndIndex = content.indexOf(listEndBracket, listStartIndex);
            if (listEndIndex !== -1) {
                content = content.substring(0, listStartIndex + chaptersListStart.length) + '\n' + apiChaptersList + '\n    ' + content.substring(listEndIndex);
                fs.writeFileSync(serverJsPath, content, 'utf8');
                console.log('Patched server.js');
            }
        }
    }
}
