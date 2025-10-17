// CTF Challenge - Main JavaScript File

// Load popup HTML and initialize
fetch('../../js-injection/popup.html')
    .then(res => res.text())
    .then(html => {
        document.body.insertAdjacentHTML('beforeend', html);
        initPopupLogic();
    });

/**
 * Initialize popup functionality
 */
function initPopupLogic() {
    const popup = document.getElementById('popup');
    const popupBody = document.getElementById('popup-body');
    const closeBtn = document.querySelector('.close-btn');
    const challengeElements = document.querySelectorAll('.challenge');

    // Add click listeners to challenge elements
    challengeElements.forEach((el) => {
        el.addEventListener('click', () => {
            const storyline = el.dataset.storyline;
            const challengeNumber = parseInt(el.dataset.challenge, 10);

            popupBody.innerHTML = getPopupContent(storyline, challengeNumber);
            
            // Reset form elements
            const hidden = document.getElementById('challengeId');
            if (hidden) hidden.value = String(challengeNumber);

            const userInput = document.getElementById('userInput');
            if (userInput) userInput.value = '';

            const submitMessage = document.getElementById('submitMessage');
            if (submitMessage) submitMessage.textContent = '';

            popup.style.display = 'flex';
        });
    });

    // Close popup functionality
    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    window.addEventListener('click', e => {
        if (e.target === popup) {
            popup.style.display = 'none';
        }
    });

    // Handle flag submission
    const flagForm = document.getElementById('flagForm');
    if (flagForm) {
        flagForm.addEventListener('submit', handleFlagSubmission);
    }
}

/**
 * Handle flag form submission
 */
async function handleFlagSubmission(e) {
    e.preventDefault();

    const challenge = document.getElementById('challengeId')?.value;
    const answer = document.getElementById('userInput')?.value.trim();
    const submitMessage = document.getElementById('submitMessage');

    // Show loading state
    if (submitMessage) {
        submitMessage.textContent = 'Checking...';
        submitMessage.style.color = 'black';
    }

    // Validate input
    if (!challenge || !answer) {
        if (submitMessage) {
            submitMessage.textContent = 'Please provide an answer.';
            submitMessage.style.color = 'red';
        }
        return;
    }

    try {
        const res = await fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ challenge, answer })
        });

        const data = await res.json();

        if (res.ok && data.success) {
            if (submitMessage) {
                submitMessage.textContent = data.message || 'Correct!';
                submitMessage.style.color = 'green';
            }
        } else {
            if (submitMessage) {
                submitMessage.textContent = data.message || 'Incorrect flag.';
                submitMessage.style.color = 'red';
            }
        }
    } catch (err) {
        console.error('Flag submit error:', err);
        if (submitMessage) {
            submitMessage.textContent = 'Network error — could not contact server.';
            submitMessage.style.color = 'red';
        }
    }
}

/**
 * Get popup content based on storyline and challenge number
 */
function getPopupContent(storyline, challengeNumber) {
    if (storyline === 'talon') {
        switch (challengeNumber) {
            case 1:
                return getChallenge1Content();
            case 2:
                return getChallenge2Content();
            case 3:
                return getChallenge3Content();
            case 4:
                return getChallenge4Content();
            case 5:
                return getChallenge5Content();
            case 6:
                return getChallenge6Content();
            default:
                return '<h1>Challenge Not Found</h1>';
        }
    }
    return '<h1>Storyline Not Found</h1>';
}

/**
 * Challenge 1: The Hidden Forum
 */
function getChallenge1Content() {
    return `
        <h1>Challenge 1: The Hidden Forum</h1>
        <p>The Golden Talon has been bragging about their secret forum where they discuss their "master plans". They think it's hidden, but we know better.</p>
        <p>Click the link below to visit their subdomain and inspect the page to find their forum link and the flag.</p>
        <p><strong>Hint:</strong> Right-click and "Inspect Element" or press F12 to view the page source.</p>
        <a href="talon-secret/talon-secret-page.html" target="_blank" class="challenge-link">
            Visit Talon's Secret Subdomain
        </a>
        <p><em>Note: Make sure to find both the forum link and the flag hidden in the page source!</em></p>
    `;
}

/**
 * Challenge 2: Placeholder
 */
function getChallenge2Content() {
    return '<h1>Challenge 2</h1><p>Coming soon...</p>';
}

/**
 * Challenge 3: Placeholder
 */
function getChallenge3Content() {
    return '<h1>Challenge 3</h1><p>Coming soon...</p>';
}

/**
 * Challenge 4: Python Code Execution
 */
function getChallenge4Content() {
    return `
        <h1>Challenge 4</h1>
        <textarea id="code" placeholder="Write your Python code here...">print("Hello from Python!")</textarea>
        <br><br>
        <button onclick="runCode()">Run Code</button>
        <h3>Output:</h3>
        <pre id="output"></pre>
    `;
}

/**
 * Challenge 5: Python Code Execution
 */
function getChallenge5Content() {
    return `
        <h1>Challenge 5</h1>
        <textarea id="code" placeholder="Write your Python code here...">print("Hello from Python!")</textarea>
        <br><br>
        <button onclick="runCode()">Run Code</button>
        <h3>Output:</h3>
        <pre id="output"></pre>
    `;
}

/**
 * Challenge 6: Python Code Execution
 */
function getChallenge6Content() {
    return `
        <h1>Challenge 6</h1>
        <textarea id="code" placeholder="Write your Python code here...">print("Hello from Python!")</textarea>
        <br><br>
        <button onclick="runCode()">Run Code</button>
        <h3>Output:</h3>
        <pre id="output"></pre>
    `;
}

// Python execution functionality
let pyodideReadyPromise = loadPyodide();

/**
 * Run Python code using Pyodide
 */
async function runCode() {
    const output = document.getElementById("output");
    const code = document.getElementById("code").value;
    output.textContent = "Running...";
    
    try {
        const pyodide = await pyodideReadyPromise;

        // Capture stdout and stder
        let stdout = "";
        let stderr = "";

        pyodide.setStdout({
            batched: (text) => { stdout += text; }
        });
        pyodide.setStderr({
            batched: (text) => { stderr += text; }
        });

        await pyodide.loadPackagesFromImports(code);
        let result = await pyodide.runPythonAsync(code);

        // Combine outputs
        output.textContent =
            (stdout ? stdout : "") +
            (result !== undefined ? `\n[Return value]: ${result}` : "") +
            (stderr ? `\n[Errors]:\n${stderr}` : "");

    } catch (err) {
        output.textContent = "Execution error:\n" + err;
    }
}