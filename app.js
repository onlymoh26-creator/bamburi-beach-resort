(() => {
  const $ = id => document.getElementById(id);
  const money = value => "KES " + Number(value).toLocaleString("en-KE");
  let currentInvoice = null;

  const PERIODS = [
    {start:"2026-11-20",end:"2026-12-01",index:0},
    {start:"2026-12-02",end:"2026-12-20",index:1},
    {start:"2026-12-21",end:"2027-01-03",index:2},
    {start:"2027-01-04",end:"2027-04-30",index:3},
    {start:"2027-05-01",end:"2027-06-30",index:4},
    {start:"2027-07-01",end:"2027-11-19",index:5}
  ];

  const TARIFF = {
    superior: {
      name:"Superior Ocean View Room",
      single:[7000,9000,10000,7000,7000,7000],
      double:[9000,11000,12000,9000,9000,9000]
    },
    plunge: {
      name:"Ocean View With Plunge Pool",
      single:[10000,12000,13000,10000,10000,10000],
      double:[12000,14000,15000,12000,12000,12000]
    },
    front: {
      name:"Ocean Front Suite",
      single:[13000,15000,16000,13000,13000,13000],
      double:[15000,17000,18000,15000,15000,15000]
    },
    breeze: {
      name:"Ocean Breeze Suite",
      single:[16000,18000,19000,16000,16000,16000],
      double:[18000,20000,21000,18000,18000,18000]
    }
  };

  // Current year in the footer.
  if ($("year")) $("year").textContent = new Date().getFullYear();

  // Hero background slideshow.
  const hero = document.querySelector(".hero");
  if (hero) {
    const slides = [
      "images/hero-1.jpg",
      "images/hero-2.jpg",
      "images/hero-3.jpg"
    ];

    const slideshow = document.createElement("div");
    slideshow.className = "hero-slideshow";
    hero.insertBefore(slideshow, hero.firstChild);

    let slideIndex = 0;
    slideshow.style.backgroundImage = `url("${slides[slideIndex]}")`;

    setInterval(() => {
      slideshow.style.opacity = "0";
      setTimeout(() => {
        slideIndex = (slideIndex + 1) % slides.length;
        slideshow.style.backgroundImage = `url("${slides[slideIndex]}")`;
        slideshow.style.opacity = "1";
      }, 1200);
    }, 10000);
  }

  // Floating WhatsApp and telephone contact buttons.
  const floating = document.createElement("div");
  floating.className = "floating-contact";
  floating.innerHTML = `
    <a class="floating-whatsapp" href="https://wa.me/254101956633" target="_blank" rel="noopener noreferrer" aria-label="Chat with Bamburi Beach Resort on WhatsApp" title="WhatsApp">
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path fill="currentColor" d="M16 3.2A12.6 12.6 0 0 0 5.1 22.1L3.5 28l6.1-1.6A12.7 12.7 0 1 0 16 3.2Zm0 23.1c-2 0-3.9-.5-5.6-1.5l-.4-.2-3.6 1 1-3.5-.2-.4A10.4 10.4 0 1 1 16 26.3Zm5.7-7.8c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.5 8.5 0 0 1-2.5-1.5 9.4 9.4 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.4.3-.6s0-.4 0-.6-.7-1.7-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.1 1.4 3.3c.2.2 2.3 3.5 5.6 4.8.8.4 1.5.6 2 .7.8.2 1.6.2 2.2.1.7-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4Z"/>
      </svg>
    </a>
    <a class="floating-call" href="tel:0101956633" aria-label="Call Bamburi Beach Resort" title="Call">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.35 1.84.58 2.8.7A2 2 0 0 1 22 16.92Z"/>
      </svg>
    </a>
  `;
  document.body.appendChild(floating);

  // Add child arrangement selector when children are entered.
  const agesInput = $("childAges");
  if (agesInput) {
    const arrangementLabel = document.createElement("label");
    arrangementLabel.className = "full";
    arrangementLabel.id = "childArrangementLabel";
    arrangementLabel.innerHTML = `
      Children's room arrangement
      <select id="childArrangement">
        <option value="sharing">Children aged 2–12 sharing with parents</option>
        <option value="own">Children occupying their own room(s)</option>
      </select>
      <p class="child-arrangement-note">This selection applies to all children entered above. Teenagers aged 13–17 are charged at the full applicable adult rate.</p>`;

    agesInput.closest("label").insertAdjacentElement("afterend",arrangementLabel);
  }

  // Mobile navigation.
  if ($("menuToggle") && $("mainNav")) {
    $("menuToggle").addEventListener("click",() => {
      const open = $("mainNav").classList.toggle("open");
      $("menuToggle").setAttribute("aria-expanded",String(open));
    });

    document.querySelectorAll("#mainNav a").forEach(link => link.addEventListener("click",() => {
      $("mainNav").classList.remove("open");
      $("menuToggle").setAttribute("aria-expanded","false");
    }));
  }

  function dateOnly(value) {
    return new Date(`${value}T12:00:00`);
  }

  function nightsBetween(start,end) {
    return Math.round((dateOnly(end)-dateOnly(start))/86400000);
  }

  function periodFor(date) {
    return PERIODS.find(period=>date>=period.start&&date<=period.end);
  }

  function parseChildAges(count) {
    if(count===0)return [];

    const raw=$("childAges").value.trim();

    if(!raw) {
      throw new Error("Please enter the age of each child, separated by commas.");
    }

    const ages=raw.split(",").map(value=>value.trim()).filter(Boolean).map(Number);

    if(ages.length!==count) {
      throw new Error(`You entered ${count} child(ren), but provided ${ages.length} age(s). Please enter one age for each child.`);
    }

    if(ages.some(age=>!Number.isInteger(age)||age<2||age>17)) {
      throw new Error("Please enter whole-number ages from 2 to 17 only. Children under 2 are not included in this child-rate calculation.");
    }

    return ages;
  }

  function addRow(rows,key,description,rate,amount) {
    let row=rows.find(item=>item.key===key&&item.rate===rate);

    if(!row) {
      row={key,description,rate,nights:0,amount:0};
      rows.push(row);
    }

    row.nights+=1;
    row.amount+=amount;
  }

  function calculateStay(start,end,roomKey,occupancy,rooms,childAges,childArrangement) {
    const nights=nightsBetween(start,end);

    if(nights<2) {
      throw new Error("The resort tariff requires a minimum stay of 2 nights.");
    }

    let total=0;
    const rows=[];
    const cursor=dateOnly(start);

    for(let n=0;n<nights;n++) {
      const iso=`${cursor.getFullYear()}-${String(cursor.getMonth()+1).padStart(2,"0")}-${String(cursor.getDate()).padStart(2,"0")}`;
      const period=periodFor(iso);

      if(!period) {
        throw new Error(`The tariff does not cover ${iso}. Please contact reservations for a booking enquiry.`);
      }

      const tariff=TARIFF[roomKey];
      const adultRate=tariff[occupancy][period.index];
      const adultAmount=adultRate*rooms;

      total+=adultAmount;

      addRow(
        rows,
        `adult-${occupancy}`,
        `${tariff.name} — ${occupancy} occupancy × ${rooms} room(s)`,
        adultRate,
        adultAmount
      );

      childAges.forEach((age,childIndex)=>{
        let childRate,description,rateBasis;

        if(age>=13) {
          rateBasis=childArrangement==="own"?"single":"double";
          childRate=tariff[rateBasis][period.index];
          description=`Child aged ${age} — full applicable adult rate (${rateBasis} rate)`;
        } else if(childArrangement==="own") {
          rateBasis="single";
          childRate=Math.round(tariff.single[period.index]*0.8);
          description=`Child aged ${age} — own room (80% of single rate)`;
        } else {
          rateBasis="double";
          childRate=Math.round(tariff.double[period.index]*0.5);
          description=`Child aged ${age} — sharing with parents (50% of double rate)`;
        }

        total+=childRate;

        addRow(
          rows,
          `child-${childIndex}-${age}-${rateBasis}`,
          description,
          childRate,
          childRate
        );
      });

      cursor.setDate(cursor.getDate()+1);
    }

    return {nights,total,rows};
  }

  // Set the minimum check-out date to two nights after check-in.
  if($("checkIn")&&$("checkOut")) {
    $("checkIn").addEventListener("change",()=>{
      if(!$("checkIn").value)return;

      const minOut=new Date(dateOnly($("checkIn").value));
      minOut.setDate(minOut.getDate()+2);

      $("checkOut").min=`${minOut.getFullYear()}-${String(minOut.getMonth()+1).padStart(2,"0")}-${String(minOut.getDate()).padStart(2,"0")}`;

      if($("checkOut").value&&$("checkOut").value<$("checkOut").min) {
        $("checkOut").value=$("checkOut").min;
      }
    });
  }

  // Booking request form submission.
  if($("quoteForm")) {
    $("quoteForm").addEventListener("submit",event=>{
      event.preventDefault();

      try {
        const start=$("checkIn").value;
        const end=$("checkOut").value;

        if(!start||!end||end<=start) {
          throw new Error("Please select valid check-in and check-out dates.");
        }

        const roomKey=$("roomType").value;
        const occupancy=$("occupancy").value;
        const rooms=Number($("roomCount").value);
        const adults=Number($("adultCount").value);
        const children=Number($("childCount").value);

        if(rooms<1||rooms>20||adults<1||adults>40||children<0||children>20) {
          throw new Error("Please enter valid guest and room quantities.");
        }

        if(rooms>adults) {
          throw new Error("The number of rooms cannot exceed the number of adults.");
        }

        const childAges=parseChildAges(children);
        const childArrangement=$("childArrangement")?$("childArrangement").value:"sharing";

        const result=calculateStay(
          start,
          end,
          roomKey,
          occupancy,
          rooms,
          childAges,
          childArrangement
        );

        const ref=`BBR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

        currentInvoice={
          ref,
          name:$("guestName").value.trim(),
          phone:$("guestPhone").value.trim(),
          email:$("guestEmail").value.trim(),
          start,
          end,
          nights:result.nights,
          roomKey,
          roomName:TARIFF[roomKey].name,
          occupancy,
          rooms,
          adults,
          children,
          childAges,
          childArrangement,
          total:result.total,
          rows:result.rows
        };

        renderInvoice(currentInvoice);

        $("invoiceSection").classList.remove("hidden");
        $("shareInvoice").disabled=false;
        $("invoiceSection").scrollIntoView({behavior:"smooth"});

      } catch(error) {
        alert(error.message);
      }
    });
  }

  // Generate a booking request summary. This is not a reservation confirmation.
  function renderInvoice(inv) {
    const fmtDate=value=>dateOnly(value).toLocaleDateString("en-KE",{
      day:"numeric",
      month:"short",
      year:"numeric"
    });

    const rows=inv.rows.map(row=>`
      <tr>
        <td>${escapeHTML(row.description)}</td>
        <td>${money(row.rate)}</td>
        <td>${row.nights}</td>
        <td>${money(row.amount)}</td>
      </tr>
    `).join("");

    const childSummary=inv.children
      ? `<br>Children: ${inv.children} (${inv.childAges.join(", ")} years)`
      : "";

    const arrangementSummary=inv.children
      ? `<br>Children's arrangement: ${inv.childArrangement==="own"?"Own room(s) for children aged 2–12":"Sharing with parents for children aged 2–12"}`
      : "";

    $("invoicePaper").innerHTML=`
      <div class="invoice-head">
        <div class="invoice-brand">
          <img class="invoice-logo" src="images/logo.png" alt="Bamburi Beach Hotel logo">
          <div>
            <h3>BAMBURI BEACH RESORT</h3>
            <p>
              P.O. Box 83966, Mombasa 80100, Kenya<br>
              bamburibeachresort@gmail.com<br>
              0101956633 / 0208237083
            </p>
          </div>
        </div>
        <div>
          <strong>ACCOMMODATION BOOKING REQUEST</strong>
          <p>
            Reference: ${escapeHTML(inv.ref)}<br>
            Prepared: ${new Date().toLocaleDateString("en-KE")}
          </p>
        </div>
      </div>

      <div class="invoice-meta">
        <div>
          <strong>GUEST DETAILS</strong><br>
          ${escapeHTML(inv.name)}<br>
          ${escapeHTML(inv.phone)}<br>
          ${escapeHTML(inv.email||"Email not provided")}
        </div>
        <div>
          <strong>REQUESTED STAY</strong><br>
          Check-in: ${fmtDate(inv.start)}<br>
          Check-out: ${fmtDate(inv.end)}<br>
          Duration: ${inv.nights} nights<br>
          Guests: ${inv.adults} adult(s)${childSummary}${arrangementSummary}
        </div>
      </div>

      <table class="invoice-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Rate / night</th>
            <th>Nights</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <div class="invoice-total">ESTIMATED TOTAL: ${money(inv.total)}</div>

      <p><strong>Payment terms:</strong> Full payment in advance, only after availability has been checked and the resort has confirmed the booking.</p>

      <p><strong>Minimum stay:</strong> 2 nights. <strong>Rates:</strong> All Inclusive, as per the 2026/2027 tariff.</p>

      <p><strong>Child rates:</strong> Ages 2–12 sharing with parents are charged at 50% of the double rate; ages 2–12 in their own room are charged at 80% of the single rate; ages 13–17 are charged at the full applicable adult rate.</p>

      <p><strong>IMPORTANT:</strong> This document records a booking request only. It does not confirm or reserve accommodation. The reservations team must check availability and confirm the booking before payment.</p>
    `;
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g,char=>({
      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      '"':"&quot;",
      "'":"&#39;"
    }[char]));
  }

  if($("printInvoice")) {
    $("printInvoice").addEventListener("click",()=>window.print());
  }

  if($("shareInvoice")) {
    $("shareInvoice").addEventListener("click",()=>{
      if(!currentInvoice)return;

      const inv=currentInvoice;

      const message=`Hello Bamburi Beach Resort Reservations,

I would like to submit a booking request and ask you to confirm availability.

Booking request reference: ${inv.ref}
Name: ${inv.name}
Room: ${inv.roomName}
Occupancy: ${inv.occupancy}
Rooms: ${inv.rooms}
Adults: ${inv.adults}
Children: ${inv.children}${inv.children?` (ages: ${inv.childAges.join(", ")})`:""}
Children's arrangement: ${inv.children?(inv.childArrangement==="own"?"Own room(s) for children aged 2–12":"Sharing with parents for children aged 2–12"):"Not applicable"}
Check-in: ${inv.start}
Check-out: ${inv.end}
Nights: ${inv.nights}
Estimated total: ${money(inv.total)}

Kindly check availability and confirm whether this booking can be accommodated. Please advise on the next steps. Thank you.`;

      window.open(
        `https://wa.me/254101956633?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener"
      );
    });
  }
})();
