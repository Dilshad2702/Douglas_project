# Douglas Automation Project

## Setup
```bash
npm install
npx playwright install
```

## Run Tests
```bash
# Run on all browsers
npm test

# Run with browser visible
npm run test:headed

# Debug mode
npm run test:debug

# Run specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Coverage
- Cookie consent handling
- Navigation to Parfum section
- Data-driven filter testing:
  - Sale products
  - New products
  - Limited products
  - Brand filters
  - Product type filters
- Product listing validation
- Cross-browser testing (Chrome, Firefox, Safari)