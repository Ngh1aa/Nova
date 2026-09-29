# Nova Round 01 — Recruitment Operations

**Study state:** RECRUITING  
**Evidence state:** PLANNED  
**Verified sessions:** 0 / 5

This document turns the study plan into an executable recruiting workflow. It does **not** count as user evidence and must not be used to claim that Nova has been validated.

## Target

Recruit 5 completed participants who:
- are 18–30;
- use at least one digital banking app weekly;
- manage recurring payments/subscriptions or make regular transfers;
- can join a 25–35 minute moderated session;
- agree to anonymized research-note use for portfolio evidence.

Do not request real balances, credentials, account numbers, transaction history, screenshots of banking apps, or any other sensitive financial data.

## Recruitment funnel

Track recruitment at the slot level only:

`INVITED → SCREENED → ELIGIBLE → SCHEDULED → COMPLETED → VERIFIED_RECORD`

Alternative terminal states:

`INELIGIBLE · DECLINED · NO_SHOW · WITHDREW · INVALID_SESSION`

A slot becomes `VERIFIED_RECORD` only after its anonymized session file is committed and passes the session integrity checklist.

## Where to recruit

Use people you can contact directly or communities where research participation is allowed. Suitable sources include:
- friends/acquaintances who fit the criteria but were not involved in designing Nova;
- university/alumni communities;
- design/product peer communities where members use digital banking;
- professional/social groups where non-commercial research recruitment is permitted.

Avoid recruiting only designers if possible. The sample should represent digital-banking users, not UI experts.

## Ready-to-send invitation — Vietnamese

> Chào bạn, mình đang thực hiện một buổi usability test ngắn cho Nova — một prototype ứng dụng tài chính cá nhân. Mình cần người 18–30 tuổi có sử dụng app ngân hàng số ít nhất hàng tuần. Buổi test khoảng 25–35 phút, online hoặc trực tiếp, chỉ thao tác trên dữ liệu giả lập. Mình **không** cần và sẽ không hỏi số dư, tài khoản, mật khẩu hay dữ liệu tài chính thật của bạn. Ghi chú nghiên cứu sẽ được ẩn danh. Nếu bạn quan tâm, mình sẽ gửi 5 câu sàng lọc ngắn trước khi hẹn lịch.

## Ready-to-send invitation — English

> Hi! I’m running a short usability study for Nova, a personal-finance prototype. I’m looking for people aged 18–30 who use a digital banking app at least weekly. The session takes about 25–35 minutes, remote or in person, and uses simulated data only. I will **not** ask for real balances, account numbers, credentials, or transaction history. Research notes are anonymized. If you’re interested, I’ll send a short eligibility screener before scheduling.

## Scheduling rule

Before confirming a session:
1. run the screener in `SCREENER-AND-CONSENT.md`;
2. assign the next available slot P01–P05 in `PARTICIPANT-TRACKER.md`;
3. record only the slot status in GitHub — keep names/contact details outside the repository;
4. send the prototype link only after scheduling;
5. remind the participant not to share real financial information.

## Moderator preparation

Before every session:
- record the exact Nova commit/version being tested;
- duplicate `SESSION-TEMPLATE.md` locally as the participant session file;
- verify screen sharing / prototype access;
- read the consent script verbatim;
- remind the participant that stopping at any time is allowed;
- do not explain Money Horizon before Task 1.

## Completion gate

Recruitment activity alone never changes `verified_sessions`.

Only a completed anonymized session record can advance the evidence count. After all five records exist, synthesis may begin in `EVIDENCE-REGISTER.md`; only then can `status.json` be considered for promotion from `PLANNED`.