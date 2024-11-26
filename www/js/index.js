document.addEventListener('DOMContentLoaded', () => {
    const pizzariaId = 'pizzaria_do_ze';
    const applista = document.getElementById('applista');
    const appcadastro = document.getElementById('appcadastro');
    const pizzaListDiv = document.getElementById('pizzaList');
    const btnNovo = document.getElementById('btnNovo');
    const btnSalvar = document.getElementById('btnSalvar');
    const btnExcluir = document.getElementById('btnExcluir');
    const btnCancelar = document.getElementById('btnCancelar');
    const btnFoto = document.getElementById('btnFoto');
    const pizzaInput = document.getElementById('pizza');
    const precoInput = document.getElementById('preco');
    const imagemDiv = document.getElementById('imagem');
  
    let listaPizzasCadastradas = [];
    let selectedPizzaId = null;
  
    function carregarPizzas() {
      fetch(`https://pedidos-pizzaria.glitch.me/admin/pizzas/${pizzariaId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data !== '') {
            listaPizzasCadastradas = data;
            pizzaListDiv.innerHTML = '';
            listaPizzasCadastradas.forEach((item, idx) => {
              const novo = document.createElement('div');
              novo.classList.add('linha');
              novo.innerHTML = item.pizza;
              novo.id = idx;
              novo.onclick = function () {
                carregarDadosPizza(idx);
              };
              pizzaListDiv.appendChild(novo);
            });
          }
        });
    }
  
    function carregarDadosPizza(id) {
      selectedPizzaId = id;
      const pizza = listaPizzasCadastradas[id];
      appcadastro.style.display = 'flex';
      applista.style.display = 'none';
      pizzaInput.value = pizza.pizza;
      precoInput.value = pizza.preco;
      imagemDiv.style.backgroundImage = `url(${pizza.imagem})`;
    }
  
    btnNovo.addEventListener('click', () => {
      appcadastro.style.display = 'flex';
      applista.style.display = 'none';
      pizzaInput.value = '';
      precoInput.value = '';
      imagemDiv.style.backgroundImage = '';
    });
  
    btnCancelar.addEventListener('click', () => {
      appcadastro.style.display = 'none';
      applista.style.display = 'flex';
    });
  
    btnSalvar.addEventListener('click', () => {
      const payload = {
        pizzaria: pizzariaId,
        pizza: pizzaInput.value,
        preco: precoInput.value,
        imagem: imagemDiv.style.backgroundImage,
      };
      fetch(`https://pedidos-pizzaria.glitch.me/admin/pizza/`, {
        method: selectedPizzaId === null ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then(() => {
        carregarPizzas();
        appcadastro.style.display = 'none';
        applista.style.display = 'flex';
      });
    });
  
    btnExcluir.addEventListener('click', () => {
      const pizzaName = pizzaInput.value;
      fetch(
        `https://pedidos-pizzaria.glitch.me/admin/pizza/${pizzariaId}/${pizzaName}`,
        { method: 'DELETE' }
      ).then(() => {
        carregarPizzas();
        appcadastro.style.display = 'none';
        applista.style.display = 'flex';
      });
    });
  
    btnFoto.addEventListener('click', () => {
      navigator.camera.getPicture(
        (imageData) => {
          imagemDiv.style.backgroundImage = `url(data:image/jpeg;base64,${imageData})`;
        },
        (error) => {
          alert('Erro ao tirar foto: ' + error);
        },
        { quality: 50, destinationType: Camera.DestinationType.DATA_URL }
      );
    });
  
    carregarPizzas();
  });
  