import logging
import sys
from typing import Dict, Any
from core.config import settings


def setup_logging():
    """Setup application logging"""
    
    # Configure root logger
    logging.basicConfig(
        level=getattr(logging, settings.LOG_LEVEL.upper()),
        format=settings.LOG_FORMAT,
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler("app.log")
        ]
    )
    
    # Set specific logger levels
    loggers = {
        "uvicorn": logging.INFO,
        "uvicorn.error": logging.INFO,
        "uvicorn.access": logging.WARNING,
        "fastapi": logging.INFO,
    }
    
    for logger_name, level in loggers.items():
        logging.getLogger(logger_name).setLevel(level)
    
    # Create custom logger for the application
    logger = logging.getLogger("careermentor")
    logger.setLevel(logging.INFO)
    
    return logger


def get_logger(name: str) -> logging.Logger:
    """Get a logger instance"""
    return logging.getLogger(f"careermentor.{name}")


class RequestLogger:
    """Request logging utility"""
    
    def __init__(self, logger: logging.Logger):
        self.logger = logger
    
    def log_request(self, method: str, path: str, status_code: int, duration: float, user_id: str = None):
        """Log HTTP request details"""
        extra = {
            "method": method,
            "path": path,
            "status_code": status_code,
            "duration": duration,
            "user_id": user_id
        }
        
        if status_code >= 400:
            self.logger.warning(f"Request failed: {method} {path} - {status_code}", extra=extra)
        else:
            self.logger.info(f"Request completed: {method} {path} - {status_code}", extra=extra)
    
    def log_error(self, error: Exception, context: Dict[str, Any] = None):
        """Log application errors"""
        extra = context or {}
        self.logger.error(f"Application error: {str(error)}", extra=extra, exc_info=True) 