import { useEffect, useMemo, useState } from "react";

export default function App() {
  const [money, setMoney] = useState("");
  const [memo, setMemo] = useState("");
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("budget-items");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("budget-items", JSON.stringify(items));
  }, [items]);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  }, [items]);

  const addItem = () => {
    const amount = Number(money);
    if (!amount || amount <= 0) return;

    const newItem = {
      id: Date.now(),
      amount,
      memo: memo || "メモなし",
      date: new Date().toLocaleDateString("ja-JP"),
    };

    setItems([newItem, ...items]);
    setMoney("");
    setMemo("");
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div style={styles.page}>
      <div style={styles.app}>
        <header style={styles.header}>
          <p style={styles.label}>My Budget Wallet</p>
          <h1 style={styles.title}>節約財布</h1>
          <p style={styles.text}>支出を記録して、使った金額を見える化しよう。</p>
        </header>

        <section style={styles.card}>
          <p style={styles.cardLabel}>合計支出</p>
          <h2 style={styles.total}>{total.toLocaleString()} 円</h2>
        </section>

        <section style={styles.form}>
          <input
            type="number"
            value={money}
            onChange={(e) => setMoney(e.target.value)}
            placeholder="金額 例: 1000"
            style={styles.input}
          />

          <input
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="メモ 例: 昼ごはん"
            style={styles.input}
          />

          <button onClick={addItem} style={styles.addButton}>
            追加する
          </button>
        </section>

        <section style={styles.history}>
          <h3 style={styles.subTitle}>支出履歴</h3>

          {items.length === 0 ? (
            <p style={styles.empty}>まだ記録がありません</p>
          ) : (
            items.map((item) => (
              <div key={item.id} style={styles.item}>
                <div>
                  <p style={styles.memo}>{item.memo}</p>
                  <p style={styles.date}>{item.date}</p>
                </div>

                <div style={styles.right}>
                  <p style={styles.amount}>{item.amount.toLocaleString()}円</p>
                  <button
                    onClick={() => deleteItem(item.id)}
                    style={styles.deleteButton}
                  >
                    削除
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f8",
    padding: "24px 12px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#111827",
  },
  app: {
    maxWidth: 480,
    margin: "0 auto",
  },
  header: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: "#6b7280",
    margin: 0,
  },
  title: {
    fontSize: 32,
    margin: "4px 0",
  },
  text: {
    color: "#6b7280",
    margin: 0,
  },
  card: {
    background: "#111827",
    color: "white",
    padding: 24,
    borderRadius: 24,
    marginBottom: 16,
    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
  },
  cardLabel: {
    margin: 0,
    color: "#d1d5db",
  },
  total: {
    fontSize: 36,
    margin: "8px 0 0",
  },
  form: {
    background: "white",
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    display: "grid",
    gap: 10,
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  },
  input: {
    padding: 14,
    fontSize: 16,
    borderRadius: 12,
    border: "1px solid #d1d5db",
    outline: "none",
  },
  addButton: {
    padding: 14,
    fontSize: 16,
    borderRadius: 12,
    border: "none",
    background: "#2563eb",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  history: {
    background: "white",
    padding: 16,
    borderRadius: 20,
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  },
  subTitle: {
    marginTop: 0,
  },
  empty: {
    color: "#6b7280",
    textAlign: "center",
    padding: 20,
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  memo: {
    margin: 0,
    fontWeight: "bold",
  },
  date: {
    margin: "4px 0 0",
    fontSize: 13,
    color: "#6b7280",
  },
  right: {
    textAlign: "right",
  },
  amount: {
    margin: 0,
    fontWeight: "bold",
  },
  deleteButton: {
    marginTop: 6,
    border: "none",
    background: "#fee2e2",
    color: "#dc2626",
    padding: "6px 10px",
    borderRadius: 8,
    cursor: "pointer",
  },
};