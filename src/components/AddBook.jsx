import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";

function AddBook() {
    const navigate = useNavigate();

    // Dữ liệu danh mục
    const [categories, setCategories] = useState([
        "Văn học", "Kinh tế", "Tâm lý", "Kỹ năng sống", 
        "Sách thiếu nhi", "Lịch sử", "Khoa học"
    ]);

    // State cho thêm danh mục
    const [isAddingCat, setIsAddingCat] = useState(false);
    const [newCatName, setNewCatName] = useState("");

    // State cho tab chọn ảnh: 'link' hoặc 'upload'
    const [imageTab, setImageTab] = useState('link');

    const [form, setForm] = useState({
        title: "",
        author: "",
        category: "Văn học",
        condition: 80,
        description: "",
        price: "",
        image: "" 
    });

    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            alert("Bạn cần đăng nhập để bán sách");
            navigate("/login");
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleCategorySelect = (cat) => {
        setForm({ ...form, category: cat });
    };

    const handleAddNewCategory = () => {
        if (!newCatName.trim()) {
            setIsAddingCat(false);
            return;
        }
        const newCategory = newCatName.trim();
        setCategories([...categories, newCategory]);
        setForm({ ...form, category: newCategory });
        setNewCatName("");
        setIsAddingCat(false);
    };

    // --- XỬ LÝ ẢNH ---
    
    // 1. Nếu nhập Link
    const handleImageLinkChange = (e) => {
        const url = e.target.value;
        setForm({ ...form, image: url });
        setPreviewImage(url);
    };

    // Xử lý khi tải file từ máy
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewImage(objectUrl);
            
            // --- SỬA QUAN TRỌNG: Lưu nguyên đối tượng File vào state ---
            setForm({ ...form, image: file }); 
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title || !form.price) {
            alert("Vui lòng nhập tiêu đề và giá bán!");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user ? user.id : null;

        // --- SỬA QUAN TRỌNG: Dùng FormData để gửi file ---
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("author", form.author);
        formData.append("category", form.category);
        formData.append("condition", form.condition);
        formData.append("description", form.description);
        formData.append("price", form.price);
        formData.append("user_id", userId);
        
        // Form.image có thể là String (Link) hoặc File (Upload)
        // Backend (multer) sẽ tự xử lý
        formData.append("image", form.image); 

        axios.post("http://localhost:3000/api/books", formData, {
            headers: {
                "Content-Type": "multipart/form-data", // Bắt buộc khi gửi file
            },
        })
        .then(() => {
            alert("✅ Đăng bán thành công!");
            navigate("/");
        })
        .catch((error) => {
            console.error("Lỗi:", error);
            alert("❌ Có lỗi xảy ra.");
        });
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans pb-10">
            <Header />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link to="/" className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition text-sm font-medium w-fit">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Quay lại
                </Link>

                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Đăng bán sách</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
                            
                            {/* Tiêu đề */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Tiêu đề sách</label>
                                <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" placeholder="Ví dụ: Đắc Nhân Tâm..." />
                            </div>

                            {/* Tác giả */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Tác giả</label>
                                <input type="text" name="author" value={form.author} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Nhập tên tác giả..." />
                            </div>

                            {/* Danh mục */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Danh mục</label>
                                <div className="flex flex-wrap gap-2 items-center">
                                    {categories.map((cat) => (
                                        <button key={cat} type="button" onClick={() => handleCategorySelect(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition border ${form.category === cat ? "bg-blue-100 text-blue-700 border-blue-200 ring-2 ring-blue-100" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}>{cat}</button>
                                    ))}
                                    {isAddingCat ? (
                                        <div className="flex items-center gap-2 animate-fade-in-left">
                                            <input type="text" className="border border-blue-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 w-40 shadow-sm" placeholder="Nhập tên..." value={newCatName} onChange={(e) => setNewCatName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddNewCategory()} autoFocus />
                                            <button type="button" onClick={handleAddNewCategory} className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 shadow-md transition"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg></button>
                                            <button type="button" onClick={() => setIsAddingCat(false)} className="text-gray-400 hover:text-red-500 transition p-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg></button>
                                        </div>
                                    ) : (
                                        <button type="button" onClick={() => setIsAddingCat(true)} className="px-4 py-2 rounded-full text-sm font-medium transition border border-dashed border-gray-300 text-gray-500 hover:text-blue-600 hover:border-blue-400 bg-white flex items-center gap-1 hover:shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
                                            Thêm danh mục
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Tình trạng sách */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="block text-sm font-semibold text-gray-700">Tình trạng sách</label>
                                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{form.condition}%</span>
                                </div>
                                <input type="range" min="0" max="100" step="5" name="condition" value={form.condition} onChange={handleChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>Cũ nát</span><span>Khá tốt</span><span>Như mới</span></div>
                            </div>

                            {/* Mô tả */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả chi tiết</label>
                                <textarea rows="5" name="description" value={form.description} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none" placeholder="Mô tả về nội dung, tình trạng bìa, ghi chú thêm..."></textarea>
                            </div>

                            {/* Giá bán */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Giá bán (VNĐ)</label>
                                <div className="relative">
                                    <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full border border-gray-300 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-medium" placeholder="50000" />
                                    <span className="absolute right-4 top-3 text-gray-500 font-medium">VNĐ</span>
                                </div>
                            </div>

                            {/* --- PHẦN ẢNH BÌA (CẬP NHẬT MỚI) --- */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Ảnh bìa</label>
                                
                                {/* Tabs chuyển đổi */}
                                <div className="flex space-x-4 mb-4 border-b border-gray-200">
                                    <button 
                                        type="button"
                                        onClick={() => setImageTab('link')}
                                        className={`pb-2 text-sm font-medium transition ${imageTab === 'link' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Nhập Link Ảnh
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setImageTab('upload')}
                                        className={`pb-2 text-sm font-medium transition ${imageTab === 'upload' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Tải ảnh lên
                                    </button>
                                </div>

                                {imageTab === 'link' ? (
                                    <div className="animate-fade-in">
                                        <input 
                                            type="text" name="image"
                                            value={form.image} onChange={handleImageLinkChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                            placeholder="https://example.com/anh-sach.jpg"
                                        />
                                        <p className="text-xs text-gray-400 mt-2">* Dán đường dẫn ảnh từ internet.</p>
                                    </div>
                                ) : (
                                    <div className="animate-fade-in">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-2 text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                </svg>
                                                <p className="text-sm text-gray-500"><span className="font-semibold text-blue-600">Bấm để tải ảnh</span></p>
                                                <p className="text-xs text-gray-400 mt-1">PNG, JPG (Tối đa 5MB)</p>
                                            </div>
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>

                        </form>
                    </div>

                    {/* Cột Phải: Preview */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <h3 className="text-lg font-bold text-gray-800">Xem trước bài đăng</h3>
                            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                                <div className="h-64 w-full bg-slate-100 flex items-center justify-center relative p-4">
                                    {previewImage ? (
                                        <img src={previewImage} alt="Cover" className="h-full object-contain shadow-lg" />
                                    ) : (
                                        <div className="text-center">
                                            <div className="bg-white w-24 h-32 mx-auto mb-3 shadow-sm border border-gray-200 flex items-center justify-center">
                                                <span className="text-xs text-gray-400">No Image</span>
                                            </div>
                                            <p className="text-xs text-gray-400">Ảnh sẽ hiện tại đây</p>
                                        </div>
                                    )}
                                    <div className="absolute bottom-3 flex gap-1.5">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                        <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                                        <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h4 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">{form.title || "Tiêu đề sách sẽ hiện ở đây"}</h4>
                                    <p className="text-sm text-gray-500 mb-3">{form.author || "Tên tác giả"}</p>
                                    <span className="inline-block bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-md mb-2 font-medium">{form.category}</span>
                                    <p className="text-blue-600 font-bold text-xl mb-3">{form.price ? Number(form.price).toLocaleString() : "0"} VNĐ</p>
                                    <p className="text-xs text-gray-400 line-clamp-3">{form.description || "Mô tả chi tiết về sách, nội dung..."}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Link to="/" className="flex items-center justify-center w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition">Hủy</Link>
                                <button onClick={handleSubmit} className="flex items-center justify-center w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition transform hover:-translate-y-0.5">Đăng bán</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default AddBook;