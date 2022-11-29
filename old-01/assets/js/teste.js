const valor = 55.7

const formatPrice = price => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'})
}

console.log(formatPrice(valor));