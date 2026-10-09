document.addEventListener("DOMContentLoaded", function () {

    console.log("=================================");
    console.log("TokenFlow Frontend Started");
    console.log("=================================");

    // Get all service cards
    const serviceCards = document.querySelectorAll(".service-card-new");

    // Get Generate Token button
    const generateButton = document.getElementById("generateBtn");

    console.log("Service cards found:", serviceCards.length);
    console.log("Generate button found:", generateButton !== null);


    // =====================================================
    // SERVICE CARD CLICK
    // =====================================================

    serviceCards.forEach(function (card) {

        card.addEventListener("click", function () {

            console.log("SERVICE CARD CLICKED");


            // Read service information
            const serviceId = card.dataset.serviceId;
            const service = card.dataset.service;
            const prefix = card.dataset.prefix;

            console.log("Service ID:", serviceId);
            console.log("Service Name:", service);
            console.log("Prefix:", prefix);


            // Remove previous selection
            serviceCards.forEach(function (item) {
                item.classList.remove("selected");
            });


            // Select clicked card
            card.classList.add("selected");


            // =================================================
            // SAVE SERVICE
            // =================================================

            const serviceData = {

                serviceId: serviceId,

                service: service,

                prefix: prefix

            };


            localStorage.setItem(
                "selectedService",
                JSON.stringify(serviceData)
            );


            // =================================================
            // UPDATE SELECTED PANEL
            // =================================================

            const selectedService =
                document.getElementById("selectedService");

            const selectedInfo =
                document.getElementById("selectedInfo");

            const selectedWaiting =
                document.getElementById("selectedWaiting");

            const selectedTime =
                document.getElementById("selectedTime");

            const selectedIcon =
                document.getElementById("selectedIcon");

            const selectedPanel =
                document.getElementById("selectedPanel");


            // Service name
            if (selectedService) {

                selectedService.innerText = service;

            }


            // Description
            if (selectedInfo) {

                selectedInfo.innerText =
                    "You have selected " +
                    service +
                    ". Generate your digital token to join the queue.";

            }


            // Waiting time from card
            const waitingElement =
                card.querySelector(".service-bottom div:first-child span");

            if (selectedWaiting && waitingElement) {

                selectedWaiting.innerText =
                    waitingElement.innerText.replace(" waiting", "");

            }


            // Service time from card
            const timeElement =
                card.querySelector(".service-bottom div:last-child span");

            if (selectedTime && timeElement) {

                selectedTime.innerText =
                    timeElement.innerText.replace("~", "");

            }


            // Get icon from clicked card
            const cardIcon =
                card.querySelector(".service-icon-new i");

            if (selectedIcon && cardIcon) {

                selectedIcon.className =
                    cardIcon.className;

            }


            // =================================================
            // SHOW SELECTED PANEL
            // =================================================

            if (selectedPanel) {

                selectedPanel.classList.add("active");

            }


            // =================================================
            // ENABLE GENERATE BUTTON
            // =================================================

            if (generateButton) {

                generateButton.disabled = false;

                generateButton.classList.add("enabled");

            }


            // =================================================
            // SHOW TOAST
            // =================================================

            const toast =
                document.getElementById("serviceToast");

            const toastText =
                document.getElementById("toastText");


            if (toast && toastText) {

                toastText.innerText =
                    service + " selected successfully.";

                toast.classList.add("show");


                setTimeout(function () {

                    toast.classList.remove("show");

                }, 2000);

            }


            console.log("Selected service successfully.");
            console.log("Generate Token button enabled.");

        });

    });


    // =====================================================
    // GENERATE TOKEN BUTTON
    // =====================================================

    if (generateButton) {

        generateButton.addEventListener(
            "click",
            generateToken
        );

    }

});


// =========================================================
// GENERATE TOKEN
// =========================================================

async function generateToken() {

    console.log("=================================");
    console.log("GENERATE TOKEN CLICKED");
    console.log("=================================");


    // Get selected service
    const savedService =
        localStorage.getItem("selectedService");


    if (!savedService) {

        alert("Please select a service first.");

        return;

    }


    let serviceData;


    try {

        serviceData =
            JSON.parse(savedService);

    }

    catch (error) {

        console.error(
            "Error reading selected service:",
            error
        );

        alert("Unable to read selected service.");

        return;

    }


    console.log(
        "Sending Service ID:",
        serviceData.serviceId
    );


    // Get button
    const generateButton =
        document.getElementById("generateBtn");


    // Disable button while generating
    if (generateButton) {

        generateButton.disabled = true;

        generateButton.querySelector("span").innerText =
            "Generating...";

    }


    try {

        // =================================================
        // CALL BACKEND
        // =================================================

        const response =
            await fetch(
                "http://localhost:5000/api/tokens",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        service_id:
                            Number(serviceData.serviceId)

                    })
                }
            );


        const data =
            await response.json();


        console.log("Backend Response:", data);


        // =================================================
        // CHECK RESPONSE
        // =================================================

        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Token generation failed."
            );

        }


        // =================================================
        // REAL TOKEN
        // =================================================

        const token =
            data.token.token_number;


        console.log(
            "REAL TOKEN GENERATED:",
            token
        );


        // Save token
        localStorage.setItem(
            "generatedToken",
            token
        );


        // Save complete token information
        localStorage.setItem(
            "generatedTokenData",
            JSON.stringify(data.token)
        );


        // Save generation time
        localStorage.setItem(
            "tokenGeneratedAt",
            new Date().toISOString()
        );


        // =================================================
        // GO TO TOKEN PAGE
        // =================================================

        window.location.href = "token.html";

    }

    catch (error) {

        console.error(
            "Token generation error:",
            error
        );


        alert(
            "Unable to generate token.\n\n" +
            error.message +
            "\n\nPlease make sure the TokenFlow backend is running."
        );


        // Re-enable button
        if (generateButton) {

            generateButton.disabled = false;

            generateButton.classList.add("enabled");

            generateButton.querySelector("span").innerText =
                "Generate Token";

        }

    }

}