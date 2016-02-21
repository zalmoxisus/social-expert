import { Schema } from 'normalizr';

export const post = new Schema('posts');
export const target = new Schema('targets');
post.define({ repository: target });
