import { create } from 'zustand'

const useRetrieveClassicLiteratureStore = create((set) => ({
    retrievedLiterature: '', // 현재 생성되고 있는 문학
    retrievedLiteratureTitle: '', // 현재 생성되고 있는 문학의 제목
    isGenerating: false, //loadingbar 처리
    abortController: null, // AbortController 인스턴스
    isStopped: false, // 검색종료버튼 처리
    beforeTextInput: '', // 이전 텍스트 입력값

    setRetrievedLiterature: (newLiterature) =>
        set(() => ({
            retrievedLiterature: newLiterature,
        })),

    setRetrievedLiteratureTitle: (newTitle) =>
        set(() => ({
            retrievedLiteratureTitle: newTitle,
        })),

    // 필요한 경우 문학 내용을 추가하는 함수
    appendLiterature: (additionalContent) =>
        set((state) => ({
            retrievedLiterature: state.retrievedLiterature + additionalContent,
        })),

    updateIsGenerating: (isGenerating) =>
        set(() => ({
            isGenerating,
        })),

    setAbortController: (newAbortController) =>
        set(() => ({
            abortController: newAbortController,
        })),

    setIsStopped: (isStopped) =>
        set(() => ({
            isStopped,
        })),

    setBeforeTextInput: (beforeTextInput) =>
        set(() => ({
            beforeTextInput,
        })),
}))

export default useRetrieveClassicLiteratureStore
