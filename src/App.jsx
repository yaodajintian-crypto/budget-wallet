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
    <div style={{ padding: 20, maxWidth: 480, margin: "0 auto" }}>
      <h1>予算管理アプリ</h1>

      <input
        type="number"
        value={money}
        onChange={(e) => setMoney(e.target.value)}
        placeholder="金額入力"
        style={{ padding: 8, marginRight: 8 }}
      />

      <input
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="メモ"
        style={{ padding: 8, marginRight: 8 }}
      />

      <button onClick={addItem}>追加</button>

      <h2>合計: {total} 円</h2>

      <ul>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: 8 }}>
            {item.date}：{item.memo} - {item.amount}円
            <button
              onClick={() => deleteItem(item.id)}
              style={{ marginLeft: 8 }}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}