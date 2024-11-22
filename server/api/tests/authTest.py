from fastapi.testclient import TestClient

from api.main import app


client = TestClient(app)

def test_read_main(user):
    response = client.post("/api/auth/register", json=user)
    print(response.content)

user = {
    "name": "John Doe",
    "email": "email@kettering.edu",
    "password": "password123",
    "passwordConfirm": "password123"
}

test_read_main(user)