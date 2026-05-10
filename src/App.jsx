import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function App() {
  const customers = ["Customer 1", "Customer 2", "Customer 3"];
  const materials = ["Sulphuric Acid", "Hydrochloric Acid"];

  const GST = 18;

  const emptyInvoice = {
    date: new Date().toISOString().split("T")[0],
    invoiceNo: Date.now(),
    customer: customers[0],
    material: materials[0],
    quantity: "",
    rate: "",
  };

  const [invoice, setInvoice] = useState(emptyInvoice);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("invoice_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("invoice_history", JSON.stringify(history));
  }, [history]);

  const subtotal = Number(invoice.quantity || 0) * Number(invoice.rate || 0);
  const gstAmount = (subtotal * GST) / 100;
  const total = subtotal + gstAmount;

  const handleChange = (e) => {
    setInvoice({ ...invoice, [e.target.name]: e.target.value });
  };

  const saveBill = () => {
    const newBill = { ...invoice, subtotal, gstAmount, total };

    setHistory([newBill, ...history]);

    setInvoice({
      ...emptyInvoice,
      invoiceNo: Date.now(),
      date: new Date().toISOString().split("T")[0],
    });
  };

  const openPastBill = (bill) => {
    setInvoice({
      date: bill.date,
      invoiceNo: bill.invoiceNo,
      customer: bill.customer,
      material: bill.material,
      quantity: bill.quantity,
      rate: bill.rate,
    });
  };

  const generatePDF = () => {
    const input = document.getElementById("invoice");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Invoice-${invoice.invoiceNo}.pdf`);
    });
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <div style={{ marginBottom: 20 }}>
        <button onClick={generatePDF} style={{ marginRight: 10 }}>
          Download PDF
        </button>
        <button onClick={saveBill}>Save Bill</button>
      </div>

      <div
        id="invoice"
        style={{
          background: "white",
          padding: 30,
          width: "850px",
          border: "2px solid black",
        }}
      >
        <h1 style={{ textAlign: "center", fontSize: 34, color: "red" }}>
          SHIVSHAKTI ACID & CHEMICALS
        </h1>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p><b>Date:</b> {invoice.date}</p>
          <p><b>Invoice No:</b> {invoice.invoiceNo}</p>
        </div>

        <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
          <div>
            <b>Customer:</b><br />
            <select name="customer" value={invoice.customer} onChange={handleChange}>
              {customers.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <b>Material:</b><br />
            <select name="material" value={invoice.material} onChange={handleChange}>
              {materials.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <table
          style={{
            width: "100%",
            marginTop: 20,
            borderCollapse: "collapse",
            border: "2px solid black",
          }}
        >
          <thead>
            <tr>
              <th style={th}>Material</th>
              <th style={th}>Qty</th>
              <th style={th}>Rate</th>
              <th style={th}>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={td}>{invoice.material}</td>
              <td style={td}>
                <input name="quantity" value={invoice.quantity} onChange={handleChange} />
              </td>
              <td style={td}>
                <input name="rate" value={invoice.rate} onChange={handleChange} />
              </td>
              <td style={td}>₹ {total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <h3 style={{ textAlign: "right" }}>Subtotal: ₹{subtotal.toFixed(2)}</h3>
        <h3 style={{ textAlign: "right" }}>GST: ₹{gstAmount.toFixed(2)}</h3>
        <h2 style={{ textAlign: "right" }}>TOTAL: ₹{total.toFixed(2)}</h2>
      </div>

      <div style={{ marginTop: 40 }}>
        <h2>Saved Bills History (Click to Open)</h2>
        <table border="1" cellPadding="10" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Material</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i} style={{ cursor: "pointer" }} onClick={() => openPastBill(h)}>
                <td>{h.invoiceNo}</td>
                <td>{h.date}</td>
                <td>{h.customer}</td>
                <td>{h.material}</td>
                <td>₹ {h.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th = { border: "1px solid black", padding: 10 };
const td = { border: "1px solid black", padding: 10, textAlign: "center" };