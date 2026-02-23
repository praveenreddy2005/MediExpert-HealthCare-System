import cloudinary
import cloudinary.uploader
import cloudinary.api

# Configure Cloudinary
cloudinary.config(
    cloud_name="dqjceodyu",  # Your Cloudinary cloud name
    api_key="623851521368428",
    api_secret="oVqw3ZJkIt4VBd55KAD-6bSOpPw",
    secure=True
)

def upload_to_cloudinary(file_path, folder="healthcare", resource_type="image"):
    """
    Upload a file to Cloudinary
    
    Args:
        file_path: Path to the file to upload
        folder: Cloudinary folder name
        resource_type: Type of resource (image, raw, video, auto)
    
    Returns:
        dict: Upload result with secure_url, public_id, etc.
    """
    try:
        result = cloudinary.uploader.upload(
            file_path,
            folder=folder,
            resource_type=resource_type,
            overwrite=True,
            invalidate=True
        )
        return {
            "success": True,
            "url": result.get("secure_url"),
            "public_id": result.get("public_id"),
            "format": result.get("format"),
            "resource_type": result.get("resource_type")
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def delete_from_cloudinary(public_id, resource_type="image"):
    """
    Delete a file from Cloudinary
    
    Args:
        public_id: Public ID of the file to delete
        resource_type: Type of resource (image, raw, video)
    
    Returns:
        dict: Deletion result
    """
    try:
        result = cloudinary.uploader.destroy(public_id, resource_type=resource_type)
        return {
            "success": True,
            "result": result
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
