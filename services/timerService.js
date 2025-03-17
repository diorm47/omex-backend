import DataModel from "../models/datas.js";

const parseTimer = (timerStr) => {
  const [days, hours, minutes, seconds] = timerStr.split(":").map(Number);
  return days * 86400 + hours * 3600 + minutes * 60 + seconds; // в секунды
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
  setInterval(async () => {
    const dataEntries = await DataModel.find();
    for (const entry of dataEntries) {
      const currentSeconds = parseTimer(entry.timer);
      if (currentSeconds > 0) {
        const newTimer = formatTimer(currentSeconds - 1);
        await DataModel.updateOne({ _id: entry._id }, { timer: newTimer });
      }
    }
  }, 1000); // уменьшаем каждую секунду
};
