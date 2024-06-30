document.addEventListener("DOMContentLoaded", function() {
    const steps = document.querySelectorAll(".step-circle");
    const formSteps = document.querySelectorAll(".form-step");
    const nextButtons = document.querySelectorAll(".btn-next");

    let currentStep = 1;

    function updateFormStep() {
        formSteps.forEach(step => {
            step.classList.remove("form-step-active");
            if (step.getAttribute("data-step") == currentStep) {
                step.classList.add("form-step-active");
            }
        });

        steps.forEach(step => {
            step.classList.remove("active");
            if (step.getAttribute("data-step") <= currentStep) {
                step.classList.add("active");
            }
        });
    }

    function validateEmail(email) {
        if (!email.includes('@')) {
            return "Please include an '@' in the email address.";
        } else {
            const parts = email.split('@');
            if (parts[0].trim() === "") {
                return "The part before the '@' cannot be empty.";
            }
            if (parts[1].trim() === "") {
                return "The part after the '@' cannot be empty.";
            }
            if (!parts[1].includes('.')) {
                return "The domain part of the email is missing a '.'";
            }
        }
        return ""; // No errors
    }

    function validateWhatsAppNumber(number) {
        const numberRegex = /^\d{11}$/;
        return numberRegex.test(number) ? "" : "Please enter a valid WhatsApp number (11 digits).";
    }

    function showValidationMessage(input, message) {
        input.setCustomValidity(message);
        input.reportValidity();
    }

    function clearValidationMessage(input) {
        input.setCustomValidity("");
        input.reportValidity();
    }

    function validateCurrentStep() {
        let isValid = true;
        const currentStepFields = formSteps[currentStep - 1].querySelectorAll("input, textarea");

        for (let field of currentStepFields) {
            if (field.value.trim() === "" && field.required) {
                isValid = false;
                showValidationMessage(field, "This field is required.");
                field.focus();
                break;
            } else {
                clearValidationMessage(field);
                if (field.type === "email") {
                    const emailError = validateEmail(field.value);
                    if (emailError) {
                        isValid = false;
                        showValidationMessage(field, emailError);
                        field.focus();
                        break;
                    }
                }
                if (field.name === "whatsapp") {
                    const numberError = validateWhatsAppNumber(field.value);
                    if (numberError) {
                        isValid = false;
                        showValidationMessage(field, numberError);
                        field.focus();
                        break;
                    }
                }
            }
        }

        return isValid;
    }

    nextButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (validateCurrentStep()) {
                if (currentStep < formSteps.length) {
                    currentStep++;
                    updateFormStep();
                }
            }
        });
    });

    steps.forEach(step => {
        step.addEventListener("click", () => {
            const stepNumber = parseInt(step.getAttribute("data-step"), 10);
            if (stepNumber < currentStep || validateCurrentStep()) {
                currentStep = stepNumber;
                updateFormStep();
            }
        });
    });

    updateFormStep();
});
