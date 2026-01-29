
// recupera a caixa de busca para ser usada em buscas nos links.
const inputsearchEngine = document.querySelector('#searchEngine');

// botão que aciona o modal de adicionar um novo feed
const btnAddFeed = document.querySelector('#btnNewFeed');

//função que escurece a tela ao abrir um modal
const overlayModal = document.querySelector("#overlay");

// modal de adicionar um novo feed e o botão de fechar modal
const modalnewFeed = document.querySelector('#modalNewFeed');
const btnclosemodalnewFeed = document.querySelector('#closeModalNewFeed');

//ID do formulario de adicionar novo feed
const frmNewFeed = document.querySelector('#frmNewFeed');

// ID do select de categorias do modal de adicionar um novo feed
const catFeedSelect = document.querySelector('#categoriesFeed');

// UL responsavel por exibir o menu de categorias no sidebar
const ulCategorias = document.querySelector('.sidebar-nav');

//div responsavel por exibir a mensagem de boas-vindas
const divdefaultDisplay = document.querySelector('#defaultDisplay');

//div responsável por exibir a tela do feed selecionado
const divfeedDisplay = document.querySelector('#feedDisplay');
//div responsável por exibir mensagem de bom-dia/boa-tarde/boa-noite
const divwelcomeMessage = document.querySelector('.welcomeMessage');
//botão que aciona a funçao de atualizar as noticias de um feed selecionado
const btnupdateNews = document.querySelector('#updateNews');
//botão que exibe as noticias fatiado
const btnVerMais = document.querySelector('#carregarMais');

//botão que exibe as noticias fatiado da home
const btnVerMaisHome = document.querySelector('#carregarMaisHome');

//div que exibe os links do feed
const feedDiv = document.querySelector('#linksFeed');

//modal de configurações
const modalSettings = document.querySelector('#modalSettings');
const btnSettings = document.querySelector('#btnSettings');
const btncloseModalSettings = document.querySelector('#closeModalSettings');
const dvcatSetting = document.querySelector('#catSetting');
const dvcatItems = document.querySelector('#catItems');
const inptfilters = document.querySelector('#filter_input');

//modal responsável pela criação de nova categoria
const btnNewCat = document.querySelector('#btnNewCategoria');
const btnCloseModalNCat = document.querySelector('#closeModalNewCat');
const modalNewCat = document.querySelector('#modalNewCat');
const frmNewCat = document.querySelector('#frmNewCat');

//modal responsável por editar uma categoria
const btnEditCat = document.querySelector('#btnNewCategoria');
const btnCloseModalEditCat = document.querySelector('#closeModalEditCat');
const modalEditCat = document.querySelector('#modalEditCat');
const frmEditCat = document.querySelector('#frmEditCat');
const inpteditnomeCategoria = document.querySelector('#editnomeCategoria');

//modal responsável por editar os dados de um feed
const btnCloseModalEditFeed = document.querySelector('#closeModalEditFeed');
const modalEditFeed = document.querySelector('#modalEditFeedData');
const frmEditFeed = document.querySelector('#frmEditFeed');
const inpteditnomeFeed = document.querySelector('#editnomeFeed');
const inptediturlFeed = document.querySelector('#editurlFeed');
const btnrenameFeed = document.querySelector('#renameFeed');

//modal responsável por apagar um feed selecionado
const modalDeleteFeed = document.querySelector('#modalDeleteFeed');
const btndeleteFeed = document.querySelector('#deleteFeed');
const bntcloseModalDeleteFeed = document.querySelector('#closeModalDeleteFeed');
const btntCancelDeleteFeed = document.querySelector('#cancelDelete');
const btntConfirmDeleteFeed = document.querySelector('#ConfirmdeleteFeed');

//modal responsável por apagar uma categoria selecionado
const modalDeleteCat = document.querySelector('#modalDeleteCat');
const btndeleteCat = document.querySelector('#deleteCat');
const bntcloseModalDeleteCat = document.querySelector('#closeModalDeleteCat');
const btntCancelDeleteCat = document.querySelector('#cancelDeleteCat');
const btntConfirmDeleteCat = document.querySelector('#ConfirmdeleteCat');

const pyear = document.querySelector('.pyear');
pyear.textContent = `${new Date().getFullYear()} `;

const btnLaterNews = document.querySelector('#mreadlater');
const bxcontrols = document.querySelector('#controls-forms');

//Div na fomrresponsavel por exibir o feed das noticias na home.
const divlstFeed = document.querySelector('#lastFeeds');

const dvprnDayMessage = document.querySelector('#prnDayMessage');

//botao que chama a função para atualizar todas as noticias
const btnUpdateAll = document.querySelector('#btnupdateAll');

// função que aparece e esconde o sidebar
const hamburguer = document.querySelector('.toggle-btn');
hamburguer.addEventListener('click', ()=>{
    document.querySelector('#sidebar').classList.toggle('collapsed');
})


let totalNews = [];
let itensExibidos = 0;
let QuantidadeporVez = 5;

let feedIDClicked = null;
let CatClicked = null;
let nameCat = null

const db = new Dexie('FeedRss');

db.version(1).stores({
    feeds: `id, nome_feed, feed_url, cat_id`
});

db.version(2).stores({
    categorias: `id, nome_categoria`
});

db.version(3).stores({
    links: `id, title, description, link, pubdate, creator, feedid`
});

db.version(4).stores({
    favoritos: `id, title, description, link, pubdate, creator, feedid`
});

db.version(5).stores({
    blacklist: `id, palavra`
});

let blacklistArr = [];

const generateUUID=()=> {
    const uniqueid = crypto.randomUUID();
    return uniqueid;
}

// função que faz a abertura de uma janela modal na tela
const openModal = (idmodal) => {
    idmodal.style.display = 'block';
    overlayModal.style.display = 'block';
}

// função que faz a fechamento de uma janela modal na tela
const closeModal = (idmodal) => {
    idmodal.style.display = 'none';
    overlayModal.style.display = 'none';
}

//função responsavel por validar se uma URL é valida
const isValidURL = (url) => {
    if(URL.canParse(url)) {
        return true;
    }else{
        return false;
    }
}

const getBlacklist = async () => {

    blacklistArr = [];

    const filtroLinks = await db.blacklist.get(1);

    if(filtroLinks) {

        const nameList = filtroLinks.palavra;

        inptfilters.value = nameList;

        nameList.split(',').map(item => {
            if(item !== ''){
                blacklistArr.push(item);
            }
        })

    }

}

const getinfofeedData = async (feedid) => {

    const a = await db.feeds.where('id').equals(feedid).toArray()

    if(a) {
        return a;
    }


}

const printMessageDayNight=()=> {

    const dataAtual = new Date();
    const hora = dataAtual.getHours();

    // if(hora >= 0 && hora < 12) {
    //     divwelcomeMessage.innerHTML = `<span class="daynighticon">☀️</span>Bom Dia!`;
    // }else if(hora >= 12 && hora <= 18) {
    //     divwelcomeMessage.innerHTML = `<span class="daynighticon">☀️</span>Boa Tarde!`;
    // }else{
    //     divwelcomeMessage.innerHTML = `<span class="daynighticon">🌙</span>Boa Noite!`;
    // }

    //dvprnDayMessage

    if(hora >= 0 && hora < 12) {
        dvprnDayMessage.innerHTML = `<span class="daynighticon">☀️</span>Bom Dia!`;
    }else if(hora >= 12 && hora <= 18) {
        dvprnDayMessage.innerHTML = `<span class="daynighticon">☀️</span>Boa Tarde!`;
    }else{
        dvprnDayMessage.innerHTML = `<span class="daynighticon">🌙</span>Boa Noite!`;
    }

}


const lerDepois = async (item) => {

    const existe = await db.favoritos.where('link').equals(item.link).count();

    if(existe === 0) {

        await db.favoritos.add({
            id: generateUUID(),
            title: item.title,
            description: item.description,
            link: item.link,
            pubdate: item.pubdate,
            creator: item.creator,
            feedid: item.feedid
        });
        //console.log('Noticia adicionada nos favoritos!');
        showMessage('Noticia salva.', 0, '#toastMessages');
    } else {
        //console.log('Essa noticia ja foi salva!');
        showMessage('Noticia ja está salva.', 2, '#toastMessages');
    }

}

const updateFilters = async (filtros) => {

    if(filtros.trim().length === 0){
        console.error('Esse campos não pode ficar vazio!');
    }else{

        const textFilter = filtros.replace(/, /g, ",");

        await db.blacklist.update(1, { "palavra": textFilter })
        .then(() => {
            showMessage('Filtros salvo', 0, '#toastMessages');
        }).catch(error => {
            //console.error('Ocorreu um erro: '+error);
            showMessage('Erro ao salvar os filtros', 2, '#toastMessages');
        })

    }

}


const removeFavorito = async (id) => {

    await db.favoritos.delete(id);
    showMessage('Noticia removida.', 0, '#toastMessages');
    viewFavoritos();

}

const showMessage = (msg, status, msgboxid) => {

    const messageboxDiv = document.querySelector(`${msgboxid}`);

    const toast = document.createElement('div');
    toast.classList.add('toast');

    if(status === 0) {
        toast.classList.add('success');
        toast.innerHTML = `<span><i class="las la-check"></i> ${msg}</span>`;

    } else if(status === 1) {
        toast.classList.add('invalid');
        toast.innerHTML = `<span><i class="las la-exclamation"></i> ${msg}</span>`;
    } else {
        toast.classList.add('error');
        toast.innerHTML = `<span><i class="las la-times"></i> ${msg}</span>`;
    }

    setTimeout(()=> {
        toast.remove();
    }, 3000);

    messageboxDiv.appendChild(toast);

}


//função assincrona usada para criar uma nova categoria.
const criarCategoria = async (nomeCategoria) => {

    await db.categorias.add({
        id: generateUUID(),
        nome_categoria: nomeCategoria
    }).then(() => {
        //console.log('Categoria criada com sucesso.');
        showMessage('Categoria criada!', 0, '#toastMessages');
    }).catch(error => {
        //console.error('Ocorreu um erro: '+error);
        showMessage('Erro ao criar a categoria!', 2, '#toastMessages');
    });

}


//função assincrona usada para criar uma nova categoria.
const updateCategoria = async (nomeCategoria, catid) => {

    await db.categorias.where('id').equals(catid).modify(cat => {
        cat.nome_categoria = nomeCategoria;
    }).then(() => {
        //console.log('Categoria atualizada com sucesso.');
        showMessage('Categoria atualizada!', 0, '#toastMessages');
    }).catch(error => {
        //console.error('Ocorreu um erro: '+error);
        showMessage('Erro ao atualizar categoria!', 2, '#toastMessages');
    });

}

//função assincrona usada para apagar a categoria(feeds e links).
const deleteCategoria = async (catid) => {

    await db.feeds.where('cat_id').equals(catid).toArray()
    .then(result => {
        result.forEach(item => {
            deleteLink(item.id);
        })
    }).catch(error => {
        //console.error('Ocorreu um erro: '+error);
    });

    await db.feeds.where('cat_id').equals(catid).delete()
    .then(success => {
        //console.log('feeds apagado com sucesso.');
    }).catch(error => {
        //console.error('Ocorreu um erro: '+error);
    });

    await db.categorias.where('id').equals(catid).delete()
    .then(() => {
        //console.log('categoria apagado com sucesso.');
        showMessage('Categoria apagada!', 0, '#toastMessages');
        viewCategoriasSidebar();
    }).catch(error => {
        //console.error('Ocorreu um erro: '+error);
        showMessage('Ocorreu um erro ao apagar a categoria', 2, '#toastMessages');
    });

}

//função assincrona usada para atualizar os dados de um feed.
const updateFeedData = async (nomeFeed, urlFeed, feedid) => {

    await db.feeds.where('id').equals(feedid).modify(feed => {
        feed.nome_feed = nomeFeed;
        feed.feed_url = urlFeed;
    }).then(() => {
        //console.log('Nome do feed atualizado com sucesso.');
        showMessage('feed atualizado!', 0, '#toastMessages');
    }).catch(error => {
        //console.error('Ocorreu um erro: '+error);
        showMessage('Ocorreu um erro ao atualizar!', 2, '#toastMessages');
    });

}

//função assincrona usada para apagar um feed.
const deleteFeed = async (feedid) => {

    await db.feeds.where('id').equals(feedid).delete()
    .then(() => {
        //console.log('feed apagado com sucesso.');
        showMessage('Feed apagado!', 0, '#toastMessages');
        deleteLink(feedid);
    }).catch(error => {
        //console.error('Ocorreu um erro: '+error);
        showMessage('Ocorreu um erro ao apagar o feed!', 2, '#toastMessages');
    });

}

//função assincrona usada para apagar um feed.
const deleteLink = async (feedid) => {

    await db.links.where('feedid').equals(feedid).delete()
    .then(success => {
        //console.log('links apagado com sucesso.');
    }).catch(error => {
        //console.error('Ocorreu um erro: '+error);
    });

}

//função assincrona que atualiza os links de um feed especifico
const updateNews = async (feedid) => {

    if(!feedid) return;

    const idUnico = !Array.isArray(feedid);

    if(idUnico && btnupdateNews) {
        btnupdateNews.disabled = true;
        btnupdateNews.innerHTML = `<span class="updating-icon">&#x27F3;</span> Atualizando ...`;
    }

    const result = await db.feeds.where('id').anyOf(feedid).toArray()

    const update = result.map(item => getNews(item.feed_url, item.id));
    await Promise.all(update);


    const contg = document.querySelector('#cntdNews');
    if(idUnico && contg) {
        await getTotalNewsfromFeed(feedid);
        const total = await totalLinksfromFeed(feedid);
        contg.innerHTML = `Esse feed tem <strong>${total}</strong> noticias disponiveis.`;
    }

    if(idUnico && btnupdateNews) {
        btnupdateNews.disabled = false;
        btnupdateNews.innerHTML = `&#x27F3; Atualizar`;
    }

}

//função assincrona responsável por inserir um novo feed na tabela feeds
const addFeed = async (feedData) => {

    const { nomeFeed, urlFeed, categoriesFeed } = feedData;

    // const feedname = feedData.nomeFeed;
    // const feedlink = feedData.urlFeed;
    // const feedCategoria = feedData.categoriesFeed;

    await db.feeds.add({
        id: generateUUID(),
        nome_feed: nomeFeed,
        feed_url: urlFeed,
        cat_id: categoriesFeed
    }).then(() => {
        //console.log('Feed adicionado com sucesso!');
        showMessage('Feed adicionado com sucesso!', 0, '#toastMessages');
    }).catch(error => {
        //console.error('Ocorreu um erro: '+error);
        showMessage('Ocorreu um erro ao adicionar o Feed!', 2, '#toastMessages');
    });

    
}

// função assincrona que adiciona as noticias do feed na tabela links
const addLink = async (linkData) => {

    const feedid = linkData.feedid;
    const title = linkData.title;
    const description = linkData.description;
    const link = linkData.link;
    const pubdate = linkData.pubdate;
    const creator = linkData.creator;

    const exist = await db.links.where('link').equals(link.trim()).count();

    if(exist === 0){

        return await db.links.add({
        id: generateUUID(),
        title: title,
        description: description,
        link: link,
        pubdate: pubdate,
        creator: creator,
        feedid: feedid
        }).then(() => {
            //console.log('Link adicionado com sucesso!');
        }).catch(error => {
            //console.error('Ocorreu um erro: '+error);
        })
    }else {
        return Promise.resolve();
    }

}

//função que permite que só uma opção do menu ativo apareça destacado.
const tirarSelecao = () => {
    const tdSelecionados = [...document.querySelectorAll('.active')];
    tdSelecionados.forEach(el => el.classList.remove('active'));
}

const converttoTimestamp = (pubdate) => {

    const timestamp = Date.parse(pubdate);

    return timestamp;

}

const limitText = (text, limit) => {
    if(text.length <= limit) return text;

    const sub = text.substr(0, limit);
    return sub.substr(0, Math.min(sub.length, sub.lastIndexOf(" "))) + "...";
}

//função responsável por converter o pubdate em timestamp timeago
const timeAgo = (pubdate) => {

    const data = new Date(pubdate);
    const agora = new Date()
    const segundos = Math.floor((agora - data) / 1000);

    if(segundos < 1) { return "agora mesmo"; }

    const intervalo = [
        { label: 'ano', segundo: 31536000 },
        { label: 'mes', segundo: 2592000 },
        { label: 'dia', segundo: 86400 },
        { label: 'hora', segundo: 3600 },
        { label: 'minuto', segundo: 60 },
        { label: 'segundo', segundo: 1 }
    ]

   for(let i = 0; i < intervalo.length; i++) {
     const interval = intervalo[i];
     const contagem = Math.floor(segundos / interval.segundo);
     if(contagem >= 1) { return `${contagem} ${interval.label}${contagem > 1 ? 's' : '' } atras`; }
   }

}

//função assincrona que recebe o feed e recupera da tabela os links que pertencem ao feed
const getNewsfromFeed = async (feedid) => {

    feedDiv.innerHTML = '';

    await db.links.where('feedid').equals(feedid).toArray()

    .then(result => {

        const filtrar = result.filter(item => !item.description.includes('futebol'));

        filtrar.forEach(item => {
            
            const article = document.createElement('article');
            article.classList.add('feed');

            const h2TituloNews = document.createElement('h2');

            const title = item.title;
            const description = item.description;
            
            const linkHref = document.createElement('a');
            //linkHref.textContent = `${(title.length > 80) ? title.substr(0, 80)+' ...' : title}`;
            linkHref.textContent = `${limitText(title, 80)}`;
            linkHref.href = item.link;

            const pDescricao = document.createElement('p');
            pDescricao.textContent = `${limitText(description, 200)}`;
            //pDescricao.textContent = (description.length > 400) ? description.substr(0, 200)+' ...' : description;
            pDescricao.classList.add('description');

            const bxArticleControls = document.createElement('div');
        bxArticleControls.classList.add('controls-article');
        
        const btnReadLater = document.createElement('button');
        btnReadLater.innerHTML = ' <i class="lar la-bookmark"></i> Ler depois ';

        btnReadLater.onclick = () =>{
            lerDepois(item);
        }

        const pPubicacaoData = document.createElement('p');
        pPubicacaoData.textContent = timeAgo(item.pubdate);
        pPubicacaoData.classList.add('publicationDate');


            h2TituloNews.appendChild(linkHref);
            article.appendChild(h2TituloNews);
            article.appendChild(pDescricao);
            bxArticleControls.appendChild(btnReadLater)
            bxArticleControls.appendChild(pPubicacaoData);
            article.appendChild(bxArticleControls);
            feedDiv.appendChild(article);

        })
    });

}

//função assincrona que exibe no lado direitos as noticias do feed selecionado
const viewFeeds = async (feedID) => {

    const titulodoFeed = document.querySelector('#titledoFeed');
    const contg = document.querySelector('#cntdNews');
    const total = await totalLinksfromFeed(feedID);

    await db.feeds.where('id').equals(feedID).toArray()


    .then(result => {
        titulodoFeed.innerHTML = `<i class="las la-rss"></i> ${result[0].nome_feed}`;
        contg.innerHTML = `Esse feed tem <strong>${total}</strong> noticias disponiveis.`;
        getTotalNewsfromFeed(feedID);
    });

}

const contarOcorrencias = (string, word) => {

    const escapeWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapeWord}\\b`,'gi');

    const matchs = string.match(regex) || 0;

    return matchs.length;

}


const buscaLinks = async (termo) => {

    if(!termo || termo.trim().length < 3){
        console.error("Inclua pelo menos 3 caracteres");
        btnVerMais.style.display = 'none';
        return;
    }

    feedDiv.innerHTML = '';
    totalNews = [];
    itensExibidos = 0;

    const query = termo.toLowerCase().split(' ');

    const titulodoFeed = document.querySelector('#titledoFeed');
    const contg = document.querySelector('#cntdNews');
    contg.innerHTML = '';
    titulodoFeed.textContent = `Resultados da pesquisa para "${termo}"`;

    const resultadosBusca = await db.links.filter(link => {
        return link.title.toLowerCase().includes(termo.toLowerCase()) || link.description.toLowerCase().includes(termo.toLowerCase())
    }).toArray()

    if(resultadosBusca.length === 0) {
        
        
        
        //console.log("Nenhum resultado encontrado");
        btnVerMais.style.display = 'none';
        return;
    }

    resultadosBusca.forEach((item) => {

        const titulo = item.description.toLowerCase();

        const cntTotal = query.reduce((acumulador, kwd) => {
            return acumulador + (contarOcorrencias(titulo, kwd) || 0);
        }, 0);

        item.frequencia = cntTotal;

    })


    resultadosBusca.sort((a, b) =>  b.frequencia - a.frequencia );

    totalNews = resultadosBusca;

    //console.log(totalNews);

    carregarMais();

}


//função responsavel por gerar o array de links salvos para ler mais tarde
const viewFavoritos = async () => {

    feedDiv.innerHTML = '';
    totalNews = [];
    itensExibidos = 0;

    const titulodoFeed = document.querySelector('#titledoFeed');
    const contg = document.querySelector('#cntdNews');

    contg.innerHTML = '';

    titulodoFeed.innerHTML = `<i class="lar la-bookmark"></i> Ler mais tarde`;

    const salvos = await db.favoritos.toArray();

    if(totalNews.length == 0) {

        const divMsgEmptyNews = document.createElement('div');
        divMsgEmptyNews.classList.add('msg_empty');

        const imgerro = document.createElement('img');
        imgerro.src = 'assets/images/no-feed.webp';

        const msgTitle = document.createElement('h2');
        msgTitle.classList.add('subtitle_min');
        msgTitle.textContent = 'Está um pouco vazio por aqui.'

        const spanMsg = document.createElement('p');
        spanMsg.textContent = 'Nenhum feed adicionado aos favoritos. ';

        divMsgEmptyNews.appendChild(imgerro);
        divMsgEmptyNews.appendChild(msgTitle);
        divMsgEmptyNews.appendChild(spanMsg);
        feedDiv.appendChild(divMsgEmptyNews);

    }

    totalNews = salvos.sort((a, b) => {
        const dataA = new Date(a.pubdate);
        const dataB = new Date(b.pubdate);
        return dataB - dataA;
    });

    
    carregarMaisFavoritos();

}


//função que exibe os feeds de cada categoria passando o ( id da categoria e a id da li que pertence a categoria )
const getFeeds = async (catid, LiCat) => {

    const UlFeed = document.createElement('ul');
    UlFeed.classList.add('submenu-nav');

    await db.feeds.where('cat_id').equals(catid).toArray()

    .then(result => {
        result.forEach(item => {

           const liSubMenu = document.createElement('li');
           liSubMenu.classList.add('submenu-link');

           const nome_feed = item.nome_feed;
           const url_feed = item.feed_url;
           
           const labelSubMenu = document.createElement('label');
           labelSubMenu.htmlFor = `submenu-${item.id}`;
           labelSubMenu.classList.add('submenu-link');
           labelSubMenu.innerHTML = `<i class="las la-rss"></i> ${(nome_feed.length > 15) ? nome_feed.substr(0, 10)+' ...' : nome_feed}`;

            labelSubMenu.onclick = () => {
                tirarSelecao();
                feedIDClicked = item.id;       
                labelSubMenu.classList.add('active');
                divdefaultDisplay.style.display = 'none';
                divfeedDisplay.style.display = 'block';
                bxcontrols.style.display = 'block';
                viewFeeds(item.id);

                inpteditnomeFeed.value = nome_feed;
                inptediturlFeed.value = url_feed;
            }

           liSubMenu.appendChild(labelSubMenu);
           UlFeed.appendChild(liSubMenu);

        })
    });

    LiCat.appendChild(UlFeed);

}

//função que exibe as categorias na sidebar
const viewCategoriasSidebar = async () => {

    ulCategorias.innerHTML = '';

    await db.categorias.toArray()

    .then(result => {
        result.forEach(item => {


            const li = document.createElement('li');
            li.classList.add('sidebar-item');

            const labelMenu = document.createElement('label');
            labelMenu.htmlFor = `menu-${item.id}`;
            labelMenu.classList.add('sidebar-link');
            labelMenu.textContent = item.nome_categoria;

            const inpchk = document.createElement('input');
            inpchk.type = 'checkbox';
            inpchk.id = `menu-${item.id}`;
            inpchk.classList.add('menu-toggle');

            li.appendChild(labelMenu);
            li.appendChild(inpchk);

            getFeeds(item.id, li);

            ulCategorias.appendChild(li);

        })
    })

}

//função que exibe as categorias no modal de adicionar novo feed
const viewCategoriasHTML = async () => {

    catFeedSelect.innerHTML = '';
    const optSelect = document.createElement('option');
    optSelect.textContent = 'Selecione uma categoria:';
    optSelect.value = 0;

    catFeedSelect.appendChild(optSelect);

    await db.categorias.toArray()
    
    .then(result => {
        result.forEach(item => {
            
            const optCat = document.createElement('option');
            optCat.value = item.id;
            optCat.textContent = item.nome_categoria;

            catFeedSelect.appendChild(optCat);

        })
    });


}


//função que exibe as categorias no modal de adicionar novo feed
const viewCategoriasSettings = async () => {

    dvcatItems.innerHTML = '';

    await db.categorias.toArray()
    
    .then(result => {
        result.forEach(item => {
            
            const divCats = document.createElement('div');
            divCats.classList.add('catSetting');

            const spanNameCat = document.createElement('span');
            spanNameCat.classList.add('nameCategoria');
            spanNameCat.textContent = `${item.nome_categoria}`;

            const divBoxButtons = document.createElement('div');
            divBoxButtons.classList.add('divbtns');

            const btnEdit = document.createElement('button');
            btnEdit.id = 'btnEditCat';
            btnEdit.innerHTML = '<i class="las la-pencil-alt"></i>';

            const btnDel = document.createElement('button');
            btnDel.id = 'btnEditDel';
            btnDel.innerHTML = '<i class="lar la-trash-alt"></i>';

            btnDel.onclick = () => {
                CatClicked = item.id;
                closeModal(modalSettings);
                openModal(modalDeleteCat);
            }


            btnEdit.onclick = () => {
                CatClicked = item.id;
                nameCat = item.nome_categoria;
                closeModal(modalSettings);
                openModal(modalEditCat);
                inpteditnomeCategoria.value = nameCat;
            }


            divCats.appendChild(spanNameCat);
            divBoxButtons.appendChild(btnEdit);
            divBoxButtons.appendChild(btnDel);
            divCats.appendChild(divBoxButtons);
            dvcatItems.appendChild(divCats);

        })
    });


}




const totalLinksfromFeed = async (feedid) => {

    const total = await db.links.where('feedid').equals(feedid).count()

    return total;
}


const getNewSfromHome = async (array_feedids) => {

    divlstFeed.innerHTML = '';
    totalNews = [];
    itensExibidos = 0;

    const result = await db.links.where('feedid').anyOf(array_feedids).toArray()

    console.log(totalNews.length);

    const filtrar = result.filter(item => {
        const News = (item.title + " " + item.description).toLowerCase();
        return !blacklistArr.some(palavras => News.includes(palavras.toLowerCase()));
    });

    totalNews = filtrar;

    totalNews.sort((a, b) => {
        const dataA = new Date(a.pubdate);
        const dataB = new Date(b.pubdate);
        return dataB - dataA;
    });

    

    carregarMaisHome();

}



const getTotalNewsfromFeed = async (feedid) => {


    feedDiv.innerHTML = '';
    totalNews = [];
    itensExibidos = 0;

    const result = await db.links.where('feedid').equals(feedid).toArray()

    const filtrar = result.filter(item => {
        const News = (item.title + " " + item.description).toLowerCase();
        return !blacklistArr.some(palavras => News.includes(palavras.toLowerCase()));
    });

    if(result.length === 0) {
        
        const divMsgEmptyNews = document.createElement('div');
        divMsgEmptyNews.classList.add('msg_empty');

        const imgerro = document.createElement('img');
        imgerro.src = 'assets/images/no-feed.webp';

        const msgTitle = document.createElement('h2');
        msgTitle.classList.add('subtitle_min');
        msgTitle.textContent = 'Está um pouco vazio por aqui.'

        const spanMsg = document.createElement('p');
        spanMsg.textContent = 'Atualize o feed para obter as ultimas atualizações. ';

        divMsgEmptyNews.appendChild(imgerro);
        divMsgEmptyNews.appendChild(msgTitle);
        divMsgEmptyNews.appendChild(spanMsg);

        feedDiv.appendChild(divMsgEmptyNews);

    }

    totalNews = filtrar;

    totalNews.sort((a, b) => {
        const dataA = new Date(a.pubdate);
        const dataB = new Date(b.pubdate);
        return dataB - dataA;
    });

    

    carregarMais();

}

const carregarMais = () => {


    const proximaCarregamento = totalNews.slice(itensExibidos, itensExibidos + QuantidadeporVez);


    proximaCarregamento.forEach(item => {
        
        const article = document.createElement('article');
        article.classList.add('feed');

        const h2TituloNews = document.createElement('h2');

        const title = item.title;
        const description = item.description;
        
        const linkHref = document.createElement('a');
        //linkHref.textContent = `${(title.length > 80) ? title.substr(0, 80)+' ...' : title}`;
        linkHref.textContent = `${limitText(title, 80)}`;
        linkHref.href = item.link;
        linkHref.target = '_blank';

        const pDescricao = document.createElement('p');
        //pDescricao.textContent = (description.length > 400) ? description.substr(0, 200)+' ...' : description;
        pDescricao.textContent = `${limitText(description, 200)}`;
        pDescricao.classList.add('description');

        const bxArticleControls = document.createElement('div');
        bxArticleControls.classList.add('controls-article');
        
        const btnReadLater = document.createElement('button');
        btnReadLater.innerHTML = ' <i class="lar la-bookmark"></i> Ler depois ';

        btnReadLater.onclick = () =>{
            lerDepois(item);
        }

        bxArticleControls.appendChild(btnReadLater);


        const pPubicacaoData = document.createElement('p');
        pPubicacaoData.textContent = timeAgo(item.pubdate);
        pPubicacaoData.classList.add('publicationDate');

        h2TituloNews.appendChild(linkHref);
        article.appendChild(h2TituloNews);
        article.appendChild(pDescricao);

        
        bxArticleControls.appendChild(pPubicacaoData);
        article.appendChild(bxArticleControls);
        feedDiv.appendChild(article);

    });

    itensExibidos += proximaCarregamento.length;

    btnVerMais.style.display = itensExibidos < totalNews.length ? "block" : "none";

}

const carregarMaisHome = async () => {


    const proximaCarregamento = totalNews.slice(itensExibidos, itensExibidos + QuantidadeporVez);


    proximaCarregamento.forEach(item => {
        
        const article = document.createElement('article');
        article.classList.add('feed');

        const h2TituloNews = document.createElement('h2');

        const title = item.title;
        const description = item.description;
        
        const linkHref = document.createElement('a');
        linkHref.textContent = `${limitText(title, 80)}`;
        linkHref.href = item.link;
        linkHref.target = '_blank';

        const identFeed = document.createElement('p');
        identFeed.classList.add('feedname');

        const feeddata = getinfofeedData(item.feedid);

        feeddata.then(fditem => {
            identFeed.textContent = fditem[0].nome_feed;
        }).catch(() => {
            identFeed.textContent = 'sem-nome';
        })


        const pDescricao = document.createElement('p');
        pDescricao.textContent = `${limitText(description, 200)}`;
        pDescricao.classList.add('description');

        const bxArticleControls = document.createElement('div');
        bxArticleControls.classList.add('controls-article');
        
        const btnReadLater = document.createElement('button');
        btnReadLater.innerHTML = ' <i class="lar la-bookmark"></i> Ler depois ';

        btnReadLater.onclick = () =>{
            lerDepois(item);
        }

        bxArticleControls.appendChild(btnReadLater);


        const pPubicacaoData = document.createElement('p');
        pPubicacaoData.textContent = timeAgo(item.pubdate);
        pPubicacaoData.classList.add('publicationDate');

        h2TituloNews.appendChild(linkHref);
        article.appendChild(h2TituloNews);
        article.appendChild(identFeed);
        article.appendChild(pDescricao);
        
        bxArticleControls.appendChild(pPubicacaoData);
        article.appendChild(bxArticleControls);
        divlstFeed.appendChild(article);

    });

    itensExibidos += proximaCarregamento.length;

    btnVerMaisHome.style.display = itensExibidos < totalNews.length ? "block" : "none";

}


const carregarMaisFavoritos = () => {


    const proximaCarregamento = totalNews.slice(itensExibidos, itensExibidos + QuantidadeporVez);

    proximaCarregamento.forEach(item => {
        
        const article = document.createElement('article');
        article.classList.add('feed');

        const h2TituloNews = document.createElement('h2');

        const title = item.title;
        const description = item.description;
        
        const linkHref = document.createElement('a');
        linkHref.textContent = `${limitText(title, 80)}`;
        linkHref.href = item.link;
        linkHref.target = '_blank';

        const identFeed = document.createElement('p');
        identFeed.classList.add('feedname');

        const feeddata = getinfofeedData(item.feedid);

        feeddata.then(fditem => {
            identFeed.textContent = fditem[0].nome_feed;
        }).catch(() => {
            identFeed.textContent = 'sem-nome';
        })

        const pDescricao = document.createElement('p');
        pDescricao.textContent = `${limitText(description, 200)}`;
        pDescricao.classList.add('description');

        const bxArticleControls = document.createElement('div');
        bxArticleControls.classList.add('controls-article');
        
        
        const btnRemove = document.createElement('button');
        btnRemove.innerHTML = ' <i class="lar la-trash-alt"></i> Remover ';

        btnRemove.onclick = () => {
            removeFavorito(item.id);
        }

        bxArticleControls.appendChild(btnRemove);


        const pPubicacaoData = document.createElement('p');
        pPubicacaoData.textContent = timeAgo(item.pubdate);
        pPubicacaoData.classList.add('publicationDate');

        h2TituloNews.appendChild(linkHref);
        article.appendChild(h2TituloNews);
        article.appendChild(identFeed);
        article.appendChild(pDescricao);

        
        bxArticleControls.appendChild(pPubicacaoData);
        article.appendChild(bxArticleControls);
        feedDiv.appendChild(article);

    });

    itensExibidos += proximaCarregamento.length;

    btnVerMais.style.display = itensExibidos < totalNews.length ? "block" : "none";

}


async function getNews(url, feedid) {

    const url_feed = `https://corsproxy.io/?url=${encodeURIComponent(url)}?nocache=${new Date().getTime()}`;

    try {

        const response = await fetch(url_feed);

        if(!response.ok) {
            showMessage('Erro ao analisar o feed!', 2, '#toastMessages');
        }

        const data = await response.arrayBuffer();

        const tempDecoder = new TextDecoder('utf-8');
        const tempPage = tempDecoder.decode(new Uint8Array(data.slice(0, 500)));

        const regex_match = tempPage.match(/encoding=["'](.*?)['"]/i);

        const encoding = regex_match ? regex_match[1] : "utf-8";

        const xmldecode = new TextDecoder(encoding);
        const xmldoc = xmldecode.decode(data);

        const parser = new DOMParser();

        const xmlpage = parser.parseFromString(xmldoc, "text/xml");

        const errorNode = xmlpage.querySelector('parsererror');

        if(errorNode) {
            console.error('Erro ao analisar o Feed!');
        }

        const items = xmlpage.querySelectorAll('item').length > 0 ? Array.from(xmlpage.querySelectorAll('item')) : Array.from(xmlpage.querySelectorAll('entry'));

        const processar = items.map(item => {

            

            const title = item.querySelector('title')?.textContent || "Sem titulo";
            const urllink = item.querySelector('link')?.textContent || "Sem-link";

            const pubdate = item.querySelector('pubDate')?.textContent || "Sem titulo";

            let description = item.getElementsByTagNameNS("*", "encoded")[0]?.textContent || item.querySelector('content\\:encoded')?.textContent || item.querySelector('description')?.textContent || item.querySelector('summary')?.textContent || "";

            description = description.replace(/<\/?[^>]+(>|$)/g, "");

            const ObjInsert = { title: title, description: description, link: urllink, pubdate: pubdate, feedid: feedid };

            return addLink(ObjInsert);

        });

        await Promise.all(processar);
        console.log("Banco de dados sincronizados!");


    }catch(error) {
        showMessage('Erro ao analisar o feed!', 2, '#toastMessages');
    }

}


const printFeedsHome = async () => {

    const divlstFeed = document.querySelector('#lastFeeds');


    divlstFeed.innerHTML = '';

    const ids = (await db.feeds.toArray()).map(item => item.id);

    if(ids.length > 0) {
        getNewSfromHome(ids);
    }else{
        

        const divMsgEmptyNews = document.createElement('div');
        divMsgEmptyNews.classList.add('msg_empty');

        const imgerro = document.createElement('img');
        imgerro.src = 'assets/images/no-feed.webp';

        const msgTitle = document.createElement('h2');
        msgTitle.classList.add('subtitle_min');
        msgTitle.textContent = 'Está um pouco vazio por aqui.'

        const spanMsg = document.createElement('p');
        spanMsg.textContent = 'Adicione feeds e mantenha-se atualizado de suas fontes favoritos. ';

        divMsgEmptyNews.appendChild(imgerro);
        divMsgEmptyNews.appendChild(msgTitle);
        divMsgEmptyNews.appendChild(spanMsg);
        divlstFeed.appendChild(divMsgEmptyNews);

        btnUpdateAll.disabled = true;
        btnVerMaisHome.style.display = 'none';


    }


}


//função responsável por atualizar tudo e exibir atualizado na home
const UpdateAllNewsHome = async () => {

    const divlstFeed = document.querySelector('#lastFeeds');

    divlstFeed.innerHTML = '';

    try {

        const ids = (await db.feeds.toArray()).map(item => item.id);

        if(ids.length > 0) {

            await updateNews(ids);
            await getNewSfromHome(ids);

        }
        
        showMessage('Todos os feeds foram atualizados', 0, '#toastMessages') ;

    } catch (error) {
        showMessage('Erro ao atualizar.', 2, '#toastMessages');
    }


}



frmNewFeed.onsubmit = async (e) => {

    e.preventDefault();

    const formData = new FormData(frmNewFeed);

    const { nomeFeed,urlFeed,categoriesFeed  } = Object.fromEntries(formData);

    if (!nomeFeed || nomeFeed.trim().length === 0) {
        showMessage('Nome do feed não pode ficar vazio!', 2, '#messageBx');
    } else if (!urlFeed || urlFeed.trim().length === 0) {
        showMessage('URL do feed não pode ficar vazio!', 2, '#messageBx');
    } else if (!isValidURL(urlFeed)) {
        showMessage('URL Invalida.', 2, '#messageBx');
    } else if (!categoriesFeed || categoriesFeed === '0') {
        showMessage('Selecione uma categoria!', 2, '#messageBx');
    } else {

        let feedObj = {
            nomeFeed: nomeFeed,
            urlFeed: urlFeed,
            categoriesFeed: categoriesFeed
        };

        await addFeed(feedObj);
        closeModal(modalnewFeed);
        frmNewFeed.reset();
        viewCategoriasSidebar();
        viewCategoriasSettings();
        viewCategoriasHTML();

    }

}


frmEditCat.onsubmit = async (e) => {

    e.preventDefault();

    const formData = new FormData(frmEditCat);
    const { editnomeCategoria } = Object.fromEntries(formData);

    if (!editnomeCategoria || editnomeCategoria.trim().length === 0) {
        showMessage('Nome da categoria não pode ficar vazio!', 2, '#messageBx');
    } else {

        await updateCategoria(editnomeCategoria, CatClicked);
        frmEditCat.reset();
        closeModal(modalEditCat);
        viewCategoriasSidebar();
        viewCategoriasSettings();

    }

}

frmEditFeed.onsubmit = async (e) => {

    e.preventDefault();

    const formData = new FormData(frmEditFeed);
    const { editnomeFeed, editurlFeed } = Object.fromEntries(formData);

    if (!editnomeFeed || editnomeFeed.trim().length === 0) {
        showMessage('Nome do feed não pode ficar vazio!', 2, '#messageBx');
    } else if (!editurlFeed || editurlFeed.trim().length === 0) {
        showMessage('URL do feed não pode ficar vazio!', 2, '#messageBx');
    } else if (!isValidURL(editurlFeed)) {
        showMessage('URL Invalida.', 2, '#messageBx');
    } else {

        await updateFeedData(editnomeFeed, editurlFeed, feedIDClicked);
        //frmEditFeed.reset();
        closeModal(modalEditFeed);
        viewCategoriasSidebar();
        viewFeeds(feedIDClicked);

    }

}

frmNewCat.onsubmit = async (e) => {

    e.preventDefault();

    const formData = new FormData(frmNewCat);
    const { nomeCategoria } = Object.fromEntries(formData);

    if (!nomeCategoria || nomeCategoria.trim().length === 0) {
        showMessage('Nome da categoria não pode ficar vazio!', 2, '#messageBx');
    } else {

        await criarCategoria(nomeCategoria);
        frmNewCat.reset();
        closeModal(modalNewCat);
        viewCategoriasSidebar();
        viewCategoriasHTML();
        viewCategoriasSettings();

    }

}

const botoesEventos = () => {

    btnAddFeed.onclick = () => {
        openModal(modalnewFeed);
    }

    btnclosemodalnewFeed.onclick = () => {
        closeModal(modalnewFeed);
        frmNewFeed.reset();
    }

    btnupdateNews.onclick = async () => {
        updateNews(feedIDClicked);
    }

    btnVerMais.addEventListener('click', carregarMais);

    btnVerMaisHome.addEventListener('click', carregarMaisHome);

    btnSettings.onclick = () => {
        openModal(modalSettings);
    }

    btncloseModalSettings.onclick = () => {
        closeModal(modalSettings);
    }

    btnNewCat.onclick = () => {
        closeModal(modalSettings);
        openModal(modalNewCat);
    }

    btnCloseModalNCat.onclick = () => {
        closeModal(modalNewCat);
    }

    btnCloseModalEditCat.onclick = () => {
        closeModal(modalEditCat);
        viewCategoriasSidebar();
        viewCategoriasSettings();
    }

    btnrenameFeed.onclick = () => {
        openModal(modalEditFeed);
    }

    btnCloseModalEditFeed.onclick = () => {
        closeModal(modalEditFeed);
    }


    btndeleteFeed.onclick = () => {
        openModal(modalDeleteFeed);
    }

    bntcloseModalDeleteFeed.onclick = () => {
        closeModal(modalDeleteFeed);
    }

    btntCancelDeleteFeed.onclick = () => {
        closeModal(modalDeleteFeed);
    }

    btntConfirmDeleteFeed.onclick = () => {
        deleteFeed(feedIDClicked);
        viewCategoriasSidebar();
        closeModal(modalDeleteFeed);
        divdefaultDisplay.style.display = 'block';
        divfeedDisplay.style.display = 'none';
        feedIDClicked = null;
    }

    bntcloseModalDeleteCat.onclick = () => {
        closeModal(modalDeleteCat);
    }

    btntCancelDeleteCat.onclick = () => {
        closeModal(modalDeleteCat);
        openModal(modalSettings);
    }

    btntConfirmDeleteCat.onclick = () => {
        deleteCategoria(CatClicked);
        viewCategoriasSidebar();
        viewCategoriasHTML();
        viewCategoriasSettings();
        closeModal(modalDeleteCat);
        divdefaultDisplay.style.display = 'block';
        divfeedDisplay.style.display = 'none';
        feedIDClicked = null;
        CatClicked = null;
    }


    btnLaterNews.onclick = () => {
        divdefaultDisplay.style.display = 'none';
        divfeedDisplay.style.display = 'block';
        bxcontrols.style.display = 'none';
        tirarSelecao();
        btnLaterNews.classList.add('active');
        viewFavoritos();
    }

    inputsearchEngine.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            divdefaultDisplay.style.display = 'none';
            divfeedDisplay.style.display = 'block';
            bxcontrols.style.display = 'none';
            buscaLinks(inputsearchEngine.value);
        }
    })

    inptfilters.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            updateFilters(inptfilters.value);
            closeModal(modalSettings);
            getBlacklist();
        }
    });

    btnUpdateAll.onclick = async () => {

        btnUpdateAll.disabled = true;
        btnUpdateAll.innerHTML = `<span class="updating-icon">&#x27F3;</span> Atualizando ...`;
        await UpdateAllNewsHome();
        btnUpdateAll.disabled = false;
        btnUpdateAll.innerHTML = `&#x27F3; Atualizar tudo`;
    }

}


if(window.innerWidth <= 768) {
    document.querySelector('#sidebar').classList.add('collapsed');
}

const startApp = () => {

  botoesEventos();
  getBlacklist();
  viewCategoriasSettings();
  viewCategoriasHTML();  
  viewCategoriasSidebar();
  printMessageDayNight();
  printFeedsHome();

}

startApp();