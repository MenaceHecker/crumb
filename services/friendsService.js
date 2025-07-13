import { supabase } from '../lib/supabase';

export const sendFriendRequest = async (userId, friendId) => {
    try {
        // Check if friendship already exists
        const { data: existingFriend, error: checkError } = await supabase
            .from('friends')
            .select('*')
            .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            console.log('Error checking existing friendship:', checkError);
            return { success: false, msg: 'Error checking existing friendship' };
        }

        if (existingFriend) {
            if (existingFriend.status === 'accepted') {
                return { success: false, msg: 'You are already friends with this user' };
            } else if (existingFriend.status === 'pending') {
                return { success: false, msg: 'Friend request already sent' };
            } else if (existingFriend.status === 'blocked') {
                return { success: false, msg: 'Cannot send friend request to this user' };
            }
        }

        // Create friend request
        const { data, error } = await supabase
            .from('friends')
            .insert([{
                user_id: userId,
                friend_id: friendId,
                status: 'pending'
            }])
            .select()
            .single();

        if (error) {
            console.log('Error creating friend request:', error);
            return { success: false, msg: 'Failed to send friend request' };
        }

        // Create notification for the friend
        const { error: notificationError } = await supabase
            .from('notifications')
            .insert([{
                senderId: userId,
                receiverId: friendId,
                title: 'Friend Request',
                data: JSON.stringify({ 
                    type: 'friend_request',
                    friendRequestId: data.id 
                })
            }]);

        if (notificationError) {
            console.log('Error creating notification:', notificationError);
        }

        return { success: true, msg: 'Friend request sent successfully' };
    } catch (error) {
        console.log('Error sending friend request:', error);
        return { success: false, msg: 'Failed to send friend request' };
    }
};

export const acceptFriendRequest = async (friendRequestId) => {
    try {
        const { data, error } = await supabase
            .from('friends')
            .update({ status: 'accepted' })
            .eq('id', friendRequestId)
            .select()
            .single();

        if (error) {
            console.log('Error accepting friend request:', error);
            return { success: false, msg: 'Failed to accept friend request' };
        }

        return { success: true, msg: 'Friend request accepted' };
    } catch (error) {
        console.log('Error accepting friend request:', error);
        return { success: false, msg: 'Failed to accept friend request' };
    }
};

export const rejectFriendRequest = async (friendRequestId) => {
    try {
        const { error } = await supabase
            .from('friends')
            .delete()
            .eq('id', friendRequestId);

        if (error) {
            console.log('Error rejecting friend request:', error);
            return { success: false, msg: 'Failed to reject friend request' };
        }

        return { success: true, msg: 'Friend request rejected' };
    } catch (error) {
        console.log('Error rejecting friend request:', error);
        return { success: false, msg: 'Failed to reject friend request' };
    }
};

export const getFriends = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('friends')
            .select(`
                *,
                friend:users!friends_friend_id_fkey(id, name, email, image),
                user:users!friends_user_id_fkey(id, name, email, image)
            `)
            .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
            .eq('status', 'accepted')
            .order('created_at', { ascending: false });

        if (error) {
            console.log('Error fetching friends:', error);
            return { success: false, msg: 'Failed to fetch friends' };
        }

        // Format the friends data
        const friends = data.map(item => {
            const friend = item.user_id === userId ? item.friend : item.user;
            return {
                ...friend,
                friendshipId: item.id,
                friendshipCreated: item.created_at
            };
        });

        return { success: true, data: friends };
    } catch (error) {
        console.log('Error fetching friends:', error);
        return { success: false, msg: 'Failed to fetch friends' };
    }
};

export const getFriendRequests = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('friends')
            .select(`
                *,
                sender:users!friends_user_id_fkey(id, name, email, image)
            `)
            .eq('friend_id', userId)
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (error) {
            console.log('Error fetching friend requests:', error);
            return { success: false, msg: 'Failed to fetch friend requests' };
        }

        return { success: true, data };
    } catch (error) {
        console.log('Error fetching friend requests:', error);
        return { success: false, msg: 'Failed to fetch friend requests' };
    }
};

export const getUserById = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.log('Error fetching user:', error);
            return { success: false, msg: 'User not found' };
        }

        return { success: true, data };
    } catch (error) {
        console.log('Error fetching user:', error);
        return { success: false, msg: 'Failed to fetch user' };
    }
};