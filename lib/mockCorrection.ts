export interface HighlightData {
  id: string;
  highlightedText: string;
  comment: string;
}

export interface CriterionFeedback {
  introduction: string;
  strengths: string[];
  improvements: string[];
  suggestion: string;
}

export interface CriterionResult {
  number: 1 | 2 | 3 | 4 | 5;
  name: string;
  description: string;
  score: number;
  maxScore: number;
  color: string;
  bgColor: string;
  borderColor: string;
  feedback: CriterionFeedback;
  highlights: HighlightData[];
}

export interface MockCorrection {
  totalScore: number;
  maxScore: number;
  percentage: number;
  classification: string;
  criteria: CriterionResult[];
}

const mockCorrection: MockCorrection = {
  totalScore: 960,
  maxScore: 1000,
  percentage: 96,
  classification: 'Excelente',
  criteria: [
    {
      number: 1,
      name: 'Critério 1',
      description: 'Correção ortográfica',
      score: 200,
      maxScore: 200,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      borderColor: '#BFDBFE',
      feedback: {
        introduction:
          'O desempenho no item de correção ortográfica foi excelente, demonstrando domínio das normas de escrita formal do português, com uso consistente de acentuação, ortografia correta e aplicação adequada de maiúsculas, minúsculas e pronomes. Contudo, o texto apresenta alguns desvios relacionados à divisão silábica.',
        strengths: [
          'Uso correto de acentuação em todas as palavras',
          'Ortografia impecável, sem erros detectados em palavras complexas',
          'Emprego adequado de maiúsculas em siglas e nomes próprios',
          'Pronomes bem utilizados, garantindo clareza e coesão textual',
        ],
        improvements: [
          'Erros de divisão silábica em algumas palavras',
          'Pequenos desvios no uso de vírgulas em alguns trechos',
        ],
        suggestion:
          'Para melhorar, revise as regras de divisão silábica conforme a norma culta e atente-se à aplicação de vírgulas para evitar rupturas na fluidez das frases.',
      },
      highlights: [
        { id: 'h1_1', highlightedText: 'acentuação correta', comment: 'Uso adequado de acentos em todas as palavras do trecho' },
        { id: 'h1_2', highlightedText: 'ortografia precisa', comment: 'Grafia correta de palavras complexas' },
        { id: 'h1_3', highlightedText: 'divisão silábica', comment: 'Atenção à separação silábica em final de linha' },
      ],
    },
    {
      number: 2,
      name: 'Critério 2',
      description:
        'Compreender a proposta de redação e aplicar conceitos das várias áreas de conhecimento para desenvolver o tema, dentro dos limites estruturais do texto dissertativo-argumentativo em prosa.',
      score: 200,
      maxScore: 200,
      color: '#10B981',
      bgColor: '#ECFDF5',
      borderColor: '#A7F3D0',
      feedback: {
        introduction:
          'O texto demonstra excelente compreensão da proposta de redação e apresenta desenvolvimento claro e bem fundamentado, explorando os pilares centrais do tema. A abordagem está diretamente alinhada à proposta, incorporando repertórios legítimos e relevantes que enriquecem a argumentação.',
        strengths: [
          'Desenvolvimento do tema com alinhamento direto aos pilares da proposta',
          'Utilização de repertórios legítimos e diversificados',
          'Estrutura textual bem organizada, com introdução, argumentos consistentes e conclusão com proposta viável',
          'Redação fundamentada e clara, sem indícios de traços de gêneros textuais inadequados',
        ],
        improvements: [
          'O repertório trazido pelo usuário pode ser algo mais contextual e diversificado',
          'A estrutura do texto poderia explorar mais nuances do tema',
        ],
        suggestion:
          'Continue estruturando seus textos de forma clara e organizada, explorando o repertório de maneira pertinente e integrando-o com os argumentos. Trabalhar igualmente a linguagem objetiva e coesa contribuirá para aprimorar a qualidade das próximas produções.',
      },
      highlights: [
        { id: 'h2_1', highlightedText: 'tema abordado com argumentos concretos', comment: 'Tema sendo abordado com argumentos e exemplos concretos' },
        { id: 'h2_2', highlightedText: 'repertório cultural pertinente', comment: 'Uso de referências que enriquecem a argumentação' },
        { id: 'h2_3', highlightedText: 'estrutura dissertativa adequada', comment: 'Texto segue o modelo dissertativo-argumentativo corretamente' },
      ],
    },
    {
      number: 3,
      name: 'Critério 3',
      description:
        'Selecionar, relacionar, organizar e interpretar informações, fatos, opiniões e argumentos em defesa de um ponto de vista.',
      score: 200,
      maxScore: 200,
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
      borderColor: '#DDD6FE',
      feedback: {
        introduction:
          'O desempenho no item avaliado foi excelente, evidenciando habilidade em selecionar, relacionar, organizar e interpretar informações para sustentar um ponto de vista de maneira clara, coesa e bem fundamentada. Os argumentos foram consistentes, exemplificados com repertórios pertinentes e bem utilizados.',
        strengths: [
          'Abordagem direta e completa do tema, contemplando os pilares propostos',
          'Uso de exemplos concretos, garantindo relevância ao tema e embasamento verificável',
          'Desenvolvimento lógico e progressivo dos argumentos, estruturados com clareza e conexão entre os parágrafos',
          'Proposta de intervenção bem planejada e apresentada exclusivamente na conclusão',
          'Ausência de contradições ou lacunas argumentativas',
        ],
        improvements: [
          'Não foram identificadas lacunas ou desvios evidentes no desenvolvimento do item',
        ],
        suggestion:
          'Mantenha o padrão de clareza, fundamentação e organização apresentados neste texto. Você demonstrou grande habilidade em articulação e uso de repertórios; continue explorando referências verificáveis e pertinentes para reforçar seu ponto de vista.',
      },
      highlights: [
        { id: 'h3_1', highlightedText: 'argumentação bem estruturada', comment: 'Progressão lógica dos argumentos com conexão entre parágrafos' },
        { id: 'h3_2', highlightedText: 'exemplos verificáveis', comment: 'Uso de dados e referências que sustentam o ponto de vista' },
        { id: 'h3_3', highlightedText: 'ponto de vista consistente', comment: 'Defesa clara e coesa do posicionamento do autor' },
      ],
    },
    {
      number: 4,
      name: 'Critério 4',
      description:
        'Demonstrar conhecimento dos mecanismos linguísticos necessários para a construção da argumentação.',
      score: 160,
      maxScore: 200,
      color: '#F59E0B',
      bgColor: '#FFFBEB',
      borderColor: '#FDE68A',
      feedback: {
        introduction:
          'O desempenho no uso dos mecanismos linguísticos foi razoável, demonstrando domínio satisfatório, mas com alguns aspectos importantes a melhorar. O texto apresenta operadores argumentativos adequados e bem empregados. No entanto, houve repetição excessiva de palavras específicas e foi identificado um parágrafo monoperiódico.',
        strengths: [
          'Emprego correto de operadores como "No entanto", "Entretanto" e "Destarte"',
          'Coesão intraparágrafo bem empregada com uso de "De fato"',
          'Argumentação desenvolvida de forma clara e organizada',
        ],
        improvements: [
          'Repetições desnecessárias de palavras que poderiam ser substituídas por sinônimos',
          'Presença de um parágrafo composto por apenas um período',
        ],
        suggestion:
          'Para tornar sua redação mais sofisticada, procure diversificar o vocabulário utilizando sinônimos adequados. Desenvolva melhor os parágrafos para evitar estruturas monoperiódicas.',
      },
      highlights: [
        { id: 'h4_1', highlightedText: 'Entretanto', comment: 'Conector intraparágrafo que ajuda na fluidez e coesão do texto' },
        { id: 'h4_2', highlightedText: 'palavra repetida', comment: 'Repetição excessiva — considere usar sinônimos' },
        { id: 'h4_3', highlightedText: 'parágrafo curto', comment: 'Parágrafo monoperiódico que limita a complexidade textual' },
      ],
    },
    {
      number: 5,
      name: 'Critério 5',
      description:
        'Elaborar proposta de intervenção para o tema, respeitando os direitos humanos. E detalhando os elementos: Qual é a AÇÃO? Quem é o AGENTE? Por qual MODO/MEIO? Qual será o EFEITO?',
      score: 200,
      maxScore: 200,
      color: '#EC4899',
      bgColor: '#FDF2F8',
      borderColor: '#FBCFE8',
      feedback: {
        introduction:
          'O desempenho na elaboração da proposta de intervenção foi excelente, cumprindo todos os critérios avaliados com clareza, pertinência e detalhamento adequado. A ação proposta é concreta, diretamente relacionada ao tema e desdobrada de forma coerente com o desenvolvimento do texto.',
        strengths: [
          'A proposta de intervenção dialoga diretamente com o tema',
          'Todos os elementos (ação, agente, modo/meio e efeito) estão presentes e claramente articulados',
          'Respeita os direitos humanos ao propor medidas sem apelo à coerção violenta',
          'Conclusão bem estruturada, com conectivo conclusivo adequado e retomada reformulada da tese',
        ],
        improvements: [
          'Não foram identificados desvios ou pontos de atenção significativos neste item',
        ],
        suggestion:
          'Continue desenvolvendo o detalhamento de forma precisa e considerando múltiplas formas de execução, para ampliar o impacto das ações sugeridas. Parabéns pela clareza e consistência na formulação da proposta!',
      },
      highlights: [
        { id: 'h5_1', highlightedText: 'proposta de intervenção completa', comment: 'Presença de ação, agente, modo/meio e efeito' },
        { id: 'h5_2', highlightedText: 'medida respeitando direitos humanos', comment: 'Proposta sem apelo a coerção ou violência' },
        { id: 'h5_3', highlightedText: 'conclusão estruturada', comment: 'Conectivo conclusivo adequado com retomada da tese' },
      ],
    },
  ],
};

export function getMockCorrection(_criteria: string, _year: string): MockCorrection {
  return mockCorrection;
}
