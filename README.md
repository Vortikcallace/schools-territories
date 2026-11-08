# Hack the Hacker App

## Запуск бота
1. Установите зависимости: `pip install -r requirements.txt`
2. Создайте файл `.env` на основе `.env.example` и вставьте токен.
3. Запустите: `python main.py`

## Веб-часть (Мини-апп)
Файлы для хостинга находятся в папке `webapp/` (`index.html`, `style.css`, `script.js`). 
Чтобы бот открывал вашу страницу, укажите ссылку на захостенный `index.html` в переменной `WEBAPP_URL` в файле `.env`.
