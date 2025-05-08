export function generateSummaryReport(
  data,
  timestamp,
  filename,
  stages,
  maxDuration
) {
  const vus = data.metrics.vus_max.values.value;
  const duration = maxDuration;
  const totalRequests = data.metrics.http_reqs.values.count;
  const failedRequests = data.metrics.http_req_failed.values.passes;
  const passedChecks = data.metrics.checks.values.passes;
  const failedChecks = data.metrics.checks.values.fails;
  const avgResponseTime = data.metrics.http_req_duration.values.avg.toFixed(2);
  const maxResponseTime = data.metrics.http_req_duration.values.max.toFixed(2);
  const minResponseTime = data.metrics.http_req_duration.values.min.toFixed(2);

  let timeStamps = [];
  let vuCounts = [];
  let elapsedTime = 0;
  let prevTarget = 0;

  stages.forEach((stage) => {
    let duration = parseInt(stage.duration.replace("s", ""), 10);
    let targetVUs = stage.target;

    for (let i = 0; i < duration; i++) {
      let interpolatedVU =
        prevTarget + ((targetVUs - prevTarget) * i) / duration;
      timeStamps.push(elapsedTime + i);
      vuCounts.push(Math.round(interpolatedVU));
    }

    elapsedTime += duration;
    prevTarget = targetVUs;
  });

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>K6 Test Summary</title>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; padding: 20px; }
        h1 { color: #2c3e50; }
        .chart-container { width: 100%; max-width: 800px; margin: 20px auto; }
        #searchInput, #rowsPerPageSelect { margin-bottom: 10px; padding: 5px; }
        #searchInput { width: 100%; max-width: 300px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; cursor: pointer; }
        th { background-color: #3498db; color: white; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        .failed-row { background-color: #ffcccc !important; }
        #pagination { margin-top: 10px; }
      </style>
    </head>
    <body>
      <h1>K6 Performance Test Summary</h1>
      <p><strong>Generated on:</strong> ${timestamp}</p>

      <h2>Overall Results</h2>
      <table>
        <tr><th>Metric</th><th>Value</th></tr>
        <tr><td>Total Requests</td><td>${totalRequests}</td></tr>
        <tr><td>Max VUs</td><td>${vus}</td></tr>
        <tr><td>Duration (s)</td><td>${duration}</td></tr>
        <tr><td>Failed Requests</td><td>${failedRequests}</td></tr>
        <tr><td>Passed Checks</td><td>${passedChecks}</td></tr>
        <tr><td>Failed Checks</td><td>${failedChecks}</td></tr>
        <tr><td>Avg Response Time (ms)</td><td>${avgResponseTime}</td></tr>
        <tr><td>Max Response Time (ms)</td><td>${maxResponseTime}</td></tr>
        <tr><td>Min Response Time (ms)</td><td>${minResponseTime}</td></tr>
      </table>

      <h2>Endpoint Checks</h2>
      <input type="text" id="searchInput" placeholder="Search endpoint..." onkeyup="filterTable()">
      <label for="rowsPerPageSelect">Rows per page:</label>
      <select id="rowsPerPageSelect" onchange="changeRowsPerPage()">
        <option value="5">5</option>
        <option value="10" selected>10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>

      <table id="checksTable">
        <thead>
          <tr>
            <th onclick="sortTable(0)">Endpoint ▲▼</th>
            <th onclick="sortTable(1)">Check ▲▼</th>
            <th onclick="sortTable(2)">Passes ▲▼</th>
            <th onclick="sortTable(3)">Fails ▲▼</th>
          </tr>
        </thead>
        <tbody>
          ${data.root_group.groups
            .map((group) =>
              group.checks
                .map(
                  (check) => `
              <tr class="${check.fails > 0 ? "failed-row" : ""}">
                <td>${group.name}</td>
                <td>${check.name}</td>
                <td>${check.passes}</td>
                <td>${check.fails}</td>
              </tr>
            `
                )
                .join("")
            )
            .join("")}
        </tbody>
      </table>

      <div id="pagination">
        <button onclick="prevPage()">Prev</button>
        <span id="pageNumber">Page 1</span>
        <button onclick="nextPage()">Next</button>
      </div>

      <h2>Graphs</h2>
      <div class="chart-container">
        <canvas id="vusChart"></canvas>
      </div>

      <script>
        let currentPage = 1;
        let rowsPerPage = parseInt(document.getElementById("rowsPerPageSelect")?.value || 10, 10);
        const table = document.getElementById("checksTable");
        const tbody = table.getElementsByTagName("tbody")[0];
        const rows = Array.from(tbody.getElementsByTagName("tr"));

        function showPage(page) {
          const start = (page - 1) * rowsPerPage;
          const end = start + rowsPerPage;
          rows.forEach((row, index) => {
            row.style.display = index >= start && index < end ? "" : "none";
          });
          document.getElementById("pageNumber").innerText = "Page " + page;
        }

        function nextPage() {
          if (currentPage * rowsPerPage < rows.length) {
            currentPage++;
            showPage(currentPage);
          }
        }

        function prevPage() {
          if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
          }
        }

        function changeRowsPerPage() {
          rowsPerPage = parseInt(document.getElementById("rowsPerPageSelect").value, 10);
          currentPage = 1;
          showPage(currentPage);
        }

        function sortTable(columnIndex) {
          const sortedRows = [...rows].sort((a, b) => {
            let valA = a.cells[columnIndex].innerText.toLowerCase();
            let valB = b.cells[columnIndex].innerText.toLowerCase();
            return isNaN(valA) || isNaN(valB)
              ? valA.localeCompare(valB)
              : parseFloat(valA) - parseFloat(valB);
          });
          tbody.innerHTML = "";
          sortedRows.forEach((row) => tbody.appendChild(row));
          showPage(1);
        }

        function filterTable() {
          const filter = document.getElementById("searchInput").value.toLowerCase();
          rows.forEach((row) => {
            const endpoint = row.cells[0].innerText.toLowerCase();
            row.style.display = endpoint.includes(filter) ? "" : "none";
          });
        }

        showPage(1);

        const timestamps = ${JSON.stringify(timeStamps)};
        const vuCounts = ${JSON.stringify(vuCounts)};

        new Chart(document.getElementById('vusChart').getContext('2d'), {
          type: 'line',
          data: {
            labels: timestamps,
            datasets: [{
              label: 'Virtual Users Over Time',
              data: vuCounts,
              borderColor: 'blue',
              fill: false
            }]
          },
          options: {
            responsive: true,
            scales: {
              x: { title: { display: true, text: 'Time (s)' }},
              y: { title: { display: true, text: 'Virtual Users' }}
            }
          }
        });
      </script>

      <p><strong>Report saved as:</strong> ${filename}</p>
    </body>
    </html>
  `;

  return html;
}
