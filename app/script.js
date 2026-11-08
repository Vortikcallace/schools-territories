if (window.WebApp) {
    window.WebApp.ready();
}

document.getElementById('playButton').addEventListener('click', () => {
    alert('Кнопка нажата! Здесь будет запускаться игра.');

    if (window.WebApp) {
        window.WebApp.HapticFeedback.impactOccurred('medium');
    }
});
