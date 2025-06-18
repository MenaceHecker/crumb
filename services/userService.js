export const getUserData = async (userId) => { 
    try {
        const {data, error} = async (userId) => {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();
        }
    }
    catch (error) {
        console.log('Error fetching user data:', error);
        return { success: false, msg: error.message };
    
    }
    }           