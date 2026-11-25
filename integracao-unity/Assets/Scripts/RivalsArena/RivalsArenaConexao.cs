// =====================================================================
// RivalsArenaConexao.cs — componente pronto para a primeira cena
// ---------------------------------------------------------------------
// 1. Crie um GameObject vazio na PRIMEIRA cena do jogo (ex.: "RivalsArena")
// 2. Arraste este script para ele
// Pronto: ele inicia a conexão, continua vivo entre as cenas e guarda
// os dados do jogador que vieram do site em RivalsArenaConexao.Dados.
// =====================================================================

using UnityEngine;

public class RivalsArenaConexao : MonoBehaviour
{
    // Dados do jogador logado no site (null se o jogo não está dentro do site)
    public static RivalsArena.DadosDoSite Dados;

    private static RivalsArenaConexao instancia;
    private float tempoParaLer = 0f;

    void Awake()
    {
        // Só pode existir um
        if (instancia != null) { Destroy(gameObject); return; }
        instancia = this;
        DontDestroyOnLoad(gameObject);

        RivalsArena.Iniciar();
    }

    void Update()
    {
        // O site responde alguns instantes depois que o jogo avisa que está pronto,
        // então conferimos 2 vezes por segundo até os dados chegarem.
        if (Dados != null) return;
        tempoParaLer -= Time.unscaledDeltaTime;
        if (tempoParaLer > 0f) return;
        tempoParaLer = 0.5f;

        Dados = RivalsArena.LerDadosDoSite();
        if (Dados != null)
        {
            Debug.Log("[RivalsArena] Jogando como: " + Dados.usuario + " | guerreiro: " + Dados.guerreiro);
        }
    }
}
