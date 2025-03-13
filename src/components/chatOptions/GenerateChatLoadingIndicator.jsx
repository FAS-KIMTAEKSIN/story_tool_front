import React from 'react'

const GenerateChatLoadingIndicator = () => {
    return (
        <div className='flex-col w-full text-sm rounded mt-4'>
            <div className='flex items-start rounded-lg py-2 px-3 break-words w-fit max-w-[90%]'>
                <div className='flex-col'>
                    <p className='text-sm mb-2 whitespace-pre-line flex items-center'>
                        <span className='flex items-center ml-1'>
                            <span className='animate-[pulse_1.4s_ease-in-out_infinite] mx-0.5 h-2 w-2 rounded-full bg-gray-400 inline-block'></span>
                            <span className='animate-[pulse_1.4s_ease-in-out_infinite] delay-150 mx-0.5 h-2 w-2 rounded-full bg-gray-400 inline-block'></span>
                            <span className='animate-[pulse_1.4s_ease-in-out_infinite] delay-300 mx-0.5 h-2 w-2 rounded-full bg-gray-400 inline-block'></span>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default GenerateChatLoadingIndicator
