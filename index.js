// index.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    // Handle form submission
    if (pathname === "/submit" && request.method === "POST") {
      try {
        const formData = await request.formData();
        
        // Validate inputs
        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const phone = formData.get('phone')?.trim();
        const message = formData.get('message')?.trim();

        // Server-side validation
        if (!name || !email || !message) {
          return Response.redirect(url.origin + '/?error=Missing required fields', 303);
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return Response.redirect(url.origin + '/?error=Invalid email format', 303);
        }

        if (phone && !/^\+?[\d\s-()]{7,20}$/.test(phone)) {
          return Response.redirect(url.origin + '/?error=Invalid phone format', 303);
        }

        // Insert into D1
        const { success } = await env.DB.prepare(
          `INSERT INTO contacts (name, email, phone, message, created_at)
           VALUES (?, ?, ?, ?, datetime('now'))`
        ).bind(name, email, phone || null, message).run();

        if (!success) throw new Error('Database insertion failed');
        
        return Response.redirect(url.origin + '/?success=1', 303);

      } catch (err) {
        return Response.redirect(url.origin + '/?error=Server error', 303);
      }
    }

    // Serve HTML form
    const error = url.searchParams.get('error');
    const success = url.searchParams.has('success');
    
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="contact.css">
        <title>Contact Form</title>
      </head>
      <body>
        <header class="header">
          <a href="/" class="logo"><span>Roshan Joseph</span></a>
          <ul class="nav-links">
            <li><a href="/about">About</a></li>
            <li><a href="/experience">Experience</a></li>
            <li><a href="/projects">Projects</a></li>
            <li><a href="/">Contact</a></li>
          </ul>
          <button class="visit-btn">Visit Github</button>
        </header>

        <section class="contact-section">
          <div class="contact-intro">
            <h2 class="contact-title">Get in Touch</h2>
            <p class="contact-description">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
            ${error ? `<div class="error">${error}</div>` : ''}
            ${success ? `<div class="success">Thank you for your message!</div>` : ''}
          </div>

          <form class="contact-form" method="POST" action="/submit">
            <div class="form-group-container">
              <div class="form-group">
                <label for="name" class="form-label">Name</label>
                <input id="name" name="name" class="form-input" placeholder="Your name" required>
              </div>
              <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <input id="email" name="email" class="form-input" placeholder="Your email" type="email" required>
              </div>
              <div class="form-group">
                <label for="phone" class="form-label">Phone</label>
                <input id="phone" name="phone" class="form-input" placeholder="+1 (234) 56789" type="tel">
              </div>
              <div class="form-group">
                <label for="message" class="form-label">Message</label>
                <textarea class="form-textarea" id="message" name="message" placeholder="Your message" required></textarea>
              </div>
            </div>
            <button class="form-submit" type="submit">Send Message</button>
          </form>
        </section>
      </body>
      </html>
    `;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
};
