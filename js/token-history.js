document.addEventListener("DOMContentLoaded", () => {

    console.log("TokenFlow Token History Started");

    const tokenHistoryBody = document.getElementById("tokenHistoryBody");
    const exportPdfBtn = document.getElementById("exportPdfBtn");

    let selectedToken = null;


    // =========================================================
    // LOAD TOKEN HISTORY
    // =========================================================

    async function loadTokenHistory() {

        try {

            const response = await fetch("http://localhost:5000/api/tokens");

            const data = await response.json();

            console.log("Token History Response:", data);

            if (!data.success) {
                throw new Error(data.message || "Unable to load token history");
            }

            renderTokenHistory(data.tokens);

        } catch (error) {

            console.error("Token history error:", error);

            tokenHistoryBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4 text-danger">
                        Unable to load token history.
                    </td>
                </tr>
            `;
        }
    }


    // =========================================================
    // RENDER TOKEN HISTORY TABLE
    // =========================================================

    function renderTokenHistory(tokens) {

        if (!tokens || tokens.length === 0) {

            tokenHistoryBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4">
                        No token history available.
                    </td>
                </tr>
            `;

            return;
        }


        tokenHistoryBody.innerHTML = "";


        tokens.forEach((token, index) => {

            let statusText = "Waiting";
            let statusClass = "status-waiting";


            if (token.status === "serving") {
                statusText = "Now Serving";
                statusClass = "status-serving";
            }

            else if (token.status === "served") {
                statusText = "Served";
                statusClass = "status-served";
            }

            else if (token.status === "cancelled") {
                statusText = "Cancelled";
                statusClass = "status-waiting";
            }


            const row = document.createElement("tr");


            row.innerHTML = `
                <td>${index + 1}</td>

                <td>
                    <strong>${token.token_number}</strong>
                </td>

                <td>${token.service_name}</td>

                <td>${token.token_date}</td>

                <td>${token.token_time}</td>

                <td>
                    <span class="status-badge ${statusClass}">
                        ${statusText}
                    </span>
                </td>

                <td>
                    <button
                        class="btn btn-sm btn-primary view-token-btn">
                        <i class="bi bi-eye-fill"></i>
                        View
                    </button>
                </td>
            `;


            const viewButton =
                row.querySelector(".view-token-btn");


            viewButton.addEventListener("click", () => {
                viewToken(token);
            });


            tokenHistoryBody.appendChild(row);

        });


        console.log("Token history loaded:", tokens.length);
    }



    // =========================================================
    // VIEW TOKEN DETAILS
    // =========================================================

    function viewToken(token) {

        selectedToken = token;


        document.getElementById("modalTokenNumber").textContent =
            token.token_number || "--";


        document.getElementById("modalService").textContent =
            token.service_name || "--";


        document.getElementById("modalDate").textContent =
            token.token_date || "--";


        document.getElementById("modalTime").textContent =
            token.token_time || "--";


        const modalStatus =
            document.getElementById("modalStatus");


        let statusText = "Waiting";
        let statusClass = "status-waiting";


        if (token.status === "serving") {

            statusText = "Now Serving";
            statusClass = "status-serving";

        }

        else if (token.status === "served") {

            statusText = "Served";
            statusClass = "status-served";

        }

        else if (token.status === "cancelled") {

            statusText = "Cancelled";
            statusClass = "status-waiting";

        }


        modalStatus.textContent = statusText;

        modalStatus.className =
            "status-badge " + statusClass;


        const modalElement =
            document.getElementById("tokenDetailsModal");


        const modal =
            new bootstrap.Modal(modalElement);


        modal.show();
    }



    // =========================================================
    // PROFESSIONAL TOKEN PDF
    // =========================================================

    exportPdfBtn.addEventListener("click", () => {

        if (!selectedToken) {

            alert("Please select a token first.");

            return;
        }


        if (!window.jspdf) {

            alert(
                "PDF library could not be loaded. Please check your internet connection."
            );

            return;
        }


        const { jsPDF } = window.jspdf;

        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a5"
        });


        // -----------------------------------------------------
        // PAGE DIMENSIONS
        // -----------------------------------------------------

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();


        // -----------------------------------------------------
        // OUTER RECEIPT BORDER
        // -----------------------------------------------------

        doc.setLineWidth(0.8);

        doc.rect(
            10,
            10,
            pageWidth - 20,
            pageHeight - 20
        );


        // -----------------------------------------------------
        // HEADER
        // -----------------------------------------------------

        doc.setFont("helvetica", "bold");

        doc.setFontSize(24);

        doc.text(
            "TOKENFLOW",
            pageWidth / 2,
            25,
            {
                align: "center"
            }
        );


        doc.setFont("helvetica", "normal");

        doc.setFontSize(10);

        doc.text(
            "SMART TOKEN GENERATION SYSTEM",
            pageWidth / 2,
            32,
            {
                align: "center"
            }
        );


        // Divider

        doc.setLineWidth(0.4);

        doc.line(
            20,
            38,
            pageWidth - 20,
            38
        );


        // -----------------------------------------------------
        // YOUR TOKEN TEXT
        // -----------------------------------------------------

        doc.setFont("helvetica", "bold");

        doc.setFontSize(11);

        doc.text(
            "YOUR TOKEN NUMBER",
            pageWidth / 2,
            49,
            {
                align: "center"
            }
        );


        // -----------------------------------------------------
        // TOKEN NUMBER BOX
        // -----------------------------------------------------

        doc.setLineWidth(0.8);

        doc.roundedRect(
            35,
            55,
            pageWidth - 70,
            32,
            4,
            4
        );


        doc.setFont("helvetica", "bold");

        doc.setFontSize(30);

        doc.text(
            selectedToken.token_number,
            pageWidth / 2,
            76,
            {
                align: "center"
            }
        );


        // -----------------------------------------------------
        // SERVICE SECTION
        // -----------------------------------------------------

        doc.setFontSize(10);

        doc.setFont("helvetica", "bold");

        doc.text(
            "SERVICE",
            25,
            101
        );


        doc.setFont("helvetica", "normal");

        doc.setFontSize(13);

        doc.text(
            selectedToken.service_name,
            25,
            110
        );


        // -----------------------------------------------------
        // DETAILS BOX
        // -----------------------------------------------------

        doc.setLineWidth(0.4);

        doc.roundedRect(
            20,
            119,
            pageWidth - 40,
            42,
            3,
            3
        );


        // DATE

        doc.setFont("helvetica", "bold");

        doc.setFontSize(9);

        doc.text(
            "DATE",
            27,
            130
        );


        doc.setFont("helvetica", "normal");

        doc.setFontSize(11);

        doc.text(
            selectedToken.token_date,
            27,
            139
        );


        // TIME

        doc.setFont("helvetica", "bold");

        doc.setFontSize(9);

        doc.text(
            "TIME",
            105,
            130
        );


        doc.setFont("helvetica", "normal");

        doc.setFontSize(11);

        doc.text(
            selectedToken.token_time,
            105,
            139
        );


        // -----------------------------------------------------
        // STATUS
        // -----------------------------------------------------

        let statusText = "WAITING";


        if (selectedToken.status === "serving") {
            statusText = "NOW SERVING";
        }

        else if (selectedToken.status === "served") {
            statusText = "SERVED";
        }

        else if (selectedToken.status === "cancelled") {
            statusText = "CANCELLED";
        }


        doc.setFont("helvetica", "bold");

        doc.setFontSize(9);

        doc.text(
            "STATUS",
            27,
            151
        );


        doc.setFontSize(11);

        doc.text(
            "● " + statusText,
            27,
            157
        );


        // -----------------------------------------------------
        // MESSAGE
        // -----------------------------------------------------

        doc.setLineWidth(0.4);

        doc.line(
            20,
            170,
            pageWidth - 20,
            170
        );


        doc.setFont("helvetica", "bold");

        doc.setFontSize(10);

        doc.text(
            "Please wait for your token to be called.",
            pageWidth / 2,
            181,
            {
                align: "center"
            }
        );


        doc.setFont("helvetica", "normal");

        doc.setFontSize(9);

        doc.text(
            "Please keep this token for your reference.",
            pageWidth / 2,
            188,
            {
                align: "center"
            }
        );


        // -----------------------------------------------------
        // FOOTER
        // -----------------------------------------------------

        doc.setLineWidth(0.4);

        doc.line(
            20,
            197,
            pageWidth - 20,
            197
        );


        doc.setFont("helvetica", "bold");

        doc.setFontSize(9);

        doc.text(
            "Thank you for using TokenFlow!",
            pageWidth / 2,
            207,
            {
                align: "center"
            }
        );


        doc.setFont("helvetica", "normal");

        doc.setFontSize(8);

        doc.text(
            "Smart & Efficient Queue Management System",
            pageWidth / 2,
            214,
            {
                align: "center"
            }
        );


        // -----------------------------------------------------
        // TOKEN ID
        // -----------------------------------------------------

        if (selectedToken.id) {

            doc.setFontSize(7);

            doc.text(
                "Token ID: " + selectedToken.id,
                pageWidth / 2,
                222,
                {
                    align: "center"
                }
            );

        }


        // -----------------------------------------------------
        // SAVE PDF
        // -----------------------------------------------------

        doc.save(
            "TokenFlow_" +
            selectedToken.token_number +
            ".pdf"
        );

    });


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    loadTokenHistory();

});