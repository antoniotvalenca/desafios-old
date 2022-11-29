const SEARCH_HTML = document.querySelector("#inputSearch");
const TABLE_HTML = document.querySelector("#jsonEntry");

const noResult =`<tr>
                    <td colspan="5" id="footer">Nenhuma guia encontrada</td>
                </tr>`;
let selectValue = "none";
let patientData;
let startDate;
let regularPhoto;
let noPhoto;
let photo;
let convenioDeleted;
let convenioNotDeleted;
let convenio;
let tableStructure;

const formatDate = data => {
    const addZero = value => {
        if (value < 10) return `0${value}`;
        if (value >= 10) return `${value}`;
    };

    return `${addZero(data.getDate())}/${addZero(data.getMonth()+1)}/${addZero(data.getFullYear())}`;
};

const formatSearch = search => {
    const searchFormated = search.toLowerCase().replace(/(?:^|\s)\S/g, firstLetter => {
        return firstLetter.toUpperCase();
    });

    return searchFormated;
};

const formatPrice = price => {
    return price.toLocaleString('pt-BR', {
    style: 'currency', currency: 'BRL'})
};

const formatTable = data => {
    TABLE_HTML.innerHTML = [];

    data.map(value => {
        startDate = new Date(value.start_date);

        regularPhoto = `<img src="${value.patient.thumb_url}">`;
        noPhoto = "https://via.placeholder.com/150x150.jpg";
        photo = value.patient.thumb_url == 'undefined' ? noPhoto : regularPhoto;

        convenioDeleted = `<td><s>${value.health_insurance.name}</s></td>`;
        convenioNotDeleted = `<td>${value.health_insurance.name}</td>`;
        convenio = value.health_insurance.is_deleted == true ? convenioDeleted : convenioNotDeleted;

        tableStructure = `<tr>
                            <td>${formatDate(startDate)}</td>
                            <td>${value.number}</td>
                            <td>${photo} ${value.patient.name}</td>
                            ${convenio}
                            <td>${formatPrice(value.price)}</td>
                        </tr>
                        <div>
                            <hr size="1" width="459%" noshade color="black" />
                        </div>`;

        TABLE_HTML.innerHTML += tableStructure;
    });
};

const init = async () => {
    const response = await fetch("./material.json");
    const generalData = await response.json();
    patientData = await generalData.guides;
    formatTable(patientData);
};

init();

const filterSelect = select => {
    selectValue = select.value;

    if (selectValue === "none") {
        init();
        return;
    };

    const filteredInsurance = patientData.filter(data => {
        const insuranceConditional = data.health_insurance.name.includes(selectValue);

        return insuranceConditional;
    });

    if (filteredInsurance.length == 0) {
        TABLE_HTML.innerHTML = noResult;
    } else {
        formatTable(filteredInsurance);
    };
};

SEARCH_HTML.addEventListener("input", () => {
    if (selectValue !== "none") return;

    if (SEARCH_HTML.value == '') {
        TABLE_HTML.innerHTML = '';
        init();
        return;
    };

    let searchValue = formatSearch(SEARCH_HTML.value);

    const filteredPatientData = patientData.filter(data => {
        const numberConditional = data.number.includes(searchValue);
        const patientNameConditional = data.patient.name.includes(searchValue);

        return (numberConditional || patientNameConditional);
    });

    if (filteredPatientData.length == 0) {
        TABLE_HTML.innerHTML = noResult;
    } else {
        formatTable(filteredPatientData);
    };
});