import React from "react";
//import { nanoid } from "nanoid";
import { firebase } from "../firebase";

const Formulario = () => {
  const [id, setId] = React.useState(0);
  const [nombreequipo, setNombreequipo] = React.useState("");
  const [puntos, setPuntos] = React.useState(0);
  const [partidosjugados, setPartidosJugados] = React.useState("");
  const [partidosganados, setPartidosGanados] = React.useState("");
  const [partidosempatados, setPartidosEmptados] = React.useState("");
  const [partidosperdidos, setPartidosperdidos] = React.useState("");
  const [golesfavor, setGolesfavor] = React.useState("");
  const [golescontra, setGolescontra] = React.useState("");
  const [diferenciagoles, setDiferenciaGoles] = React.useState(0);
  const [listaequipos, setListaequipos] = React.useState([]);
  const [modoEdicion, setModoEdicion] = React.useState(false);
  const [paises, setPaises] = React.useState([]);
  const [codPaises, setCodPaises] = React.useState([]);
  const [paisesFinal, setpaisesFinal] = React.useState([]);

  React.useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const db = firebase.firestore();
        const data = await db.collection("Listaequipos").get();
        const arrayData = data.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        console.log(arrayData);

        setListaequipos(arrayData);
      } catch (error) {
        console.log(error);
      }
    };

    const obtenertPaises = async () =>
      await fetch("https://flagcdn.com/es/codes.json")
        .then((response) => response.json())
        .then((data) => {
          setPaises(Object.values(data));
          setCodPaises(Object.keys(data));
          setpaisesFinal(data);
        });
    obtenertPaises();
    obtenerDatos();
  }, [partidosjugados, listaequipos]);
  console.log(paisesFinal, "final final");

  React.useEffect(() => {
    const partidosganadosnum = parseInt(
      partidosganados === "" ? 0 : partidosganados
    );
    const partidosempuatdosnum = parseInt(
      partidosempatados === "" ? 0 : partidosempatados
    );
    const partidosperdidosnum = parseInt(
      partidosperdidos === "" ? 0 : partidosperdidos
    );
    setPuntos(partidosganadosnum * 3 + partidosempuatdosnum);
    setPartidosJugados(
      partidosganadosnum + partidosempuatdosnum + partidosperdidosnum
    );
  }, [partidosganados, partidosempatados, partidosperdidos]);

  const guardarequipos = async (e) => {
    e.preventDefault();
    let nombreEquipoFinal = paises[nombreequipo];
    console.log(nombreEquipoFinal, "nombre de equipo final");
    let codigoPais = codPaises[nombreequipo];
    console.log(codigoPais, "codigoPais final");
    if (!nombreequipo.trim()) {
      alert("Digite el nombre del equipo");
      return;
    }

    if (!partidosempatados.trim()) {
      alert("Digite los partidos empatados");
      return;
    } else if (partidosempatados < 0) {
      alert("El numero no puede ser negativo");
      return;
    }
    if (!partidosganados.trim()) {
      alert("Digite los partidos ganados");
      return;
    } else if (partidosganados < 0) {
      alert("El numero no puede ser negativo");
      return;
    }
    if (!partidosperdidos.trim()) {
      alert("Digite los partidos perdidos");
      return;
    } else if (partidosperdidos < 0) {
      alert("El numero no puede ser negativo");
      return;
    }
    if (!golesfavor.trim()) {
      alert("Digite los goles a favor");
      return;
    } else if (golesfavor < 0) {
      alert("El numero no puede ser negativo");
      return;
    }
    if (!golescontra.trim()) {
      alert("Digite los goles en contra");
      return;
    } else if (golescontra < 0) {
      alert("El numero no puede ser negativo");
      return;
    }

    try {
      const db = firebase.firestore();
      const nuevoequipo = {
        nombreEquipo: nombreEquipoFinal,
        codigoPais: codigoPais,
        Puntos: puntos,
        partidosJugados: partidosjugados,
        partidosGanados: partidosganados,
        partidosEmpatados: partidosempatados,
        partidosPerdidos: partidosperdidos,
        golesaFavor: golesfavor,
        golesContra: golescontra,
        golesdeDiferencia: golesfavor - golescontra,
      };

      await db.collection("Listaequipos").add(nuevoequipo);

      /*setListaequipos([
        ...listaequipos,
        {
          id: nanoid(),
          nombreEquipo: nombreequipo,
          Puntos: puntos,
          partidosJugados: partidosjugados,
          partidosGanados: partidosganados,
          partidosEmpatados: partidosempatados,
          partidosPerdidos: partidosperdidos,
          golesaFavor: golesfavor,
          golesContra: golescontra,
          golesdeDiferencia: golesfavor - golescontra,
        },
      ]);*/

      setNombreequipo("");
      setPuntos(0);
      setPartidosGanados("");
      setGolescontra("");
      setGolesfavor("");
      setPartidosperdidos("");
      setPartidosEmptados("");
      setPartidosJugados(0);
      setDiferenciaGoles(0);

      setId(0);
    } catch (error) {
      console.log(error);
    }
  };
  const changePartido = (e) => {
    if (e.target.name === "golesContra") {
      setGolescontra(e.target.value);
      setDiferenciaGoles(golesfavor - e.target.value);
    } else {
      setGolesfavor(e.target.value);
      setDiferenciaGoles(e.target.value - golescontra);
    }
  };
  const editar = (item) => {
    setNombreequipo(item.nombreEquipo);
    setPuntos(item.Puntos);
    setPartidosJugados(item.partidosJugados);
    setPartidosGanados(item.partidosGanados);
    setPartidosEmptados(item.partidosEmpatados);
    setPartidosperdidos(item.partidosPerdidos);
    setGolesfavor(item.golesaFavor);
    setGolescontra(item.golesContra);
    setDiferenciaGoles(item.golesdeDiferencia);
    setModoEdicion(true);
    setId(item.id);
    console.log(item);
  };
  const editarEquipos = async (e) => {
    e.preventDefault();

    if (!nombreequipo.trim()) {
      alert("Digite el nombre del equipo");
      return;
    }

    if (!partidosempatados.trim()) {
      alert("Digite los partidos empatados");
      return;
    } else if (partidosempatados < 0) {
      alert("El numero no puede ser negativo");
      return;
    }
    if (!partidosganados.trim()) {
      alert("Digite los partidos ganados");
      return;
    } else if (partidosganados < 0) {
      alert("El numero no puede ser negativo");
      return;
    }
    if (!partidosperdidos.trim()) {
      alert("Digite los partidos perdidos");
      return;
    } else if (partidosperdidos < 0) {
      alert("El numero no puede ser negativo");
      return;
    }
    if (!golesfavor.trim()) {
      alert("Digite los goles a favor");
      return;
    } else if (golesfavor < 0) {
      alert("El numero no puede ser negativo");
      return;
    }
    if (!golescontra.trim()) {
      alert("Digite los goles en contra");
      return;
    } else if (golescontra < 0) {
      alert("El numero no puede ser negativo");
      return;
    }
    let nombreEquipoFinal = paises[nombreequipo];
    let codigoPais = codPaises[nombreequipo];
    try {
      const db = firebase.firestore();
      await db
        .collection("Listaequipos")
        .doc(id)
        .update({
          nombreEquipo: nombreEquipoFinal,
          codigoPais: codigoPais,
          Puntos: puntos,
          partidosJugados: partidosjugados,
          partidosGanados: partidosganados,
          partidosEmpatados: partidosempatados,
          partidosPerdidos: partidosperdidos,
          golesaFavor: golesfavor,
          golesContra: golescontra,
          golesdeDiferencia: golesfavor - golescontra,
        });

      /*const arrayEditado = listaequipos.map((item) =>
        item.id === id
          ? {
              id: nanoid(),
              nombreEquipo: nombreequipo,
              Puntos: puntos,
              partidosJugados: partidosjugados,
              partidosGanados: partidosganados,
              partidosEmpatados: partidosempatados,
              partidosPerdidos: partidosperdidos,
              golesaFavor: golesfavor,
              golesContra: golescontra,
              golesdeDiferencia: golesfavor - golescontra,
            }
          : item
      );
      setListaequipos(arrayEditado);*/
      setNombreequipo("");
      setPuntos("");
      setPartidosJugados("");
      setPartidosGanados("");
      setPartidosEmptados("");
      setPartidosperdidos("");
      setGolesfavor("");
      setGolescontra("");
      setDiferenciaGoles("");
      setModoEdicion(false);
      setId("");
    } catch (error) {
      console.log(error);
    }
  };
  const eliminar = async (id) => {
    try {
      const db = firebase.firestore();
      await db.collection("Listaequipos").doc(id).delete();
      const aux = listaequipos.filter((item) => item.id !== id);
      setListaequipos(aux);
      //console.log(aux);
    } catch (error) {
      console.log(error);
    }
  };
  const cancelar = () => {
    setNombreequipo("");
    setPuntos(0);
    setPartidosJugados(0);
    setPartidosGanados("");
    setPartidosEmptados("");
    setPartidosperdidos("");
    setGolesfavor("");
    setGolescontra("");
    setDiferenciaGoles(0);
    setModoEdicion(false);
    setId("");
  };
  // console.log(paises, "esto son los paises");
  // console.log(codPaises, "esto son los codigos de paises");
  return (
    <div className="container mt-4">
      <h1 className="text-center font-italic">
        TABLA CLASIFICATORIA AL MUNDIAL DE QTAR
      </h1>
      <hr />
      <div className="container">
        <div className="row">
          <div className="col">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col"></th>
                  <th scope="col">Equipo</th>
                  <th scope="col ">Pts</th>
                  <th scope="col">PJ</th>
                  <th scope="col">PG</th>
                  <th scope="col">PE</th>
                  <th scope="col">PP</th>
                  <th scope="col">GF</th>
                  <th scope="col">GC</th>
                  <th scope="col">DIF</th>
                </tr>
              </thead>
              <tbody>
                {listaequipos
                  .sort((a, b) => b.Puntos - a.Puntos)
                  .map((item, index) => (
                    <tr key={item.id}>
                      <th>{index + 1}</th>
                      <td>
                        {" "}
                        <img
                          src={`https://flagcdn.com/28x21/${item.codigoPais}.png`}
                          width="28"
                          height="21"
                          alt="Argentina"
                        />
                      </td>
                      <td>{item.nombreEquipo}</td>
                      <td>{item.Puntos}</td>
                      <td>{item.partidosJugados}</td>
                      <td>{item.partidosGanados}</td>
                      <td>{item.partidosEmpatados}</td>
                      <td>{item.partidosPerdidos}</td>
                      <td>{item.golesaFavor}</td>
                      <td>{item.golesContra}</td>
                      <td>{item.golesdeDiferencia}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm float-end mx-2"
                          onClick={() => eliminar(item.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm float-end "
                          onClick={() => editar(item)}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="col">
            <form onSubmit={modoEdicion ? editarEquipos : guardarequipos}>
              <h6 className="card-subtitle mb-2 text-muted">Equipo</h6>
              <div>
                {/* <input
                className="form-control mb-2 "
                type="text"
                placeholder="Ingrese equipo"
                onChange={(e) => setNombreequipo(e.target.value)}
                value={nombreequipo}
              />
              <div className="mb-3">
                <label className="form-label">Paises:</label> */}
                <select
                  required
                  onChange={(e) => setNombreequipo(e.target.value)}
                  value={nombreequipo}
                  className="form-select"
                >
                  <option value=""></option>
                  {paises.map((pais, index) => (
                    <option key={index} value={index}>
                      {pais}
                    </option>
                  ))}
                </select>
              </div>
              {/* </div> */}
              <hr></hr>
              <div className="col">
                <h6 className="card-subtitle mb-2 text-muted">
                  Partidos Ganados
                </h6>
                <input
                  className="form-control mb-2 "
                  type="number"
                  onChange={(e) => setPartidosGanados(e.target.value)}
                  value={partidosganados}
                />
                <h6 className="card-subtitle mb-2 text-muted">
                  Partidos Empatados
                </h6>
                <input
                  className="form-control mb-2 "
                  type="number"
                  onChange={(e) => setPartidosEmptados(e.target.value)}
                  value={partidosempatados}
                />
                <h6 className="card-subtitle mb-2 text-muted">
                  Partidos Perdidos
                </h6>
                <input
                  className="form-control mb-2 "
                  type="number"
                  onChange={(e) => setPartidosperdidos(e.target.value)}
                  value={partidosperdidos}
                />
                <h6 className="card-subtitle mb-2 text-muted">Goles a favor</h6>
                <input
                  name="golesFavor"
                  className="form-control mb-2 "
                  type="number"
                  onChange={(e) => changePartido(e)}
                  value={golesfavor}
                />
                <h6 className="card-subtitle mb-2 text-muted">
                  Goles en contra
                </h6>
                <input
                  name="golesContra"
                  className="form-control mb-2 "
                  type="number"
                  onChange={(e) => changePartido(e)}
                  value={golescontra}
                />
                <h6 className="card-subtitle mb-2 text-muted">Puntos</h6>
                <input
                  className="form-control mb-2  "
                  type="number"
                  onChange={(e) => setPuntos(e.target.value)}
                  value={puntos}
                  disabled
                  title="Este campo es calculado con los partidos"
                />
                <h6 className="card-subtitle mb-2 text-muted">
                  Partidos Jugados
                </h6>
                <input
                  className="form-control mb-2 "
                  type="number"
                  onChange={(e) => setPartidosJugados(e.target.value)}
                  value={partidosjugados}
                  disabled
                  title="Este campo es calculado con los partidos"
                />
                <h6 className="card-subtitle mb-2 text-muted">
                  Diferencia de goles
                </h6>
                <input
                  className="form-control mb-2  "
                  type="number"
                  onChange={(e) => setDiferenciaGoles(e.target.value)}
                  value={diferenciagoles}
                  disabled
                  title="Este campo es calculado con los goles"
                />

                {modoEdicion ? (
                  <>
                    <button className="btn btn-warning btn-block" type="submit">
                      Editar
                    </button>
                    <button
                      className="btn btn-dark btn-block mx-2"
                      onClick={() => cancelar()}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button className="btn btn-primary btn-block" type="submit">
                    Agregar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Formulario;
