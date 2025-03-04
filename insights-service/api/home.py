from fastapi import APIRouter

router = APIRouter()


@router.get("/", tags=["Home"])
async def home():
    """
    Root endpoint for the insights service API.
    Returns basic information about the API.
    """
    return {
        "service": "Insights Service",
        "message": "Financial Analytics API is running! 🚀",
        "status": "online",
        "version": "1.0.0",
    }
