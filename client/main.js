// CTF Challenge - Main JavaScript File
const BACKEND = "https://api.pandemonium-ctf.com"
//const BACKEND = "https://overnervously-putrefiable-laure.ngrok-free.dev"
// Load popup HTML and initialize

async function fetchWithRetry(url, options = {}, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url, options);
            if (res.status === 530 || res.status === 503) {
                await new Promise(r => setTimeout(r, 2000));
                continue;
            }
            return res;
        } catch (err) {
            if (i === retries - 1) throw err;
            await new Promise(r => setTimeout(r, 2000));
        }
    }
}

fetch('/js-injection/popup.html')
    .then(res => res.text())
    .then(html => {
        document.body.insertAdjacentHTML('beforeend', html);
        initPopupLogic();
    });

fetch('/js-injection/footer.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById("footer").innerHTML = data;
    });


fetch("/js-injection/header.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("header").innerHTML = data;
      setupProfileDropdown();
      showUsername();
    })

document.addEventListener('DOMContentLoaded', () => {
        initLandingAnimations();
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
            if (hidden) hidden.value = `flag${challengeNumber}`;

            const userInput = document.getElementById('userInput');
            if (userInput) userInput.value = '';

            const submitMessage = document.getElementById('submitMessage');
            if (submitMessage) submitMessage.textContent = '';

            popup.style.display = 'flex';

            const isIDE = [4, 5, 6, 7, 8, 9, 10, 11].includes(challengeNumber);
            document.querySelector('.popup-content').classList.toggle('ide-popup', isIDE);
        });
    });

    // Close popup functionality
    if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
    });
    }

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

function initLandingAnimations() {
    if (!window.gsap) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    gsap.set('h1', { y: 30, opacity: 0 });
    gsap.set('.btn', { y: 20, opacity: 0, scale: 0.98 });
    gsap.set('.bg-svg, .bg-svg-stories', { opacity: 0, y: 1200, rotate: 0 });
    gsap.set('h2, p', { y: 20, opacity: 0 });
    gsap.set('.box, .level, .challenge', { y: 40, opacity: 0, scale: 0.98 });

    const introTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    introTl
        .to('h1', { opacity: 1, y: 0, duration: 1.2 }, 0.15)
        .to('.btn', { opacity: 1, y: 0, scale: 1, duration: 0.7 }, 0.4);


    if (window.ScrollTrigger) {
        gsap.to('h2, p', {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.description',
                start: 'top 75%'
            }
        });

        gsap.to('.bg-svg', {
            opacity: 1, y: 1000, rotate: -15, duration: 1.2,
            scrollTrigger: {
                trigger: '.boxes',
                start: 'top 90%'
            }
        });

        gsap.to('.box, .level, .challenge', {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.15,
            clearProps: 'scale', // ← add here
            scrollTrigger: {
                trigger: '.boxes',
                start: 'top 50%'
            }
        });
    }

    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.04,
                duration: 0.25,
                ease: 'power2.out'
            });
        });

        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.25,
                ease: 'power2.out'
            });
        });
    });
}

/**
 * Handle flag form submission
 */
async function handleFlagSubmission(e) {
    e.preventDefault();

    const challenge = document.getElementById('challengeId')?.value;
    const answer = document.getElementById('userInput')?.value.trim();
    const submitMessage = document.getElementById('submitMessage');

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        if (submitMessage) {
            submitMessage.textContent = "You must be logged in to submit flags.";
            submitMessage.style.color = "red";
        }
        return; // stop execution if not logged in
    }

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
        // Send request to your backend submit route
        const res = await fetchWithRetry(BACKEND + '/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ challenge, answer })
        });

        // Try to parse JSON safely
        let data;
        try {
            data = await res.json();
        } catch (jsonErr) {
            console.error("Failed to parse JSON:", jsonErr);
            if (submitMessage) {
                submitMessage.textContent = 'Server error — invalid response.';
                submitMessage.style.color = 'red';
            }
            return;
        }

        // Handle success/failure based on backend response
        if (res.ok && data.success) {
            if (submitMessage) {
                submitMessage.textContent = data.message || 'Correct!';
                submitMessage.style.color = 'green';
            }

            setTimeout(() => location.reload(), 1500);

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

document.addEventListener("DOMContentLoaded", () => {
    const levels = document.querySelectorAll(".l1, .l2, .l3, .l4");
    const buttons = document.querySelectorAll(".buttons button");

    function showLevel(levelClass) {
        levels.forEach(level => {
            level.classList.remove("active");
        });

        const activeLevel = document.querySelector(`.${levelClass}`);
        if (activeLevel) {
            activeLevel.classList.add("active");

                
            const cards = activeLevel.querySelectorAll(".ctf-card");

            // Kill any previous animations (important when switching fast)
                gsap.fromTo(
                    cards,
                    {
                        opacity: 0,
                        y: 25
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: "power3.out",
                        stagger: 0.08
                    }
                );
        }
    }

    // Button click handling
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const level = button.dataset.level;
            showLevel(level);
        });
    });

    // 🔥 Show L1 by default on load
    showLevel("l1");
});

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
    } else if (storyline === 'kharza') {
        switch (challengeNumber) {
            case 7:  return getChallenge2_1Content();
            case 8:  return getChallenge2_2Content();
            case 9:  return getChallenge2_3Content();
            case 10:  return getChallenge2_4Content();
            case 11:  return getChallenge2_5Content();
            case 12:  return getChallenge2_6Content();
            case 13:  return getChallenge2_7Content();
            case 14:  return getChallenge2_8Content();
            case 15:  return getChallenge2_9Content();
            case 16: return getChallenge2_10Content();
            case 17: return getChallenge2_11Content();
            case 18: return getChallenge2_12Content();
            case 19: return getChallenge2_13Content();
            case 20: return getChallenge2_14Content();
            case 21: return getChallenge2_15Content();
            case 22: return getChallenge2_16Content();
            case 23: return getChallenge2_17Content();
            case 24: return getChallenge2_18Content();
            case 25: return getChallenge2_19Content();
            case 26: return getChallenge2_20Content();
            default:
                return '<h1>Challenge Not Found</h1>';
        }
    } else if (storyline === 'final') {
        switch(challengeNumber) {
            case 27: return getChallenge3_1Content();
            case 28: return getChallenge3_2Content();
            case 29: return getChallenge3_3Content();
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
        <p>The Golden Talon has been bragging about their secret forum where they discuss their "master plans". They think it's hidden, but we know better.
        Click the link below to visit their subdomain and inspect the page to find their forum link and the flag.</p>
        <p><strong>Hint:</strong> Right-click and "Inspect Element" or press F12 to view the page source.</p>
        <a class="challenge-link" href="talon-secret/talon-secret-page.html" target="_blank">Secret Forum</a>
    `;
}

/**
 * Challenge 2: Placeholder
 */
function getChallenge2Content() {
    return `
        <h1>Challenge 2: The Golden Talon Forum</h1>
        <p>Our intelligence has discovered a secret forum used by The Golden Talon organization. They've been discussing their operations and sharing techniques for creating harmless digital pranks.
        Infiltrate their forum and gather intelligence about their activities. Look for hidden clues, secret codes, and any information that might help us understand their methods.</p>
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
        <p>The Golden Talon has been using a secure chatroom to coordinate their operations. Our intelligence suggests they've been careless with their security practices.
        Infiltrate their chatroom and gather intelligence. Look for hidden information, secret codes, and the flag.</p>
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
    <button class="btn" onclick="runCode()">Run Code</button>`;
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
    <button class="btn" onclick="runCode()">Run Code</button>`;
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
    <button class="btn" onclick="runCode()">Run Code</button>
    <p><em>Hint: Replace all ??? with the correct variable names or calculations. Don't forget str() to convert numbers to strings!</em></p>`;
}

function getChallenge2_1Content() {
    return `
        <h1>Challenge 1: Reverse the String</h1>
        <p>The Kharza thought they could just reverse a string to hide it, reverse the string and get the flag</p>
        <div class="terminal">
        <textarea id="code" placeholder="Write your Python code here...">flag = "}ysae_si_gnisrever{AZRAHK"
        </textarea>
        <br><br>
        <pre id="output"></pre>
    </div>
    <button class="btn" onclick="runCode()">Run Code</button>`;
}

function getChallenge2_2Content() {
    return `
        <h1>Challenge 2: ASCII Puzzle</h1>
        <p>Each number maps to a character, number or special character, see if you can see what they map to using code</p>
        <div class="terminal">
        <textarea id="code" placeholder="Write your Python code here...">arr = [75, 72, 65, 82, 90, 65, 123, 65, 83, 67, 73, 73, 95, 109, 97, 112, 115, 95, 101, 118, 101, 114, 121, 116, 104, 105, 110, 103, 95, 116, 111, 95, 97, 95, 110, 117, 109, 98, 101, 114, 125]</textarea>
        <br><br>
        <pre id="output"></pre>
    </div>
    <button class="btn" onclick="runCode()">Run Code</button>`;
}

function getChallenge2_3Content() {
    return `
        <h1>Challenge 3: Index Puzzle</h1>
        <p>The Kharza think they can hide the flag by putting 5 characters between each character of the flag, decode this for us</p>
        <div class="terminal">
        <textarea id="code" placeholder="Write your Python code here...">s = "Kx7#pLH9@tQ2A!m3ZkR0$d8WZp2&hYA^7qJ1{c4*Bnf5@rX0o8!aK3r#2Lp9_v6$Qel1%oRso9*Td4p!3Yk8s^5Wq1_m8@Zaa7#Jp0r2&Xc6e$4Qn9_h3!Lsv8%K1de@6Rp2r9*Zt4y#0Xq7_p3J8cu!2Wm5s^7aQ1e4%kT9f0@Lx3u#6Zr2l!5d8A}9$Kp1"</textarea>
        <br><br>
        <pre id="output"></pre>
    </div>
    <button class="btn" onclick="runCode()">Run Code</button>`;
}

function getChallenge2_4Content() {
    return `
        <h1>Challenge 4: Scrambled String</h1>
        <p>You are given a string of numbers. Each number represents an ASCII value, but all numbers have been increased by a hidden constant. Your task is to determine the constant and decode the original message.</p>
        <div class="terminal">
        <textarea id="code" placeholder="Write your Python code here...">arr = [78, 75, 68, 85, 93, 68, 126, 107, 108, 103, 103, 104, 113, 98, 108, 113, 102, 117, 104, 112, 104, 113, 119, 98, 108, 118, 98, 105, 120, 113, 128]</textarea>
        <br><br>
        <pre id="output"></pre>
    </div>
    <button class="btn" onclick="runCode()">Run Code</button>`;
}

function getChallenge2_5Content() {
    return `
        <h1>Challenge 5: Multi-step</h1>
        <p>You are given a large array of numbers. Some numbers are repeated consecutively. Remove all consecutive duplicates</p>
        <div class="terminal">
        <textarea id="code" placeholder="Write your Python code here...">arr = [75, 75, 72, 65, 65, 65, 65, 82, 90, 90, 65, 123, 123, 123, 100, 100, 117, 117, 117, 117, 112, 108, 108, 108, 105, 99, 97, 97, 116, 116, 116, 101, 115, 115, 95, 97, 114, 114, 101, 101, 95, 101, 118, 101, 114, 121, 121, 119, 104, 101, 114, 101, 33, 33, 125]</textarea>
        <br><br>
        <pre id="output"></pre>
    </div>
    <button class="btn" onclick="runCode()">Run Code</button>`;
}

function getChallenge2_6Content() {
    return `
        <h1>Challenge 6: Rookie Mistake</h1>
        <p>An attacker tried to hide their message using one of the oldest ciphers in the book.</p>
        <p>Fortunately for you, this encryption method simply rotates letters in the alphabet.</p>
        <p>Decode the message using ROT13 to reveal the flag.</p>
        <p>XUNEMN{fuvsgvat_gur_yrggref_nebhaq}</p>`;
}

function getChallenge2_7Content() {
    return `
        <h1>Challenge 7: Numbers Everywhere</h1>
        <p>The message you intercepted is filled with strange numbers and letters.</p>
        <p>It looks like the data was encoded multiple times.</p>
        <p>Start by decoding the hexadecimal data, then see what format the result is in.</p>
        <p>Continue decoding until you uncover the flag.</p>
        <p>53 30 68 42 55 6c 70 42 65 32 68 6c 65 46 39 42 54 6b 52 66 59 6d 46 7a 5a 54 59 30 58 32 46 73 62 46 39 70 62 6c 39 76 62 6d 56 39</p>`;
}

function getChallenge2_8Content() {
    return `
        <h1>Challenge 8: Hidden Key</h1>
        <p>A secret message was encrypted using the Vigenère cipher.</p>
        <p>However, the key wasn’t included with the message. Instead, the sender mentioned it in a forum post linked nearby.</p>
        <p>The post references a dog that holds the key to decrypting the message.</p>
        <p>Find the key and decrypt the message to retrieve the flag.</p>
    <a class="challenge-link" href="/pages/kharza/hiddenforum.html" target="_blank">View Forum Post</a>
        <p>LLLCZB{qlyy_qizalf_ydp_tiitc_dpk_ld_a_qeddwpvo}</p>`;
}

function getChallenge2_9Content() {
    return `
        <h1>Challenge 9: Emails</h1>
        <p>You intercepted a suspicious email exchange between two users.</p>
        <p>The message content appears to be encoded, but the attacker layered their encryption.</p>
        <p>First decode the Base64 content, then see if the resulting message still looks encrypted.</p>
        <p>Continue decoding until the flag is revealed.</p>
        <a href="/assets/emails.txt" download>emails.txt</a>`;
}

function getChallenge2_10Content() {
    return `
        <h1>Challenge 10: Password Checking</h1>
        <p>You’ve obtained a hashed password from a compromised database.</p>
        <p>The system used MD5 hashing, but the password appears weak.</p>
        <p>Use any hash cracking tools or websites to recover the original password and reveal the flag.</p>
        <p>Note: This challenge does not have the KHARZA part of the flag and need to be added, the format is KHARZA{<hashed password>}</p>
        <p>ab5b9caeb7af93eef366b66ec4f63194</p>`;
}

function getChallenge2_11Content() {
    return `
        <h1>Challenge 11: The Hidden Cookie</h1>
        <p>Sometimes websites store important information in places users rarely look.</p>
        <p>Load the webpage and inspect the cookies stored by the browser.</p>
        <p>One of them contains something interesting.</p>
        <p>Be quick though — it might disappear when you leave the page.</p>
        <a class="challenge-link" href="/pages/kharza/hidden-cookie/hidden-cookie.html" target="_blank">Login Forum</a>`;
}

function getChallenge2_12Content() {
    return `
        <h1>Challenge 12: Robots.txt Discovery</h1>
        <p>Websites sometimes tell search engines what not to index.</p>
        <p>Check the website’s robots.txt file to see what paths are hidden from search engines.</p>
        <p>One of those paths might lead directly to the flag.</p>
        <a class="challenge-link" href="https://escape-room-fawn.vercel.app/" target="_blank">Suspicious Site</a>`;
}

function getChallenge2_13Content() {
    return `
        <h1>Challenge 13: Background URL</h1>
        <p>Take another look at this website, something else might be hiding behind the scenes.</p>
        <p>Inspect the page’s CSS files, especially the styles used for background images.</p>
        <p>A hidden URL inside the CSS might lead you to a secret page containing the flag.</p>
        <a class="challenge-link" href="https://escape-room-fawn.vercel.app/" target="_blank">Suspicious Site</a>`;
}

function getChallenge2_14Content() {
    return `
        <h1>Challenge 14: Suspicious Image</h1>
        <p>You found an image that seems harmless, but something about it feels suspicious.</p>
        <p>Investigate the image’s metadata using online tools.</p>
        <p>Hidden inside the file’s metadata is the flag.</p>
        <a href="/assets/nothing_here.jpg" download>nothing_here.jpg</a>`;
}

function getChallenge2_15Content() {
    return `
        <h1>Challenge 15: URL Guessing</h1>
        <p>You’ve found a website that loads random pieces of content each time you refresh the page.</p>
        <p>Look closely at the URL structure — the content appears to be controlled by an ID number.</p>
        <p>The flag isn’t part of the normal rotation, but it might be hiding just outside the expected range.</p>
        <p>Try exploring nearby IDs to uncover it.</p>
        <a class="challenge-link" href="/pages/kharza/url-guessing/url-guessing.html" target="_blank">Random Article Generator</a>`;
}

function getChallenge2_16Content() {
    return `
        <h1>Challenge 16: The Suspicious ZIP</h1>
        <p>You downloaded a ZIP archive from a suspicious source.</p>
        <p>Extract the archive and explore the folder structure carefully.</p>
        <p>Somewhere inside the files is a flag.txt containing the flag.</p>
        <a href="/assets/Suspicious_zip.zip" download>Suspicious Zip</a>`;
}

function getChallenge2_17Content() {
    return `
        <h1>Challenge 17: Corrupted Image</h1>
        <p>You received a file that refuses to open properly.</p>
        <p>It looks like an image, but something about the file extension seems wrong.</p>
        <p>Try changing the file extension to the correct format and open it again to reveal the flag.</p>
        <a href="/assets/corrupted.txt" download>Corrupted.txt</a>`;
}

function getChallenge2_18Content() {
    return `
        <h1>Challenge 18: The Log File</h1>
        <p>A server log was recovered, but the contents appear scrambled.</p>
        <p>Start by decoding the Base64 data to reveal the actual logs.</p>
        <p>Inside the logs is a reference to a hidden file path that can be appended to the website’s URL.</p>
        <p>Follow that path to retrieve the flag.</p>
        <a href="/assets/logs.b64" download>logs.b64</a>`;
}

function getChallenge2_19Content() {
    return `
        <h1>Challenge 19: Steganography Lite</h1>
        <p>This image looks completely normal at first glance.</p>
        <p>However, sometimes secrets are hidden in plain sight.</p>
        <p>Look carefully at the image — zoom in or inspect closely.</p>
        <p>The flag is hidden directly on the image itself.</p>
        <a href="/assets/steg_lite.png" download>steg_lite.png</a>`;
}

function getChallenge2_20Content() {
    return `
        <h1>Challenge 20: File Signature</h1>
        <p>You’ve recovered a file that refuses to open.</p>
        <p>It may have been tampered with at the binary level.</p>
        <p>Inspect the magic bytes (file signature) at the beginning of the file.</p>
        <p>Correcting the file signature should allow the file to open and reveal the flag.</p>
        <a href="/assets/magic.png" download>magic.png</a>`;
}

function getChallenge3_1Content() {
    return `<h1>The Breach</h1>
<p>
  You're a cybersecurity analyst at a high school whose online learning platform has just triggered a breach alert. You've been handed an <a href="/assets/auth.log" download>authentication log</a> and a <a href="/assets/access.log" download>file access log</a> from the night in question. Comb through them, identify the suspicious user, the IP address they used, and the file they deleted in the format of user, IP address, deleted file.

</p>

<p>ex: joe,127.0.119.101,deleted_file.txt (make sure there is no space between the commas)</p>`;

}

function getChallenge3_2Content() {
    return `<h1>The Key</h1>
<p>
  The attackers are embedding encrypted messages within the network traffic. You've intercepted a <a href="/assets/key.txt" download>transmission</a> containing the AES key and IV hidden inside — decode them, and submit what the key, and IV are in the following format.
</p>
<p>ex: this_is_the_key,this_is_the_IV (make sure there is no space between the commas)</p>`;
}


function getChallenge3_3Content() {
    return `<h1>The Message</h1>
<p>
  You have the key and IV — now put them to use. Decrypt the attackers' <a href="/assets/message.txt" download>encrypted message</a> and identify what vulnerabilities they've found.
</p>
<p>ex: no_logs,unknown_software,etc (make sure there is no space between the commas, the space between words has underscores, and everything is lowercase)</p>`;
}

// Python execution functionality
let pyodideReadyPromise = null;

async function getPyodide() {
  if (!pyodideReadyPromise) {
    if (typeof loadPyodide !== "function") {
      throw new Error("Pyodide not loaded yet");
    }
    pyodideReadyPromise = loadPyodide();
  }
  return pyodideReadyPromise;
}

/**
 * Run Python code using Pyodide
 */
async function runCode() {
    const output = document.getElementById("output");
    const code = document.getElementById("code").value;
    output.textContent = "Running...";
    
    try {
        const pyodide = await getPyodide();

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

//LOG IN

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetchWithRetry(BACKEND + "/auth/login", { // note port 3000
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Login failed");
        return;
      }

      // store JWT in localStorage
      localStorage.setItem("token", data.token);
      showUsername();

      // redirect or update UI
      alert("Login successful!");
      // window.location.href = "/dashboard.html";

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  });
});

async function showUsername() {
  const token = localStorage.getItem("token");

  // DOM elements
  const loginLink = document.getElementById("log-in");       // header login
  const loginBtn = document.querySelector(".login-btn");     // button in login form
  const profileContainer = document.getElementById("profileContainer");
  const profileCircle = document.getElementById("profileCircle");
  const userDisplay = document.getElementById("userDisplay");

  if (!token) {
    // Not logged in → show login, hide profile
    if (loginLink) loginLink.style.display = "inline-block";
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (profileContainer) profileContainer.style.display = "none";
    if (userDisplay) userDisplay.textContent = "";
    return;
  }

  try {
    const res = await fetchWithRetry(BACKEND + "/me", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (!res.ok) {
      // Invalid token → treat as logged out
      if (loginLink) loginLink.style.display = "inline-block";
      if (loginBtn) loginBtn.style.display = "inline-block";
      if (profileContainer) profileContainer.style.display = "none";
      if (userDisplay) userDisplay.textContent = "";
      return;
    }

    const user = await res.json();

    // Hide login, show profile
    if (loginLink) loginLink.style.display = "none";
    if (loginBtn) loginBtn.style.display = "none";
    if (profileContainer) profileContainer.style.display = "inline-block";
    if (profileCircle) profileCircle.style.display = "inline-block";

    if (userDisplay) userDisplay.textContent = `Logged in as ${user.username}`;

    // Mark solved challenges
    if (user.solvedFlags && Array.isArray(user.solvedFlags)) {
      user.solvedFlags.forEach(challengeId => {
        const el = document.querySelector(`.challenge[data-challenge='${challengeId.replace("flag","")}']`);
        if (el) el.classList.add("solved");
      });
    }

  } catch (err) {
    console.error(err);
  }
}



// Call this when page loads
document.addEventListener("DOMContentLoaded", showUsername);


// LEADERBOARD FUNCTIONALITY

async function loadLeaderboard() {
    const tbody = document.querySelector(".leaderboard tbody");
    if (!tbody) return;

    try {
        const res = await fetchWithRetry(BACKEND + "/leaderboard");
        const data = await res.json();

        if (!data.success) {
            tbody.innerHTML = "<tr><td colspan='3'>Failed to load leaderboard</td></tr>";
            return;
        }

        tbody.innerHTML = ""; // clear existing rows

        data.users.forEach((user, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.username}</td>
                <td>${user.score}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
        tbody.innerHTML = "<tr><td colspan='3'>Error loading leaderboard</td></tr>";
    }
}

// Call when the page loads
document.addEventListener("DOMContentLoaded", loadLeaderboard);

function setupProfileDropdown() {
  const token = localStorage.getItem("token");

  // DOM elements
  const profileContainer = document.getElementById("profileContainer");
  const profileCircle = document.getElementById("profileCircle");
  const profileMenu = document.getElementById("profileMenu");
  const logoutBtn = document.getElementById("logoutBtn");
  const loginLink = document.getElementById("log-in");       // header login
  const loginBtn = document.querySelector(".login-btn");     // login form button
  const userDisplay = document.getElementById("userDisplay");

  // Safety: exit if elements not found
  //if (!profileContainer || !profileCircle || !profileMenu || !logoutBtn || !loginLink) return;

  if (!token) {
    // Not logged in → hide profile
    profileContainer.style.display = "none";
    return;
  }

  // Logged in → show profile circle
  profileContainer.style.display = "inline-block";

  // Toggle dropdown menu on click
  profileCircle.onclick = () => {
    profileMenu.style.display = profileMenu.style.display === "none" ? "block" : "none";
  };

  // Logout functionality
  logoutBtn.onclick = () => {
    localStorage.removeItem("token");
    profileMenu.style.display = "none";

    // Hide profile, show login buttons
    profileContainer.style.display = "none";
    if (loginLink) loginLink.style.display = "inline-block";
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (userDisplay) userDisplay.textContent = "";

    alert("Logged out!");
  };

  // Hide menu if clicked outside
  window.onclick = (e) => {
    if (!profileContainer.contains(e.target)) {
      profileMenu.style.display = "none";
    }
  };
}













