document.addEventListener("DOMContentLoaded", () => {

    const loginForm =
        document.getElementById("loginForm");


    if (!loginForm) {
        return;
    }


    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            // -----------------------------------------
            // GET INPUTS
            // -----------------------------------------

            const emailInput =
                loginForm.querySelector(
                    'input[type="email"]'
                );


            const passwordInput =
                loginForm.querySelector(
                    'input[type="password"]'
                );


            const email =
                emailInput.value.trim();


            const password =
                passwordInput.value;


            if (!email || !password) {

                alert(
                    "Please enter email and password."
                );

                return;
            }


            // -----------------------------------------
            // BUTTON
            // -----------------------------------------

            const loginButton =
                loginForm.querySelector(
                    'button[type="submit"]'
                );


            const originalText =
                loginButton.innerHTML;


            loginButton.disabled = true;

            loginButton.innerHTML =
                "Signing in...";


            try {

                // -------------------------------------
                // LOGIN API
                // -------------------------------------

                const response =
                    await fetch(
                        "http://localhost:5000/api/auth/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            credentials: "include",

                            body: JSON.stringify({

                                email: email,

                                password: password

                            })
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Login response:",
                    data
                );


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Login failed."
                    );

                    return;
                }


                // -------------------------------------
                // SAVE USER INFO
                // -------------------------------------

                localStorage.setItem(
                    "tokenflowUser",
                    JSON.stringify(data.user)
                );


                // -------------------------------------
                // ROLE BASED REDIRECT
                // -------------------------------------

                if (data.user.role === "admin") {

                    window.location.href =
                        "admin-dashboard.html";

                }

                else {

                    window.location.href =
                        "index.html";

                }

            }

            catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                alert(
                    "Unable to connect to TokenFlow server."
                );

            }

            finally {

                loginButton.disabled = false;

                loginButton.innerHTML =
                    originalText;

            }

        }
    );

});