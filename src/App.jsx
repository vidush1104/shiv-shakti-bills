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

    // 🔥 FIX: disable input rendering issues on iOS
    const clone = input.cloneNode(true);

    clone.querySelectorAll("input").forEach((inputEl) => {
      const div = document.createElement("div");
      div.style.padding = "12px";
      div.style.border = "1px solid #ddd";
      div.style.minWidth = "80px";
      div.style.fontSize = "16px";
      div.style.background = "#fff";
      div.style.color = "#000";
      div.innerText = inputEl.value || " ";
      inputEl.replaceWith(div);
    });

    document.body.appendChild(clone);
    clone.style.position = "absolute";
    clone.style.left = "-9999px";
    clone.style.background = "#fff";

    html2canvas(clone, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("invoice.pdf");

      document.body.removeChild(clone);
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Invoice Generator</h1>

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

const styles = {
  container: {
    padding: 20,
    fontFamily: "Arial",
  },

  title: {
    textAlign: "center",
    marginBottom: 20,
  },

  invoiceBox: {
    width: "210mm",
    minHeight: "297mm",
    padding: "15mm",
    backgroundColor: "#fff",
    color: "#000",
    margin: "0 auto",
    boxSizing: "border-box",
  },

  row: {
    display: "flex",
    gap: 10,
    marginBottom: 12,
  },

  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    border: "1px solid #aaa",
    borderRadius: 6,
    backgroundColor: "#fff",
    color: "#000",
  },

  button: {
    marginTop: 10,
    padding: "10px 15px",
    background: "#333",
    color: "#fff",
    border: "none",
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

  summary: {
    marginTop: 20,
    borderTop: "1px solid #ddd",
    paddingTop: 10,
  },
};