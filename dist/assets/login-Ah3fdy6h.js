import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css                    */import{s as b,a as v,b as S}from"./auth.service-DVlGoKE_.js";import"./firebase-C5y3UOfw.js";import"./browser-Cx9Z-D_s.js";import"./errorHandler-CxKsmf1R.js";const w=`
<div class="auth-container">
    <div class="auth-header">
        <h1>Authority Access Portal</h1>
        <p>Sign in or create an account</p>
    </div>
    
    <div class="auth-tabs">
        <button class="auth-tab active" id="loginTab" aria-label="Sign In">Sign In</button>
        <button class="auth-tab" id="signupTab" aria-label="Sign Up">Sign Up</button>
    </div>
    
    <div id="auth-status"></div>
    
    <!-- Login Form -->
    <form id="loginForm" class="auth-form active">
        <label for="loginEmail" class="visually-hidden">Organization Email</label>
        <input type="email" id="loginEmail" placeholder="Organization Email" required>
        <label for="loginPassword" class="visually-hidden">Password</label>
        <input type="password" id="loginPassword" placeholder="Password" required>
        <button type="submit" aria-label="Sign In with email and password">Sign In</button>
        <div class="auth-divider">OR</div>
        <button type="button" class="google-signin-btn" id="googleSignInBtn" aria-label="Sign in with Google">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo">
            Sign in with Google
        </button>
    </form>
    
    <!-- Signup Container -->
    <div id="signupContainer" class="auth-form" style="display: none;">
        <!-- Step 1: Role Selection -->
        <div id="roleStep" style="width: 100%;">
            <div class="role-selection" style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
                <label for="role" style="font-weight: 500; color: #4a5568;">Select your role to continue:</label>
                <select id="role" name="role" style="padding: 0.8rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 1rem; background-color: white;">
                    <option value="admin">Admin</option>
                    <option value="authority">Authority</option>
                </select>
            </div>
            <button type="button" id="roleContinueBtn" aria-label="Continue to the next step">Continue</button>
        </div>

        <!-- Step 2: Credentials -->
        <form id="credentialsStep" style="display: none; flex-direction: column; gap: 1rem; width: 100%;">
            <label for="signupEmail" class="visually-hidden">Your Email</label>
            <input type="email" id="signupEmail" placeholder="Your Email" required>
            <label for="signupPassword" class="visually-hidden">Create Password</label>
            <input type="password" id="signupPassword" placeholder="Create Password" required>
            <button type="submit" aria-label="Sign Up with email and password">Sign Up</button>
            <div class="auth-divider">OR</div>
            <button type="button" class="google-signin-btn" id="googleSignUpBtn" aria-label="Sign up with Google">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo">
                Sign up with Google
            </button>
            <button type="button" id="backToRoleBtn" style="background: #a0aec0; margin-top: 1rem;" aria-label="Go back to the previous step">Back</button>
        </form>
    </div>
</div>
`;function f(){const e=document.createElement("div");return e.innerHTML=w,e}function E(e){const a=e.querySelectorAll(".auth-tab"),r=e.querySelector("#loginForm"),l=e.querySelector("#signupContainer"),d=e.querySelector("#googleSignInBtn"),g=e.querySelector("#googleSignUpBtn"),u=e.querySelector("#adminLoginBtn"),i=e.querySelector("#closeAuthorityModalBtn"),t=e.querySelector("#roleStep"),n=e.querySelector("#credentialsStep"),s=e.querySelector("#roleContinueBtn"),h=e.querySelector("#backToRoleBtn"),y=o=>{a.forEach(c=>c.classList.remove("active")),o.classList.add("active"),o.id==="loginTab"?(r.style.display="block",l.style.display="none"):(r.style.display="none",l.style.display="block")};a.forEach(o=>{o.addEventListener("click",()=>y(o))}),r.addEventListener("submit",o=>{o.preventDefault();const c=e.querySelector("#loginEmail").value,p=e.querySelector("#loginPassword").value;e.dispatchEvent(new CustomEvent("login",{detail:{email:c,password:p}}))}),n.addEventListener("submit",o=>{o.preventDefault();const c=e.querySelector("#signupEmail").value,p=e.querySelector("#signupPassword").value,m=e.querySelector("#role").value;e.dispatchEvent(new CustomEvent("signup",{detail:{email:c,password:p,role:m}}))}),d.addEventListener("click",()=>{e.dispatchEvent(new CustomEvent("googleSignIn",{detail:{role:"authority"}}))}),g.addEventListener("click",()=>{const o=e.querySelector("#role").value;e.dispatchEvent(new CustomEvent("googleSignIn",{detail:{role:o}}))}),u&&u.addEventListener("click",()=>{window.location.href="/admin-page/project/index.html"}),i&&i.addEventListener("click",()=>{e.style.display="none"}),s.addEventListener("click",()=>{t.style.display="none",n.style.display="flex"}),h.addEventListener("click",()=>{t.style.display="block",n.style.display="none"})}document.addEventListener("DOMContentLoaded",()=>{const e=document.querySelector(".auth-container"),a=f();e.innerHTML="",e.appendChild(a),E(a);const r=a.querySelector("#auth-status");function l(i,t=!1){r&&(r.textContent=i,r.style.color=t?"red":"green")}async function d(i,t){try{const n=await b(i,t);n.user&&(l(`Welcome, ${n.user.email}!`),setTimeout(()=>{window.location.href="authority-page/index.html"},1500))}catch(n){l(n.message,!0)}}async function g(i,t,n){try{const s=await v(i,t,n);s.user&&(l(`Welcome, ${s.user.email}!`),setTimeout(()=>{window.location.href="authority-page/index.html"},1500))}catch(s){l(s.message,!0)}}async function u(i){try{const t=await S(i);t.user&&(l(`Welcome, ${t.user.email}!`),setTimeout(()=>{window.location.href="authority-page/index.html"},1500))}catch(t){l(t.message,!0)}}a.addEventListener("login",i=>{const{email:t,password:n}=i.detail;d(t,n)}),a.addEventListener("signup",i=>{const{email:t,password:n,role:s}=i.detail;g(t,n,s)}),a.addEventListener("googleSignIn",i=>{const{role:t}=i.detail;u(t)})});
