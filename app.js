(() => {
  "use strict";

  // Bamburi Beach Resort 2026/2027 tariff. Rates are KES per room per night.
  const TARIFF = {
    superior: { name: "Superior Ocean View Room", single: [7000, 9000, 10000, 7000, 7000, 7000], double: [9000, 11000, 12000, 9000, 9000, 9000] },
    plunge: { name: "Ocean View With Plunge Pool", single: [10000, 12000, 13000, 10000, 10000, 10000], double: [12000, 14000, 15000, 12000, 12000, 12000] },
    front: { name: "Ocean Front Suite", single: [13000, 15000, 16000, 13000, 13000, 13000], double: [15000, 17000, 18000, 15000, 15000, 15000] },
    breeze: { name: "Ocean Breeze Suite", single: [16000, 18000, 19000, 16000, 16000, 16000], double: [18000, 20000, 21000, 18000, 18000, 18000] }
  };

  const PERIODS = [
    { start: "2026-11-20", end: "2026-12-01", index: 0 },
    { start: "2026-12-02", end: "2026-12-20", index: 1 },
    { start: "2026-12-21", end: "2027-01-03", index: 2 },
    { start: "2027-01-04", end: "2027-04-30", index: 3 },
    { start: "2027-05-01", end: "2027-06-30", index: 4 },
    { start: "2027-07-01", end: "2027-11-19", index: 5 }
  ];

  const money = value => new Intl.NumberFormat("en-KE", {
    style: "currency", currency: "KES", maximumFractionDigits: 0
  }).format(value);
  const $ = id => document.getElementById(id);
  let currentInvoice = null;

  // Traditional typography, restrained colours, resort photo slideshow and contact controls.
  const classicStyles = `
    :root{--ocean:#315b68;--deep:#193d49;--sand:#e8dfd0;--cream:#f7f3eb;--gold:#a98a54;--ink:#292d2d;--muted:#6d706e;--line:#ded8cc;--serif:Georgia,'Times New Roman',serif;--sans:Arial,Helvetica,sans-serif}
    body{font-family:Arial,Helvetica,sans-serif;color:#292d2d;background:#fff;line-height:1.7}
    h1,h2,h3,.brand-mark,.invoice-head h3,.form-title h3{font-family:Georgia,'Times New Roman',serif!important;font-weight:normal!important;letter-spacing:0!important}
    .site-header{background:#fbfaf7;box-shadow:0 2px 10px #172f3510}
    .brand{font-family:Georgia,'Times New Roman',serif;letter-spacing:.08em}
    .brand strong{font-family:Georgia,'Times New Roman',serif;font-weight:normal;letter-spacing:.12em}
    .main-nav{font-family:Arial,Helvetica,sans-serif;font-weight:normal;letter-spacing:.025em}
    .eyebrow,.section-kicker{font-family:Arial,Helvetica,sans-serif;letter-spacing:.16em;font-weight:600}
    .hero{background:none!important;overflow:hidden}
    .hero-slideshow{position:absolute;inset:0;z-index:0;background-position:center;background-size:cover;opacity:1;transition:opacity 1.5s ease}
    .hero-shade{z-index:1;background:linear-gradient(90deg,rgba(16,43,49,.66),rgba(16,43,49,.10) 82%)}
    .hero-content,.hero-caption{z-index:2}
    .hero h1{font-family:Georgia,'Times New Roman',serif!important;font-weight:normal!important;letter-spacing:0!important}
    .hero h1 em,.intro h2 em,.section-heading h2 em,.quote-intro h2 em,.invoice-toolbar h2 em,.meetings-copy h2 em,.contact-section h2 em,.feature-copy h2 em{font-style:italic;color:#d1bd96}
    .intro h2 em,.section-heading h2 em,.meetings-copy h2 em,.contact-section h2 em,.feature-copy h2 em{color:#9c8050}
    .nav-cta,.button-primary{background:#315b68;border-radius:2px}
    .button,.nav-cta{font-family:Arial,Helvetica,sans-serif;font-weight:600;letter-spacing:.02em;border-radius:2px}
    .feature-strip,.meetings-section{background:#f5f1e9}
    .quote-section,.site-footer{background:#193d49}
    .room-card,.dining-card{box-shadow:none;border-color:#ded8cc}
    .room-tag{font-family:Arial,Helvetica,sans-serif;letter-spacing:.04em}
    .quote-form{box-shadow:0 8px 30px #142f3510}
    .floating-contact{position:fixed;right:20px;bottom:22px;z-index:1000;display:flex;flex-direction:column;gap:12px;align-items:center}
    .floating-contact a{width:54px;height:54px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;text-decoration:none;box-shadow:0 5px 18px #102f3540;animation:slowFloat 4.8s ease-in-out infinite;transition:transform .2s,box-shadow .2s}
    .floating-contact a:hover{transform:scale(1.08);box-shadow:0 8px 22px #102f3550}
    .floating-contact a.whatsapp-float{background:#218b59;animation-delay:.25s}
    .floating-contact a.call-float{background:#315b68;animation-delay:0s}
    .floating-contact svg{width:25px;height:25px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
    .floating-contact .wa-mark{font:bold 20px Arial,sans-serif;letter-spacing:-1px}
    @keyframes slowFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
    .child-arrangement-note{font-size:.88rem;color:#6d706e;margin:4px 0 0}
    @media(max-width:700px){.floating-contact{right:14px;bottom:16px;gap:10px}.floating-contact a{width:50px;height:50px}.hero{min-height:590px}}
    @media(prefers-reduced-motion:reduce){.floating-contact a{animation:none}.hero-slideshow{transition:none}}
  `;
  const styleNode = document.createElement("style");
  styleNode.textContent = classicStyles;
  document.head.appendChild(styleNode);

  // Hero slideshow.
  const hero = document.querySelector(".hero");
  if (hero) {
    const slides = [
      "assets/hero/pool-day.webp",
      "assets/hero/pool-evening.webp",
      "assets/hero/ocean-room.webp"
    ];
    const slideLayer = document.createElement("div");
    slideLayer.className = "hero-slideshow";
    slideLayer.setAttribute("aria-hidden", "true");
    hero.prepend(slideLayer);
    let slideIndex = 0;
    slideLayer.style.backgroundImage = `url('${slides[0]}')`;
    window.setInterval(() => {
      slideLayer.style.opacity = "0";
      window.setTimeout(() => {
        slideIndex = (slideIndex + 1) % slides.length;
        slideLayer.style.backgroundImage = `url('${slides[slideIndex]}')`;
        slideLayer.style.opacity = "1";
      }, 850);
    }, 9000);
  }

  // Floating contact buttons.
  const floating = document.createElement("div");
  floating.className = "floating-contact";
  floating.innerHTML = `
    <a class="whatsapp-float" href="https://wa.me/254101956633" target="_blank" rel="noopener" aria-label="Chat with Bamburi Beach Resort on WhatsApp" title="WhatsApp"><span class="wa-mark" aria-hidden="true">WA</span></a>
    <a class="call-float" href="tel:0101956633" aria-label="Call Bamburi Beach Resort" title="Call the resort">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.8 2.1z"/></svg>
    </a>`;
  document.body.appendChild(floating);
  $("year").textContent = new Date().getFullYear();

  // Add a room-sharing selector without requiring an index.html replacement.
  const agesInput = $("childAges");
  const childCountInput = $("childCount");
  const formGrid = agesInput && agesInput.closest(".form-grid");
  if (formGrid && !$("childArrangement")) {
    const arrangementLabel = document.createElement("label");
    arrangementLabel.className = "full";
    arrangementLabel.innerHTML = `
      Children's room arrangement
      <select id="childArrangement">
        <option value="sharing">Children aged 2–12 sharing with parents</option>
        <option value="own">Children occupying their own room(s)</option>
      </select>
      <p class="child-arrangement-note">This selection applies to all children entered above. Teenagers aged 13–17 are charged at the full applicable adult rate.</p>`;
    agesInput.closest("label").insertAdjacentElement("afterend", arrangementLabel);
  }

  $("menuToggle").addEventListener("click", () => {
    const open = $("mainNav").classList.toggle("open");
    $("menuToggle").setAttribute("aria-expanded", String(open));
  });
  document.querySelectorAll("#mainNav a").forEach(link =>
    link.addEventListener("click", () => $("mainNav").classList.remove("open"))
  );

  function dateOnly(value) {
    return new Date(`${value}T12:00:00`);
  }

  function nightsBetween(start, end) {
    return Math.round((dateOnly(end) - dateOnly(start)) / 86400000);
  }

  function periodFor(date) {
    return PERIODS.find(period => date >= period.start && date <= period.end);
  }

  function parseChildAges(count) {
    if (count === 0) return [];
    const raw = $("childAges").value.trim();
    if (!raw) throw new Error("Please enter the age of each child, separated by commas.");
    const ages = raw.split(",").map(value => value.trim()).filter(Boolean).map(Number);
    if (ages.length !== count) {
      throw new Error(`You entered ${count} child(ren), but provided ${ages.length} age(s). Please enter one age for each child.`);
    }
    if (ages.some(age => !Number.isInteger(age) || age < 2 || age > 17)) {
      throw new Error("Please enter whole-number ages from 2 to 17 only. Children under 2 are not included in this child-rate calculation.");
    }
    return ages;
  }

  function addRow(rows, key, description, rate, amount) {
    let row = rows.find(item => item.key === key && item.rate === rate);
    if (!row) {
      row = { key, description, rate, nights: 0, amount: 0 };
      rows.push(row);
    }
    row.nights += 1;
    row.amount += amount;
  }

  function calculateStay(start, end, roomKey, occupancy, rooms, childAges, childArrangement) {
    const nights = nightsBetween(start, end);
    if (nights < 2) throw new Error("The resort tariff requires a minimum stay of 2 nights.");

    let total = 0;
    const rows = [];
    const cursor = dateOnly(start);

    for (let n = 0; n < nights; n++) {
      const iso = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
      const period = periodFor(iso);
      if (!period) throw new Error(`The tariff does not cover ${iso}. Please contact reservations for a quotation.`);

      const tariff = TARIFF[roomKey];
      const adultRate = tariff[occupancy][period.index];
      const adultAmount = adultRate * rooms;
      total += adultAmount;
      addRow(rows, `adult-${occupancy}`, `${tariff.name} — ${occupancy} occupancy × ${rooms} room(s)`, adultRate, adultAmount);

      childAges.forEach((age, childIndex) => {
        let childRate;
        let description;
        let rateBasis;

        if (age >= 13) {
          rateBasis = childArrangement === "own" ? "single" : "double";
          childRate = tariff[rateBasis][period.index];
          description = `Child aged ${age} — full applicable adult rate (${rateBasis} rate)`;
        } else if (childArrangement === "own") {
          rateBasis = "single";
          childRate = Math.round(tariff.single[period.index] * 0.8);
          description = `Child aged ${age} — own room (80% of single rate)`;
        } else {
          rateBasis = "double";
          childRate = Math.round(tariff.double[period.index] * 0.5);
          description = `Child aged ${age} — sharing with parents (50% of double rate)`;
        }

        const childAmount = childRate;
        total += childAmount;
        addRow(rows, `child-${childIndex}-${age}-${rateBasis}`, description, childRate, childAmount);
      });

      cursor.setDate(cursor.getDate() + 1);
    }

    return { nights, total, rows };
  }

  $("checkIn").addEventListener("change", () => {
    const minOut = new Date(dateOnly($("checkIn").value));
    minOut.setDate(minOut.getDate() + 2);
    $("checkOut").min = `${minOut.getFullYear()}-${String(minOut.getMonth() + 1).padStart(2, "0")}-${String(minOut.getDate()).padStart(2, "0")}`;
    if ($("checkOut").value && $("checkOut").value < $("checkOut").min) {
      $("checkOut").value = $("checkOut").min;
    }
  });

  $("quoteForm").addEventListener("submit", event => {
    event.preventDefault();
    try {
      const start = $("checkIn").value;
      const end = $("checkOut").value;
      if (!start || !end || end <= start) {
        throw new Error("Please select valid check-in and check-out dates.");
      }

      const roomKey = $("roomType").value;
      const occupancy = $("occupancy").value;
      const rooms = Number($("roomCount").value);
      const adults = Number($("adultCount").value);
      const children = Number($("childCount").value);

      if (rooms < 1 || adults < 1 || children < 0) {
        throw new Error("Please enter valid guest and room quantities.");
      }

      const childAges = parseChildAges(children);
      const childArrangement = $("childArrangement") ? $("childArrangement").value : "sharing";
      const result = calculateStay(start, end, roomKey, occupancy, rooms, childAges, childArrangement);
      const ref = `BBR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

      currentInvoice = {
        ref,
        name: $("guestName").value.trim(),
        phone: $("guestPhone").value.trim(),
        email: $("guestEmail").value.trim(),
        start,
        end,
        nights: result.nights,
        roomKey,
        roomName: TARIFF[roomKey].name,
        occupancy,
        rooms,
        adults,
        children,
        childAges,
        childArrangement,
        total: result.total,
        rows: result.rows
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
    const fmtDate = value => dateOnly(value).toLocaleDateString("en-KE", {
      day: "numeric", month: "short", year: "numeric"
    });

    const rows = inv.rows.map(row => `
      <tr>
        <td>${escapeHTML(row.description)}</td>
        <td>${money(row.rate)}</td>
        <td>${row.nights}</td>
        <td>${money(row.amount)}</td>
      </tr>`).join("");

    const childSummary = inv.children
      ? `<br>Children: ${inv.children} (${inv.childAges.join(", ")} years)`
      : "";

    const arrangementSummary = inv.children
      ? `<br>Children's arrangement: ${inv.childArrangement === "own" ? "Own room(s) for children aged 2–12" : "Sharing with parents for children aged 2–12"}`
      : "";

    $("invoicePaper").innerHTML = `
      <div class="invoice-head">
        <div>
          <h3>BAMBURI BEACH RESORT</h3>
          <p>P.O. Box 83966, Mombasa 80100, Kenya<br>bamburibeachresort@gmail.com · 0101956633 / 0208237083</p>
        </div>
        <div>
          <strong>PRO-FORMA QUOTATION</strong>
          <p>Reference: ${escapeHTML(inv.ref)}<br>Generated: ${new Date().toLocaleDateString("en-KE")}</p>
        </div>
      </div>
      <div class="invoice-meta">
        <div>
          <strong>PREPARED FOR</strong><br>${escapeHTML(inv.name)}<br>${escapeHTML(inv.phone)}<br>${escapeHTML(inv.email || "Email not provided")}
        </div>
        <div>
          <strong>STAY DETAILS</strong><br>
          Check-in: ${fmtDate(inv.start)}<br>
          Check-out: ${fmtDate(inv.end)}<br>
          Duration: ${inv.nights} nights<br>
          Guests: ${inv.adults} adult(s)${childSummary}${arrangementSummary}
        </div>
      </div>
      <table class="invoice-table">
        <thead><tr><th>Description</th><th>Rate / night</th><th>Nights</th><th>Amount</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="invoice-total">TOTAL QUOTED: ${money(inv.total)}</div>
      <p><strong>Payment terms:</strong> Full payment in advance, subject to availability confirmation by the resort.</p>
      <p><strong>Minimum stay:</strong> 2 nights. <strong>Rates:</strong> All Inclusive, as per the 2026/2027 tariff.</p>
      <p><strong>Child rates:</strong> Ages 2–12 sharing with parents are charged at 50% of the double rate; ages 2–12 in their own room are charged at 80% of the single rate; ages 13–17 are charged at the full applicable adult rate.</p>
      <p><strong>IMPORTANT:</strong> This is a quotation only and does not confirm or reserve accommodation. Room availability must be checked and confirmed by the reservations team before payment.</p>`;
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]));
  }

  $("printInvoice").addEventListener("click", () => window.print());

  $("shareInvoice").addEventListener("click", () => {
    if (!currentInvoice) return;
    const inv = currentInvoice;
    const message = `Hello Bamburi Beach Resort Reservations,

I would like to enquire about availability for the quotation details below.

Quotation reference: ${inv.ref}
Name: ${inv.name}
Room: ${inv.roomName}
Occupancy: ${inv.occupancy}
Rooms: ${inv.rooms}
Adults: ${inv.adults}
Children: ${inv.children}${inv.children ? ` (ages: ${inv.childAges.join(", ")})` : ""}
Children's arrangement: ${inv.children ? (inv.childArrangement === "own" ? "Own room(s) for children aged 2–12" : "Sharing with parents for children aged 2–12") : "Not applicable"}
Check-in: ${inv.start}
Check-out: ${inv.end}
Nights: ${inv.nights}
Quoted total: ${money(inv.total)}

Kindly confirm availability and advise on the next steps. Thank you.`;

    window.open(`https://wa.me/254101956633?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  });
})();