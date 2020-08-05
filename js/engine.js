/* Engine.js
 * Este arquivo fornece a funcionalidade de loop do jogo (entidades de atualização e 
 * renderização), desenha o tabuleiro inicial do jogo na tela e, em seguida, chama os 
 * métodos update e render nos objetos player e enemy (definidos em seu app.js).
 *
 * A engine de jogo funciona desenhando a tela inteira do jogo várias vezes, como um 
 * flipbook que você pode ter criado quando criança. Quando seu jogador se move pela 
 * tela, pode parecer que apenas a imagem/personagem está se movendo ou sendo 
 * desenhada, mas não é esse o caso. O que realmente está acontecendo é que toda a 
 * "cena" está sendo desenhada repetidamente, apresentando a ilusão de animação.
 *
 * Essa engine torna o objeto de contexto (ctx) da tela disponível globalmente para 
 * tornar a escrita de app.js um pouco mais simples de se trabalhar.
 */

var Engine = (function(global) {
    /* Predefine as variáveis que usaremos nesse escopo, cria o elemento canvas, pega o 
     * contexto 2D para essa tela, define a altura/largura do elemento da tela e 
     * adiciona-o ao DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 707;
    canvas.height = 640;
    doc.body.appendChild(canvas);

    /* Essa função serve como ponto de partida para o próprio loop do jogo e manipula 
     * corretamente os métodos de atualização e renderização.
     */
    function main() {
        /* Recebe as nossas informações de tempo delta que são necessárias se o seu jogo 
         * requer uma animação suave. Como o computador de todo mundo processa instruções 
         * em velocidades diferentes, precisamos de um valor constante que seja o mesmo para 
         * todos (independentemente da rapidez com que o computador esteja).
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Chame nossas funções de atualização/renderização, passe o delta de tempo para a 
         * nossa função de atualização, pois ela pode ser usada para animações suaves.
         */
        update(dt);
        render();

        /* Defina nossa variável lastTime que é usada para determinar o delta de tempo 
         * para a próxima vez que esta função for chamada.
         */
        lastTime = now;

        /* Use a função requestAnimationFrame do navegador para chamar essa função novamente 
         * assim que o navegador conseguir desenhar outro quadro.
         */
        win.requestAnimationFrame(main);
    }

    /* Esta função faz algumas configurações iniciais que devem ocorrer apenas uma vez, 
     * particularmente configurando a variável lastTime que é requerida para o loop do 
     * jogo.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* Essa função é chamada por main (nosso loop de jogo) e por si só chama todas as 
     * funções que podem ser necessárias para atualizar os dados da entidade. Com base 
     * em como você implementa sua detecção de colisão (quando duas entidades ocupam o 
     * mesmo espaço, por exemplo, quando seu personagem deve morrer), você pode encontrar 
     * a necessidade de adicionar uma chamada de função aqui. Por enquanto, deixamos 
     * isso comentado - você pode ou não querer implementar essa funcionalidade dessa 
     * forma (você pode simplesmente implementar a detecção de colisão nas próprias 
     * entidades dentro do seu arquivo app.js).
     */
    function update(dt) {
        updateEntities(dt);
        // checkCollisions();
    }

    /* Ela é chamada pela função update e percorre todos os objetos dentro de sua matriz 
     * allEnemies conforme definido em app.js e chama seus métodos update(). Em seguida, 
     * ela chamará a função de atualização para o objeto do player. Esses métodos de 
     * atualização devem se concentrar puramente na atualização dos dados/propriedades 
     * relacionados ao objeto. Faça o seu desenho nos seus métodos de renderização.
     */
    function updateEntities(dt) {
        todosInimigos.forEach(function(inseto) {
            inseto.update(dt);
        });
        jogador.update();
        gema.update();
        estrela.update();
    }

    /* Esta função inicialmente desenha o "nível de jogo", então chamará a função 
     * renderEntities. Lembre-se, essa função é chamada a cada tick do jogo 
     * (ou loop do mecanismo de jogo) porque é assim que os jogos funcionam - eles são 
     * flipbooks criando a ilusão de animação, mas na realidade eles estão apenas 
     * desenhando a tela inteira repetidamente.
     */
    function render() {
        /* Esse array contém a URL relativa à imagem usada para essa linha específica do 
         * nível do jogo.
         */
        var rowImages = [
                'images/bloco-agua.png',    // Linha superior é a agua
                'images/bloco-pedra.png',   // Linha 1 de 3 de pedra 
                'images/bloco-pedra.png',   // Linha 2 de 3 de pedra
                'images/bloco-pedra.png',   // Linha 3 de 3 de pedra
                'images/bloco-grama.png',   // Linha 1 de 2 de grama
                'images/bloco-grama.png'    // Linha 2 de 2 de grama
            ],
            numRows = 6,
            numCols = 7,
            row, col;

            // Antes de desenhar, limpe a tela existente
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.font = '20px serif';
            ctx.fillStyle = "khaki";
            ctx.strokeStyle = "khaki";
            ctx.fillText('Pontuação:', 20, 30);
            ctx.strokeText(pontuacao, 140, 30);
            ctx.fillText('Chances:', 530, 30);
            ctx.strokeText(chance+'/10', 640, 30);
            ctx.fillText('Colecionáveis:', 20, 620);
            ctx.strokeText(colecionavel, 160, 620);

        /* Faz um loop pelo número de linhas e colunas que definimos acima e, usando o array 
         * rowImages, desenha a imagem correta para essa parte da "grade"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* A função drawImage do elemento de contexto da tela requer 3 parâmetros: 
                 * a imagem a ser desenhada, a coordenada x para iniciar o desenho e a coordenada y 
                 * para iniciar o desenho. Estamos usando nossos resource helpers para se referir a 
                 * nossas imagens, para que possamos obter os benefícios do armazenamento em cache 
                 * dessas imagens, já que as estamos usando várias vezes.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    /* Esta função é chamada pela função render e é chamada em cada tick do jogo. 
     * Sua finalidade é, então, chamar as funções de renderização que você definiu em 
     * suas entidades Enemy e Player dentro de app.js
     */
    function renderEntities() {
        /* Faça um loop em todos os objetos dentro do array allEnemies e chame a função de 
         * renderização que você definiu.
         */
        todosInimigos.forEach(function(inseto) {
            inseto.render();
        });
        jogador.render();
        gema.render();
        estrela.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     * Esta função não faz nada, mas poderia ter sido um bom lugar para lidar com os 
     * estados de redefinição do jogo - talvez um novo menu de jogo. 
     * É chamado apenas uma vez pelo método init().
     */
    function reset() {
        // noop
    }

    /* Carrega todas as imagens que precisaremos para desenhar nosso nível de jogo. 
     * Em seguida, defina o init como o método de retorno de chamada, para que, 
     * quando todas essas imagens forem carregadas corretamente, o jogo seja iniciado.
     */
    Resources.load([
        'images/bloco-pedra.png',
        'images/bloco-agua.png',
        'images/bloco-grama.png',
        'images/inseto.png',
        'images/gema-laranja.png',
        'images/estrela.png',
        'images/personagem-garota-princesa.png'
    ]);
    Resources.onReady(init);

    /* Atribue o objeto de contexto da tela à variável global (o objeto da janela quando 
     * executado em um navegador) para que os desenvolvedores possam usá-lo mais 
     * facilmente a partir de seus arquivos app.js.
     */
    global.ctx = ctx;
})(this);
