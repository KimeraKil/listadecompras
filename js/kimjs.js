var inpSaldo = document.getElementById('inpSaldo');
var btnSalvarSaldo = document.getElementById('saveSaldo');

var btnLimpar = document.getElementById('cLista');

var labelLimite = document.getElementById('sLimite');
var LabelCompra = document.getElementById('svCompra');
var LabelTotal = document.getElementById('sTotal');

var inpProduto = document.getElementById('inpProduto');
var inpQtde = document.getElementById('inpQtde');
var inpValor = document.getElementById('inpValor');
var btnSalvar = document.getElementById('acresItem');

let lista = document.querySelector('#lcLista');


btnSalvarSaldo.addEventListener('click', savSaldo)
btnLimpar.addEventListener('click', limpaTudo)
btnSalvar.addEventListener('click', addItem)

inpProduto.addEventListener('keypress', (e)=>{
    if(e.keyCode == 13){
        inpQtde.focus()
    }
})

inpQtde.addEventListener('keypress', (e)=>{
    if(e.keyCode == 13){
        inpValor.focus()
    }
})

inpValor.addEventListener('keypress', (e) =>{
    if(e.keyCode == 13){
        addItem()
    }
})

function savSaldo(){
    if(inpSaldo.value == ""){
        localStorage.setItem(1, 0)
        labelLimite.innerHTML = "R$ 0,00"
    } else {
        localStorage.setItem(1, inpSaldo.value)
        var meuLimite = parseFloat(localStorage.getItem(1))
        labelLimite.innerHTML = meuLimite.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }
    
}

function limpaTudo(){
    localStorage.clear()
    window.location.reload();
    labelLimite.innerHTML = "R$ 0,00"
    LabelCompra.innerHTML = "R$ 0,00"
    LabelTotal.innerHTML = "R$ 0,00"
}

function addItem(){    
    if(inpValor.value == "" || inpQtde.value == ""){
        alert("Campos (Valor e Quantidade) são Obrigatorios")
    } else {
        var somaItem = inpQtde.value * inpValor.value
        if(localStorage.length == 0){ 
            localStorage.setItem(1, 0)           
            localStorage.setItem(2, inpProduto.value+'|'+inpQtde.value+'|'+somaItem)
            inpProduto.value = ""
            inpQtde.value = "1"
            inpValor.value =""
            separarValores(2)
            somarTudo()
        } else {
            localStorage.setItem(localStorage.length +1, inpProduto.value+'|'+inpQtde.value+'|'+somaItem)
            inpProduto.value = ""
            inpQtde.value = "1"
            inpValor.value =""
            separarValores(localStorage.length)
            somarTudo()
        }
    }
}

function somarTudo(){
    var totalAtt = 0;
    for (var i =2; i<= localStorage.length; i++){
        var valor = localStorage.getItem(i).split('|')
        totalAtt += parseFloat(valor[2]);
    }

        LabelCompra.innerHTML = totalAtt.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    if(localStorage.getItem(1) == 0){
        LabelTotal.innerHTML = totalAtt.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    } else {
        var resultSub = parseFloat(localStorage.getItem(1))
        var resultSubOK = resultSub - totalAtt
        LabelTotal.innerHTML = resultSubOK.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
    }
}

function separarValores(chave){
    var textoPuro = localStorage.getItem(chave);
    const quebraTexto = textoPuro.split('|');
    var moeda = parseFloat(quebraTexto[2])
    criarItemLI(chave, (quebraTexto[0]),(quebraTexto[1]), moeda);
}

function criarItemLI(chave, produto, qtde, valor){
    let li = document.createElement('li');
    li.id = chave;
    var spanP = document.createElement('span');
    var spanQ = document.createElement('span');
    var spanV = document.createElement('span');

    spanP.innerHTML = produto;
    spanP.classList.add('textoTarefa');
    spanQ.innerHTML = '('+qtde+')';
    spanQ.classList.add('textoTarefa');
    spanV.innerHTML = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    spanV.classList.add('textoTarefa');

    let div = document.createElement('div');
    let btnExcluir = document.createElement('button');

    btnExcluir.classList.add('btnRemove');
    btnExcluir.innerHTML = 'X';
    btnExcluir.setAttribute('onclick', 'excluir('+chave+')');

    div.appendChild(btnExcluir);

    lista.appendChild(li)
    li.appendChild(spanP);
    li.appendChild(spanQ);
    li.appendChild(spanV);
    li.appendChild(div);
    return li;

}

function excluir(id) {
    let confirmacao = window.confirm('Tem certeza que deseja excluir? ');
    if(confirmacao) {
        let li = document.getElementById(''+ id + '');
        if(li) {
            lista.removeChild(li);
            localStorage.removeItem(id)
            somarTudo()
        } else {
            alert('Elemento HTML não encontrado!');
        }
    }
}

function popularLista(){
    if (localStorage.length >= 1){
        for (var i = 2; i <= localStorage.length; i++){
            var valorChave = localStorage.getItem(i).split('|')
            criarItemLI(i, valorChave[0], valorChave[1], parseFloat(valorChave[2]))
            somarTudo()
            }
        } else {
            console.log ('Local Vazio')
        }
}