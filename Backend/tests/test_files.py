import io
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from fastapi.testclient import TestClient  # noqa: E402

from app import app  # noqa: E402
from file_ids import is_safe_file_id  # noqa: E402

client = TestClient(app)
PNG = b"\x89PNG\r\n\x1a\n" + b"\x00" * 32


def test_is_safe_file_id():
    good = "0f8fad5b-d9cb-469f-a165-70867728950e.png"
    assert is_safe_file_id(good)
    assert is_safe_file_id("0f8fad5b-d9cb-469f-a165-70867728950e")
    assert is_safe_file_id(None)
    for bad in ["..", "../app.py", "a/b.png", "x.png", good + "/..", "..\app.py"]:
        assert not is_safe_file_id(bad), bad


def test_list_and_delete_all_routes_are_gone():
    assert client.get("/api/files").status_code in (404, 405)
    assert client.delete("/api/files").status_code in (404, 405)


def test_upload_get_delete_roundtrip_and_invalid_ids():
    r = client.post("/api/upload", files={"file": ("cover.png", io.BytesIO(PNG), "image/png")})
    assert r.status_code == 200, r.text
    file_id = r.json()["file_id"]
    assert client.get(f"/api/files/{file_id}").content == PNG
    assert client.get("/api/files/app.py").status_code == 400
    assert client.delete("/api/files/app.py").status_code == 400
    assert client.delete(f"/api/files/{file_id}").status_code == 200
    assert client.get(f"/api/files/{file_id}").status_code == 404
