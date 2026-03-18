
const class11Chapters = [
    "The Living World",
    "Biological Classification",
    "Plant Kingdom",
    "Animal Kingdom",
    "Morphology of Flowering Plants",
    "Anatomy of Flowering Plants",
    "Structural Organisation in Animals",
    "Cell: The Unit of Life",
    "Biomolecules",
    "Cell Cycle and Cell Division",
    "Photosynthesis in Higher Plants",
    "Respiration in Plants",
    "Plant Growth and Development",
    "Breathing and Exchange of Gases",
    "Body Fluids and Circulation",
    "Excretory Products and their Elimination",
    "Locomotion and Movement",
    "Neural Control and Coordination",
    "Chemical Coordination and Integration"
];

const class12Chapters = [
    "Sexual Reproduction in Flowering Plants",
    "Human Reproduction",
    "Reproductive Health",
    "Principles of Inheritance and Variation",
    "Molecular Basis of Inheritance",
    "Evolution",
    "Human Health and Disease",
    "Microbes in Human Welfare",
    "Biotechnology: Principles and Processes",
    "Biotechnology and its Applications",
    "Organisms and Populations",
    "Ecosystem",
    "Biodiversity and Conservation"
];

function generateCard(title, index, classNum) {
    const chapterNum = index + 1;
    const globalChapterNum = classNum === 11 ? chapterNum : chapterNum + 19;
    return `
                <!-- Chapter ${globalChapterNum} -->
                <div class="chapter-card bg-white rounded-lg shadow-lg overflow-hidden">
                    <div class="relative">
                        <div class="locked-content">
                            <img src="https://via.placeholder.com/400x250/4F46E5/FFFFFF?text=Chapter+${globalChapterNum}" alt="Chapter ${globalChapterNum}" class="w-full h-48 object-cover">
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
                        <h3 class="text-xl font-bold text-gray-800 mb-2">Chapter ${globalChapterNum}: ${title}</h3>
                        <p class="text-gray-600 mb-4">Detailed NCERT notes including key concepts, diagrams and summary.</p>
                        <div class="flex items-center justify-between">
                            <div class="text-sm text-gray-500">
                                <i class="fas fa-file-pdf mr-1"></i> 20-40 pages
                            </div>
                            <button onclick="accessChapter('chapter-${globalChapterNum}')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Access
                            </button>
                        </div>
                    </div>
                </div>`;
}

console.log("<!-- Class 11 Chapters (1st PUC) -->");
console.log('<div class="col-span-full mt-12 mb-8"><h2 class="text-3xl font-bold text-gray-800 border-b-4 border-blue-600 inline-block pb-2">Class 11 (1st PUC Biology)</h2></div>');
class11Chapters.forEach((title, i) => console.log(generateCard(title, i, 11)));

console.log("\n<!-- Class 12 Chapters (2nd PUC) -->");
console.log('<div class="col-span-full mt-12 mb-8"><h2 class="text-3xl font-bold text-gray-800 border-b-4 border-green-600 inline-block pb-2">Class 12 (2nd PUC Biology)</h2></div>');
class12Chapters.forEach((title, i) => console.log(generateCard(title, i, 12)));
