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
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      windowWidth: 800, // 🔥 FIX: prevents iPhone clipping
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
        <h2 style={styles.heading}>Shiv Shakti Invoice</h2>

        {/* TABLE HEADER */}
        <div style={styles.rowHeader}>
          <div style={styles.cell}>Item</div>
          <div style={styles.cell}>Qty</div>
          <div style={styles.cell}>Price</div>
        </div>

        {/* ITEMS */}
        {items.map((item, index) => (
          <div key={index} style={styles.row}>
            <input
              placeholder="Item Name"
              value={item.name}
              onChange={(e) =>
                updateItem(index, "name", e.target.value)
              }
              style={styles.inputLarge}
            />

            <input
              type="number"
              value={item.qty}
              onChange={(e) =>
                updateItem(index, "qty", Number(e.target.value))
              }
              style={styles.inputSmall}
            />

            <input
              type="number"
              value={item.price}
              onChange={(e) =>
                updateItem(index, "price", Number(e.target.value))
              }
              style={styles.inputLarge}
            />
          </div>
        ))}

        <button onClick={addItem} style={styles.button}>
          + Add Item
        </button>

        {/* TOTAL */}
        <div style={styles.summary}>
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>GST (18%): ₹{gst.toFixed(2)}</p>
          <h2>Total: ₹{total.toFixed(2)}</h2>
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
  },

  title: {
    textAlign: "center",
    marginBottom: 20,
  },

  invoiceBox: {
    width: "800px", // 🔥 FIX: stable PDF width
    minHeight: "1100px",
    padding: "40px",
    backgroundColor: "#fff",
    color: "#000",
    margin: "0 auto",
    boxSizing: "border-box",
  },

  heading: {
    marginBottom: 20,
  },

  rowHeader: {
    display: "flex",
    borderBottom: "2px solid #000",
    paddingBottom: 10,
    marginBottom: 10,
  },

  row: {
    display: "flex",
    gap: 10,
    marginBottom: 10,
  },

  cell: {
    flex: 1,
    fontWeight: "bold",
  },

  inputLarge: {
    flex: 2,
    minWidth: "150px", // 🔥 prevents cutoff
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #aaa",
    borderRadius: 6,
    backgroundColor: "#fff",
    color: "#000",
    boxSizing: "border-box",
  },

  inputSmall: {
    flex: 1,
    minWidth: "80px",
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #aaa",
    borderRadius: 6,
    backgroundColor: "#fff",
    color: "#000",
    boxSizing: "border-box",
  },

  button: {
    marginTop: 10,
    padding: "10px 15px",
    background: "#333",
    color: "#fff",
    border: "none",
  },

  summary: {
    marginTop: 20,
    borderTop: "1px solid #ddd",
    paddingTop: 10,
    color: "#000",
  },

  downloadBtn: {
    marginTop: 20,
    padding: "12px 20px",
    background: "green",
    color: "#fff",
    border: "none",
    display: "block",
    margin: "20px auto",
  },
};