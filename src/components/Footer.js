const FOOTER_HTML = `
<footer>
    <div class="footer-container">
        <div class="footer-column">
            <h4>About Us</h4>
            <p>SafePin is a community-driven safety platform dedicated to creating safer neighborhoods through anonymous reporting and transparent information sharing.</p>
        </div>
        <div class="footer-column">
            <h4>Quick Links</h4>
            <ul>
                <li><a href="/landing-page/about-us.html">About Us</a></li>
                <li><a href="/landing-page/features.html">Features</a></li>
                <li><a href="/landing-page/faq.html">FAQ</a></li>
                <li><a href="/login.html">Authority Login</a></li>
            </ul>
        </div>
        <div class="footer-column">
            <h4>Contact Us</h4>
            <ul>
                <li>Email: support@safepin.com</li>
                <li>Phone: (123) 456-7890</li>
            </ul>
        </div>
        <div class="footer-column">
            <h4>Stay Updated</h4>
            <p>Subscribe to our newsletter for the latest updates and safety alerts.</p>
            <form class="newsletter-form">
                <input type="email" placeholder="Enter your email">
                <button type="submit">Subscribe</button>
            </form>
        </div>
    </div>
</footer>
`;

export function renderFooter(container) {
    container.innerHTML = FOOTER_HTML;
}
