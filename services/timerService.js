import mongoose from "mongoose";
import DataModel from "../models/datas.js";

const parseTimer = (timerStr) => {
  const [days, hours, minutes, seconds] = timerStr.split(":").map(Number);
  return days * 86400 + hours * 3600 + minutes * 60 + seconds;
};

const formatTimer = (seconds) => {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(d).padStart(2, "0")}:${String(h).padStart(2, "0")}:${String(
    m
  ).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export const startTimerUpdate = () => {
  console.log("🚀 startTimerUpdate запущен");

  setInterval(async () => {
    try {
      console.log("🔄 Обновление таймера...");
      const dataEntries = await DataModel.find();
      console.log(`📊 Найдено записей: ${dataEntries.length}`);

      for (const entry of dataEntries) {
        console.log(`⏳ Текущий таймер [${entry._id}]: ${entry.timer}`);
        const currentSeconds = parseTimer(entry.timer);

        if (currentSeconds > 0) {
          const newTimer = formatTimer(currentSeconds - 1);
          console.log(`🕒 Новый таймер: ${newTimer}`);

          // Преобразуем _id в ObjectId
          const objectId = new mongoose.Types.ObjectId(entry._id);

          // Проверяем, существует ли документ в БД
          const existingEntry = await DataModel.findOne({ _id: objectId });
          if (!existingEntry) {
            console.log(
              `❌ Ошибка: Документ с _id=${entry._id} не найден в БД`
            );
            continue;
          }

          // Обновляем таймер
          const updateResult = await DataModel.updateOne(
            { _id: objectId },
            { $set: { timer: newTimer } }
          );

          console.log(`✅ Обновлено: ${JSON.stringify(updateResult)}`);
        }
      }
    } catch (err) {
      console.error("❌ Ошибка в startTimerUpdate:", err);
    }
  }, 1000);
};
