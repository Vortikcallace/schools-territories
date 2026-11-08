from maxapi.types import MessageCreated, Command
from bot.instance import dp

@dp.message_created(Command('help'))
async def help_handler(event: MessageCreated):
    await event.message.answer("это команда хелп")
