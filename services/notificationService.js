export const createNotification = async (notification) => {
    try {
        const {data,error} = await supabase 
        .from('notifications')
        .insert(notification)
        .select()
        .single();

        if(error){
            console.log('Notification Error:', error);
            return {success: false, msg: "Something went wrong!"};
        }
        
        return {success: true, data: data};
    }
    catch(error) {
        console.log('Notification Error:', error);
        return {success: false, msg: "Something went wrong!"};
    }
}