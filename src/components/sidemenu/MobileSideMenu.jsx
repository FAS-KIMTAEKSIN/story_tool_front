import React, { useState } from "react";
import { BsLayoutTextSidebarReverse } from "react-icons/bs";
import { IoSearchOutline } from "react-icons/io5";
import { FaRegEdit, FaRegUserCircle } from "react-icons/fa";
import Config from "../../util/config";
import ChatHistorySearch from "./ChatHistorySearch";
import HistoryList from "./HistoryList";

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
    onClose();
    setTimeout(() => {
      setIsSearchOpen(true);
    }, 300);
  };

  /** 새 채팅 쓰레드 생성 */
  const createThread = () => {
    if (localStorage.getItem("content_clf") === null) return;
    console.log("신규 쓰레드 생성 요청 시작...");
    onClose();
    window.location.reload();
  };

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
        <div className="h-full bg-[#f6f6f6] flex flex-col justify-between">
          {/* 상단 버튼 영역 */}
          <div className="flex justify-between items-center w-full px-6 pt-4 pb-3">
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

          {/* 그룹화된 히스토리 리스트 */}
          <HistoryList
            historyList={historyList}
            onItemClick={handleHistoryClick}
          />

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
