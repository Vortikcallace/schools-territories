import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(dotenv_path=BASE_DIR / ".env")

try:
    BOT_TOKEN = os.environ["BOT_TOKEN"]
    BOT_USERNAME = os.environ["BOT_USERNAME"]
    WEBAPP_URL = os.environ.get("WEBAPP_URL", "").strip()
except KeyError as e:
    raise ValueError(f"Отсутствует переменная окружения: {e}. Проверьте файл .env")
