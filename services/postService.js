export const createOrUpdatePost = async (post) => {
    try {
        //upload image
        if(post.file && typeof post.file == 'object')
        {
            let isImage = post?.file?.type == 'image';
            let folderName = isImage? 'postImages' : 'postVideos';
        }
    }
    catch(error) {
        console.log('CreatePost Error:', error);
        return {success: false, msg: "Can't create you a post"};
    }
    
}