import { useState } from "react";
import MobileSideMenu from "./sidemenu/MobileSideMenu";
import { BsLayoutTextSidebarReverse } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);

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
  };
  return (
    <div className="relative w-full">
      {/* 히스토리 메뉴 */}
      {isMenuOpen &&
        <div
          className="fixed inset-0 bg-[#f5f5f5] opacity-50 z-50"
          onClick={closeMenu}
        />}
      <MobileSideMenu isOpen={isMenuOpen} onClose={closeMenu} />

      {/* 고정 헤더 영역 */}
      <header className="fixed top-0 left-0 w-full h-12 bg-white shadow-md px-4 py-3 z-40 flex">
        <div className="relative items-center justify-center w-full flex ">
          {/* 히스토리 버튼 */}
          <button
            onClick={toggleMenu}
            className="absolute left-2 text-xl block"
          >
            <BsLayoutTextSidebarReverse />
          </button>

          {/* 중앙 헤더 텍스트 */}
          <h1 className="inline-block text-lg font-semibold text-gray-800">
            고전문학
          </h1>

          <button
            className="absolute right-2 text-xl block"
            onClick={() => createThread()}
          >
            <FaRegEdit />
          </button>
        </div>
      </header>
    </div>
  );
};

export default Header;
