from datetime import datetime
from typing import List

from bson.objectid import ObjectId
from pydantic import BaseModel, EmailStr, HttpUrl, constr


# User
class UserBaseSchema(BaseModel):
    name: str
    email: str
    created_at: datetime | None = None
    updated_at: datetime | None = None

    class Config:
        orm_mode = True


class CreateUserSchema(UserBaseSchema):
    password: constr(min_length=8)
    passwordConfirm: str
    verified: bool = False


class LoginUserSchema(BaseModel):
    email: EmailStr
    password: constr(min_length=8)


class UserResponseSchema(UserBaseSchema):
    id: str
    pass


class UserResponse(BaseModel):
    status: str
    user: UserResponseSchema


class FilteredUserResponse(UserBaseSchema):
    id: str


# Post
class PostBaseSchema(BaseModel):
    title: str
    car_make: str
    car_model: str
    car_year: int
    description: str
    image: str
    created_at: datetime | None = None
    updated_at: datetime | None = None

    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class VoteBaseSchema(BaseModel):
    votes: int

    class Config:
        orm_mode = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class CreatePostSchema(PostBaseSchema):
    user: ObjectId | None = None
    title: str
    content: str
    category: str
    image: str | None = None  # Make `image` optional
    pass

class VoteSchema(VoteBaseSchema):
    id: ObjectId | None = None
    votes: int
    pass

class PostResponse(PostBaseSchema):
    id: str
    user: FilteredUserResponse
    created_at: datetime
    updated_at: datetime


class UpdatePostSchema(BaseModel):
    title: str | None = None
    car_make: str | None = None
    car_model: str | None = None
    car_year: int | None = None
    description: str | None = None
    image: HttpUrl | None = None
    user: str | None = None

    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class ListPostResponse(BaseModel):
    status: str
    results: int
    posts: List[PostResponse]
