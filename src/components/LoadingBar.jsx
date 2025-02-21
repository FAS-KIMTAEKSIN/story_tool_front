import { GridLoader } from 'react-spinners'

const LoadingBar = () => {
    return (
        <div className='flex flex-col items-center justify-center w-full h-[100vh] z-90'>
            <div className='inline-flex flex-col items-center'>
                <div className='rounded-lg p-2 flex items-center justify-center'>
                    <GridLoader color='#007afe' />
                </div>
                <h2 className='p-2 rounded-lg mt-4 text-gray-900 font-semibold'>
                    이야기를 생성하고 있어요
                </h2>
            </div>
        </div>
    )
}

export default LoadingBar
