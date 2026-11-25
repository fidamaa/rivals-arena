// =====================================================================
// RivalsArena.cs — funções que o jogo usa para falar com o site
// ---------------------------------------------------------------------
// Coloque em: Assets/Scripts/RivalsArena/
// Precisa do arquivo Assets/Plugins/WebGL/RivalsArena.jslib
//
// Uso (veja também RivalsArenaConexao.cs e o LEIA-ME.md):
//
//   RivalsArena.Iniciar();                       // 1x, quando o jogo abre
//   RivalsArena.DadosDoSite dados = RivalsArena.LerDadosDoSite();
//   if (dados != null) Debug.Log("Jogando como " + dados.usuario);
//
//   // quando a partida terminar:
//   RivalsArena.EnviarResultado("infinito", ondas, pontos, false, "Secutor", segundos);
// =====================================================================

using System.Runtime.InteropServices;
using UnityEngine;

public static class RivalsArena
{
    // Modos que o site entende
    public const string ModoSobrevivencia = "sobrevivencia"; // 5 ondas
    public const string ModoInfinito = "infinito";           // ondas infinitas

#if UNITY_WEBGL && !UNITY_EDITOR
    [DllImport("__Internal")] private static extern void RA_Iniciar();
    [DllImport("__Internal")] private static extern string RA_LerDadosDoSite();
    [DllImport("__Internal")] private static extern void RA_EnviarResultado(string json);
#endif

    // O que o site manda para o jogo
    [System.Serializable]
    public class DadosDoSite
    {
        public string usuario;    // nome do jogador logado no site ("" se for visitante)
        public string guerreiro;  // guerreiro escolhido na partida (Secutor, Retiarius, Sagittarius, Dimachaerus)
        public string partidaId;  // partida da Rivals Arena ligada a este jogo ("" se for jogo livre)
    }

    // O que o jogo manda para o site
    [System.Serializable]
    private class Resultado
    {
        public string modo;
        public int ondas;
        public int pontos;
        public bool venceu;
        public string guerreiro;
        public int duracaoSegundos;
    }

    /// Chame uma vez quando o jogo abrir.
    public static void Iniciar()
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        RA_Iniciar();
#else
        Debug.Log("[RivalsArena] Iniciar() — só funciona na build WebGL.");
#endif
    }

    /// Devolve os dados enviados pelo site, ou null se ainda não chegou nada
    /// (por exemplo: jogo aberto direto no itch.io, fora do site).
    public static DadosDoSite LerDadosDoSite()
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        string json = RA_LerDadosDoSite();
        if (string.IsNullOrEmpty(json)) return null;
        return JsonUtility.FromJson<DadosDoSite>(json);
#else
        return null;
#endif
    }

    /// Chame quando a partida terminar (vitória ou derrota).
    /// modo: RivalsArena.ModoSobrevivencia ou RivalsArena.ModoInfinito
    public static void EnviarResultado(string modo, int ondas, int pontos, bool venceu, string guerreiro, int duracaoSegundos)
    {
        Resultado resultado = new Resultado
        {
            modo = modo,
            ondas = ondas,
            pontos = pontos,
            venceu = venceu,
            guerreiro = guerreiro,
            duracaoSegundos = duracaoSegundos
        };
        string json = JsonUtility.ToJson(resultado);
#if UNITY_WEBGL && !UNITY_EDITOR
        RA_EnviarResultado(json);
#else
        Debug.Log("[RivalsArena] Resultado (só é enviado na build WebGL): " + json);
#endif
    }
}
