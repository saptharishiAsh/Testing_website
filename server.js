const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.PORT || 8000);
const ROOT = __dirname;
const RESEND_API_URL = "https://api.resend.com/emails";

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end(JSON.stringify(payload));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 100000) reject(new Error("Request body too large"));
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    request.on("error", reject);
  });
}

async function sendWithResend(order) {
  if (!process.env.RESEND_API_KEY) {
    return { provider: "mock", status: "queued" };
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "Rishi Mart <onboarding@resend.dev>",
      to: [order.to],
      subject: order.subject,
      text: `Thanks for your order.\n\nOrder number: ${order.orderNumber}\nTotal: ${order.amount}\nStatus: Paid`,
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || `Resend returned ${response.status}`);
  }

  return { provider: "resend", status: "sent", id: result.id };
}

async function handleRequest(request, response) {
  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    });
    response.end();
    return;
  }

  if (request.method === "GET" && request.url === "/api/health") {
    sendJson(response, 200, {
      service: "rishi-mart-email-api",
      emailProvider: process.env.RESEND_API_KEY ? "resend" : "mock",
      status: "ok",
    });
    return;
  }

  if (request.method === "POST" && request.url === "/api/send-order-email") {
    try {
      const order = await readJson(request);
      if (!order.to || !order.orderNumber || !order.subject) {
        sendJson(response, 400, { error: "to, orderNumber and subject are required" });
        return;
      }
      const delivery = await sendWithResend(order);
      sendJson(response, 200, { ok: true, ...delivery });
    } catch (error) {
      sendJson(response, 502, { ok: false, error: error.message });
    }
    return;
  }

  if (request.method !== "GET") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  const requestedPath = new URL(request.url, `http://${request.headers.host}`).pathname;
  const filePath = path.resolve(ROOT, requestedPath === "/" ? "index.html" : `.${requestedPath}`);
  if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    sendJson(response, 404, { error: "Not found" });
    return;
  }

  const contentTypes = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
  response.writeHead(200, { "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(response);
}

http.createServer((request, response) => {
  handleRequest(request, response).catch((error) => sendJson(response, 500, { error: error.message }));
}).listen(PORT, () => {
  console.log(`Rishi Mart server running at http://localhost:${PORT}`);
  console.log(`Email provider: ${process.env.RESEND_API_KEY ? "Resend" : "local mock"}`);
});
