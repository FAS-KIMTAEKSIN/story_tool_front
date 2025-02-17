import React, { useState } from "react";
import { BsLayoutTextSidebarReverse } from "react-icons/bs";
import { IoSearchOutline } from "react-icons/io5";
import { FaRegEdit, FaRegUserCircle } from "react-icons/fa";
import Config from "../../util/config";
import ChatHistorySearch from "./ChatHistorySearch";

const MobileSideMenu = ({ isOpen, onClose, historyList, onSelectHistory }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  /**
   * @description 특정 히스토리를 클릭하면 해당 대화 내용을 가져옴.
   */
  const handleHistoryClick = async (thread_id) => {
    try {
      const response = await fetch(
        `${Config.baseURL}/api/retrieveChatHistoryDetail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: 1, thread_id }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `서버 응답 오류: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("✅ 히스토리 상세 응답:\n", data);

      if (onSelectHistory) {
        localStorage.setItem("thread_id", thread_id);
        onSelectHistory(data);
      }
    } catch (error) {
      console.error("❌ 히스토리 상세 데이터를 불러오는 중 오류 발생:", error);
    } finally {
      onClose();
    }
  };

  /** 검색창 열기 (사이드메뉴 닫고 검색창 열기) */
  const openSearch = () => {
    onClose(); // 사이드메뉴 닫기
    setTimeout(() => {
      setIsSearchOpen(true); // 검색창 열기
    }, 300);
  };

  /** 새 채팅 쓰레드 생성 */
  const createThread = () => {
    if (localStorage.getItem("content_clf") === null) {
      return;
    }
    console.log("신규 쓰레드 생성 요청 시작...");
    onClose();
    window.location.reload();
  };

  // ── 날짜 그룹화 로직 (새로운 데이터 구조에 맞춰 thread_created_at 사용) ──
  const today = new Date();
  const groups = {};

  historyList.forEach((history) => {
    // 기존의 created_at 대신 thread_created_at를 사용합니다.
    const createdDate = new Date(history.thread_created_at);
    const diffTime = today - createdDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    let groupKey = "";
    if (today.toDateString() === createdDate.toDateString()) {
      groupKey = "오늘";
    } else if (diffDays < 7) {
      groupKey = "지난 7일";
    } else if (diffDays < 30) {
      groupKey = "지난 30일";
    } else if (today.getFullYear() === createdDate.getFullYear()) {
      groupKey = (createdDate.getMonth() + 1) + "월";
    } else {
      groupKey = createdDate.getFullYear().toString();
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(history);
  });

  // ── 그룹 순서 정리 ──
  const sortedGroups = [];
  if (groups["오늘"]) sortedGroups.push({ key: "오늘", items: groups["오늘"] });
  if (groups["지난 7일"]) sortedGroups.push({ key: "지난 7일", items: groups["지난 7일"] });
  if (groups["지난 30일"]) sortedGroups.push({ key: "지난 30일", items: groups["지난 30일"] });

  // 현재 연도 내 월 그룹 (예: "1월", "2월" 등) → 내림차순 정렬
  const monthKeys = Object.keys(groups)
    .filter((key) => key.endsWith("월"))
    .sort((a, b) => parseInt(b) - parseInt(a));
  monthKeys.forEach((key) => {
    sortedGroups.push({ key, items: groups[key] });
  });

  // 이전 연도 그룹 (예: "2024") → 내림차순 정렬
  const yearKeys = Object.keys(groups)
    .filter((key) => /^\d{4}$/.test(key))
    .sort((a, b) => parseInt(b) - parseInt(a));
  yearKeys.forEach((key) => {
    sortedGroups.push({ key, items: groups[key] });
  });

  return (
    <>
      {/* 검색창 */}
      {isSearchOpen && (
        <ChatHistorySearch
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          historyList={historyList}
        />
      )}

      {/* 사이드 메뉴 */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="h-full px-6 pt-4 pb-3 bg-[#f6f6f6] flex flex-col justify-between">
          {/* 상단 버튼 영역 */}
          <div className="flex justify-between items-center w-full">
            <button onClick={onClose} className="text-xl">
              <BsLayoutTextSidebarReverse />
            </button>
            <div className="flex justify-between items-center space-x-4">
              <IoSearchOutline
                className="text-2xl cursor-pointer"
                onClick={openSearch}
              />
              <button className="text-2xl" onClick={createThread}>
                <FaRegEdit />
              </button>
            </div>
          </div>

          {/* 히스토리 리스트 (날짜별 그룹화) */}
          {historyList.length > 0 ? (
            <ul className="mt-4 space-y-2 flex-grow overflow-y-auto">
              {sortedGroups.map((group) => (
                <React.Fragment key={group.key}>
                  <li className="list-none px-2 py-1 text-gray-600 font-bold">
                    {group.key}
                  </li>
                  {group.items.map((history) => (
                    <li
                      key={history.thread_id}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleHistoryClick(history.thread_id)}
                    >
                      {/* 기존의 created_title 대신 title 사용 */}
                      {history.title || "제목 없음"}
                    </li>
                  ))}
                </React.Fragment>
              ))}
            </ul>
          ) : (
            <ul className="mt-4 flex-grow overflow-y-auto">
              <li className="text-center text-gray-500 py-4">히스토리 없음</li>
            </ul>
          )}

          {/* 하단 유저 정보 */}
          <div className="bg-[#f6f6f6] p-3 rounded-lg flex items-center space-x-3">
            <FaRegUserCircle className="text-2xl" />
            <div>
              <p className="text-sm font-semibold text-gray-900">홍길동</p>
              <p className="text-xs text-gray-600">gildong@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSideMenu;
