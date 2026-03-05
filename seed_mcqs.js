const db = require('./database');

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

const categories = [
    { name: 'single', count: 10, label: 'Single line MCQ' },
    { name: 'diagram', count: 10, label: 'Diagram based MCQ' },
    { name: 'case', count: 10, label: 'Case based question' },
    { name: 'assertion', count: 5, label: 'Assertion and reasoning' },
    { name: 'match', count: 5, label: 'Match the following' },
    { name: 'medium', count: 20, label: 'Medium difficult MCQ' }
];

async function seedMCQs() {
    console.log("Starting MCQ Seeding...");

    // Clear existing MCQs if any (optional, but good for fresh seed)
    await new Promise((resolve, reject) => {
        db.run("DELETE FROM mcqs", (err) => {
            if (err) reject(err);
            else resolve();
        });
    });

    for (let i = 0; i < chapters.length; i++) {
        const chapterId = i + 1;
        const chapterName = chapters[i];
        console.log(`Generating questions for Chapter ${chapterId}: ${chapterName}`);

        const questions = [];

        categories.forEach(cat => {
            for (let j = 0; j < cat.count; j++) {
                let questionText = "";
                let options = [];
                let correctIndex = 0;
                let solution = "";

                if (cat.name === 'single') {
                    questionText = `Identify the correct statement about ${chapterName} regarding fundamental concepts.`;
                    options = ["Option A - Basic detail", "Option B - Important insight", "Option C - Crucial observation", "Option D - Concluding remark"];
                    correctIndex = 1;
                    solution = "The correct answer is Option B because it aligns with the core principles of the chapter.";
                } else if (cat.name === 'diagram') {
                    questionText = `Observe the provided diagram in Chapter ${chapterId} and identify the part labeled 'X'.`;
                    options = ["Part 1", "Part 2", "Part 3", "Part 4"];
                    correctIndex = 2;
                    solution = "Labeled part X represents the structural component responsible for the specific function described in the NCERT text.";
                } else if (cat.name === 'case') {
                    questionText = `Case Study: A researcher observing ${chapterName} noticed a specific variation. What would be the most likely cause?`;
                    options = ["Factor 1", "Factor 2", "Factor 3", "Factor 4"];
                    correctIndex = 0;
                    solution = "Based on the case analysis, Factor 1 is the primary driver for the observed variations in this biological process.";
                } else if (cat.name === 'assertion') {
                    questionText = `Assertion (A): ${chapterName} is essential for organism survival. \nReasoning (R): It facilitates energy transfer.`;
                    options = ["Both A and R are true and R is correct explanation", "Both A and R are true but R is not correct explanation", "A is true but R is false", "A is false but R is true"];
                    correctIndex = 0;
                    solution = "The assertion is a direct fact from the textbook, and the reason correctly explains the underlying mechanism.";
                } else if (cat.name === 'match') {
                    questionText = `Match List I with List II for ${chapterName}.\nList I: (P) Process X, (Q) Process Y\nList II: (1) Outcome A, (2) Outcome B`;
                    options = ["P-1, Q-2", "P-2, Q-1", "P-1, Q-1", "P-2, Q-2"];
                    correctIndex = 1;
                    solution = "Matching accurately based on the definitions provided in the chapter sections.";
                } else if (cat.name === 'medium') {
                    questionText = `Which complex mechanism in ${chapterName} involves the interaction of multiple physiological triggers?`;
                    options = ["Mechanism A", "Mechanism B", "Mechanism C", "Mechanism D"];
                    correctIndex = 3;
                    solution = "Mechanism D is a multi-step process that is detailed in the later part of the chapter.";
                }

                questions.push({
                    chapterId,
                    question: questionText,
                    options: JSON.stringify(options),
                    correctIndex,
                    category: cat.name,
                    solution
                });
            }
        });

        // Bulk insert questions for this chapter
        await new Promise((resolve, reject) => {
            const stmt = db.prepare("INSERT INTO mcqs (chapter_id, question, options, correct_index, category, solution) VALUES (?, ?, ?, ?, ?, ?)");
            questions.forEach(q => {
                stmt.run(q.chapterId, q.question, q.options, q.correctIndex, q.category, q.solution);
            });
            stmt.finalize((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    console.log("Seeding Completed! 1,920 questions added.");
    process.exit(0);
}

seedMCQs().catch(err => {
    console.error("Seeding Failed:", err);
    process.exit(1);
});
