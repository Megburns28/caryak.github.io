/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export interface CreatePostSchema {
  title: string;
  content: string;
  category: string;
  image: string;
  created_at?: Date | null;
  updated_at?: Date | null;
  user?: string | null;
}
export interface CreateUserSchema {
  name: string;
  email: string;
  created_at?: Date | null;
  updated_at?: Date | null;
  password: string;
  passwordConfirm: string;
  verified?: boolean;
}
export interface FilteredUserResponse {
  name: string;
  email: string;
  created_at?: Date | null;
  updated_at?: Date | null;
  id: string;
}
export interface ListPostResponse {
  status: string;
  results: number;
  posts: PostResponse[];
}
export interface PostResponse {
  title: string;
  content: string;
  category: string;
  image: string;
  created_at: Date;
  updated_at: Date;
  id: string;
  user: FilteredUserResponse;
}
export interface LoginUserSchema {
  email: string;
  password: string;
}
export interface PostBaseSchema {
  title: string;
  content: string;
  category: string;
  image: string;
  created_at?: Date | null;
  updated_at?: Date | null;
}
export interface UpdatePostSchema {
  title?: string | null;
  content?: string | null;
  category?: string | null;
  image?: string | null;
  user?: string | null;
}
export interface UserBaseSchema {
  name: string;
  email: string;
  created_at?: Date | null;
  updated_at?: Date | null;
}
export interface UserResponse {
  status: string;
  user: UserResponseSchema;
}
export interface UserResponseSchema {
  name: string;
  email: string;
  created_at?: Date | null;
  updated_at?: Date | null;
  id: string;
}
