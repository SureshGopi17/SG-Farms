/* SG Farms Agricultural Blogs and Farming Tips Component */
import { i18n } from '../translate.js';
import { DB } from '../db.js';
import { State } from '../state.js';

export const BlogComponent = {
  activeBlogId: null,

  render(container) {
    const lang = State.language;
    const blogs = DB.getBlogs();

    if (this.activeBlogId) {
      this.renderFullBlog(container, this.activeBlogId);
      return;
    }

    // Build Blog grid
    const blogsHTML = blogs.map(b => `
      <div class="crop-card blog-card-row" style="display: flex; flex-direction: column; height: 100%;">
        <div class="crop-img-container" style="height: 200px; overflow: hidden;">
          <img src="${b.image}" alt="${b.title}" style="width: 100%; height: 100%; object-fit: cover;">
          <span class="crop-category-badge" style="background-color: var(--secondary-light);">${b.category}</span>
        </div>
        <div class="crop-card-body" style="padding: 24px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px;">
              By ${b.author} | ${b.date}
            </div>
            <h3 style="font-family: var(--font-heading); font-size: 1.25rem; margin-bottom: 12px; line-height: 1.3;">
              ${b.title}
            </h3>
            <p style="font-size: 0.9rem; color: var(--text-dark); margin-bottom: 16px; line-height: 1.5;">
              ${b.summary}
            </p>
          </div>
          <button class="btn btn-secondary btn-sm read-blog-btn" data-id="${b.id}" style="width: fit-content; align-self: flex-start;">
            Read Full Article <i data-lucide="arrow-right" style="width: 16px; height: 16px; margin-left: 4px;"></i>
          </button>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="container section-padding">
        <div class="blog-header-banner text-center" style="margin-bottom: 48px;">
          <span class="badge badge-organic">Farming Tips & Guides</span>
          <h2 style="font-family: var(--font-heading); font-size: 2.2rem; margin-top: 12px; margin-bottom: 12px;">Agricultural Knowledge Base</h2>
          <p style="color: var(--text-muted); max-width: 600px; margin: 0 auto;">Read the latest recipes, tips, and insights on sustainable agriculture written directly by Farmer Sures.</p>
        </div>

        <div class="grid grid-3 blog-articles-grid" style="grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));">
          ${blogsHTML}
        </div>
      </div>
    `;

    lucide.createIcons();
    this.attachEvents(container);
  },

  renderFullBlog(container, id) {
    const blogs = DB.getBlogs();
    const blog = blogs.find(b => b.id === id);
    if (!blog) {
      this.activeBlogId = null;
      this.render(container);
      return;
    }

    container.innerHTML = `
      <div class="container section-padding" style="max-width: 800px;">
        <button class="btn btn-secondary btn-sm" id="back-to-blogs-btn" style="margin-bottom: 24px;">
          <i data-lucide="arrow-left"></i> Back to Articles
        </button>

        <article class="full-blog-article">
          <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 8px;">
            Published in <strong>${blog.category}</strong> | By ${blog.author} | ${blog.date}
          </div>
          <h1 style="font-family: var(--font-heading); font-size: 2.5rem; line-height: 1.2; margin-bottom: 24px;">
            ${blog.title}
          </h1>

          <img src="${blog.image}" alt="${blog.title}" style="width: 100%; max-height: 450px; object-fit: cover; border-radius: var(--radius-lg); margin-bottom: 32px; box-shadow: var(--shadow-sm);">

          <div class="blog-content-markdown" style="font-size: 1.05rem; line-height: 1.8; color: var(--text-dark); display: flex; flex-direction: column; gap: 20px;">
            ${blog.content.split('\n\n').map(p => `<p>${p}</p>`).join('')}
          </div>
        </article>

        <!-- Newsletter box -->
        <div class="newsletter-inline" style="background-color: var(--primary-xlight); border: 1px solid var(--border-green); padding: 32px; border-radius: var(--radius-md); text-align: center; margin-top: 60px;">
          <h4 style="font-family: var(--font-heading); margin-bottom: 8px;">Subscribe to Farming Tips</h4>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 20px;">Get seasonal sowing alerts, harvesting updates, and recipes delivered to your inbox.</p>
          <form id="newsletter-form-inline" style="display: flex; max-width: 450px; margin: 0 auto; gap: 10px;">
            <input type="email" placeholder="Enter email address" class="form-control" required style="background-color: var(--bg-white);">
            <button type="submit" class="btn btn-primary btn-sm">Subscribe</button>
          </form>
        </div>
      </div>
    `;

    lucide.createIcons();
    this.attachFullBlogEvents(container);
  },

  attachEvents(container) {
    container.querySelectorAll('.read-blog-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeBlogId = btn.getAttribute('data-id');
        this.render(container);
      });
    });
  },

  attachFullBlogEvents(container) {
    const backBtn = container.querySelector('#back-to-blogs-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.activeBlogId = null;
        this.render(container);
      });
    }

    const newsForm = container.querySelector('#newsletter-form-inline');
    if (newsForm) {
      newsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Thank you for subscribing to SG Farms newsletter!");
        newsForm.reset();
      });
    }
  }
};
