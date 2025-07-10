class a{constructor(){this.currentPage=this.getCurrentPage()}getCurrentPage(){const e=window.location.pathname;return e.includes("index.html")||e==="/"||e===""?"home":e.includes("about-us.html")?"about":e.includes("features.html")?"features":e.includes("faq.html")?"faq":e.includes("report.html")?"report":e.includes("verification.html")?"verification":"home"}generateHeader(){return`
            <header>
                <div class="container">
                    <a href="/index.html" class="logo">
                        <img src="/SafePin Logo Green.svg" alt="SafePin Logo">
                        SafePin
                    </a>
                    <nav>
                        <ul>
                            <li><a href="/index.html" class="${this.currentPage==="home"?"active":""}">Home</a></li>
                            <li><a href="/landing-page/features.html" class="${this.currentPage==="features"?"active":""}">Features</a></li>
                            <li><a href="/landing-page/about-us.html" class="${this.currentPage==="about"?"active":""}">About Us</a></li>
                            <li><a href="/landing-page/faq.html" class="${this.currentPage==="faq"?"active":""}">FAQ</a></li>
                            <li><a href="/login.html" class="nav-button">Authority Access</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        `}insertHeader(){const e=document.getElementById("header-container");e?e.innerHTML=this.generateHeader():console.warn('Header container not found. Add <div id="header-container"></div> to your page.')}init(){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{this.insertHeader()}):this.insertHeader()}}typeof window<"u"&&new a().init();class r{constructor(){this.currentYear=new Date().getFullYear()}generateFooter(){return`
            <footer>
                <div class="container footer-container">
                    <div class="footer-column">
                        <h4><img src="/SafePin Map Logo.png" alt="SafePin Logo" style="vertical-align: middle; margin-right: 5px; width: 20px; height: 20px;">SafePin</h4>
                        <p>Copyright © ${this.currentYear} SafePin <br> All rights reserved.</p>
                        <div class="social-icons" style="margin-top:10px;">
                            <a href="#" style="margin-right:10px;"><img src="/SafePin Map Logo.png" alt="LinkedIn" style="width: 20px; height: 20px;"></a>
                            <a href="#" style="margin-right:10px;"><img src="/SafePin Map Logo.png" alt="Twitter/X" style="width: 20px; height: 20px;"></a>
                            <a href="#" style="margin-right:10px;"><img src="/SafePin Map Logo.png" alt="YouTube" style="width: 20px; height: 20px;"></a>
                            <a href="#"><img src="/SafePin Map Logo.png" alt="Instagram" style="width: 20px; height: 20px;"></a>
                        </div>
                    </div>
                    <div class="footer-column">
                        <h4>SafePin</h4>
                        <ul>
                            <li><a href="${this.getAboutLink()}">About us</a></li>
                            <li><a href="${this.getFaqLink()}">FAQ</a></li>
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
                        <form class="newsletter-form">
                            <input type="email" placeholder="Enter your email address" required>
                            <button type="submit" class="subscribe-btn"><img src="/SafePin Map Logo.png" alt="Send" style="width: 16px; height: 16px;"></button>
                        </form>
                    </div>
                </div>
            </footer>
        `}handleNewsletterSubmit(e){e.preventDefault();const t=e.target.querySelector('input[type="email"]').value;console.log("Newsletter subscription:",t),alert("Thank you for subscribing to our newsletter!"),e.target.reset()}getAboutLink(){return window.location.pathname.includes("landing-page/")?"about-us.html":"landing-page/about-us.html"}getFaqLink(){return window.location.pathname.includes("landing-page/")?"faq.html":"landing-page/faq.html"}insertFooter(){const e=document.getElementById("footer-container");if(e){e.innerHTML=this.generateFooter();const t=e.querySelector(".newsletter-form");t&&t.addEventListener("submit",this.handleNewsletterSubmit.bind(this))}else console.warn('Footer container not found. Add <div id="footer-container"></div> to your page.')}init(){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>this.insertFooter()):this.insertFooter()}}typeof window<"u"&&new r().init();export{a as S,r as a};
