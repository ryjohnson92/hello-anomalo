import redis

class redis_base:
    def __init__(self):
        self.redis = redis.Redis(host='localhost', port=6379, decode_responses=True)
    def __exit__(self,a,b,c):
        self.redis.close()

class redis_example:
    class get(redis_base):
        def __init__(self,key):
            super().__init__()
            self.key = key
        
        def __enter__(self):
            return self.redis.get(self.key)

    class put(redis_base):
        def __init__(self,key,value):
            super().__init__()
            self.key = key
            self.value = value
        def __enter__(self):
            self.redis.set(self.key,self.value)
            return self.redis.get(self.key)