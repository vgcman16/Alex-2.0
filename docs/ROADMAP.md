# Roadmap

This document outlines the proposed plan for developing the AI IDE.

## Tech Stack

- **Electron** for desktop shell
- **Monaco Editor** for code editing
- **Node.js** backend (v18+)
- **OpenRouter API** for hosted models
- **Llama.cpp** for local models
- **Yjs** and **WebRTC** for real-time collaboration
- **Docker** and **GitHub Actions** for CI/CD

## Milestones

1. **MVP (4 wks)**
   - Electron window with Monaco editor ✅
   - Basic in-editor chat using OpenRouter completions ✅
   - Inline autocomplete ✅
   - Dev container and CI pipeline ✅
2. **Beta (8 wks)**
   - Autonomous agent to run tasks and create PRs ✅
   - Cost dashboard with OpenRouter headers ✅
   - Real-time collaboration via Yjs ✅
   - Test runner loop and built-in shell
   - Reasoning log with approval step before edits
   - Context-aware chat with code search
3. **v1.0 (12 wks)**
   - Local model runner integration ✅
   - Extension marketplace and plugin API ✅
   - Persistent memory store ✅
   - Windows NSIS installer and winget manifest
   - Status-bar model switcher with routing rules
   - Opt-in telemetry via OpenTelemetry
   - Long-term project wiki memory
   - Security hardening and self-host option
4. **v1.1+**
   - Voice coding ✅
   - Multi-agent code review ✅
   - UI tests ✅
5. **v2.0 (16 wks)**
   - Cloud sync across devices ✅
   - Mobile companion app ✅
   - ChatOps CLI for automation ✅
   - Code search indexing ✅
   - GPU-accelerated local inference ✅

## Next Steps

- 3-pane layout with diff viewer and one-click patch apply ✅
- Light and dark themes with modern icons ✅
- Model flexibility via status bar switcher ✅
- Windows installer auto-update and winget manifest ✅
- Telemetry dashboard and cost tracking ✅
- Sample extension and model plugin
- Architecture diagram and contribution guide
- Demo GIFs and screenshots of core flows
- Continued polish of the mobile UI
- Packaging and installers for each platform
- Enhanced GPU offloading options

## Monetization Plan

### Short answer

Yes — launch it free but tell users from day one that paid tiers are coming. That gives you instant onboarding data without locking you into a forever-free expectation.

### Why "free-first, pay-later" can work

| Benefit | How it helps now |
| --- | --- |
| Accelerates user feedback | A friction-free sign-up means more testers → more bug reports and feature requests before you harden pricing. |
| Builds social proof | Stars, testimonials, Discord chatter, case-study threads — all easier when there’s no paywall. |
| Reduces churn risk | You can watch real-world behaviour, then design pricing around what users actually do (seats, tokens, projects, etc.). |
| Signals goodwill | Early adopters feel like partners, not just customers, if they get to "kick the tyres" first. |

### But avoid the two common traps

1. **Surprise paywall backlash**
   - State in the README, landing page, and onboarding email:
     "Alex-2.0 is in open beta. Core features are free today; paid plans roll out Q4 2025."
     This sets expectations and lets people budget.
2. **Unlimited cost bleed**
   - Free users can rack up LLM or GPU bills. Put hard guard-rails early:
     - daily token cap
     - rate limits
     - or only local-model inference during beta.

### A phased plan that keeps everyone happy

| Phase | What users get | What you learn | Duration |
| --- | --- | --- | --- |
| Public beta (free) | Full feature set but usage-capped; Slack/Discord support. | Core feature adoption, cost curve, bug surface. | 4-8 weeks |
| Founders’ discount | Lock-in offer: "$99/year for life" if they subscribe before GA. | Price-sensitivity signal and early revenue. | 2-3 weeks overlap with beta |
| General Availability | Free tier (token/seat-limited) + Pro/Team paid tiers. | Stable MRR, growth funnels. | Long-term |

### Tactical checklist

- Add a banner inside the app: "Beta — paid plans coming; see roadmap."
- Set hard limits (env vars) for GPT/Claude calls; cut off politely with a "hit limit, try tomorrow" message.
- Collect metrics:
  - active days per user
  - prompts per project
  - model cost per user
  Those numbers shape pricing.
- Prepare Stripe now (test mode). When you flip the switch, it’s just changing the publishable key.
- Grandfather early adopters: free tier stays usable for personal projects so nobody feels bait-and-switched.

### Bottom line

Launch open + free, but be loud and clear that it’s an introductory beta. Set usage caps so costs don’t spiral, watch how people use the product, then roll out subscriptions with a founders’ deal to convert your biggest fans.
