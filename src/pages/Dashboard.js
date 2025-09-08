import React, { useState } from "react";
import ReportTable from "../components/ReportTable";

const Dashboard = () => {
  const generateData = () => {
    const arr = [];
    for (let i = 1; i <= 100; i++) {
      arr.push({
        clientId: `C${String(i).padStart(3, "0")}`,
        clientName: `Customer ${i}`,
        product: `Product ${i % 5 === 0 ? "X" : "Y"}`,
        feeType: i % 2 === 0 ? "Base" : "Enrollment",
        paymentMonth: `2025-${String((i % 12) + 1).padStart(2, "0")}`,
        quantity: Math.floor(Math.random() * 500) + 1
      });
    }
    return arr;
  };

  const [data] = useState(generateData());

  const columns = [
    { Header: "Client ID", accessor: "clientId" },
    { Header: "Client Name", accessor: "clientName" },
    { Header: "Product", accessor: "product" },
    { Header: "Fee Type", accessor: "feeType" },
    { Header: "Payment Month", accessor: "paymentMonth" },
    { Header: "Quantity", accessor: "quantity" }
  ];

  const handleApprove = (row) => {
    alert(`Approved: ${row.clientName}, ${row.product}`);
  };

  const handleReject = (row) => {
    alert(`Rejected: ${row.clientName}, ${row.product}`);
  };

  return (
    <div>
      <h1>TBP Approval Dashboard</h1>
      <ReportTable
        columns={columns}
        data={data}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default Dashboard;
