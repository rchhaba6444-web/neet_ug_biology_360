
const fs = require('fs');
const path = require('path');

const filesToPatch = [
    'ncert-notes.html',
    'ncert-notes-full.html',
    'mcq-questions.html',
    'mcq-questions-full.html',
    'diagram-booklet.html',
    'diagram-booklet-full.html',
    'mock-test.html',
    'mock-test-full.html'
];

const authNavHtml = `
                <div class="flex items-center space-x-4">
                    <!-- Auth Buttons (shown when logged out) -->
                    <div id="authButtons" class="flex items-center space-x-4">
                        <a href="auth.html"
                            class="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">Login</a>
                        <a href="auth.html"
                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Sign Up</a>
                    </div>
                    <!-- User Menu (shown when logged in) -->
                    <div id="userMenu" class="hidden flex items-center space-x-4">
                        <a href="dashboard.html"
                            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            <i class="fas fa-tachometer-alt mr-2"></i>Dashboard
                        </a>
                        <button onclick="logout()" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                            Logout
                        </button>
                    </div>
                </div>`;

const scriptTag = '\n    <!-- Authentication Script -->\n    <script src="js/auth-ui.js"></script>\n';

filesToPatch.forEach(fileName => {
    const filePath = path.join('c:\\Users\\Laptop\\Downloads\\neet', fileName);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Replace Navigation Buttons
    // Find the div that contains Login/Sign Up buttons
    const navSearchPattern = /<div class="flex items-center space-x-4">[\s\S]*?<button[\s\S]*?Login[\s\S]*?<\/button>[\s\S]*?<button[\s\S]*?Sign Up[\s\S]*?<\/button>[\s\S]*?<\/div>/;

    if (navSearchPattern.test(content)) {
        content = content.replace(navSearchPattern, authNavHtml);
        console.log(`Updated navigation in ${fileName}`);
    } else {
        // Fallback or handle cases where it might be slightly different
        console.warn(`Could not find nav buttons in ${fileName}`);
    }

    // 2. Add Script Tag before </body> if not present
    if (!content.includes('js/auth-ui.js')) {
        content = content.replace('</body>', scriptTag + '</body>');
        console.log(`Added auth script to ${fileName}`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
});
