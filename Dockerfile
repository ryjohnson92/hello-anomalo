FROM ubuntu:latest

RUN apt-get update && apt-get upgrade -y && apt install software-properties-common -y
RUN add-apt-repository ppa:deadsnakes/ppa -y
RUN apt-get install python3.11 python3-pip redis -y

COPY python_requirements.txt /tmp/python_requirements.txt
RUN python3.11 -m pip install -r /tmp/python_requirements.txt
COPY ./modules/RyansDemo/*  /usr/local/lib/python3.11/dist-packages/ryansdemo/
COPY ./modules/metrics/*  /usr/local/lib/python3.11/dist-packages/metrics/
RUN ln -s /usr/bin/python3.11 /usr/local/bin/python
RUN mkdir /opt/anomalo_demo
WORKDIR /opt/anomalo_demo
COPY . .

ENTRYPOINT ["/usr/bin/python3.11"]
CMD ["/opt/anomalo_demo/index.py"]