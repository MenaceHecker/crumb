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
export const fetchPosts = async (limit=10) => {
    try {
        const {data,error} = await supabase
        .from('posts')
        .select('*, users (id, name, image)')
        .order('created_at', {ascending: false})
        .limit(limit);

        if(error){
            console.log('FetchPost Error:', error);
            return {success: false, msg: "Can't fetch your posts"};
        }
        
        return {success: true, data: data};
    }
    catch(error) {
        console.log('FetchPost Error:', error);
        return {success: false, msg: "Can't fetch your posts"};
    }
}