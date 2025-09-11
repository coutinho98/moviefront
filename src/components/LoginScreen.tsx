import DiscordLoginButton from './DiscordLoginButton';
import TextPressure from "./TextPressure/TextPressure";
import MoviePosterBackground from './MoviePosterBackground'; 

const LoginScreen: React.FC = () => {
  const popularMovieIds = [
    550, // Clube da Luta
    680, // Pulp Fiction
    155, // O Cavaleiro das Trevas
    603, // Matrix
    27205, // A Origem (Inception)
    157336, // Interestelar (Interstellar)
    19995, // Avatar
    238, // O Poderoso Chefão
    862, // Toy Story
    78, // Blade Runner
    278, // Um Sonho de Liberdade
    299534, // Vingadores: Ultimato
    496243, // Parasita
    475557, // Coringa
    11, // Star Wars
    122, // O Senhor dos Anéis: O Retorno do Rei
    106, // De Volta para o Futuro
    515042, // Os Incríveis 2
    424, // A Lista de Schindler
    475430, // Corra!

    675, // Velozes e Furiosos
    497582, // A Chegada
    24428, // Os Vingadores
    13, // Forrest Gump
    272, // Batman Begins
    329, // Jurassic Park
    389, // O Iluminado
    769, // O Silêncio dos Inocentes
    141, // A Bela e a Fera (animação)
    12, // Procurando Nemo
    597, // Titanic
    8587, // O Fabuloso Destino de Amélie Poulain
    284054, // Pantera Negra
    464052, // Mulher-Maravilha
    105, // Piratas do Caribe: A Maldição do Pérola Negra
    124, // Indiana Jones e os Caçadores da Arca Perdida
    73, // 2001: Uma Odisseia no Espaço

    603692, // John Wick 4
    438631, // Duna
    976573, // Guardiões da Galáxia Vol. 3
    906126, // One Piece Film: Red
    346698, // Avatar: O Caminho da Água
    244786, // Star Wars: O Despertar da Força
    646385, // Godzilla vs Kong
    335983, // Venom
    76338, // Mad Max: Estrada da Fúria
    122906, // O Homem de Aço
    68718, // Django Livre
    440, // O Grande Lebowski
    47933, // Os Guardiões da Galáxia
    47535, // Capitão América: O Soldado Invernal
    10195, // Taxi Driver
    9346, // O Show de Truman

    24428, 497582, 9346, 13, 272, 329, 389, 769, 141, 12,
    106, 11, 49026, 47933, 440, 244786, 646385, 335983, 76338, 122906,
    68718, 597, 8587, 284054, 464052, 105,
  ];

  return (
    <div className="h-screen w-full relative flex flex-col justify-between items-center antialiased bg-black">
      <MoviePosterBackground movieIds={popularMovieIds} />

      <div className="flex flex-col items-center justify-center h-full w-full relative z-10 pointer-events-none">
        <div style={{ height: '180px', fontSize: '120px', }}>
          <TextPressure
            text="CDI Movies!"
            flex={false}
            alpha={false}
            stroke={false}
            width={true}
            weight={true}
            italic={true}
            textColor="#ffffff"
            minFontSize={180}
            className="pointer-events-auto"
          />
        </div>
        <div className="flex justify-center mt-8">
          <DiscordLoginButton />
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;