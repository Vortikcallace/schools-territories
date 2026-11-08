from maxapi.types import MessageCreated, Command
from maxapi.utils.inline_keyboard import InlineKeyboardBuilder
from maxapi.types.attachments.buttons import OpenAppButton
from bot.instance import dp
from config import BOT_USERNAME, WEBAPP_URL

@dp.message_created(Command('start'))
async def start_handler(event: MessageCreated):
    builder = InlineKeyboardBuilder()

    app_target = WEBAPP_URL if WEBAPP_URL else BOT_USERNAME

    builder.row(
        OpenAppButton(
            text="🎮 Открыть мини-апп",
            web_app=BOT_USERNAME
        )
    )

    await event.message.answer(
        text="Привет! Нажми на кнопку ниже, чтобы запустить приложение:",
        attachments=[builder.as_markup()]
    )
