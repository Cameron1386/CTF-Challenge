// CTF Challenge - Main JavaScript File

// Load popup HTML and initialize
fetch('/client/js-injection/popup.html')
    .then(res => res.text())
    .then(html => {
        document.body.insertAdjacentHTML('beforeend', html);
        initPopupLogic();
    });


fetch("/client/js-injection/header.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("header").innerHTML = data;
    })
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
        <a class="challenge-link" href="talon-secret/talon-secret-page.html">Secret Forum</a>
    `;
}

/**
 * Challenge 2: Placeholder
 */
function getChallenge2Content() {
    return `
        <h1>Challenge 2: The Golden Talon Forum</h1>
        <p>Our intelligence has discovered a secret forum used by The Golden Talon organization. They've been discussing their operations and sharing techniques for creating harmless digital pranks.</p>
        <p>Infiltrate their forum and gather intelligence about their activities. Look for hidden clues, secret codes, and any information that might help us understand their methods.</p>
        <p><strong>Hint:</strong> Pay attention to the forum posts - they might contain hidden messages or clues. Some members mention secret codes and hidden elements!</p>
        <a href="talon-rot13/talon-rot13-forum.html" target="_blank" class="challenge-link">
            Access Golden Talon Forum
        </a>
    `;
}

/**
 * Challenge 3: The Secret Chatroom
 */
function getChallenge3Content() {
    return `
        <h1>Challenge 3: The Secret Chatroom</h1>
        <p>The Golden Talon has been using a secure chatroom to coordinate their operations. Our intelligence suggests they've been careless with their security practices.</p>
        <p>Infiltrate their chatroom and gather intelligence. Look for hidden information, secret codes, and the flag.</p>
        <p><strong>Hint:</strong> Inspect the page source, check comments, and look for hidden elements. They might have left sensitive information in plain sight!</p>
        <a href="talon-chatroom/talon-chatroom-page.html" target="_blank" class="challenge-link">
            Access Golden Talon Chatroom
        </a>
        <p><em>Note: The chatroom is interactive - you can send messages and see responses. But focus on finding the hidden intelligence!</em></p>
    `;
}

/**
 * Challenge 4: Python Code Execution
 */
function getChallenge4Content() {
    return `
        <h1>Challenge 4</h1>
        <div class="terminal">
        <textarea id="code" placeholder="Write your Python code here...">flag_part10 = 'nt_'
flag_part2 = "ON{"
flag_part1 = "TAL"
flag_part3 = 'add'
flag_part4 = '_up_'
flag_part5 = "ev"
flag_part7 = 'thing'
flag_part6 = "ery"
flag_part11 = 'statments}'
flag_part8 = "_in"
flag_part9 = "_the_pri"
flag_part10 = 'nt_'


print(flag_part2 + flag_part2 + flag_part3 + flag_part4 + flag_part5 + flag_part7 + flag_part8 + flag_part9 + flag_part10 + flag_part10)</textarea>
        <br><br>
        <pre id="output"></pre>
    </div>
    <button onclick="runCode()">Run Code</button>`;
}

/**
 * Challenge 5: Python Code Execution
 */
function getChallenge5Content() {
    return `
        <h1>Challenge 5</h1>
        <p>The hackers thought that they could hide their code in a special array. However, we cracked the algorithm they use to decrypt it, but there's an error. Fix it and you can find the flag.</p>
        <p><strong>Hint:</strong> The bug is in the <code>for</code> loop — pay close attention to the <code>range</code> and in what order you're looping through the array indices!</p>
        <div class="terminal">
        <textarea id="code" placeholder="Write your Python code here...">
x = [
    ["M", "M", "I", "=", "O"],
    ["A", "d", "c", "K", "v"],
    ["q", "p", "B", "-", "t"],
    ["b", "c", "P", "n", "j"],
    ["|", "q", "q", "a", "m"],
]

for row in x:
    for i in range(len(row), -1, -1):
        char = row[i]
        num = ord(char)
        num += i + 1
        new_char = chr(num)

        print(new_char)
        </textarea>
        <br><br>
        <pre id="output"></pre>
    </div>
    <button onclick="runCode()">Run Code</button>`;
}



/**
 * Challenge 6: Python Code Execution
 */
function getChallenge6Content() {
    return `
        <h1>Challenge 6: Code Breaker</h1>
        <p>The Golden Talon thought they were clever using math to hide their flag. Prove them wrong!</p>
        <div class="terminal">
        <textarea id="code" placeholder="Write your Python code here...">a = 5
b = 10
c = 3

flag_part1 = "TALON{"
flag_part2 = "math_"
flag_part3 = "is_"
flag_part4 = "_plus_"
flag_part5 = "_equals_"
flag_part6 = "}"

# Step 1: Calculate the first part (a + b)
first_number = ???

# Step 2: Calculate the second part (b - c)
second_number = ???

# Step 3: Calculate the final result (a + b + b - c)
result = ???

# Step 4: Complete the print statement
# Remember: use str() to convert numbers to strings!
print(flag_part1 + flag_part2 + flag_part3 + str(???) + flag_part4 + str(???) + flag_part5 + str(???) + flag_part6)</textarea>
        <br><br>
        <pre id="output"></pre>
    </div>
    <button onclick="runCode()">Run Code</button>
    <p><em>Hint: Replace all ??? with the correct variable names or calculations. Don't forget str() to convert numbers to strings!</em></p>`;
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