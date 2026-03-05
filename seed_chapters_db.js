const db = require('./database');

const units = [
    {
        name: "UNIT I: Diversity in the Living World",
        chapters: ["The Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom"]
    },
    {
        name: "UNIT II: Structural Organisation in Plants and Animals",
        chapters: ["Morphology of Flowering Plants", "Anatomy of Flowering Plants", "Structural Organisation in Animals"]
    },
    {
        name: "UNIT III: Cell: Structure and Functions",
        chapters: ["Cell: The Unit of Life", "Biomolecules", "Cell Cycle and Cell Division"]
    },
    {
        name: "UNIT IV: Plant Physiology",
        chapters: ["Photosynthesis in Higher Plants", "Respiration in Plants", "Plant Growth and Development"]
    },
    {
        name: "UNIT V: Human Physiology",
        chapters: ["Breathing and Exchange of Gases", "Body Fluids and Circulation", "Excretory Products and their Elimination", "Locomotion and Movement", "Neural Control and Coordination", "Chemical Coordination and Integration"]
    },
    {
        name: "UNIT VI: Reproduction",
        chapters: ["Sexual Reproduction in Flowering Plants", "Human Reproduction", "Reproductive Health"]
    },
    {
        name: "UNIT VII: Genetics and Evolution",
        chapters: ["Principles of Inheritance and Variation", "Molecular Basis of Inheritance", "Evolution"]
    },
    {
        name: "UNIT VIII: Biology in Human Welfare",
        chapters: ["Human Health and Disease", "Microbes in Human Welfare"]
    },
    {
        name: "UNIT IX: Biotechnology",
        chapters: ["Biotechnology: Principles and Processes", "Biotechnology and its Applications"]
    },
    {
        name: "UNIT X: Ecology and Environment",
        chapters: ["Organisms and Populations", "Ecosystem", "Biodiversity and Conservation"]
    }
];

async function seedChapters() {
    console.log("Seeding Chapters database...");

    await new Promise((resolve, reject) => {
        db.run("DELETE FROM chapters", (err) => {
            if (err) reject(err);
            else resolve();
        });
    });

    for (const unit of units) {
        for (const chapterName of unit.chapters) {
            await new Promise((resolve, reject) => {
                db.run("INSERT INTO chapters (name, unit) VALUES (?, ?)", [chapterName, unit.name], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        }
    }

    console.log("Chapters seeded successfully!");
    process.exit(0);
}

seedChapters().catch(err => {
    console.error("Failed to seed chapters:", err);
    process.exit(1);
});
