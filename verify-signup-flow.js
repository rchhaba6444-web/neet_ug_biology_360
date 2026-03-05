const http = require('http');
const fs = require('fs');
const path = require('path');

async function testSignup() {
    console.log("🚀 Testing Signup with Phone and Notification...");

    const signupData = JSON.stringify({
        username: 'testuser_' + Date.now(),
        email: 'test_' + Date.now() + '@example.com',
        phone: '9513102159',
        password: 'password123'
    });

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/signup',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': signupData.length
        }
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log(`Status Code: ${res.statusCode}`);
            console.log(`Response: ${data}`);

            if (res.statusCode === 201) {
                console.log("✅ Signup successful!");
                verifyDatabase(JSON.parse(signupData).username);
            } else {
                console.log("❌ Signup failed!");
            }
        });
    });

    req.on('error', (error) => {
        console.error(`Error: ${error.message}`);
    });

    req.write(signupData);
    req.end();
}

function verifyDatabase(username) {
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database(path.join(__dirname, 'neet.db'));

    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            console.error("❌ DB Error:", err.message);
        } else if (row) {
            console.log("✅ User found in database.");
            console.log(`📊 Phone stored: ${row.phone}`);
            if (row.phone === '9513102159') {
                console.log("✅ Phone number correctly stored.");
            } else {
                console.log("❌ Phone number mismatch.");
            }
        } else {
            console.log("❌ User NOT found in database.");
        }
        db.close();
    });
}

testSignup();
