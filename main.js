class Loan {
    constructor(capital, cuotas, interes) {
        this.capital = capital;
        this.cuotas = cuotas;
        this.interes = interes;
    }

    calcularAmortizacion() {
        const tasaMensual = this.interes / 100 / 12;
        const cuota = (this.capital * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -this.cuotas));

        const amortizacion = [];
        let saldo = this.capital;
        let totalInteres = 0;

        for (let i = 0; i < this.cuotas; i++) {
            const interesMensual = saldo * tasaMensual;
            const abonoCapital = cuota - interesMensual;
            saldo -= abonoCapital;
            totalInteres += interesMensual;

            amortizacion.push({ cuota: i + 1, abonoCapital, interesMensual, saldo });
        }

        const totalPrestamo = this.capital + totalInteres;

        return {
            amortizacion,
            totalInteres,
            totalPrestamo
        };
    }
}

let prestamos = [];

function agregarPrestamo(capital, cuotas, interes) {
    if (capital > 0) {
        const nuevoPrestamo = new Loan(capital, cuotas, interes);
        prestamos.push(nuevoPrestamo);
    } else {
        console.log("Falta ingresar un Número");
    }
}

function mostrarResultados() {
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = "";

    prestamos.forEach((prestamo, index) => {
        const resultado = prestamo.calcularAmortizacion();

        const resultadoDiv = document.createElement("div");
        resultadoDiv.className = "resultado";

        const amortizacionFormatted = resultado.amortizacion.map(item => `
            <tr>
                <td>${item.cuota}</td>
                <td>${item.abonoCapital.toFixed(2)}</td>
                <td>${item.interesMensual.toFixed(2)}</td>
                <td>${item.saldo.toFixed(2)}</td>
            </tr>`).join('');

        resultadoDiv.innerHTML = `
            <h2>Resultados del préstamo ${index + 1}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Cuota</th>
                        <th>Abono Capital</th>
                        <th>Interés Mensual</th>
                        <th>Saldo</th>
                    </tr>
                </thead>
                <tbody>${amortizacionFormatted}</tbody>
            </table>
            <p>Total Interés: ${resultado.totalInteres.toFixed(2)}</p>
            <p>Total Préstamo: ${resultado.totalPrestamo.toFixed(2)}</p>
        `;

        resultadosDiv.appendChild(resultadoDiv);
    });
}

function limpiarFormulario() {
    document.getElementById("capital").value = "";
    document.getElementById("cuotas").value = "";
    document.getElementById("interes").value = "";
    document.getElementById("resultados").innerHTML = "";
}

document.getElementById("calcular").addEventListener("click", function() {
    const capital = parseFloat(document.getElementById("capital").value);
    const cuotas = parseInt(document.getElementById("cuotas").value);
    const interes = parseFloat(document.getElementById("interes").value);

    agregarPrestamo(capital, cuotas, interes);
    mostrarResultados();
    guardarPrestamosEnStorage();
});

document.getElementById("limpiar").addEventListener("click", function() {
    limpiarFormulario();
    prestamos = [];
    guardarPrestamosEnStorage();
});

function guardarPrestamosEnStorage() {
    localStorage.setItem("prestamos", JSON.stringify(prestamos));
}

function cargarPrestamosDesdeStorage() {
    const prestamosGuardados = JSON.parse(localStorage.getItem("prestamos"));
    if (prestamosGuardados) {
        prestamos = prestamosGuardados.map(data => new Loan(data.capital, data.cuotas, data.interes));
        mostrarResultados();
    }
}

cargarPrestamosDesdeStorage();







