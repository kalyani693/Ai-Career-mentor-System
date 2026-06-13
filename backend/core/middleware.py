from fastapi import Request, HTTPException,status
from core.logging import get_logger
import time
import uuid
from typing import Callable
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp


class RequestLoggerMiddleware(BaseHTTPMiddleware):

    def __inti__(self, app:ASGIApp):
        super().__init__(app)
        self.logger=get_logger("middleware")

    async def logging(self,request:Request, call_next:Callable) :
        request_id=str(uuid.uuid4()) 
        Request.state.request_id=request_id

        start_time=time.time()
        Request.state.start_time=start_time

        #log request start
        self.logger.info(
            f"Request started: {request.method} {request.url.path}",
            extra={
                "request_id": request_id,
                "method": request.method,
                "path": request.url.path,
                "client_ip": request.client.host if request.client else None,
                "user_agent": request.headers.get("user-agent")
            }
        )

        try:
            # pass request for processing
            response=await call_next(request)

            duration=time.time()-start_time

            #log request completion
            self.logger.info(
               f"Request completed: {request.method} {request.url.path}",
               extra={
                "request_id":request_id,
                "method":request.method,
                "path":request.url.path,
                "status_code":response.status_code,
                "duration":duration
                }
             )
            
            #add request Id to response header
            response.headers["X-Request_ID"]=request_id

            return response

        except Exception as e:
            duration=time.time()-start_time

            # request failed
            self.logger.info(
               f"Request Failed:{request.method} {request.url.path}",
               extra={
                "request_id":request_id,
                "method":request.method,
                "path":request.url.path,
                "status_code":response.status_code,
                "duration":duration,
                "error":str(e)
                 }
             )
            exc_info=True

        raise    







         
