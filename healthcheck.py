import sys,os,socket

def wait_for_port():
    sys_ports = [
        8080,
        6379
    ]
    try:
        for open_port in sys_ports:
            sock = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
            result = sock.connect_ex(('127.0.0.1',open_port))
            assert result ==0, 'Port is not open'
        return 0 
    except AssertionError as err1:
        print(err1)
        ## TODO: something more useful
        return 1
    except Exception as err2:
        print(err2)
        ## TODO: something even more useful
        return 1

sys.exit(wait_for_port())