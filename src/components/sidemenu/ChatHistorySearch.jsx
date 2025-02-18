import React, { useState } from "react";
import HistoryList from "./HistoryList";
import { FaRegEdit } from "react-icons/fa";

const ChatHistorySearch = ({ isOpen, onClose, historyList, onItemClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen) return null;

  // 자연스러운 닫힘(페이드아웃) 처리 함수
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // 신규 쓰레드 생성 함수
  const createThread = () => {
    if (localStorage.getItem("content_clf") === null) {
      return;
    }
    console.log("🟡 신규 쓰레드 생성 요청 시작...");
    window.location.reload();
  };

  // 새 채팅 버튼 클릭 시: 페이드아웃 후 createThread 실행
  const handleNewChat = () => {
    setIsClosing(true);
    setTimeout(() => {
      createThread();
    }, 300);
  };

  // 검색어에 따른 히스토리 필터링
  const filteredHistory = historyList.filter((chat) =>
    chat.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`fixed inset-0 bg-white z-50 flex flex-col shadow-lg transition-opacity duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* 검색 입력창 */}
      <div className="flex items-center px-4 py-3 border-b relative">
        <input
          type="text"
          className="flex-1 px-2 py-1 border-none focus:outline-none text-lg bg-transparent"
          placeholder="채팅 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleClose} className="text-gray-500 text-xl">
          ✕
        </button>
      </div>

      {/* 새 채팅 버튼 */}
      <div
        className="ml-2 p-3 cursor-pointer hover:bg-gray-100 flex items-center gap-2"
        onClick={handleNewChat}
      >
        <FaRegEdit className="text-lg text-gray-600" />
        <span className="text-lg">새 채팅</span>
      </div>

      {/* 필터링된 히스토리 리스트 (HistoryList 컴포넌트 재사용) */}
      <HistoryList
        historyList={filteredHistory}
        onItemClick={(thread_id) => {
          if (onItemClick) onItemClick(thread_id);
          handleClose();
        }}
      />
    </div>
  );
};

export default ChatHistorySearch;
