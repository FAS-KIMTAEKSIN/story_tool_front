import React, { useState } from "react";
import { BsLayoutTextSidebarReverse } from "react-icons/bs";
import { IoSearchOutline } from "react-icons/io5";
import { FaRegEdit, FaRegUserCircle } from "react-icons/fa";

/**
 * @description 사이드바 - 히스토리를 불러와서 노출시키는 사이드바
 * @param {Object} props
 * - isOpen: 사이드바가 열려있는지 여부
 * - onClose: 사이드바를 닫는 함수
 * @todo 사이드바에 노출할 히스토리 데이터를 불러와야 함
 */
const MobileSideMenu = ({ isOpen, onClose }) => {
  // 히스토리 데이터
  // @TODO: 히스토리 데이터를 불러와서 노출해야 함
  const [articleList, setArticleList] = useState([
    { title: "어둠 속의 소리  1", chat: [{}] },
    { title: "어둠 속의 소리  2", chat: [{}] },
    { title: "어둠 속의 소리  3", chat: [{}] },
    { title: "어둠 속의 소리  4", chat: [{}] },
    { title: "어둠 속의 소리  5", chat: [{}] },
    { title: "어둠 속의 소리  6", chat: [{}] },
    { title: "어둠 속의 소리  7", chat: [{}] },
    { title: "어둠 속의 소리  8", chat: [{}] },
    { title: "어둠 속의 소리  9", chat: [{}] },
    { title: "어둠 속의 소리  10", chat: [{}] },
    { title: "어둠 속의 소리  11", chat: [{}] },
    { title: "어둠 속의 소리  12", chat: [{}] },
    { title: "어둠 속의 소리  13", chat: [{}] },
    { title: "어둠 속의 소리  14", chat: [{}] },
    { title: "어둠 속의 소리  15", chat: [{}] },
    { title: "어둠 속의 소리  16", chat: [{}] },
    { title: "어둠 속의 소리  17", chat: [{}] },
    { title: "어둠 속의 소리  18", chat: [{}] },
    { title: "어둠 속의 소리  19", chat: [{}] },
    { title: "어둠 속의 소리  20", chat: [{}] },
    { title: "어둠 속의 소리  21", chat: [{}] },
    { title: "어둠 속의 소리  22", chat: [{}] },
    { title: "조선시대 왕의 저녁 밥상", chat: [{}] }
  ]);

  /**
   * @description 신규 쓰레드 생성.
   *
   */
  const createThread = () => {
    //만약 대화내역이 없다면 무시 처리
    if (localStorage.getItem("content_clf") === null) {
      return;
    }

    //대화내역이 있을 경우, 신규 쓰레드 생성 api 호출
    console.log("신규 쓰레드 생성 요청 시작...");
    onClose();
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg transform ${isOpen
        ? "translate-x-0"
        : "-translate-x-full"} transition-transform duration-300 ease-in-out z-50`}
    >
      {/* 메뉴 내용 */}
      <div className="h-full px-6 pt-4 pb-3 bg-[#f6f6f6] flex flex-col justify-between">
        {/* 상단 버튼 영역 */}
        <div className="flex justify-between items-center w-full">
          {/* 히스토리 메뉴 버튼 */}
          <button onClick={onClose} className="text-xl">
            <BsLayoutTextSidebarReverse />
          </button>
          <div className="flex justify-between items-center space-x-4">
            <IoSearchOutline className="text-2xl" />
            <button className="text-2xl" onClick={() => createThread()}>
              <FaRegEdit />
            </button>
          </div>
        </div>

        {/* 히스토리 리스트 */}
        <ul className="mt-4 space-y-2 flex-grow overflow-y-auto">
          {articleList.map((article, index) =>
            <li
              key={index}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={onClose}
            >
              {article.title}
            </li>
          )}
        </ul>

        {/* 하단 유저 정보 영역 */}
        <div className="bg-[#f6f6f6] p-3 rounded-lg flex items-center space-x-3">
          {/* 프로필 이미지 */}
          <FaRegUserCircle className="text-2xl" />
          {/* 유저 정보 */}
          <div>
            <p className="text-sm font-semibold text-gray-900">홍길동</p>
            <p className="text-xs text-gray-600">gildong@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSideMenu;
