
const fs = require('fs');
const path = require('path');

const class11 = [
    { unit: "UNIT I: Diversity in the Living World", chapters: ["The Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom"] },
    { unit: "UNIT II: Structural Organisation in Plants and Animals", chapters: ["Morphology of Flowering Plants", "Anatomy of Flowering Plants", "Structural Organisation in Animals"] },
    { unit: "UNIT III: Cell: Structure and Functions", chapters: ["Cell: The Unit of Life", "Biomolecules", "Cell Cycle and Cell Division"] },
    { unit: "UNIT IV: Plant Physiology", chapters: ["Photosynthesis in Higher Plants", "Respiration in Plants", "Plant Growth and Development"] },
    { unit: "UNIT V: Human Physiology", chapters: ["Breathing and Exchange of Gases", "Body Fluids and Circulation", "Excretory Products and their Elimination", "Locomotion and Movement", "Neural Control and Coordination", "Chemical Coordination and Integration"] }
];

const class12 = [
    { unit: "UNIT VI: Reproduction", chapters: ["Sexual Reproduction in Flowering Plants", "Human Reproduction", "Reproductive Health"] },
    { unit: "UNIT VII: Genetics and Evolution", chapters: ["Principles of Inheritance and Variation", "Molecular Basis of Inheritance", "Evolution"] },
    { unit: "UNIT VIII: Biology in Human Welfare", chapters: ["Human Health and Disease", "Microbes in Human Welfare"] },
    { unit: "UNIT IX: Biotechnology", chapters: ["Biotechnology: Principles and Processes", "Biotechnology and its Applications"] },
    { unit: "UNIT X: Ecology", chapters: ["Organisms and Populations", "Ecosystem", "Biodiversity and Conservation"] }
];

let globalCounter = 1;

function generateUnitHeader(title, color) {
    return `
                <!-- ${title} -->
                <div class="col-span-full mt-8 mb-4">
                    <h3 class="text-xl font-bold text-${color}-600 bg-${color}-50 px-4 py-2 rounded-lg border-l-4 border-${color}-600">${title}</h3>
                </div>`;
}

function generateChapterCard(title, num) {
    return `
                <!-- Chapter ${num} -->
                <div class="chapter-card bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
                    <div class="relative">
                        <div class="locked-content">
                            <img src="images/biology-image.png" alt="Chapter ${num}" class="w-full h-48 object-cover">
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
                        <h3 class="text-lg font-bold text-gray-800 mb-2">Chapter ${num}: ${title}</h3>
                        <p class="text-sm text-gray-600 mb-4 line-clamp-2">Official NCERT Biology notes for NEET preparation. Comprehensive coverage of all topics.</p>
                        <div class="flex items-center justify-between">
                            <div class="text-xs text-gray-500">
                                <i class="fas fa-file-pdf mr-1"></i> PDF Available
                            </div>
                            <button onclick="accessChapter('chapter-${num}')" class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                Access Note
                            </button>
                        </div>
                    </div>
                </div>`;
}

let h = `
                <!-- Class 11 Header -->
                <div class="col-span-full mb-6">
                    <div class="bg-blue-600 text-white px-6 py-4 rounded-xl shadow-lg">
                        <h2 class="text-3xl font-bold flex items-center">
                            <i class="fas fa-graduation-cap mr-3"></i> 1st PUC (Class 11) Biology
                        </h2>
                        <p class="opacity-90 mt-1">Foundational concepts for NEET UG preparation</p>
                    </div>
                </div>`;

class11.forEach(u => {
    h += generateUnitHeader(u.unit, "blue");
    u.chapters.forEach(c => {
        h += generateChapterCard(c, globalCounter++);
    });
});

h += `
                <!-- Class 12 Header -->
                <div class="col-span-full mt-16 mb-6">
                    <div class="bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg">
                        <h2 class="text-3xl font-bold flex items-center">
                            <i class="fas fa-user-graduate mr-3"></i> 2nd PUC (Class 12) Biology
                        </h2>
                        <p class="opacity-90 mt-1">Advanced topics and high-weightage chapters for NEET</p>
                    </div>
                </div>`;

class12.forEach(u => {
    h += generateUnitHeader(u.unit, "green");
    u.chapters.forEach(c => {
        h += generateChapterCard(c, globalCounter++);
    });
});

const targetFiles = ['ncert-notes.html', 'ncert-notes-full.html'];

targetFiles.forEach(fileName => {
    const filePath = path.join(__dirname, fileName);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // Update Counts (just in case)
    content = content.replace(/22 Chapters/g, '32 Chapters');
    content = content.replace(/All 22 chapters/g, 'All 32 chapters');

    const gridStartTag = '<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">';
    const gridStartIndex = content.indexOf(gridStartTag);

    if (gridStartIndex !== -1) {
        const startOfContent = gridStartIndex + gridStartTag.length;
        const restOfContent = content.substring(startOfContent);
        const sectionEndTag = '</section>';
        const sectionEndIndex = restOfContent.indexOf(sectionEndTag);

        if (sectionEndIndex !== -1) {
            const sectionContent = restOfContent.substring(0, sectionEndIndex);
            const lastDivIndex = sectionContent.lastIndexOf('</div>');

            if (lastDivIndex !== -1) {
                const finalContent = content.substring(0, startOfContent) + h + '\n            ' + content.substring(startOfContent + lastDivIndex);
                fs.writeFileSync(filePath, finalContent, 'utf8');
                console.log(`Updated ${fileName} with Unit Headers`);
            }
        }
    }
});
