import { types } from '../../enums/react.to.types';

/*
    KEY USED TO STORE BLOGS VIEWS IN REDIS  
*/
export const BLOG_VIEWS_KEY = (
    blog_id: string,
) => `blog:views:${blog_id}`;

/*
    KEY USED TO STORE LIKES IN REDIS 
*/
export const LIKES_KEY = (
    prefix: types,
    id: string,
) => `${prefix}:likes:${id}`;

/*
    KEY USED TO STORE DISLIKES IN REDIS 
*/
export const DISLIKES_KEY = (
    prefix: types,
    id: string,
) => `${prefix}:dislikes:${id}`;

