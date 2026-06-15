# apre

## Week 3
### MINOR CHANGE m-0036
#### Display a success message after creating a new user in the UsersComponent with unit test

Files impacted:

UPDATED
- apre-client/src/app/admin/user-management/user-create/user-create.component.spec.ts (1 test updated, 1 new test)
- apre-client/src/app/admin/user-management/user-create/user-create.component.ts


-------


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

ng serve


cd apre/apre-server

npm install

npm start
