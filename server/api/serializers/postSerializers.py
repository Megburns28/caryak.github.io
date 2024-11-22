from api.serializers.userSerializers import embeddedUserResponse


def postEntity(post) -> dict:
    return {
        "id": str(post["_id"]),
        "title": post["title"],
        "car_make": post["car_make"],
        "car_model": post["car_model"],
        "car_year": post["car_year"],
        "description": post["description"],
        "image": post["image"],
        "user": str(post["user"]),
        "created_at": post["created_at"],
        "updated_at": post["updated_at"]
    }


def populatedPostEntity(post) -> dict:
    return {
        "id": str(post["_id"]),
        "title": post["title"],
        "car_make": post["car_make"],
        "car_model": post["car_model"],
        "car_year": post["car_year"],
        "description": post["description"],
        "image": post["image"],
        "user": embeddedUserResponse(post["user"]),
        "created_at": post["created_at"],
        "updated_at": post["updated_at"]
    }


def postListEntity(posts) -> list:
    return [populatedPostEntity(post) for post in posts]
