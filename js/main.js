(() => {
  "use strict";

  function initContactForm() {
    const form = document.getElementById("contact-form");
    const errorsDiv = document.getElementById("form-errors");
    const successModal = document.getElementById("success-modal");

    if (!form || !errorsDiv || !successModal) {
      return;
    }

    const closeModalBtn = successModal.querySelector("button");
    const submitBtn = form.querySelector('button[type="submit"]');
    const defaultSubmitText = submitBtn ? submitBtn.textContent.trim() : "Send Message";
    let lastFocusedElement = null;

    function getField(name) {
      return form.elements.namedItem(name);
    }

    function showError(message) {
      errorsDiv.textContent = message;
      errorsDiv.classList.remove("hidden");
    }

    function clearError() {
      errorsDiv.textContent = "";
      errorsDiv.classList.add("hidden");
    }

    function setSubmitting(isSubmitting) {
      if (!submitBtn) {
        return;
      }

      submitBtn.disabled = isSubmitting;
      submitBtn.textContent = isSubmitting ? "Sending..." : defaultSubmitText;
    }

    function openSuccessModal() {
      lastFocusedElement = document.activeElement;
      successModal.classList.remove("hidden");
      successModal.setAttribute("aria-hidden", "false");
      closeModalBtn?.focus();
    }

    function closeSuccessModal() {
      successModal.classList.add("hidden");
      successModal.setAttribute("aria-hidden", "true");

      if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
      }
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearError();

      const name = getField("name")?.value.trim();
      const email = getField("email")?.value.trim();
      const message = getField("message")?.value.trim();
      const honeypot = getField("_gotcha")?.value;

      if (!name || !email || !message) {
        showError("Please fill out all fields.");
        return;
      }

      if (honeypot) {
        return;
      }

      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(email)) {
        showError("Please enter a valid email address.");
        return;
      }

      setSubmitting(true);

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          form.reset();
          openSuccessModal();
        } else {
          showError("Oops! Something went wrong. Please try again.");
        }
      } catch {
        showError("Error submitting form. Try again.");
      } finally {
        setSubmitting(false);
      }
    });

    closeModalBtn?.addEventListener("click", closeSuccessModal);

    successModal.addEventListener("click", (event) => {
      if (event.target === successModal) {
        closeSuccessModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !successModal.classList.contains("hidden")) {
        closeSuccessModal();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initContactForm();
  });
})();
