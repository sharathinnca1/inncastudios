// Mobile menu
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Footer year
const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

// Lead capture
const WHATSAPP_NUMBER = "916364464692"; // no + sign
const SHEET_WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycby1fge-Q5GIPD7uRqRf3bTokLaDqGv_yDIDib8U5N_nHuqjLDzn0W2Lwt70jxlaT9DdZw/exec";

const enquiryForm = document.getElementById("enquiryForm");
const waBtn = document.getElementById("whatsAppBtn");

function openWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
}

async function sendToGoogleSheet(payload) {
  // Apps Script doPost reads form-url-encoded data as e.parameter
  const body = new URLSearchParams(payload);

  // "no-cors" avoids browser CORS errors for Apps Script webapps.
  // You won't be able to read the response, but the row will still be added.
  await fetch(SHEET_WEBAPP_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    body
  });
}

if (waBtn) {
  waBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openWhatsApp("Hi Innca Studio, I would like a quotation for interiors.");
  });
}

if (enquiryForm) {
  enquiryForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(enquiryForm);
    const propertyType = String(data.get("propertyType") || "").trim();
    const interest = String(data.get("interest") || "").trim();
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const city = String(data.get("city") || "").trim();

    if (!propertyType || !interest || !name || !phone) {
      alert("Please fill all required fields.");
      return;
    }

    // 1) Send to Google Sheet first
    try {
      await sendToGoogleSheet({
        propertyType,
        interest,
        name,
        phone,
        city,
        // optional honeypot field (safe even if you didn't add it in HTML)
        website: ""
      });
    } catch (err) {
      // Even if sheet fails, WhatsApp should still open
      console.log("Sheet write failed:", err);
    }

    // 2) Continue WhatsApp flow
    const msg =
      `Hi Innca Studio,\n` +
      `I would like a callback.\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `City: ${city || "-"}\n` +
      `Property Type: ${propertyType}\n` +
      `Interested In: ${interest}\n`;

    openWhatsApp(msg);
  });
}

// Journey steps (tab switch)
const steps = [
  {
    title: "Consultation and planning",
    text: "Share your floor plan and requirements. We align on scope, budget range, and feasibility before design goes deep.",
    img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80"
  },
  {
    title: "3D design and material lock",
    text: "We finalize layout, look, and materials. Once locked, changes impact time and cost, so this step matters.",
    img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80"
  },
  {
    title: "Drawings, quote, and approvals",
    text: "Production drawings and final quotation are prepared with exact specifications so the factory output matches the approved design.",
    img: "https://images.unsplash.com/photo-1582582429416-9ff0a55a93c6?auto=format&fit=crop&w=1400&q=80"
  },
  {
    title: "Production, installation, handover",
    text: "Manufacturing with QC checkpoints, planned dispatch, and on-site installation with snag closure and handover.",
    img: "https://images.unsplash.com/photo-1523413307857-ef24c53571ee?auto=format&fit=crop&w=1400&q=80"
  }
];

const tabs = document.querySelectorAll(".tab");
const jTitle = document.getElementById("journeyTitle");
const jText = document.getElementById("journeyText");
const jImg = document.getElementById("journeyImg");

function setStep(idx) {
  const s = steps[idx];
  if (!s) return;

  if (jTitle) jTitle.textContent = s.title;
  if (jText) jText.textContent = s.text;
  if (jImg) jImg.src = s.img;

  tabs.forEach((t, i) => {
    const active = i === idx;
    t.classList.toggle("active", active);
    t.setAttribute("aria-selected", String(active));
  });
}

tabs.forEach((t) => {
  t.addEventListener("click", () => {
    const step = Number(t.getAttribute("data-step"));
    setStep(Math.max(0, Math.min(3, step - 1)));
  });
});

// Gallery carousel buttons
const track = document.getElementById("galleryTrack");
document.querySelectorAll(".car-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!track) return;
    const dir = btn.getAttribute("data-scroll");
    const amount = 340;
    track.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  });
});

// Review read more (simple toggle)
document.querySelectorAll("[data-readmore]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".review");
    const p = card ? card.querySelector(".review-text") : null;
    if (!p) return;

    const collapsed = p.getAttribute("data-collapsed") === "true";
    p.setAttribute("data-collapsed", String(!collapsed));

    if (collapsed) {
      p.style.maxHeight = "none";
      btn.textContent = "Show less";
    } else {
      p.style.maxHeight = "";
      btn.textContent = "Read more";
    }
  });
});
