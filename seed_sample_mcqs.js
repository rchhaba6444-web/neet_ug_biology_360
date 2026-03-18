const db = require('./database');

// Sample MCQ data to populate the database
const sampleMCQs = [
  {
    chapter_id: 1,
    question: "Which of the following is considered the basic unit of life?",
    options: JSON.stringify(["Organ", "Tissue", "Cell", "Organ System"]),
    correct_answer: 2,
    category: "single",
    solution: "The cell is the structural and functional unit of life. All living organisms are composed of cells.",
    difficulty: "easy"
  },
  {
    chapter_id: 1,
    question: "Who proposed the cell theory?",
    options: JSON.stringify(["Schleiden and Schwann", "Robert Hooke", "Anton van Leeuwenhoek", "Rudolf Virchow"]),
    correct_answer: 0,
    category: "single",
    solution: "Matthias Schleiden and Theodor Schwann proposed the cell theory in 1838-1839.",
    difficulty: "medium"
  },
  {
    chapter_id: 1,
    question: "Which organelle is known as the powerhouse of the cell?",
    options: JSON.stringify(["Nucleus", "Ribosome", "Mitochondria", "Endoplasmic Reticulum"]),
    correct_answer: 2,
    category: "single",
    solution: "Mitochondria are known as the powerhouse of the cell because they generate most of the cell's supply of ATP.",
    difficulty: "easy"
  },
  {
    chapter_id: 2,
    question: "Which kingdom includes multicellular eukaryotic autotrophs?",
    options: JSON.stringify(["Monera", "Protista", "Fungi", "Plantae"]),
    correct_answer: 3,
    category: "single",
    solution: "Kingdom Plantae includes multicellular eukaryotic autotrophs that perform photosynthesis.",
    difficulty: "easy"
  },
  {
    chapter_id: 2,
    question: "Bacteriophages are viruses that infect:",
    options: JSON.stringify(["Plants", "Bacteria", "Fungi", "Protozoa"]),
    correct_answer: 1,
    category: "single",
    solution: "Bacteriophages are viruses that specifically infect bacteria.",
    difficulty: "medium"
  },
  {
    chapter_id: 3,
    question: "In which group of plants do we find the archegonium?",
    options: JSON.stringify(["Angiosperms", "Gymnosperms", "Bryophytes", "Algae"]),
    correct_answer: 2,
    category: "single",
    solution: "Archegonium is the female sex organ found in bryophytes, pteridophytes, and gymnosperms.",
    difficulty: "medium"
  },
  {
    chapter_id: 4,
    question: "Which phylum includes animals with cnidoblasts?",
    options: JSON.stringify(["Porifera", "Coelenterata", "Platyhelminthes", "Aschelminthes"]),
    correct_answer: 1,
    category: "single",
    solution: "Cnidoblasts (or cnidocytes) are specialized cells found in cnidarians (Coelenterata) that contain nematocysts.",
    difficulty: "medium"
  },
  {
    chapter_id: 5,
    question: "Root hairs develop from which region of the root?",
    options: JSON.stringify(["Region of elongation", "Region of maturation", "Region of meristematic activity", "Root cap"]),
    correct_answer: 1,
    category: "single",
    solution: "Root hairs develop from the epidermal cells in the region of maturation (zone of differentiation).",
    difficulty: "medium"
  },
  {
    chapter_id: 6,
    question: "Casparian strips are present in which part of the root?",
    options: JSON.stringify(["Epidermis", "Endodermis", "Pericycle", "Cortex"]),
    correct_answer: 1,
    category: "single",
    solution: "Casparian strips are bands of suberin deposition in the radial and transverse walls of endodermal cells.",
    difficulty: "hard"
  },
  {
    chapter_id: 7,
    question: "Which type of tissue is responsible for secondary growth in plants?",
    options: JSON.stringify(["Apical meristem", "Intercalary meristem", "Lateral meristem", "Permanent tissue"]),
    correct_answer: 2,
    category: "single",
    solution: "Lateral meristems like vascular cambium and cork cambium are responsible for secondary growth (increase in girth).",
    difficulty: "medium"
  },
  {
    chapter_id: 8,
    question: "Which organelle is involved in photorespiration?",
    options: JSON.stringify(["Mitochondria", "Peroxisome", "Chloroplast", "All of the above"]),
    correct_answer: 3,
    category: "single",
    solution: "Photorespiration involves all three organelles: chloroplasts, peroxisomes, and mitochondria in a coordinated manner.",
    difficulty: "hard"
  },
  {
    chapter_id: 9,
    question: "Which biomolecule is the primary component of cell membranes?",
    options: JSON.stringify(["Proteins", "Carbohydrates", "Lipids", "Nucleic acids"]),
    correct_answer: 2,
    category: "single",
    solution: "Phospholipids are the primary lipid components of cell membranes, forming the bilayer structure.",
    difficulty: "easy"
  },
  {
    chapter_id: 10,
    question: "During which phase of mitosis do chromatids separate?",
    options: JSON.stringify(["Prophase", "Metaphase", "Anaphase", "Telophase"]),
    correct_answer: 2,
    category: "single",
    solution: "During anaphase, sister chromatids separate and move to opposite poles of the cell.",
    difficulty: "medium"
  },
  {
    chapter_id: 11,
    question: "In which part of chloroplast does the light reaction occur?",
    options: JSON.stringify(["Stroma", "Thylakoids", "Matrix", "Outer membrane"]),
    correct_answer: 1,
    category: "single",
    solution: "Light reactions (photo reactions) of photosynthesis occur in the thylakoid membranes.",
    difficulty: "medium"
  },
  {
    chapter_id: 12,
    question: "Which enzyme is responsible for CO2 fixation in C3 plants?",
    options: JSON.stringify(["PEP carboxylase", "RuBisCO", "ATP synthase", "NADP reductase"]),
    correct_answer: 1,
    category: "single",
    solution: "RuBisCO (Ribulose bisphosphate carboxylase oxygenase) is the enzyme responsible for CO2 fixation in C3 plants.",
    difficulty: "medium"
  },
  {
    chapter_id: 13,
    question: "Which hormone promotes cell division?",
    options: JSON.stringify(["Auxin", "Cytokinin", "Gibberellin", "Ethylene"]),
    correct_answer: 1,
    category: "single",
    solution: "Cytokinins promote cell division along with auxins, but cytokinins are primarily responsible for cell division.",
    difficulty: "medium"
  },
  {
    chapter_id: 14,
    question: "Which pigment is responsible for photoperiodic response?",
    options: JSON.stringify(["Chlorophyll", "Carotenoids", "Phytochrome", "Anthocyanin"]),
    correct_answer: 2,
    category: "single",
    solution: "Phytochrome is the blue-colored protein pigment that mediates photoperiodic responses in plants.",
    difficulty: "hard"
  },
  {
    chapter_id: 15,
    question: "Which chamber of heart receives oxygenated blood?",
    options: JSON.stringify(["Right atrium", "Right ventricle", "Left atrium", "Left ventricle"]),
    correct_answer: 2,
    category: "single",
    solution: "The left atrium receives oxygenated blood from the lungs via pulmonary veins.",
    difficulty: "easy"
  },
  {
    chapter_id: 16,
    question: "Which hormone regulates calcium levels in blood?",
    options: JSON.stringify(["Insulin", "Parathyroid hormone", "Thyroxine", "Adrenaline"]),
    correct_answer: 1,
    category: "single",
    solution: "Parathyroid hormone (PTH) regulates calcium levels in the blood by increasing calcium absorption.",
    difficulty: "medium"
  },
  {
    chapter_id: 17,
    question: "Which muscle is responsible for normal breathing?",
    options: JSON.stringify(["Intercostal muscles", "Diaphragm", "Abdominal muscles", "Pectoral muscles"]),
    correct_answer: 1,
    category: "single",
    solution: "The diaphragm is the primary muscle responsible for breathing, contracting to increase thoracic volume.",
    difficulty: "easy"
  }
];

// Function to insert sample MCQs into the database
function seedMCQs() {
  console.log('Seeding sample MCQs into the database...');
  
  db.serialize(() => {
    // First, drop the existing mcqs table if it exists
    db.run('DROP TABLE IF EXISTS mcqs_backup;');
    
    // Create the MCQs table with the correct schema
    db.run(`
      CREATE TABLE IF NOT EXISTS mcqs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chapter_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        options TEXT NOT NULL, -- JSON array of options
        correct_answer INTEGER NOT NULL,
        category TEXT NOT NULL, -- single, diagram, case, assertion, match, medium
        solution TEXT,
        image_url TEXT,
        difficulty TEXT DEFAULT 'medium',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Insert sample MCQs
    sampleMCQs.forEach((mcq, index) => {
      db.run(
        'INSERT INTO mcqs (chapter_id, question, options, correct_answer, category, solution, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          mcq.chapter_id,
          mcq.question,
          mcq.options,
          mcq.correct_answer,
          mcq.category,
          mcq.solution,
          mcq.difficulty
        ],
        function(err) {
          if (err) {
            console.error(`Error inserting MCQ ${index + 1}:`, err);
          } else {
            console.log(`Inserted MCQ ${this.lastID}: ${mcq.question.substring(0, 50)}...`);
          }
        }
      );
    });
    
    console.log('Sample MCQs seeding completed!');
  });
  
  // Close the database connection after a delay to allow all inserts to complete
  setTimeout(() => {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed.');
      }
    });
  }, 2000);
}

// Run the seeding function
seedMCQs();