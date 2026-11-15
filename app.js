(() => {
  "use strict";

  // Published Bamburi Beach Resort 2026/2027 tariff. Rates are KES per room per night.
  const TARIFF = {
    superior: { name: "Superior Ocean View Room", single: [7000, 9000, 10000, 7000, 7000, 7000], double: [9000, 11000, 12000, 9000, 9000, 9000] },
    plunge:   { name: "Ocean View With Plunge Pool", single: [10000, 12000, 13000, 10000, 10000, 10000], double: [12000, 14000, 15000, 12000, 12000, 12000] },
    front:    { name: "Ocean Front Suite", single: [13000, 15000, 16000, 13000, 13000, 13000], double: [15000, 17000, 18000, 15000, 15000, 15000] },
    breeze:   { name: "Ocean Breeze Suite", single: [16000, 18000, 19000, 16000, 16000, 16000], double: [18000, 20000, 21000, 18000, 18000, 18000] }
  };
  const PERIODS = [
    { start: "2026-11-20", end: "2026-12-01", index: 0 },
    { start: "2026-12-02", end: "2026-12-20", index: 1 },
    { start: "2026-12-21", end: "2027-01-03", index: 2 },
    { start: "2027-01-04", end: "2027-04-30", index: 3 },
    { start: "2027-05-01", end: "2027-06-30", index: 4 },
    { start: "2027-07-01", end: "2027-11-19", index: 5 }
  ];
  const money = value => new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(value);
  const $ = id => document.getElementById(id);
  let currentInvoice = null;

  $("year").textContent = new Date().getFullYear();
  $("menuToggle").addEventListener("click", () => {
    const open = $("mainNav").classList.toggle("open");
    $("menuToggle").setAttribute("aria-expanded", String(open));
  });
  document.querySelectorAll("#mainNav a").forEach(link => link.addEventListener("click", () => $("mainNav").classList.remove("open")));

  function dateOnly(value) { return new Date(`${value}T12:00:00`); }
  function nightsBetween(start, end) { return Math.round((dateOnly(end) - dateOnly(start)) / 86400000); }
  function periodFor(date) {
    return PERIODS.find(p => date >= p.start && date <= p.end);
  }
  function calculateStay(start, end, roomKey, occupancy, rooms) {
    const nights = nightsBetween(start, end);
    if (nights < 2) throw new Error("The resort tariff requires a minimum stay of 2 nights.");
    let total = 0, rows = [], cursor = dateOnly(start);
    for (let n = 0; n < nights; n++) {
      const iso = `${cursor.getFullYear()}-${String(cursor.getMonth()+1).padStart(2,"0")}-${String(cursor.getDate()).padStart(2,"0")}`;
      const period = periodFor(iso);
      if (!period) throw new Error(`The tariff does not cover ${iso}. Please contact reservations for a quotation.`);
      const rate = TARIFF[roomKey][occupancy][period.index];
      total += rate * rooms;
      const last = rows[rows.length - 1];
      if (last && last.rate === rate) { last.nights += 1; last.amount += rate * rooms; }
      else rows.push({ period: `${iso}`, rate, nights: 1, amount: rate * rooms });
      cursor.setDate(cursor.getDate() + 1);
    }
    return { nights, total, rows };
  }

  $("checkIn").addEventListener("change", () => {
    const minOut = new Date(dateOnly($("checkIn").value));
    minOut.setDate(minOut.getDate() + 2);
    $("checkOut").min = `${minOut.getFullYear()}-${String(minOut.getMonth()+1).padStart(2,"0")}-${String(minOut.getDate()).padStart(2,"0")}`;
    if ($("checkOut").value && $("checkOut").value < $("checkOut").min) $("checkOut").value = $("checkOut").min;
  });

  $("quoteForm").addEventListener("submit", event => {
    event.preventDefault();
    try {
      const start = $("checkIn").value, end = $("checkOut").value;
      if (!start || !end || end <= start) throw new Error("Please select valid check-in and check-out dates.");
      const roomKey = $("roomType").value;
      const occupancy = $("occupancy").value;
      const rooms = Number($("roomCount").value);
      const adults = Number($("adultCount").value);
      const children = Number($("childCount").value);
      if (rooms < 1 || adults < 1 || children < 0) throw new Error("Please enter valid guest and room quantities.");
      if (children > 0) throw new Error("Children's rates depend on the applicable adult rate and room-sharing arrangement. Please contact reservations so we can avoid calculating an incorrect total. The child details have not been added to this quotation.");
      const result = calculateStay(start, end, roomKey, occupancy, rooms);
      const ref = `BBR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      currentInvoice = {
        ref, name: $("guestName").value.trim(), phone: $("guestPhone").value.trim(), email: $("guestEmail").value.trim(),
        start, end, nights: result.nights, roomKey, roomName: TARIFF[roomKey].name, occupancy, rooms, adults,
        total: result.total, rows: result.rows
      };
      renderInvoice(currentInvoice);
      $("invoiceSection").classList.remove("hidden");
      $("shareInvoice").disabled = false;
      $("invoiceSection").scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      alert(error.message);
    }
  });

  function renderInvoice(inv) {
    const fmtDate = value => dateOnly(value).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
    const rows = inv.rows.map(row => `<tr><td>${inv.roomName}<br><small>${row.nights} night(s) · ${inv.occupancy} occupancy · ${inv.rooms} room(s)</small></td><td>${money(row.rate)}</td><td>${row.nights}</td><td>${money(row.amount)}</td></tr>`).join("");
    $("invoicePaper").innerHTML = `
      <div class="invoice-head"><div><h3>BAMBURI BEACH RESORT</h3><p>P.O. Box 83966, Mombasa 80100, Kenya<br>bamburibeachresort@gmail.com · 0101956633 / 0208237083</p></div><div><strong>PRO-FORMA QUOTATION</strong><p>Reference: ${inv.ref}<br>Generated: ${new Date().toLocaleDateString("en-KE")}</p></div></div>
      <div class="invoice-meta"><div><strong>PREPARED FOR</strong><br>${escapeHTML(inv.name)}<br>${escapeHTML(inv.phone)}<br>${escapeHTML(inv.email || "Email not provided")}</div><div><strong>STAY DETAILS</strong><br>Check-in: ${fmtDate(inv.start)}<br>Check-out: ${fmtDate(inv.end)}<br>Duration: ${inv.nights} nights<br>Guests: ${inv.adults} adult(s)</div></div>
      <table class="invoice-table"><thead><tr><th>Description</th><th>Rate / night</th><th>Nights</th><th>Amount</th></tr></thead><tbody>${rows}</tbody></table>
      <div class="invoice-total">TOTAL QUOTED: ${money(inv.total)}</div>
      <p><strong>Payment terms:</strong> Full payment in advance, subject to availability confirmation by the resort.</p>
      <p><strong>Minimum stay:</strong> 2 nights. <strong>Rates:</strong> All Inclusive, as per the 2026/2027 tariff.</p>
      <p><strong>IMPORTANT:</strong> This is a quotation only and does not confirm or reserve accommodation. Room availability must be checked and confirmed by the reservations team before payment.</p>`;
  }
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
  }
  $("printInvoice").addEventListener("click", () => window.print());
  $("shareInvoice").addEventListener("click", () => {
    if (!currentInvoice) return;
    const inv = currentInvoice;
    const message = `Hello Bamburi Beach Resort Reservations,\n\nI would like to enquire about availability for the attached quotation details.\n\nQuotation reference: ${inv.ref}\nName: ${inv.name}\nRoom: ${inv.roomName}\nOccupancy: ${inv.occupancy}\nRooms: ${inv.rooms}\nCheck-in: ${inv.start}\nCheck-out: ${inv.end}\nNights: ${inv.nights}\nQuoted total: ${money(inv.total)}\n\nKindly confirm availability and advise on the next steps. Thank you.`;
    // The GitHub Pages prototype shares the quotation summary. A hosted invoice URL/PDF will be added with the secure backend stage.
    window.open(`https://wa.me/254101956633?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  });
})();