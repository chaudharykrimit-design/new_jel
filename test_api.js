const fetch = require("node-fetch") || global.fetch;

async function test() {
  try {
    // Login
    const loginRes = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@aurumjewels.com", password: "admin123" })
    });
    const loginData = await loginRes.json();
    console.log("Login Status:", loginRes.status);
    console.log("Login Data:", loginData);

    if (!loginData.token) return;

    // Fetch dashboard
    const dashRes = await fetch("http://localhost:3001/api/admin/dashboard", {
      headers: {
        "Authorization": "Bearer " + loginData.token
      }
    });
    const dashText = await dashRes.text();
    console.log("Dashboard Status:", dashRes.status);
    console.log("Dashboard Info:", dashText);

    // Fetch orders to test order creation
    const orderRes = await fetch("http://localhost:3001/api/orders", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [{ id: "test", name: "Test" }],
        contactInfo: { name: "Test", phone: "123" }
      })
    });
    const orderText = await orderRes.text();
    console.log("Order Status:", orderRes.status);
    console.log("Order Info:", orderText);

  } catch (err) {
    console.error(err);
  }
}
test();
