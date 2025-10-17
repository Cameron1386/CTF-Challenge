fetch('../../js-injection/popup.html')
    .then(res => res.text())
    .then(html => {
        document.body.insertAdjacentHTML('beforeend', html);
        initPopupLogic();
    });

function initPopupLogic() {
    const popup = document.getElementById('popup');
    const popupBody = document.getElementById('popup-body');
    const closeBtn = document.querySelector('.close-btn');

    const challengeElements = document.querySelectorAll('.challenge')

    challengeElements.forEach((el) => {
        el.addEventListener('click', () => {
            const storyline = el.dataset.storyline;
            const challengeNumber = parseInt(el.dataset.challenge, 10);

            popupBody.innerHTML = getPopupContent(storyline, challengeNumber); 
            
            const hidden = document.getElementById('challengeId');
            if (hidden) hidden.value = String(challengeNumber);

            const userInput = document.getElementById('userInput');
            if (userInput) userInput.value = '';


            const submitMessage = document.getElementById('submitMessage');
            if (submitMessage) submitMessage.textContent = '';

            popup.style.display = 'flex';
        })
    })

    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    window.addEventListener('click', e => {
        if (e.target === popup) {
            popup.style.display = 'none'
        }
    })

    const flagForm = document.getElementById('flagForm');
    if (flagForm) {
        flagForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            
            const challenge = document.getElementById('challengeId')?.value;
            const answer = document.getElementById('userInput')?.value.trim();

            const submitMessage = document.getElementById('submitMessage');
            if (submitMessage) {
            submitMessage.textContent = 'Checking...';
            submitMessage.style.color = 'black';
            }

            
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
        });
    }

}

function getPopupContent(storyline, challengeNumber) {
    if (storyline === 'talon') {
        switch (challengeNumber) {
            case 1:
                return `<h1>Challenge 1: The Hidden Forum</h1>
                <p>The Golden Talon has been bragging about their secret forum where they discuss their "master plans". They think it's hidden, but we know better.</p>
                <p>Click the link below to visit their subdomain and inspect the page to find their forum link and the flag.</p>
                <p><strong>Hint:</strong> Right-click and "Inspect Element" or press F12 to view the page source.</p>
                <a href="client/pages/talon/talon-secret/index.html" target="_blank" style="display: inline-block; background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 0;">Visit Talon's Secret Subdomain</a>
                <p><em>Note: Make sure to find both the forum link and the flag hidden in the page source!</em></p>`
            case 2:
                return `<h1>Challenge 2</h1>`
            case 3:
                return `<h1>Challenge 3</h1>`
            case 4:
                return `<h1>Challenge 4</h1>`
            case 5:
                return `<h1>Challenge 5</h1>`
            case 6:
                return `<h1>Challenge 6</h1>`
        }
    }
}

