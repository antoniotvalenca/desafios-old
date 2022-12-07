const SEARCH_HTML = document.querySelector("#inputSearch");
const TABLE_HTML = document.querySelector("#jsonEntry");
const MONTHBUTTON_HTML = document.querySelector("#monthbutton");
const TODAYBUTTON_HTML = document.querySelector("#daybutton");
const NAVSPAN_HTML = document.querySelector("#navspan");
const DATEPICKER_HTML = document.querySelector(".datepicker");
const ARROW_HTML = document.querySelector(".fa-solid");
const PAGES_HTML = document.querySelector("#pages")
const QNT_RESULT_PAGE = 2;
const NO_RESULT =`<tr><td colspan="5" id="footer">Nenhuma guia encontrada</td></tr>`;

let patientData;
let currentData;

let startDate;
let regularPhoto;
let noPhoto;
let photo;
let convenioDeleted;
let convenioNotDeleted;
let convenio;
let tableStructure;

let orderData = "crescent";
let sortedData;
let selectValue = "none";
let filteredDataByDate;
let monthDatepickerValue;

let currentPage = 1;
let totalPages;

const addZeroDates = value => {
    if (value < 10) return `0${value}`;
    if (value >= 10) return `${value}`;
};

const thisMonthValue = () => {
    const date = new Date();

    monthDatepickerValue = `${addZeroDates(date.getFullYear())}-${addZeroDates(date.getMonth()+1)}`;
    return `${addZeroDates(date.getFullYear())}-${addZeroDates(date.getMonth()+1)}`
};

const todayValue = () => {
    const date = new Date();

    return `${addZeroDates(date.getFullYear())}-${addZeroDates(date.getMonth()+1)}-${addZeroDates(date.getDate())}`
};

const formatDate = date => {
    return `${addZeroDates(date.getDate())}/${addZeroDates(date.getMonth()+1)}/${addZeroDates(date.getFullYear())}`;
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

const sortByDateCrescent = (a, b) => {
    return new Date(a.start_date) - new Date(b.start_date);
};

const sortByDateDecrescent = (a,b) => {
    return new Date(b.start_date) - new Date(a.start_date);
};

const renderPagesNav = data => {
    const dataLength = data.length;
    totalPages = Math.ceil(dataLength/QNT_RESULT_PAGE);
    const pageCriationAllowance = dataLength > 0 ? true : false;
    let htmlResult = '';

    if (totalPages <= 1) {
        PAGES_HTML.innerHTML = '';
        return;
    };

    if (pageCriationAllowance) {
        htmlResult += `<li class="page-item">
                            <button class="page-link" href="" onClick="onPageChange(1)">Primeiro</button>
                        </li>
                        <li class="page-item">
                            <button class="page-link" href="" onClick="onPageChange(currentPage - 1)">Anterior</button>
                        </li>`;

        for (let i = 1; i <= totalPages; i++) {
            let active = i === currentPage ? 'active' : ''
            htmlResult +=  `<li class="page-item">
                                <button class="page-link ${active}" href="" onClick="onPageChange(${i})">${i}</button>
                            </li>`;
        };

        htmlResult += `<li class="page-item">
                            <button class="page-link" href="" onClick="onPageChange(currentPage + 1)">Próximo</button>
                        </li>
                        <li class="page-item">
                            <button class="page-link" href="" onClick="onPageChange(${totalPages})">Último</button>
                        </li>`
    };
    PAGES_HTML.innerHTML = htmlResult;
};

const formatTable = data => {
    currentData = data;

    TABLE_HTML.innerHTML = [];
    tableStructure = '';

    if (orderData === "crescent") {
        sortedData = currentData.sort(sortByDateCrescent);
    } else if (orderData === "decrescent") {
        sortedData = currentData.sort(sortByDateDecrescent);
    };

    sortedData.map(value => {
        startDate = new Date(value.start_date);

        regularPhoto = `<img src="${value.patient.thumb_url}">`;
        noPhoto = "https://via.placeholder.com/150x150.jpg";
        photo = value.patient.thumb_url == 'undefined' ? noPhoto : regularPhoto;

        convenioDeleted = `<td><s>${value.health_insurance.name}</s></td>`;
        convenioNotDeleted = `<td>${value.health_insurance.name}</td>`;
        convenio = value.health_insurance.is_deleted == true ? convenioDeleted : convenioNotDeleted;

        tableStructure += `<tr>
                            <td>${formatDate(startDate)}</td>
                            <td>${value.number}</td>
                            <td>${photo} ${value.patient.name}</td>
                            ${convenio}
                            <td>${formatPrice(value.price)}</td>
                        </tr>
                        <div>
                            <hr size="1" width="459%" noshade color="black"/>
                        </div>`;
    });

    let finalData = tableStructure.split('</div>');
    finalData.pop();


    if (finalData.length == 0) {
        TABLE_HTML.innerHTML = NO_RESULT;
    } else if (finalData.length <= QNT_RESULT_PAGE) {
        console.log(finalData);
        TABLE_HTML.innerHTML = finalData;
    } else if (finalData.length > QNT_RESULT_PAGE && finalData.length < patientData.length) {
        if (currentPage == 3) currentPage = 1;
        
        const count = (currentPage * QNT_RESULT_PAGE) - QNT_RESULT_PAGE;
        const delimiter = count + QNT_RESULT_PAGE;

        for (let i = count; i < delimiter; i++) {
            TABLE_HTML.innerHTML += finalData[i];
        };
    } else {
        const count = (currentPage * QNT_RESULT_PAGE) - QNT_RESULT_PAGE;
        const delimiter = count + QNT_RESULT_PAGE;

        for (let i = count; i < delimiter; i++) {
            TABLE_HTML.innerHTML += finalData[i];
        };
    };
    renderPagesNav(sortedData);
};

const init = async () => {
    const response = await fetch("./material.json");
    const generalData = await response.json();
    patientData = await generalData.guides;

    formatTable(patientData);
};

init();

ARROW_HTML.addEventListener("click", () => {
    if (orderData === "crescent") {
        orderData = "decrescent";
        ARROW_HTML.classList.replace("fa-sort-up", "fa-sort-down");
        if (SEARCH_HTML.value !== '') return;
        if (MONTHBUTTON_HTML.classList.contains("buttonclicked")) return;
        if (TODAYBUTTON_HTML.classList.contains("buttonclicked")) return;
        if (selectValue !== "none") return;
        init();
    } else {
        orderData = "crescent";
        ARROW_HTML.classList.replace("fa-sort-down", "fa-sort-up");
        if (SEARCH_HTML.value !== '') return;
        if (MONTHBUTTON_HTML.classList.contains("buttonclicked")) return;
        if (TODAYBUTTON_HTML.classList.contains("buttonclicked")) return;
        if (selectValue !== "none") return;
        init();
    };
});

const filterSelect = select => {
    if (MONTHBUTTON_HTML.classList.contains("buttonclicked") || TODAYBUTTON_HTML.classList.contains("buttonclicked")) return;
    if (SEARCH_HTML.value !== '') return;
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
        TABLE_HTML.innerHTML = NO_RESULT;
    } else {
        formatTable(filteredInsurance);
    };
};

SEARCH_HTML.addEventListener("input", () => {
    if (selectValue !== "none") return;
    if (MONTHBUTTON_HTML.classList.contains("buttonclicked") || TODAYBUTTON_HTML.classList.contains("buttonclicked")) return;

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
        TABLE_HTML.innerHTML = NO_RESULT;
    } else {
        formatTable(filteredPatientData);
    };
});

MONTHBUTTON_HTML.addEventListener("click", () => {
    if (SEARCH_HTML.value !== '') return;
    if (selectValue !== "none") return;

    TODAYBUTTON_HTML.classList.remove("buttonclicked");
    MONTHBUTTON_HTML.classList.toggle("buttonclicked");

    if (MONTHBUTTON_HTML.classList.contains("buttonclicked")){
        NAVSPAN_HTML.innerHTML = `<input type="month" class="datepicker" value=${thisMonthValue()} onchange="setMonthDatepicker(this)" />`;
        monthDatepickerValue = thisMonthValue();
    } else {
        NAVSPAN_HTML.innerHTML = '';
        init();
        return;
    };

    filteredDataByDate = patientData.filter(data => {
        const dateConditional = data.start_date.includes(monthDatepickerValue);

        return dateConditional;
    });

    if (filteredDataByDate.length == 0) {
        TABLE_HTML.innerHTML = NO_RESULT;
        PAGES_HTML.innerHTML = '';
    } else {
        formatTable(filteredDataByDate);
    };
});

const setMonthDatepicker = date => {
    if (SEARCH_HTML.value !== '') return;
    if (selectValue !== "none") return;

    monthDatepickerValue = date.value;

    filteredDataByDate = patientData.filter(data => {
        const dateConditional = data.start_date.includes(monthDatepickerValue);

        return dateConditional;
    });

    if (filteredDataByDate.length == 0) {
        TABLE_HTML.innerHTML = NO_RESULT;
    } else {
        formatTable(filteredDataByDate);
    };
};

TODAYBUTTON_HTML.addEventListener("click", () => {
    if (SEARCH_HTML.value !== '') return;
    if (selectValue !== "none") return;
    if (MONTHBUTTON_HTML.classList.contains("buttonclicked")) return;

    MONTHBUTTON_HTML.classList.remove("buttonclicked");
    TODAYBUTTON_HTML.classList.toggle("buttonclicked");

    if (TODAYBUTTON_HTML.classList.contains("buttonclicked")){
        NAVSPAN_HTML.innerHTML = `<input type="date" class="datepicker" min=${todayValue()} max=${todayValue()} value=${todayValue()} />`
    } else {
        NAVSPAN_HTML.innerHTML = '';
        init();
        return;
    };

    filteredDataByDate = patientData.filter(data => {
        const dateConditional = data.start_date.includes(todayValue());

        return dateConditional;
    });

    if (filteredDataByDate.length == 0) {
        TABLE_HTML.innerHTML = NO_RESULT;
        PAGES_HTML.innerHTML = '';
    } else {
        formatTable(filteredDataByDate);
    };
});

const onPageChange = pageNumber => {
    if (pageNumber < 1) {
        currentPage = 1;
    } else if (pageNumber > totalPages) {
        currentPage = 3;
    } else {
        currentPage = pageNumber;
    }

    formatTable(currentData);
};
