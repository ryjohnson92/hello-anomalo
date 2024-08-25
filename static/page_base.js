class page_base{
    static card = class card{
        constructor(parent){
            this.card = parent;
            this.control_button = this.card.getElementsByTagName('button')[0];
            this.control_button.onclick = ()=>{ this.next(); };
            this.page_loaded = new Date();
        }
        close(){
            this.card.style.height = '0';
            this.card.style.paddingTop = '0';
            setTimeout(()=>{
                this.card.style.display = 'none';
            },1000)
        }
        open(){
            this.card.style.height = '90vh';
            // this.card.style.paddingTop = '2vh';
            this.card.style.display = 'flex';
            fetch("/metrics/post", {
                method: "POST",
                body: JSON.stringify({
                    title: this.constructor.name,
                    completed: new Date()
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });
        }
        next(){
            this.close();
        }
    }
    constructor(){
        this.header = document.getElementsByClassName('anmlo_header')[0];
        this.header.onclick = ()=>{this.download_resume()};
    }
    download_resume(){
        let d = document.createElement('a');
        d.href='/ryans/resume.pdf';
        d.click();
    }
}
export default page_base;