from fastapi import FastAPI
from api.analytics import router as analytics_router
from api.dashboard import router as dashboard_router
from api.predictions import router as predictions_router

app = FastAPI(
    title="Financial Analytics API",
    root_path="/api/v1/insights",
    version="1.0.0",
    docs_url="/docs",
)

# Include routers with appropriate prefixes and tags
app.include_router(analytics_router, prefix="/analytics", tags=["Analytics"])
app.include_router(dashboard_router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(predictions_router, prefix="/magic", tags=["Predictions"])

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
