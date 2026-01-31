import puppeteer from "puppeteer";

export async function generatePDF(itineraryData: any): Promise<Buffer> {
  // Launch browser safely in local, server, or Docker
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: puppeteer.executablePath(), // Fix missing Chrome error
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage"
    ]
  });

  try {
    const page = await browser.newPage();

    const html = generateHTMLTemplate(itineraryData);

    await page.setContent(html, {
      waitUntil: "networkidle0"
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "15mm",
        bottom: "20mm",
        left: "15mm"
      }
    });

    return pdf;
  } finally {
    await browser.close();
  }
}

function generateHTMLTemplate(itinerary: any): string {
  const rawBudgetValues: number[] = itinerary.budgetBreakdown
    ? (Object.values(itinerary.budgetBreakdown) as unknown[]).map(
        (v) => Number(v) || 0
      )
    : [];

  const totalBudgetNumber = rawBudgetValues.reduce((sum, v) => sum + v, 0);

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: Arial, sans-serif;
    color: #333;
    padding: 20px;
  }
  .container {
    max-width: 800px;
    margin: auto;
    background: white;
    padding: 40px;
    border: 1px solid #eee;
  }
  .header {
    text-align: center;
    border-bottom: 3px solid #10b981;
    margin-bottom: 20px;
    padding-bottom: 10px;
  }
  .header h1 {
    color: #10b981;
    font-size: 30px;
  }
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .info-item {
    background: #f9fafb;
    padding: 10px;
    border-left: 4px solid #10b981;
  }
  .day-section {
    margin-top: 20px;
    border: 1px solid #ccc;
  }
  .day-header {
    background: #10b981;
    padding: 8px;
    font-weight: bold;
    color: white;
  }
  .activity {
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
  .budget-section {
    margin-top: 20px;
    padding: 10px;
    background: #f3fdf9;
  }
  .budget-item {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    border-bottom: 1px solid #ddd;
  }
  .budget-item:last-child {
    font-weight: bold;
    color: #10b981;
  }
  .footer {
    margin-top: 30px;
    text-align: center;
    border-top: 1px solid #ccc;
    padding-top: 10px;
    font-size: 14px;
  }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${itinerary.title || "Kerala Trip Itinerary"}</h1>
      <p>Your personalized travel plan</p>
    </div>

    <div class="info-grid">
      <div class="info-item">
        <strong>Duration:</strong> ${itinerary.duration || "N/A"} Days
      </div>
      <div class="info-item">
        <strong>Travelers:</strong> ${itinerary.travelers || "N/A"}
      </div>
      <div class="info-item">
        <strong>Budget Range:</strong> ₹${itinerary.budgetEstimate?.min || 0} - ₹${
    itinerary.budgetEstimate?.max || 0
  }
      </div>
      <div class="info-item">
        <strong>Total Cost:</strong> ₹${totalBudgetNumber.toLocaleString()}
      </div>
    </div>

    ${itinerary.aiReason
      ? `
    <div style="background:#fff8db;padding:10px;margin:10px 0;border-left:4px solid #f59e0b">
      <strong>AI Suggestion:</strong><br>
      ${itinerary.aiReason}
    </div>
    `
      : ""}

    ${itinerary.days
      ?.map(
        (day: any) => `
      <div class="day-section">
        <div class="day-header">Day ${day.day}</div>
        ${
          day.activities?.length
            ? day.activities
                .map(
                  (a: any) => `
          <div class="activity">
            <strong>${a.time || ""}</strong> — ${a.name || ""}
            <div>${a.desc || ""}</div>
          </div>
        `
                )
                .join("")
            : "<div class='activity'>No Activities Planned</div>"
        }
      </div>
    `
      )
      .join("") || ""}

    ${
      itinerary.budgetBreakdown
        ? `
    <div class="budget-section">
      <h3>Budget Breakdown</h3>
      <div class="budget-item"><span>Stay</span> <span>₹${Number(
        itinerary.budgetBreakdown.stay || 0
      ).toLocaleString()}</span></div>
      <div class="budget-item"><span>Food</span> <span>₹${Number(
        itinerary.budgetBreakdown.food || 0
      ).toLocaleString()}</span></div>
      <div class="budget-item"><span>Travel</span> <span>₹${Number(
        itinerary.budgetBreakdown.travel || 0
      ).toLocaleString()}</span></div>
      <div class="budget-item"><span>Tickets</span> <span>₹${Number(
        itinerary.budgetBreakdown.tickets || 0
      ).toLocaleString()}</span></div>
      <div class="budget-item"><span>Extras</span> <span>₹${Number(
        itinerary.budgetBreakdown.extras || 0
      ).toLocaleString()}</span></div>
      <div class="budget-item"><span>Total</span> <span>₹${totalBudgetNumber.toLocaleString()}</span></div>
    </div>
    `
        : ""
    }

    <div class="footer">
      Generated by Hey Kerala Travel Platform<br>
      Plan your journey with smart AI
    </div>
  </div>
</body>
</html>
`;
}
