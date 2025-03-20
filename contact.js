document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".test");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const message = document.getElementById("message").value.trim();

        let errorMessage = "";

        // Basic validation
        if (!name || !email || !message) {
            errorMessage = "Name, Email, and Message are required!";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errorMessage = "Invalid email format!";
        } else if (phone && !/^\+?[\d\s-()]{7,20}$/.test(phone)) {
            errorMessage = "Invalid phone number format!";
        }

        if (errorMessage) {
            showMessage(errorMessage, "error");
            return;
        }

        // Send form data
        fetch("/submit", {
            method: "POST",
            body: new FormData(form),
        })
        .then(response => {
            if (response.ok) {
                showMessage("Thank you for your message!", "success");
                form.reset();
            } else {
                showMessage("Something went wrong. Try again!", "error");
            }
        })
        .catch(() => showMessage("Server error. Please try later!", "error"));
    });

    function showMessage(message, type) {
        const messageBox = document.createElement("div");
        messageBox.className = type;
        messageBox.textContent = message;
        document.querySelector(".contact-intro").appendChild(messageBox);

        setTimeout(() => messageBox.remove(), 4000); // Remove after 4 seconds
    }
});
