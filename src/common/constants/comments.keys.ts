/*
    KEY USED TO STORE COMMENT LIKES IN REDIS
*/
export const COMMENT_LIKES_KEY = (
  comment_id: string,
) => `comment:likes:${comment_id}`;

/*
    KEY USED TO STORE COMMENT DISLIKES IN REDIS
*/
export const COMMENT_DISLIKES_KEY = (
  comment_id: string,
) => `comment:dislikes:${comment_id}`;

