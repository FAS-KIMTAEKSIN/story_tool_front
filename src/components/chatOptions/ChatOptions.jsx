import { useCallback, useState } from 'react'
import { FcLike, FcLikePlaceholder } from 'react-icons/fc'
import { toast } from 'react-toastify'
import { IoCopyOutline } from 'react-icons/io5'
import { GrPowerCycle } from 'react-icons/gr'
import 'react-toastify/dist/ReactToastify.css'
import ChangeModelDropBox from './ChangeModelDropBox'
import useModelStore from '../../store/storeModel'

//모델변경버튼영역
export const ChangeModelButtonArea = ({ openModelDropBox }) => {
  return (
    <button
      className="pt-2.5 px-2 text-base"
      onClick={() => openModelDropBox()}
    >
      <GrPowerCycle />
    </button>
  )
}

//복사 버튼 영역
export const CopyArea = ({ message }) => {
  const copyMessageContent = async ({ text }) => {
    try {
      await navigator.clipboard.writeText(text)
      toast('복사되었어요!', {
        position: 'bottom-center',
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        theme: 'dark',
        closeButton: false, // 닫기 버튼 숨김
      })
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <>
      <button onClick={() => copyMessageContent(message)}>
        <IoCopyOutline />
      </button>
    </>
  )
}

//좋아요 버튼 영역
export const LikeButtonArea = (message) => {
  const [liked, setLiked] = useState({}) // 좋아요 상태

  // 좋아요 버튼 클릭 시
  const handleLikeClick = (messageId) => {
    setLiked((prev) => ({ ...prev, [messageId]: !prev[messageId] }))

    //TODO: 좋아요 싫어요에 대한 db적재? or ?
  }

  return (
    <div>
      <button
        className="transition-opacity duration-300 ease-in-out px-2 pb-2 rounded-md"
        onClick={() => handleLikeClick(message.id)}
      >
        {liked[message.id] ? (
          <FcLike className="inline mr-1" />
        ) : (
          <FcLikePlaceholder className="inline mr-1" />
        )}
      </button>
    </div>
  )
}

/**
 * @description AI답변 옵션 버튼 영역 [복사, 좋아요, 모델변경]
 * @param {*} message
 * @returns
 */
const ChatOptions = ({ message, onLikeClick, liked, isLastAiMessage }) => {
  const { getActiveModelName } = useModelStore()
  const [isDropBoxOpen, setIsDropBoxOpen] = useState(false)

  const openModelDropBox = useCallback(() => {
    setIsDropBoxOpen((prev) => !prev)
  }, [])

  return (
    <>
      <div className="flex text-xl">
        <div className="flex flex-1">
          <CopyArea message={message} />
          <LikeButtonArea
            message={message}
            onLikeClick={onLikeClick}
            liked={liked}
          />
        </div>
        {/* 모델 변경 버튼 - 2025.02.12. 미노출처리요청반영*/}
        {/* {isLastAiMessage && (
          <div>
            <span className="text-xs line-">{getActiveModelName()}</span>
            <ChangeModelButtonArea openModelDropBox={openModelDropBox} />
          </div>
        )} */}
      </div>
      {/* 드롭박스 영역 */}
      {isDropBoxOpen && isLastAiMessage && (
        <ChangeModelDropBox closeModelDropBox={openModelDropBox} />
      )}
    </>
  )
}
export default ChatOptions
