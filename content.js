// Edit this file to update your skills, projects and timeline.
window.PORTFOLIO = {
  // Photo paths are relative to index.html. Leave a field empty to show the AR mark.
  resume: 'assets/ankush-kumar-resume.pdf',
  portraits: { hero: 'assets/ankush-portrait.webp', biography: '', footer: 'assets/ankush-portrait.webp' },
  skills: [
    {title: 'Programming Languages', items: ['Java', 'Python', 'JavaScript', 'TypeScript', 'SQL', 'C++']},
    {title: 'Frameworks and Web', items: ['React', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'WebAssembly']},
    {title: 'Databases and Developer Tools', items: ['PostgreSQL', 'MySQL', 'Git', 'GitHub', 'Vitest', 'Unix fundamentals']},
    {title: 'Data and Statistics', items: ['Data analysis', 'Python statistics', 'Probability distributions', 'Statistical inference', 'Machine learning fundamentals']}
  ],
  certificates: [
  {
    "title": "Web Development",
    "items": [
      {
        "title": "Front End Web Developer Certification",
        "date": "May 2025",
        "file": "assets/certificates/frontend-developer.pdf"
      },
      {
        "title": "HTML5 – The Language",
        "date": "May 2025",
        "file": "assets/certificates/html5.pdf"
      },
      {
        "title": "CSS3",
        "date": "May 2025",
        "file": "assets/certificates/css3.pdf"
      },
      {
        "title": "JavaScript",
        "date": "May 2025",
        "file": "assets/certificates/javascript.pdf"
      }
    ]
  },
  {
    "title": "Data Science and Machine Learning",
    "items": [
      {
        "title": "Machine Learning Foundation Certification",
        "date": "May 2026",
        "file": "assets/certificates/machine-learning-foundation.pdf"
      },
      {
        "title": "Data Science Foundation Certification",
        "date": "Apr 2026",
        "file": "assets/certificates/data-science-foundation.pdf"
      },
      {
        "title": "Introduction to Data Science",
        "date": "Apr 2026",
        "file": "assets/certificates/introduction-to-data-science.pdf"
      },
      {
        "title": "Probability and Statistics using Python",
        "date": "Apr 2026",
        "file": "assets/certificates/probability-and-statistics.pdf"
      },
      {
        "title": "Probability Distribution using Python",
        "date": "Apr 2026",
        "file": "assets/certificates/probability-distribution.pdf"
      },
      {
        "title": "Statistical Inference using Python",
        "date": "Apr 2026",
        "file": "assets/certificates/statistical-inference.pdf"
      }
    ]
  },
  {
    "title": "Operating Systems",
    "items": [
      {
        "title": "Introduction to Unix",
        "date": "Dec 2024",
        "file": "assets/certificates/introduction-to-unix.pdf"
      }
    ]
  }
],
  projects: [
    {
      id: 'marketpulse', title: 'MarketPulse', category: 'BACKEND / API MONITORING', featured: true,
      status: 'Project · source available',
      short: 'Tracks availability, latency, and incidents for financial APIs.',
      description: 'An asynchronous FastAPI service runs scheduled health checks. A Next.js dashboard uses data stored in PostgreSQL to show uptime, latency, and incident history.',
      tech: ['Python', 'FastAPI', 'PostgreSQL', 'Next.js', 'TypeScript'],
      github: 'https://github.com/codedbyroy/MarketPulse',
      flow: ['Run scheduled health checks', 'Store monitoring results in PostgreSQL', 'Show uptime and incidents in the dashboard'],
      detail: 'Backend tests cover failure and recovery transitions.'
    },
    {
      id: 'nest', title: 'NEST', category: 'EMBEDDED SYSTEMS / SIMULATION', featured: true,
      status: 'Prototype · simulation results',
      short: 'Occupancy-aware classroom lighting and fan control with an ESP32 and a browser simulation.',
      description: 'An intelligent classroom energy management prototype. An ESP32 evaluates local PIR signals, applies a configurable grace period, and issues a warning before switching a zone off. The browser dashboard models building occupancy, installation cost, and payback.',
      tech: ['ESP32','C++','Arduino','PIR sensors','Python','JavaScript'],
      github: 'https://github.com/codedbyroy/NEST',
      screenshotSize: {width: 2560, height: 1664},
      screenshots: [
        {src: 'assets/nest/overview.png', caption: 'Simulated building overview', alt: 'Four-floor building model showing simulated occupancy and lighting by zone'},
        {src: 'assets/nest/room-twin.png', caption: 'Classroom digital twin', alt: 'Simulated classroom 104 with separate front and back zones, occupancy, and equipment states'},
        {src: 'assets/nest/energy.png', caption: 'Simulated energy use', alt: 'Daily energy comparison with and without occupancy control, plus breakdowns by floor and equipment'},
        {src: 'assets/nest/sources.png', caption: 'Modeled energy sources', alt: 'Estimated energy flows from solar, grid, and generator to building equipment'}
      ],
      flow: ['PIR occupancy signals','C++ decision engine','Browser simulation and dashboard'],
      detail: 'The decision core is tested outside the hardware. A JavaScript port is checked against traces from the C++ implementation. Scenario analysis, energy estimates, and payback are simulated. The firmware defaults to dry-run and bench validation is pending. The optional environmental model is experimental.'
    },
    {
      id: 'chesslens', title: 'ChessLens', category: 'ALGORITHMS / BROWSER ENGINEERING', featured: true,
      status: 'Browser application · source available',
      short: 'Stockfish-powered chess review with asynchronous evaluation and interactive analysis.',
      description: 'A chess analysis application that runs engine evaluation in the browser. It turns scores into move classifications, accuracy summaries, and an interactive evaluation graph.',
      tech: ['Next.js','TypeScript','React','Stockfish','WebAssembly','Web Workers','Vitest'],
      github: 'https://github.com/codedbyroy/chess-game-review',
      screenshotSize: {width: 2560, height: 1664},
      screenshots: [
        {src: 'assets/chesslens/board-analysis.png', caption: 'Board and engine analysis', alt: 'Chessboard alongside the Stockfish review controls and evaluation graph'},
        {src: 'assets/chesslens/review-breakdown.png', caption: 'Game review breakdown', alt: 'Game review summary with player accuracy, move classifications, feedback, and history'}
      ],
      flow: ['Import a game','Evaluate positions in a Web Worker','Review scores and move classifications'],
      detail: 'The worker separates engine computation from the React interface. The engine service exchanges UCI messages asynchronously. Vitest tests cover scoring, engine protocol parsing, and game-analysis edge cases.'
    },
    {
      id: 'agent-automation', title: 'Agent Automation', category: 'AI ORCHESTRATION / SOFTWARE DELIVERY',
      status: 'Working workflows · Shortify release example',
      short: 'Specialist agents for GitHub releases, cloud deployment, market research, and SEO.',
      description: 'I built multi-agent workflows for software delivery and recurring research. In the OpenMausBot Engineering Room, agents handle backend implementation, interface verification, release testing, and incident reporting. The delivery workflow covers GitHub pushes and cloud deployment.',
      tech: ['OpenMausBot','GitHub','Cloud deployment'],
      flow: ['Route the request in Engineering Room','Assign implementation and release checks','Push changes to GitHub','Deploy and verify in the cloud'],
      detail: 'Engineering Room sends untagged requests to Lin by default. An @mention routes a task directly to the named specialist.',
      agentRoles: [
        {name:'Lin', role:'Backend engineering', detail:'Handles services, APIs, data models, migrations, and compatibility.'},
        {name:'Pixel', role:'Frontend and accessibility', detail:'Checks rendered interactions, keyboard access, and small-screen states.'},
        {name:'Rigel', role:'QA and release readiness', detail:'Turns acceptance criteria into a risk-based test plan and reports what passed and what still needs verification.'},
        {name:'Ada', role:'Incident reporting', detail:'Summarizes interruptions and identifies outstanding checks.'}
      ],
      example: {
        title:'Shortify release',
        detail:'Lin reported pushing Shortify to GitHub. When a later run hit the shared usage limit, Ada reported that the browser countdown check and cleanup of temporary test links still needed verification.',
        projectId:'brief',
        linkLabel:'View the Brief project'
      },
      pipelines: [
        {title:'Daily Stock News', detail:'A daily workflow for following stock-market news.'},
        {title:'Market Strategy Research', detail:'A workflow for researching market strategies.'},
        {title:'SEO Growth Room', detail:'Nova follows up on search visibility for Brief and tracks SEO opportunities.'}
      ]
    },
    {
      id: 'expense-tracker', title: 'Expense Tracker', category: 'MOBILE / DATA PERSISTENCE',
      status: 'Mobile application · local and cloud modes',
      short: 'An Expo finance app with transaction tracking, budgets, and local demo mode.',
      description: 'A personal finance application for recording income, expenses, and savings. Zustand manages application state, while the transaction service supports device-local demo storage or Firebase-backed records.',
      tech: ['React Native','Expo','TypeScript','Zustand','AsyncStorage','Firebase Firestore'],
      github: 'https://github.com/codedbyroy/vibe/tree/main/app/expense-tracker',
      screenshots: [
        {src: 'assets/expense-tracker/dashboard.png', caption: 'Dashboard', alt: 'Expense Tracker home with balance, income, spending, savings, and recent activity'},
        {src: 'assets/expense-tracker/history.png', caption: 'Transaction history', alt: 'Transaction history with search and income, expense, and savings filters'},
        {src: 'assets/expense-tracker/analytics.png', caption: 'Cash flow analytics', alt: 'Seven-day cash flow chart and an insights summary'},
        {src: 'assets/expense-tracker/settings.png', caption: 'Settings', alt: 'Settings for categories, budget limits, savings goals, CSV export, and sync'}
      ],
      flow: ['Transaction form','Transaction service','AsyncStorage or Firestore'],
      detail: 'Demo mode persists transaction records in AsyncStorage without Firebase credentials. Configured cloud mode writes to Firestore and uses listeners to update the interface. The UI also checks category spending against budget thresholds.'
    },
    {
      id: 'neonvault', title: 'NeonVault Store', category: 'FRONTEND / E-COMMERCE',
      status: 'Storefront prototype · local catalog',
      short: 'A responsive storefront with product filters, sorting, and a persistent browser cart.',
      description: 'A Next.js storefront for anime collectibles. It supports category filters, price and rating sorting, product pages, and cart controls.',
      tech: ['Next.js','React','JavaScript','CSS Modules','Context API'],
      github: 'https://github.com/codedbyroy/vibe/tree/main/web/neonvault-store',
      preview: {
        src: 'assets/neonvault-store.png',
        alt: 'NeonVault Store homepage with collection navigation and a dark anime collectibles storefront',
        caption: 'NeonVault storefront prototype'
      },
      flow: ['Local product catalog','Filter and sort','Cart reducer and browser storage'],
      detail: 'Product listings and product detail routes share catalog data. Cart actions are handled by a reducer exposed through React Context. The browser stores cart state between visits.'
    },
    {
      id: 'brief', title: 'Brief', category: 'BACKEND / EDGE DEPLOYMENT',
      status: 'Live deployment',
      short: 'A deployed URL shortener with custom aliases, persistent links, and request counts.',
      description: 'Brief generates readable five-letter codes or accepts a custom alias. Short links show a timed destination preview before continuing to the original URL.',
      tech: ['TypeScript','Cloudflare Workers','Cloudflare D1','SQL','Vitest'],
      github: 'https://github.com/codedbyroy/shortify',
      demo: 'https://brief-links-roy.leggeth069.workers.dev/',
      preview: {src:'assets/brief-screenshot.png', alt:'Brief interface with the destination URL and optional alias fields', caption:'Brief link creation interface'},
      flow: ['Create or choose an alias','Store destination in D1','Resolve link and show countdown'],
      detail: 'D1 enforces unique aliases. Link history and management are scoped to the browser using a cookie. The service tracks requests to each link, which can include bots or previews. The public homepage and health route responded during verification.'
    }
  ],
  timeline: [
    {label:'Education', period:'2020–2023', title:'Diploma in Computer Science and Engineering', details:'Government Polytechnic Muzaffarpur · CGPA 7.96'},
    {label:'Industrial Training', period:'Dec 2022–Jan 2023', title:'Industrial Training Intern', details:'Tsuyo Manufacturing Pvt. Ltd. · Studied AI, machine learning, and IoT applications for electric vehicles.'},
    {label:'Education', period:'2024–2027', title:'B.Tech in Computer Science Engineering', details:'Cambridge Institute of Technology, Bengaluru · CGPA 7.52'},
    {label:'Next Role', period:'Open to work', title:'My first software developer role', details:'Seeking graduate and internship opportunities in software development, frontend, or full-stack development.', future:true}
  ]
};
