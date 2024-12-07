import bcrypt


def hash_password(password: str):
    return bcrypt.hashpw(password.encode(), salt=bcrypt.gensalt())


def verify_password(password: str, hashed_password: str):
    return bcrypt.checkpw(password.encode(), hashed_password)


def verify_ku_email(email: str) -> bool:
    return "kettering.edu" in email.split("@")[-1]
