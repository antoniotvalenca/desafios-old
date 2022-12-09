const formatDate = date => {
    const addZeroDates = value => {
        if (value < 10) return `0${value}`;
        if (value >= 10) return `${value}`;
    };

    return `${addZeroDates(date.getDate())}/${addZeroDates(date.getMonth()+1)}/${addZeroDates(date.getFullYear())}`;
};

const amountProceduresSameKey = (data, key) => {
    const obj = { };

    data.forEach(e => {
        let dataKey;
        if (key == "created_at") {
            dataKey = formatDate(new Date(e[key]))
        } else {
            dataKey = e[key];
        }

        if (!dataKey) return;
        if (!obj[dataKey]){
            obj[dataKey] = {count: 0};
            obj[dataKey].count++;

            return;
        };

        obj[dataKey].count++
    });

    return obj;
};

const groupProceduresSameKey = (data, key) => {
    const obj = { };

    data.forEach(e => {
        const dataKey = e[key];

        if (!dataKey) return;
        if (!obj[dataKey]) {
            obj[dataKey] = {list: []}
            obj[dataKey].list.push(e);

            return;
        };

        obj[dataKey].list.push(e);
    });

    return obj;
};

const getFinantialValues = (data, id) => {
    let totalPrice = 0;
    let totalLiquidPrice = 0;
    let totalReceivedValue = 0;

    const idData = groupProceduresSameKey(data, "procedure_id");

    console.log(idData[id]);
    idData[id].list.forEach(e => {
        totalPrice += e.price;
        totalLiquidPrice += e.liquid_price;
        totalReceivedValue += e.received_value === null ? 0 : e.received_value;
    });

    let totalNonReceivedValue = totalLiquidPrice - totalReceivedValue;

    return `ID: ${id} /
    Total produzido: ${totalPrice} /
    Total líquido: ${totalLiquidPrice} /
    Total Recebido: ${totalReceivedValue} /
    Total não-recebido: ${totalNonReceivedValue}`;
};

let generalData;

const init = async () => {
    const response = await fetch("./material.json");
    let generalData = await response.json();

    // console.log(amountProceduresSameKey(generalData, "procedure_id"));
    // console.log(amountProceduresSameKey(generalData, "group_key"));
    // console.log(amountProceduresSameKey(generalData, "attendance_id"));
    // console.log(amountProceduresSameKey(generalData, "finance_id"));
    // console.log(getFinantialValues(generalData, *id que deseja buscar*));
    // console.log(amountProceduresSameKey(generalData, "tyss_type"));
    // console.log(groupProceduresSameKey(generalData, "attendance_id"));
    // console.log(groupProceduresSameKey(generalData, "procedure_id"));
    // console.log(amountProceduresSameKey(generalData, "created_at"));
};

init();
