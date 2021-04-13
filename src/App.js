import Transtable from "./Transtable";
import Holdingtable from "./Holdingtable";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <div className="app__table">
        <h1>Transactions</h1>
        <Transtable />
      </div>
      <div className="app__table">
        <h1>Holding</h1>
        <Holdingtable />
      </div>
    </div>
  );
}
