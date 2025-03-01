import React from 'react';
const Invoice = React.lazy(() => import("../../pages/invoice/Invoice"));
export const InvoiceRoutesList = {
    "childRoutes": [
        { path: "invoice", element: <Invoice /> }
    ]
}