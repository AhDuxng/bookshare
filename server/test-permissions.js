const supabase = require('./supabase');
const bcrypt = require('bcrypt');

async function testPermissions() {
    try {
        console.log('🔍 Step 1: Checking users table...\n');
        
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .limit(1);
        
        if (error) {
            console.error('❌ SELECT Error:', error.message);
            console.error('   Code:', error.code);
            if (error.code === '42501') {
                console.log('\n⚠️ RLS is blocking SELECT operations!');
            }
        } else {
            console.log('✅ SELECT works!');
            if (data.length > 0) {
                console.log('   Columns:', Object.keys(data[0]).join(', '));
            } else {
                console.log('   Table is empty');
            }
        }
        
        console.log('\n🔍 Step 2: Testing INSERT...\n');
        
        const testUsername = 'test_' + Date.now();
        const testEmail = 'test_' + Date.now() + '@example.com';
        const hash = await bcrypt.hash('test123', 10);
        
        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({
                username: testUsername,
                email: testEmail,
                password: hash
            })
            .select()
            .single();
        
        if (insertError) {
            console.error('❌ INSERT Error:', insertError.message);
            console.error('   Code:', insertError.code);
            
            if (insertError.code === '42501') {
                console.log('\n⚠️⚠️⚠️ RLS is STILL ENABLED! ⚠️⚠️⚠️');
                console.log('\nBạn cần:');
                console.log('1. Vào Supabase Dashboard');
                console.log('2. Vào Table Editor → users table');
                console.log('3. Click vào biểu tượng Shield (🛡️) ở góc phải');
                console.log('4. DISABLE Row Level Security');
                console.log('5. Hoặc chạy SQL: ALTER TABLE users DISABLE ROW LEVEL SECURITY;');
            }
        } else {
            console.log('✅ INSERT Success!');
            console.log('   User ID:', newUser.id);
            console.log('   Username:', newUser.username);
            
            // Cleanup
            await supabase.from('users').delete().eq('id', newUser.id);
            console.log('✅ Cleanup done');
        }
        
    } catch (err) {
        console.error('❌ Unexpected error:', err.message);
    }
}

testPermissions();
