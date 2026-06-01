import { CustomerForm } from "./components/CustomerForm";
import "./styles.css";

export default function App() {
  return (
    <main className="page">
      <div className="card">
        <header className="card-header">
          <div className="logo">JD</div>
          <div>
            <h1>Cadastro de cliente</h1>
            <p className="subtitle">Preencha os dados abaixo para se cadastrar</p>
          </div>
        </header>
        <CustomerForm />
      </div>
    </main>
  );
}
