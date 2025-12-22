import React from 'react';
import { SectionHeader, BookCard } from './common';

function CategoryList() {
  // Dữ liệu giả lập (Sau này sẽ lấy từ API)
  const books = [
    {
      id: 1,
      title: "Giết con chim nhại",
      author: "Harper Lee",
      price: "85.000đ",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAt-4my-LCQYtCBrvnYPeACFKXPo-Ak1Py4TbctGDYHPERI8eALVBI-hBPAHZWi5CWhwPFs27E_uAWZUVsYAHSTMjrmSLijo0_f9hDpAuStTK7jB4p09KE-uO1zF48EEOEawo2-cV9pWm-Ts-qdIOy9YQPeikUtPQlEaUwEdsGx1Ao9Nz-m4E18ea1-oCIekRyQj3jviqug1GZgCG0diO4OfApj__L4J_GFCk9DS1-95ujJMzHDiTNGsG_bnXeUreW3Cm3prpDzGA",
      condition: "Mới 95%",
      conditionColor: "green",
      overlayBadge: "Bán chạy",
      user: {
        name: "Minh Anh",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMd4mCqVGV5vcVexlE6NmOpCrmROgoWUnZS2mjfyNEP-xWtftM2cH_pXO2nWa8CI5lOS5lDXYlPPOXo8Ry91T02PiqdBb-takXgp5zkxkIAanabn7tIq_s8FOTU8EkaJcKUsAoDjgCoYtlF2gBeqeDAt3QrQd78N_QCgkrIgsc5aXINk-viay4bMOBYLyRfXnIMm2wj_1Fc4rKDvpPhrvwvt4bNJa7mmPOBjOZcVj8-TONUfVc_gauS-Uo1KRc-4hzM8MyLcnFCQ"
      }
    },
    {
      id: 2,
      title: "Atomic Habits - Thay đổi tí hon",
      author: "James Clear",
      price: "120.000đ",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2KJrmqDUwcvrgaEVVHwwOPI4sQQaD74q8WxtAh2VvKQ9nJ8n9TUMMrdMHQvcDxm6XX_lw-IYAJlRnL6bEUjaH_D0VZpBlsqXLvOg0TxmhDPFpZtCg0kSCNqsnKWdbClcl71RTUAaWCCl5qSfoahq47trCSTCBk-spGX28Dd3R-3V88Z8vx2OZm5Pps8zgSt5ZGQ_YPu1xL3i2wf20rh53BWtlpMgUrqb0efOAgs_hqmXzsoY17z-SnOzwh5W6py8O3djhiHEjTA",
      condition: "Mới 100%",
      conditionColor: "blue",
      user: {
        name: "Tuấn Hưng",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnFmsgOFTWx6HUJGlWUnUFSdhml12ph191F2GIQ4fwPNNFPA_9usrPKlCX5JBkciWLqd-3-r25jnvjUSEcSKa2ljOa6RFFgty0EooUGjtCTqFoj7dQysv1_lzou148P--O4S7uCGWMGlHPQKamzoP5_dmr6RkNP2biH85wV2Z3yKxFswhZlYyV1HxgeV2feJyW69O30ch-iSPers0kSG9uDwLUJQYH1SywRdjjzigugkVtAmC_zbXYCxhMDP-cUoBA0MQ-FWCsgg"
      }
    },
    {
      id: 3,
      title: "Sapiens: Lược sử loài người",
      author: "Yuval Noah Harari",
      price: "150.000đ",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLHrAT3eFfCeSkO0VdfhMQEkunxc3ZMN5fO-L0rJJ72VS5PyJKDV_dnPrm8AuwgODFhC2uwvX3_coJoftY6WM79_sRZa-p3pFqo-1WOcm7F9plNenM5CzaZPPYuUIyMS3T_Ye3_IofAZx2KnErx9V8JFCUabuSxXQgk9jyS1HyKsYeU4kpVLNDLlmXGrTYE5o8A4G8B3J_5TjQsa7IhcKsW_RhMzf3LEC4fWZoZptbSjz3wLwWjolxyRiWDoCMPuKUZUloD1HWtg",
      condition: "Khá tốt",
      conditionColor: "gray",
      user: {
        name: "Ngọc Lan",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmdih7yGELv56fTtjINgXtqK5uapJTOw-UC8Vh3Y5nAb07abZO23ImBqRueKgeTDjqkcGg4EvD6hEiwMIRLi_EbP723DOWbvYZcQJiLw5pVjMxRw5WKAYQy0XCJlpwsPlkEx13P4wp_6cb-mMe7sG_9Ilw40S0zDx9wi6r_Fl_e_pKKU-OjnAM9OUHRuXyqy5JAyBLJqeYxP1tkvPT2LOPVf-JzBqENFvwDOu3I4mpqd5374bPsHlia7U1TZTh5xR1Dfc1mPN6iA"
      }
    },
    {
      id: 4,
      title: "Dune - Xứ cát",
      author: "Frank Herbert",
      price: "110.000đ",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuANvDRcSjHUAV-P026Ozue7AuJq8bzzmnScCaY64nXWDj4HgjmacqaCd4xz4JBU5nwPMESB39yVlCY533u_c3FUzGf226qOX5yQ_iaLrOOE-YHEgY2-lpXh8Au_XsphX3KM_qRDZiMBzf1MtqJ7lmKzEQEMU3DWDIpU0lfFqPTClhljFQQKv4rljT7mT-J_49FvJdg2n-mEGWl-3uAE9hdlAa_aGAELQdizYRz6c381q_k7R1uIYH7MWrKws6a7X9oudgzxogCpdQ",
      condition: "Cũ",
      conditionColor: "orange",
      user: {
        name: "Hoàng Nam",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzYNiHAznmKokossL7j13AYRTF6Y7HBGQNN0qopEqmaaMhrCanFeesX4y77ZAxzY9kg1x_KKM8mUwe-zBBGMZ0FLUSBH6sLh9iE6FnwNGKvsomfR7XoEtHgHGt3ek6MB58NqFA31Yg5F3qqBje84TebSdCQBT6MmQc7mniP2n1TPjk9uEJPPaIztLgvlTXqkkBpKYYO-wA48U41yqvnxfZZ-xepEIxcYj8RkTBeLNH36RGlUXfjZpTJvCJcL-lLtSjgNXjG_HxQw"
      }
    },
    {
      id: 5,
      title: "Thiết kế cho người mới bắt đầu",
      author: "Nhiều tác giả",
      price: "75.000đ",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDb-qm_KaWFjiuTpHBBVn7gHQC5XKzKwl8Uu0HgwNPFjIDrGnmMioRlhMJlcSEgp099ED4M6dM9eNcI6aYojqNC2mNFbKoNZCDjUw5rMAx5QAtIFCFyFxzwSSOgCHYTa_jnTJqpDxBfrsdPQ6Zb8KqZlE6VNgwPfkKu-ziwJDYEXNhvBnQ7TkdGJhUCRg1ym7HPCBI8LeIDycKmZudv1DAV2j1JxstIZ8ZIDysyq6MERalcMozcNXTpGzCNViDQ5UgiwJ1msqYPKw",
      condition: "Mới 99%",
      conditionColor: "green",
      className: "hidden xl:flex", // Ẩn trên màn hình nhỏ hơn xl
      user: {
        name: "Thanh Hương",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEAanTqwr9pSZd0__-XAreszPWr_nuszpZ-RagyOUnG1E-N_ctDxeKPwNB4t5EW3B6vzAkPh56D5EkYH7ihyUTEK6oYCy7HTLKaMSMJR3XuNXEZdWib2tlugI4DLeL7UMoPfeF0qxztCouw7MKrNvCCnFXHL2w6sEUUU6qS-fR8wGjjuG6OJMD61I56QUg_xn7lU8zP6rDEBYbq1SmqcaL_8_yvNCqdB3gcMoUER1f2nZ1WwRXWnh6Lyz5Jd3c5OYPVCDJsFtOXg"
      }
    }
  ];

  return (
    <section>
      <SectionHeader title="Sách nổi bật" />
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
        {books.map(book => (
          <BookCard key={book.id} {...book} />
        ))}
      </div>
    </section>
  );
}

export default CategoryList;