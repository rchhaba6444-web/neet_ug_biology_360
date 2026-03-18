
const fs = require('fs');
const path = require('path');

const class11 = ['The Living World', 'Biological Classification', 'Plant Kingdom', 'Animal Kingdom', 'Morphology of Flowering Plants', 'Anatomy of Flowering Plants', 'Structural Organisation in Animals', 'Cell: The Unit of Life', 'Biomolecules', 'Cell Cycle and Cell Division', 'Photosynthesis in Higher Plants', 'Respiration in Plants', 'Plant Growth and Development', 'Breathing and Exchange of Gases', 'Body Fluids and Circulation', 'Excretory Products and their Elimination', 'Locomotion and Movement', 'Neural Control and Coordination', 'Chemical Coordination and Integration'];
const class12 = ['Sexual Reproduction in Flowering Plants', 'Human Reproduction', 'Reproductive Health', 'Principles of Inheritance and Variation', 'Molecular Basis of Inheritance', 'Evolution', 'Human Health and Disease', 'Microbes in Human Welfare', 'Biotechnology: Principles and Processes', 'Biotechnology and its Applications', 'Organisms and Populations', 'Ecosystem', 'Biodiversity and Conservation'];

function g(t, i, c) {
    const n = c === 11 ? i + 1 : i + 20;
    return `
                <!-- Chapter ${n} -->
                <div class="chapter-card bg-white rounded-lg shadow-lg overflow-hidden">
                    <div class="relative">
                        <div class="locked-content">
                            <img src="https://via.placeholder.com/400x250/4F46E5/FFFFFF?text=Chapter+${n}" alt="Chapter ${n}" class="w-full h-48 object-cover">
                            <div class="flex items-center justify-center text-white">
                                <div class="text-center">
                                    <i class="fas fa-lock text-4xl mb-3"></i>
                                    <p class="font-semibold">Purchase to Access</p>
                                </div>
                            </div>
                        </div>
                        <div class="price-tag">₹200</div>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-gray-800 mb-2">Chapter ${n}: ${t}</h3>
                        <p class="text-gray-600 mb-4">Detailed NCERT notes for ${t}.</p>
                        <div class="flex items-center justify-between">
                            <div class="text-sm text-gray-500">
                                <i class="fas fa-file-pdf mr-1"></i> 25-45 pages
                            </div>
                            <button onclick="accessChapter('chapter-${n}')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Access
                            </button>
                        </div>
                    </div>
                </div>`;
}

let h = `
                <!-- Class 11 Chapters -->
                <div class="col-span-full mb-4">
                    <h2 class="text-2xl font-bold text-blue-700">1st PUC (Class 11) Biology</h2>
                </div>` + class11.map((t, i) => g(t, i, 11)).join('') + `

                <!-- Class 12 Chapters -->
                <div class="col-span-full mt-12 mb-4">
                    <h2 class="text-2xl font-bold text-green-700">2nd PUC (Class 12) Biology</h2>
                </div>` + class12.map((t, i) => g(t, i, 12)).join('');

const targetFiles = ['ncert-notes.html', 'ncert-notes-full.html'];

targetFiles.forEach(fileName => {
    const filePath = path.join('c:\\Users\\Laptop\\Downloads\\neet', fileName);
    if (!fs.existsSync(filePath)) return;

    let buf = fs.readFileSync(filePath);
    let content = '';

    // Check for UTF-16 BOMs
    if (buf[0] === 0xFF && buf[1] === 0xFE) {
        content = buf.toString('utf16le');
    } else if (buf[0] === 0xFE && buf[1] === 0xFF) {
        content = buf.toString('utf16be');
    } else {
        // Try to detect if it's UTF-16 without BOM
        let nulls = 0;
        for (let i = 0; i < Math.min(buf.length, 100); i++) if (buf[i] === 0) nulls++;
        if (nulls > 10) content = buf.toString('utf16le').replace(/\u0000/g, '');
        else content = buf.toString('utf8');
    }

    // Clean any weird characters
    content = content.replace(/\uFFFE|\uFEFF/g, '');

    // Update Counts
    content = content.replace(/22 Chapters/g, '32 Chapters');
    content = content.replace(/All 22 chapters/g, 'All 32 chapters');

    // Replace Grid Inner Content
    const gridStartTag = '<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">';
    const gridStartIndex = content.indexOf(gridStartTag);

    if (gridStartIndex !== -1) {
        const startOfContent = gridStartIndex + gridStartTag.length;
        const restOfContent = content.substring(startOfContent);

        // Find the matching end tag for the grid div or the start of the next section
        const sectionEndTag = '</section>';
        const sectionEndIndex = restOfContent.indexOf(sectionEndTag);

        if (sectionEndIndex !== -1) {
            const sectionContent = restOfContent.substring(0, sectionEndIndex);
            const lastDivIndex = sectionContent.lastIndexOf('</div>');

            if (lastDivIndex !== -1) {
                const finalContent = content.substring(0, startOfContent) + h + '\n            ' + content.substring(startOfContent + lastDivIndex);
                fs.writeFileSync(filePath, finalContent, 'utf8');
                console.log(`Re-Patched ${fileName} (UTF-8)`);
            }
        }
    }
});
