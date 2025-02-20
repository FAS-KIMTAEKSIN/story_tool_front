// TODO
// 백엔드에서 좋아요 상태를 반환해주지 않아서 
// 백엔드에서 상태 반환해주면 좋아요가 눌려있도록 수정해야함
// 현재는 좋아요 동작은 하지만 히스토리 다시 부르면 좋아요 상태가 보이지만 않는 상태


import { useCallback, useState } from 'react'
import { FcLike, FcLikePlaceholder } from 'react-icons/fc'
import { toast } from 'react-toastify'
import { IoCopyOutline } from 'react-icons/io5'
import { GrPowerCycle } from 'react-icons/gr'
import 'react-toastify/dist/ReactToastify.css'
import ChangeModelDropBox from './ChangeModelDropBox'
import useModelStore from '../../store/storeModel'
import Config from "../../util/config"

const toastOptionObj = {
    position: 'bottom-center',
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    theme: 'dark',
    closeButton: false,
};


// 모델변경버튼영역
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

// 복사 버튼 영역
export const CopyArea = ({ message }) => {
    const copyMessageContent = async ({ text }) => {
        console.log(window.location.protocol)
        try {
            await navigator.clipboard.writeText(text)
            toast('복사되었어요!', toastOptionObj)
        } catch (err) {
            console.error('Failed to copy: ', err)
            toast('http 환경에서는 복사가 불가능합니다.', toastOptionObj)
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

// 좋아요 버튼 영역
export const LikeButtonArea = (message) => {
    const [liked, setLiked] = useState({}) // 좋아요 상태

    // 좋아요 버튼 클릭 시, 평가 업데이트 POST 요청을 보냅니다.
    const handleLikeClick = async (msg) => {
        // 좋아요 상태 토글
        setLiked((prev) => ({ ...prev, [msg.message.id]: !prev[msg.message.id] }))

        // "1_ai" 같은 형식에서 숫자만 추출 (예: "1_ai" -> 1)
        const convIdStr = msg.message.id
        const conversationId = parseInt(convIdStr.split('_')[0], 10)

        // 로컬스토리지에서 thread_id 가져오기
        const thread_id = localStorage.getItem("thread_id")

        // POST 요청에 보낼 payload
        const payload = {
            thread_id: thread_id,
            conversation_id: conversationId,
            user_id: 1,
            evaluation: "like"
        }

        try {
            const response = await fetch(`${Config.baseURL}/api/updateEvaluation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const data = await response.json();
            console.log("Evaluation update response:", data);
            toast('평가가 반영되었습니다.', toastOptionObj)
        } catch (error) {
            console.error("Failed to update evaluation:", error);
            toast('평가 반영에 실패했습니다.', toastOptionObj)
        }
    }

    return (
        <div>
            <button
                className="transition-opacity duration-300 ease-in-out px-2 pb-2 rounded-md"
                onClick={() => handleLikeClick(message)}
            >
                {liked[message.message.id] ? (
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
