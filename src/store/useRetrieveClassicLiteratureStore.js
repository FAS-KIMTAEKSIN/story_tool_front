import { create } from 'zustand'

const useRetrieveClassicLiteratureStore = create((set) => ({
    retrievedLiterature: '', // 현재 생성되고 있는 문학
    retrievedLiteratureTitle: '', // 현재 생성되고 있는 문학의 제목
    isGenerating: false, //loadingbar 처리

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
}))

export default useRetrieveClassicLiteratureStore
