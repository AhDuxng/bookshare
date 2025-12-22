const supabase = require('../supabase');

// Lấy người dùng theo ID
exports.getUserById = async (userId) => {
    console.log('🔍 Fetching user by ID:', userId);
    const { data, error } = await supabase
        .from('users')
        .select('id, username, email, avatar_url, balance, name, phone, gender, address')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('❌ Error fetching user:', error.message);
        throw new Error(error.message);
    }
    console.log('✅ User fetched:', data);
    return data;
};

// Cập nhật avatar
exports.updateAvatar = async (userId, avatarUrl) => {
    console.log('💾 Updating avatar for user:', userId);
    console.log('🔗 Avatar URL:', avatarUrl);
    
    const { data, error } = await supabase
        .from('users')
        .update({ avatar_url: avatarUrl })
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        console.error('❌ Error updating avatar:', error.message);
        throw new Error(error.message);
    }
    console.log('✅ Avatar updated in database:', data);
    return data;
};

// Cập nhật thông tin profile
exports.updateProfile = async (userId, updateData) => {
    console.log('💾 Updating profile for user:', userId);
    console.log('📝 Update data:', updateData);
    
    // Lọc các trường hợp lệ
    const allowedFields = ['name', 'email', 'phone', 'gender', 'address'];
    const filteredData = {};
    
    for (const field of allowedFields) {
        if (field in updateData) {
            filteredData[field] = updateData[field];
        }
    }
    
    // Thêm timestamp update
    filteredData.updated_at = new Date().toISOString();
    
    console.log('🔄 Filtered data:', filteredData);
    
    const { data, error } = await supabase
        .from('users')
        .update(filteredData)
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        console.error('❌ Error updating profile:', error.message);
        throw new Error(error.message);
    }
    console.log('✅ Profile updated in database:', data);
    return data;
};