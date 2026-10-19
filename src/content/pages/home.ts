/**
 * Homepage copy, EN + VI. The page copy is split by locale (home-en.ts, home-vi.ts) and the
 * work story lives in home-workflow.ts; this module joins them and holds the small interface
 * labels. Counts, versions and test figures come from src/content/facts.ts, whose provenance is
 * recorded in docs/marketing-facts.md.
 */
import type { Bi } from "~/i18n/config";
import { HOME_EN } from "./home-en";
import { HOME_VI } from "./home-vi";
import type { HomeCopy } from "./home-types";

export { HOME_WORKFLOW } from "./home-workflow";
export type { HomeCopy, HomeWorkflow, WorkflowStep, WorkflowTone } from "./home-types";

export const HOME: Bi<HomeCopy> = { en: HOME_EN, vi: HOME_VI };

/** In-page anchor of the work story; the hero's secondary call to action points at it. */
export const HOME_WORKFLOW_ANCHOR = "how-it-works";

/** Small interface labels used only by homepage blocks. */
export const HOME_UI: Bi<{
  chatLabel: string;
  gradeLabel: string;
  kinds: { human: string; agent: string; board: string };
  boardLabel: string;
  core: string;
  includes: string;
  tradeoffs: string;
  badge: string;
  deployOptions: string;
}> = {
  en: {
    chatLabel: "Illustrative example: a salesperson, three AI agents and a manager working through one request in a group chat",
    gradeLabel: "Grade: 10 out of 10",
    kinds: { human: "Human", agent: "AI agent", board: "Task board" },
    boardLabel: "Tasks on the team board",
    core: "Your data",
    includes: "What you get",
    tradeoffs: "Keep in mind",
    badge: "Our pick",
    deployOptions: "Deployment options",
  },
  vi: {
    chatLabel: "Ví dụ minh hoạ: một bạn sales, ba AI agent và trưởng phòng cùng xử lý một yêu cầu trong nhóm chat",
    gradeLabel: "Điểm: 10 trên 10",
    kinds: { human: "Con người", agent: "AI agent", board: "Bảng công việc" },
    boardLabel: "Các việc trên bảng công việc của đội",
    core: "Dữ liệu của bạn",
    includes: "Bạn nhận được",
    tradeoffs: "Cần lưu ý",
    badge: "Gợi ý của chúng tôi",
    deployOptions: "Các cách triển khai",
  },
};
