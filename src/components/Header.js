export class SafePinHeader {
    generateHeader() {
        return `
        <header>
            <div class="container">
                <a href="/" class="logo">
                    <img src="/assets/SafePin Logo Green.svg" alt="SafePin Logo">
                    <span>SafePin</span>
                </a>
                <nav>
                    <ul>
                        <li><a href="/landing-page/about-us.html">About Us</a></li>
                        <li><a href="/landing-page/features.html">Features</a></li>
                        <li><a href="/landing-page/faq.html">FAQ</a></li>
                        <li><a href="/login.html" class="nav-button">Authority Login</a></li>
                    </ul>
                </nav>
            </div>
        </header>
        `;
    }

    init() {
        const headerContainer = document.getElementById('header-container');
        if (headerContainer) {
            headerContainer.innerHTML = this.generateHeader();
        }
    }
}

export function renderHeader(container) {
    const header = new SafePinHeader();
    container.innerHTML = header.generateHeader();
}