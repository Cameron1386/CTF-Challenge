fetch('../js-injection/popup.html')
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

