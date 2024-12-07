from datetime import datetime
from fastapi import Depends, HTTPException, status, APIRouter, Response, UploadFile, File
from pymongo.collection import ReturnDocument
from api import schemas
from api.database import Post, Votes
from api.oauth2 import require_user
from api.serializers.postSerializers import postEntity, postListEntity
from api.utils.s3 import upload_image_to_s3
from bson.objectid import ObjectId
from pymongo.errors import DuplicateKeyError

router = APIRouter()

@router.post('/')
def like_post(post_id: str, user_id: str = Depends(require_user)):
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Invalid post ID")
    
    # Fetch the vote document
    vote_entry = Votes.find_one({'_id': ObjectId(post_id)})
    if not vote_entry:
        # Initialize the votes document if it doesn't exist
        Votes.insert_one({
            '_id': ObjectId(post_id),
            'votes': 0,
            'users': {}
        })
        vote_entry = Votes.find_one({'_id': ObjectId(post_id)})

    # Update likes
    user_obj_id = ObjectId(user_id)
    users_likes = vote_entry.get('users', {})
    current_vote = users_likes.get(str(user_obj_id), 0)

    if current_vote == 1:
        # User already liked, remove the like
        update = {
            '$inc': {'votes': -1},
            '$unset': {f'users.{user_obj_id}': ""}
        }
    else:
        # Add like or overwrite dislike
        vote_change = 1 if current_vote == 0 else 2  # From 0 -> +1 or -1 -> +1
        update = {
            '$inc': {'votes': vote_change},
            '$set': {f'users.{user_obj_id}': 1}
        }

    Votes.update_one({'_id': ObjectId(post_id)}, update)
    return {"status": "success", "message": "Post liked successfully"}

@router.post('/')
def dislike_post(post_id: str, user_id: str = Depends(require_user)):
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Invalid post ID")
    
    # Fetch the vote document
    vote_entry = Votes.find_one({'_id': ObjectId(post_id)})
    if not vote_entry:
        # Initialize the votes document if it doesn't exist
        Votes.insert_one({
            '_id': ObjectId(post_id),
            'votes': 0,
            'users': {}
        })
        vote_entry = Votes.find_one({'_id': ObjectId(post_id)})

    # Update dislikes
    user_obj_id = ObjectId(user_id)
    users_likes = vote_entry.get('users', {})
    current_vote = users_likes.get(str(user_obj_id), 0)

    if current_vote == -1:
        # User already disliked, remove the dislike
        update = {
            '$inc': {'votes': 1},
            '$unset': {f'users.{user_obj_id}': ""}
        }
    else:
        # Add dislike or overwrite like
        vote_change = -1 if current_vote == 0 else -2  # From 0 -> -1 or +1 -> -1
        update = {
            '$inc': {'votes': vote_change},
            '$set': {f'users.{user_obj_id}': -1}
        }

    Votes.update_one({'_id': ObjectId(post_id)}, update)
    return {"status": "success", "message": "Post disliked successfully"}


@router.get('/')
def get_votes(post_id: str):
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Invalid post ID")
    
    vote_entry = Votes.find_one({'_id': ObjectId(post_id)})
    if not vote_entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Votes not found for this post")
    
    return {
        "status": "success",
        "votes": vote_entry.get('votes', 0),
        "users": vote_entry.get('users', {})
    }

@router.get('/')
def get_posts_with_votes(limit: int = 10, page: int = 1, search: str = '', user_id: str = Depends(require_user)):
    skip = (page - 1) * limit
    pipeline = [
        {'$match': {}},  # Add search filter if needed, e.g., {'title': {'$regex': search, '$options': 'i'}}
        {'$lookup': {
            'from': 'users',
            'localField': 'user',
            'foreignField': '_id',
            'as': 'user'
        }},
        {'$unwind': '$user'},
        {'$lookup': {  # Join with the votes collection
            'from': 'votes',
            'localField': '_id',
            'foreignField': '_id',  # Use post ID to match with votes collection
            'as': 'votes'
        }},
        {'$unwind': {'path': '$votes', 'preserveNullAndEmptyArrays': True}},  # Include posts with no votes
        {'$skip': skip},
        {'$limit': limit}
    ]
    posts = postListEntity(Post.aggregate(pipeline))
    return {'status': 'success', 'results': len(posts), 'posts': posts}



@router.get('/')
def get_posts(limit: int = 10, page: int = 1, search: str = '', user_id: str = Depends(require_user)):
    skip = (page - 1) * limit
    pipeline = [
        {'$match': {}},
        {'$lookup': {'from': 'users', 'localField': 'user',
                     'foreignField': '_id', 'as': 'user'}},
        {'$unwind': '$user'},
        {
            '$skip': skip
        }, {
            '$limit': limit
        }
    ]
    posts = postListEntity(Post.aggregate(pipeline))
    return {'status': 'success', 'results': len(posts), 'posts': posts}



@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    # Validate that the file is an image
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed.")
    
    # Upload to S3
    image_url = upload_image_to_s3(file)

    return {"image_url": image_url}

@router.post('/post-with-image', status_code=status.HTTP_201_CREATED)
async def create_post_with_image(
    post: schemas.CreatePostSchema, 
    file: UploadFile = File(...), 
    user_id: str = Depends(require_user)
):
    # Validate the uploaded file
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed.")
    
    # Upload the image to S3
    try:
        image_url = upload_image_to_s3(file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {e}")

    # Add the image URL and user info to the post data
    post.image = image_url
    post.user = ObjectId(user_id)
    post.created_at = datetime.utcnow()
    post.updated_at = post.created_at

    # Insert post into MongoDB
    try:
        result = Post.insert_one(post.dict())
        pipeline = [
            {'$match': {'_id': result.inserted_id}},
            {'$lookup': {'from': 'users', 'localField': 'user',
                         'foreignField': '_id', 'as': 'user'}},
            {'$unwind': '$user'},
        ]
        new_post = postListEntity(Post.aggregate(pipeline))[0]
        return new_post
    except DuplicateKeyError:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail=f"Post with title: '{post.title}' already exists")


@router.post('/', status_code=status.HTTP_201_CREATED)
def create_post(post: schemas.CreatePostSchema, user_id: str = Depends(require_user)):
    post.user = ObjectId(user_id)
    post.created_at = datetime.utcnow()
    post.updated_at = post.created_at
    try:
        result = Post.insert_one(post.dict())
        pipeline = [
            {'$match': {'_id': result.inserted_id}},
            {'$lookup': {'from': 'users', 'localField': 'user',
                         'foreignField': '_id', 'as': 'user'}},
            {'$unwind': '$user'},
        ]
        new_post = postListEntity(Post.aggregate(pipeline))[0]
        return new_post
    except DuplicateKeyError:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail=f"Post with title: '{post.title}' already exists")


@router.put('/{id}')
def update_post(id: str, payload: schemas.UpdatePostSchema, user_id: str = Depends(require_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Invalid id: {id}")
    updated_post = Post.find_one_and_update(
        {'_id': ObjectId(id)}, {'$set': payload.dict(exclude_none=True)}, return_document=ReturnDocument.AFTER)
    if not updated_post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'No post with this id: {id} found')
    return postEntity(updated_post)


@router.get('/')
def get_post_with_votes(id: str, user_id: str = Depends(require_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Invalid id: {id}")
    
    pipeline = [
        {'$match': {'_id': ObjectId(id)}},
        {'$lookup': {
            'from': 'users',
            'localField': 'user',
            'foreignField': '_id',
            'as': 'user'
        }},
        {'$unwind': '$user'},
        {'$lookup': {  # Include votes
            'from': 'votes',
            'localField': '_id',
            'foreignField': '_id',  # Match post ID with votes document ID
            'as': 'votes'
        }},
        {'$unwind': {'path': '$votes', 'preserveNullAndEmptyArrays': True}}  # Allow posts with no votes
    ]
    db_cursor = Post.aggregate(pipeline)
    results = list(db_cursor)

    if len(results) == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"No post with this id: {id} found")

    post = postListEntity(results)[0]
    return post


@router.get('/{id}')
def get_post(id: str, user_id: str = Depends(require_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Invalid id: {id}")
    pipeline = [
        {'$match': {'_id': ObjectId(id)}},
        {'$lookup': {'from': 'users', 'localField': 'user',
                     'foreignField': '_id', 'as': 'user'}},
        {'$unwind': '$user'},
    ]
    db_cursor = Post.aggregate(pipeline)
    results = list(db_cursor)

    if len(results) == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"No post with this id: {id} found")

    post = postListEntity(results)[0]
    return post


@router.delete('/{id}')
def delete_post(id: str, user_id: str = Depends(require_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Invalid id: {id}")
    post = Post.find_one_and_delete({'_id': ObjectId(id)})
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'No post with this id: {id} found')
    return Response(status_code=status.HTTP_204_NO_CONTENT)
