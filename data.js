/* =====================================================
   data.js - 글로서리 사전 + 퀴즈 데이터
   ===================================================== */

// ----------- 글로서리 / 툴팁 사전 -----------
// HTML 본문에서 <span class="term" data-term="키"> 로 호출.

const GLOSSARY = {
  // ===== LLM 기초 =====
  "LLM": {
    title: "Large Language Model",
    body: "방대한 텍스트로 학습된 거대한 신경망. 다음 토큰을 확률적으로 예측. ChatGPT, Claude, Gemini가 모두 LLM."
  },
  "토큰": {
    title: "Token",
    body: "LLM이 다루는 단어의 조각. 영어 평균 ≈ 0.75단어/토큰, 한국어는 더 잘게 쪼개짐. 모델은 토큰 단위로 입력/출력."
  },
  "가중치": {
    title: "Weights / Parameters",
    body: "학습으로 결정된 신경망 내부의 숫자들. 수십억~수조 개. <strong>한 번 학습되면 고정</strong>되어, 추론 시에는 GPU 메모리에서 읽기만 함."
  },
  "추론": {
    title: "Inference",
    body: "이미 학습된 모델을 써서 사용자 질문에 답을 생성하는 과정. (학습 = 가중치 만들기 / 추론 = 가중치 쓰기)"
  },
  "forward pass": {
    title: "Forward Pass",
    body: "입력 → 모델의 모든 layer 통과 → 출력 한 토큰. 추론은 전부 forward pass의 반복."
  },
  "backward pass": {
    title: "Backward Pass",
    body: "출력의 오차를 거꾸로 전파해 가중치를 업데이트. 학습에서만 일어남. forward의 ~2배 비용."
  },
  "트랜스포머": {
    title: "Transformer",
    body: "현재 모든 frontier LLM의 기본 아키텍처 (2017). 핵심은 <strong>self-attention</strong>: 각 토큰이 이전 모든 토큰을 \"참조\"하는 메커니즘."
  },
  "attention": {
    title: "Attention",
    body: "트랜스포머의 핵심 연산. 새 토큰을 만들 때 이전 토큰들 중 어디에 \"주목\"할지를 가중합으로 결정. 그래서 토큰 메모리(KV)가 필요."
  },

  // ===== 이 영상의 주역들 =====
  "KV cache": {
    title: "KV Cache",
    body: "Attention 계산에 쓰이는 Key/Value 텐서를 토큰마다 저장. 다음 토큰 생성 때 이전 토큰들의 K,V를 <strong>다시 계산하지 않게</strong> 함. 사용자(=시퀀스)마다 따로 가짐. 컨텍스트가 길수록 누적됨."
  },
  "batch": {
    title: "Batch",
    body: "이 맥락에서 = <strong>여러 사용자의 요청을 한 forward에 같이 묶기</strong>. 가중치 한 번 읽어 N명에게 적용 → 비용 1/N. \"배치 사이즈\" = 동시에 처리하는 시퀀스 수."
  },
  "batch size": {
    title: "Batch Size",
    body: "한 번의 forward pass에서 함께 처리하는 시퀀스(사용자) 수. 너무 작으면 가중치 fetch가 비싸짐, 너무 크면 KV/계산이 늘어남. 최적점이 존재."
  },
  "MoE": {
    title: "Mixture of Experts (MoE)",
    body: "각 layer에 \"전문가\" MLP를 여러 개 두고, 토큰마다 일부만 활성화. <strong>전체는 거대하지만 토큰당 계산은 적음</strong>. DeepSeek은 256개 중 32개 활성."
  },
  "expert": {
    title: "Expert",
    body: "MoE의 작은 MLP. \"이 토큰은 어떤 expert가 잘 처리하지?\"를 router가 결정."
  },
  "router": {
    title: "Router",
    body: "MoE에서 각 토큰을 어떤 expert에게 보낼지 정하는 작은 신경망. 학습으로 그 정책이 결정됨."
  },
  "sparsity": {
    title: "Sparsity",
    body: "MoE에서 <code>전체 expert / 활성 expert</code>. DeepSeek은 256/32 = 8. <strong>최적 batch ≈ 300 × sparsity</strong>."
  },
  "active params": {
    title: "Active Parameters",
    body: "한 토큰을 처리할 때 실제로 쓰이는 가중치 수. MoE에서는 total보다 훨씬 작음. 추론 비용은 active에 비례."
  },
  "total params": {
    title: "Total Parameters",
    body: "모델의 모든 가중치 합. MoE에서는 total >> active. GPU 메모리에 모두 올려야 함 (라우팅이 어디로 갈지 미리 모르니)."
  },
  "router layer": {
    title: "Router Layer",
    body: "MoE 블록 입구. 토큰을 받아 \"어떤 expert로?\"를 결정. 출력은 expert 인덱스와 가중치."
  },

  // ===== 하드웨어 =====
  "GPU": {
    title: "GPU",
    body: "병렬 행렬곱에 특화된 칩. LLM은 결국 거대한 행렬곱이라 GPU가 강함. NVIDIA H100, B100 등."
  },
  "HBM": {
    title: "High Bandwidth Memory",
    body: "GPU 옆에 붙은 초고속 메모리. 가중치/KV cache가 여기 살고, 매 토큰마다 여기서 읽어옴. 용량 80~288GB, 대역폭 3~20 TB/s."
  },
  "FLOPs": {
    title: "FLOPs / FLOP/s",
    body: "Floating Point Operations. <strong>FLOPs</strong>(복수, 누적량) = \"이 연산은 N번의 부동소수 연산\". <strong>FLOP/s</strong> = \"초당 연산 처리량\". B100은 ~4.5 PFLOP/s."
  },
  "memory bandwidth": {
    title: "Memory Bandwidth",
    body: "GPU가 HBM에서 데이터를 끌어올 수 있는 속도 (TB/s). 추론은 이 대역폭에 자주 발목 잡힘 - <strong>계산보다 \"데이터 가져오기\"가 느려서</strong>."
  },
  "roofline": {
    title: "Roofline Model",
    body: "성능 = min(피크 계산력, 데이터 전송 한계) 라는 분석 틀. \"내 작업은 둘 중 어느 쪽에 발목 잡히나\"를 보는 도구."
  },
  "throughput": {
    title: "Throughput",
    body: "초당 처리량 (예: tokens/sec). 단위 시간당 얼마나 많이?"
  },
  "latency": {
    title: "Latency",
    body: "한 작업의 시작부터 끝까지 걸리는 시간 (예: ms). 한 토큰 만드는 데 얼마나?"
  },

  // ===== Nvidia 칩 세대 =====
  "Hopper": {
    title: "Hopper (H100)",
    body: "Nvidia 2022 세대. ~80GB HBM, ~3 TB/s. 8개 GPU가 한 트레이(scale-up 도메인)."
  },
  "Blackwell": {
    title: "Blackwell (B100/B200)",
    body: "Nvidia 2024 세대. ~192GB HBM, ~8 TB/s. 64-72개 GPU가 한 랙(NVL72)."
  },
  "Rubin": {
    title: "Rubin",
    body: "Nvidia 차차세대 (~2026). ~288GB HBM, ~20 TB/s. ~500개 GPU를 한 scale-up 도메인에. 케이블 밀도 4배 향상."
  },
  "DeepSeek": {
    title: "DeepSeek",
    body: "중국발 오픈소스 frontier MoE 모델. 256 expert 중 32개 활성. 영상에서 \"공개된 사양\"의 예시로 자주 등장."
  },
  "TPU": {
    title: "TPU (Tensor Processing Unit)",
    body: "Google이 만든 ML 전용 칩. Reiner Pope가 Google 시절 작업. Gemini는 TPU에서 학습/서빙."
  },

  // ===== 분산 / 병렬화 =====
  "scale-up": {
    title: "Scale-up Network",
    body: "랙 <strong>안</strong>의 GPU들을 잇는 초고속 연결망. NVLink. 1× 기준."
  },
  "scale-out": {
    title: "Scale-out Network",
    body: "랙 <strong>사이</strong>를 잇는 데이터센터 이더넷. scale-up보다 ~8× 느림. \"건너편 랙으로 가야 한다\"는 건 비싼 일."
  },
  "NVLink": {
    title: "NVLink",
    body: "Nvidia GPU 간 직접 연결 버스. 랙 안에서 다른 GPU를 거의 \"옆 메모리\"처럼 접근 가능."
  },
  "rack": {
    title: "Rack",
    body: "데이터센터에서 GPU가 모인 한 캐비닛. 64-72개 GPU. 전력/냉각/케이블 한계로 더 키우기 어려움."
  },
  "all-to-all": {
    title: "All-to-All Communication",
    body: "모든 GPU가 모든 GPU에게 데이터를 보내야 하는 통신 패턴. MoE의 \"각 토큰이 어떤 GPU의 expert로 갈지 모름\" 때문에 필연. 랙 안에서는 빠르지만 랙을 넘으면 비쌈."
  },
  "expert parallelism": {
    title: "Expert Parallelism",
    body: "MoE의 expert들을 GPU별로 나눠 두는 분산 방식. 각 GPU는 일부 expert만 갖고, 토큰을 그쪽으로 라우팅."
  },
  "pipeline parallelism": {
    title: "Pipeline Parallelism",
    body: "모델의 layer를 여러 그룹으로 잘라 각 그룹을 다른 GPU(또는 랙)가 맡음. \"layer 0-25는 rack 0, 26-50은 rack 1...\""
  },
  "tensor parallelism": {
    title: "Tensor Parallelism",
    body: "한 layer 안의 행렬을 쪼개 여러 GPU에서 동시에 곱하는 방식. 통신이 잦아 보통 한 노드/랙 안에서만 함."
  },
  "data parallelism": {
    title: "Data Parallelism",
    body: "같은 모델 사본을 여러 GPU에 두고 각자 다른 배치를 처리. 학습에서 일반적, 추론에서는 \"인스턴스 여러 개\"로 자연스럽게 됨."
  },
  "pipeline bubble": {
    title: "Pipeline Bubble",
    body: "Pipeline 학습에서 forward와 backward가 동기화되어야 해서 일부 stage가 놀게 되는 시간. micro-batch로 줄임."
  },
  "micro-batch": {
    title: "Micro-batch",
    body: "Pipeline에서 한 \"전체 배치\"를 더 잘게 쪼갠 단위. <code>global_batch = micro_batch × pipeline_stages</code>."
  },

  // ===== 추론 / 서빙 =====
  "prefill": {
    title: "Prefill",
    body: "사용자 프롬프트(예: 1만 토큰)를 한번에 모델에 통과시켜 첫 토큰을 만들 준비. 모든 토큰이 <strong>동시에</strong> 처리되어 가중치 fetch가 amortize됨 → 토큰당 싸다."
  },
  "decode": {
    title: "Decode",
    body: "한 번에 한 토큰씩 생성. 매 토큰마다 가중치 전체를 다시 fetch해야 해서 비쌈. 출력 토큰이 입력 토큰보다 5-10배 비싼 이유."
  },
  "prompt caching": {
    title: "Prompt Caching",
    body: "같은 prefix가 반복되는 요청에서, 이전에 계산해 둔 KV cache를 재사용. cache hit은 cache miss보다 ~10배 쌈."
  },
  "context length": {
    title: "Context Length",
    body: "모델이 한 번에 보는 토큰 수의 한계 (예: 200K). KV cache 메모리에 비례해 비용/지연이 증가."
  },
  "context window": {
    title: "Context Window",
    body: "Context length의 다른 표현. 200K = 약 150,000 단어 ≈ 책 한 권."
  },

  // ===== 학습 / 스케일링 =====
  "pretraining": {
    title: "Pretraining",
    body: "모델의 첫 학습 단계. 인터넷에서 수집한 거대 텍스트로 \"다음 토큰 예측\". 6 × 가중치 × 토큰수 의 FLOPs."
  },
  "RL": {
    title: "Reinforcement Learning (RL)",
    body: "Pretraining 이후, 모델이 직접 응답을 생성해 점수를 받고 개선되는 학습. \"reasoning\" 모델의 핵심. 비용이 pretraining만큼 큼."
  },
  "Chinchilla": {
    title: "Chinchilla Scaling Law",
    body: "DeepMind 2022 논문이 제안한 \"compute-optimal\" 비율: 모델 1개 파라미터당 ~20 토큰 학습. 이 비율을 깨면 \"over-training\"."
  },
  "compute optimal": {
    title: "Compute-Optimal",
    body: "주어진 학습 FLOPs 예산에서 가장 좋은 모델을 만드는 (모델크기, 데이터양) 조합. Chinchilla가 제시한 분배."
  },
  "over-training": {
    title: "Over-training",
    body: "Chinchilla 권고보다 훨씬 더 많은 토큰으로 학습. 학습 비용은 늘지만 모델이 작게 유지되어 <strong>추론 비용이 싸짐</strong>. 추론 횟수가 많을수록 합리적."
  },
  "scaling laws": {
    title: "Scaling Laws",
    body: "모델 크기, 데이터량, 학습 compute가 늘면 성능이 어떻게 변하는지 정리한 경험식. Kaplan(2020), Chinchilla(2022)가 대표적."
  },

  // ===== 영상 인물 =====
  "Reiner Pope": {
    title: "Reiner Pope",
    body: "MatX(LLM 전용 칩 스타트업) CEO. 전 Google, JAX와 TPU 기반 LLM 서빙 작업. 이 영상의 \"강사\"."
  },
  "Dwarkesh": {
    title: "Dwarkesh Patel",
    body: "기술/AI/경제 인터뷰 팟캐스트 진행자. 이 에피소드는 평소 인터뷰 형식이 아닌 \"칠판 강의\" 포맷."
  },
  "Ilya": {
    title: "Ilya Sutskever",
    body: "OpenAI 공동창업자, 현 SSI(Safe Superintelligence) 창업자. \"As we now know, pipelining is not wise\"라는 발언이 영상에서 인용됨."
  },

  // ===== 수식 등장 단어들 =====
  "rematerialization": {
    title: "Rematerialization (remat)",
    body: "메모리에 저장 안 한 값을 필요할 때 다시 계산. KV cache miss 시에는 prompt 전체를 forward로 다시 돌려 KV를 만듦 (비쌈)."
  },
  "amortize": {
    title: "Amortize",
    body: "비싼 비용을 여러 사용자/단위에 \"분할 상환\". 가중치 한 번 fetch를 N명에게 나누면 토큰당 비용은 1/N."
  },
  "balance point": {
    title: "Balance Point",
    body: "두 비용(예: 계산 시간, 메모리 시간)이 같아지는 지점. 보통 그 근처에서 합이 최소가 되어 최적 운영점이 됨."
  },
  "inflection point": {
    title: "Inflection Point",
    body: "그래프의 \"꺾이는\" 지점. Gemini가 200K 토큰에서 가격을 올린 건 그 지점에서 비용 곡선 기울기가 바뀌었다는 신호."
  },
  "FLOP utilization": {
    title: "FLOP Utilization",
    body: "GPU의 이론 FLOP/s 중 실제 사용된 비율. 100%이면 \"compute bound\" 상태. 추론은 보통 30~50%로 \"memory bound\"."
  }
};

// ----------- 모듈별 퀴즈 -----------

const QUIZZES = {
  module1: [
    {
      q: "추론(inference) 시 GPU가 매 토큰마다 HBM에서 가져와야 하는 두 가지는?",
      options: [
        "가중치(weights)와 KV cache",
        "가중치와 학습 데이터",
        "임베딩과 활성화 함수",
        "사용자 토큰과 프롬프트"
      ],
      correct: 0,
      why: "추론에서 HBM↔코어 전송의 주된 항목 두 개입니다. 가중치는 모든 사용자가 공유, KV cache는 사용자(시퀀스)마다 따로. 학습 데이터는 추론과 무관."
    },
    {
      q: "\"forward pass\"를 가장 잘 설명한 것은?",
      options: [
        "입력으로부터 출력을 한 번 계산하는 과정",
        "가중치를 업데이트하는 학습 과정",
        "데이터를 디스크에서 GPU로 옮기는 과정",
        "사용자에게 응답 패킷을 전송하는 과정"
      ],
      correct: 0,
      why: "forward pass = 입력 → layer 통과 → 출력. 가중치 업데이트는 backward pass(학습에서만)."
    }
  ],
  module2: [
    {
      q: "Roofline 분석이 말하는 핵심은?",
      options: [
        "계산 시간과 메모리 시간 중 더 느린 게 항상 병목이다",
        "GPU는 항상 100% 사용률로 돌아간다",
        "메모리가 항상 병목이다",
        "더 빠른 GPU를 사면 항상 빨라진다"
      ],
      correct: 0,
      why: "어떤 작업이든 \"피크 계산력\"과 \"데이터 전송 한계\" 둘 중 더 작은 쪽에 묶임. LLM 추론은 자주 메모리 쪽에 묶이지만 \"항상\"은 아님 — 그게 batch가 흥미로운 이유."
    },
    {
      q: "B100은 ~4.5 PFLOP/s, ~8 TB/s. 1MB짜리 작은 가중치를 GPU에 올려서 한 번 곱하면 어느 쪽이 병목?",
      options: [
        "메모리 (가져오는 시간이 계산 시간보다 훨씬 큼)",
        "계산",
        "두 개가 정확히 같음",
        "GPU 코어 수"
      ],
      correct: 0,
      why: "1MB 가중치로 할 수 있는 계산은 ~수십만 FLOPs (sub-microsecond), 가져오는 데는 1MB / 8TB/s = 125 nanoseconds. 계산이 훨씬 짧으니 \"메모리 대기\"가 주범. 이래서 \"가중치 한 번 fetch에 더 많은 일을 시키자\" = batching이 강력."
    }
  ],
  module3: [
    {
      q: "Batch size를 1에서 2400으로 늘리면 토큰당 비용이 가장 줄어드는 주된 이유는?",
      options: [
        "가중치를 1번 읽어서 2400명에게 같이 적용 가능",
        "더 빠른 GPU가 자동 활성화됨",
        "메모리 용량이 2400배 커짐",
        "사용자 수가 줄어듦"
      ],
      correct: 0,
      why: "가중치 fetch는 \"누가 쓰든 한 번\". batch=1이면 그 비용이 한 명 토큰에 다 실리고, batch=2400이면 1/2400. 이게 \"batching이 1000배 경제\"의 정체."
    },
    {
      q: "Batch size를 무한정 늘려도 안 되는 이유는?",
      options: [
        "사용자마다 KV cache가 따로 늘어 메모리/대역폭이 한계",
        "가중치 메모리가 사용자 수에 비례해 늘어남",
        "네트워크 비용이 폭증",
        "모델 정확도가 떨어짐"
      ],
      correct: 0,
      why: "KV cache는 시퀀스마다 별도. 사용자가 1000명이면 KV 메모리도 1000배. 어느 순간 KV fetch가 가중치 fetch를 압도해 \"더 늘려도 토큰당 비용이 안 떨어짐\"."
    }
  ],
  module4: [
    {
      q: "FLOPs/Memory bandwidth ≈ 300 이라는 비율이 GPU 세대를 거쳐도 안정적인 가장 큰 이유는?",
      options: [
        "계산 코어와 메모리 둘 다 같은 칩의 transistor 자원을 두고 경쟁",
        "Nvidia가 의도적으로 그렇게 설계",
        "양자역학적 한계",
        "우연히 그런 값"
      ],
      correct: 0,
      why: "둘 다 실리콘 면적과 전력을 먹고, 같은 fab 공정을 공유. 한 쪽이 빨라지면 다른 쪽도 비례해 빨라지지 않으면 균형이 안 맞음. 그래서 비율이 크게 안 변함 — 결과적으로 \"최적 batch size\" 공식이 단순해짐."
    },
    {
      q: "DeepSeek가 256개 expert 중 32개를 활성화한다. 균형점에서의 batch size는?",
      options: [
        "약 2,400 (= 300 × 8)",
        "약 300",
        "약 9,600",
        "약 150"
      ],
      correct: 0,
      why: "Sparsity = total/active = 256/32 = 8. 최적 batch ≈ 300 × sparsity = 2400. 'Active params에서 본 균형점이 sparsity 만큼 늘어남' 이라는 직관이 핵심."
    }
  ],
  module5: [
    {
      q: "MoE에서 router의 역할은?",
      options: [
        "각 토큰을 어떤 expert(들)에게 보낼지 결정",
        "모든 expert의 결과를 그냥 평균함",
        "GPU 사이의 네트워크 트래픽을 관리",
        "학습 시에만 사용되는 보조 모듈"
      ],
      correct: 0,
      why: "Router는 작은 신경망 layer. 토큰 임베딩을 받아 \"이 토큰은 expert 7과 32에게 점수가 가장 높음\" 같은 결정을 함."
    },
    {
      q: "Active parameters와 Total parameters의 차이는?",
      options: [
        "Active = 한 토큰을 처리할 때 실제 쓰이는 가중치 수, Total = 모든 expert 합",
        "Active = 학습된 가중치, Total = 미학습 포함",
        "Active = GPU에 올린 것, Total = 디스크에 있는 것",
        "둘은 같은 개념"
      ],
      correct: 0,
      why: "MoE는 모델 전체(Total)는 거대하지만, 토큰 하나가 실제로 통과하는 가중치(Active)는 일부. 추론 비용은 Active에 비례, 메모리 점유는 Total에 비례."
    }
  ],
  module6: [
    {
      q: "Scale-up과 Scale-out의 차이는?",
      options: [
        "Scale-up = 랙 안 NVLink (빠름), Scale-out = 랙 사이 이더넷 (~8배 느림)",
        "Scale-up = 더 큰 GPU 1개, Scale-out = 작은 GPU 여러 개",
        "Scale-up = 학습용, Scale-out = 추론용",
        "둘은 같은 표현"
      ],
      correct: 0,
      why: "한 랙 안에서는 NVLink로 GPU들이 거의 \"옆 메모리\"처럼 통신. 랙을 넘으면 데이터센터 이더넷으로 떨어져 대역폭이 급감. \"한 랙에 다 들어갔으면 좋겠다\"는 모든 분산 의사결정의 출발점."
    },
    {
      q: "Hopper 8 GPU → Blackwell 72 → Rubin ~500 으로 한 scale-up 도메인이 커진다. 진짜 기술적 한계는?",
      options: [
        "케이블 밀도와 backplane 연결자",
        "전력 공급",
        "GPU 가격",
        "Nvidia의 마케팅 결정"
      ],
      correct: 0,
      why: "GPU끼리 모두 직접 연결하려면 케이블이 천문학적으로 많아짐. 케이블 굵기 × 곡률 × 커넥터 핀 밀도가 물리적 한계. Hopper→Blackwell은 폼팩터 변경(트레이→랙)이 컸고, Blackwell→Rubin은 케이블 밀도 진짜 4배 향상."
    }
  ],
  module7: [
    {
      q: "Pipeline parallelism이 의미하는 것은?",
      options: [
        "모델 layer를 여러 GPU/랙에 나눠 배치, 활성화를 다음으로 넘김",
        "같은 데이터를 여러 GPU에서 동시에 복제 처리",
        "여러 모델을 동시에 서빙",
        "학습 데이터를 분할"
      ],
      correct: 0,
      why: "Pipeline = 공장 컨베이어처럼 layer 0~25는 rack 0, 26~50은 rack 1 ... 토큰이 layer를 따라 다음 랙으로 이동."
    },
    {
      q: "8-active-experts × 8-layers-per-stage × 2 ≥ 8 부등식이 의미하는 바는?",
      options: [
        "랙 안 (scale-up) 통신이 랙 사이 (scale-out) 통신보다 충분히 무거워서 pipeline이 손해 안 봄",
        "Pipeline은 항상 비효율적",
        "MoE는 pipeline과 호환 안 됨",
        "Batch size를 줄여야 함"
      ],
      correct: 0,
      why: "Scale-out은 ~8배 느림. 랙 안에서 도는 통신량이 \"랙 사이로 보내는 데이터\"의 8배 이상이면, scale-out 시간은 scale-up 시간에 가려져 추가 비용 거의 무시 가능."
    }
  ],
  module8: [
    {
      q: "KV cache가 토큰마다 따로 저장되는 이유는?",
      options: [
        "다음 토큰을 만들 때 이전 모든 토큰의 K, V를 다시 계산하지 않으려고",
        "사용자별 가중치를 따로 두려고",
        "학습 데이터를 영구 저장하려고",
        "보안 격리 때문"
      ],
      correct: 0,
      why: "Self-attention은 새 토큰이 이전 모든 토큰과 \"내적\"을 함. 매번 prompt 전체를 다시 forward 하면 N²이지만, K, V를 캐시해 두면 N으로 떨어짐."
    },
    {
      q: "bytes_per_token ≈ 2KB 인 모델에서, 200K 컨텍스트를 가진 한 사용자의 KV cache 총 크기는?",
      options: [
        "약 400 MB",
        "약 40 MB",
        "약 4 GB",
        "약 200 KB"
      ],
      correct: 0,
      why: "2KB × 200,000 = 400 MB. 사용자 1000명이면 400 GB → 한 GPU의 HBM(~192GB)에 안 들어감. 그래서 분산이 필요."
    }
  ],
  module9: [
    {
      q: "추론에서 pipelining이 latency(첫 토큰 시간)을 줄이지 못하는 이유는?",
      options: [
        "어차피 한 토큰을 만들려면 모든 layer를 순차적으로 통과해야 함",
        "GPU가 너무 느려서",
        "사용자가 너무 많아서",
        "메모리가 부족해서"
      ],
      correct: 0,
      why: "Pipeline은 처리량(throughput)에 도움이 될 수 있지만 한 토큰의 critical path는 layer 수만큼 길어. 한 랙에 다 있으나 4개 랙에 흩어져 있으나 한 토큰 시간은 비슷, 오히려 랙 간 hop 지연으로 더 늘 수도."
    },
    {
      q: "KV cache 메모리에서 pipeline 단계 수 P가 \"상쇄된다\"는 의미는?",
      options: [
        "P를 늘리면 GPU 수가 늘어 batch도 비례해 늘려야 GPU가 안 놀고, 그래서 GPU당 KV는 그대로",
        "Pipeline이 자동으로 KV를 압축",
        "P=1이 항상 최적",
        "KV는 P와 무관하게 작아짐"
      ],
      correct: 0,
      why: "가중치는 P 단계로 나누면 GPU당 1/P. 하지만 KV는 시퀀스마다 따로고, P배 늘어난 GPU를 채우려면 시퀀스도 P배 → GPU당 KV는 (B×P)/(E×P) = B/E. P가 분자/분모에서 사라짐."
    }
  ],
  module10: [
    {
      q: "Chinchilla가 권하는 토큰:파라미터 비율은 대략?",
      options: [
        "20:1 (파라미터 1개당 토큰 20개)",
        "1:1",
        "100:1",
        "1:20"
      ],
      correct: 0,
      why: "DeepMind의 2022 논문. \"compute-optimal\" 학습은 파라미터 1당 약 20 토큰. 이를 깨고 더 학습하면 \"over-training\"."
    },
    {
      q: "현재 frontier 모델이 Chinchilla의 100배로 over-train 되는 이유로 가장 합리적인 것은?",
      options: [
        "모델은 한번 학습돼서 평생 추론을 하므로, 작고 잘 학습된 모델이 총 비용을 줄임",
        "Chinchilla 논문이 틀린 것으로 밝혀져서",
        "학습 데이터가 무한하니까 그냥 더 씀",
        "Nvidia가 학습 시간을 길게 쓰라고 시켜서"
      ],
      correct: 0,
      why: "추론을 하루 수십억 번 하니까, 모델 사이즈를 줄여 추론 비용을 깎는 게 학습을 더 길게 하는 비용보다 훨씬 이득. 비용 균등화: \"학습 == 추론 == RL\" 근처가 최적."
    }
  ],
  module11: [
    {
      q: "Gemini가 ~200K 컨텍스트에서 가격을 50% 올리는 이유의 가장 합리적인 설명은?",
      options: [
        "그 지점에서 KV cache 메모리 fetch 시간이 계산 시간을 추월해 같은 batch로 처리 못 함",
        "200K가 데이터의 절대적 한계",
        "단순한 마케팅",
        "그 길이 이상은 더 좋은 GPU가 필요"
      ],
      correct: 0,
      why: "긴 컨텍스트에서는 KV fetch가 빠르게 늘어나(B×L 형태) 어느 순간 가중치 fetch를 압도. 그 지점에서 batch를 줄여야 GPU가 메모리 한도를 안 넘김 → 토큰당 비용 ↑. 50% 인상은 그 \"꺾이는 지점\"이 200K 근처임을 시사."
    },
    {
      q: "Cache hit이 cache miss보다 ~10배 싼 이유는?",
      options: [
        "HBM에서 KV를 읽는 비용이, 같은 KV를 만들기 위해 prompt 전체를 forward 다시 돌리는 비용보다 훨씬 작음",
        "Cache는 무료라서",
        "Hit 시 GPU가 꺼지므로 전기 요금이 줄어들어서",
        "사용자 수가 자동으로 줄어들어서"
      ],
      correct: 0,
      why: "Cache miss = 사실상 prefill 다시 함 (모델 전체 forward). Cache hit = 이미 만들어진 KV를 HBM에서 끌어오기. 후자가 ~10배 적은 작업. 이게 prompt caching의 경제 원리."
    }
  ],
  module12: [
    {
      q: "다음 중 \"한 랙(scale-up) 안에 모든 게 들어가는 것이 좋다\"는 결론의 가장 정확한 근거는?",
      options: [
        "All-to-all 통신이 빠르고, KV cache 대역폭에는 pipeline이 도움이 안 됨",
        "한 GPU만 쓰는 게 항상 가장 빠르다",
        "모델은 늘 작기 때문",
        "Pipeline parallelism은 항상 잘못된 선택"
      ],
      correct: 0,
      why: "MoE는 all-to-all → scale-up 도메인 안에서만 빠름. 그리고 KV cache 대역폭은 pipeline으로 해결 안 됨 (P 상쇄). 두 결론이 합쳐져 \"frontier 추론은 거의 항상 단일 scale-up\"."
    },
    {
      q: "어떤 모델의 active params가 절반이 됐지만 sparsity는 그대로다. 최적 batch size는?",
      options: [
        "그대로 (300 × sparsity 만 결정)",
        "절반",
        "두 배",
        "4배"
      ],
      correct: 0,
      why: "공식: batch_size_optimal ≈ 300 × sparsity. 여기에 active params는 등장하지 않음. 양변에서 잘 약분해서 \"하드웨어 비율 × 모델 sparsity\"만 남기 때문."
    }
  ]
};

// ----------- Window 노출 -----------
window.GLOSSARY = GLOSSARY;
window.QUIZZES = QUIZZES;
