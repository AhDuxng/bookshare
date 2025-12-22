# Common Components

Thư mục này chứa các component tái sử dụng trong toàn bộ ứng dụng. Các component được thiết kế để dễ dàng sử dụng, tùy chỉnh và nhất quán về mặt giao diện.

## 📦 Cách sử dụng

Import các component từ file index:

```jsx
import { Button, IconBox, FormInput, Badge, TabButton, StatCard, UserCard } from './common';
// hoặc
import { Button, IconBox } from './components/common';
```

---

## 🎨 Components

### **Basic Components:**

### 1. **IconBox**
Hộp icon với background màu, dùng cho các section header

**Props:**
- `icon` (string, required): Tên icon từ Material Symbols
- `color` (string): 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'amber' | 'primary' - Default: 'blue'
- `size` (string): 'sm' | 'md' | 'lg' - Default: 'md'
- `className` (string): Custom CSS classes

**Ví dụ:**
```jsx
<IconBox icon="image" color="primary" />
<IconBox icon="sell" color="green" size="lg" />
```

---

### 2. **FormInput**
Input field thống nhất với label, validation, và suffix

**Props:**
- `label` (string): Nhãn của input
- `required` (boolean): Hiển thị dấu * bắt buộc
- `type` (string): Loại input - Default: 'text'
- `placeholder` (string): Placeholder text
- `value` (any): Giá trị input
- `onChange` (function): Handler khi thay đổi
- `error` (string): Thông báo lỗi
- `helperText` (string): Text gợi ý
- `suffix` (string): Text hiển thị cuối input (VD: 'đ', '%')
- `variant` (string): 'default' | 'price' | 'search' - Default: 'default'

**Ví dụ:**
```jsx
<FormInput
  label="Giá bán"
  required
  type="number"
  value={price}
  onChange={(e) => setPrice(e.target.value)}
  suffix="đ"
  variant="price"
/>
```

---

### 3. **FormTextarea**
Textarea với validation và label

**Props:**
- `label`, `required`, `placeholder`, `value`, `onChange`, `error` (giống FormInput)
- `rows` (number): Số dòng - Default: 5

**Ví dụ:**
```jsx
<FormTextarea
  label="Mô tả"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={8}
/>
```

---

### 4. **FormSelect**
Select dropdown với options

**Props:**
- `label`, `required`, `value`, `onChange`, `error` (giống FormInput)
- `options` (array): Mảng objects với {value, label}

**Ví dụ:**
```jsx
<FormSelect
  label="Thể loại"
  required
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  options={[
    { value: 1, label: 'Văn học' },
    { value: 2, label: 'Kinh tế' }
  ]}
/>
```

---

### 5. **Button**
Nút chính với nhiều variants

**Props:**
- `variant` (string): 'primary' | 'secondary' | 'outline' | 'white' | 'ghost' | 'danger'
- `size` (string): 'sm' | 'md' | 'lg' | 'icon'
- `icon` (string): Icon hiển thị bên phải
- `className`, `onClick`, ...rest props

**Ví dụ:**
```jsx
<Button variant="primary" icon="arrow_forward">
  Tiếp tục
</Button>
```

---

### 6. **ActionButton**
Nút action nhỏ cho edit, delete, view...

**Props:**
- `icon` (string, required): Tên icon
- `variant` (string): 'default' | 'edit' | 'delete' | 'view' | 'approve'
- `tooltip` (string): Text tooltip khi hover
- `onClick` (function): Handler

**Ví dụ:**
```jsx
<ActionButton icon="edit" variant="edit" tooltip="Chỉnh sửa" onClick={handleEdit} />
<ActionButton icon="delete" variant="delete" tooltip="Xóa" onClick={handleDelete} />
```

---

### 7. **Badge**
Badge nhỏ cho status, count, label

**Props:**
- `variant` (string): 'default' | 'success' | 'error' | 'warning' | 'info' | 'primary' | 'count'
- `size` (string): 'sm' | 'md' | 'lg'
- `dot` (boolean): Hiển thị chấm tròn
- `pulse` (boolean): Chấm có nhấp nháy
- `children`: Nội dung badge

**Ví dụ:**
```jsx
<Badge variant="success" dot pulse>
  Đang hoạt động
</Badge>
<Badge variant="count" size="sm">5</Badge>
```

---

### 8. **TabButton**
Nút tab để filter

**Props:**
- `active` (boolean): Tab đang được chọn
- `onClick` (function): Handler
- `children`: Label của tab

**Ví dụ:**
```jsx
<TabButton active>Tất cả</TabButton>
<TabButton onClick={() => setTab('active')}>Đang hiển thị</TabButton>
```

---

### 9. **FilterButton**
Nút filter với icon và count

**Props:**
- `active` (boolean): Đang được chọn
- `count` (number): Số lượng items
- `icon` (string): Tên icon
- `onClick` (function): Handler
- `children`: Label

**Ví dụ:**
```jsx
<FilterButton active count={12} icon="book">
  Sách văn học
</FilterButton>
```

---

### 10. **PaginationButton**
Nút phân trang

**Props:**
- `active` (boolean): Trang hiện tại
- `disabled` (boolean): Vô hiệu hóa
- `onClick` (function): Handler
- `children`: Số trang hoặc icon

**Ví dụ:**
```jsx
<PaginationButton active>1</PaginationButton>
<PaginationButton onClick={() => setPage(2)}>2</PaginationButton>
<PaginationButton disabled>
  <span className="material-symbols-outlined">chevron_left</span>
</PaginationButton>
```

---

### **Card Components:**

### 15. **StatCard**
Card hiển thị thống kê với icon, value và badge

**Props:**
- `icon` (string, required): Tên icon
- `iconColor` (string): Màu icon - Default: 'blue'
- `title` (string, required): Tiêu đề stat
- `value` (any, required): Giá trị stat
- `suffix` (string): Hậu tố (VD: '/5', 'đ')
- `badge` (string): Text badge phụ
- `badgeVariant` (string): Variant của badge
- `highlight` (boolean): Hiển thị dạng highlight (gradient)
- `valueColor` (string): Custom color cho value
- `onClick` (function): Handler khi click
- `className` (string): Custom CSS

**Ví dụ:**
```jsx
<StatCard
  icon="star"
  iconColor="amber"
  title="Đánh giá"
  value={4.8}
  suffix="/5"
  badge="+0.2"
  badgeVariant="success"
/>

<StatCard
  icon="account_balance_wallet"
  title="Số dư ví"
  value="250.000đ"
  highlight={true}
/>
```

---

### 16. **InfoCard**
Card hiển thị thông tin với icon, title và content

**Props:**
- `icon` (string): Icon name
- `iconColor` (string): Màu icon
- `title` (string, required): Tiêu đề
- `subtitle` (string): Phụ đề
- `children` (node, required): Nội dung card
- `action` (node): Action button/element
- `variant` (string): 'default' | 'highlight'

**Ví dụ:**
```jsx
<InfoCard
  icon="location_on"
  iconColor="red"
  title="Địa chỉ giao hàng"
  subtitle="Mặc định"
  action={<Button size="sm">Sửa</Button>}
>
  <p>123 Nguyễn Huệ, Q.1, TP.HCM</p>
</InfoCard>
```

---

### 17. **UserCard**
Card hiển thị thông tin người dùng/người bán

**Props:**
- `name` (string, required): Tên người dùng
- `avatar` (string): URL avatar
- `rating` (number): Đánh giá
- `joinDate` (string): Năm tham gia
- `responseTime` (string): Thời gian phản hồi
- `badge` (string): Badge variant ('success', 'warning')
- `badgeText` (string): Text badge
- `link` (string): Link đến profile
- `action` (node): Action buttons
- `stats` (array): Mảng {label, value}

**Ví dụ:**
```jsx
<UserCard
  name="Nguyễn Văn A"
  avatar="https://..."
  rating={4.8}
  joinDate="2023"
  responseTime="< 1 giờ"
  badge="success"
  badgeText="Online"
  link="/profile/123"
  stats={[
    { label: 'Đã bán', value: '50 cuốn' },
    { label: 'Phản hồi', value: '98%' }
  ]}
  action={<Button>Nhắn tin</Button>}
/>
```

---

### 18. **FeatureCard**
Card hiển thị feature/bước hướng dẫn

**Props:**
- `icon` (string): Icon name
- `iconColor` (string): Màu icon
- `title` (string, required): Tiêu đề
- `description` (string, required): Mô tả
- `step` (number): Số thứ tự bước
- `image` (string): URL hình ảnh thay icon

**Ví dụ:**
```jsx
<FeatureCard
  icon="photo_camera"
  iconColor="blue"
  title="1. Đăng bán"
  description="Chụp ảnh và đăng tin chỉ trong 30 giây"
/>

<FeatureCard
  step={1}
  image="https://..."
  title="Bước 1"
  description="Mô tả chi tiết"
/>
```

---

### 19. **OrderCard**
Card hiển thị thông tin đơn hàng

**Props:**
- `orderId` (string, required): Mã đơn hàng
- `date` (string, required): Ngày đặt
- `bookTitle` (string, required): Tên sách
- `bookImage` (string): Ảnh sách
- `bookCategory` (string): Thể loại
- `seller` (string): Người bán
- `status` (string, required): Trạng thái
- `statusVariant` (string): Badge variant
- `price` (string, required): Giá
- `actions` (array): Mảng {icon, variant, tooltip, onClick}
- `onClick` (function): Handler khi click card

**Ví dụ:**
```jsx
<OrderCard
  orderId="#ORD-2341"
  date="10/05/2024"
  bookTitle="Nhà Giả Kim"
  bookImage="https://..."
  bookCategory="Tiểu thuyết"
  seller="Nguyễn Văn A"
  status="Hoàn thành"
  statusVariant="success"
  price="75.000đ"
  actions={[
    { icon: 'visibility', variant: 'view', tooltip: 'Xem', onClick: handleView },
    { icon: 'star', variant: 'default', tooltip: 'Đánh giá', onClick: handleRate }
  ]}
  onClick={() => navigate(`/order/${id}`)}
/>
```

---

### **Existing Components:**

### 20. **BookCard**
Card hiển thị thông tin sách (đã có sẵn)

---

### 21. **SectionHeader**
Header cho các section (đã có sẵn)

---

### 22. **StatusBadge**
Badge hiển thị status (đã có sẵn)

---

### 23. **Pagination**
Component phân trang đầy đủ (đã có sẵn)

---

## 🎯 Best Practices

1. **Luôn dùng components thay vì viết lại HTML + CSS**
   ```jsx
   // ❌ Không nên
   <button className="px-4 py-2 bg-blue-500...">Click</button>
   
   // ✅ Nên
   <Button variant="primary">Click</Button>
   ```

2. **Sử dụng variants có sẵn**
   - Giúp UI nhất quán
   - Dễ maintain
   - Responsive sẵn

3. **Kết hợp các components**
   ```jsx
   <div className="flex items-center gap-3">
     <IconBox icon="category" color="blue" />
     <FormSelect label="Danh mục" options={categories} />
   </div>
   ```

4. **Extend khi cần thiết**
   ```jsx
   <Button className="w-full mt-4" variant="primary">
     Custom width và margin
   </Button>
   ```

---

## 📁 Cấu trúc thư mục

```
common/
├── ActionButton.jsx    # Nút action nhỏ
├── Badge.jsx          # Badge status/count
├── BookCard.jsx       # Card sách
├── Button.jsx         # Nút chính
├── FormInput.jsx      # Input, Textarea, Select
├── IconBox.jsx        # Hộp icon
├── Pagination.jsx     # Phân trang
├── SectionHeader.jsx  # Header section
├── StatusBadge.jsx    # Badge status
├── TabButton.jsx      # Tab, Filter, Pagination buttons
├── index.js           # Export tất cả
└── README.md          # File này
```

---

## 🚀 Thêm component mới

1. Tạo file component trong thư mục `common/`
2. Export component trong `index.js`
3. Cập nhật README này với docs
4. Test component trong nhiều trường hợp sử dụng

---

## 💡 Tips

- Sử dụng Material Symbols cho icons: [Material Symbols](https://fonts.google.com/icons)
- Tuân thủ color scheme: primary, success (green), error (red), warning (amber), info (blue)
- Dark mode được support tự động thông qua Tailwind `dark:` classes
