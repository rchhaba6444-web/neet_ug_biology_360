const fs = require('fs');
const path = require('path');

const units = [
    {
        name: "UNIT I: Diversity in the Living World",
        chapters: [
            { id: 1, name: "The Living World" },
            { id: 2, name: "Biological Classification" },
            { id: 3, name: "Plant Kingdom" },
            { id: 4, name: "Animal Kingdom" }
        ]
    },
    {
        name: "UNIT II: Structural Organisation in Plants and Animals",
        chapters: [
            { id: 5, name: "Morphology of Flowering Plants" },
            { id: 6, name: "Anatomy of Flowering Plants" },
            { id: 7, name: "Structural Organisation in Animals" }
        ]
    },
    {
        name: "UNIT III: Cell: Structure and Functions",
        chapters: [
            { id: 8, name: "Cell: The Unit of Life" },
            { id: 9, name: "Biomolecules" },
            { id: 10, name: "Cell Cycle and Cell Division" }
        ]
    },
    {
        name: "UNIT IV: Plant Physiology",
        chapters: [
            { id: 11, name: "Photosynthesis in Higher Plants" },
            { id: 12, name: "Respiration in Plants" },
            { id: 13, name: "Plant Growth and Development" }
        ]
    },
    {
        name: "UNIT V: Human Physiology",
        chapters: [
            { id: 14, name: "Breathing and Exchange of Gases" },
            { id: 15, name: "Body Fluids and Circulation" },
            { id: 16, name: "Excretory Products and their Elimination" },
            { id: 17, name: "Locomotion and Movement" },
            { id: 18, name: "Neural Control and Coordination" },
            { id: 19, name: "Chemical Coordination and Integration" }
        ]
    },
    {
        name: "UNIT VI: Reproduction",
        chapters: [
            { id: 20, name: "Sexual Reproduction in Flowering Plants" },
            { id: 21, name: "Human Reproduction" },
            { id: 22, name: "Reproductive Health" }
        ]
    },
    {
        name: "UNIT VII: Genetics and Evolution",
        chapters: [
            { id: 23, name: "Principles of Inheritance and Variation" },
            { id: 24, name: "Molecular Basis of Inheritance" },
            { id: 25, name: "Evolution" }
        ]
    },
    {
        name: "UNIT VIII: Biology in Human Welfare",
        chapters: [
            { id: 26, name: "Human Health and Disease" },
            { id: 27, name: "Microbes in Human Welfare" }
        ]
    },
    {
        name: "UNIT IX: Biotechnology",
        chapters: [
            { id: 28, name: "Biotechnology: Principles and Processes" },
            { id: 29, name: "Biotechnology and its Applications" }
        ]
    },
    {
        name: "UNIT X: Ecology and Environment",
        chapters: [
            { id: 30, name: "Organisms and Populations" },
            { id: 31, name: "Ecosystem" },
            { id: 32, name: "Biodiversity and Conservation" }
        ]
    }
];

function generateMcqGridHtml() {
    let html = '';
    units.forEach(unit => {
        html += `
            <!-- ${unit.name} -->
            <div class="col-span-full mt-12 mb-6">
                <div class="flex items-center space-x-4">
                    <div class="h-1 flex-grow bg-gradient-to-r from-green-600 to-transparent"></div>
                    <h2 class="text-2xl font-bold text-gray-800 uppercase tracking-wider">${unit.name}</h2>
                    <div class="h-1 flex-grow bg-gradient-to-l from-green-600 to-transparent"></div>
                </div>
            </div>
        `;

        unit.chapters.forEach(ch => {
            html += `
                <!-- Chapter ${ch.id} -->
                <div class="chapter-card bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
                    <div class="relative">
                        <div class="locked-content">
                            <img src="https://via.placeholder.com/400x250/10B981/FFFFFF?text=Chapter+${ch.id}+MCQ" alt="${ch.name} MCQ" class="w-full h-48 object-cover">
                            <div class="flex items-center justify-center text-white">
                                <div class="text-center">
                                    <i class="fas fa-lock text-4xl mb-3"></i>
                                    <p class="font-semibold">Purchase to Access</p>
                                </div>
                            </div>
                        </div>
                        <div class="price-tag">₹200</div>
                        <div class="absolute top-4 left-4 z-20">
                            <span class="question-count bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">60 Questions</span>
                        </div>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-gray-800 mb-2 truncate" title="${ch.name}">Chapter ${ch.id}: ${ch.name}</h3>
                        <p class="text-gray-600 mb-4 text-sm line-clamp-2">60 high-quality MCQs including Single line, Case-based, Assertion-Reasoning and more.</p>
                        <div class="flex items-center justify-between">
                            <div class="text-xs text-gray-500 font-medium">
                                <i class="fas fa-check-circle text-green-500 mr-1"></i> Solutions Included
                            </div>
                            <button onclick="accessMcqViewer(${ch.id}, '${ch.name}')" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg font-bold">
                                Solve Now
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    });
    return html;
}

const filesToPatch = ['mcq-questions.html', 'mcq-questions-full.html'];

filesToPatch.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // Replace the grid content
    const startMarker = '<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">';
    const endMarker = '</div>\n        </div>\n    </section>'; // This might be tricky, let's use a more robust regex if possible

    // Simpler approach: find the entire content between the grid start and the next section start
    const gridRegex = new RegExp(`${startMarker}[\\s\\S]*?<!-- Case Based Questions Section -->`, 'm');
    const newGridContent = `${startMarker}${generateMcqGridHtml()}\n            </div>\n        </div>\n    </section>\n\n    <!-- Case Based Questions Section -->`;

    const updatedContent = content.replace(gridRegex, newGridContent);

    // Also update the access function and hero stats
    let finalContent = updatedContent
        .replace(/2100\+ Questions/g, '1,920+ Questions')
        .replace(/2100\+ questions/g, '1,920+ questions')
        .replace(/22 Chapters/g, '32 Chapters')
        .replace(/accessChapter\([^)]*\)/g, "accessMcqViewer(1, 'The Living World')"); // Default one for global purchase

    // Add accessMcqViewer script
    const scriptMarker = '</script>\n\n    <!-- Authentication Script -->';
    const newScript = `
        function accessMcqViewer(chapterId, chapterName) {
            // Check if user is logged in
            if (!localStorage.getItem('token')) {
                alert('Please login to access MCQ questions.');
                window.location.href = 'auth.html';
                return;
            }
            // For now, redirect to viewer with chapter info (viewer will handle premium check)
            window.location.href = \`mcq-viewer.html?chapter_id=\${chapterId}&chapter_name=\${encodeURIComponent(chapterName)}\`;
        }
    </script>

    <!-- Authentication Script -->`;

    finalContent = finalContent.replace(scriptMarker, newScript);

    fs.writeFileSync(filePath, finalContent);
    console.log(`Patched ${file}`);
});
