const registerForm = document.querySelector("form");

if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Get form fields
        const inputs = registerForm.querySelectorAll("input");
        const selects = registerForm.querySelectorAll("select");

        const name = inputs[0]?.value.trim() || "";
        const email = inputs[1]?.value.trim() || "";
        const password = document.querySelector("#registerPassword")?.value || "";

        // Role dropdown
        let role = "user";

        if (selects.length > 0) {
            role = selects[0].value.toLowerCase();
        }

        console.log("Registration data:", {
            name,
            email,
            role,
            password: password ? "******" : ""
        });

        if (!name || !email || !password) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password,
                        role: role
                    })
                }
            );

            const data = await response.json();

            console.log("Server response:", data);

            if (data.success) {
                alert("Account created successfully!");

                window.location.href = "login.html";
            } else {
                alert(data.message || "Registration failed.");
            }

        } catch (error) {
            console.error("Registration Error:", error);
            alert("Unable to connect to server.");
        }
    });
}