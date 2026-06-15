# apre

## Week 2:
### MAJOR CHANGE M-069
#### Create an API to fetch sales data by salesperson and build an angular component to display sales by salesperson using ChartComponent with 3 unit tests each

Files impacted:

NEW
- apre-client/src/app/reports/sales/sales-by-salesperson/sales-by-salesperson.component.spec.ts
- apre-client/src/app/reports/sales/sales-by-salesperson/sales-by-salesperson.component.ts

UPDATED
- apre-client/src/app/app.routes.ts
- apre-client/src/app/layouts/main-layout/main-layout.component.ts
- apre-server/src/routes/reports/sales/index.js
- apre-server/src/routes/reports/sales/index.spec.js


-----

New sales-by-salesperson report found here: /reports/sales/sales-by-salesperson (or UI nav: Sales Reports > Sales by Salesperson)

-----

To Test:

cd apre/apre-client
npm test

cd apre/apre-server
npm test

------

To View:

cd apre/apre-client
npm install
ng server

cd apre/apre-server
npm install
npm start
