// File: src/components/PostPreview.jsx
// Component xem trước bài đăng (logic, không CSS)

export function PostPreview({ title, description, price, images, seller }) {
  const displayTitle = title?.trim() || 'Tên sách sẽ hiển thị ở đây';
  const displayDesc = description?.trim() || 'Mô tả sẽ hiển thị ở đây';
  const displayPrice = price ? `${Number(price).toLocaleString()} đ` : 'Giá sẽ hiển thị ở đây';
  const displayImages = images && images.length ? images : [];
  const sellerName = seller?.name || 'Bạn';
  const sellerAvatar = seller?.avatar || null;
  const sellerInitial = (seller?.initial || sellerName.charAt(0)).toUpperCase();

  return (
    <div className="flex gap-4">
      <div className="w-20 h-28 bg-slate-200 dark:bg-slate-700 rounded-lg shrink-0 shadow-sm overflow-hidden">
        {displayImages[0] && (
          <img src={displayImages[0]} alt="preview-main" className="w-full h-full object-cover" />
        )}
      </div>
      <div className="flex-1 space-y-3 py-1">
        <div className="text-base font-bold text-slate-900 dark:text-white line-clamp-2">{displayTitle}</div>
        <div className="text-sm text-primary font-semibold">{displayPrice}</div>
        {/* Seller row */}
        <div className="flex items-center gap-2">
          {sellerAvatar ? (
            <img src={sellerAvatar} alt={sellerName} className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-600" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center ring-1 ring-slate-200 dark:ring-slate-600">
              {sellerInitial}
            </div>
          )}
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate max-w-[140px]">{sellerName}</span>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-300 line-clamp-3">{displayDesc}</div>
        <div className="flex gap-2 mt-2 flex-wrap">
          {displayImages.slice(0, 4).map((url, idx) => (
            <div key={idx} className="w-10 h-12 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
              <img src={url} alt={`preview-${idx}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
