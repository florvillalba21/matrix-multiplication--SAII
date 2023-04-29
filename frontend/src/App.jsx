import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Table } from "./components/Table";
import { Result } from "./components/Result";

function App() {
  const rows1 = useRef();
  const columns1 = useRef();
  const rows2 = useRef();
  const columns2 = useRef();
  const [showTables, setShowTables] = useState(false);
  const [validation, setValidation] = useState(false);
  const [result, setResult] = useState([]);
  const message =
    "Las matrices no son multiplicables. Recuerda que la condición para multiplicar matrices es: la primera debe tener el mismo número de columnas que filas la segunda ";

  // validar que las dimensiones sean multiplicables
  const handleVerification = () => {
    columns1.current.value == rows2.current.value
      ? setShowTables(true)
      : setValidation(true);
  };

  // se recuperan los valores de los inputs de cada tabla referenciado por un nombre
  const sendValues = () => {
    const table1 = document.querySelector("table[name='Matriz1']");
    const inputsTable1 = table1.querySelectorAll("input");
    const Matriz1 = [];
    let rowIndex = 0;
    inputsTable1.forEach((input, index) => {
      if (index % columns1.current.value === 0) {
        Matriz1.push([]);
      }
      Matriz1[rowIndex].push(Number(input.value));
      if (index % columns1.current.value === columns1.current.value - 1) {
        rowIndex++;
      }
    });

    // recuperando los valores de la tabla 2
    const table2 = document.querySelector("table[name='Matriz2']");
    const inputsTable2 = table2.querySelectorAll("input");
    const Matriz2 = [];
    rowIndex = 0;
    inputsTable2.forEach((input, index) => {
      if (index % columns2.current.value === 0) {
        Matriz2.push([]);
      }
      Matriz2[rowIndex].push(Number(input.value));
      if (index % columns2.current.value === columns2.current.value - 1) {
        rowIndex++;
      }
    });

    //guardamos los valores en un obj para enviar a la api
    const data = {
      Matriz1,
      Matriz2,
    };

    // se valida q existan ambos y se realiza la peticion
    if (Matriz1 && Matriz2) {
      axios
        .post("http://localhost:3000/multiplicar", data)
        .then((res) => setResult(res.data.resultado))
        .catch((err) => console.log(err));
    }
  };

  // cuerpo de la pag principal
  return (
    <div className="App" style={{ margin: "0 auto", width: "40%" }}>
      <h4>ingresa las dimensiones de la matriz 1:</h4>
      <div>
        <input
          type="number"
          id="filasM1"
          placeholder="numero de filas"
          ref={rows1}
        />
        <input
          type="number"
          id="columnasM1"
          placeholder="numero de columnas"
          ref={columns1}
        />
      </div>
      <br />
      <h4>ingresa las dimensiones de la matriz 2:</h4>
      <div>
        <input
          type="number"
          id="filasM2"
          placeholder="numero de filas"
          ref={rows2}
        />
        <input
          type="number"
          id="columnasM2"
          placeholder="numero de columnas"
          ref={columns2}
        />
      </div>
      <div>
        <button className="btn btn-primary" onClick={handleVerification}>
          Verificar
        </button>
      </div>

      {/* si la validacion fue correcta, se muestran las tablas */}
      {showTables && (
        <>
          <div>
            <h4>Matriz 1</h4>
            <Table
              name={"Matriz1"}
              rows={rows1.current.value}
              columns={columns1.current.value}
            />
          </div>
          <br />
          <div>
            <h4>Matriz 2</h4>
            <Table
              name={"Matriz2"}
              rows={rows2.current.value}
              columns={columns2.current.value}
            />
          </div>
          <div>
            <button className="btn btn-primary" onClick={sendValues}>
              Calcular Multiplicación
            </button>
          </div>
        </>
      )}
      {/* si la validacion fue incorrecta se muestra el mensaje al usuario */}
      {validation && (
        <>
          <p>{message}</p>
        </>
      )}
      <br />
      {/* si hay un resultado, se muestra por pantalla */}
      {result.length > 0 && (
        <Result text={"Resultado de la multiplicación"} matriz={result} />
      )}
    </div>
  );
}

export default App;
