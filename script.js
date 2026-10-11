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

    // "Add Clutch to MetaMask": the network the app adds, with the wallet chain ids the Hub API's
    // /rpc answers (20770 mainnet, 20771 testnet; not the node's chain id).
    const networks = {
        mainnet: { chainId: '0x5122', chainName: 'Clutch', rpc: 'https://api.clutchprotocol.io/rpc', explorer: 'https://explorer.clutchprotocol.io' },
        testnet: { chainId: '0x5123', chainName: 'Clutch Testnet', rpc: 'https://api-stage.clutchprotocol.io/rpc', explorer: 'https://explorer-stage.clutchprotocol.io' }
    };
    // Which wallet answers. Several extensions can share one browser, and the one that owns
    // window.ethereum may not add networks: TronLink, for one, answers "the method
    // wallet_addEthereumChain does not exist". So ask each wallet to announce itself (EIP-6963),
    // try MetaMask first, skip TronLink, then fall back to window.ethereum and its providers list.
    const announced = [];
    window.addEventListener('eip6963:announceProvider', function (e) {
        if (e.detail && e.detail.provider) announced.push(e.detail);
    });
    window.dispatchEvent(new Event('eip6963:requestProvider'));
    const isTron = function (rdns, p) { return /tronlink/i.test(rdns || '') || !!(p && (p.isTronLink || p.isTron)); };
    const wallets = function () {
        const list = announced.slice().sort(function (a, b) {
            return (b.info && b.info.rdns === 'io.metamask') - (a.info && a.info.rdns === 'io.metamask');
        }).filter(function (w) { return !isTron(w.info && w.info.rdns, w.provider); })
          .map(function (w) { return { name: (w.info && w.info.name) || 'Your wallet', provider: w.provider }; });
        const eth = window.ethereum;
        const legacy = eth ? (Array.isArray(eth.providers) && eth.providers.length ? eth.providers : [eth]) : [];
        legacy.forEach(function (p) {
            if (p && p.request && !isTron('', p) && !list.some(function (w) { return w.provider === p; })) {
                list.push({ name: p.isMetaMask ? 'MetaMask' : 'Your wallet', provider: p });
            }
        });
        return list;
    };
    document.querySelectorAll('.btn-wallet').forEach(function (btn) {
        const status = btn.closest('.try-stage-card').querySelector('.wallet-status');
        const n = networks[btn.dataset.network];
        const params = [{
            chainId: n.chainId, chainName: n.chainName, rpcUrls: [n.rpc], blockExplorerUrls: [n.explorer],
            nativeCurrency: { name: 'Clutch', symbol: 'CLT', decimals: 18 }
        }];
        // Try each wallet in turn; a person's "no" (4001) or an open prompt (-32002) ends it.
        const tryAdd = function (list, i, lastError) {
            if (i >= list.length) {
                status.textContent = list.length === 0
                    ? 'No MetaMask or Trust Wallet found. Install MetaMask, or open this page in your wallet app\'s browser.'
                    : 'Could not add the network: your wallet cannot add networks. Use MetaMask or Trust Wallet. ' + ((lastError && lastError.message) || '');
                return;
            }
            list[i].provider.request({ method: 'wallet_addEthereumChain', params: params }).then(function () {
                status.textContent = 'Added. ' + list[i].name + ' now shows your CLT on ' + n.chainName + '.';
            }).catch(function (e) {
                if (e && e.code === 4001) status.textContent = 'Not added: the request was declined in your wallet.';
                else if (e && e.code === -32002) status.textContent = 'Your wallet already has a request open. Open your wallet, finish it, then try again.';
                else tryAdd(list, i + 1, e);
            });
        };
        btn.addEventListener('click', function () { tryAdd(wallets(), 0, null); });
    });
});
