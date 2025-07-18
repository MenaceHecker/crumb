import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageService";

export const createOrUpdatePost = async (post) => {
    try {
        //upload image
        if(post.file && typeof post.file == 'object')
        {
            let isImage = post?.file?.type == 'image';
            let folderName = isImage? 'postImages' : 'postVideos';
            let fileResult = await uploadFile(folderName, post?.file?.uri, isImage);
            if(fileResult.success) {
                post.file = fileResult.data;
            } else {
                return fileResult; 
            }
        }
        
        const {data, error} = await supabase
        .from('posts')
        .upsert(post)
        .select()
        .single();

        if(error){
            console.log('Supabase error:', error);
            return {success: false, msg: error.message || "Can't create your post"};
        }
        
        return {success: true, data: data};
    }
    catch(error) {
        console.log('CreatePost Error:', error);
        return {success: false, msg: "Can't create your post"};
    }
}
export const fetchPosts = async (limit=10, userId) => {
    try {
        if(userId){
            const {data,error} = await supabase
        .from('posts')
        .select('*, users (id, name, image), postLikes(*), comments(count) ')
        .order('created_at', {ascending: false})
        .eq('userId', userId)
        .limit(limit);

        if(error){
            console.log('FetchPost Error:', error);
            return {success: false, msg: "Can't fetch your posts"};
        }
        
        return {success: true, data: data};
        }else{
            const {data,error} = await supabase
        .from('posts')
        .select('*, users (id, name, image), postLikes(*), comments(count) ')
        .order('created_at', {ascending: false})
        .limit(limit);

        if(error){
            console.log('FetchPost Error:', error);
            return {success: false, msg: "Can't fetch your posts"};
        }
        
        return {success: true, data: data};
        }
    }
    catch(error) {
        console.log('FetchPost Error:', error);
        return {success: false, msg: "Can't fetch your posts"};
    }
}
export const fetchPostDetails = async (postId) => {
    try {
        const {data,error} = await supabase
        .from('posts')
        .select('*, users (id, name, image), postLikes(*), comments(*, users(id, name, image)) ')
        .eq('id', postId)
        .order("created_at", {ascending: false, foreignTable: 'comments'})
        .single();

        if(error){
            console.log('FetchPostDetails Error:', error);
            return {success: false, msg: "Can't fetch the post"};
        }
        
        return {success: true, data: data};
    }
    catch(error) {
        console.log('FetchPostDetails Error:', error);
        return {success: false, msg: "Can't fetch the post"};
    }
}
export const createPostLike = async (postLike) => {
    try {
        const {data,error} = await supabase 
        .from('postLikes')
        .insert(postLike)
        .select()
        .single();

        if(error){
            console.log('postLike Error:', error);
            return {success: false, msg: "Could not like the post"};
        }
        
        return {success: true, data: data};
    }
    catch(error) {
        console.log('FetchPost Error:', error);
        return {success: false, msg: "Could not like the post"};
    }
}
export const removePostLike = async (postId, userId) => {
    try {
        const {error} = await supabase 
        .from('postLikes')
        .delete()
        .eq('userId', userId)
        .eq('postId', postId)

        if(error){
            console.log('postLike Error:', error);
            return {success: false, msg: "Could not remove the post like"};
        }
        
        return {success: true, data: data};
    }
    catch(error) {
        console.log('FetchPost Error:', error);
        return {success: false, msg: "Could not remove the post like"};
    }
}

export const createComment = async (comment) => {
    try {
        const {data,error} = await supabase 
        .from('comments')
        .insert(comment)
        .select()
        .single();

        if(error){
            console.log('Comment Error:', error);
            return {success: false, msg: "Could not comment on the post"};
        }
        
        return {success: true, data: data};
    }
    catch(error) {
        console.log('Comment Error:', error);
        return {success: false, msg: "Could not comment on the post"};
    }
}

export const removeCommment = async (commentId) => {
    try {
        const {error} = await supabase 
        .from('comments')
        .delete()
        .eq('id', commentId)

        if(error){
            console.log('RemoveComment Error:', error);
            return {success: false, msg: "Could not remove the comment"};
        }
        
        return {success: true, data: {commentId}};
    }
    catch(error) {
        console.log('RemoveComment Error:', error);
        return {success: false, msg: "Could not remove the comment"};
    }
}
export const removePost = async (postId) => {
    try {
        const {error} = await supabase 
        .from('posts')
        .delete()
        .eq('id', postId)

        if(error){
            console.log('RemovePost Error:', error);
            return {success: false, msg: "Could not remove the post"};
        }
        
        return {success: true, data: {postId}};
    }
    catch(error) {
        console.log('RemovePost Error:', error);
        return {success: false, msg: "Could not remove the post"};
    }
}