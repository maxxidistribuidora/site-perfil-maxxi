// Função para contar as seleções e armazenar em sessionStorage
function contarSelecoes() {
    var grupoAMenus = document.querySelectorAll("select[name^='mais_identifica']");
    var grupoBMenus = document.querySelectorAll("select[name^='menos_identifica']");
    var contagem = {
        grupoA: {
            Dominante: 0,
            Extrovertido: 0,
            Analitico: 0,
            Paciente: 0
        },
        grupoB: {
            Dominante: 0,
            Extrovertido: 0,
            Analitico: 0,
            Paciente: 0
        }
    };

   // Obtenha o nome e a opção selecionada do formulário
   var nome = document.getElementById("nome").value;
   var opcaoSelecionada = document.getElementById("opcao").value;
   var avaliador = document.getElementById("avaliador").value;

   
    // Conte as seleções para cada grupo e perfil
    function contarSelecoesPorGrupo(menus, grupo) {
        menus.forEach(function(menu) {
            Array.from(menu.options).forEach(function(opcao) {
                if (opcao.selected) {
                    contagem[grupo][opcao.value]++;
                }
            });
        });
    }

    contarSelecoesPorGrupo(grupoAMenus, "grupoA");
    contarSelecoesPorGrupo(grupoBMenus, "grupoB");

    // Armazene as contagens em sessionStorage
    sessionStorage.setItem("contagem_grupoA", JSON.stringify(contagem.grupoA));
    sessionStorage.setItem("contagem_grupoB", JSON.stringify(contagem.grupoB));
    sessionStorage.setItem("nome", nome);
    sessionStorage.setItem("opcao", opcaoSelecionada);
    sessionStorage.setItem("avaliador", avaliador);
}

// Execute a função ao enviar o formulário
document.getElementById("meuFormulario").addEventListener("submit", contarSelecoes);

$(document).ready(function () {
    // Função para mostrar ou ocultar o campo "Avaliado por" com base na seleção e habilitá-lo ou desabilitá-lo
    function toggleAvaliadoPorField() {
        var opcaoSelect = document.getElementById("opcao");
        var avaliadorContainer = document.getElementById("avaliador-container");
        var avaliadorInput = document.getElementById("avaliador");

        if (opcaoSelect.value === "Outro - Outra pessoa escolhe com base no que identifica em mim") {
            avaliadorContainer.style.display = "block";
            avaliadorInput.disabled = false;
        } else {
            avaliadorContainer.style.display = "none";
            avaliadorInput.disabled = true;

            // Limpar o campo "Avaliado por" quando a opção "Eu" for selecionada
            avaliadorInput.value = "";
        }
    }

    // Executar a função quando a página carregar para lidar com a seleção inicial
    toggleAvaliadoPorField();

    // Executar a função sempre que a seleção mudar
    document.getElementById("opcao").addEventListener("change", toggleAvaliadoPorField);

    // Limpar seleção ao clicar no botão "Limpar Formulário"
        $("#clear-button").on("click", function () {
        if (confirm("Tem certeza de que deseja limpar o formulário? Isso apagará todas as seleções feitas.")) {
            $('select[name^="mais_identifica"]').val('');
            $('select[name^="menos_identifica"]').val('');
            
            // Remova a coloração das caixas de seleção
            $('select[name^="mais_identifica"], select[name^="menos_identifica"]').css("background-color", "");
            $('select[name^="mais_identifica"], select[name^="menos_identifica"]').css("color", "");
        }
    });

    // Destacar caixas de seleção quando uma palavra é selecionada
    $("select[name^='mais_identifica'], select[name^='menos_identifica']").on("change", function () {
        var selectedValue = $(this).val();
        if (selectedValue !== "") {
            $(this).css("background-color", "#F27B35"); // Altere a cor de fundo desejada aqui
            $(this).css("color", "#fff"); // Altere a cor do texto desejada aqui
        } else {
            $(this).css("background-color", ""); // Remova a cor de fundo
            $(this).css("color", ""); // Remova a cor do texto
        }
    });

    // Verificar o formulário antes de fazer o submit
    $("form[id='meuFormulario']").submit(function (e) {
        e.preventDefault(); // Impede o envio do formulário

        // Verifica se todas as seleções foram feitas
        var missingSelection = false;
        $('select[name^="mais_identifica"]').each(function () {
            var menosSeIdentificaSelect = $(this).closest("tr").find('select[name^="menos_identifica"]');
            if ($(this).val() === "") {
                alert("Por favor, selecione uma opção para 'Mais se Identifica' em todas as linhas.");
                $(this).focus();
                missingSelection = true;
                return false; // Interrompe o loop
            }
            if ($(this).val() === menosSeIdentificaSelect.val()) {
                alert("As opções 'Mais se Identifica' e 'Menos se Identifica' não podem ser iguais em uma linha.");
                $(this).focus();
                missingSelection = true;
                return false; // Interrompe o loop
            }
        });

        if (missingSelection) {
            return;
        }

        // Verifica se foi selecionada uma opção para 'Menos se Identifica' em todas as linhas
        $('select[name^="menos_identifica"]').each(function () {
            var maisSeIdentificaSelect = $(this).closest("tr").find('select[name^="mais_identifica"]');
            if ($(this).val() === "") {
                alert("Por favor, selecione uma opção para 'Menos se Identifica' em todas as linhas.");
                $(this).focus();
                missingSelection = true;
                return false; // Interrompe o loop
            }
            if ($(this).val() === maisSeIdentificaSelect.val()) {
                alert("Por favor, as escolhas para 'Mais se Identifica' e 'Menos se Identifica' não podem ser idênticas na mesma linha.");
                $(this).focus();
                missingSelection = true;
                return false; // Interrompe o loop
            }
        });

        if (missingSelection) {
            return;
        }
        
        // Pergunta ao usuário antes de enviar
        if (confirm("Tem certeza de que deseja enviar o formulário?")) {
            // Envie o formulário
                    
            this.submit();
        }
    });
});
