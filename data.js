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
      q: "추론 시 GPU가 매 토큰마다 HBM↔코어로 끌어오는 \"큰 데이터\" 두 가지는?",
      options: [
        "가중치와 KV cache",
        "가중치와 사용자 임베딩 행렬",
        "KV cache와 attention 점수 행렬",
        "Active params와 total params"
      ],
      correct: 0,
      why: "가중치는 모든 사용자가 공유하는 행렬, KV cache는 사용자별 단기 기억 — 둘 다 HBM에 상주하며 매 토큰마다 코어로 끌려옴. 임베딩 테이블은 \"가중치의 한 부분\"이므로 별도 자료가 아니고, attention 점수는 매 단계 즉석에서 계산되어 저장하지 않음. Active/total params는 같은 가중치를 보는 두 관점일 뿐 별개 데이터가 아님."
    },
    {
      q: "Forward pass의 정의로 가장 정확한 것은?",
      options: [
        "Prompt 전체를 한 번에 처리해 첫 토큰을 준비하는 'prefill'의 다른 이름",
        "한 토큰을 만든 뒤 그 결과로 가중치를 작게 갱신하는 과정",
        "모델의 모든 layer를 병렬로 동시 실행해 latency를 줄이는 기법",
        "입력을 모델 모든 layer에 순차적으로 통과시켜 출력 한 단계를 만드는 과정"
      ],
      correct: 3,
      why: "Forward pass는 \"한 토큰을 만드는 한 사이클\". prefill (긴 prompt 처리) 도, decode (한 토큰씩 생성) 도 모두 forward pass의 형태이지 prefill만 가리키지 않음. 가중치 갱신은 backward (학습)에서만. Layer는 잔차 연결로 정보가 흘러야 하니 병렬 동시 실행이 아닌 순차."
    }
  ],
  module2: [
    {
      q: "Roofline 분석이 LLM 추론에 대해 알려주는 핵심은?",
      options: [
        "한 작업 시간 = compute time + memory time 의 합으로 결정",
        "어떤 작업이든 'arithmetic intensity (ops/byte)'에 따라 compute-bound 또는 memory-bound가 됨",
        "LLM 추론은 어떤 batch size에서도 항상 memory-bound",
        "GPU 세대마다 메모리 대역폭이 두 배씩 늘어 곧 무시 가능"
      ],
      correct: 1,
      why: "한 사이클 시간은 max(compute, memory) 이지 합이 아님. 같은 GPU도 batch / arithmetic intensity 에 따라 compute-bound와 memory-bound 사이를 오감 — \"항상 memory-bound\"는 단순화된 오해. FLOPs/bandwidth ≈ 300 비율이 세대를 거쳐도 안정적이라 메모리 대역폭이 더 빨리 늘지도 않음."
    },
    {
      q: "B100 (~4.5 PFLOP/s, ~8 TB/s) 에서 \"1MB 가중치를 끌어와 한 번씩만 곱하기\" 시나리오. 둘 중 더 큰 시간은?",
      options: [
        "두 시간 모두 OS overhead에 가려져 무시 가능",
        "곱셈 시간 (메모리는 PCIe로 충분히 빨라서)",
        "메모리 fetch 시간 (곱셈은 거의 즉시)",
        "두 시간이 거의 같음 (균형점)"
      ],
      correct: 2,
      why: "1MB 데이터로 한 번씩만 곱하면 ops/byte 가 매우 낮음 (가져오는 시간 ≈ 125 ns, 곱셈은 sub-nanosecond). 명백한 memory-bound 영역. 두 시간이 균형을 이루는 건 ops/byte 가 ~300 (FLOPs/bandwidth) 부근일 때만. GPU는 PCIe 가 아닌 HBM (8 TB/s) 사용."
    }
  ],
  module3: [
    {
      q: "Batch size를 1에서 2,400으로 늘리면 토큰당 비용이 떨어지는 1차 원인은?",
      options: [
        "가중치 한 번 fetch가 2,400명 사용자에게 amortize 됨",
        "KV cache가 자동으로 압축되어 메모리 사용량 감소",
        "GPU 코어가 더 많이 활성화되어 throughput 자동 증가",
        "Sparsity가 커져 active params가 자동 감소"
      ],
      correct: 0,
      why: "가중치는 사용자 모두가 공유 → N명에 분할 상환되어 토큰당 가중치 비용 1/N 이 됨. KV는 오히려 사용자별로 따로 늘어남 (압축 X). 코어 활성화나 sparsity 는 모델 정의 사항이지 batch와 무관."
    },
    {
      q: "Batch를 무한정 늘릴 수 없는 이유는?",
      options: [
        "Batch가 커질수록 모델 정확도가 떨어지므로",
        "GPU 클럭이 batch에 반비례해 자동 감소하므로",
        "가중치 행렬을 batch마다 N번 복제해 메모리에 올려야 하므로",
        "사용자별 KV cache가 누적되어 결국 메모리 / 대역폭 한계 도달"
      ],
      correct: 3,
      why: "가중치는 한 번만 올리면 됨 (모든 사용자 공유, batch에 비례해 늘지 않음). 진짜 한계는 KV: 사용자 N명이면 KV 도 N배. 어느 시점에서 KV fetch가 가중치 fetch를 압도해 토큰당 비용이 다시 올라감. 정확도 / 클럭 자동 변화는 이 맥락에 없음."
    }
  ],
  module4: [
    {
      q: "FLOPs/bandwidth ≈ 300 이 GPU 세대 (A100 → H100 → B100) 에 걸쳐 거의 안 변하는 가장 큰 이유는?",
      options: [
        "Nvidia가 의도적으로 그런 product positioning 을 유지",
        "계산 코어와 HBM 이 같은 die 의 transistor / 면적 / 전력을 두고 경쟁하므로",
        "ML 워크로드의 평균 arithmetic intensity 가 마침 300이라 시장이 거기 맞춤",
        "양자역학적 transistor 밀도 한계 때문"
      ],
      correct: 1,
      why: "둘 다 같은 fab 공정과 die 면적을 공유. 한쪽만 비대해지면 비용 효율이 무너지므로 시장이 자연스럽게 균형을 강제. Nvidia 가격 정책이나 워크로드 통계가 결정한 게 아닌, 칩 설계 경제학에서 떨어지는 자연 결과."
    },
    {
      q: "DeepSeek (256 expert 중 32 활성). 균형 batch size 는?",
      options: [
        "약 300 (sparsity 무관, 그냥 마법의 숫자)",
        "약 9,600 (= 300 × 32, active expert 수)",
        "약 2,400 (= 300 × 8, sparsity)",
        "약 150 (= 300 / 2, 안전 마진)"
      ],
      correct: 2,
      why: "Sparsity = total/active = 256/32 = 8. 공식: batch_optimal ≈ 300 × sparsity = 2,400. \"sparsity\" 가 \"active expert 수\" 자체와 다르다는 점에 주의 (active=32 라도 sparsity=8 은 \"32개로 256개를 대표\"한다는 비율)."
    }
  ],
  module5: [
    {
      q: "MoE에서 router가 하는 일은?",
      options: [
        "토큰의 임베딩을 보고 어떤 expert(들)에게 보낼지와 그 가중치를 결정",
        "모든 expert의 출력을 단순 평균 후 다음 layer로 전달",
        "학습 시에만 동작, 추론 시에는 모든 expert가 균등하게 동작",
        "GPU 사이의 NVLink 트래픽 경로 결정"
      ],
      correct: 0,
      why: "Router는 모델 안의 작은 신경망 layer (보통 linear + softmax). 토큰 임베딩 → top-k expert 와 각각의 가중치를 출력. 결과를 모은 뒤 router 가 정한 가중치로 합침 (단순 평균 X). 추론에서도 동일. 데이터센터 라우팅과는 무관."
    },
    {
      q: "어떤 모델의 active params 가 100B, total params 가 800B 다. Sparsity 와 시스템에 주는 함의는?",
      options: [
        "Sparsity = 700B (= 800 - 100). 추가 파라미터의 양",
        "Sparsity = 8. 메모리에는 800B 모두 상주, 토큰당 계산은 100B 분량",
        "Sparsity = 0.125 (= 100/800). 100B 만 GPU 에 올리고 나머지는 SSD",
        "Sparsity = 1.25. 메모리 / 계산 비율"
      ],
      correct: 1,
      why: "Sparsity 정의 = total / active = 800/100 = 8. 어떤 expert로 갈지 미리 모르니 모든 expert 가중치를 HBM 에 상주시켜야 함 (SSD 로드는 latency 가 너무 큼). 계산은 토큰이 통과하는 active 만큼만."
    }
  ],
  module6: [
    {
      q: "GPU 인프라 맥락에서 scale-up 과 scale-out 의 차이는?",
      options: [
        "Scale-up = 학습용, Scale-out = 추론용",
        "Scale-up 은 Nvidia 전용 용어, Scale-out 은 AMD 전용",
        "Scale-up = GPU 1개의 성능 향상, Scale-out = GPU 수 늘리기 (그 외 의미 없음)",
        "Scale-up = 한 rack 안의 NVLink 연결 (~1×), Scale-out = rack 사이 데이터센터 ethernet (~1/8×)"
      ],
      correct: 3,
      why: "이 문맥에서는 \"한 빠른 통신 도메인 안 (scale-up)\" vs \"도메인 사이 (scale-out)\" 의 분리가 핵심. C 는 일반 IT 의 vertical / horizontal scaling 정의로 비슷하긴 하지만, LLM 분산 결정의 본질은 \"NVLink 도메인 안인가 밖인가\"."
    },
    {
      q: "Hopper (트레이 8 GPU) → Blackwell (랙 72) → Rubin (~500) 으로 한 scale-up 도메인이 커지는 데 가장 빡빡한 물리적 한계는?",
      options: [
        "랙 가격 (조달 한계)",
        "데이터센터 온도 (냉각 한계)",
        "케이블 / backplane 연결자 핀 밀도",
        "전력 공급 (랙당 100kW)"
      ],
      correct: 2,
      why: "전력 / 냉각 / 가격 모두 제약이지만 가장 빡빡한 건 GPU끼리 직접 연결할 때 필요한 물리적 와이어 수와 connector 핀 밀도. Blackwell → Rubin 의 \"진짜 4×\" 향상은 케이블 밀도와 backplane 설계의 진보."
    }
  ],
  module7: [
    {
      q: "Pipeline parallelism의 정의는?",
      options: [
        "모델 layer 를 stage 로 나눠 다른 GPU(또는 rack)에 배치하고 활성화를 다음 stage 로 전달",
        "같은 layer 를 여러 GPU 에 복제해 throughput 을 N배로",
        "한 layer 안의 행렬을 쪼개 여러 GPU 에서 병렬 곱셈",
        "학습 데이터를 N개로 나눠 GPU별로 다른 batch 처리"
      ],
      correct: 0,
      why: "Pipeline 은 \"layer 분할\" 이 본질. B 는 data parallelism 의 추론 변형, C 는 tensor parallelism, D 는 학습용 data parallelism. 셋 다 자주 혼동됨."
    },
    {
      q: "MoE 모델에서 부등식 \"8 × active expert 수 × layer/stage ≥ 8\" 이 시사하는 바는?",
      options: [
        "Pipeline stage 당 layer 가 너무 많으면 항상 손해",
        "Scale-up 안에서 도는 통신량이 충분히 커서 cross-rack 페널티가 잘 가려짐 → pipeline 추가가 손해 안 됨",
        "Stage 를 8개로 나눠야만 pipeline 이 가능",
        "활성 expert 가 8개일 때만 pipeline 적용 가능"
      ],
      correct: 1,
      why: "좌변 = \"rack 안에서 도는 통신량\" (커야 좋음), 우변 = \"rack 사이 보내는 데이터의 8배 페널티\". 좌변이 우변의 8배 이상이면 cross-rack 비용이 묻혀서 pipeline 이 손해 안 봄. 특정 stage 수나 expert 수를 강제하는 게 아님."
    }
  ],
  module8: [
    {
      q: "KV cache 가 토큰마다 따로 저장되는 진짜 이유는?",
      options: [
        "사용자별로 별도 가중치를 두기 위해",
        "보안을 위해 사용자 데이터를 격리",
        "다음 학습에 쓸 데이터를 보존하기 위해",
        "새 토큰 생성 시 이전 토큰들의 K, V 를 매번 다시 forward 하지 않으려고 (O(N²) → O(N))"
      ],
      correct: 3,
      why: "Attention 은 새 토큰의 query 가 이전 모든 토큰의 K 와 내적, V 의 가중합. 매번 prompt 전체를 다시 forward 하면 N² 비용. K, V 를 캐시해 두면 새 토큰은 자기 K, V 만 새로 계산하고 캐시된 것과 곱하기만 하면 됨."
    },
    {
      q: "bytes_per_token ≈ 2KB 모델에서, 한 사용자가 200K 컨텍스트를 사용할 때 그 사람만의 KV cache 총 크기는?",
      options: [
        "약 200 KB",
        "약 40 MB",
        "약 400 MB",
        "약 4 GB"
      ],
      correct: 2,
      why: "2 KB × 200,000 = 400 MB. 1,000명 동시 사용이면 400 GB → 한 GPU HBM (~192 GB) 을 훨씬 초과. 분산과 메모리 압박의 진짜 출처."
    }
  ],
  module9: [
    {
      q: "추론에서 pipeline 을 추가해도 한 토큰의 latency 가 줄지 않는 가장 정확한 이유는?",
      options: [
        "KV cache 압박이 항상 latency 를 결정하므로 layer 분배는 의미 없음",
        "한 토큰의 forward 는 모든 layer 를 순차 통과해야 하므로 critical path 깊이가 그대로 (게다가 rack 간 hop 지연 추가)",
        "GPU 사이의 PCIe 가 너무 느려서",
        "Latency 는 batch size 에 비례 결정되므로"
      ],
      correct: 1,
      why: "Pipeline 은 throughput 에 도움될 수 있지만 한 forward 의 critical path 깊이 (= layer 수 × layer 당 시간) 는 그대로. 거기에 rack-to-rack hop 지연 (~ms) 이 추가됨. KV 는 throughput 에 영향, GPU 간은 PCIe 가 아닌 NVLink, batch 와 latency 는 직접 관계가 약함."
    },
    {
      q: "\"Pipeline 단계 P 를 늘려도 GPU 당 KV cache 가 줄지 않는다\" 의 가장 정확한 메커니즘은?",
      options: [
        "P 배 늘어난 GPU 를 안 놀게 하려면 in-flight sequence 도 P배 늘려야 → GPU 당 KV = (B×P)/(E×P) = B/E 로 P 가 약분",
        "KV cache 가 자동으로 P 배 압축되기 때문",
        "KV 는 P=1 일 때만 정의되는 개념이므로",
        "모든 GPU 가 KV 의 사본을 따로 갖기 때문"
      ],
      correct: 0,
      why: "가중치는 P 단계 분할로 1/P 로 줄음. 그러나 KV 는 시퀀스별 자료라 GPU 가 늘면 batch 도 늘려야 GPU 가 안 놂 — P 가 분자/분모 양쪽에 등장해 약분됨. 결과적으로 GPU 당 KV 부담은 그대로. 자동 압축이나 사본 복제와는 무관."
    }
  ],
  module10: [
    {
      q: "Chinchilla 가 제시한 토큰 : 파라미터 비율은?",
      options: [
        "약 1 : 20 (파라미터 1당 0.05 토큰)",
        "약 5 : 1",
        "약 100 : 1",
        "약 20 : 1"
      ],
      correct: 3,
      why: "DeepMind 2022 Chinchilla 논문. compute-optimal 학습 = 파라미터 1당 약 20 토큰. 70B 모델 → ~1.4T 토큰. 이 비율을 깨고 더 많은 토큰으로 학습하는 게 \"over-training\"."
    },
    {
      q: "현재 frontier 모델이 Chinchilla 의 ~100배로 over-train 되는 가장 합리적인 경제학적 이유는?",
      options: [
        "Pretraining 데이터가 인터넷에 무제한이라 그냥 더 많이 사용",
        "후속 연구로 Chinchilla 원래 논문이 부정됨",
        "평생 추론량이 매우 커서, 모델 사이즈를 줄이고 학습을 늘리면 평생 추론 비용이 크게 줄어 총 비용 ↓",
        "큰 모델이 안전성 평가에 통과하기 어려워서"
      ],
      correct: 2,
      why: "비용 균등화 휴리스틱: 학습 ≈ RL ≈ 평생 추론. 모델 사이즈에 ~선형으로 비싸지는 평생 추론 쪽을 줄이는 것이, 학습을 더 길게 하는 비용보다 큰 이득. A 는 효율을 무시한 단순 논리, B 는 사실 아님, D 는 무관."
    }
  ],
  module11: [
    {
      q: "Gemini 가 ~200K 컨텍스트에서 가격을 50% 올리는 가장 합리적인 운영적 설명은?",
      options: [
        "단순 마케팅 (200K 가 깔끔한 숫자라서)",
        "그 지점부터 KV cache fetch 시간이 가중치/계산 시간을 추월 → 같은 batch 가 메모리 한도 초과 → batch 줄여야 → 토큰당 비용 ↑",
        "200K 이상은 더 비싼 차세대 GPU 에서만 처리",
        "200K 이상은 fallback 모델로 우회 처리"
      ],
      correct: 1,
      why: "KV 는 컨텍스트 L 에 비례해 fetch 비용 증가. 어느 지점에서 가중치 fetch 시간을 추월하고, 그때부터 같은 batch 로는 GPU 메모리 한도를 넘김 → batch 를 줄여 처리 → amortization 효과 ↓ → 토큰당 비용 ↑. 50% 인상은 그 inflection point 부근의 운영 비용을 그대로 반영하는 신호."
    },
    {
      q: "API 의 cache hit 이 cache miss 보다 ~10배 싼 이유는?",
      options: [
        "Cache miss = prompt 전체 forward 다시 (≈ prefill 한 번), Cache hit = HBM 에서 KV 만 read → 작업량 ~10배 차이",
        "Cache 는 무료 저장소라 비용 0",
        "Cache hit 시 GPU 가 절전 모드로 진입해 전기료 1/10",
        "Cache hit 인 사용자는 자동으로 우선순위가 낮아져 늦게 처리"
      ],
      correct: 0,
      why: "Forward pass 비용 vs HBM read 비용의 차이가 약 10배. 이게 prompt caching 가격 할인의 진짜 출처. Cache 자체에도 저장 / 대역폭 비용은 들고, 우선순위 / 절전과는 무관."
    }
  ],
  module12: [
    {
      q: "\"Frontier 추론은 거의 항상 단일 scale-up 도메인 안에서 한다\" 결론을 가장 정확히 뒷받침하는 논리는?",
      options: [
        "Pipeline parallelism 이 이론적으로 작동하지 않기 때문",
        "한 GPU 만 쓰는 게 항상 가장 빠르기 때문",
        "Frontier 모델이 항상 작아서 한 GPU 에 들어가기 때문",
        "MoE 의 all-to-all 이 scale-up 안에서만 빠르고, KV cache 대역폭은 pipeline 단계 P 가 약분되어 줄지 않으므로 → 단일 도메인 안이 최선"
      ],
      correct: 3,
      why: "두 결론이 합쳐져 frontier 의 결정을 만듦. MoE 는 scale-up 안에서 all-to-all 이 효율적. KV 대역폭은 P 약분으로 pipeline 효과 X. 가능하면 단일 scale-up 안에서 expert + 약간의 tensor parallelism 으로 끝냄. Pipeline 은 가중치가 한 도메인 HBM 합을 초과할 때만."
    },
    {
      q: "어떤 모델의 sparsity 는 그대로지만 active params 만 절반이 됐다. 균형 batch size 는?",
      options: [
        "절반 (active 가 줄었으므로)",
        "두 배 (모델이 가벼워져 더 많이 batch 가능)",
        "그대로 (균형 batch ≈ 300 × sparsity, active 는 식에 등장하지 않음)",
        "4배 (active 1/2 × 활용도 2배)"
      ],
      correct: 2,
      why: "균형 공식 도출 과정에서 active params 가 양변에서 약분됨. 남는 건 \"하드웨어 비율 (300) × 모델 sparsity\". Active 변화는 batch 결정 자체에는 영향 없음 (단, latency / throughput 절댓값에는 영향)."
    }
  ]
};

// ----------- Window 노출 -----------
window.GLOSSARY = GLOSSARY;
window.QUIZZES = QUIZZES;
