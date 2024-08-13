document.querySelectorAll('.level-btn').forEach(button => {
    button.addEventListener('click', function () {
        const level = this.getAttribute('data-level');
        window.location.href = `../levels/level${level}.html`;
    });
});

document.getElementById('back-to-menu').addEventListener('click', () => {
    window.location.href = '../index.html';
});
