import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import HistoryList from "./HistoryList";
import { FaRegEdit } from "react-icons/fa";
import Config from "../../util/config";

const ChatHistorySearch = ({ isOpen, onClose, historyList, onItemClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [searchedHistory, setSearchedHistory] = useState([]);

  // 날짜 라벨 생성 함수 (오늘이면 Today, 어제면 "어제", 나머지는 YYYY-MM-DD)
  const formatDateLabel = (dateString) => {
    const createdAt = dayjs(dateString);
    const today = dayjs();
    if (createdAt.isSame(today, "day")) return "Today";
    if (createdAt.isSame(today.subtract(1, "day"), "day")) return "어제";
    return createdAt.format("YYYY-MM-DD");
  };

  // 모달을 자연스럽게 닫기 위한 페이드아웃 함수
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // 신규 쓰레드 생성
  const createThread = () => {
    if (localStorage.getItem("content_clf") === null) {
      return;
    }
    console.log("🟡 신규 쓰레드 생성 요청 시작...");
    window.location.reload();
  };

  // 새 채팅 버튼 클릭 시
  const handleNewChat = () => {
    setIsClosing(true);
    setTimeout(() => {
      createThread();
    }, 300);
  };

  // 검색어 변경 시마다 POST 요청 보내기
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchedHistory([]);
      return;
    }

    const fetchSearchHistory = async () => {
      try {
        const response = await fetch(`${Config.baseURL}/api/searchHistory`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: "1",
            search_text: searchQuery,
          }),
        });
        if (!response.ok) {
          throw new Error(`서버 응답 오류: ${response.status}`);
        }
        const data = await response.json();
        // API 응답 형식: { results: [...], success: true, total_count: n }
        setSearchedHistory(data.results || []);
      } catch (error) {
        console.error("검색 히스토리 요청 오류:", error);
      }
    };

    fetchSearchHistory();
  }, [searchQuery]);

  // 검색 중 여부 판단
  const isSearching = searchQuery.trim() !== "";

  // 검색어가 없을 때 기존 히스토리 필터링
  const filteredHistory = historyList.filter((chat) =>
    chat.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 중복된 thread_id가 있다면 앞에 나온 항목만 사용
  const deduplicatedResults = [];
  const usedThreadIds = new Set();
  for (const item of searchedHistory) {
    if (!usedThreadIds.has(item.thread_id)) {
      usedThreadIds.add(item.thread_id);
      deduplicatedResults.push(item);
    }
  }

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

      {/* 검색어가 없을 때: 새 채팅 버튼 + 기존 히스토리 */}
      {!isSearching && (
        <>
          <div
            className="ml-2 p-3 cursor-pointer hover:bg-gray-100 flex items-center gap-2"
            onClick={handleNewChat}
          >
            <FaRegEdit className="text-lg text-gray-600" />
            <span className="text-lg">새 채팅</span>
          </div>
          <HistoryList
            historyList={filteredHistory}
            onItemClick={(thread_id) => {
              if (onItemClick) onItemClick(thread_id);
              handleClose();
            }}
          />
        </>
      )}

      {/* 검색어가 있을 때: 검색 결과만 커스텀 UI로 보여주기 */}
      {isSearching && (
        <div className="overflow-y-auto">
          {deduplicatedResults.length > 0 ? (
            deduplicatedResults.map((item) => (
              <div
                key={item.thread_id}
                className="p-3 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                onClick={() => {if (onItemClick) onItemClick(item.thread_id);
                  handleClose();}}
              >
                {/* 왼쪽: 제목/미리보기 */}
                <div>
                  <div className="font-medium text-base">
                    {item.title?.trim()
                      ? item.title
                      : item.user_input?.trim()
                      ? item.user_input
                      : "제목 없음"}
                  </div>
                  {item.preview?.text && (
                    <div className="text-sm text-gray-600 mt-1">
                      {item.preview.text}
                    </div>
                  )}
                </div>
                {/* 오른쪽: 날짜 표시 */}
                <div className="text-xs text-gray-400 ml-4">
                  {formatDateLabel(item.thread_created_at)}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-4">
              검색 결과가 없습니다.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatHistorySearch;
