from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from cloudinary_config import upload_to_cloudinary
import tempfile
import os

router = APIRouter()

@router.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    uid: str = Form(...)
):
    # optional: allow only images
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed")

    tmp_path = None
    try:
        # save to temp
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        # upload to cloudinary (use your existing function)
        result = upload_to_cloudinary(
            tmp_path,
            folder=f"patient_files/{uid}",
            resource_type="image"
        )

        if not result.get("success"):
            raise HTTPException(status_code=500, detail=result.get("error", "Cloudinary upload failed"))

        return {
            "success": True,
            "url": result["url"],
            "public_id": result["public_id"],
        }

    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)