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

  // ✅ YOUR FIXED PDF FUNCTION (PROPERLY INTEGRATED)
  const generatePDF = async () => {
    const input = document.getElementById("invoice");

    // Clone DOM
    const clone = input.cloneNode(true);

    // Convert inputs → static text (CRITICAL iPhone FIX)
    clone.querySelectorAll("input").forEach((el) => {
      const div = document.createElement("div");

      div.innerText = el.value || "";
      div.style.fontSize = "16px";
      div.style.padding = "10px";
      div.style.border = "1px solid #ddd";
      div.style.background = "#fff";
      div.style.color = "#000";
      div.style.minWidth = "100px";
      div.style.boxSizing = "border-box";

      el.replaceWith(div);
    });

    // Force stable layout for Safari
    clone.style.width = "800px";
    clone.style.background = "#ffffff";
    clone.style.padding = "20px";
    clone.style.position = "absolute";
    clone.style.left = "-9999px";
    clone.style.top = "0";

    document.body.appendChild(clone);

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice.pdf");

    document.body.removeChild(clone);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Invoice Generator</h1>

      {/* INVOICE */}
      <div id="invoice" style={styles.invoiceBox}>
        <h2>Shiv Shakti Invoice</h2>

        {items.map((item, index) => (
          <div key={index} style={styles.row}>
            <input
              placeholder="Item Name"
              value={item.name}
              onChange={(e) =>
                updateItem(index, "name", e.target.value)
              }
              style={styles.input}
            />

            <input
              type="number"
              placeholder="Qty"
              value={item.qty}
              onChange={(e) =>
                updateItem(index, "qty", Number(e.target.value))
              }
              style={styles.input}
            />

            <input
              type="number"
              placeholder="Price"
              value={item.price}
              onChange={(e) =>
                updateItem(index, "price", Number(e.target.value))
              }
              style={styles.input}
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
    width: "800px",
    minHeight: "1100px",
    padding: "30px",
    backgroundColor: "#ffffff",
    color: "#000000",
    margin: "0 auto",
    boxSizing: "border-box",
  },

  row: {
    display: "flex",
    gap: 10,
    marginBottom: 10,
  },

  input: {
    flex: 1,
    minWidth: "120px",
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