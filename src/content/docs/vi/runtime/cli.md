---
title: Tham chiếu CLI
description: "Dòng lệnh dewee: global flag, cách CLI tìm gateway và key của bạn, định dạng đầu ra, và mọi nhóm lệnh cho agent, skill, workflow, bộ nhớ và quản trị."
section: runtime
order: 2
updated: 2026-10-19
---

Chính binary `dewee` dùng để chạy gateway cũng là client dòng lệnh của nó. Phần lớn lệnh nói chuyện với một gateway đang chạy qua HTTP hoặc WebSocket, trên máy hay từ xa, nên người vận hành có thể viết script cho gần như mọi việc làm được trong console. Một vài lệnh bảo trì làm việc trực tiếp với cơ sở dữ liệu và chỉ dùng trên máy chủ.

## Global flag

Các flag này dùng được với mọi lệnh, đặt trước hay sau subcommand đều được.

| Flag | Ý nghĩa |
|---|---|
| `--server` | URL của gateway cần gọi |
| `--token` | Bearer token cho gateway đó: gateway token hoặc một API key |
| `--tenant` | ID hoặc slug của tenant sẽ thao tác |
| `--user-id` | User ID ghi nhận cho mục đích truy vết. Mặc định: `system` |
| `--config` | File cấu hình cho các lệnh đọc cấu hình trên máy |
| `-v`, `--verbose` | Log ở mức debug |

Chạy `dewee` không kèm subcommand sẽ khởi động gateway; không có lệnh start riêng. `dewee version` in ra phiên bản và số hiệu protocol, và mỗi lệnh đều tự mô tả flag của mình trong phần help đi kèm.

## Gọi một gateway từ xa

Truyền server và key bằng flag, hoặc đặt một lần trong biến môi trường:

```bash
dewee --server https://dewee.example.com --token "<api-key>" agent list

export DEWEE_SERVER=https://dewee.example.com
export DEWEE_API_KEY=<api-key>
dewee agent list --json
```

CLI xác định từng giá trị theo thứ tự sau:

- **Server:** `--server`, rồi `DEWEE_SERVER`, rồi `GOCLAW_SERVER` hoặc `GOCLAW_GATEWAY_URL`, rồi host và cổng trong cấu hình trên máy. Giá trị cuối cùng là `http://127.0.0.1:18790`.
- **Key:** `--token`, rồi `DEWEE_API_KEY`, rồi `GOCLAW_GATEWAY_TOKEN`, rồi cấu hình trên máy.
- **Tenant:** `--tenant`, rồi `DEWEE_TENANT_ID`, rồi `GOCLAW_TENANT_ID`. Giá trị được gửi trong header `X-GoClaw-Tenant-Id`.

> [!NOTE]
> Để an toàn, CLI không gửi `DEWEE_API_KEY` trong biến môi trường tới một `--server` khác với `DEWEE_SERVER`. Hãy truyền `--token` rõ ràng khi bạn cố ý trỏ tới một gateway khác.

Tạo API key ở trang **API key & tài liệu** trong console, hoặc bằng `dewee api-keys create`. Xem [Xác thực](/docs/api/authentication) để biết về phạm vi quyền.

## Định dạng đầu ra

Không có flag đầu ra chung. Phần lớn lệnh đọc dữ liệu nhận `--json` để xuất dạng máy đọc được. `traces`, `usage`, `fleet`, `cli-credentials` và `admin` dùng `-o table` hoặc `-o json`, còn `workflows`, `memory`, `vault`, `kg` và `files` nhận cả hai. Với `backup`, `tenant-backup` và `skills export`, `-o` là đường dẫn file đầu ra.

```bash
dewee usage summary --period 7d -o json
dewee mcp list --json
```

## Thiết lập và chẩn đoán

| Lệnh | Tác dụng |
|---|---|
| `dewee onboard` | Thiết lập lần đầu trên máy chủ: cơ sở dữ liệu, secret, migration, `.env.local` |
| `dewee setup` | Trình hướng dẫn cho provider, model, agent và channel. Cần gateway đang chạy |
| `dewee doctor` | In phiên bản, đường dẫn cấu hình và trạng thái cơ sở dữ liệu |
| `dewee config` | `show` (đã che secret), `path`, `validate` |
| `dewee auth` | `status` và `logout` cho tài khoản ChatGPT kết nối qua gateway |

## Agent và hội thoại

| Lệnh | Subcommand |
|---|---|
| `dewee agent` | `list`, `get`, `status`, `add`, `update`, `delete`, `chat`; `files` để đọc và đặt các file ngữ cảnh của agent; `evolution` cho các đề xuất cải thiện; `access` cho quyền chia sẻ agent |
| `dewee sessions` | `list`, `get`, `history`, `status`, `send`, `rename`, `reset`, `delete` |
| `dewee contacts` | `list`, `get`, `merge`, `unmerge` |
| `dewee pairing` | `list`, `approve`, `revoke` cho người gửi từ ứng dụng chat đang chờ được cấp quyền |
| `dewee tasks` | `comments list` và `comments add` trên task của nhóm agent |

`dewee agent chat` mở một cuộc trò chuyện tương tác với agent có tên trong `--name` (mặc định `default`). Thêm `--message` để hỏi đáp một lần, và `--session` để tiếp tục một session.

```bash
dewee agent chat --name support-bot --message "Summarise today's open tickets"
```

## Năng lực

| Lệnh | Subcommand |
|---|---|
| `dewee providers` | `list`, `add`, `update`, `delete`, `verify`; `access` cho quyền và chế độ mở/giới hạn |
| `dewee skills` | `list`, `show`, `upload`, `export`, `promote`, `metrics`, `activity`; cùng `access`, `grant`, `revoke`, `deps`, `evolve` và `suggestions` |
| `dewee mcp` | `list`, `get`, `tools`, `test`, `reload`, `connect-config`; `access`, `grant`, `revoke`; `oauth` cho server đăng nhập bằng OAuth |
| `dewee packages` | `list`, `get`, `runtimes`, `install`, `remove`, `verify`, `logs`; `approvals` để phê duyệt hoặc từ chối yêu cầu cài đặt; `access` cho quyền và chế độ mở/giới hạn |
| `dewee hooks` | Chỉ có `access`: hook chạy cho những agent nào và ai được sửa nó |
| `dewee channels` | `list`, `add`, `delete` |
| `dewee tts`, `dewee stt` | Provider giọng nói và `config` của chúng |

Mỗi nhóm `access` có `list`, `grant`, `set-level`, `revoke` và `activity`; riêng provider và package có thêm `mode get` và `mode set`. Các mức quyền, chế độ và những gì được kiểm tra được giải thích ở [Cấp quyền theo tài nguyên](/docs/security/access-grants).

## Tự động hoá

| Lệnh | Subcommand |
|---|---|
| `dewee cron` | `list`, `get`, `create`, `update`, `toggle`, `run`, `runs`, `status`, `delete` |
| `dewee workflows` | `list`, `show`, `create`, `validate`, `apply`, `export`, `publish`, `rollback`, `enable`, `disable`, `trigger`, `delete`, `node-types`; `runs` để liệt kê, xem, theo dõi, huỷ hoặc chạy lại |
| `dewee heartbeat` | `get`, `set`, `toggle`, `test`, `logs`, `targets` |
| `dewee reflex` | `status`, `config` (`set`, `set-key`, `reset`), `settings`, `overrides` (`set`, `reset`), `decisions`, `test`, `eval`; xem [Lớp quyết định](/docs/concepts/decision-layer) |

Workflow có thể được giữ dưới dạng file và áp dụng từ CI:

```bash
dewee workflows validate -f workflow.json
dewee workflows apply -f workflow.json
```

## Bộ nhớ, tri thức và file

| Lệnh | Subcommand |
|---|---|
| `dewee memory` | `list`, `get`, `search`, `chunks`, `put`, `delete`, `index`, `index-all`. Cần `--agent` |
| `dewee vault` | `list`, `get`, `search`, `tree`, `links`, `graph`, `upload`, `rescan`, `link`, `enrichment` |
| `dewee kg` | Knowledge graph: `entities`, `entity`, `traverse`, `stats`, `extract`, `dedup`, `merge` |
| `dewee files` | `list`, `get`, `upload`, `delete`, `move`, `size` |

## Quan sát và quản trị

| Lệnh | Subcommand |
|---|---|
| `dewee traces` | `list`, `get`, `follow`, `timeline`, `export` |
| `dewee usage` | `summary`, `list`, `timeseries`, `events` |
| `dewee activity` | `list` |
| `dewee api-keys` | `list`, `create`, `revoke` |
| `dewee settings`, `dewee system-config` | `list`, `get`, `set` (và `reset` cho settings) |
| `dewee import-export` | `preview`, `import` |
| `dewee workstations` | `list`, `create`, `delete` |

## Admin Control Plane

`dewee admin` điều khiển Dewee Admin Control Plane (ACP), dịch vụ vận hành đứng sau các gói hosted và licence của Dewee, không phải một runtime gateway. Nhóm lệnh này dành cho người vận hành nền tảng Dewee. Nó bỏ qua `--server`, `--token` và `DEWEE_API_KEY`, và đọc các thiết lập riêng:

| Thiết lập | Ý nghĩa |
|---|---|
| `DEWEE_ADMIN_TOKEN` hoặc `--token-file` | Thông tin xác thực ACP. Không bao giờ được truyền qua tham số, để không lọt vào lịch sử shell hay danh sách tiến trình |
| `DEWEE_ADMIN_URL` hoặc `--admin-url` | Địa chỉ ACP. Mặc định: `https://admin.dewee.sh` |
| `-o table` hoặc `-o json` | Định dạng đầu ra |

Thông tin xác thực thuộc một trong hai loại:

- **API key ACP có phạm vi** (`dwak_…`, khuyến nghị dùng). Key chỉ có những scope được cấp, lấy từ một preset (`read-only`, `operator`, `super-admin`) hoặc từng scope riêng, và có thể bị giới hạn vào những tài nguyên cụ thể. Key hết hạn sau tối đa 90 ngày (mặc định 30 ngày) và có thể xoay vòng hoặc thu hồi bất cứ lúc nào.
- **Token break-glass.** Token này có quyền super admin, nhưng ACP chỉ chấp nhận khi người vận hành ACP đã mở một cửa sổ thời gian dài tối đa 7 ngày. Ngoài cửa sổ đó, token bị từ chối với mã `admin_break_glass_disabled`; ACP không bao giờ lặng lẽ coi nó là super admin. Chỉ dùng token này để tạo những key đầu tiên và cho tình huống khẩn cấp.

ACP kiểm tra mọi lệnh gọi theo quyền của thông tin xác thực và ghi nhật ký kiểm toán, kể cả các lần bị từ chối. Mỗi request mang một mã tương quan `X-Dewee-Request-Id`, được lưu cùng bản ghi kiểm toán.

| Lệnh | Subcommand |
|---|---|
| `dewee admin early-access` | `status`, `enable`, `disable`, `sync`, `link-discount`, `redemptions` |
| `dewee admin licenses` | `list`, `release-activation`, `resend-delivery` |
| `dewee admin promotions` | `list`, `get`, `create`, `update`, `enable`, `disable`, `sync`, `redemptions` |
| `dewee admin access-grants` | `list`, `get`, `create`, `revoke`, `extend` |
| `dewee admin api-keys` | `list`, `get`, `create`, `rotate`, `revoke` |
| `dewee admin audit` | `list`, lọc theo `--outcome`, `--actor-type`, `--credential-id`, phân trang bằng `--limit` và `--before` |

```bash
export DEWEE_ADMIN_TOKEN=<scoped-api-key>
dewee admin licenses list -o json
dewee admin audit list --outcome deny --limit 20

# Quản lý key, dùng token break-glass khi cửa sổ đang mở
dewee admin --token-file <break-glass-token-file> api-keys create \
  --name ci-reader --preset read-only --expires-in-days 30
dewee admin api-keys rotate <key-id> --grace-minutes 60
dewee admin api-keys revoke <key-id> --reason "leaked in a CI log" --yes
```

API key không bao giờ được liệt kê, tạo, xoay vòng hay thu hồi API key, nên một key bị lộ không thể tự mở rộng quyền. Vì vậy các lệnh `api-keys` cần token break-glass; super admin cũng có thể quản lý key trên các trang web của ACP. Secret của key mới tạo hoặc vừa xoay vòng chỉ được in ra một lần và không thể xem lại. Với `--grace-minutes` (tối đa 1440), key cũ vẫn dùng được trong khoảng thời gian đó để các bên gọi kịp chuyển sang key mới. Thông tin xác thực bị từ chối (không hợp lệ, đã thu hồi, đã hết hạn, hoặc cửa sổ break-glass đã đóng) thoát với mã 3, còn thiếu quyền thoát với mã 4.

## Bảo trì máy chủ

Phần lớn các lệnh này chạy trên máy chủ gateway và làm việc trực tiếp với cơ sở dữ liệu và thư mục dữ liệu. Riêng `tenant-transfer` đi qua gateway và cần key của owner hoặc admin.

| Lệnh | Tác dụng |
|---|---|
| `dewee upgrade` | Nâng cấp schema và dữ liệu. `--status` và `--dry-run` để kiểm tra trước |
| `dewee migrate` | `up`, `down`, `version`, `force`, `goto` để khắc phục sự cố |
| `dewee backup` | Sao lưu toàn bộ cơ sở dữ liệu và file |
| `dewee restore` | Khôi phục bản sao lưu. `--dry-run` để xem trước, `--force` để áp dụng, `smoke` để thử trên cơ sở dữ liệu tạm |
| `dewee tenant-backup`, `dewee tenant-restore` | Tương tự cho một tenant |
| `dewee tenant-transfer` | Xem trước, sao chép hoặc di chuyển tài nguyên giữa các tenant. Đang beta; chỉ với PostgreSQL |

Cách dùng an toàn được hướng dẫn trong [Cài đặt và chạy gateway](/docs/runtime/install-and-run#sao-lưu-và-khôi-phục).
