// ─── EmailJS Setup ───────────────────────────────────────────────
// 1. Sign up at https://www.emailjs.com
// 2. Create a service (Gmail, Outlook, etc.) → copy the Service ID
// 3. Create an email template → copy the Template ID
//    In your template, use these variables: {{name}}, {{email}}, {{subject}}, {{message}}
// 4. Go to Account → copy your Public Key
// Then replace the three placeholders below:

const EMAILJS_PUBLIC_KEY  = "Wkrmh-OXWXERgaubu";   // e.g. "abc123XYZ"
const EMAILJS_SERVICE_ID  = "service_fo56u9n";   // e.g. "service_xxxxxx"
const EMAILJS_TEMPLATE_ID = "template_ta58buj";  // e.g. "template_xxxxxx"

// ─────────────────────────────────────────────────────────────────

emailjs.init(EMAILJS_PUBLIC_KEY);

const form       = document.getElementById("contactForm");
const submitBtn  = document.getElementById("submitBtn");
const formStatus = document.getElementById("formStatus");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    formStatus.textContent = "";
    formStatus.className = "form-status";

    const templateParams = {
        name:    document.getElementById("name").value.trim(),
        email:   document.getElementById("email").value.trim(),
        subject: document.getElementById("subject").value.trim() || "(no subject)",
        message: document.getElementById("message").value.trim(),
    };

    try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        formStatus.textContent = "Message sent. We'll get back to you soon.";
        formStatus.classList.add("success");
        form.reset();
    } catch (err) {
        console.error("EmailJS error:", err);
        formStatus.textContent = "Something went wrong. Please try again or email us directly.";
        formStatus.classList.add("error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
    }
});