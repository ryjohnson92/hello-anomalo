import redis,os,uuid,dateparser,json
from ryansdemo.redis import redis_example
from metrics.prometheus import expose_metrics
from flask import Flask, render_template, session, send_file,request,Response,jsonify
from flask_session import Session
from multiprocessing import Process,Event
app = Flask(
    __name__,
    template_folder="./views", 
    static_url_path='/static', 
    static_folder='./static'
)
METRICS = expose_metrics(app)
app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_REDIS'] = redis.from_url('redis://127.0.0.1:6379')
app.config['SECRET_KEY'] = str('uuid4')  

@app.route("/",methods=['GET'])
@METRICS.request_latency('/',"get")
def index():
    if not 'id' in session:
        session['id'] = str(uuid.uuid4())
    return render_template('./index.html')

@app.route("/ryans/resume.pdf",methods=['GET'])
@METRICS.request_latency('/ryans/resume.pdf',"get")
def resume():
    return send_file('./static/Ryan Johnson Resume.pdf')

@app.route("/metrics/get",methods=['GET'])
@METRICS.request_latency('/metrics/get',"get")
def get_metrics():
    rets = {}
    try:
        with redis_example.get('/{}/{}'.format(session['id'],'card1')) as card1:
            rets['my_background_opened'] = card1
        with redis_example.get('/{}/{}'.format(session['id'],'card2')) as card2:
            rets['my_stack_opened'] = card2
        with redis_example.get('/{}/{}'.format(session['id'],'card2')) as card3:
            rets['last_page_opened'] = card3
        rets['time_spent_minutes'] = (dateparser.parse(rets['last_page_opened']) - dateparser.parse(rets['my_background_opened'])).total_seconds() / 60
    except Exception as err:
        print(err)
        rets['error'] = str(err)
    return jsonify(rets)

@app.route("/metrics/post",methods=['POST'])
@METRICS.request_latency('/metrics/post',"post")
def post_metrics():
    print(session['id'])
    
    content = json.loads(request.data.decode())
    print(dateparser.parse(content['completed']))
    with redis_example.put('/{}/{}'.format(
        session['id'],
        content['title']
    ),content['completed']): pass
    return Response(status=200)

if __name__ == "__main__":
    try:
        r = redis.Redis(host='localhost', port=6379, socket_connect_timeout=1)
        r.ping()
        r.close()
    except:
        os.system('redis-server --daemonize yes')
    finally:
        app.run('0.0.0.0',port=8080,debug=True) 