/* SG Farms Field Logs and Farm Booking Component */
import { i18n } from '../translate.js';
import { DB } from '../db.js';
import { State } from '../state.js';

export const FarmComponent = {
  render(container) {
    const lang = State.language;
    const logs = DB.getFieldLogs();

    // Build Field Monitoring Logs timeline HTML
    const logsHTML = logs.map((l, index) => `
      <div class="log-item">
        <div class="log-badge-dot"></div>
        <span class="log-date">${l.date}</span>
        <div class="log-card">
          <h4>${l.title}</h4>
          <p>${l.description}</p>
          ${l.image ? `<img src="${l.image}" alt="${l.title}">` : ''}
          <div class="log-tags" style="display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap;">
            ${l.tags ? l.tags.map(t => `<span class="badge badge-direct" style="font-size: 0.7rem; padding: 2px 8px;">#${t}</span>`).join('') : ''}
          </div>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="container section-padding">
        <!-- Banner Header -->
        <div class="farm-visit-header">
          <h1>Experience SG Farms in Mukkollu</h1>
          <p>We believe in transparent agriculture. Walk through our fields, breathe fresh country air, and see how your food grows.</p>
        </div>

        <div class="farm-layout-split grid grid-2" style="grid-template-columns: 1.2fr 0.8fr; align-items: start;">
          
          <!-- Left: Live Crop Logs Timeline -->
          <div class="field-logs-container">
            <h3 style="margin-bottom: 12px; font-family: var(--font-heading); font-size: 1.6rem; border-bottom: 2px solid var(--border-light); padding-bottom: 12px;">
              🌱 Live Crop Growth Updates
            </h3>
            <p style="color: var(--text-muted); margin-bottom: 20px;">Real-time field monitoring notes directly from Farmer Sures in Mukkollu.</p>
            
            <div class="log-timeline">
              ${logsHTML}
            </div>
          </div>

          <!-- Right: Visit Booking Form -->
          <div class="booking-sticky-panel" style="position: sticky; top: 100px; background-color: var(--bg-white); padding: 32px; border-radius: var(--radius-md); border: 1px solid var(--border-green); box-shadow: var(--shadow-md);">
            <h3 style="margin-bottom: 6px; font-family: var(--font-heading);">${i18n.t('booking_title', lang)}</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 24px;">${i18n.t('booking_subtitle', lang)}</p>

            <form id="farm-booking-form">
              <div class="form-group">
                <label for="booking-name">${i18n.t('visit_form_name', lang)}</label>
                <input type="text" id="booking-name" class="form-control" placeholder="Enter full name" required value="${State.user ? State.user.name : ''}">
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="booking-date">${i18n.t('visit_form_date', lang)}</label>
                  <input type="date" id="booking-date" class="form-control" required min="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                  <label for="booking-guests">${i18n.t('visit_form_guests', lang)}</label>
                  <input type="number" id="booking-guests" class="form-control" min="1" max="15" value="1" required>
                </div>
              </div>

              <div class="form-group">
                <label for="booking-phone">${i18n.t('visit_form_phone', lang)}</label>
                <input type="tel" id="booking-phone" class="form-control" placeholder="e.g. 9876543210" pattern="[6789][0-9]{9}" required value="${State.user ? State.user.phone || '' : ''}">
              </div>

              <div class="form-group">
                <label for="booking-workshop">${i18n.t('visit_form_workshop', lang)}</label>
                <select id="booking-workshop" class="form-control">
                  <option value="General Farm Tour & Fruit Picking">${i18n.t('visit_form_workshop_none', lang)}</option>
                  <option value="Organic Compost Prep Workshop">${i18n.t('visit_form_workshop_compost', lang)}</option>
                  <option value="Natural Pest Repellent (Neem) Workshop">${i18n.t('visit_form_workshop_pest', lang)}</option>
                </select>
              </div>

              <button type="submit" class="btn btn-primary btn-block">
                <i data-lucide="calendar-check"></i> ${i18n.t('btn_book_visit', lang)}
              </button>
            </form>

            <div class="booking-faq-tips" style="margin-top: 24px; padding-top: 20px; border-top: 1px dashed var(--border-light); font-size: 0.8rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 8px;">
              <div>📍 <strong>Location:</strong> Mukkollu Village (Krishna District, AP). Easy approach road.</div>
              <div>🥤 <strong>Complimentary:</strong> Organic coconut water & farmhouse traditional organic snacks included.</div>
              <div>📅 <strong>Timings:</strong> Weekends 9:00 AM to 5:00 PM.</div>
            </div>
          </div>

        </div>
      </div>
    `;

    lucide.createIcons();
    this.attachEvents(container);
  },

  attachEvents(container) {
    const form = container.querySelector('#farm-booking-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const visitor_name = container.querySelector('#booking-name').value;
        const visit_date = container.querySelector('#booking-date').value;
        const guests_count = parseInt(container.querySelector('#booking-guests').value);
        const phone = container.querySelector('#booking-phone').value;
        const workshop_interested = container.querySelector('#booking-workshop').value;

        // Check if user is logged in, if not create as guest user
        const userId = State.user ? State.user.id : "guest";

        DB.createBooking({
          user_id: userId,
          visitor_name,
          visit_date,
          guests_count,
          phone,
          workshop_interested
        });

        // Show confirmation popup or alert
        alert(`${i18n.t('booking_success', State.language)}\nWe will call you at ${phone} to coordinate transport options.`);
        form.reset();
      });
    }
  }
};
