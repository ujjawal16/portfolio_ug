/* Ujjawal Golani — portfolio interactions (no dependencies) */
(function () {
  'use strict';

  /* ------------------------------------------------------------
     SETTINGS — change these in one place
     ------------------------------------------------------------ */
  var GITHUB_URL = 'https://github.com/ujjawal16';            // e.g. 'https://github.com/your-username' — leave '' to hide GitHub links
  var EMAIL = 'ujjawal.golani@gmail.com';

  document.documentElement.classList.add('js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function store(key, val) { try { if (val === undefined) return localStorage.getItem(key); localStorage.setItem(key, val); } catch (e) { return null; } }

  /* ------------------------------------------------------------
     DATA — case studies
     ------------------------------------------------------------ */
  var CASES = [
    {
      title: 'Multi-tenant Job Orchestration Platform',
      context: 'Enterprise AI SaaS · Co-designed with the lead engineer',
      contextLong: 'Enterprise AI SaaS · Co-designed with the lead engineer · Guided 2 engineers',
      teaser: 'Scattered, costly notebook jobs → one shared platform on Prefect + Kubernetes.',
      problem: 'Batch jobs ran as raw notebooks spread across teams — hard to maintain, expensive to run, with no shared standard.',
      problemLong: 'Batch jobs ran as raw notebooks spread across teams. They were hard to maintain, expensive to run, and followed no shared standard.',
      built: 'An event-driven job platform on Prefect + Kubernetes (EKS): ~200 parameterized deployments, each run in an isolated pod with per-customer concurrency limits and automatic retries.',
      builtLong: 'An event-driven job platform on Prefect and Kubernetes (AWS EKS). Queued jobs feed ~200 parameterized deployments; each run gets its own short-lived pod with per-customer concurrency limits and automatic retries. Job logic is separated from orchestration, and the orchestrator ships as an installable Python package.',
      decisions: ['Prefect + Kubernetes over Step Functions + SQS: better UI, lower cost, less effort', 'Swappable execution layer with a Step Functions + SQS fallback', 'Pod-level isolation so one heavy tenant cannot slow the others'],
      decisionsLong: [
        ['Prefect + Kubernetes', 'Chosen over Step Functions + SQS for a better built-in UI, lower cost and less build effort.'],
        ['Swappable execution layer', 'A Step Functions + SQS fallback sits behind an adapter, so changing runtimes means changing one adapter.'],
        ['Pod-level isolation', 'Each run has its own memory limits, so one heavy tenant can’t slow down the others.']
      ],
      nodes: ['Redis queue', 'Prefect orchestrator', 'Isolated EKS pods', 'Logs · Metrics · Alerts'],
      arch: [['Job queue', 'Redis'], ['Orchestrator', 'Prefect · ~200 deployments', true], ['Isolated pods', 'EKS · per-tenant limits · retries'], ['Observability', 'Logs · metrics · alerts']],
      archAlt: ['Swappable execution adapter', 'Fallback: Step Functions + SQS'],
      metric: '~80%', metricLabel: 'faster runtime',
      result: 'largest job 60h → 12h, 33% lower compute cost, adopted by 3 teams',
      stats: [['~80%', 'faster runtime (60h → 12h)'], ['33%', 'lower compute cost'], ['3', 'teams adopted it'], ['~2 wks', 'to design and ship v1']],
      challenges: ['Serving 3 teams with different needs from one platform', 'Integrating existing legacy Python frameworks', 'Building logging, metrics, infrastructure, notifications and failure strategy from scratch'],
      role: 'Co-designed the architecture with the lead engineer, authored the HLD/LLD, and guided 2 engineers through implementation.',
      table: { title: 'Results by tenant', head: ['Tenant', 'Before', 'After'], rows: [['Tenant A', '60h', '12h', 20], ['Tenant B', '20h', '2h', 10], ['Tenant C', '18h', '7h', 39], ['Tenant D', '9h', '2h', 22], ['Tenant E', '4h', '40m', 17]] },
      tags: ['Prefect', 'Kubernetes (EKS)', 'Redis', 'Python', 'AWS']
    },
    {
      title: 'Dashboard Performance Overhaul',
      context: 'Enterprise AI SaaS · Customer-facing dashboards',
      contextLong: 'Enterprise AI SaaS · Customer-facing dashboards used by client leadership teams',
      teaser: 'Customer dashboards taking 20 seconds to load → under 2 seconds.',
      problem: 'Dashboards took ~20s to load: unoptimized jobs, database spikes, killed queries and no proper caching.',
      problemLong: 'Dashboards took around 20 seconds to load. Causes stacked up: unoptimized jobs, database load spikes, queries getting killed, and no proper caching.',
      built: 'Optimized MongoDB queries with projections, refactored 2 microservices into modular components, added a caching layer and moved services to AWS Fargate.',
      builtLong: 'Optimized MongoDB queries and used projections to fetch only the fields needed. Refactored 2 microservices into modular components, added a caching layer with cache on/off control built into the UI, and moved services from uWSGI to AWS Fargate.',
      decisions: ['Fetch only the fields needed, using projections', 'Caching with cache on/off control built into the UI', 'Modular services instead of one heavy service'],
      decisionsLong: [
        ['Projections first', 'Fetch only the fields each widget needs, instead of whole documents.'],
        ['Controllable caching', 'A caching layer with an on/off control built into the UI, so fresh data is one click away.'],
        ['Modular services', 'Two heavy services split into modular components that scale on their own.']
      ],
      nodes: ['Dashboard', 'API', 'Cache layer', 'MongoDB'],
      arch: [['Dashboard', 'Client leadership'], ['API', 'Django services'], ['Cache layer', 'On/off from the UI', true], ['MongoDB', 'Optimized queries + projections']],
      archAlt: null,
      metric: '90%', metricLabel: 'faster load',
      result: '20s → under 2s, fewer database spikes',
      stats: [['90%', 'faster load time'], ['20s → <2s', 'dashboard load'], ['2', 'microservices refactored'], ['Fargate', 'moved off uWSGI']],
      challenges: ['Several causes of slowness at once: jobs, queries and caching', 'Keeping data fresh while caching aggressively', 'Refactoring live, customer-facing services without downtime'],
      role: 'Led the investigation and the fix: query optimization, service refactor, caching design and the move to AWS Fargate.',
      list: { title: 'Results', items: ['Load time cut from about 20 seconds to under 2 seconds (90% faster)', 'Fewer database spikes and killed queries', 'Services now scale independently on AWS Fargate'] },
      tags: ['MongoDB', 'Django', 'AWS Fargate', 'Caching']
    },
    {
      title: 'Hotel Reviews Aggregator',
      context: 'B2B travel platform',
      contextLong: 'B2B travel platform',
      teaser: 'Three suppliers, three formats → one normalized, ranked review store.',
      problem: 'Hotel reviews came from 3 global suppliers, each with its own format and API rate limits.',
      problemLong: 'Hotel reviews came from 3 global suppliers, each with its own format and API rate limits.',
      built: 'A Python service that converts every supplier into one common schema through pluggable adapters, with rate-limit-aware jobs and ranking in Elasticsearch.',
      builtLong: 'A Python service that pulls reviews from every supplier and converts them into one common schema using pluggable adapters. Ingestion jobs respect each supplier’s rate limits, and all reviews are segregated and ranked in Elasticsearch.',
      decisions: ['Adapter pattern: one adapter per supplier', 'Rate-limit-aware ingestion jobs', 'Elasticsearch for segregation and ranking'],
      decisionsLong: [
        ['Adapter pattern', 'One adapter per supplier, so adding a new supplier takes minimal code changes.'],
        ['Rate-limit-aware jobs', 'Ingestion paced per supplier, so no API limits are breached.'],
        ['Elasticsearch', 'Reviews segregated and ranked for fast, relevant results on hotel pages.']
      ],
      nodes: ['Suppliers A / B / C', 'Adapters', 'Common schema', 'Elasticsearch'],
      arch: [['Suppliers A / B / C', '3 formats · rate limits'], ['Adapters', 'One per supplier', true], ['Common schema', 'Normalized reviews'], ['Elasticsearch', 'Segregation + ranking']],
      archAlt: null,
      metric: '1M+', metricLabel: 'reviews unified',
      result: '1M+ reviews in one schema, new suppliers added with minimal code',
      stats: [['1M+', 'reviews unified'], ['3', 'global suppliers'], ['1', 'common schema'], ['1 adapter', 'to add a supplier']],
      challenges: ['A different data format from every supplier', 'Strict API rate limits during ingestion', 'Ranking a very large review set quickly'],
      role: 'Designed and built the aggregator service, its adapters and the Elasticsearch ranking.',
      list: { title: 'Results', items: ['1M+ reviews unified in one schema', 'Ranked and searchable through Elasticsearch', 'New suppliers can be added with minimal code changes'] },
      tags: ['Python', 'Elasticsearch', 'Adapter pattern']
    },
    {
      title: 'Secure Bank Payout Integration',
      context: 'Warranty & assurance platform',
      contextLong: 'Warranty & assurance platform',
      teaser: 'Manual, slow cashback payouts → encrypted, self-reconciling bank payouts.',
      problem: 'Cashback on warranty products had to reach sellers and retailers through partner brand apps — securely, reliably and traceably.',
      problemLong: 'Cashback on warranty and assurance products had to reach sellers and retailers through the apps of major consumer brands. Payouts needed to be secure, reliable and traceable.',
      built: 'Integration with a major bank’s payout APIs: certificate-based encryption, exponential backoff retries, a daily reconciliation job and live monitoring.',
      builtLong: 'An integration with a major bank’s payout APIs, with encryption using certificates and public/private key cryptography stored securely on the server, exponential backoff retries for failed calls, a daily reconciliation job to match every payout, and live monitoring.',
      decisions: ['Public/private key encryption with certificates', 'Exponential backoff for failed calls', 'Daily reconciliation of every payout'],
      decisionsLong: [
        ['Certificate-based encryption', 'Public/private key cryptography, with keys stored securely on the server.'],
        ['Exponential backoff', 'Failed calls retried with growing gaps, so temporary bank issues don’t lose payouts.'],
        ['Daily reconciliation', 'A job that matches every payout each day, so nothing goes unaccounted.']
      ],
      nodes: ['Cashback request', 'Encrypt (certs + keys)', 'Bank payout API', 'Daily reconciliation'],
      arch: [['Cashback request', 'From partner brand apps'], ['Encrypt', 'Certificates + keys', true], ['Bank payout API', 'Retries with backoff'], ['Reconciliation', 'Daily job · monitoring']],
      archAlt: null,
      metric: '10,000+', metricLabel: 'payouts / month',
      result: 'faster settlement, higher success rate, more partner trust',
      stats: [['10,000+', 'encrypted payouts/month'], ['Daily', 'reconciliation'], ['Auto', 'retries with backoff'], ['Live', 'monitoring']],
      challenges: ['Handling bank-grade encryption and key management', 'Recovering from temporary bank API failures', 'Proving every payout landed'],
      role: 'Built the bank integration, its encryption, retry logic and the daily reconciliation job.',
      list: { title: 'Results', items: ['10,000+ encrypted payouts every month', 'Faster settlement and higher success rates', 'More trust from partners and retailers'] },
      tags: ['Django', 'Cryptography', 'Retries', 'Reconciliation']
    }
  ];

  /* ------------------------------------------------------------
     Links
     ------------------------------------------------------------ */
  $all('.js-github').forEach(function (a) {
    if (GITHUB_URL) { a.href = GITHUB_URL; } else { a.style.display = 'none'; }
  });
  $all('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ------------------------------------------------------------
     Sticky navbar state
     ------------------------------------------------------------ */
  var hdr = $('#hdr');
  function onScroll() { hdr.classList.toggle('scrolled', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------
     Overlay helpers (focus, scroll lock, Esc)
     ------------------------------------------------------------ */
  var openStack = [];
  function openOverlay(el, opener, focusEl) {
    el.hidden = false;
    document.body.classList.add('lock');
    openStack.push({ el: el, opener: opener });
    (focusEl || el).focus({ preventScroll: true });
  }
  function closeOverlay(el) {
    el.hidden = true;
    var idx = -1;
    openStack.forEach(function (o, i) { if (o.el === el) idx = i; });
    var entry = idx > -1 ? openStack.splice(idx, 1)[0] : null;
    if (!openStack.length) document.body.classList.remove('lock');
    if (entry && entry.opener) entry.opener.focus();
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openStack.length) {
      var top = openStack[openStack.length - 1].el;
      if (top.id === 'fit') closeFit(); else if (top.id === 'mmenu') closeMenu(); else closeOverlay(top);
    }
  });

  /* ------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------ */
  var menu = $('#mmenu'), menuBtn = $('[data-open-menu]');
  function closeMenu() { menuBtn.setAttribute('aria-expanded', 'false'); closeOverlay(menu); }
  menuBtn.addEventListener('click', function () {
    menuBtn.setAttribute('aria-expanded', 'true');
    openOverlay(menu, menuBtn, $('[data-close-menu]', menu));
  });
  $all('[data-close-menu]', menu).forEach(function (el) { el.addEventListener('click', closeMenu); });

  /* ------------------------------------------------------------
     Case studies: focus + tiles
     ------------------------------------------------------------ */
  var focus = $('#focus'), tiles = $('#tiles'), current = 0;

  tiles.innerHTML = CASES.map(function (c, i) {
    return '<button type="button" class="tile" data-i="' + i + '" aria-pressed="false">' +
      '<span class="tile-top"><span class="tile-n">0' + (i + 1) + '</span><span class="tile-now">Viewing</span></span>' +
      '<span class="tile-t">' + esc(c.title) + '</span>' +
      '<span class="tile-d">' + esc(c.teaser) + '</span>' +
      '<span class="tile-m">' + esc(c.metric + ' ' + c.metricLabel) + '</span></button>';
  }).join('');

  function renderFocus(i, animate) {
    var c = CASES[i];
    current = i;
    var left = $('[data-f="left"]', focus), metric = $('[data-f="metric"]', focus);
    left.innerHTML =
      '<p class="f-ctx">' + esc(c.context) + '</p>' +
      '<h3 class="f-title">' + esc(c.title) + '</h3>' +
      '<p class="f-p"><b>Problem. </b>' + esc(c.problem) + '</p>' +
      '<p class="f-p"><b>What was built. </b>' + esc(c.built) + '</p>' +
      '<ul class="checks">' + c.decisions.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul>' +
      '<div class="tags">' + c.tags.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>';
    metric.innerHTML = '<p class="f-metric">' + esc(c.metric) + '</p><p class="f-metric-l">' + esc(c.metricLabel) + '</p>';
    $('[data-f="nodes"]', focus).innerHTML = c.nodes.map(function (n, j) {
      return (j ? '<span class="vline" aria-hidden="true"><span class="vdot"></span></span>' : '') + '<span class="vnode">' + esc(n) + '</span>';
    }).join('');
    $('[data-f="result"]', focus).textContent = 'Result: ' + c.result;
    $all('.tile', tiles).forEach(function (t, j) { t.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
    if (animate && !reduceMotion) {
      [left, metric].forEach(function (el) { el.classList.remove('swap'); void el.offsetWidth; el.classList.add('swap'); });
    }
  }
  tiles.addEventListener('click', function (e) {
    var t = e.target.closest('.tile');
    if (t) renderFocus(+t.getAttribute('data-i'), true);
  });
  renderFocus(0, false);

  /* ------------------------------------------------------------
     Case study modal
     ------------------------------------------------------------ */
  var cs = $('#cs'), csBody = $('#cs-body'), csModal = $('.modal', cs);

  function renderCase(i) {
    var c = CASES[i], n = CASES.length;
    var arch = '<div class="arch-row">' + c.arch.map(function (a, j) {
      return (j ? '<span class="arch-arrow" aria-hidden="true">→</span>' : '') +
        '<div class="arch-node' + (a[2] ? ' on' : '') + '"><b>' + esc(a[0]) + '</b><small>' + esc(a[1]) + '</small></div>';
    }).join('') + '</div>' +
      (c.archAlt ? '<div class="arch-alt"><span aria-hidden="true" style="color:#B8402F">↳</span><span class="box">' + esc(c.archAlt[0]) + '</span><span aria-hidden="true" style="color:#B8402F">→</span><span class="box">' + esc(c.archAlt[1]) + '</span></div>' : '');

    var results;
    if (c.table) {
      results = '<div><h3 class="m-h">' + esc(c.table.title) + '</h3><div class="tbl-wrap"><table class="tbl"><thead><tr>' +
        '<th scope="col">Tenant</th><th scope="col" class="r">Before</th><th scope="col" class="r">After</th><th scope="col" style="width:38%">New runtime vs original</th></tr></thead><tbody>' +
        c.table.rows.map(function (r) {
          return '<tr><td class="b">' + esc(r[0]) + '</td><td class="r" style="color:#586176">' + esc(r[1]) + '</td><td class="r b">' + esc(r[2]) + '</td><td><div class="mbar"><i style="width:' + r[3] + '%"></i></div></td></tr>';
        }).join('') + '</tbody></table></div></div>';
    } else {
      results = '<div><h3 class="m-h">' + esc(c.list.title) + '</h3><ul class="m-ul">' + c.list.items.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>';
    }

    csBody.innerHTML =
      '<div class="m-head">' +
        '<div class="row-between"><span class="tag-white">Case study 0' + (i + 1) + ' of 0' + n + '</span>' +
        '<button type="button" class="x" aria-label="Close case study" data-close-case><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div>' +
        '<p class="m-ctx">' + esc(c.contextLong) + '</p>' +
        '<h2 class="m-title" id="cs-title">' + esc(c.title) + '</h2>' +
        '<div class="m-tags">' + c.tags.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' +
      '</div>' +
      '<div class="m-body">' +
        '<div class="m-stats">' + c.stats.map(function (s) { return '<div><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></div>'; }).join('') + '</div>' +
        '<div class="m-two"><div><h3 class="m-h">The problem</h3><p class="m-p">' + esc(c.problemLong) + '</p></div>' +
        '<div><h3 class="m-h">What was built</h3><p class="m-p">' + esc(c.builtLong) + '</p></div></div>' +
        '<div><h3 class="m-h">Architecture</h3><div class="arch"><div class="win win-sm"><div class="win-bar"><span class="dots3"><i></i><i></i><i></i></span><span class="mono">architecture</span></div><div class="arch-flow">' + arch + '</div></div></div></div>' +
        '<div><h3 class="m-h">Key decisions &amp; trade-offs</h3><div class="decs">' + c.decisionsLong.map(function (d, j) {
          return '<div><span class="dn">0' + (j + 1) + '</span><h4>' + esc(d[0]) + '</h4><p>' + esc(d[1]) + '</p></div>';
        }).join('') + '</div></div>' +
        '<div class="m-two"><div><h3 class="m-h">Challenges</h3><ul class="m-ul">' + c.challenges.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="role-box"><p class="eyebrow eyebrow-dark" style="margin-bottom:8px">My role</p><p>' + esc(c.role) + '</p></div></div>' +
        results +
      '</div>' +
      '<div class="m-foot">' +
        '<button type="button" class="m-nav" data-case-go="' + (i - 1) + '"' + (i === 0 ? ' disabled' : '') + '>← Previous</button>' +
        '<button type="button" class="m-nav" data-close-case>Close</button>' +
        (i < n - 1 ? '<button type="button" class="btn btn-blue" data-case-go="' + (i + 1) + '">Next: ' + esc(CASES[i + 1].title) + ' →</button>' : '<button type="button" class="btn btn-blue" data-close-case>Back to the page</button>') +
      '</div>';
    cs.scrollTop = 0;
  }

  $('[data-open-case]').addEventListener('click', function (e) {
    renderCase(current);
    openOverlay(cs, e.currentTarget, csModal);
  });
  cs.addEventListener('click', function (e) {
    if (e.target.closest('[data-close-case]')) { closeOverlay(cs); return; }
    var go = e.target.closest('[data-case-go]');
    if (go) { renderCase(+go.getAttribute('data-case-go')); csModal.focus({ preventScroll: true }); }
  });

  /* ------------------------------------------------------------
     Fit checker
     Recruiters paste or upload a job description (PDF / .txt), or tap
     requirements. Matching is keyword-based against his resume and runs
     entirely in the browser: nothing is uploaded or stored.
     Status: 'yes' = on his resume (with proof), 'rel' = related experience,
             'no'  = not on his resume.
     ------------------------------------------------------------ */
  var CAREER_START = new Date(2022, 7, 1);   // August 2022, first full-time role
  var YEARS = Math.max(1, Math.floor((Date.now() - CAREER_START.getTime()) / (365.25 * 864e5)));
  var SCRIPT_BASE = (document.currentScript && document.currentScript.src) || location.href;
  var PDFJS_URL = new URL('pdf.min.mjs', SCRIPT_BASE).href;
  var PDFJS_WORKER_URL = new URL('pdf.worker.min.mjs', SCRIPT_BASE).href;
  var NOT = 'Not on his resume';

  function K(id, label, s, proof, aliases, caseSensitive) {
    return { id: id, label: label, s: s, proof: proof, a: aliases || [], cs: caseSensitive || [] };
  }
  var SKILLS = [
    // languages
    K('python', 'Python', 'yes', YEARS + '+ years across Aviso AI, Zopper and TravClan', ['python']),
    K('javascript', 'JavaScript', 'yes', 'JavaScript for Node.js services at TravClan', ['javascript', 'ecmascript']),
    K('sql', 'SQL', 'yes', 'MySQL in production; query optimization behind 90% faster dashboards', ['sql']),
    K('java', 'Java', 'rel', 'Core Java on his resume; recent production work is Python and Node.js', ['java', 'core java', 'j2ee', 'jvm']),
    K('typescript', 'TypeScript', 'rel', 'Not on his resume; writes JavaScript for Node.js', ['typescript']),
    K('go', 'Go', 'no', NOT, ['golang'], ['\\bGo\\b(?![\\s-]+(?:to|through|beyond|above|over|ahead|back|into|out|live|deep|further|the extra|-to-market))']),
    K('rust', 'Rust', 'no', NOT, ['rust']),
    K('scala', 'Scala', 'no', NOT, ['scala']),
    K('kotlin', 'Kotlin', 'no', NOT, ['kotlin']),
    K('cpp', 'C++', 'no', NOT, ['c++']),
    K('csharp', 'C# / .NET', 'no', NOT, ['c#', '.net', 'asp.net']),
    K('ruby', 'Ruby', 'no', NOT, ['ruby', 'rails']),
    K('php', 'PHP', 'no', NOT, ['php', 'laravel']),
    // frameworks & APIs
    K('django', 'Django / DRF', 'yes', 'Django at all 3 companies; partner APIs in DRF processing 50,000+ records', ['django', 'django rest framework', 'drf']),
    K('node', 'Node.js', 'yes', 'Hotel search-to-booking flows on Node.js behind 7x GMV growth', ['node.js', 'nodejs', 'node js', 'express.js', 'expressjs'], ['\\bNode\\b']),
    K('rest', 'REST APIs', 'yes', 'Optimized REST APIs across the Hotels, Flights and OnTrip apps', ['restful', 'rest api', 'rest apis', 'rest-based', 'rest services', 'api design', 'api development'], ['\\bREST\\b']),
    K('flask', 'Flask / FastAPI', 'rel', 'Not on his resume; deep experience with Django, another Python web framework', ['flask', 'fastapi']),
    K('spring', 'Spring', 'no', NOT, ['spring boot', 'springboot', 'spring framework']),
    K('react', 'React', 'rel', 'ReactJS listed as a secondary skill; his focus is backend', ['react', 'reactjs', 'react.js']),
    K('frontend', 'Frontend', 'rel', 'Backend-focused; ReactJS listed as a secondary skill', ['frontend', 'front-end', 'front end']),
    K('graphql', 'GraphQL', 'no', NOT, ['graphql']),
    K('grpc', 'gRPC', 'no', NOT, ['grpc', 'protobuf', 'protocol buffers']),
    // architecture
    K('microservices', 'Microservices', 'yes', 'Refactored 2 microservices; containerized 4 with Docker', ['microservice', 'microservices', 'micro-services', 'service-oriented', 'soa']),
    K('system-design', 'System design', 'yes', 'Co-designed an org-wide job platform and authored its HLD/LLD', ['system design', 'systems design', 'high-level design', 'high level design', 'low-level design', 'low level design', 'hld', 'lld', 'software architecture', 'architecture', 'design documents', 'design docs']),
    K('distributed', 'Distributed systems / scale', 'yes', 'Multi-tenant platform: isolated pods, per-customer limits, auto-retries', ['distributed systems', 'distributed system', 'distributed computing', 'scalable', 'scalability', 'high availability', 'high-availability', 'fault tolerant', 'fault-tolerant', 'resilient', 'reliability']),
    K('multitenant', 'Multi-tenant architecture', 'yes', 'Multi-tenant job platform with per-customer concurrency limits', ['multi-tenant', 'multitenant', 'multi tenant', 'multi-tenancy']),
    K('performance', 'Performance optimization', 'yes', 'Dashboards 20s → under 2s; largest batch job 60h → 12h', ['performance optimization', 'performance tuning', 'performance', 'optimization', 'optimisation', 'low latency', 'low-latency', 'latency']),
    K('integrations', 'Third-party integrations', 'yes', 'Bank, supplier (Expedia, Hotelbeds) and partner API integrations', ['third-party', 'third party', 'api integration', 'api integrations', 'integrations', 'partner apis', 'external apis']),
    // cloud & devops
    K('aws', 'AWS', 'yes', 'EKS, Fargate, SQS and Step Functions in production', ['aws', 'amazon web services', 'fargate']),
    K('kubernetes', 'Kubernetes', 'yes', 'Multi-tenant job platform on AWS EKS: largest job 60h → 12h', ['kubernetes', 'k8s', 'eks']),
    K('docker', 'Docker / containers', 'yes', 'Containerized 4 microservices with Docker', ['docker', 'containers', 'containerization', 'containerisation', 'containerized']),
    K('cicd', 'CI/CD', 'yes', 'CI/CD with Jenkins', ['ci/cd', 'ci-cd', 'ci cd', 'continuous integration', 'continuous delivery', 'continuous deployment', 'jenkins']),
    K('cloud', 'Cloud', 'yes', 'Runs production workloads on AWS (EKS, Fargate, SQS)', ['cloud', 'cloud-native', 'cloud native']),
    K('lambda', 'AWS Lambda / serverless', 'rel', 'Not on his resume; runs serverless containers on AWS Fargate', ['aws lambda', 'lambda', 'serverless']),
    K('gcp', 'GCP', 'no', NOT, ['gcp', 'google cloud', 'bigquery']),
    K('azure', 'Azure', 'no', NOT, ['azure']),
    K('terraform', 'Terraform / IaC', 'no', NOT, ['terraform', 'infrastructure as code', 'cloudformation', 'pulumi']),
    K('linux', 'Linux', 'no', NOT, ['linux', 'unix', 'shell scripting', 'bash']),
    K('observability', 'Monitoring & logging', 'yes', 'Structured logging and live monitoring; Splunk and the ELK stack', ['monitoring', 'observability', 'logging', 'alerting', 'splunk']),
    K('obs-tools', 'Prometheus / Grafana / Datadog', 'rel', 'Not on his resume; uses Splunk and the ELK stack', ['prometheus', 'grafana', 'datadog', 'new relic', 'opentelemetry']),
    K('nginx', 'NGINX', 'yes', 'NGINX in his DevOps stack', ['nginx']),
    K('git', 'Git', 'yes', 'Git in daily use', ['git', 'github', 'gitlab', 'bitbucket', 'version control']),
    // data
    K('databases', 'Databases', 'yes', 'MySQL, MongoDB, Redis and Elasticsearch in production', ['database', 'databases', 'data modeling', 'data modelling', 'schema design', 'rdbms', 'relational databases']),
    K('mysql', 'MySQL', 'yes', 'MySQL at Zopper and TravClan', ['mysql']),
    K('postgres', 'PostgreSQL', 'rel', 'Not on his resume; strong in MySQL (relational SQL)', ['postgresql', 'postgres']),
    K('mongodb', 'MongoDB', 'yes', 'MongoDB query optimization: dashboards 20s → under 2s', ['mongodb', 'mongo', 'nosql']),
    K('redis', 'Redis', 'yes', 'Redis queues feeding ~200 job deployments', ['redis']),
    K('cache', 'Caching', 'yes', 'Caching layer behind 90% faster dashboards', ['caching', 'cache']),
    K('elasticsearch', 'Elasticsearch', 'yes', 'Ranked 1M+ hotel reviews in Elasticsearch; ELK stack', ['elasticsearch', 'elastic search', 'elk', 'opensearch', 'kibana', 'logstash']),
    K('pipelines', 'Data pipelines', 'yes', '~200 orchestrated job deployments on Prefect; 33% lower compute cost', ['data pipeline', 'data pipelines', 'etl', 'elt', 'batch processing', 'batch jobs', 'workflow orchestration', 'job orchestration', 'orchestration', 'job scheduling', 'workflows']),
    K('prefect', 'Prefect', 'yes', 'Built the org-wide job platform on Prefect', ['prefect']),
    K('airflow', 'Airflow', 'rel', 'Not on his resume; built on Prefect, a similar workflow orchestrator', ['airflow']),
    K('databricks', 'Databricks', 'yes', 'Migrated Databricks notebook jobs; Databricks Workflows', ['databricks', 'delta lake']),
    K('spark', 'Spark', 'rel', 'Runs Databricks (Spark-based) jobs; Spark not listed separately', ['spark', 'pyspark']),
    K('stepfunctions', 'AWS Step Functions', 'yes', 'Step Functions + SQS fallback backend (POC)', ['step functions', 'step function']),
    K('queues', 'Queues / event-driven', 'yes', 'Event-driven job runner fed by Redis queues; AWS SQS', ['message queue', 'message queues', 'message broker', 'messaging', 'queueing', 'queuing', 'event-driven', 'event driven', 'pub/sub', 'pubsub', 'asynchronous processing', 'async processing', 'sqs']),
    K('kafka', 'Kafka', 'rel', 'Not on his resume; built event-driven queues with Redis and AWS SQS', ['kafka']),
    K('rabbitmq', 'RabbitMQ / Celery', 'rel', 'Not on his resume; built event-driven queues with Redis and AWS SQS', ['rabbitmq', 'activemq', 'celery']),
    // AI
    K('llm', 'LLM / AI', 'yes', 'LLM workflows on the Claude API; AI Deal Insights POC', ['llm', 'llms', 'large language model', 'large language models', 'generative ai', 'gen ai', 'genai', 'gen-ai', 'prompt engineering', 'ai agents', 'agentic']),
    K('claude', 'Claude / Anthropic', 'yes', 'Built LLM workflows and a POC on the Claude API', ['claude', 'anthropic']),
    K('langchain', 'LangChain', 'yes', 'LLM workflows with LangChain', ['langchain']),
    K('n8n', 'n8n', 'yes', 'Automation workflows with n8n', ['n8n']),
    K('openai', 'OpenAI', 'rel', 'Not on his resume; builds on Anthropic’s Claude API', ['openai', 'gpt-4', 'gpt-4o', 'chatgpt']),
    K('ml', 'Machine learning', 'no', NOT + '; works with LLM APIs', ['machine learning', 'deep learning', 'pytorch', 'tensorflow', 'scikit-learn', 'mlops'], ['\\bML\\b']),
    // domain & ways of working
    K('payments', 'Payments', 'yes', 'Bank payout integration: 10,000+ encrypted payouts a month, daily reconciliation', ['payment', 'payments', 'payouts', 'fintech', 'banking', 'upi', 'reconciliation']),
    K('security', 'Encryption & security', 'yes', 'Certificate-based encryption for 10,000+ bank payouts a month', ['encryption', 'cryptography', 'data security', 'secure coding', 'pci-dss', 'pci dss']),
    K('leadership', 'Team leadership', 'yes', 'Manages and mentors 4 SDEs', ['mentor', 'mentoring', 'mentorship', 'mentored', 'team lead', 'tech lead', 'technical lead', 'lead engineer', 'leadership', 'lead a team', 'leading a team', 'people management', 'manage a team', 'managing a team', 'engineering manager']),
    K('code-review', 'Code reviews', 'yes', 'Leads code reviews for his team', ['code review', 'code reviews', 'pull request reviews']),
    K('testing', 'Automated testing', 'no', NOT, ['unit test', 'unit tests', 'unit testing', 'pytest', 'tdd', 'test-driven', 'integration tests', 'integration testing', 'test automation']),
    K('agile', 'Agile / Scrum', 'no', NOT, ['agile', 'scrum'])
  ];
  var DEGREE = K('degree', 'Degree', 'yes', 'B.Tech, Computer Science · CGPA 9.41', ['bachelor', "bachelor's", 'bachelors', 'b.tech', 'btech', 'b.e.', 'computer science', 'engineering degree', 'cs degree']);
  // default chips (always shown)
  var CHIP_ORDER = ['python', 'django', 'node', 'microservices', 'aws', 'kubernetes', 'pipelines', 'databases', 'system-design', 'leadership', 'payments', 'llm', 'go', 'kafka', 'gcp'];

  var BY_ID = {};
  function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&'); }
  function compile(k) {
    k.re = k.a.map(function (al) { return new RegExp('(^|[^a-z0-9])(' + escRe(al) + ')(?=$|[^a-z0-9])', 'g'); });
    k.reCs = k.cs.map(function (p) { return new RegExp(p, 'g'); });
  }
  SKILLS.forEach(function (k) { compile(k); BY_ID[k.id] = k; });
  compile(DEGREE);

  function findSkill(k, text, lower) {
    var best = null;
    k.re.forEach(function (re) {
      re.lastIndex = 0;
      var m = re.exec(lower);
      if (m) { var pos = m.index + m[1].length; if (!best || pos < best.pos) best = { pos: pos, found: text.substr(pos, m[2].length) }; }
    });
    k.reCs.forEach(function (re) {
      re.lastIndex = 0;
      var m = re.exec(text);
      if (m && (!best || m.index < best.pos)) best = { pos: m.index, found: m[0] };
    });
    return best;
  }
  function findYears(text) {
    var re = /(\d{1,2})\s*\+?\s*(?:(?:-|–|—|to)\s*\d{1,2}\s*\+?\s*)?(?:years?|yrs?)/gi, m;
    while ((m = re.exec(text))) {
      var win = text.slice(Math.max(0, m.index - 80), m.index + m[0].length + 80).toLowerCase();
      var n = +m[1];
      if (win.indexOf('experienc') > -1 && n > 0 && n < 30) return { min: n, found: m[0].trim() };
    }
    return null;
  }
  function guessRole(text) {
    var m = text.match(/(?:job\s*title|position|role|designation)\s*[:\-–]\s*([^\n\r]{3,70})/i);
    if (m) return m[1].trim().replace(/[.;,]+$/, '');
    var lines = text.split(/\n/).map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 5);
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].length <= 70 && /(engineer|developer|sde|architect|programmer|tech lead|engineering manager)/i.test(lines[i])) return lines[i].replace(/[.;,:]+$/, '');
    }
    return '';
  }

  var DEFAULT_PICKS = ['python', 'node', 'system-design'];   // pre-selected chips
  var selected = DEFAULT_PICKS.slice(), foundAs = {}, extraChips = [], jdMeta = null;
  var fit = $('#fit'), fab = $('#fab'), chips = $('#fit-chips'), res = $('#fit-res');
  var mail = $('#fit-mail'), gmail = $('#fit-gmail'), copyBtn = $('#fit-copy');
  var jdText = $('#jd-text'), jdFile = $('#jd-file'), jdStatus = $('#jd-status');
  var STATUS_TXT = { yes: 'on his resume', rel: 'related experience', no: 'not on his resume' };

  function status(msg, isErr) { jdStatus.textContent = msg; jdStatus.classList.toggle('err', !!isErr); }

  function renderChips() {
    chips.innerHTML = CHIP_ORDER.concat(extraChips).map(function (id) {
      var k = BY_ID[id], cls = [k.s === 'no' ? 'no' : '', k.s === 'rel' ? 'rel' : '', extraChips.indexOf(id) > -1 ? 'jd' : ''].join(' ').trim();
      return '<button type="button" data-id="' + id + '" aria-pressed="' + (selected.indexOf(id) > -1) + '"' + (cls ? ' class="' + cls + '"' : '') + '>' + esc(k.label) + '</button>';
    }).join('');
  }

  function currentItems() {
    var items = selected.map(function (id) { var k = BY_ID[id]; return { id: id, label: k.label, s: k.s, proof: k.proof, found: foundAs[id] }; });
    if (jdMeta && jdMeta.years) {
      var need = jdMeta.years.min, s = YEARS >= need ? 'yes' : (need - YEARS === 1 ? 'rel' : 'no');
      items.push({ id: 'years', label: 'Experience', s: s, proof: 'Role asks for ' + need + '+ years · he has ' + YEARS + '+ years (since 2022)', found: jdMeta.years.found });
    }
    if (jdMeta && jdMeta.degree) items.push({ id: 'degree', label: 'Degree', s: 'yes', proof: DEGREE.proof, found: jdMeta.degree.found });
    return items;
  }

  function li(it) {
    var cls = it.s === 'yes' ? 'mk' : (it.s === 'rel' ? 'mk mk-rel' : 'mk mk-no');
    var found = it.found && it.found.toLowerCase() !== it.label.toLowerCase() ? ' <em>found as “' + esc(it.found) + '”</em>' : '';
    return '<li><span class="' + cls + '" aria-hidden="true"></span><div><p class="fl-t">' + esc(it.label) + found +
      '<span class="sr"> — ' + STATUS_TXT[it.s] + '</span></p><p class="fl-p">' + esc(it.proof) + '</p></div></li>';
  }

  function renderResult() {
    var items = currentItems();
    if (!items.length) {
      res.innerHTML = '<p class="fit-empty">Paste a job description to see how his experience lines up with it, or tap requirements.</p>';
    } else {
      var yes = items.filter(function (i) { return i.s === 'yes'; }), rel = items.filter(function (i) { return i.s === 'rel'; }), no = items.filter(function (i) { return i.s === 'no'; });
      var sub = [];
      if (rel.length) sub.push(rel.length + ' related');
      if (no.length) sub.push(no.length + ' not on his resume');
      var html = '<div class="fit-score"><b>' + yes.length + '</b><span>of ' + items.length + ' requirements matched</span></div>' +
        '<p class="fit-sub">' + (sub.length ? sub.join(' · ') : 'Every requirement matched') + (jdMeta ? ' · from the job description' : '') + '</p>';
      if (yes.length) html += '<p class="fit-group">On his resume</p><ul class="fit-list">' + yes.map(li).join('') + '</ul>';
      if (rel.length) html += '<p class="fit-group">Related experience</p><ul class="fit-list">' + rel.map(li).join('') + '</ul>';
      if (no.length) html += '<p class="fit-group">Not on his resume</p><ul class="fit-list">' + no.map(li).join('') + '</ul>';
      res.innerHTML = html;
    }
    renderEmail(items);
  }

  function field(sel) { var el = $(sel); return el ? el.value.trim() : ''; }
  var lastEmail = null;
  function renderEmail(items) {
    var name = field('#rec-name') || '[Your name]', co = field('#rec-company') || '[Company]', role = field('#rec-role') || '[Role title]';
    var yes = items.filter(function (i) { return i.s === 'yes' && i.id !== 'years' && i.id !== 'degree'; }).slice(0, 6);
    var core = function (i) { return i.id !== 'years' && i.id !== 'degree'; };
    var rel = items.filter(function (i) { return i.s === 'rel' && core(i); }).map(function (i) { return i.label; });
    var no = items.filter(function (i) { return i.s === 'no' && core(i); }).map(function (i) { return i.label; });
    var yrs = jdMeta && jdMeta.years;
    var url = /^https?:/.test(location.href) ? location.href.split('#')[0] : '';
    var lines = ['Hi Ujjawal,', '', 'I’m ' + name + ' from ' + co + '. I came across your portfolio' + (url ? ' (' + url + ')' : '') +
      ' and would like to talk to you about our ' + role + ' role.'];
    if (yes.length) { lines.push('', 'Your experience lines up well with what we need:'); yes.forEach(function (i) { lines.push('• ' + i.label + ': ' + i.proof); }); }
    if (rel.length) lines.push('', 'We’d also like to talk about: ' + rel.join(', ') + '.');
    if (no.length) lines.push('', 'The role also involves: ' + no.join(', ') + '.');
    if (yrs) lines.push('', 'The role asks for ' + yrs.min + '+ years of experience.');
    lines.push('', 'Would you be open to a 20–30 minute call this week? If so, please share a few times that work for you and your current notice period.',
      '', 'Best regards,', name, co);
    var subject = 'Opportunity: ' + role + ' at ' + co, body = lines.join('\n');
    lastEmail = { subject: subject, body: body };
    mail.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    gmail.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(EMAIL) + '&su=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  function analyze(text) {
    var lower = text.toLowerCase(), hits = [];
    SKILLS.forEach(function (k) { var f = findSkill(k, text, lower); if (f) hits.push({ id: k.id, pos: f.pos, found: f.found }); });
    hits.sort(function (a, b) { return a.pos - b.pos; });
    selected = hits.map(function (h) { return h.id; });
    foundAs = {}; hits.forEach(function (h) { foundAs[h.id] = h.found; });
    extraChips = selected.filter(function (id) { return CHIP_ORDER.indexOf(id) < 0; });
    jdMeta = { years: findYears(text), degree: findSkill(DEGREE, text, lower) };
    var roleEl = $('#rec-role');
    if (roleEl && !roleEl.value.trim()) { var g = guessRole(text); if (g) roleEl.value = g; }
    var n = hits.length + (jdMeta.years ? 1 : 0) + (jdMeta.degree ? 1 : 0);
    status(n ? 'Found ' + n + ' requirements in the job description.' : 'No known requirements found. Paste the full description, or tap requirements below.', !n);
    renderChips(); renderResult();
    if (n && window.innerWidth <= 1024) res.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  // PDF text extraction (pdf.js, hosted with the site, loaded only when needed)
  var pdfLib = null;
  function loadPdfJs() {
    if (pdfLib) return pdfLib;
    pdfLib = import(PDFJS_URL).then(function (lib) { lib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL; return lib; })
      .catch(function (e) { pdfLib = null; throw e; });
    return pdfLib;
  }
  function readPdf(file) {
    return Promise.all([loadPdfJs(), file.arrayBuffer()]).then(function (r) {
      return r[0].getDocument({ data: new Uint8Array(r[1]) }).promise;
    }).then(function (doc) {
      var jobs = [];
      for (var i = 1; i <= Math.min(doc.numPages, 12); i++) {
        jobs.push(doc.getPage(i).then(function (pg) { return pg.getTextContent(); }).then(function (tc) {
          return tc.items.map(function (it) { return (it.str || '') + (it.hasEOL ? '\n' : ''); }).join('');
        }));
      }
      return Promise.all(jobs).then(function (pages) { return pages.join('\n'); });
    });
  }
  function handleFile(f) {
    if (!f) return;
    var isPdf = /pdf$/i.test(f.type) || /\.pdf$/i.test(f.name);
    var isTxt = /^text\//.test(f.type) || /\.(txt|md)$/i.test(f.name);
    if (!isPdf && !isTxt) { status('Please upload a PDF or a .txt file.', true); return; }
    if (f.size > 8 * 1024 * 1024) { status('That file is over 8 MB. Paste the text instead.', true); return; }
    status('Reading ' + f.name + '…');
    (isPdf ? readPdf(f) : f.text()).then(function (t) {
      t = String(t || '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
      if (t.length < 40) {
        status(isPdf ? 'This PDF has no selectable text (it may be a scan). Paste the description instead.' : 'That file looks empty.', true);
        return;
      }
      jdText.value = t;
      analyze(t);
    }).catch(function () { status('Couldn’t read that file here. Paste the description instead.', true); });
  }

  $('#jd-go').addEventListener('click', function () {
    var t = jdText.value.trim();
    if (!t) { status('Paste a job description or upload a PDF first.', true); jdText.focus(); return; }
    analyze(t);
  });
  jdText.addEventListener('keydown', function (e) { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') $('#jd-go').click(); });
  $('#jd-clear').addEventListener('click', function () {
    jdText.value = ''; jdFile.value = ''; selected = DEFAULT_PICKS.slice(); foundAs = {}; extraChips = []; jdMeta = null;
    status('Runs in your browser. Nothing is uploaded or stored.');
    renderChips(); renderResult(); jdText.focus();
  });
  jdFile.addEventListener('change', function () { handleFile(jdFile.files[0]); });
  var dropZone = $('.fit-in', fit);
  ['dragenter', 'dragover'].forEach(function (ev) { dropZone.addEventListener(ev, function (e) { e.preventDefault(); dropZone.classList.add('drag'); }); });
  ['dragleave', 'drop'].forEach(function (ev) { dropZone.addEventListener(ev, function (e) { e.preventDefault(); dropZone.classList.remove('drag'); }); });
  dropZone.addEventListener('drop', function (e) { if (e.dataTransfer && e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]); });

  chips.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    var id = b.getAttribute('data-id'), at = selected.indexOf(id);
    if (at > -1) selected.splice(at, 1); else selected.push(id);
    renderChips(); renderResult();
  });
  ['#rec-name', '#rec-company', '#rec-role'].forEach(function (sel) { $(sel).addEventListener('input', function () { renderEmail(currentItems()); }); });

  copyBtn.addEventListener('click', function () {
    var text = 'To: ' + EMAIL + '\nSubject: ' + lastEmail.subject + '\n\n' + lastEmail.body;
    function done(ok) { copyBtn.textContent = ok ? 'Copied' : 'Copy failed'; setTimeout(function () { copyBtn.textContent = 'Copy email'; }, 1800); }
    if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); }); return; }
    var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { done(document.execCommand('copy')); } catch (err) { done(false); }
    document.body.removeChild(ta);
  });

  renderChips();
  renderResult();

  // launcher: bounce + ring until opened once
  if (!store('fitSeen')) fab.classList.add('bounce');

  // Collapsed icon by default; expands to show its label while the visitor scrolls,
  // tucks back in shortly after scrolling stops. Shown expanded for a moment on load.
  var fabTimer = null;
  function expandFab(ms) {
    fab.classList.add('open');
    clearTimeout(fabTimer);
    fabTimer = setTimeout(function () { fab.classList.remove('open'); }, ms || 1600);
  }
  window.addEventListener('scroll', function () { expandFab(1600); }, { passive: true });
  setTimeout(function () { expandFab(3000); }, 900);

  function closeFit() { fab.setAttribute('aria-expanded', 'false'); fab.hidden = false; closeOverlay(fit); }
  fab.addEventListener('click', function () {
    fab.classList.remove('bounce');
    store('fitSeen', '1');
    fab.setAttribute('aria-expanded', 'true');
    fab.hidden = true;
    openOverlay(fit, null, $('.drawer', fit));
  });
  $all('[data-close-fit]', fit).forEach(function (el) { el.addEventListener('click', function () { closeFit(); fab.focus(); }); });

  /* ------------------------------------------------------------
     Live job timer in the hero dashboard
     ------------------------------------------------------------ */
  var timerEl = $('[data-timer]'), secs = 4327;
  function fmt(s) { var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return h + 'h ' + (m < 10 ? '0' : '') + m + 'm ' + (x < 10 ? '0' : '') + x + 's'; }
  if (timerEl && !reduceMotion) setInterval(function () { secs += 1; timerEl.textContent = fmt(secs); }, 1000);

  /* ------------------------------------------------------------
     Scroll reveal, count-up, timeline fill, chart draw
     ------------------------------------------------------------ */
  function countUp(el) {
    var to = +el.getAttribute('data-to'), start = null, dur = 1400;
    if (reduceMotion) { el.textContent = to; return; }
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = '0';
    requestAnimationFrame(step);
  }

  var targets = $all('.rv, .tl, .numbers-grid, .stats');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        if (en.target.classList.contains('stats')) $all('.cu', en.target).forEach(countUp);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add('in'); });
  }
})();
