const TABLE_HTML = document.querySelector(".tableBody");
const SELECT_HTML = document.querySelector(".selectButton");
const ENTRADAS_HTML = document.querySelector("#entradas");
const SAIDAS_HTML = document.querySelector("#saidas");
const SALDO_HTML = document.querySelector("#saldo");

let selectValue;
let fullData;

const formatDate = date => {
    const addZeroDates = value => {
        if (value < 10) return `0${value}`;
        if (value >= 10) return `${value}`;
    };

    return `${addZeroDates(date.getDate())}/${addZeroDates(date.getMonth()+1)}/${addZeroDates(date.getFullYear())}`;
};

const formatPrice = price => {
    return price.toLocaleString('pt-BR', {
    style: 'currency', currency: 'BRL'})
};

const renderTable = data => {
    TABLE_HTML.innerHTML = [];
    let fullTable = [];
    let entradas = 0;
    let saidas = 0;

    data.forEach(e => {
        const type = e.type === 'OUT' ? "Saída" : "Entrada";

        fullTable += `<tr>
                    <td>${formatDate(new Date(e.date))}</td>
                    <td>${e.customer.first_name} ${e.customer.last_name}</td>
                    <td>${e.customer.phone}</td>
                    <td>${e.store.name}</td>
                    <td>${e.store.phone}</td>
                    <td>${type}</td>
                    <td>${e.amount}</td>
                    <td>${formatPrice(e.price)}</td>
                    <td>${formatPrice(e.price * e.amount)}</td>
                </tr>`

        if (type === "Entrada") {
            entradas += (e.price * e.amount);
        } else if (type === "Saída") {
            saidas += (e.price * e.amount);
        };
    });

    ENTRADAS_HTML.innerHTML = `Total de entradas: ${formatPrice(entradas)}`;
    SAIDAS_HTML.innerHTML = `Tota de saídas: ${formatPrice(saidas)}`;
    SALDO_HTML.innerHTML = `Saldo: ${formatPrice(entradas+saidas)}`;
    TABLE_HTML.innerHTML = fullTable;
};

const setSelect = select => {
    selectValue = select.value;

    if (selectValue === "tipo") {
        init();
        return;
    } else if (selectValue === "entrada") {
        const inData = fullData.filter(e => {
            const inDataConditional = e.type.includes("IN")
            return inDataConditional;
        });
        renderTable(inData);
    } else if (selectValue === "saida") {
        const outData = fullData.filter(e => {
            const outDataConditional = e.type.includes("OUT")
            return outDataConditional;
        });
        renderTable(outData);
    };
};

const init = async () => {
    const initialFetch = await fetch("./material.json");
    const fetchToJson = await initialFetch.json();
    fullData = await fetchToJson;
    renderTable(fullData);
};

init();
