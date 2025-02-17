import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { BiMessageSquareDetail } from "react-icons/bi";
import dayjs from "dayjs"; // 날짜 처리를 위해 dayjs 사용

const ChatHistorySearch = ({ isOpen, onClose, historyList }) => {
  console.log(historyList);

  if (!isOpen) return null;

  // 🔹 현재 날짜 정보
  const today = dayjs();
  const sevenDaysAgo = today.subtract(7, "day");
  const thirtyDaysAgo = today.subtract(30, "day");
  const lastMonth = today.subtract(1, "month");
  const lastYear = today.subtract(1, "year");

  // 🔹 히스토리 데이터 분류 (날짜는 thread_created_at를 사용)
  const categorizedHistory = {
    today: [],
    last7Days: [],
    last30Days: [],
    lastMonth: [],
    lastYear: [],
  };

  historyList.forEach((chat) => {
    const createdAt = dayjs(chat.thread_created_at);

    if (createdAt.isSame(today, "day")) {
      categorizedHistory.today.push(chat);
    } else if (createdAt.isAfter(sevenDaysAgo)) {
      categorizedHistory.last7Days.push(chat);
    } else if (createdAt.isAfter(thirtyDaysAgo)) {
      categorizedHistory.last30Days.push(chat);
    } else if (createdAt.isAfter(lastYear) && createdAt.month() === lastMonth.month()) {
      categorizedHistory.lastMonth.push(chat);
    } else {
      categorizedHistory.lastYear.push(chat);
    }
  });

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col shadow-lg">
      {/* 🔹 검색 입력창 */}
      <div className="flex items-center px-4 py-3 border-b relative">
        <input
          type="text"
          className="flex-1 px-2 py-1 border-none focus:outline-none text-lg bg-transparent"
          placeholder="채팅 검색..."
        />
        <button onClick={onClose} className="text-gray-500 text-xl">
          ✕
        </button>
      </div>

      {/* 🔹 새 채팅 버튼 */}
      <div className="p-3 cursor-pointer hover:bg-gray-100 flex items-center gap-2">
        <FaRegEdit className="text-lg text-gray-600" />
        <span className="text-lg">새 채팅</span>
      </div>

      {/* 🔹 히스토리 섹션 */}
      {historyList.length > 0 ? (
        <>
          {/* 🔹 오늘 */}
          {categorizedHistory.today.length > 0 && (
            <>
              <div className="px-4 py-2 text-gray-500 text-sm">오늘</div>
              {categorizedHistory.today.map((chat, index) => (
                <div
                  key={index}
                  className="cursor-pointer hover:bg-gray-100 p-3 flex items-center gap-2"
                >
                  <BiMessageSquareDetail className="text-lg text-gray-600" />
                  <span className="text-base">{chat.title || "제목 없음"}</span>
                </div>
              ))}
            </>
          )}

          {/* 🔹 지난 7일 */}
          {categorizedHistory.last7Days.length > 0 && (
            <>
              <div className="px-4 py-2 text-gray-500 text-sm">지난 7일</div>
              {categorizedHistory.last7Days.map((chat, index) => (
                <div
                  key={index}
                  className="cursor-pointer hover:bg-gray-100 p-3 flex items-center gap-2"
                >
                  <BiMessageSquareDetail className="text-lg text-gray-600" />
                  <span className="text-base">{chat.title || "제목 없음"}</span>
                </div>
              ))}
            </>
          )}

          {/* 🔹 지난 30일 */}
          {categorizedHistory.last30Days.length > 0 && (
            <>
              <div className="px-4 py-2 text-gray-500 text-sm">지난 30일</div>
              {categorizedHistory.last30Days.map((chat, index) => (
                <div
                  key={index}
                  className="cursor-pointer hover:bg-gray-100 p-3 flex items-center gap-2"
                >
                  <BiMessageSquareDetail className="text-lg text-gray-600" />
                  <span className="text-base">{chat.title || "제목 없음"}</span>
                </div>
              ))}
            </>
          )}

          {/* 🔹 이전 달 */}
          {categorizedHistory.lastMonth.length > 0 && (
            <>
              <div className="px-4 py-2 text-gray-500 text-sm">{lastMonth.format("MMMM")}</div>
              {categorizedHistory.lastMonth.map((chat, index) => (
                <div
                  key={index}
                  className="cursor-pointer hover:bg-gray-100 p-3 flex items-center gap-2"
                >
                  <BiMessageSquareDetail className="text-lg text-gray-600" />
                  <span className="text-base">{chat.title || "제목 없음"}</span>
                </div>
              ))}
            </>
          )}

          {/* 🔹 이전 연도 */}
          {categorizedHistory.lastYear.length > 0 && (
            <>
              <div className="px-4 py-2 text-gray-500 text-sm">{lastYear.format("YYYY")}</div>
              {categorizedHistory.lastYear.map((chat, index) => (
                <div
                  key={index}
                  className="cursor-pointer hover:bg-gray-100 p-3 flex items-center gap-2"
                >
                  <BiMessageSquareDetail className="text-lg text-gray-600" />
                  <span className="text-base">{chat.title || "제목 없음"}</span>
                </div>
              ))}
            </>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500 mt-4">히스토리가 없습니다.</p>
      )}
    </div>
  );
};

export default ChatHistorySearch;
