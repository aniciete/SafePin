var r=(i,e)=>()=>(e||i((e={exports:{}}).exports,e),e.exports);var o=r((s,t)=>{class a{constructor(){this.currentPage=this.getCurrentPage()}getCurrentPage(){const e=window.location.pathname;return e.includes("index.html")||e==="/"||e===""?"home":e.includes("about-us.html")?"about":e.includes("report.html")?"report":e.includes("verification.html")?"verification":"home"}generateHeader(){return`
            <header>
                <div class="container">
                    <a href="${this.getHomeLink()}" class="logo">
                        <img src="${this.getLogoPath()}" alt="SafePin Logo">
                        SafePin
                    </a>
                    <nav>
                        <ul>
                            <li><a href="${this.getHomeLink()}" ${this.currentPage==="home"?'style="color: #6ab04c; font-weight: bold;"':""}>Home</a></li>
                            <li><a href="#">Features</a></li>
                            <li><a href="${this.getAboutLink()}" ${this.currentPage==="about"?'style="color: #6ab04c; font-weight: bold;"':""}>About Us</a></li>
                            <li><a href="#">FAQ</a></li>
                            <li><a href="${this.getLoginLink()}" class="nav-button">Authority Access</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        `}getHomeLink(){return window.location.pathname.includes("landing-page/")?"../index.html":"index.html"}getLogoPath(){return window.location.pathname.includes("landing-page/")?"../landing-page/SafePin Logo Green.svg":"landing-page/SafePin Logo Green.svg"}getAboutLink(){return window.location.pathname.includes("landing-page/")?"about-us.html":"landing-page/about-us.html"}getLoginLink(){return window.location.pathname.includes("landing-page/")?"../login.html":"login.html"}insertHeader(){const e=document.getElementById("header-container");e?e.innerHTML=this.generateHeader():console.warn('Header container not found. Add <div id="header-container"></div> to your page.')}init(){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{this.insertHeader()}):this.insertHeader()}}typeof t<"u"&&t.exports&&(t.exports=a);typeof window<"u"&&new a().init();class n{constructor(){this.currentYear=new Date().getFullYear()}generateFooter(){return`
            <footer>
                <div class="container footer-container">
                    <div class="footer-column">
                        <h4><img src="https://via.placeholder.com/20x20.png?text=S" alt="" style="vertical-align: middle; margin-right: 5px;">SafePin</h4>
                        <p>Copyright © ${this.currentYear} SafePin <br> All rights reserved.</p>
                        <div class="social-icons" style="margin-top:10px;">
                            <a href="#" style="margin-right:10px;"><img src="https://via.placeholder.com/20x20/ffffff/5a9a42?Text=in" alt="LinkedIn"></a>
                            <a href="#" style="margin-right:10px;"><img src="https://via.placeholder.com/20x20/ffffff/5a9a42?Text=X" alt="Twitter/X"></a>
                            <a href="#" style="margin-right:10px;"><img src="https://via.placeholder.com/20x20/ffffff/5a9a42?Text=yt" alt="YouTube"></a>
                            <a href="#"><img src="https://via.placeholder.com/20x20/ffffff/5a9a42?Text=ig" alt="Instagram"></a>
                        </div>
                    </div>
                    <div class="footer-column">
                        <h4>SafePin</h4>
                        <ul>
                            <li><a href="${this.getAboutLink()}">About us</a></li>
                            <li><a href="#">FAQ</a></li>
                            <li><a href="#">Contact us</a></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Privacy policy</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="#">Help center</a></li>
                            <li><a href="#">Terms of service</a></li>
                            <li><a href="#">Privacy policy</a></li>
                            <li><a href="#">Status</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h4>Stay up to date</h4>
                        <form class="newsletter-form" onsubmit="return handleNewsletterSubmit(event)">
                            <input type="email" placeholder="Enter your email address" required>
                            <button type="submit" class="subscribe-btn"><img src="https://via.placeholder.com/16x16/ffffff/5a9a42?Text=%3E" alt="Send"></button>
                        </form>
                    </div>
                </div>
            </footer>
        `}getAboutLink(){return window.location.pathname.includes("landing-page/")?"about-us.html":"landing-page/about-us.html"}insertFooter(){const e=document.getElementById("footer-container");e?e.innerHTML=this.generateFooter():console.warn('Footer container not found. Add <div id="footer-container"></div> to your page.')}init(){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{this.insertFooter()}):this.insertFooter()}}typeof t<"u"&&t.exports&&(t.exports=n);typeof window<"u"&&new n().init()});export default o();
