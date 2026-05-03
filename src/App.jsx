import { useState } from "react";

export default function App() {
  const [money, setMoney] = useState("");
  const [list, setList] = useState([]);

  const addMoney = () => {
    if (money === "") return;
    setList([...list, money]);
    setMoney("");
  };

  const total = list.reduce((sum, item) => sum + Number(item), 0);

  return (
    <div style={{ padding: 20 }}>
      <h1>予算管理アプリ</h1>

      <input
        type="number"
        value={money}
        onChange={(e) => setMoney(e.target.value)}
        placeholder="金額入力"
      />

      <button onClick={addMoney}>追加</button>

      <ul>
        {list.map((item, index) => (
          <li key={index}>{item} 円</li>
        ))}
      </ul>

      <h2>合計: {total} 円</h2>
    </div>
  );
}