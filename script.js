let selic = 0;


async function obterTaxaSELIC() {
    try {
        const response = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json');
        const data = await response.json();
        selic = parseFloat(data[0].valor); 
    } catch (error) {
        console.error("Erro ao obter a taxa SELIC:", error);
        alert("Não foi possível obter a taxa SELIC. Usando valor padrão de 6.0%");
        selic = 6.0;
    }
}



function calcularInvestimento(valorDesviado, anos) {
    const r = selic / 100; 
    const n = 1; 
    const A = valorDesviado * Math.pow((1 + r / n), n * anos);
    return A.toFixed(2);
}

async function calcularImpacto() {
    await obterTaxaSELIC(); 

    const meses = parseFloat(document.getElementById('meses').value);
    const valor = parseFloat(document.getElementById('valor').value);
    const anos = parseFloat(document.getElementById('anos').value);

    if (!meses || !valor || !anos) {
        alert("Por favor, preencha os campos corretamente.");
        return;
    }

    function calcularImpactoFinanceiro(valorDesviado) {
        const mesesAlimentacao = (valorDesviado / 600).toFixed(0); 
        const cestasBasicas = (valorDesviado / 150).toFixed(0); 
        const roupas = (valorDesviado / 200).toFixed(0); 
    
        return `Com esse valor, você poderia garantir ${mesesAlimentacao} meses de alimentação básica, ${cestasBasicas} cestas básicas ou comprar roupas para ${roupas} meses.`;
    }
    
    function calcularDanoPsicologico(valorDesviado) {
        if (valorDesviado > 1000) {
            return 'Apostar grandes quantias pode causar ansiedade, estresse financeiro e até conflitos familiares.';
        } else if (valorDesviado > 500) {
            return 'Mesmo quantias moderadas podem gerar estresse financeiro e endividamento a longo prazo.';
        } else {
            return 'Apostar pequenas quantias ainda pode gerar vício e contribuir para a perda de controle financeiro.';
        }
    }

    const valorDesviado = meses * valor;
    const rendimentoInvestimento = calcularInvestimento(valorDesviado, anos);
    const impactoFinanceiro = calcularImpactoFinanceiro(valorDesviado);
    const danoPsicologico = calcularDanoPsicologico(valorDesviado);

    document.getElementById('resultado').innerHTML = 
        `<strong>Impacto Financeiro:</strong> Você desviou R$ ${valorDesviado.toFixed(2)} para apostas.<br>
        <strong>Impacto Psicológico:</strong> ${danoPsicologico}<br>
        <strong>Alternativas:</strong> ${impactoFinanceiro}<br>
        <strong>Simulação de Investimento:</strong> Se tivesse investido esse valor à taxa SELIC (Poupança Básica) de ${selic}% por ${anos} anos, você teria R$ ${rendimentoInvestimento}.`;
}
