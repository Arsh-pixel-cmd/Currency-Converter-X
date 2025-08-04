const countryList = {
  USD: "US", EUR: "EU", GBP: "GB", INR: "IN", AUD: "AU", CAD: "CA", JPY: "JP", CNY: "CN",
  CHF: "CH", SEK: "SE", NZD: "NZ", ZAR: "ZA", RUB: "RU", SGD: "SG", MXN: "MX", BRL: "BR",
  HKD: "HK", NOK: "NO", KRW: "KR", TRY: "TR", DKK: "DK", PLN: "PL", HUF: "HU", CZK: "CZ",
  MYR: "MY", THB: "TH", IDR: "ID", PHP: "PH", ILS: "IL", RON: "RO"
};

const currencySymbols = {
  USD: "$", INR: "₹", EUR: "€", GBP: "£", JPY: "¥", CNY: "¥",
  AUD: "A$", CAD: "C$", KRW: "₩", RUB: "₽", MXN: "Mex$", BRL: "R$",
  SGD: "S$", MYR: "RM", PHP: "₱", ZAR: "R", IDR: "Rp", ILS: "₪",
  THB: "฿", PLN: "zł"
};

const dropdownSelects = document.querySelectorAll(".dropdown select");
const fromSelect = document.querySelector(".from select");
const toSelect = document.querySelector(".to select");
const amountInput = document.querySelector(".amount input");
const messageDiv = document.querySelector(".msg");

// Populate dropdowns
for (let select of dropdownSelects) {
  for (let code in countryList) {
    const option = document.createElement("option");
    option.value = code;
    option.innerText = code;
    if (select.name === "from" && code === "USD") option.selected = true;
    if (select.name === "to" && code === "INR") option.selected = true;
    select.appendChild(option);
  }

  select.addEventListener("change", (e) => {
    const currCode = e.target.value;
    const flagImg = e.target.parentElement.querySelector("img");
    flagImg.src = `https://flagsapi.com/${countryList[currCode]}/flat/64.png`;
  });
}

// Theme switch
document.getElementById("theme-switch").addEventListener("change", (e) => {
  document.body.classList.toggle("light-mode", e.target.checked);
});

// Conversion logic
document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  let amount = Number(amountInput.value);
  if (!amount || amount < 0) {
    amount = 1;
    amountInput.value = "1";
  }

  const from = fromSelect.value;
  const to = toSelect.value;
  const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const rate = data.rates[to];

    if (!rate) {
      messageDiv.innerText = "❌ Currency not supported!";
      return;
    }

    const fromSymbol = currencySymbols[from] || from;
    const toSymbol = currencySymbols[to] || to;
    messageDiv.innerText = `${fromSymbol}${amount} ${from} = ${toSymbol}${(amount * rate).toFixed(2)} ${to}`;

    const sound = document.getElementById("success-sound");
    if (sound) sound.play().catch(() => {});
  } catch {
    messageDiv.innerText = "⚠️ Failed to fetch exchange rate.";
  }
});

// Load flags on page load
window.addEventListener("DOMContentLoaded", () => {
  const fromImg = document.querySelector(".from img");
  const toImg = document.querySelector(".to img");
  fromImg.src = `https://flagsapi.com/${countryList[fromSelect.value]}/flat/64.png`;
  toImg.src = `https://flagsapi.com/${countryList[toSelect.value]}/flat/64.png`;
});
