import { useEffect, useMemo, useState } from "react";
import { db } from "./firebase";
import "./App.css";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where
} from "firebase/firestore";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { serverTimestamp } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

export default function App() {
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [category, setCategory] = useState("食費");
  useEffect(() => {
  if (!user) {
    setPosts([]);
    return;
  }
// 選択した日のデータだけ取り出す
const selectedDayItems = posts.filter((post) => {
  if (!post.createdAt) return false;

  const date = post.createdAt.toDate
    ? post.createdAt.toDate()
    : new Date(post.createdAt);

  const formattedDate = date.toISOString().slice(0, 10);
  return formattedDate === selectedDate;
});

// 選択した日の入金合計
const selectedDayIncome = selectedDayItems
  .filter((post) => post.type === "income")
  .reduce((sum, post) => sum + Number(post.amount), 0);

// 選択した日の支出合計
const selectedDayExpense = selectedDayItems
  .filter((post) => post.type === "expense")
  .reduce((sum, post) => sum + Number(post.amount), 0);

// カテゴリー別の支出集計
const categoryTotals = posts
  .filter(post => post.type === "expense")
  .reduce((acc, post) => {
    const category = post.category || "その他";
    acc[category] = (acc[category] || 0) + Number(post.amount);
    return acc;
  }, {});

const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
  name,
  value,
}));

const pieColors = [
  "#2563eb",
  "#16a34a",
  "#f97316",
  "#dc2626",
  "#9333ea",
  "#0891b2",
  "#ca8a04",
];
  
}, [user]);
const login = async () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
};

const logout = async () => {
  const auth = getAuth();
  await signOut(auth);
};

  const saveData = async () => {
    
    if (!memo.trim()) {
    alert("メモを入力してください");
    return;
  }

  await addDoc(collection(db, "posts"), {
  userId: user.uid,
  amount: Number(amount),
  type: type,
  memo: memo,
  category: category, // ←追加
  createdAt: serverTimestamp(),
});

  alert("保存しました");
  };
  const deleteData = async () => {
    const snapshot = await getDocs(collection(db, "posts"));
    
    await Promise.all(
      snapshot.docs.map((data) =>
      deleteDoc(doc(db, "posts", data.id))
    )
  );
  
  alert("全部消去しました");
};

  const [startMoney, setStartMoney] = useState(() => {
    return localStorage.getItem("budget-start-money") || "";
  });

  const [money, setMoney] = useState("");
  const [memo, setMemo] = useState("");
  const [type, setType] = useState("expense");
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
  const auth = getAuth();

  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return () => unsubscribe();
}, []);
  useEffect(() => {
    if (!user) {
      setPosts([]);
      return;
    }

    const q = query(
    collection(db, "posts"),
    where("userId", "==", user.uid)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs
  .map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
  .sort((a, b) => {
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return timeB - timeA;
  });

    setPosts(data);
  });

  return () => unsubscribe();
}, [user]);

  useEffect(() => {
    localStorage.setItem("budget-start-money", startMoney);
  }, [startMoney]);

  const totalExpense = useMemo(() => {
  return posts
    .filter((post) => post.type === "expense")
    .reduce((sum, post) => sum + Number(post.amount || 0), 0);
}, [posts]);

const totalIncome = useMemo(() => {
  return posts
    .filter((post) => post.type === "income")
    .reduce((sum, post) => sum + Number(post.amount || 0), 0);
}, [posts]);

  const currentMoney = useMemo(() => {
    return Number(startMoney || 0) + totalIncome - totalExpense;
  }, [startMoney, totalIncome, totalExpense]);

  const addItem = async () => {
  if (!user) {
    alert("ログインしてください");
    return;
  }

  const amount = Number(money);

  if (!amount || amount <= 0) {
    alert("金額を入力してください");
    return;
  }

  if (!memo.trim()) {
    alert("メモを入力してください");
    return;
  }

  await addDoc(collection(db, "posts"), {
  text: memo,
  type: type,
  amount: amount,
  createdAt: serverTimestamp(),
  userId: user.uid
});
  setMoney("");
  setMemo("");
};
const deleteOne = async (id) => {
  await deleteDoc(doc(db, "posts", id));
};

  return (
    <div style={styles.page}>
      <div style={styles.app}>
        <header style={styles.header}>
          {user ? (
          <>
          <p>{user.displayName}でログイン中</p>
          <button onClick={logout}>ログアウト</button>
          </>
          ) : (
          <button onClick={login}>Googleでログイン</button>
          )}
          <p style={styles.label}>My Budget Wallet</p>
          <h1 style={styles.title}>節約財布</h1>
          <p style={styles.memo}>
            {post.memo || post.text}
            入金と支出を記録して、現在のお金を見える化しよう。
          </p>
        </header>

        <section style={styles.card}>
          <p style={styles.cardLabel}>現在の残高</p>
          <h2 style={styles.total}>{currentMoney.toLocaleString()} 円</h2>
        </section>

        <section className="calendar-card">
  <h2>日別カレンダー集計</h2>

  <input
    type="date"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
  />

  <div className="daily-summary">
    <div>
      <p>この日の入金</p>
      <strong className="income">+{selectedDayIncome.toLocaleString()}円</strong>
    </div>

    <div>
      <p>この日の支出</p>
      <strong className="expense">-{selectedDayExpense.toLocaleString()}円</strong>
    </div>

    <div>
      <p>この日の差額</p>
      <strong>
        {(selectedDayIncome - selectedDayExpense).toLocaleString()}円
      </strong>
    </div>
  </div>
</section>

        <section style={styles.summary}>
          <div style={styles.summaryBox}>
            <p style={styles.summaryLabel}>入金合計</p>
            <p style={styles.incomeText}>+{totalIncome.toLocaleString()}円</p>
          </div>

          <div style={styles.summaryBox}>
            <p style={styles.summaryLabel}>支出合計</p>
            <p style={styles.expenseText}>-{totalExpense.toLocaleString()}円</p>
          </div>
        </section>
        
        <section style={styles.form}>
          <input
            type="number"
            value={startMoney}
            onChange={(e) => setStartMoney(e.target.value)}
            placeholder="最初に持っているお金 例: 30000"
            style={styles.input}
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={styles.input}
          >
            <option value="expense">支出</option>
            <option value="income">入金</option>
            <option value="食費">食費</option>
            <option value="交通費">交通費</option>
            <option value="日用品">日用品</option>
            <option value="娯楽">娯楽</option>
            <option value="勉強">勉強</option>
            <option value="収入">収入</option>
            <option value="その他">その他</option>
          </select>

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
            placeholder="メモ 例: 昼ごはん / バイト代"
            style={styles.input}
          />

          <button onClick={addItem} style={styles.addButton}>
            追加する
          </button>
        </section>
        <section className="chart-card">
  <h2>カテゴリー別支出</h2>

  {pieData.length === 0 ? (
    <p>まだ支出データがありません</p>
  ) : (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={({ name, value }) =>
              `${name}: ${value.toLocaleString()}円`
            }
          >
            {pieData.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={pieColors[index % pieColors.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value.toLocaleString()}円`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )}
</section>
        <section style={styles.history}>
          <h3 style={styles.subTitle}>履歴</h3>
          {posts.length === 0 ? (
            <p style={styles.empty}>まだ記録がありません</p>
          ) : (
            posts.map(() => (
            <div key={post.id} style={styles.item}>
              <div>
                <p style={styles.memo}>{post.text}</p>
                
                <p style={styles.date}>
                  {post.createdAt?.seconds
                  ? new Date(post.createdAt.seconds * 1000).toLocaleString()
                  : ""}
                </p>
              </div>
            
            <div style={styles.right}>
              <p style={{ color: post.type === "入金" ? "green" : "red" }}>
                {post.type === "入金" ? "+" : "-"}
                {(post.amount ?? post.money).toLocaleString()}円
              </p>
              
              <button onClick={() => deleteOne(post.id)}>削除</button>
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
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
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
  summary: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginBottom: 16,
  },
  summaryBox: {
    background: "white",
    padding: 14,
    borderRadius: 16,
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  },
  summaryLabel: {
    margin: 0,
    fontSize: 13,
    color: "#6b7280",
  },
  incomeText: {
    margin: 0,
    fontWeight: "bold",
    color: "#16a34a",
  },
  expenseText: {
    margin: 0,
    fontWeight: "bold",
    color: "#dc2626",
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