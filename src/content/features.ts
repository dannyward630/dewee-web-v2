/**
 * The dewee capability catalogue and the latest stable releases, EN + VI.
 *
 * Sources (verified 2026-10-19): GitHub release notes v3.28.0 → v3.40.0 (stable only; v3.38.1 is a
 * single fix with no notes and has no entry), and the dewee repo docs: 01-agent-loop, 03-tools-system, 05-channels-messaging, 07-bootstrap-skills-memory,
 * 08-scheduling-cron, 09-security, 10-tracing-observability, 11-agent-teams, 23-multi-tenant-architecture,
 * 24-knowledge-vault, 25-workflows, ccp-usage-tasks-approvals.
 * `since` is set only for items that shipped in a verified release listed in RELEASES; older
 * capabilities carry no version so we never guess one. Beta releases (v3.41.0-beta.x) are left out on
 * purpose. Counts quoted in the catalogue come from FACTS (src/content/facts.ts).
 */
import type { Bi } from "~/i18n/config";
import { FACTS } from "~/content/facts";

export type Release = {
  /** Git tag without the leading "v", e.g. "3.40.0" */
  version: string;
  /** ISO date the release was published */
  date: string;
  title: Bi;
  items: Bi<string[]>;
};

export type Capability = { title: Bi; body: Bi; since?: string };

export type CapabilityGroup = {
  id: string;
  /** Icon name from src/components/ui/icon-paths.ts */
  icon: string;
  title: Bi;
  lede: Bi;
  items: Capability[];
};

/** Stable releases since v3.28 (September and October 2026), newest first. */
export const RELEASES: Release[] = [
  {
    version: "3.40.0",
    date: "2026-10-15",
    title: { en: "A browser your agents can borrow", vi: "Trình duyệt của bạn, agent mượn được" },
    items: {
      en: [
        "A connected browser: with your grant, an agent works in tabs of your own Chrome through the dewee extension",
        "The admin console is rebuilt, and GitHub sign-in is fixed",
        "Leased workers stop before their lease runs out",
        "Every stable release is built from one preflighted commit that runs the full test suite first",
      ],
      vi: [
        "Trình duyệt kết nối: khi bạn cấp quyền, agent làm việc trên các tab Chrome của chính bạn qua tiện ích dewee",
        "Giao diện admin console được dựng lại, và đăng nhập GitHub đã được sửa",
        "Worker thuê theo lease dừng trước khi lease hết hạn",
        "Mỗi bản stable được build từ một commit đã preflight, chạy trọn bộ test trước khi phát hành",
      ],
    },
  },
  {
    version: "3.39.0",
    date: "2026-10-14",
    title: { en: "Say who may use what", vi: "Ai được dùng gì, nói rõ từng người" },
    items: {
      en: [
        "Share levels for agents, and access grants for skills, MCP servers, providers and packages, with an access panel in the console and the CLI",
        "Agents improve from evidence: candidate changes are replayed on saved examples, tried on live traffic once approved, and rolled back if they regress",
        "Signed external events, starting with GitHub, can wake an agent",
        "Memory facts keep their provenance and follow a clear lifecycle",
        "The public MCP endpoint is served at /mcp/server, with status checks, connection diagnostics and a setup screen in the console",
        "Atlas Cloud joins as a native chat provider",
      ],
      vi: [
        "Cấp độ chia sẻ cho agent, và quyền truy cập cho skill, MCP server, nhà cung cấp và package, kèm bảng quyền trong console và CLI",
        "Agent cải thiện dựa trên bằng chứng: thay đổi đề xuất được chạy lại trên ví dụ đã lưu, thử trên lưu lượng thật sau khi được duyệt, và quay lui nếu kết quả tệ đi",
        "Sự kiện bên ngoài có chữ ký, bắt đầu từ GitHub, có thể đánh thức một agent",
        "Dữ kiện trong bộ nhớ giữ nguồn gốc và theo một vòng đời rõ ràng",
        "Endpoint MCP công khai chuyển sang /mcp/server, kèm kiểm tra trạng thái, chẩn đoán kết nối và màn hình thiết lập trong console",
        "Atlas Cloud gia nhập như một nhà cung cấp chat gốc",
      ],
    },
  },
  {
    version: "3.38.0",
    date: "2026-10-07",
    title: { en: "A CLI for agents, onboarding by conversation", vi: "CLI cho agent, làm quen bằng hội thoại" },
    items: {
      en: [
        "An agent-first CLI: structured errors, non-interactive create-and-update commands, idempotency, a handshake and a command manifest",
        "Set up a workspace by talking to a Super Agent, with the plan and each step kept as durable state",
        "Fewer round trips per request in the control plane",
      ],
      vi: [
        "CLI ưu tiên agent: lỗi có cấu trúc, lệnh tạo và cập nhật không cần tương tác, idempotency, handshake và manifest lệnh",
        "Thiết lập workspace bằng cách trò chuyện với Super Agent, kế hoạch và từng bước được lưu bền vững",
        "Control plane xử lý mỗi yêu cầu với ít vòng gọi hơn",
      ],
    },
  },
  {
    version: "3.37.0",
    date: "2026-10-05",
    title: { en: "Channels that know who is talking", vi: "Kênh chat biết ai đang nói" },
    items: {
      en: [
        "Trusted channel identity, plus an inbound gate that screens messages through an MCP tool before the agent sees them (Zalo Personal first)",
        "Discord observe mode records every in-scope server message in a tenant-scoped inbox, and support threads let the author keep talking without mentioning the bot",
        "A guard that checks Discord's remaining connection budget, so a busy support agent does not get its bot token reset",
      ],
      vi: [
        "Danh tính kênh đáng tin cậy, cùng một cổng kiểm tra lọc tin nhắn qua một tool MCP trước khi agent nhìn thấy (bắt đầu với Zalo cá nhân)",
        "Chế độ observe của Discord ghi mọi tin nhắn trong phạm vi vào hộp thư theo tenant, và thread hỗ trợ cho phép người hỏi tiếp tục trò chuyện mà không cần nhắc tên bot",
        "Cơ chế bảo vệ kiểm tra hạn mức kết nối còn lại của Discord, để agent hỗ trợ bận rộn không bị reset token bot",
      ],
    },
  },
  {
    version: "3.36.0",
    date: "2026-10-01",
    title: { en: "Model catalogs that follow your scope", vi: "Danh mục model theo đúng phạm vi của bạn" },
    items: {
      en: [
        "Scoped model catalogs, and GPT-6.1 Sol",
        "Reflex decisions show up in trace details",
        "Stricter validation of import archives",
      ],
      vi: [
        "Danh mục model theo phạm vi, và GPT-6.1 Sol",
        "Quyết định của Reflex hiện trong chi tiết trace",
        "Kiểm tra chặt hơn đối với gói import",
      ],
    },
  },
  {
    version: "3.35.0",
    date: "2026-09-29",
    title: { en: "The control plane catches up with the runtime", vi: "Control plane bắt kịp runtime" },
    items: {
      en: [
        "Agent teams in the console: task detail, task actions and team settings",
        "Chat keys confined to a single agent",
        "A complete workflow editor, with published versions and run feedback",
        "Deep span inspection in traces, with stricter secret redaction",
        "A workspace activity audit with readable labels and actor names",
        "Providers, models, memory, knowledge vault and schedules reach parity with the runtime dashboard",
        "HTTP MCP servers can use static or OAuth authentication",
      ],
      vi: [
        "Đội agent trong console: chi tiết task, thao tác task và cài đặt đội",
        "Chat key bị giới hạn trong một agent duy nhất",
        "Trình soạn workflow hoàn chỉnh, có phiên bản đã publish và phản hồi khi chạy",
        "Soi sâu từng span trong trace, kèm che secret chặt hơn",
        "Nhật ký hoạt động của workspace với nhãn dễ đọc và tên người thực hiện",
        "Nhà cung cấp, model, bộ nhớ, kho tri thức và lịch chạy ngang bằng dashboard của runtime",
        "MCP server qua HTTP có thể dùng xác thực tĩnh hoặc OAuth",
      ],
    },
  },
  {
    version: "3.34.0",
    date: "2026-09-25",
    title: { en: "A calmer control plane", vi: "Control plane gọn gàng hơn" },
    items: {
      en: [
        "The Calm Precision redesign across every page of the customer control plane",
        "Export archives download from the Import/Export tab and the CLI",
        "Self-install: first-run owner setup, password sign-in, the dewee selfhost CLI and a per-workspace channels licence",
      ],
      vi: [
        "Giao diện Calm Precision được áp dụng cho mọi trang của customer control plane",
        "Tải gói export ngay từ tab Import/Export và CLI",
        "Self-install: thiết lập chủ sở hữu ở lần chạy đầu, đăng nhập bằng mật khẩu, CLI dewee selfhost và license kênh theo từng workspace",
      ],
    },
  },
  {
    version: "3.33.0",
    date: "2026-09-24",
    title: { en: "The control plane speaks Vietnamese", vi: "Control plane nói tiếng Việt" },
    items: {
      en: [
        "Customer Control Plane in English and Vietnamese, with your time zone",
        "Credential retargeting through the operator CLI is blocked, and gateway secrets are stripped from host exec",
        "Reasoning-effort ladders per vendor, plus Opus 5.5, Fable 5.1 and GPT-6 Sol-Luna",
        "Gemini 3.8 Flash and Flash-Lite text-to-speech",
      ],
      vi: [
        "Customer Control Plane có tiếng Anh, tiếng Việt và theo múi giờ của bạn",
        "Chặn việc đổi đích credential qua CLI vận hành, và loại secret của gateway khỏi lệnh exec trên host",
        "Thang reasoning effort theo từng hãng, thêm Opus 5.5, Fable 5.1 và GPT-6 Sol-Luna",
        "Text-to-speech Gemini 3.8 Flash và Flash-Lite",
      ],
    },
  },
  {
    version: "3.32.0",
    date: "2026-09-22",
    title: { en: "dewee becomes an MCP server", vi: "dewee thành MCP server" },
    items: {
      en: [
        "A tenant-aware public MCP endpoint, off until you turn it on (served at /mcp/server since v3.39)",
        "Works with Claude Code, Cursor, VS Code/Copilot, Gemini CLI and OpenAI remote MCP",
        "Write tools need their own scope, mcp.tools.write",
        "Deploy readiness checks retry instead of failing early",
      ],
      vi: [
        "Endpoint MCP công khai theo tenant, chỉ mở khi bạn bật (từ v3.39 phục vụ tại /mcp/server)",
        "Dùng được với Claude Code, Cursor, VS Code/Copilot, Gemini CLI và OpenAI remote MCP",
        "Tool ghi dữ liệu cần scope riêng là mcp.tools.write",
        "Bước kiểm tra sẵn sàng khi deploy sẽ thử lại thay vì dừng sớm",
      ],
    },
  },
  {
    version: "3.31.0",
    date: "2026-09-21",
    title: { en: "More models on the menu", vi: "Thêm model vào thực đơn" },
    items: {
      en: [
        "GPT-6 Astra through your ChatGPT subscription",
        "ClinePass (13 models) and OpenCode Go (20 models)",
        "Vercel AI Gateway, and all 27 Workers AI text models",
        "The Customer Control Plane can now do everything the runtime dashboard does",
      ],
      vi: [
        "GPT-6 Astra qua gói ChatGPT bạn đang dùng",
        "ClinePass (13 model) và OpenCode Go (20 model)",
        "Vercel AI Gateway, và đủ 27 model text của Workers AI",
        "Customer Control Plane làm được mọi thao tác như dashboard runtime",
      ],
    },
  },
  {
    version: "3.30.0",
    date: "2026-09-19",
    title: { en: "Workflows you can draw", vi: "Workflow vẽ được, chạy đúng từng bước" },
    items: {
      en: [
        "Deterministic visual workflows: canvas editor, CLI and run inspector",
        "Cron jobs can start a workflow",
        "A message sent to a busy agent is read as a status check, cancel, steer or new task (opt-in)",
        "Intent decisions and a semantic evaluator (shadow mode) show up in traces",
      ],
      vi: [
        "Workflow trực quan chạy tất định: canvas, CLI và trình xem từng lần chạy",
        "Cron có thể khởi động workflow",
        "Tin nhắn gửi lúc agent đang bận được hiểu là hỏi tiến độ, huỷ, đổi hướng hay việc mới (bật khi cần)",
        "Quyết định ý định và bộ đánh giá ngữ nghĩa (chế độ shadow) hiện trong trace",
      ],
    },
  },
  {
    version: "3.29.0",
    date: "2026-09-04",
    title: { en: "Clearer traces, stricter tenants", vi: "Trace rõ hơn, tenant chặt hơn" },
    items: {
      en: [
        "Traces show how reasoning was delivered",
        "Fleet admin operations write trace spans",
        "An unknown --tenant is rejected instead of quietly falling back to the master tenant",
        "Backup skills for operators running dewee on a VPS",
      ],
      vi: [
        "Trace cho thấy phần reasoning được trả về ra sao",
        "Thao tác quản trị fleet cũng ghi span vào trace",
        "--tenant không xác định bị từ chối, thay vì âm thầm rơi về tenant master",
        "Skill sao lưu cho người vận hành dewee trên VPS",
      ],
    },
  },
  {
    version: "3.28.0",
    date: "2026-09-03",
    title: { en: "Voice and reasoning, tuned per agent", vi: "Giọng nói và suy luận, chỉnh theo từng agent" },
    items: {
      en: [
        "Per-provider TTS parameters and multi-speaker Gemini voices from the CLI",
        "Speech-to-text settings from the CLI with dewee stt config",
        "Per-agent reasoning settings, validated before they reach the model",
      ],
      vi: [
        "Tham số TTS riêng cho từng hãng và giọng Gemini nhiều người đọc, chỉnh ngay từ CLI",
        "Cấu hình speech-to-text từ CLI bằng lệnh dewee stt config",
        "Cấu hình reasoning cho từng agent, được kiểm tra trước khi gửi tới model",
      ],
    },
  },
];

/** Everything dewee can do, grouped by area. Order follows how a buyer evaluates the platform. */
export const CAPABILITY_GROUPS: CapabilityGroup[] = [
  {
    id: "channels",
    icon: "messages-square",
    title: { en: "Channels", vi: "Kênh chat" },
    lede: { en: "Where your people and your agents already work together.", vi: "Nơi con người và agent của bạn vốn đã làm việc cùng nhau." },
    items: [
      {
        title: { en: `${FACTS.channels} chat channels`, vi: `${FACTS.channels} kênh chat` },
        body: {
          en: "Telegram, Zalo OA, Zalo Bot, Zalo Personal, Slack, Lark, Discord, WhatsApp, Facebook, Pancake and Bitrix24.",
          vi: "Telegram, Zalo OA, Zalo Bot, Zalo cá nhân, Slack, Lark, Discord, WhatsApp, Facebook, Pancake và Bitrix24.",
        },
      },
      {
        title: { en: "Streaming replies", vi: "Trả lời dạng stream" },
        body: { en: "Answers appear as they are written on Telegram, Slack and Lark.", vi: "Câu trả lời hiện dần trong lúc viết trên Telegram, Slack và Lark." },
      },
      {
        title: { en: "Topics with their own rules", vi: "Mỗi topic một luật riêng" },
        body: { en: "Each Telegram forum topic can carry its own prompt, tools and allow-list.", vi: "Mỗi forum topic trên Telegram có thể có prompt, tool và danh sách người được phép riêng." },
      },
      {
        title: { en: "Voice notes, understood", vi: "Hiểu cả tin nhắn thoại" },
        body: { en: "Voice messages are transcribed on Telegram, Lark and Discord, and on WhatsApp when you opt in.", vi: "Tin nhắn thoại được chuyển thành chữ trên Telegram, Lark và Discord, và trên WhatsApp khi bạn bật." },
      },
      {
        title: { en: "Speaks when spoken to", vi: "Chỉ lên tiếng khi được gọi" },
        body: { en: "In busy Telegram and Slack groups, the agent answers only when someone mentions it.", vi: "Trong nhóm Telegram và Slack đông người, agent chỉ trả lời khi có người nhắc tên." },
      },
      {
        title: { en: "Pairing for strangers", vi: "Ghép nối với người lạ" },
        body: { en: "Unknown senders get a pairing code, and an admin approves them before the agent replies.", vi: "Người lạ nhận mã ghép nối, admin phê duyệt xong thì agent mới trả lời." },
      },
      {
        title: { en: "Comments to private replies", vi: "Từ bình luận sang tin nhắn riêng" },
        body: { en: "Answer Facebook page comments, or move them into a private message through Pancake.", vi: "Trả lời bình luận trên fanpage Facebook, hoặc chuyển thành tin nhắn riêng qua Pancake." },
      },
    ],
  },
  {
    id: "agents",
    icon: "users",
    title: { en: "Agents & teams", vi: "Agent & đội agent" },
    lede: { en: "Specialist agents that hand work to each other, and know when to call a person.", vi: "Những agent chuyên trách biết giao việc cho nhau, và biết lúc nào cần gọi người." },
    items: [
      {
        title: { en: "One agent, one job", vi: "Mỗi agent một việc" },
        body: { en: "Each agent has its own persona, model, tools, skills and memory.", vi: "Mỗi agent có persona, model, tool, skill và bộ nhớ riêng." },
      },
      {
        title: { en: "Teams with a lead", vi: "Đội có trưởng nhóm" },
        body: { en: "A lead agent splits work across members on a shared task board, with a team mailbox.", vi: "Agent trưởng nhóm chia việc cho thành viên trên bảng task chung, kèm hộp thư của đội." },
      },
      {
        title: { en: "Delegation with guardrails", vi: "Giao việc có rào chắn" },
        body: { en: "Hand-offs run sync or async, need a permission link and respect concurrency limits.", vi: "Giao việc chạy đồng bộ hoặc bất đồng bộ, cần liên kết quyền và tuân theo giới hạn song song." },
      },
      {
        title: { en: "Nothing moves off the board", vi: "Không việc nào nằm ngoài bảng" },
        body: { en: "Every delegation must link a team task, or it is refused.", vi: "Mỗi lần giao việc phải gắn với một task của đội, nếu không sẽ bị từ chối." },
      },
      {
        title: { en: "Human handoff", vi: "Chuyển cho người thật" },
        body: { en: "The agent sends a case summary to the right person, group or topic.", vi: "Agent gửi bản tóm tắt vụ việc tới đúng người, nhóm hoặc topic." },
      },
      {
        title: { en: "Say who may use which agent", vi: "Nói rõ ai được dùng agent nào" },
        body: {
          en: "Share an agent at a set level, and grant access to skills, MCP servers, providers and packages person by person.",
          vi: "Chia sẻ agent theo cấp độ, và cấp quyền dùng skill, MCP server, nhà cung cấp, package cho từng người.",
        },
        since: "3.39",
      },
      {
        title: { en: "Reasoning, per agent", vi: "Mức suy luận theo agent" },
        body: { en: "Decide how hard each agent thinks. Settings are checked before they reach the model.", vi: "Chọn mức suy nghĩ cho từng agent. Cấu hình được kiểm tra trước khi tới model." },
        since: "3.28",
      },
      {
        title: { en: "Reads the room when busy", vi: "Hiểu ý khi đang bận" },
        body: { en: "A message sent mid-task is read as a status check, cancel, steer or new task. Opt-in.", vi: "Tin nhắn gửi giữa chừng được hiểu là hỏi tiến độ, huỷ, đổi hướng hay việc mới. Bật khi cần." },
        since: "3.30",
      },
      {
        title: { en: "Stuck tasks get retried", vi: "Task kẹt được đẩy lại" },
        body: { en: "Team tasks stuck waiting for dispatch are picked up again.", vi: "Task của đội bị kẹt ở bước điều phối sẽ được xử lý lại." },
        since: "3.30",
      },
    ],
  },
  {
    id: "models",
    icon: "cpu",
    title: { en: "Models & providers", vi: "Model & nhà cung cấp" },
    lede: { en: `${FACTS.providers} providers, one setting to switch, and a plan B when one fails.`, vi: `${FACTS.providers} nhà cung cấp, đổi bằng một thiết lập, và luôn có phương án B khi một hãng trục trặc.` },
    items: [
      {
        title: { en: `${FACTS.providers} model providers`, vi: `${FACTS.providers} nhà cung cấp model` },
        body: {
          en: "Model labs, cloud gateways, subscriptions you already pay for, and local models on Ollama.",
          vi: "Các hãng model, cổng cloud, gói subscription bạn đang trả tiền, và model chạy local qua Ollama.",
        },
      },
      {
        title: { en: "Provider fallback", vi: "Tự chuyển nhà cung cấp" },
        body: {
          en: "If a provider rate-limits, times out or goes down, the agent moves to the next model on its list.",
          vi: "Khi một hãng giới hạn tốc độ, quá thời gian hoặc ngừng phục vụ, agent chuyển sang model kế tiếp trong danh sách.",
        },
      },
      {
        title: { en: "Prompt caching", vi: "Cache prompt" },
        body: { en: "Cached prompts on Anthropic, OpenAI, MiniMax and OpenRouter keep repeat costs down.", vi: "Prompt được cache trên Anthropic, OpenAI, MiniMax và OpenRouter để giảm chi phí lặp lại." },
      },
      {
        title: { en: "Your ChatGPT subscription", vi: "Dùng gói ChatGPT sẵn có" },
        body: { en: "Run GPT-6 Astra through ChatGPT sign-in (Codex OAuth).", vi: "Chạy GPT-6 Astra qua đăng nhập ChatGPT (Codex OAuth)." },
        since: "3.31",
      },
      {
        title: { en: "ClinePass and OpenCode Go", vi: "ClinePass và OpenCode Go" },
        body: { en: "13 and 20 models through subscriptions your developers may already have.", vi: "13 và 20 model qua các gói mà lập trình viên của bạn có thể đã có." },
        since: "3.31",
      },
      {
        title: { en: "Vercel AI Gateway", vi: "Vercel AI Gateway" },
        body: { en: "One more gateway, plus all 27 Workers AI text models.", vi: "Thêm một cổng nữa, cùng đủ 27 model text của Workers AI." },
        since: "3.31",
      },
      {
        title: { en: "Reasoning-effort ladders", vi: "Thang reasoning effort" },
        body: { en: "Effort levels mapped per vendor, with Opus 5.5, Fable 5.1 and GPT-6 Sol-Luna.", vi: "Mức effort ánh xạ theo từng hãng, kèm Opus 5.5, Fable 5.1 và GPT-6 Sol-Luna." },
        since: "3.33",
      },
    ],
  },
  {
    id: "memory",
    icon: "brain",
    title: { en: "Memory & knowledge", vi: "Bộ nhớ & tri thức" },
    lede: { en: "Agents that remember what matters, and forget on schedule.", vi: "Agent nhớ điều quan trọng, và quên đúng hạn." },
    items: [
      {
        title: { en: "Three tiers of memory", vi: "Bộ nhớ ba tầng" },
        body: {
          en: "Working memory for the chat, summaries of past sessions, and a knowledge graph for facts.",
          vi: "Bộ nhớ làm việc cho cuộc chat, tóm tắt các phiên trước, và knowledge graph cho các dữ kiện.",
        },
      },
      {
        title: { en: "Recall without asking", vi: "Tự nhớ lại" },
        body: { en: "Relevant memories join the context before the agent thinks, within a small token budget.", vi: "Ký ức liên quan được đưa vào ngữ cảnh trước khi agent suy nghĩ, trong một ngân sách token nhỏ." },
      },
      {
        title: { en: "Facts with dates", vi: "Dữ kiện có ngày tháng" },
        body: { en: "The knowledge graph records when a fact became true, and when it stopped.", vi: "Knowledge graph ghi lại lúc một dữ kiện bắt đầu đúng, và lúc nó hết đúng." },
      },
      {
        title: { en: "Knowledge vault", vi: "Kho tri thức (vault)" },
        body: { en: "Linked notes with hybrid full-text and vector search, synced with a folder.", vi: "Ghi chú liên kết bằng wikilink, tìm kiếm kết hợp full-text và vector, đồng bộ với thư mục." },
      },
      {
        title: { en: "Scoped sharing", vi: "Chia sẻ theo phạm vi" },
        body: { en: "Keep knowledge personal, share it with a team, or open it to the whole company.", vi: "Tri thức có thể để riêng, chia cho đội, hoặc mở cho cả công ty." },
      },
      {
        title: { en: "Memory that tidies itself", vi: "Bộ nhớ tự sắp xếp" },
        body: { en: "Background workers turn past sessions into lasting facts and merge duplicates.", vi: "Worker chạy nền biến các phiên cũ thành kiến thức lâu dài và gộp các bản trùng." },
      },
      {
        title: { en: "Retention by default", vi: "Có hạn lưu trữ" },
        body: { en: "Session memories expire after 90 days unless you change it.", vi: "Ký ức theo phiên mặc định hết hạn sau 90 ngày, bạn có thể đổi." },
      },
    ],
  },
  {
    id: "tools",
    icon: "plug",
    title: { en: "Tools, MCP & skills", vi: "Tool, MCP & skill" },
    lede: { en: "What agents can do, and exactly who allowed it.", vi: "Những gì agent làm được, và chính xác ai đã cho phép." },
    items: [
      {
        title: { en: "30+ built-in tools", vi: "Hơn 30 tool có sẵn" },
        body: { en: "Files, web, browser, memory, messaging and media tools, ready on day one.", vi: "Tool cho file, web, trình duyệt, bộ nhớ, nhắn tin và media, dùng được ngay từ ngày đầu." },
      },
      {
        title: { en: "Connect MCP servers", vi: "Kết nối MCP server" },
        body: { en: "Plug in MCP servers over stdio, SSE or streamable HTTP. Their keys are stored encrypted.", vi: "Cắm MCP server qua stdio, SSE hoặc streamable HTTP. Key được lưu ở dạng mã hoá." },
      },
      {
        title: { en: "dewee as an MCP server", vi: "dewee làm MCP server" },
        body: {
          en: "Expose tenant-scoped tools to Claude Code, Cursor, VS Code and more. Off by default; writes need their own scope.",
          vi: "Mở tool theo tenant cho Claude Code, Cursor, VS Code và nhiều công cụ khác. Tắt mặc định; quyền ghi cần scope riêng.",
        },
        since: "3.32",
      },
      {
        title: { en: "Your own browser, by grant", vi: "Trình duyệt của bạn, khi bạn cấp quyền" },
        body: {
          en: "With the dewee Chrome extension, an agent can work in tabs of a person's own Chrome instead of a server browser.",
          vi: "Với tiện ích Chrome của dewee, agent có thể làm việc trên các tab Chrome của chính bạn thay vì trình duyệt trên máy chủ.",
        },
        since: "3.40",
      },
      {
        title: { en: "Skills", vi: "Skill" },
        body: { en: "Know-how packed into SKILL.md files, searched when there are many, called with /skill-name.", vi: "Kinh nghiệm đóng gói trong file SKILL.md, tự tìm khi có nhiều, gọi nhanh bằng /tên-skill." },
      },
      {
        title: { en: "Custom tools, no redeploy", vi: "Tool tuỳ chỉnh, không cần deploy lại" },
        body: { en: "Define a command-line tool over the API, with encrypted env vars and a timeout.", vi: "Tạo tool chạy lệnh qua API, có biến môi trường mã hoá và giới hạn thời gian." },
      },
      {
        title: { en: "Credentialed CLIs", vi: "CLI có credential" },
        body: { en: "Agents run CLIs like gh with stored credentials, without a shell and without seeing the secret.", vi: "Agent chạy các CLI như gh bằng credential lưu sẵn, không qua shell và không thấy secret." },
      },
      {
        title: { en: "Ask before risky actions", vi: "Hỏi trước khi làm việc rủi ro" },
        body: { en: "Command execution and file writes can wait for a human to approve.", vi: "Lệnh thực thi và thao tác ghi file có thể chờ người phê duyệt." },
      },
    ],
  },
  {
    id: "workflows",
    icon: "workflow",
    title: { en: "Workflows & schedules", vi: "Workflow & lịch chạy" },
    lede: { en: "For the jobs that must run the same way every time.", vi: "Cho những việc phải chạy y hệt nhau mỗi lần." },
    items: [
      {
        title: { en: "Deterministic workflows", vi: "Workflow tất định" },
        body: {
          en: "A fixed graph of steps. The model works only inside bounded nodes with typed inputs and outputs.",
          vi: "Các bước là một đồ thị cố định. Model chỉ làm việc bên trong từng node có đầu vào, đầu ra rõ kiểu.",
        },
        since: "3.30",
      },
      {
        title: { en: "Canvas and run inspector", vi: "Canvas và trình xem lần chạy" },
        body: { en: "Draw the flow, then check every node of every run.", vi: "Vẽ luồng việc, rồi soi từng node của từng lần chạy." },
        since: "3.30",
      },
      {
        title: { en: "Agents draft, people publish", vi: "Agent soạn, con người publish" },
        body: { en: "An agent can draft a workflow from a request. Only a person can publish it.", vi: "Agent có thể soạn workflow từ một yêu cầu. Chỉ con người mới được publish." },
        since: "3.30",
      },
      {
        title: { en: "Frozen permissions", vi: "Quyền được đóng băng" },
        body: { en: "Each published version runs under the tool policy it was approved with.", vi: "Mỗi phiên bản đã publish chạy theo đúng chính sách tool lúc được phê duyệt." },
        since: "3.30",
      },
      {
        title: { en: "Cron schedules", vi: "Lịch cron" },
        body: { en: "Run agents at a set time, on an interval or on a cron expression, with retries and backoff.", vi: "Chạy agent vào một thời điểm, theo chu kỳ hoặc biểu thức cron, có thử lại và giãn cách." },
      },
      {
        title: { en: "Cron starts workflows", vi: "Cron gọi workflow" },
        body: { en: "A schedule can kick off a workflow, not just a chat.", vi: "Lịch chạy có thể khởi động một workflow, không chỉ một cuộc chat." },
        since: "3.30",
      },
      {
        title: { en: "Fair queues", vi: "Hàng đợi công bằng" },
        body: { en: "Separate lanes for chats, sub-agents, teams and cron, so one heavy job cannot block the rest.", vi: "Làn riêng cho chat, sub-agent, đội và cron, để một việc nặng không chặn phần còn lại." },
      },
    ],
  },
  {
    id: "traces",
    icon: "scan-eye",
    title: { en: "Traces, usage & cost", vi: "Trace, usage & chi phí" },
    lede: { en: "Every step leaves a receipt.", vi: "Bước nào cũng để lại biên lai." },
    items: [
      {
        title: { en: "A trace for every run", vi: "Trace cho mọi lần chạy" },
        body: { en: "Model calls, tool calls and delegations are recorded as spans you can open.", vi: "Lời gọi model, tool và giao việc đều được ghi thành span để bạn mở ra xem." },
      },
      {
        title: { en: "Cost per call", vi: "Chi phí từng lời gọi" },
        body: { en: "Each model call is priced from its tokens, cache reads included.", vi: "Mỗi lời gọi model được tính giá theo token, kể cả phần đọc cache." },
      },
      {
        title: { en: "Usage at a glance", vi: "Usage trong một cái nhìn" },
        body: {
          en: "Requests, tokens and estimated cost per tenant, broken down by agent and model, updated hourly.",
          vi: "Số request, token và chi phí ước tính theo tenant, chia theo agent và model, cập nhật hằng giờ.",
        },
      },
      {
        title: { en: "Budget caps", vi: "Trần ngân sách" },
        body: { en: "Caps are checked before a billable call is made, not after.", vi: "Trần chi tiêu được kiểm tra trước khi gọi model tính phí, không phải sau." },
      },
      {
        title: { en: "OpenTelemetry export", vi: "Xuất OpenTelemetry" },
        body: { en: "Send traces to your own observability stack with the OTel build.", vi: "Đẩy trace sang hệ thống giám sát của bạn bằng bản build OTel." },
      },
      {
        title: { en: "Reasoning in traces", vi: "Reasoning trong trace" },
        body: { en: "See how reasoning was delivered for each model call. Fleet admin actions write spans too.", vi: "Xem phần reasoning được trả về thế nào ở từng lời gọi. Thao tác quản trị fleet cũng ghi span." },
        since: "3.29",
      },
      {
        title: { en: "Decisions you can audit", vi: "Quyết định có thể kiểm tra" },
        body: { en: "Intent decisions appear as spans, and a semantic evaluator scores runs in shadow mode.", vi: "Quyết định ý định hiện thành span, và bộ đánh giá ngữ nghĩa chấm các lần chạy ở chế độ shadow." },
        since: "3.30",
      },
    ],
  },
  {
    id: "security",
    icon: "shield-check",
    title: { en: "Security", vi: "Bảo mật" },
    lede: { en: "Shut at the door, five layers deep.", vi: "Đóng từ cửa, phòng thủ năm lớp." },
    items: [
      {
        title: { en: "Five layers of defence", vi: "Phòng thủ năm lớp" },
        body: { en: "Transport, input, tools, output and isolation, each with its own checks.", vi: "Transport, input, tool, output và cô lập, lớp nào cũng có kiểm tra riêng." },
      },
      {
        title: { en: "Encrypted secrets", vi: "Secret được mã hoá" },
        body: { en: "Provider keys, MCP keys and CLI credentials are stored with AES-256-GCM.", vi: "Key nhà cung cấp, key MCP và credential CLI được lưu bằng AES-256-GCM." },
      },
      {
        title: { en: "Prompt-injection checks", vi: "Kiểm tra prompt injection" },
        body: { en: "Six known patterns are flagged on the way in. It warns by default; you choose log, warn or block.", vi: "Sáu mẫu tấn công quen thuộc bị gắn cờ ngay đầu vào. Mặc định là cảnh báo; bạn chọn ghi log, cảnh báo hay chặn." },
      },
      {
        title: { en: "Secret scrubbing", vi: "Che secret" },
        body: { en: "Keys, tokens and connection strings are redacted before they can reach a reply.", vi: "Key, token và chuỗi kết nối bị che trước khi kịp lọt vào câu trả lời." },
      },
      {
        title: { en: "SSRF guard", vi: "Chặn SSRF" },
        body: { en: "Agents cannot reach localhost, private networks or cloud metadata, even through redirects.", vi: "Agent không gọi được localhost, mạng nội bộ hay metadata của cloud, kể cả qua redirect." },
      },
      {
        title: { en: "Sandboxed execution", vi: "Chạy code trong sandbox" },
        body: { en: "Code runs in a locked container: read-only, no network, capped CPU, memory and time.", vi: "Code chạy trong container khoá chặt: chỉ đọc, không mạng, giới hạn CPU, RAM và thời gian." },
      },
      {
        title: { en: "Operator CLI hardening", vi: "Siết CLI vận hành" },
        body: {
          en: "Credentials cannot be retargeted through the gateway CLI, and gateway secrets never reach host exec.",
          vi: "Không thể đổi đích credential qua CLI của gateway, và secret của gateway không lọt vào lệnh exec trên host.",
        },
        since: "3.33",
      },
      {
        title: { en: "Closed until licensed", vi: "Đóng cho tới khi kích hoạt" },
        body: { en: "With the licence guard on, nothing listens publicly until activation.", vi: "Khi bật licence guard, không cổng công khai nào mở cho tới lúc kích hoạt." },
      },
    ],
  },
  {
    id: "tenancy",
    icon: "building-2",
    title: { en: "Multi-tenant admin & RBAC", vi: "Đa tenant & phân quyền" },
    lede: { en: "One install, many companies or departments, each isolated from the others.", vi: "Một bản cài, nhiều công ty hay phòng ban, mỗi bên được cô lập với các bên còn lại." },
    items: [
      {
        title: { en: "Tenant isolation", vi: "Cô lập tenant" },
        body: { en: "Every query is scoped to a tenant. A missing tenant is an error, never a default.", vi: "Mọi truy vấn đều gắn tenant. Thiếu tenant là lỗi, không bao giờ tự chọn mặc định." },
      },
      {
        title: { en: "Roles and scopes", vi: "Vai trò và scope" },
        body: { en: "Admin, operator and viewer, with finer scopes for approvals and pairing.", vi: "Admin, operator và viewer, cùng các scope chi tiết cho việc phê duyệt và ghép nối." },
      },
      {
        title: { en: "API keys done properly", vi: "API key đúng chuẩn" },
        body: { en: "Hashed, shown once, scoped, expiring and revocable.", vi: "Được hash, chỉ hiện một lần, có scope, có hạn dùng và thu hồi được." },
      },
      {
        title: { en: "Customer Control Plane", vi: "Customer Control Plane" },
        body: {
          en: "Manage agents, channels, workflows and usage from the web, with the same actions as the runtime dashboard.",
          vi: "Quản lý agent, kênh, workflow và usage trên web, đủ thao tác như dashboard runtime.",
        },
        since: "3.31",
      },
      {
        title: { en: "Your language, your time zone", vi: "Đúng ngôn ngữ, đúng múi giờ" },
        body: { en: "The control plane speaks English and Vietnamese and shows your local time.", vi: "Control plane có tiếng Anh, tiếng Việt và hiển thị theo giờ địa phương của bạn." },
        since: "3.33",
      },
      {
        title: { en: "No silent fallbacks", vi: "Không âm thầm đổi tenant" },
        body: { en: "An unknown tenant hint is rejected instead of landing on the master tenant.", vi: "Tenant không xác định bị từ chối, thay vì rơi về tenant master." },
        since: "3.29",
      },
      {
        title: { en: "Backups per tenant", vi: "Sao lưu theo tenant" },
        body: { en: "Back up and restore one tenant on its own.", vi: "Sao lưu và khôi phục riêng từng tenant." },
      },
      {
        title: { en: "Audit trail", vi: "Nhật ký kiểm toán" },
        body: { en: "Admin actions and pairing approvals are recorded with who did them.", vi: "Thao tác quản trị và việc phê duyệt ghép nối đều được ghi lại, kèm người thực hiện." },
      },
    ],
  },
  {
    id: "voice",
    icon: "audio-lines",
    title: { en: "Voice", vi: "Giọng nói" },
    lede: { en: "Agents that listen to voice notes and answer out loud.", vi: "Agent nghe được tin nhắn thoại và trả lời bằng giọng nói." },
    items: [
      {
        title: { en: "Five text-to-speech engines", vi: "Năm engine text-to-speech" },
        body: { en: "OpenAI, ElevenLabs, Edge, MiniMax and Gemini.", vi: "OpenAI, ElevenLabs, Edge, MiniMax và Gemini." },
      },
      {
        title: { en: "Speech-to-text", vi: "Speech-to-text" },
        body: { en: "Soniox first, with ElevenLabs Scribe as the fallback.", vi: "Ưu tiên Soniox, dự phòng bằng ElevenLabs Scribe." },
      },
      {
        title: { en: "Per-provider voice settings", vi: "Tinh chỉnh giọng theo hãng" },
        body: { en: "Tune each TTS provider's parameters, and give Gemini several speakers.", vi: "Chỉnh tham số riêng cho từng hãng TTS, và dùng nhiều giọng đọc với Gemini." },
        since: "3.28",
      },
      {
        title: { en: "Speech settings from the CLI", vi: "Cấu hình STT từ CLI" },
        body: { en: "Read and change speech-to-text settings with dewee stt config.", vi: "Xem và đổi cấu hình speech-to-text bằng lệnh dewee stt config." },
        since: "3.28",
      },
      {
        title: { en: "Gemini 3.8 Flash TTS", vi: "Gemini 3.8 Flash TTS" },
        body: { en: "Flash and Flash-Lite speech models, added to the Gemini voice line-up.", vi: "Thêm model giọng nói Flash và Flash-Lite vào nhóm giọng Gemini." },
        since: "3.33",
      },
      {
        title: { en: "Private by default on WhatsApp", vi: "Riêng tư mặc định trên WhatsApp" },
        body: {
          en: "WhatsApp voice notes stay untranscribed until you opt in, out of respect for end-to-end encryption.",
          vi: "Tin nhắn thoại WhatsApp không được chuyển thành chữ cho tới khi bạn bật, để tôn trọng mã hoá đầu cuối.",
        },
      },
    ],
  },
  {
    id: "deploy",
    icon: "server",
    title: { en: "Deployment", vi: "Triển khai" },
    lede: { en: "A small binary that starts in under a second.", vi: "Một file chạy nhỏ gọn, khởi động chưa tới một giây." },
    items: [
      {
        title: { en: "A single Go binary", vi: "Một file Go duy nhất" },
        body: { en: "About 25 MB, with the web dashboard built in.", vi: "Khoảng 25 MB, dashboard web có sẵn bên trong." },
      },
      {
        title: { en: "PostgreSQL with pgvector", vi: "PostgreSQL với pgvector" },
        body: { en: "PostgreSQL 18 keeps data, memory and vectors in one place.", vi: "PostgreSQL 18 giữ dữ liệu, bộ nhớ và vector ở cùng một chỗ." },
      },
      {
        title: { en: "Docker images", vi: "Docker image" },
        body: { en: "Pick the base, standard, full or OTel image.", vi: "Chọn image base, chuẩn, full hoặc bản có OTel." },
      },
      {
        title: { en: "Add-ons when you need them", vi: "Add-on khi cần" },
        body: { en: "Browser, OpenTelemetry, sandbox, Tailscale and Redis, built in only if you ask.", vi: "Browser, OpenTelemetry, sandbox, Tailscale và Redis, chỉ build kèm khi bạn cần." },
      },
      {
        title: { en: "Two APIs", vi: "Hai kiểu API" },
        body: { en: "WebSocket RPC for live control, and an OpenAI-compatible HTTP API.", vi: "WebSocket RPC để điều khiển trực tiếp, và HTTP API tương thích OpenAI." },
      },
      {
        title: { en: "Backups built in", vi: "Sao lưu có sẵn" },
        body: { en: "One command, dewee backup, snapshots the install.", vi: "Một lệnh dewee backup là sao lưu cả bản cài." },
      },
      {
        title: { en: "A CLI that works remotely", vi: "CLI dùng từ xa" },
        body: { en: "Manage a running gateway from any laptop with its URL and an operator token.", vi: "Quản lý gateway đang chạy từ bất kỳ máy nào, chỉ cần URL và token operator." },
      },
      {
        title: { en: "Steadier deploys", vi: "Deploy ổn định hơn" },
        body: { en: "Readiness checks retry instead of failing a deploy too early.", vi: "Bước kiểm tra sẵn sàng sẽ thử lại, thay vì làm hỏng lần deploy quá sớm." },
        since: "3.32",
      },
    ],
  },
];
