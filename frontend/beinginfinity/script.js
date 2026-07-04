const input = document.getElementById("search-input");
const menu = document.getElementById("dropdown-menu");
const time = document.getElementById("search-time");

let timer;

input.addEventListener("input", () => {
    clearTimeout(timer);

    const q = input.value.trim();

    if (!q) {
        menu.style.display = "none";
        menu.innerHTML = "";
        time.textContent = "0.02";
        return;
    }

    menu.innerHTML = '<div class="status-msg"> Searching...</div>';
    menu.style.display = "block";

    timer = setTimeout(async () => {
        const start = performance.now();

        try {
            const res = await fetch(
                `https://autosuggest-backend.onrender.com/api/autosuggest?q=${encodeURIComponent(q)}&algorithm=brute&limit=5&weighted=false`
            );

            const data = await res.json();

            const end = performance.now();
            const t = ((end - start) / 1000).toFixed(2);
            time.textContent = t === "0.00" ? "0.02" : t;

            const list =
                data.suggestions ||
                data.results ||
                data.data ||
                data.phrases ||
                [];

            if (!list.length) {
                menu.innerHTML =
                    '<div class="status-msg">No suggestions found</div>';
                return;
            }

            menu.innerHTML = list.slice(0, 5).map(x => {
                const text = typeof x === "object"
                    ? (x.phrase || x.text || x.suggestion || x.word || "")
                    : x;

                return `
                <div class="suggestion-item"
                onclick="input.value='${text.replace(/'/g,"\\'")}';menu.style.display='none'">
                    ${text}
                </div>`;
            }).join("");

        } catch {
            menu.innerHTML =
                '<div class="error-msg">Unable to fetch suggestions</div>';
        }
    }, 150);
});

document.addEventListener("click", e => {
    if (!e.target.closest(".search-wrapper"))
        menu.style.display = "none";
});