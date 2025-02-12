import { GridLoader } from 'react-spinners'

const LoadingBar = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] z-50">
      <GridLoader color="#007afe" />
      <h2 className="mt-4 text-gray-700">이야기를 생성하고 있어요.</h2>
    </div>
  )
}

export default LoadingBar
