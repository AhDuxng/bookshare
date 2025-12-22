import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SectionHeader, BookCard } from './common';

function BookList({ books }) {
  const navigate = useNavigate();
  const [latestBooks, setLatestBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách sách mới nhất từ API
  useEffect(() => {
    const fetchLatestBooks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/books/search', {
          params: {
            page: 1,
            limit: 10,
            sort: 'created_at',
            query: '' // Truyền empty query để lấy tất cả
          }
        });
        console.log('API Response:', response.data);
        const booksData = response.data.books || response.data || [];
        setLatestBooks(booksData);
      } catch (error) {
        console.error('Lỗi khi lấy sách mới:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestBooks();
  }, []);
  // Dữ liệu giả lập cho phần "Sách mới đăng" (Nếu books rỗng hoặc chưa có API)
  // Trong thực tế, bạn sẽ dùng prop `books` truyền vào
  const dummyBooks = [
    {
      id: 101,
      title: "Nhà Giả Kim",
      author: "Paulo Coelho",
      price: "60.000đ",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8O6uM9Qag43j78qpwkxjrDCUq47xMxyEIlpHsBdQLj2tVYMYwWGwNoToFi4IQFAEX08U75XrTtLAL_0WLzGUsdSbnhm88wPm8tKPBOvSwK8nIEvmeR9a1uDf0Jy20E4xP93q0UIVEXZ8__NOZWT9o525wpCWw4cKpuPDYFA_oeQCeNGJHdx5KJ5t73AxgYr8tdhOSTyDDpLeChWautbvi8IBMzjkhC9iD22yjvF2-8YI68qOB2lkfICpInp6WUHKXPGUecXClUQ",
      condition: "Mới 90%",
      conditionColor: "green",
      bottomBadge: (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          5 phút trước
        </>
      ),
      user: {
        name: "Đức Thịnh",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7WfNVlv6AVS-2aQoMRLFH4Fh16d3F-EC9VcIAvDV7KWuSc2CLynPExENBuJ88rtRPrQE0-kfItf7_EXCs67xF92B6M6TVsMHcAV_BR6iA6g2HvphJ5orE-bd_WZBab61_l6TBxDYmhgoio6cJA7qfuvGF8IOqmTTMPMTmxYawKUv1Xd_wnQ5yc9U4aWxa2IBEpXcAb9vIVoXFC2wPCupqNYVONLd8zQj76xYiUey8CIHvMIk-tvfvAON7vZHH40qc267MUw2-yQ"
      }
    },
    {
      id: 102,
      title: "1984",
      author: "George Orwell",
      price: "95.000đ",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8jRLD2VuAAF_kGeQhFLBeeS-s_z1N_dCCB1lLJy-jKRn66MmxJV66ROPaNvgvVQfFfsVsGKQI4i-noFekn2A-urAkHT8Tre4OQZideQ3NeFGKV-AYnOgSiFwQrpXPA-18-0rfEmx6WuRdQf27vK0JvvRlT34CipSgkhDwt5r3W-G3XI9bdTwIMKCL6vKV9K8Y-1Bv5GKzW0l4NSWvyxbRREpda5vYp5ZzmkO-yegaBhtBMlcnTmIqkihe-T58UVDbtzqovwqEAg",
      condition: "Mới 100%",
      conditionColor: "blue",
      bottomBadge: (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          15 phút trước
        </>
      ),
      user: {
        name: "Mai Phương",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHozbjQreLvLTto6s5QKJjFjzJa6s1GWenn2JwSJZrwO-SqNICbxRg1oAAPw6DKueajR0dJPLmqlEfPXOyZaO70rVJFovLg_cKU7LuG1Jh0Z9R5HirfeZus3iUimIVH9L9LKHRy8PeTXUHW_swfs2In_7jbKwXa2uoxFWuSWaVPgwl0Kx678nv04XHNFtz6eu6tdmOjFltEnVByyLIgW7kKMrArpfSp5z_8VC4stgWTo3DHV4nVfvOQNHMpTfBCFHBsVwotuzjOQ"
      }
    },
    {
      id: 103,
      title: "Harry Potter và Hòn đá Phù thủy",
      author: "J.K. Rowling",
      price: "150.000đ",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-7UvwzjdjFz5-il-lLQkQvRFSWQKDdsSR1d4nhvSHPRfamBfZYpF8Ivb0ZBeYQAX6Hx7m4RTr1ljcidmloZn9tEsT8fOM_ojNA-K65soBgDcxfg8LkF-WtE-RFhoFrroZ05qSrXUhhk0vtTNSuyVx1mEzJrDrONxb4K4_hXq8hp-pQ1C0mg-ROb1J2OCTaUuMjln7JJenlGJ5fvMLPJ1MeC1NFcQqjxF0EQl7NvdjxaTmxcwpqQ7D6aej4sWc6_PSrJPLYQYxfA",
      condition: "Mới 85%",
      conditionColor: "green",
      bottomBadge: (
        <>
          <span className="material-symbols-outlined text-[10px]">schedule</span>
          1 giờ trước
        </>
      ),
      user: {
        name: "Trung Kiên",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdAAzd8zqkXF7fDXYc858I523kO6yJfzY5nokOCzCipWhufrZTYRZ1pYJpsyPqt0Ww4-_1oO-46dv5lT9Yuz9xB6KtKHpmgwRPJgMP0ZySW9mfUQthmzpVMBFESVuRL1ArQmQtdvYUn09do3OC48eXZvjKpCFc8HBVId-U5G13JT_Rsr0QdOwjL0XgJHXT6VBQ4SKLWwlzs7S_9IHuw-IZttwKJuRNeOlpLtVJIiU56GM8Dj5w583uuEUDE512FhoSXll7dWdF5Q"
      }
    },
    {
      id: 104,
      title: "Cha giàu cha nghèo",
      author: "Robert Kiyosaki",
      price: "80.000đ",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDG0VvRctEFjvgq3vcp2YV6R2SEp8I0kifdHsS2RUcf9u-EoaOHKKIZ6feiGNNyQxlurD_bSb57JiblBjj51-jRMyERdEFai-tk8hHkmDiKqDeMk6DRJp_2zwUcYdqWvZBe1yNnDfTvMq0k0x5jl1Y8bbI09H-bClgD6cZzWkY95Z4BYRt401vyErGl4UBVoa4UeCFjS6eLOSI2zDEmt9075z2aM3M-xdnJz-ZpFowBaJ5jclNWku5H8_2wcI3LHdqsTPck9F5Y3A",
      condition: "Khá tốt",
      conditionColor: "gray",
      bottomBadge: (
        <>
          <span className="material-symbols-outlined text-[10px]">schedule</span>
          2 giờ trước
        </>
      ),
      user: {
        name: "Lan Anh",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCs9cTlCdomdZ5cmDIi9FNf98iriv-lb_ddqAd8OgJ7hCSl5TJm00dHSchWrHeqhdm0mOg_m2z-KsQAuh91t8_MmMQtOX5y48TCb-3CFGy0_MhEUn-nwfol_inmH5Wso85Zqb_g5PJ2BNtxC-BZNgMxNQ0ei6_acZckXVEyFjzPlNeWKsiDRgdt7aNPe-2RQKvLIWb6mfy0u3pMp2Z8Fg1rfl0ALi9C0crueUbJXA33kET9CIhwc1HjcteFdAStAmDsGfUDaTtFhw"
      }
    },
    {
      id: 105,
      title: "Tuyển tập Nam Cao",
      author: "Nam Cao",
      price: "115.000đ",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoiP3aLuBVIeJVcK22vU8RmOWd6vu_h5Nf0HgR24tzjZmT2BVHaZynYBDAzd0hivK_2NK0t-noq6FCCcWgWByp1mbGgywlcvR8FLcOSMilGDb00U-BTLyvKrRRCFDLSs1musbYlamMnhf-zu9v5i2NZ0P-qhLaXepauZhtyNcHQjlEO_K9kwbRcZzqDZ4BNyQHVcVb7fzwynD32qnYNTiCMQj2v42u8LLruhwmVLUlfwBPw9LGAsAA_3idSjADnWBupYB8pDFpIA",
      condition: "Mới 100%",
      conditionColor: "blue",
      className: "hidden xl:flex",
      bottomBadge: (
        <>
          <span className="material-symbols-outlined text-[10px]">schedule</span>
          3 giờ trước
        </>
      ),
      user: {
        name: "Quốc Tuấn",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgrHw1uLLjxalTt1MGV7q-UduX72NZ324TEmAQJ98YVDRxTGd5hsSWtPDIJ9TTA2t_LCn2SPLUofyPyFCLyDLLyjM2Z88G3TA_novKyFccgBEPqnCGWBwc119EiMOvYfV7IrtVBBU3OInNi-jcazWHbKTMQT1kCuiJFswM5Ro3wwR3SOHn1FSjeGwOW7acMh5e168jCllZcDmGruCGPRoZDO8R-16AMtwqxSpUoROinyP_KfdgITySIedP6hfPDgnbXUC14x4DMg"
      }
    }
  ];

  const displayBooks = latestBooks.length > 0 ? latestBooks : [];

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <SectionHeader 
          title="Sách mới đăng" 
          iconColor="bg-red-500"
          badge={{ text: "Mới nhất", color: "red" }}
        />
        <button
          onClick={() => navigate('/browse')}
          className="text-primary hover:text-primary-hover font-semibold text-sm flex items-center gap-1 transition-colors"
        >
          Xem tất cả
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : displayBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[40px] text-slate-400">book</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Chưa có sách nào</h3>
          <p className="text-slate-500 text-sm">Hãy trở thành người đăng tin đầu tiên!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
          {displayBooks.map(book => {
            // Map dữ liệu từ database
            const bookData = {
              id: book.id,
              title: book.title,
              author: book.author,
              price: book.price ? `${Number(book.price).toLocaleString()}đ` : 'Liên hệ',
              image: book.image_url,
              condition: book.condition || 'good',
              user: book.users ? {
                name: book.users.username,
                avatar: book.users.avatar_url
              } : null
            };
            
            return (
              <BookCard 
                key={book.id}
                {...bookData}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

export default BookList;