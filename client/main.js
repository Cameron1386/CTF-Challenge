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
                return `<h1>Challenge 1</h1>`
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

