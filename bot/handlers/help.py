from maxapi.types import MessageCreated, Command
from bot.instance import dp

@dp.message_created(Command('help'))
async def help_handler(event: MessageCreated):
    text = (
        "📚 **Школьные Земли** — образовательная квест-игра.\n\n"
        "Ученики решают уравнения, чтобы зачаровать меч и победить босса.\n"
        "Учителя могут создавать задания через конструктор.\n\n"
        "Нажми /start, чтобы начать!"
    )
    await event.message.answer(text)
