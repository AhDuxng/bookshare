import React from 'react';

function SuccessPopup({ isOpen, onClose, message, buttonText = "Đồng ý" }) {
    if (!isOpen) return null;

    return (
        // Overlay mờ
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-[100] transition-opacity duration-300">
            {/* Card Popup */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 transform transition-all scale-100 animate-[fadeIn_0.3s_ease-out]">
                
                {/* Icon Checkmark Xanh */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                {/* Nội dung */}
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">Thành công!</h3>
                <p className="text-center text-gray-600 mb-8">
                    {message}
                </p>

                {/* Nút bấm */}
                <button
                    onClick={onClose}
                    className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 transform hover:scale-[1.02]"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
}

export default SuccessPopup;