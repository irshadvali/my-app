import React, { useState, useEffect } from "react";
import styled from "styled-components";

// Styled components
const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const Select = styled.select`
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Input = styled.input`
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: ${(props) => (props.variant === "approve" ? "#4CAF50" : props.variant === "reject" ? "#E74C3C" : "#3498DB")};
  color: #fff;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 10px;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
`;

const Header = styled(Grid)`
  font-weight: bold;
  background: #f9f9f9;
`;

const Row = styled(Grid)`
  &:hover {
    background: #f5f5f5;
  }
`;

const Guardrail = styled.div`
  margin-top: 20px;
  padding: 12px;
  background: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 6px;
  color: #856404;
`;

// Mock data generator
const generateMockData = () => {
  const clients = ["Client A", "Client B"];
  const products = ["Product X", "Product Y"];
  const feeTypes = ["Type 1", "Type 2"];
  const statuses = ["Pending", "Approved", "Rejected"];

  return Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    client: clients[i % 2],
    product: products[i % 2],
    feeType: feeTypes[i % 2],
    quantity: Math.floor(Math.random() * 100),
    status: statuses[0],
    month: `2025-${String((i % 12) + 1).padStart(2, "0")}`,
  }));
};

const FeeApprovalUI = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    month: "",
    client: "",
    product: "",
    feeType: "",
    status: "",
    search: "",
  });
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setData(generateMockData());
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleAction = (action) => {
    setData((prev) =>
      prev.map((item) =>
        selected.includes(item.id) ? { ...item, status: action } : item
      )
    );
    setSelected([]);
  };

  const zeroFill = () => {
    const newEntries = [];
    const products = ["Product X", "Product Y"];
    const feeTypes = ["Type 1", "Type 2"];
    const currentMonth = "2025-09";

    products.forEach((product) => {
      feeTypes.forEach((feeType) => {
        const exists = data.some(
          (d) => d.month === currentMonth && d.product === product && d.feeType === feeType
        );
        if (!exists) {
          newEntries.push({
            id: data.length + newEntries.length + 1,
            client: "Client A",
            product,
            feeType,
            quantity: 0,
            status: "Pending",
            month: currentMonth,
          });
        }
      });
    });

    setData((prev) => [...prev, ...newEntries]);
  };

  const exportCSV = () => {
    const headers = ["Client", "Product", "Fee Type", "Quantity", "Status", "Month"];
    const rows = filteredData.map((d) => [d.client, d.product, d.feeType, d.quantity, d.status, d.month]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fees.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredData = data.filter((item) => {
    return (
      (!filters.month || item.month === filters.month) &&
      (!filters.client || item.client === filters.client) &&
      (!filters.product || item.product === filters.product) &&
      (!filters.feeType || item.feeType === filters.feeType) &&
      (!filters.status || item.status === filters.status) &&
      (!filters.search || item.client.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  return (
    <Container>
      <h2>Fee Approval Dashboard</h2>

      <Filters>
        <Select onChange={(e) => setFilters({ ...filters, month: e.target.value })}>
          <option value="">All Months</option>
          {Array.from({ length: 13 }, (_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            return <option key={val} value={val}>{val}</option>;
          })}
        </Select>
        <Input placeholder="Search client..." onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
      </Filters>

      <Header>
        <div></div>
        <div>Client</div>
        <div>Product</div>
        <div>Fee Type</div>
        <div>Quantity</div>
        <div>Status</div>
        <div>Month</div>
      </Header>

      {filteredData.map((item) => (
        <Row key={item.id}>
          <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggleSelect(item.id)} />
          <div>{item.client}</div>
          <div>{item.product}</div>
          <div>{item.feeType}</div>
          <div>{item.quantity}</div>
          <div>{item.status}</div>
          <div>{item.month}</div>
        </Row>
      ))}

      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <Button variant="approve" disabled={!selected.length} onClick={() => handleAction("Approved")}>Approve</Button>
        <Button variant="reject" disabled={!selected.length} onClick={() => handleAction("Rejected")}>Reject</Button>
        <Button onClick={zeroFill}>Zero-Fill Missing</Button>
        <Button onClick={exportCSV}>Export CSV</Button>
      </div>

      <Guardrail>
        ⚠️ TBP Extract will be blocked until all metrics are approved.
      </Guardrail>
    </Container>
  );
};

export default FeeApprovalUI;
