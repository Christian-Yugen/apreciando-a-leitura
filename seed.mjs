import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { reviews, books } from "./drizzle/schema.ts";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const pool = mysql.createPool(DATABASE_URL);
const db = drizzle(pool);

const reviewsData = [
  {
    title: "Diga-me baixinho",
    author: "Colleen Hoover",
    genre: "Romance",
    reviewDate: new Date("2026-07-03"),
    coverImageUrl: "https://m.media-amazon.com/images/I/811s9TdwjwL._SY466_.jpg",
    purchaseLink: "https://amzn.to/4nBKGumI",
    excerpt: "Comecei a ler esse livro depois que vi tantos comentários sobre o filme. A história começa com os irmãos Taylor e Thiago voltando a morar na casa que viveram na infância, que é vizinha à casa da Kamila.",
    content: `Comecei a ler esse livro depois que vi tantos comentários sobre o filme. Ainda não assisti ao filme. Eu normalmente opto por ler primeiro o livro.

A história começa com os irmãos Taylor e Thiago voltando a morar na casa que viveram na infância, que é vizinha à casa da Kamila. Eles eram amigos de infância até que alguma coisa aconteceu, e isso acabou os afastando. Durante todo o decorrer do livro esse fato é mencionado, porém não é esclarecido. A autora só deixa para revelar tudo no final.

Kamila se culpa pelo que aconteceu. O tempo inteiro ela busca pelo perdão dos irmãos. Taylor a perdoou mais rápido e tenta retomar a amizade entre eles. Thiago guarda muita raiva. Ele culpa Kami em toda e qualquer oportunidade. Ele também tenta impedir que o irmão se reaproxime dela. Mas o fato é que rola a maior atração entre os irmãos e a Kami. Trata-se de um triângulo amoroso que vai ser melhor explorado no segundo livro.

Kami tem muitos problemas com a mãe, que é uma mulher fútil e egoísta. Os pais também estavam envolvidos na tragadia que envolve os vizinhos. É um drama familiar enorme.

Outro problema na vida de Kami são as amizades. Ela é uma garota popular na escola, é líder de torcida e muito invejada pelas outras garotas. Mas isso passa a mudar depois que um problema familiar surge.

Depois que tudo é revelado no final, dá para entender um pouco a raiva do Thiago. Mas dá para perceber também que o passado está longe de ficar no passado e muitos conflitos ainda vão acontecer.

O segundo livro, Diga-me em segredo, já foi lançado. E o terceiro volume está previsto para ser lançado em agosto.

Você pode comprar Diga-me baixinho através [deste link](https://amzn.to/4nBKGumI).`,
  },
  {
    title: "Pássaro e serpente",
    author: "Shelby Mahurin",
    genre: "Fantasia",
    reviewDate: new Date("2026-07-01"),
    coverImageUrl: "https://m.media-amazon.com/images/I/51FhiXCWmvS._SY445_SX342_QL70_ML2_.jpg",
    purchaseLink: "https://amzn.to/3NbyahCVL",
    excerpt: "Comprei esse livro já faz um tempo. É o primeiro livro de uma trilogia. Pássaro e Serpente é um livro de fantasia que relata a história de Lou, uma bruxa que fugiu de seu clã e que precisa esconder sua magia se quiser continuar viva.",
    content: `Comprei esse livro já faz um tempo. Estava guardadinho na minha estante e apenas recentemente que senti vontade de ler. É o primeiro livro de uma trilogia.

Pássaro e Serpente é um livro de fantasia. Relata a história de Lou (Louise Le Blanc), uma bruxa que fugiu de seu clã e que precisa esconder sua magia se quiser continuar viva. Lou foge de dois perigos: a própria mãe dela e os Chasseurs, que eram homens da igreja e caçadores de bruxas.

Lou conta com a ajuda de Coco, uma amiga muito e companheira dela nas loucuras que apronta. Lou rouba para sobreviver, mora escondida em um teatro e tem casos amorosos suspeitos. O livro relata com bastante humor as aventuras de nossa protagonista.

Reid Diggory é um verdadeiro caçador de bruxas. É capitão dos Chasseurs e não tolera sentir o cheiro da magia. O caminho dele acaba se encontrando com o da Lou e, depois de um mal-entendido, os dois acabam se casando. Lou aceita a situação para não ir presa e ficar protegida de seus inimigos e Reid casa com ela para não manchar sua reputação. Reid não sabe que Lou é uma bruxa. E, com o passar do tempo, fica cada vez mais difícil para Lou esconder isso dele.

Bom, já sabemos o que acontece, né? É claro que os dois acabam se apaixonando, mas o "segredo" da Lou vai comprometer e muito essa relação.

O romance entre o casal é interessante, os personagens secundários contribuem muito com a história. Mais segredos são revelados no decorrer da história e o livro termina nos deixando com vontade de saber mais. O segundo livro é Sangue & Mel. Começarei a ler em breve.

Pássaro & Serpente está à venda na Amazon através [deste link](https://amzn.to/3NbyahCVL).`,
  },
  {
    title: "Boulevard",
    author: "Meredith Tate",
    genre: "Romance",
    reviewDate: new Date("2026-05-15"),
    coverImageUrl: "https://m.media-amazon.com/images/I/81Xd7C0ZL5L._SY466_.jpg",
    purchaseLink: "https://amzn.to/4eOWSnU",
    excerpt: "Devorei as páginas em poucos dias mesmo sabendo que o final iria ser devastador... Mas vale a pena. Boulevard fala sobre Hasley Weigel e Luke Howland, dois jovens alunos do ensino médio.",
    content: `O que falar sobre esse livro? Devorei as páginas em poucos dias mesmo sabendo que o final iria ser devastador... Mas vale a pena.

Boulevard foi lançado no Brasil em 2023 e eu só fui tomar conhecimento sobre esse livro agora. Na verdade, o que vi primeiro foi o trailer do filme, que, infelizmente, ainda não veio para o Brasil.

O livro fala sobre Hasley Weigel e Luke Howland, dois jovens alunos do ensino médio.

Hasley é filha única e o pai dela a abandonou quando ela tinha 2 anos de idade. Hasley então passou a viver apenas com a mãe, que é terapeuta.

Hasley não é exatamente uma garota popular na escola, mas, por ser a melhor amiga de Zev, o capitão do time de rúgbi, ela se destaca.

Certo dia, ao chegar atrasada na escola, o professor não permite que Hasley entre na sala, então ela decide passar um tempo nas arquibancadas do ginásio. É quando vê um rapaz ali e fica curiosa, observando-o enquanto ele tira algo do bolso. E é assim que ela acaba conhecendo Luke Howland, um garoto problemático que os outros alunos evitam por saber que ele é usuário de drogas.

O garoto desperta a atenção de Hasley. De início, não de um modo romântico, pois ela nutre uma paixonite pelo capitão do time de basquete, Matthew. Então, Luke passa a ser apenas um amigo com quem ela gosta de passar tempo. Mas, aos poucos, ao perceber como ele é encantador (embora em nem todos os momentos), Hasley começa a nutrir outros tipos de sentimentos por Luke.

Luke sofre e se culpa pela morte do irmão. Ele sofre de depressão e a autora soube trabalhar muito bem isso no personagem, pois ele apresenta todas as características de alguém que passa por esse problema.

Mesmo quando Hasley começa a namorar Matthew, o garoto dos seus sonhos, a amizade com Luke permanece forte, inclusive, ela passa a trair Matthew com o Luke. Em determinado momento, Luke diz:

"Porque eu nunca tinha me importado tanto com alguém, como me importo com você, e sei que você está com o Matthew. Eu fico feliz quando você está com ele, embora eu me desmorone por dentro por que, Hasley, tenho amor suficiente para nós dois. Mesmo que você entregue seu coração para outra pessoa, vou te dar o meu e, com o sangue dele, vou pintar o meu sorriso só para você. Agora eu sei que a droga mais poderosa de um ser humano é outro ser humano."

Essa parte resume bem quem é o Luke, um garoto que sofre e, mesmo em meio a esse sofrimento, descobre o amor.

A história é linda! Quero muito assistir ao filme, espero que em breve ele chegue aqui no Brasil.

Boulevard é uma trilogia. O segundo livro fala sobre Hasley seguindo em frente e o terceiro fala sobre Luke antes de conhecer a Hasley. Mas apenas o primeiro livro foi publicado no Brasil.

Boulevard está disponível na Amazon através [deste link](https://amzn.to/4eOWSnU).`,
  },
  {
    title: "Garra",
    author: "Jordan Gray",
    genre: "Fantasia",
    reviewDate: new Date("2026-04-21"),
    coverImageUrl: "https://m.media-amazon.com/images/I/81b3OnlMzYL._SY466_.jpg",
    purchaseLink: "https://amzn.to/4cE64J2",
    excerpt: "Encontrei esse livro nos lançamentos de abril e, de início, não tive muito interesse em ler por ser um livro cujo os personagens são lobisomens. Mesmo assim, resolvi conhecer a história.",
    content: `Olá, apreciadores da leitura!

Hoje vamos falar sobre o livro Garra, da autora Jordan Gray. Encontrei esse livro nos lançamentos de abril e, de início, não tive muito interesse em ler por ser um livro cujo os personagens são lobisomens. Amo histórias com vampiros, mas de lobisomens não sou muito fã. Mesmo assim, resolvi conhecer a história.

Vanessa é uma jovem prestes a completar 17 anos. A amiga dela, Celeste, insiste para que as duas possam sair para comemorar. Vanessa tem uma personalidade mais tranquila, não é de festas, preferia ir ao cinema, mas Celeste é do tipo que acredita que só tem 17 anos uma vez e por isso é preciso aproveitar.

Elas vão a uma festa na praia, lá Celeste pega uma briga com uma garota que parece ser muito má e que está junto com uma turma de garotos e garotas de aparência "linda" e "rica". Depois da humilhação, Vanessa consegue fazer com que Celeste desista da festa e elas vão embora. Mas, no caminho de retorno para casa dois lobisomens aparecem. Um mata Celeste e outro morde a Vanessa.

O pai da Vanessa é policial e ele aparece nessa ocorrência. Junto com o lobisomem, que já se transformou em humano, eles decidem que o melhor para Vanessa é ir com eles, já que ela foi mordida e vai acabar se transformando também.

Contra sua vontade, Vanessa é levada. Fica trancada em uma sala, passa pela transformação, é levada até a rainha, que decide acolhê-la no bando.

O tempo inteiro Vanessa só pensa em se vingar da morte da amiga. De início, ela age por puro instinto, tentando atacar Evie, a garota que brigou com Celeste na praia e que faz parte da corte. Depois, Vanessa decide investigar melhor a morte da amiga até ter certeza de quem é o verdadeiro culpado.

O filho da rainha, príncipe Sinclair, logo se vê atraído por Vanessa. Ele sempre procura ficar ao lado dela em particular, por que em público, ele precisa se manter distante, pois logo se tornará noivo de Evie. Sinclair não ama Evie, mas se vê obrigado a noivar com ela por causa de um acordo entre as cortes.

Mas quando o romance dele com Vanessa se torna evidente demais, isso passa a ser um problema para ambos.

Calix é primo e protetor de Sinclair, ele também se sente atraído por Vanessa, mas isso é algo que ele esconde. A interação entre os dois é marcada por trocas de farpas e discussões, mas é evidente que eles não se odeiam.

No final, Vanessa percebe que foi enganada pela pessoa em quem mais ela confiava. E que o amor de Sinclair na verdade é algo doentio e possessivo.

Por um momento da leitura, achei que eu não fosse ter interesse em ler a continuação, mas depois que terminei de ler, fiquei com vontade de saber mais sobre a história.

Apesar de amar príncipes superfofos, como foi Sinclair desde o início da história, a minha torcida era por Calix. Não houve triângulo amoroso nesse primeiro livro. Mas no segundo tudo indica que o relacionamento de Vanessa com Calix vai se aprofundar mais.

O livro é escrito de maneira confusa às vezes. Há muitos cortes na história. Em algumas cenas os personagens aparecem ou somem do nada. Mas, no geral, a leitura é boa.

Garra está à venda no site da Amazon através [deste link](https://amzn.to/4cE64J2).`,
  },
  {
    title: "Escudo de pardais",
    author: "Devney Perry",
    genre: "Fantasia",
    reviewDate: new Date("2026-04-18"),
    coverImageUrl: "https://m.media-amazon.com/images/I/91od3BvJmAL._SY466_.jpg",
    purchaseLink: "https://amzn.to/4tlqpK0",
    excerpt: "Fazia tempo que não me sentia tão envolvida com um livro. Escudo de Pardais traz uma história que me deixou completamente apaixonada. Li o livro em dois dias.",
    content: `Fazia tempo que não me sentia tão envolvida com um livro. Escudo de Pardais traz uma história que me deixou completamente apaixonada. Li o livro em dois dias.

Odessa é uma princesa que vive com o pai, a madrasta, a irmã mais nova, Mae, e um irmão pequeno. Ambos filhos do segundo casamento de seu pai com Margot, a madrasta.

Odessa é a filha esquecida, a filha que ficou em segundo plano depois que o pai reconstruiu a família. Ela parece ter se conformado com a situação, até que tudo muda.

Mae foi prometida em casamento a um príncipe de outro reino, o reino mais secreto de Calandra, Turah.

A irmã de Odessa passou a vida inteira sendo preparada para esse casamento. Ela aprendeu a lutar, a ser forte e se tornar uma verdadeira espiã a serviço de seu pai, o rei de Quentis.

No entanto, quando o príncipe de Turah chegou para cumprir com o acordo, ele escolheu Odessa como sua noiva.

Isso foi um choque para todos, principalmente para Odessa. Ela nunca foi treinada para ser rainha, ela nunca foi treinada para ser espiã, ela não sabe lutar... e de repente o pai dela quer que ela faça tudo isso. Pois além de deixá-la incumbida de descobrir o maior segredo dos turanos, que é a localização de Allesaria, a capital deles, o rei quer que a filha mate o Guardião, o melhor guerreiro turano e braço-direito do príncipe Zavier.

Mesmo sabendo que vai fracassar, Odessa tenta fazer o que o pai pediu, pois ela sente um desejo enorme de agradar a ele, de mostrar que é útil, que pode ser digna da confiança dele como Mae é.

Depois do casamento, Zavier não parece nem um pouco interessado em consumá-lo. Ele trata Odessa bem, mas vive evitando-a. Já o Guardião, está sempre por perto, provocando Odessa e deixando claro que sabe das verdadeiras intenções dela.

Ao entrar no reino de Turah, Odessa percebe que os turanos são um povo muito desconfiado. Eles guardam muitos segredos e a capital é algo tão secreto que Odessa começa a desconfiar que ela nem existe, pois não é a intenção do príncipe levá-la para lá.

O livro possui personagens interessantes, a construção do mundo com seus lugares exóticos e feras horripilantes é bem interessante.

Há muitas reviravoltas e surpresas na história. A que eu mais gostei e que já suspeitava está relacionada ao príncipe e ao guardião.

Recomendo demais esse livro e estou aguardando ansiosamente a continuação.

Fiquei com vontade de ler outros livros da Devney Perry.

Escudo de pardais está à venda na Amazon através [deste link](https://amzn.to/4tlqpK0).`,
  },
  {
    title: "Esnobes e sem-noção",
    author: "Angourie Rice e Kate Rice",
    genre: "Romance",
    reviewDate: new Date("2026-04-03"),
    coverImageUrl: "https://m.media-amazon.com/images/I/81z8t7w3mJL._SY466_.jpg",
    purchaseLink: "https://amzn.to/3Nesnobes",
    excerpt: "O livro Esnobes e sem-noção foi uma grata surpresa. Não estava na minha lista de leitura, nem tinha ouvido falar nada a respeito dele. Mas, ao ver a capa e constatar que a história se tratava de algo relacionado a uma estrela de cinema e uma garota comum, logo meu interesse foi despertado.",
    content: `O livro Esnobes e sem-noção, das autoras Angourie Rice e Kate Rice foi uma grata surpresa. Não estava na minha lista de leitura, nem tinha ouvido falar nada a respeito dele. Mas, ao ver a capa e constatar que a história se tratava de algo relacionado a uma estrela de cinema e uma garota comum, logo meu interesse foi despertado. Amo temas assim. Quando comecei a ler, mais uma vez fui surpreendida ao perceber que se trata de uma releitura do livro Orgulho e Preconceito (sério, eu não tinha observado que essa informação estava na capa). Muita coisa semelhante, exceto o cenário e o contexto histórico, que é o que vivemos na atualidade.

Lily é uma jovem que acabou de terminar o ensino médio e vive em Pippi Beach, um povoado litorâneo que fica na Austrália.

Lily é uma jovem simples e discreta, ao contrário de sua mãe, Lydia, que vive bisbilhotando a vida dos outros, principalmente dos turistas que visitam Pippi Beach. Lily morre de vergonha do comportamento espalhafatoso e intrometido da mãe.

Certo dia, uma atriz de Hollywood, Carrie Radcliffe, se muda para Pippi Beach com a filha, Eve. E a mãe de Lily logo vê a oportunidade de aproximar a filha da jovem atriz, esperando que isso traga benefícios para a família.

Eve é exatamente o que se espera de uma garota criada em Hollywood: esnobe, mimada e fútil. Ela e Lily começam o pé esquerdo, mas aos poucos vão se aproximando.

O interesse romântico de Lily é ninguém menos que o irmão de Carrie Radcliffe, o ator Cade Radcliffe. E é aí que a história fica ainda mais interessante, pois Cade parece ser o típico garoto rico e arrogante, mas esconde camadas mais profundas.

A narrativa é divertida, cheia de diálogos sagazes e situações constrangedoras que lembram muito o estilo de Jane Austen. A química entre os personagens é bem construída e o desenvolvimento do relacionamento é natural e envolvente.

As autoras conseguiram trazer a essência de Orgulho e Preconceito para os dias atuais de forma brilhante. Os preconceitos de ambas as partes são bem explorados e a evolução dos personagens é satisfatória.

Recomendo para quem gosta de romances leves, bem-humorados e com uma pegada de clássico reimaginado.`,
  },
  {
    title: "Patinando no amor",
    author: "Jennifer Iacopelli",
    genre: "Romance",
    reviewDate: new Date("2026-03-09"),
    coverImageUrl: "https://m.media-amazon.com/images/I/7110IIw4WbL._SL1500_.jpg",
    purchaseLink: "https://amzn.to/4bfXGys",
    excerpt: "Decidi ler esse livro por causa da série na Netflix. Vi tantas críticas sobre a escolha da jovem sobre o rapaz com quem ela fica no final que decidi ler o livro primeiro para compreender melhor a história. E acertei na escolha!",
    content: `Decidi ler esse livro por causa da série na Netflix. Vi tantas críticas sobre a escolha da jovem sobre o rapaz com quem ela fica no final que decidi ler o livro primeiro para compreender melhor a história. E acertei na escolha!

O livro fala sobre Adriana Russo, uma patinadora artística que vê a família a cada dia se afundar mais em dívidas. Adriana é uma jovem responsável, pés no chão, ao passo que o pai e a irmã mais velha não se importam muito em gastar dinheiro para manter as aparências, já que o rinque Russo é famoso e eles precisam manter as dificuldades financeiras em segredo.

Adriana faz par na dança do gelo com Brayden, um rapaz com fama de namorador. Eles são bons amigos e como parceiros de patinação têm uma química perfeita.

Mesmo que Adriana seja muito talentosa, o foco e praticamente todo apoio do pai está em Elise, a filha mais velha, uma patinadora solo que está se preparando para as Olimpíadas.

Quando Elise leva um tombo e não se classifica, o pai decide apostar as fichas em Adriana. E ela não decepciona.

A mídia passa a acreditar que ela e Brayden formam um casal e eles decidem manter a farsa para conseguir patrocinadores. Tudo parece estar dando certo até que Freddie, antigo parceiro de patinação e primeiro amor de Adriana, passa a ficar mais presente na vida dela já que ele e sua atual parceira fazem parte da equipe júnior que voltou a treinar no rinque Russo.

Ver Freddie constantemente faz Adriana relembrar o passado e perceber que ainda não o esqueceu.

Por outro lado, Brayden deixou de ser um "galinha" e cada vez mais demonstra estar verdadeiramente apaixonado por Adriana.

Patinando no amor, da autora Jennifer Iacopelli, é uma história para o público juvenil bem gostosinha de ler.

Os personagens secundários também são interessantes. Na série a história é um pouco diferente e alguns personagens são melhores, tipo o pai da Adriana. Na série ele é um amor. Um pai responsável e preocupado com as três filhas.

No livro, o final é fechadinho. Adriana fez a escolha dela e ponto final. Mostra até o que acontece alguns anos à frente. Já na série, teremos a segunda temporada. Aguardar para ver o que acontece.

Patinando no amor está disponível na Amazon através [deste link](https://amzn.to/4bfXGys).`,
  },
];

const booksData = [
  {
    title: "Quando as Luzes se Apagam",
    synopsis: "Quando as Luzes se Apagam - Tempestade é o tão esperado desfecho da trilogia que conquistou milhares de leitores desde 2020. Alycia está grávida e precisa enfrentar seus maiores medos para assumir a responsabilidade de ser mãe. Ela não sabe se poderá contar com o apoio de Dan nessa jornada, mas está disposta a superar todos os desafios que a vida lhe trouxe pelo bem-estar de sua filha. Dan também precisa tomar uma atitude. Chegou a hora de provar se o amor é mesmo capaz de superar traumas e um passado perturbador. Depois de tantas mágoas e desilusões, é possível ser feliz?",
    coverImageUrl: "https://m.media-amazon.com/images/I/51zq5pVqURL._SY466_.jpg",
    purchaseLink: "https://amzn.to/3BKGumI",
    series: "Trilogia Quando as Luzes se Apagam - Livro 3",
  },
  {
    title: "Társis",
    synopsis: "Depois da Grande Batalha, os vampiros foram aniquilados da face da Terra. Para os humanos, esses seres existiam apenas em sua imaginação. Até que um dia, em uma cabana abandonada no meio de uma floresta, um ser sanguinário ressurgiu: um novo vampiro. Na Cidade Angelical, os arcanjos se reuniram e decidiram que um deles precisava voltar à Terra e aniquilar de vez o ser que deu origem ao novo vampiro. Contudo, essa não seria uma tarefa fácil. Mais uma vez, anjos e vampiros estavam de lados opostos. Társis, um vampiro recém-criado, e Levi, filho de Lamon e Stella, se enfrentam em mais uma batalha na Terra. Társis é o primeiro livro da série Os Renascidos, Spin-off do livro Cidade dos Vampiros.",
    coverImageUrl: "https://m.media-amazon.com/images/I/51aIqFqL+EL._SY466_.jpg",
    purchaseLink: "https://amzn.to/3NrtdSQ",
    series: "Série Os Renascidos - Livro 1",
  },
  {
    title: "A luz que é você",
    synopsis: "A vida é sempre uma caixinha de surpresas. Mesmo quando procuramos organizá-la, surge o inesperado. Mesmo quando buscamos manter tudo sob controle, alguns fatos simplesmente mudam tudo. Foi o que aconteceu na vida de Lana quando conheceu o jovem sírio, Khaled Youssef. Não estava nos planos dela se apaixonar. Nem nos planos dele. Mas os caminhos desses dois jovens se cruzaram e, através de uma simples amizade, surge o amor.",
    coverImageUrl: "https://m.media-amazon.com/images/I/51o5B8nJURL._SY466_.jpg",
    purchaseLink: "https://amzn.to/4dM7FLj",
    series: "Romance Independente",
  },
  {
    title: "A luz que me salva",
    synopsis: "Só quem vive na escuridão, reconhece a importância da luz. Quando Melanie aparece na vida de Rafael, é assim que ele se sente, como se toda a escuridão que vive em torno dele fosse, aos poucos, se dissipando. Melanie é cheia de luz, cheia de vida, cheia de planos... Quando ela conhece Rafael, sabe que sua vida não será mais a mesma. A luz que me salva é um romance que fala sobre superação. Sobre afastar momentos sombrios e permitir que o amor predomine nas decisões e afaste todos os temores causados pela nossa mente.",
    coverImageUrl: "https://m.media-amazon.com/images/I/51vJrN5pURL._SY466_.jpg",
    purchaseLink: "https://amzn.to/4gYhvN3",
    series: "Romance Independente",
  },
];

async function seed() {
  console.log("Seeding database...");

  // Insert reviews
  for (const review of reviewsData) {
    await db.insert(reviews).values(review);
    console.log(`  ✓ Review: ${review.title}`);
  }

  // Insert books
  for (const book of booksData) {
    await db.insert(books).values(book);
    console.log(`  ✓ Book: ${book.title}`);
  }

  console.log("Seed complete!");
  await pool.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
