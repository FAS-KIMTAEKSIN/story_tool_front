import { create } from 'zustand'

/**
 * @description 사용중인 모델 store
 *
 */
const useModelStore = create((set, get) => ({
  models: [
    { name: 'Fine-Tuning 3.5', active: true },
    { name: 'Fine-Tuning 4.0', active: false },
    { name: 'Fine-Tuning 4.5', active: false },
  ],
  //사용중인 모델명을 업데이트합니다.
  setModel: (newModels) => set({ models: newModels }),

  //현재 active 되어있는 모델명
  getActiveModelName: () => {
    const models = get().models
    const activeModel = models.find((model) => model.active === true)
    return activeModel ? activeModel.name : null
  },
}))

export default useModelStore
