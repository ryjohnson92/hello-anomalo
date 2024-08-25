import page_base from "./page_base.js"
// /ryans/resume.pdf
class index extends page_base{
    hello_header = class{
        constructor(){
            this.container = document.getElementsByClassName('anmlo_hello')[0];
        }
        close(){
            this.container.style.height = 0;
            setTimeout(()=>{
                this.container.style.display = 'none'
            },1000)
        }
    }
    index_card = class extends page_base.card{
        constructor(parent,hello_hdr){
            super(parent);
            this.hello_hdr = hello_hdr
        }
        next(){
            this.hello_hdr.close();
            this.card.parentElement.style.height = '90vh';
            this.card.parentElement.style.maxHeight = '90vh';
            this.close();
            page.cards[1].open();
        }
    }
    card1 = class extends page_base.card{
        constructor(parent){
            super(parent);
            this.flippable = Array.from(document.getElementsByClassName('anmlo_card_sectionb_svg_wrap')[0].children);
            for(let item of this.flippable){ item.style.width = '0'; }
            this.current_item = this.flippable[0]
            this.current_item.style.width = 'auto';
            setInterval(()=>{this.flip()},5000)
        }
        flip(){
            this.current_item.style.width = '0'
            let nextIndex = this.flippable.indexOf(this.current_item)+1
            nextIndex = (nextIndex>(this.flippable.length-1))?0:nextIndex;
            this.current_item = this.flippable[nextIndex]
            this.current_item.style.width = 'auto';
        }
        next(){
            this.close();
            page.cards[2].open();
        }
    }
    card2 = class extends page_base.card{
        stack_item = class{
            relates ={
                'android':{
                    'relates_to':['docker','python','flask','android','linux'],
                    "text":'Using my experience as a full stack developer, coupled with my skills with stand alone kiosks, I worked with on-site technicians and support staff to troubleshoot issues with devices all over the globe. In order to assist with remote troubleshooting, I created an MDM platform, using Flask, which managed remote vnc, adb and shell connections to the devices to aid in log retrieval and issue replication. '
                },
                'ansible':{
                    'relates_to':['aws','pagerduty','linux'],
                    "text":'Control made easy! With Ansible, I have been able to quickly manage distributed systems both in house or within the AWS ecosystem to manage applications, servers and custom alerting via PagerDuty API.'
                },
                'aws':{
                    'relates_to':['aws','python','pagerduty','linux'],
                    "text":'Modern code requires modern deployment solutions. With my experience in AWS I have worked in managing auto scaling groups, EC2 instances and custom code deployments.'
                },
                'docker':{
                    'relates_to':['docker','python','mssql','android','prometheus','mysql','flask'],
                    "text":"I &#128151; Docker, with it I have built custom base images, scalable web applications, websocket api's and custom data integrations portals."
                },
                'flask':{
                    'relates_to':['docker','python','android','linux','mysql','mssql'],
                    "text":'Flask is my go to for no nonsense web api\'s and applications. With it’s easy to use templating, simple setup and python base, it has quickly become my favorite web framework.'
                },
                'mssql':{
                    'relates_to':['docker','python','flask'],
                    "text":'Hard problems require smart solutions, with Microsoft SQL Server I have built store management and cash register integrations databases as well as streamlined intelligence gathering by leverage in memory datasets.'
                },
                'mysql':{
                    'relates_to':['docker','python','android','linux',"ansible",'pagerduty'],
                    "text":'Mysql and MariaDB are quickly taking the place of TSQL as my favorite DBMS when I need a quick and easy solution. Whether that means a high availability NDB cluster or a simple containerized application database, I find myself at home.'
                },
                'pagerduty':{
                    'relates_to':['docker','python','android','linux','ansible'],
                    "text":'No one likes the 3 am page, with Pagerduty API I have been able to leverage existing alerting systems to provide solutions which can respond to and resolve common application issues.'
                },
                'linux':{
                    'relates_to':['docker','linux'],
                    "text":'Since I first started with web development Ubuntu and linux have been an absolute must have for any server or container image.'
                },
                'prometheus':{
                    'relates_to':['docker','python','prometheus'],
                    "text":'Finding that needle in the haystack can be a daunting task. With proper metrics and solid dashboards I have used custom Python based Prometheus exporters to identify missing data within a dataset and track user interactions in application web applications.'
                },
                'python':{
                    'relates_to':['docker','python','android','linux'],
                    "text":'Kudos to the Python team for creating my favorite programming language. Working with simple Raspberry PI projects up to full blown web applications and even tinkering with AI object detection and identification, Python does it all!'
                }

            }
            constructor(item,p){
                this.parent=p;
                this.item = item;
                this.item.onmouseover = ()=>{
                    this.mouseover();
                    this.hover();
                    this.parent.stack_text.set(this.text);
                }
                this.item.onmouseout = ()=>{
                    for(let item of this.parent.items){
                        item.reset();
                    }
                    this.parent.stack_text.reset();
                }
                this.title = item.getAttribute('title');
                this.text = this.relates[this.title]['text'];
                this.relates_to = this.relates[this.title]['relates_to'];
            }
            hover(){
                this.item.style.height = '12vh';
                this.item.style.animation = 'wiggle 2.5s infinite';
            }
            reset(){
                this.item.style.height = '10vh';
                this.item.style.animation = 'none';
            }
            mouseover(){
                for(let item of this.parent.items){
                    // console.log(this.relates_to)
                    if (this.relates_to.includes(item.title)){
                        // alert("RELATES")
                        item.hover();
                    }
                }
            }

        }
        stack_text = class{
            constructor(){
                this.item = document.getElementsByClassName('anmlo_experience_stack_text')[0];
                this.reset();
            }
            set(text){
                this.item.innerHTML = text;
            }
            reset(){
                this.item.innerHTML = 'Hover over one of the technologies above to see more!<br/> This is, by no means and exhaustive list.'
            }
        }
        constructor(parent){
            super(parent);
            this.items = Array.from(parent.getElementsByTagName('img'))
            this.items = this.items.map((i)=>{return new this.stack_item(i,this)})
            this.stack_text = new this.stack_text();
            console.log()
            
        }
        next(){
            this.close();
            page.cards[3].open()
            setTimeout(()=>{
                page.cards[3].load()
            },200)
        }
    }
    card3 = class extends page_base.card{
        constructor(parent){
            super(parent);
            this.json_disp = parent.getElementsByClassName('anmlo_card_json_disp_wrap')[0];

        }
        load(){
            fetch('/metrics/get').then((response) => response.json()).then(json => {
                this.json_disp.innerHTML = JSON.stringify(json, null,4);
            }).catch(function () {
                this.json_disp.innerHTML = 'Could not fetch'
            })
        }
        next(){
            this.close();
            page.cards[0].open()
        }
    }
    constructor(){
        super();
        page = this;
        this.card_elements = document.getElementsByClassName('anmlo_card')
        this.hello_hdr = new this.hello_header();
        this.cards = [
            new this.index_card(this.card_elements[0],this.hello_hdr),
            new this.card1(this.card_elements[1]),
            new this.card2(this.card_elements[2]),
            new this.card3(this.card_elements[3])
        ]
        this.cards[0].open();
    }
}

export default new index();
