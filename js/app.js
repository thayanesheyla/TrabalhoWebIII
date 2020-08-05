var chance = 10;
var pontuacao = 0;
var colecionavel = 0;
var bonus = 0;
///////////////////////////////////////CLASSE INSETO////////////////////////////////////////
var Inseto = function(x, y, speed){
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/inseto.png';
};

Inseto.prototype.update = function(dt){
    this.x = this.x + this.speed * dt;
    if (this.x > 710) {
        this.x = -50;
        this.speed = 100 + Math.floor(Math.random() * 222);
    };
    verificadorColisoesInseto(this);
};

Inseto.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/****************************INSTÂNCIAS DE INSETO****************************/
var inseto_Um = new Inseto(0, 63, 150);
var inseto_Dois = new Inseto(0, 147, 190);
var inseto_Tres = new Inseto(0, 230, 210);
var inseto_Quatro = new Inseto(0, 147,200);

var todosInimigos = [];
todosInimigos.push(inseto_Um, inseto_Dois, inseto_Tres, inseto_Quatro);

///////////////////////////////////////CLASSE JOGADOR////////////////////////////////////////
var Jogador = function(x, y){
    this.x = x;
    this.y = y;
    this.sprite = 'images/personagem-garota-princesa.png';
};

Jogador.prototype.update = function(){
    if(this.y < 0){
        pontuacao++;
        obterColecionavel(jogador);
    };

    if(bonus == 5){
        obterEstrela(jogador);
        tirarItem_da_Tela(gema);
        bonus = 0;
    }
};

Jogador.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Jogador.prototype.handleInput = function(keyPress){
    if (keyPress == 'left' && this.x > 0){
        this.x -= 101;
    } else {
        if (keyPress == 'right' && this.x < 567){
            this.x += 101;
        }else{
            if (keyPress == 'up' && this.y > 0) {
                this.y -= 83;
            }else{
                if (keyPress == 'down' && this.y < 405){
                    this.y += 83;
                }
            }
        }
    }
};

/****************************INSTÂNCIA DE JOGADOR****************************/
var jogador = new Jogador(303, 405);

///////////////////////////////////////CLASSE ITEM////////////////////////////////////////
var Item = function(x, y, sprite){
    this.x = x;
    this.y = y;
    this.sprite = sprite;
};

Item.prototype.update = function(){
    verificadorColisoesColecionavel(gema);
    verificadorColisoesEstrela(estrela);
};

Item.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/****************************INSTÂNCIAS DE ITEM****************************/
var gema = new Item(-200, -200, 'images/gema-laranja.png');
var estrela = new Item(-300, -300, 'images/estrela.png');

///////////////////////////////////////MÉTODOS AUXILIARES////////////////////////////////////////
var gerarLinha = function(){
    var aleatorio = Math.random();
    if(aleatorio <= 0.33){
        this.y = 63;
    }else{
        if(aleatorio > 0.33 && aleatorio <= 0.66){
            this.y = 147;
        }else{
            this.y = 230;
        }
    }
    return this.y;
};

var gerarColuna = function(){
    var aleatorio = Math.random();
    if(aleatorio <= 0.14){
        this.x = 0;
    }else{
        if(aleatorio > 0.14 && aleatorio <= 0.28){
            this.x = 101;
        }else{
            if (aleatorio > 0.28 && aleatorio <= 0.42){
                this.x = 202;
            }else{
                if (aleatorio > 0.42 && aleatorio <= 0.56){
                    this.x = 303;
                }else{
                    if(aleatorio > 0.56 && aleatorio <= 0.70){
                        this.x = 404;
                    }else{
                        if(aleatorio > 0.70 && aleatorio <= 0.84){
                            this.x = 505;
                        }else{
                            this.x = 606;
                        }
                    }
                }
            }
        }
    }
    return this.x;
};

var retardarInsetos = function(){
    todosInimigos.forEach(function(inseto){
        inseto.speed = -50;
    });
    setTimeout( () => {
        todosInimigos.forEach(function(inseto){
            inseto.speed = 200;
        }); 
    }, 15000)
};

var verificadorColisoesInseto = function(inseto){
    if (this.jogador.x < inseto.x + 80 && this.jogador.x + 80 > inseto.x && 
        this.jogador.y < inseto.y + 60 && this.jogador.y + 60 > inseto.y){
            chance--;
            if(pontuacao > 0){
                pontuacao--;
            }
            if(chance == 0){
                alert('GAME OVER!\n'
                +'\nPontuação: '+pontuacao
                +'\nColecionáveis: '+colecionavel
                +'\n\nPressione "OK" para reiniciar o jogo!');
                
                chance=10;
                pontuacao=0;
                colecionavel=0;
                bonus=0;
                tirarItem_da_Tela(gema);
                tirarItem_da_Tela(estrela);
            }
            posicaoOriginal(jogador);
    }
};


var verificadorColisoesColecionavel = function(item){
    if (this.jogador.x < item.x + 80 && this.jogador.x + 80 > item.x && 
        this.jogador.y < item.y + 60 && this.jogador.y + 60 > item.y){
            tirarItem_da_Tela(item);
            colecionavel++;
            bonus++;
    }
};

var verificadorColisoesEstrela = function(estrela){
    if (this.jogador.x < estrela.x + 80 && this.jogador.x + 80 > estrela.x && 
        this.jogador.y < estrela.y + 60 && this.jogador.y + 60 > estrela.y){
            tirarItem_da_Tela(estrela);
            retardarInsetos();
            posicaoOriginal(jogador);
    }
};

var obterEstrela = function(jogador){
    this.estrela.x = gerarColuna();
    this.estrela.y = gerarLinha();
    setTimeout( () => {
        tirarItem_da_Tela(estrela);
    }, 5000)
};

var obterColecionavel = function(jogador){
    this.gema.x = gerarColuna();
    this.gema.y = gerarLinha();
    posicaoOriginal(jogador);
};

var posicaoOriginal = function(jogador){
    jogador.x = 303;
    jogador.y = 405;
};

var tirarItem_da_Tela = function(obj){
    obj.x = -200;
    obj.y = -200;
};

document.addEventListener('keyup', function(e){
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    jogador.handleInput(allowedKeys[e.keyCode]);
});
