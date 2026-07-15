/* ============================================
   Day / Night theme toggle
   (initial theme is already set in <head> to avoid a flash;
   this just wires up the button and persists changes)
   ============================================ */
const themeToggle = document.getElementById("themeToggle");
const rootEl = document.documentElement;

function setTheme(theme){
    rootEl.setAttribute("data-theme", theme);
    themeToggle.setAttribute("aria-label", theme === "day" ? "Switch to night mode" : "Switch to day mode");
    try{ localStorage.setItem("portfolio-theme", theme); }catch(e){ /* storage unavailable, ignore */ }
}

// Sync the button label with whatever theme the head script already applied.
setTheme(rootEl.getAttribute("data-theme") === "day" ? "day" : "night");

themeToggle.addEventListener("click", () => {
    const next = rootEl.getAttribute("data-theme") === "day" ? "night" : "day";
    setTheme(next);
});

/* ============================================
   Mobile nav toggle
   ============================================ */
const navToggle = document.getElementById("navToggle");
const navMobile = document.getElementById("navMobile");

navToggle.addEventListener("click", () => {
    const isOpen = navMobile.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen);
});

navMobile.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navMobile.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
    });
});

/* ============================================
   Scroll reveal for sections (IntersectionObserver)
   ============================================ */
const sections = document.querySelectorAll("section");

// Hero is always visible immediately — only reveal sections below it.
const revealTargets = document.querySelectorAll("section:not(#home)");
revealTargets.forEach(section => section.classList.add("will-reveal"));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealTargets.forEach(section => revealObserver.observe(section));

/* ============================================
   Active nav link on scroll (scroll-spy)
   ============================================ */
const navLinks = document.querySelectorAll(".nav-links a");

const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const id = entry.target.getAttribute("id");
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if(!link) return;
        if(entry.isIntersecting){
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
        }
    });
}, { rootMargin: "-45% 0px -45% 0px" });

sections.forEach(section => spyObserver.observe(section));

/* ============================================
   Ambient orb parallax (mouse-driven)
   ============================================ */
const orbs = document.querySelectorAll(".orb");

window.addEventListener("mousemove", (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx);
    const dy = (e.clientY - cy);

    orbs.forEach(orb => {
        const depth = parseFloat(orb.dataset.depth) || 0.02;
        orb.style.transform = `translate(${dx * depth}px, ${dy * depth}px)`;
    });
});

/* ============================================
   Hero card glass sheen follows pointer
   ============================================ */
const heroCard = document.getElementById("heroCard");

if(heroCard){
    heroCard.addEventListener("mousemove", (e) => {
        const rect = heroCard.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        heroCard.style.setProperty("--mx", `${x}%`);
        heroCard.style.setProperty("--my", `${y}%`);
    });
}

/* ============================================
   Project card 3D tilt
   ============================================ */
const tiltCards = document.querySelectorAll("[data-tilt]");

tiltCards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const tiltX = (y * -8).toFixed(2);
        const tiltY = (x * 8).toFixed(2);

        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(800px) rotateX(0) rotateY(0) translateY(0)";
    });
});

/* ============================================
   Generic glass hover glow (About / Education / Contact cards)
   ============================================ */
const glowCards = document.querySelectorAll(".glass:not(.project-card):not(.hero-card)");

glowCards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.12), rgba(255,255,255,0.05))`;
    });
    card.addEventListener("mouseleave", () => {
        card.style.background = "";
    });
});

/* ============================================
   Footer year
   ============================================ */
const footerText = document.querySelector("footer p");
if(footerText){
    const year = new Date().getFullYear();
    footerText.innerHTML = `© ${year} Ingyin San — built with glass, light, and too much coffee.`;
}
