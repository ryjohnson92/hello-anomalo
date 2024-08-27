import time
from functools import wraps
from prometheus_client import make_wsgi_app, Counter, Histogram
from werkzeug.middleware.dispatcher import DispatcherMiddleware


class expose_metrics:
    def __init__(self,app,metrics_endpoint:str='/metrics'):
        app.wsgi_app = DispatcherMiddleware(app.wsgi_app, {
            metrics_endpoint: make_wsgi_app()
        })
        self.REQUEST_COUNTER = self.counter_requests()
        self.REQUEST_LATENCY = self.histogram_latency()

    def request_count(self,route:str,method:str):
        """ Post request count to metrics"""
        route = str(route).lower()
        method = str(method).upper()
        def do_count(f):
            print('HI there')
            @wraps(f)
            def decorate(*args,**kwargs):
                resp = f(*args, **kwargs)
                self.REQUEST_COUNTER.labels(method,route, resp.status_code if hasattr(resp,'status_code') else 200).inc()
                return resp
            return decorate
        return do_count

    def request_latency(self,route:str,method:str,track_count:bool=True):
        """ Post latency count to metrics"""
        route = str(route).lower()
        method = str(method).upper()
        request_start = time.time()
        def do_count(f,*args,**kwargs):
            @wraps(f)
            def decorate(*args,**kwargs):
                resp = f(*args, **kwargs)
                request_complete = time.time()
                self.REQUEST_LATENCY.labels(method,route).observe(request_complete-request_start)
                if track_count:
                    self.REQUEST_COUNTER.labels(method,route, resp.status_code if hasattr(resp,'status_code') else 200).inc()
                return resp
            return decorate
        return do_count

    def counter_requests(self):
        return Counter(
            'app_request_count',
            'Application Request Count',
            ['method', 'endpoint', 'http_status']
        )

    def histogram_latency(self):
        return Histogram(
            'app_request_latency_seconds',
            'Application Request Latency',
            ['method', 'endpoint']
        )