const supabase = require('./supabase');
const bcrypt = require('bcrypt');

async function testRegistration() {
    try {
        console.log('🧪 Testing registration flow...\n');

        const testUsername = 'testuser' + Date.now();
        const testEmail = `test${Date.now()}@example.com`;
        const testPassword = 'testpass123';

        console.log('📝 Test data:');
        console.log('   Username:', testUsername);
        console.log('   Email:', testEmail);
        console.log('   Password:', testPassword);
        console.log('');

        // Hash password
        console.log('🔐 Hashing password...');
        const hash = await bcrypt.hash(testPassword, 10);
        console.log('✅ Password hashed:', hash.substring(0, 20) + '...\n');

        // Try to insert
        console.log('💾 Inserting into database...');
        const { data, error } = await supabase
            .from('users')
            .insert({
                username: testUsername,
                email: testEmail,
                password: hash,
                balance: 0
            })
            .select()
            .single();

        if (error) {
            console.error('❌ Error inserting user:');
            console.error('   Code:', error.code);
            console.error('   Message:', error.message);
            console.error('   Details:', error.details);
            console.error('   Hint:', error.hint);
            
            if (error.code === '42501') {
                console.log('\n⚠️  PERMISSION ERROR DETECTED');
                console.log('   This means the Supabase API key does not have permission');
                console.log('   to INSERT into the users table.');
                console.log('\n   Solutions:');
                console.log('   1. Enable Row Level Security (RLS) policies in Supabase');
                console.log('   2. Or use the service_role key instead of anon key');
                console.log('   3. Or disable RLS for the users table (not recommended)');
            }
        } else {
            console.log('✅ User created successfully:');
            console.log('   ID:', data.id);
            console.log('   Username:', data.username);
            console.log('   Email:', data.email);
            
            // Clean up
            console.log('\n🧹 Cleaning up test data...');
            await supabase.from('users').delete().eq('id', data.id);
            console.log('✅ Test data deleted');
        }

    } catch (err) {
        console.error('❌ Unexpected error:', err.message);
        console.error(err.stack);
    }
}

testRegistration();
