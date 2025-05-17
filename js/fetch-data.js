let airport = "LYBE"
document.addEventListener("DOMContentLoaded", function () {
            const metarUrl = "https://metar.vatsim.net/" + airport;
            const atcUrl = "https://data.vatsim.net/v3/vatsim-data.json";

            const metarContainer = document.querySelector(".col-sm-4:first-child");
            const atcContainer = document.querySelector(".col-sm-4:nth-child(2)");

            function fetchAndUpdateData() {
                fetch(atcUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Network response was not ok");
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Clear previous content
                        atcContainer.innerHTML = "<h1>Current active ATC</h1>";

                        // Separate ATC and ATIS data
                        const atcData = data.controllers.filter(controller => controller.callsign.startsWith(airport+"_") && controller.callsign || controller.callsign.startsWith("ADR_E_") );
                        const atisData = data.atis.find(controller => controller.callsign === airport + "_ATIS");

                        // Extract ATIS code from /ATIS/XX
                        const atisCode = atisData && data.atis.find(controller => controller.callsign === airport + "_ATIS")
                            ? atisData.atis_code
                            : "N/A";

                        document.getElementById('atiscode').textContent = atisCode;

                        // Create ATC table
                        const atcTable = document.createElement("table");
                        atcTable.className = "table table-dark table-striped mt-3";

                        // Create ATC table header
                        const atcThead = document.createElement("thead");
                        atcThead.innerHTML = `
                            <tr>
                                <th>Callsign</th>
                                <th>Frequency</th>
                            </tr>
                        `;
                        atcTable.appendChild(atcThead);

                        // Create ATC table body
                        const atcTbody = document.createElement("tbody");
                        atcData.forEach(atc => {
                            const row = document.createElement("tr");
                            row.innerHTML = `
                                <td>${atc.callsign}</td>
                                <td>${atc.frequency}</td>
                            `;
                            atcTbody.appendChild(row);
                        });
                        atcTable.appendChild(atcTbody);

                        // Append ATC table to the container
                        atcContainer.appendChild(atcTable);

                        // Create arrivals and departures tables using IDs
                        const departuresContainer = document.getElementById("departures-container");
                        const arrivalsContainer = document.getElementById("arrivals-container");

                        // Clear previous content in the containers
                        departuresContainer.innerHTML = "<h2>Departures</h2>";
                        arrivalsContainer.innerHTML = "<h2>Arrivals</h2>";

                        const departuresTable = document.createElement("table");
                        departuresTable.className = "table table-dark table-striped mt-3";

                        const arrivalsTable = document.createElement("table");
                        arrivalsTable.className = "table table-dark table-striped mt-3";

                        // Create departures table header
                        const departuresThead = document.createElement("thead");
                        departuresThead.innerHTML = `
                            <tr>
                                <th>Callsign</th>
                                <th>Departure</th>
                                <th>Arrival</th>
                                <th>Altitude</th>
                                <th>Speed</th>
                                <th>Status</th>
                            </tr>
                        `;
                        departuresTable.appendChild(departuresThead);

                        // Create arrivals table header
                        const arrivalsThead = document.createElement("thead");
                        arrivalsThead.innerHTML = `
                            <tr>
                                <th>Callsign</th>
                                <th>Departure</th>
                                <th>Arrival</th>
                                <th>Altitude</th>
                                <th>Speed</th>
                                <th>Status</th>
                            </tr>
                        `;
                        arrivalsTable.appendChild(arrivalsThead);

                        // Create table bodies
                        const departuresTbody = document.createElement("tbody");
                        const arrivalsTbody = document.createElement("tbody");

                        const flightsData = data.pilots.filter(pilot => pilot.flight_plan);

                        flightsData.forEach(flight => {
                            const row = document.createElement("tr");
                            const status = flight.groundspeed > 130 ? "In Air" : "On Ground";
                            row.innerHTML = `
                                <td>${flight.callsign}</td>
                                <td>${flight.flight_plan.departure}</td>
                                <td>${flight.flight_plan.arrival}</td>
                                <td>${flight.altitude} ft</td>
                                <td>${flight.groundspeed} kts</td>
                                <td>${status}</td>
                            `;

                            if (flight.flight_plan.departure === airport) {
                                departuresTbody.appendChild(row);
                            } else if (flight.flight_plan.arrival === airport) {
                                arrivalsTbody.appendChild(row);
                            }
                        });

                        departuresTable.appendChild(departuresTbody);
                        arrivalsTable.appendChild(arrivalsTbody);

                        // Append tables to their respective containers
                        departuresContainer.appendChild(departuresTable);
                        arrivalsContainer.appendChild(arrivalsTable);
                    })
                    .catch(error => {
                        console.error("Error fetching data:", error);
                        const errorElement = document.createElement("p");
                        errorElement.textContent = "Failed to load data.";
                        errorElement.style.color = "red";
                        atcContainer.appendChild(errorElement);
                    });
            }

            // Fetch METAR data
            fetch(metarUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.text();
                })
                .then(data => {
                    const metarElement = document.createElement("p");
                    metarElement.textContent = data;
                    metarElement.style.fontFamily = "'Source Code Pro'";
                    metarElement.style.fontWeight = "500";
                    metarContainer.appendChild(metarElement);
                })
                .catch(error => {
                    console.error("Error fetching METAR data:", error);
                    const errorElement = document.createElement("p");
                    errorElement.textContent = "Failed to load METAR data.";
                    errorElement.style.color = "red";
                    metarContainer.appendChild(errorElement);
                });

            // Fetch data initially
            fetchAndUpdateData();

            // Set interval to update data every 60 seconds
            setInterval(fetchAndUpdateData, 60000);
        });