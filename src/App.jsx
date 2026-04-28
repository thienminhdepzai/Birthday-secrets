import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const questions = [
  {
    question: "Món quà này dành tặng cho ai?",
    options: ["Nguyễn Minh Nguyệt", "Củ đậu", "Củ chuối", "Sơn Tùng MTP"],
    correct: [0],
  },
  {
    question: "Trong MV “Phép màu nơi góc quen”, hành động nào bắt đầu câu chuyện?",
    options: ["Ngủ", "Trao đổi về sách", "Đá mắt đưa tình", "Bookmark"],
    correct: [2],
  },
  {
    question: "Minh Nguyệt hay làm gì khi nằm cùng Thiện Minh?",
    options: ["Hôn", "Cãi lộn", "Đánh nhau", "Rúc vào nách"],
    correct: [3],
  },
  {
    question: "Minh Nguyệt sẽ luôn:",
    options: ["Mắng chửi", "Bao cát", "Yêu chiều chồng hết mực", "Bảo chồng bíu"],
    correct: [2],
  },
  {
    question: "Địa điểm lãng mạn:",
    options: ["Nhật", "Pháp", "Ý", "Trung Quốc", "Hàn", "Việt Nam"],
    correct: [3],
  },
  {
    question: "Quà trân trọng nhất:",
    options: ["Búp bê", "Gấu bông", "Son", "Thư tay", "Ghế", "Khác", "Thiện Minh"],
    correct: [3, 6],
    multi: true,
  },
  {
    question: "Tương lai muốn:",
    options: ["Trang sức", "Mỹ phẩm", "Đồ ăn vặt", "Kỉ niệm hạnh phúc"],
    correct: [3],
  },
  {
    question: "Minh Nguyệt giống ai?",
    options: ["mẹ … bố", "bố … mẹ", "Linh … Xoài", "Linh … Khánh"],
    correct: [1],
  },
  {
    question: "Cái này bạn tự quyết nha 💭",
    options: ["Nghỉ việc", "Cưới chồng", "Kiếm tiền", "Nằm chơi"],
    correct: [],
  },
  {
    question: "Chấm điểm Thiện Minh:",
    options: ["10", "20", "100", "Vô tận", "Tự nói"],
    correct: [1],
  },
];

export default function App() {
  const [screen, setScreen] = useState("start");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [time, setTime] = useState(5);

  useEffect(() => {
    if (screen !== "quiz") return;
    if (time === 0) handleSubmit();
    const t = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(t);
  }, [time, screen]);

  const handleSelect = (i) => {
    if (questions[current].multi) {
      setSelected((prev) =>
        prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
      );
    } else {
      setSelected([i]);
    }
  };

  const handleSubmit = () => {
    setAnswers([...answers, selected]);
    setSelected([]);
    setTime(5);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setScreen("result");
    }
  };

  const isCorrect = (q, a) => {
    if (!q.correct.length) return true;
    return (
      JSON.stringify([...q.correct].sort()) ===
      JSON.stringify([...a].sort())
    );
  };

  const score = answers.filter((a, i) => isCorrect(questions[i], a)).length;

  useEffect(() => {
    if (screen === "result" && score >= 8) {
      confetti({ particleCount: 150, spread: 100 });
    }
  }, [screen]);

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-pink-200 to-purple-200 text-center p-4 font-sans">
      <AnimatePresence mode="wait">
        {screen === "start" && (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-md mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl mb-8 font-serif">
              Ai hiểu Minh Nguyệt hơn chính Minh Nguyệt 💖
            </h1>
            <button
              onClick={() => setScreen("tutorial")}
              className="px-8 py-3 bg-white rounded-full shadow-lg hover:scale-105 transition"
            >
              Start ✨
            </button>
          </motion.div>
        )}

        {screen === "tutorial" && (
          <motion.div
            key="tutorial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-xl">
              <p>
                Trả lời 10 câu hỏi để mở khóa bức tranh 💖 <br />
                Mỗi câu đúng sẽ hé lộ một phần bí mật...
              </p>
              <button
                onClick={() => setScreen("quiz")}
                className="mt-6 px-6 py-2 bg-white rounded-full"
              >
                Let’s begin
              </button>
            </div>
          </motion.div>
        )}

        {screen === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-md mx-auto"
          >
            <h2 className="mb-2 font-semibold">
              Question {current + 1}/10
            </h2>

            <div className="h-2 bg-white rounded mb-4 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-400 to-purple-400"
                animate={{ width: `${(time / 5) * 100}%` }}
              />
            </div>

            <p className="mb-4 text-lg">
              {questions[current].question}
            </p>

            <div className="grid gap-3">
              {questions[current].options.map((opt, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleSelect(i)}
                  className={`p-3 rounded-xl shadow transition ${
                    selected.includes(i)
                      ? "bg-pink-200"
                      : "bg-white"
                  }`}
                >
                  {opt}
                </motion.button>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              className="mt-4 px-6 py-2 bg-white rounded-full shadow"
            >
              Submit
            </button>

            <div className="grid grid-cols-5 gap-2 mt-6">
              {answers.map((a, i) => {
                const correct = isCorrect(questions[i], a);
                return (
                  <motion.div
                    key={i}
                    className="h-14 rounded"
                    style={{
                      backgroundImage: "url('/image.jpg')",
                      backgroundSize: "cover",
                      backgroundPosition: `${(i % 5) * 25}% ${Math.floor(i / 5) * 100}%`,
                      filter: correct ? "none" : "brightness(0)",
                    }}
                  />
                );
              })}
            </div>
          </motion.div>
        )}

        {screen === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-md mx-auto"
          >
            <h2 className="text-2xl mb-4 font-semibold">
              Kết quả 💖
            </h2>

            <img
              src="/image.jpg"
              className="w-full max-w-xs rounded-xl shadow-lg mx-auto mb-4"
            />

            <h3 className="text-lg">
              {score >= 8
                ? "Chúc mừng! Bạn đã hiểu Minh Nguyệt 💖"
                : "Hình như bạn cần hiểu cô ấy hơn rồi 😏"}
            </h3>

            {score >= 8 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-4 bg-white/70 rounded-xl shadow"
              >
                🎁 Phần thưởng của bạn là... <br />
                (chèn lời nhắn bí mật ở đây)
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
