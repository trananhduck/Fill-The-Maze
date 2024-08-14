document.addEventListener('DOMContentLoaded', () => {
    // Gán sự kiện click cho các nút chọn cấp độ
    document.querySelectorAll('.level-btn').forEach(button => {
        button.addEventListener('click', function () {
            const level = this.getAttribute('data-level');
            window.location.href = `../levels/level${level}.html`;
        });
    });

    // Gán sự kiện click cho nút "Back to Menu"
    document.getElementById('back-to-menu').addEventListener('click', () => {
        window.location.href = '../index.html';
    });
});
