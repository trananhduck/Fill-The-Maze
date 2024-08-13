document.getElementById('play-btn').addEventListener('click', () => {
    document.getElementById('name-modal').style.display = 'block';
});

document.getElementById('submit-name').addEventListener('click', () => {
    const playerName = document.getElementById('player-name').value.trim();
    if (playerName) {
        localStorage.setItem('playerName', playerName);
        window.location.href = './menu/levels.html';
    } else {
        alert('Please enter your name.');
    }
});

document.getElementById('name-close').addEventListener('click', () => {
    document.getElementById('name-modal').style.display = 'none';
});

// Other existing event listeners
document.getElementById('tutorial-btn').addEventListener('click', () => {
    window.location.href = '../menu/tutorial.html';
});
document.getElementById('highscore-btn').addEventListener('click', () => {
    document.getElementById('highscore-modal').style.display = 'block';
});

document.getElementById('help-btn').addEventListener('click', () => {
    document.getElementById('help-modal').style.display = 'block';
});

document.getElementById('highscore-close').addEventListener('click', () => {
    document.getElementById('highscore-modal').style.display = 'none';
});

document.getElementById('help-close').addEventListener('click', () => {
    document.getElementById('help-modal').style.display = 'none';
});

document.getElementById('back-to-menu').addEventListener('click', () => {
    window.location.href = 'index.html';
});
