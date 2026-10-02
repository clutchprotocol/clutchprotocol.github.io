document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu. The hamburger bars animate from aria-expanded in CSS.
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    toggle.addEventListener('click', function () {
        const open = menu.classList.toggle('active');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            menu.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Fare slider: same split as the chain. Each referrer gets 2% (200 bps, rounded down) and the
    // driver gets the exact remainder, so the three always add up to the fare.
    const fare = document.getElementById('fare');
    if (fare) {
        const out = document.getElementById('fare-out');
        const rows = document.querySelectorAll('#fee-bars .fee-bar');
        const clt = function (n) { return n.toLocaleString('en-US') + ' CLT'; };
        const usd = function (n) { return '$' + (n / 1e6).toFixed(n % 10000 ? 3 : 2); };
        const update = function () {
            const total = Number(fare.value) * 1e6;
            const ref = Math.floor(total * 200 / 10000);
            const parts = [total - 2 * ref, ref, ref];
            out.textContent = '$' + Number(fare.value).toFixed(2);
            rows.forEach(function (row, i) {
                row.style.setProperty('--w', (parts[i] / total * 100) + '%');
                row.querySelector('.fee-amount').textContent = clt(parts[i]) + ' (' + usd(parts[i]) + ')';
            });
        };
        fare.addEventListener('input', update);
        update();
    }
});
