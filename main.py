import asyncio
import logging
from bot.instance import bot_client, dp  # Импортируем bot_client
import bot.handlers

logging.basicConfig(level=logging.INFO)

async def main():
    print("Бот запущен и готов к работе!")
    await dp.start_polling(bot_client)

if __name__ == "__main__":
    asyncio.run(main())
