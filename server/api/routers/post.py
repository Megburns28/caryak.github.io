from datetime import datetime
from fastapi import Depends, HTTPException, status, APIRouter, Response, UploadFile, File
from pymongo.collection import ReturnDocument
from api import schemas
from api.database import Post, Vote
from api.oauth2 import require_user
from api.serializers.postSerializers import postEntity, postListEntity, voteEntity
from api.utils.s3 import upload_image_to_s3
from bson.objectid import ObjectId
from pymongo.errors import DuplicateKeyError

router = APIRouter()


# Lookup posts that are from a given user
@router.get('/')
def get_posts(limit: int = 10, page: int = 1, search: str = '', user_id: str = Depends(require_user)):
    skip = (page - 1) * limit
    pipeline = [
        {'$match': {}},
        {'$lookup': {
            'from': 'users',
            'localField': 'user',
            'foreignField': '_id',
            'as': 'user'
            }
        },
        {'$unwind': '$user'},
        {'$skip': skip},
        {'$limit': limit}
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

    # Try to insert the post and retrieve it
    try:
        result = Post.insert_one(post.dict())
        pipeline = [
            {'$match': {'_id': result.inserted_id}},
            {'$lookup': {
                'from': 'users',
                'localField': 'user',
                'foreignField': '_id',
                'as': 'user'
                }
            },
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


# Get a post by a specific post object id
@router.get('/{id}')
def get_post(id: str, user_id: str = Depends(require_user)):
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
            }
        },
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


@router.get('/{id}/{votes}')
@router.put('/{id}')
def update_votes(id: str, votes: int = 0): # votes is the payload
    db_cursor = Vote.find_one(filter={'_id': ObjectId(id)})

    vote = schemas.VoteSchema
    vote.id = ObjectId(id)

    if db_cursor == None:
        vote.votes = votes
    else:
        vote.votes = db_cursor.get('votes') + votes

    try:
        update_result = Vote.find_one_and_update(filter={'_id': vote.id},
                                 update={ "$set": { '_id': vote.id, 'votes': vote.votes } },
                                 upsert=True,
                                 return_document=ReturnDocument.AFTER)
        return voteEntity(update_result)
    except DuplicateKeyError:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail=f"Post Votes with id: '{vote.id}' already exists")