// Applies the visitor's saved theme before the page draws. Linked from every page's
// <head>; the themes themselves are blocks in style.css keyed on data-theme. Pages that
// draw with script (canvases, plots, Mermaid) read colours through SiteTheme.color()
// and redraw on the 'themechange' event, which fires when the theme is changed here or
// in another tab, and when the system flips between light and dark under Auto.

const SiteTheme = {
    // [name, label]; '' is Auto, which follows the system. A new theme needs a line
    // here and a block in style.css.
    themes: [
        ['', 'Auto'],
        ['light', 'Light'],
        ['dark', 'Dark'],
        ['sepia', 'Sepia'],
        ['solarized', 'Solarized'],
        ['phosphor', 'Phosphor'],
    ],

    get() {
        try { return localStorage.getItem('theme') || ''; } catch (e) { return ''; }
    },

    set(name) {
        try {
            if (name) localStorage.setItem('theme', name);
            else localStorage.removeItem('theme');
        } catch (e) {}
        SiteTheme.apply(name);
    },

    apply(name) {
        const known = SiteTheme.themes.some(([n]) => n === name);
        if (name && known) document.documentElement.dataset.theme = name;
        else delete document.documentElement.dataset.theme;
        window.dispatchEvent(new Event('themechange'));
    },

    /** A theme colour, e.g. SiteTheme.color('link'). */
    color(name) {
        return getComputedStyle(document.documentElement).getPropertyValue('--' + name).trim();
    },

    /** Whether the page is drawn light on dark, for libraries that want 'dark' or 'default'. */
    isDark() {
        return getComputedStyle(document.documentElement).colorScheme.includes('dark');
    },
};

SiteTheme.apply(SiteTheme.get());
window.addEventListener('storage', e => { if (e.key === 'theme') SiteTheme.apply(e.newValue || ''); });
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!SiteTheme.get()) window.dispatchEvent(new Event('themechange'));
});
