import { useState, useRef } from "react";

export default function App() {
  const [items, setItems] = useState([
    { name: "", qty: 1, price: 0 },
  ]);

  const printRef = useRef();

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={styles.container}>
      <h1 className="no-print" style={styles.title}>
        Invoice Generator
      </h1>

      {/* ================= INPUT SECTION ================= */}
      <div className="no-print" style={styles.editorBox}>
        {items.map((item, index) => (
          <div key={index} style={styles.row}>
            <input
              placeholder="Item"
              value={item.name}
              onChange={(e) =>
                updateItem(index, "name", e.target.value)
              }
              style={styles.input}
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
              style={styles.input}
            />
          </div>
        ))}

        <button onClick={addItem} style={styles.button}>
          + Add Item
        </button>

        <button onClick={handlePrint} style={styles.printBtn}>
          Print Invoice
        </button>
      </div>

      {/* ================= PRINT AREA (FIXED LAYOUT) ================= */}
      <div ref={printRef} id="print-area" style={styles.printBox}>
        <h2>Shiv Shakti Invoice</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>₹{item.price}</td>
                <td>₹{item.qty * item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={styles.summary}>
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>GST (18%): ₹{gst.toFixed(2)}</p>
          <h2>Total: ₹{total.toFixed(2)}</h2>
        </div>
      </div>

      {/* ================= PRINT CSS ================= */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }

          #print-area, #print-area * {
            visibility: visible;
          }

          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }

          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: 20,
    fontFamily: "Arial",
  },

  title: {
    textAlign: "center",
    marginBottom: 20,
  },

  editorBox: {
    marginBottom: 30,
  },

  row: {
    display: "flex",
    gap: 10,
    marginBottom: 10,
  },

  input: {
    flex: 2,
    padding: 12,
    fontSize: 16,
    border: "1px solid #aaa",
    borderRadius: 6,
  },

  inputSmall: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    border: "1px solid #aaa",
    borderRadius: 6,
  },

  button: {
    padding: "10px 15px",
    marginRight: 10,
    background: "#333",
    color: "#fff",
    border: "none",
  },

  printBtn: {
    padding: "10px 15px",
    background: "green",
    color: "#fff",
    border: "none",
  },

  printBox: {
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #ddd",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  summary: {
    marginTop: 20,
    borderTop: "1px solid #ddd",
    paddingTop: 10,
  },
};