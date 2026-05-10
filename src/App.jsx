import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function App() {
  const [items, setItems] = useState([
    { name: "", qty: 1, price: 0 },
  ]);

  const addItem = () => {
    setItems([...items, { name: "", qty: 1, price: 0 }]);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );

  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const generatePDF = () => {
    const input = document.getElementById("invoice");

    html2canvas(input, {
      scale: 2, // 🔥 iPhone-safe (DO NOT use 3)
      useCORS: true,
      backgroundColor: "#ffffff",
      windowWidth: document.documentElement.offsetWidth,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("invoice.pdf");
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Invoice Generator</h1>

      {/* INVOICE */}
      <div id="invoice" style={styles.invoiceBox}>
        <h2 style={{ color: "#000" }}>Shiv Shakti Invoice</h2>

        {items.map((item, index) => (
          <div key={index} style={styles.row}>
            <input
              placeholder="Item Name"
              value={item.name}
              onChange={(e) =>
                updateItem(index, "name", e.target.value)
              }
              style={styles.bigInput}
            />

            <input
              type="number"
              placeholder="Qty"
              value={item.qty}
              onChange={(e) =>
                updateItem(index, "qty", Number(e.target.value))
              }
              style={styles.smallInput}
            />

            <input
              type="number"
              placeholder="Price"
              value={item.price}
              onChange={(e) =>
                updateItem(index, "price", Number(e.target.value))
              }
              style={styles.bigInput}
            />
          </div>
        ))}

        <button onClick={addItem} style={styles.button}>
          + Add Item
        </button>

        {/* SUMMARY */}
        <div style={styles.summary}>
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>GST (18%): ₹{gst.toFixed(2)}</p>
          <h3>Total: ₹{total.toFixed(2)}</h3>
        </div>
      </div>

      <button onClick={generatePDF} style={styles.downloadBtn}>
        Download PDF
      </button>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: 20,
    fontFamily: "Arial",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  },

  title: {
    textAlign: "center",
    marginBottom: 20,
  },

  invoiceBox: {
    width: "210mm",
    minHeight: "297mm",
    padding: "15mm",
    backgroundColor: "#ffffff", // 🔥 FIX iPhone black issue
    color: "#000000",          // 🔥 FIX invisible text
    border: "1px solid #ccc",
    margin: "0 auto",
    boxSizing: "border-box",
  },

  row: {
    display: "flex",
    gap: 10,
    marginBottom: 12,
  },

  bigInput: {
    flex: 2,
    padding: "14px",
    fontSize: "16px",
    border: "1px solid #aaa",
    borderRadius: 6,
    backgroundColor: "#ffffff",
    color: "#000000",
    WebkitAppearance: "none",
    appearance: "none",
  },

  smallInput: {
    flex: 1,
    padding: "14px",
    fontSize: "16px",
    border: "1px solid #aaa",
    borderRadius: 6,
    backgroundColor: "#ffffff",
    color: "#000000",
    WebkitAppearance: "none",
    appearance: "none",
  },

  button: {
    marginTop: 10,
    padding: "10px 15px",
    background: "#333",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },

  downloadBtn: {
    marginTop: 20,
    padding: "12px 20px",
    background: "green",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },

  summary: {
    marginTop: 20,
    borderTop: "1px solid #ddd",
    paddingTop: 10,
    color: "#000000", // 🔥 FIX total visibility issue
  },
};