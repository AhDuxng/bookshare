import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ 
  id, 
  title, 
  author, 
  price, 
  originalPrice,
  image, 
  category,
  condition, 
  conditionColor = "green", // green, blue, orange, gray, amber
  rating,
  user, // { name, avatar, initial }
  overlayBadge, // Ví dụ: "Bán chạy", "-30%"
  overlayBadgeColor = "amber", // amber, red
  bottomBadge, // Ví dụ: "5 phút trước" (React Node)
  actionButtons, // React Node cho các nút hành động (ví dụ: Thêm vào giỏ, Chỉnh sửa)
  showHoverAction = false, // Có hiển thị nút "Xem chi tiết" khi hover không
  className = ""
}) => {
  
  // Map màu sắc cho badge tình trạng sách
  const colorClasses = {
    green: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30",
    blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30",
    orange: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/30",
    amber: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30",
    gray: "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
  };

  const badgeClass = colorClasses[conditionColor] || colorClasses.gray;

  // Map màu cho overlay badge
  const overlayBadgeClasses = {
    amber: "bg-amber-400 text-amber-950",
    red: "bg-red-500 text-white",
    white: "bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-white border border-slate-100 dark:border-slate-700"
  };
  const overlayClass = overlayBadgeClasses[overlayBadgeColor] || overlayBadgeClasses.amber;

  return (
    <div className={`group flex flex-col h-full bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800/60 overflow-hidden hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300 ${className}`}>
      {/* Image Section */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-100">
        <img 
          src={image} 
          alt={title} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Overlay Badge (Top Left/Right) */}
        {overlayBadge && (
          <div className={`absolute top-3 ${overlayBadgeColor === 'white' ? 'right-3' : 'left-3'}`}>
            <div className={`${overlayClass} px-2.5 py-1 rounded-md text-[11px] font-bold shadow-sm uppercase tracking-wide`}>
              {overlayBadge}
            </div>
          </div>
        )}

        {/* Condition Badge (Top Right - nếu không phải là overlayBadge dạng white) */}
        {condition && overlayBadgeColor !== 'white' && (
           <div className="absolute top-3 right-3">
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-800 dark:text-white shadow-sm border border-slate-100 dark:border-slate-700 uppercase tracking-wide">
                {condition}
            </div>
           </div>
        )}

        {/* Bottom Badge (Bottom Center) */}
        {bottomBadge && (
          <div className="absolute bottom-2 left-2 right-2">
            <div className="bg-white/90 dark:bg-gray-900/90 text-text-primary dark:text-white text-[10px] font-medium px-2 py-1 rounded backdrop-blur-sm shadow-sm flex items-center gap-1 w-fit">
              {bottomBadge}
            </div>
          </div>
        )}

        {/* Hover Action: Xem chi tiết */}
        {showHoverAction && (
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                <Link to={`/book/${id}`} className="bg-white text-slate-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-primary hover:text-white">
                    Xem chi tiết
                </Link>
            </div>
        )}
        
        {/* Custom Action Buttons on Image (e.g. Edit/View for Profile) */}
        {!showHoverAction && actionButtons && (
             <div className="absolute bottom-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                {actionButtons}
             </div>
        )}

        <Link to={`/book/${id}`} className="absolute inset-0 z-0" />
      </div>

      {/* Info Section */}
      <div className="p-5 flex flex-col flex-1">
        {category && (
            <div className="mb-2">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-500 uppercase tracking-wider">
                    {category}
                </span>
            </div>
        )}

        <Link to={`/book/${id}`}>
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-1 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {title}
            </h3>
        </Link>
        
        <p className="text-sm text-slate-500 mb-4 line-clamp-1">{author}</p>
        
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col gap-3">
          <div className="flex items-end gap-2">
            <span className="text-lg font-bold text-primary">{price}</span>
            {originalPrice && <span className="text-xs text-slate-400 line-through mb-1">{originalPrice}</span>}
            
            {/* Nếu không có originalPrice nhưng có conditionColor (dùng cho BookList cũ) thì hiển thị badge ở đây */}
            {!originalPrice && !category && condition && (
                 <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ml-auto ${badgeClass}`}>
                    {condition}
                 </span>
            )}
          </div>

          {/* User & Rating */}
          {user && (
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {user.avatar ? (
                        <img className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-600" src={user.avatar} alt={user.name} />
                    ) : (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ring-1 ${user.initial === 'T' ? 'bg-blue-100 text-primary ring-blue-50' : 'bg-purple-100 text-purple-600 ring-purple-50'}`}>
                            {user.initial || user.name.charAt(0)}
                        </div>
                    )}
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate max-w-[80px]">{user.name}</span>
                </div>
                {rating && (
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded text-amber-500 dark:text-amber-400">
                        <span className="material-symbols-outlined text-[12px] fill-current">star</span>
                        <span className="text-[10px] font-bold">{rating}</span>
                    </div>
                )}
            </div>
          )}
          
          {/* Action Button (Add to Cart) */}
          {showHoverAction && (
             <button className="w-full mt-1 bg-primary/5 dark:bg-slate-700 border border-transparent text-primary hover:bg-primary hover:text-white font-semibold py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center justify-center gap-2 group/btn">
                <span className="material-symbols-outlined text-[18px] group-hover/btn:animate-bounce">add_shopping_cart</span>
                Thêm vào giỏ
            </button>
          )}
          
          {/* Custom Footer Action (e.g. More vert for Profile) */}
          {!showHoverAction && actionButtons && (
             <div className="flex justify-end">
                 {/* Nút này thường được xử lý riêng ở parent component nếu cần */}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;