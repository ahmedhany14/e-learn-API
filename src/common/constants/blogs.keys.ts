/*
    KEY USED TO STORE BLOGS VIEWS IN REDIS  
*/
export const BLOG_VIEWS_KEY = (
    blog_id: string,
) => `blog:views:${blog_id}`;

/*
    KEY USED TO STORE BLOGS UPVOTES IN REDIS  
*/
export const BLOG_UPVOTES_KEY = (
    blog_id: string,
) => `blog:upvotes:${blog_id}`;

/*
    KEY USED TO STORE BLOGS DOWNVOTES IN REDIS  
*/
export const BLOG_DOWNVOTES_KEY = (
    blog_id: string,
) => `blog:downvotes:${blog_id}`;

