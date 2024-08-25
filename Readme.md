
# Hello Anomalo

Here is a breif demo for you and your team to see what I can demo



## Usage/Examples
Clone the repository
```bash
git clone https://github.com/ryjohnson92/hello-anomalo.git
```
Change directory
```bash
cd .\hello-anomalo\
```
Build the docker image (must have docker installed)
```bash
docker build -t anomalo:local .
```
Run the image
```bash
docker run -it -p 8080:8080 anomalo:local
```
