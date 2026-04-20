# Graph Report - E:\fd-advisor  (2026-04-19)

## Corpus Check
- 16 files · ~29,177 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 282 nodes · 494 edges · 67 communities detected
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]

## God Nodes (most connected - your core abstractions)
1. `handleSend()` - 30 edges
2. `t()` - 16 edges
3. `getL()` - 16 edges
4. `init()` - 16 edges
5. `goToStep()` - 11 edges
6. `scrollToBottom()` - 10 edges
7. `selectLangCode()` - 10 edges
8. `escapeHtml()` - 9 edges
9. `confirmBookingStep()` - 9 edges
10. `addAssistantMessage()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `confirmBookingStep()` --calls--> `saveBooking()`  [INFERRED]
  E:\fd-advisor\js\booking-ui.js → E:\fd-advisor\js\booking.js
- `confirmBookingStep()` --calls--> `isBookingPendingLocal()`  [INFERRED]
  E:\fd-advisor\js\booking-ui.js → E:\fd-advisor\js\booking.js
- `getMyBookings()` --calls--> `loadMyBookings()`  [INFERRED]
  E:\fd-advisor\js\booking.js → E:\fd-advisor\js\chat-ui.js
- `init()` --calls--> `canInstall()`  [INFERRED]
  E:\fd-advisor\js\chat-ui.js → js\pwa.js
- `showInstallBanner()` --calls--> `canInstall()`  [INFERRED]
  E:\fd-advisor\js\chat-ui.js → js\pwa.js

## Hyperedges (group relationships)
- **** — module_chat_ui, module_ai_engine, api_puter_ai_chat, data_chatHistory, concept_streaming_ui [INFERRED]
- **** — module_chat_ui, module_voice_engine, api_puter_ai_speech2txt, api_puter_ai_txt2speech [INFERRED]
- **** — module_booking_ui, data_goals, module_fd_data, module_cultural_engine, module_booking_storage, api_puter_kv [INFERRED]
- **** — module_compare_ui, module_fd_data, data_banksData, module_cultural_engine, concept_cultural_intelligence [INFERRED]
- **** — module_persona_engine, data_personas, module_ai_engine, data_personaAnalogies, func_buildSystemPrompt [INFERRED]
- **** — data_jargonExplanations, data_personaAnalogies, module_cultural_engine, func_buildSystemPrompt, api_puter_ai_chat [INFERRED]
- **** — module_puter_init, api_puter_ai_chat, api_puter_auth, api_puter_kv, api_puter_ai_speech2txt, api_puter_ai_txt2speech [INFERRED]
- **** — module_index_ui, data_languageMeta, data_stateLanguageMap, func_detectLanguage, func_selectLangCode [INFERRED]
- **** — module_pwa, file_service_worker, concept_pwa [INFERRED]
- **FD Brand Icon System** — icon_192_app_icon, icon_192_fd_monogram, icon_192_fixed_deposit_identity [INFERRED 0.82]
- **FD Icon Brand Form** — icon_512_app_icon, icon_512_fd_initials, icon_512_circular_badge [EXTRACTED 0.95]

## Communities

### Community 0 - "Community 0"
Cohesion: 0.17
Nodes (34): addAssistantMessage(), addUserMessage(), buildShareText(), computeBestBank(), confirmBookingStep(), confirmTenorStep(), escapeHtml(), formatGoal() (+26 more)

### Community 1 - "Community 1"
Cohesion: 0.1
Nodes (27): acceptDetectedLanguage(), animatePersonaTransition(), applyTypedLanguage(), bootstrapLandingSessionState(), changeDetectedLanguage(), checkReady(), compactModelLabel(), computeGeoBounds() (+19 more)

### Community 2 - "Community 2"
Cohesion: 0.1
Nodes (16): banksData, jargonExplanations, languageInstructions, LANGUAGE_TO_LOCALE, personaAnalogies, buildSystemPrompt(), startApp(), AIEngine (+8 more)

### Community 3 - "Community 3"
Cohesion: 0.26
Nodes (19): canUseKV(), fetchKVBookings(), getBookingStorageHealth(), getKVIndex(), getLocalQueue(), getMyBookings(), isBookingPendingLocal(), mergeBookings() (+11 more)

### Community 4 - "Community 4"
Cohesion: 0.15
Nodes (17): detectBookingIntent(), detectCalculatorIntent(), extractCurrencyAmounts(), extractInterestAmount(), extractPrincipalFromText(), extractTenorMonths(), getBookingStartMessage(), getLanguageSwitchAck() (+9 more)

### Community 5 - "Community 5"
Cohesion: 0.19
Nodes (10): addInlineCalculatorCard(), applyBaseHeaderStatus(), getConnectivityLabel(), hideTyping(), loadMyBookings(), nearestCalcTenor(), openMyBookingsSheet(), parseLanguageSwitchIntent() (+2 more)

### Community 6 - "Community 6"
Cohesion: 0.3
Nodes (14): applyVoiceModeUI(), getL(), getListeningText(), getVoiceReadyTimeoutText(), getVoiceTryAgainText(), hideVoicePrompt(), scheduleVoiceLoopMic(), setMicVisualState() (+6 more)

### Community 7 - "Community 7"
Cohesion: 0.22
Nodes (14): addAssistantMessage(), addInfoBubble(), addUserMessage(), buildSharePayload(), createStreamingBubble(), enableBubbleSpeech(), escapeHtml(), getLastSharedPlan() (+6 more)

### Community 8 - "Community 8"
Cohesion: 0.28
Nodes (9): applyText(), formatLiveMeta(), getCopy(), getLanguageName(), init(), initSession(), renderComparison(), renderConnectionStatus() (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.28
Nodes (9): init(), resetMessageShell(), restoreChatSession(), setLanguage(), setupKeyboardSafeArea(), setupMicInteractions(), showInstallBanner(), updateInputPlaceholder() (+1 more)

### Community 10 - "Community 10"
Cohesion: 0.29
Nodes (4): puter.ai.chat(), puter.auth, BookingStorage, PuterInit

### Community 11 - "Community 11"
Cohesion: 0.33
Nodes (3): dismissInstallBanner(), triggerInstallPrompt(), promptInstall()

### Community 12 - "Community 12"
Cohesion: 0.5
Nodes (5): delay(), insertEmoji(), runDemoModeSequence(), typeAndSendDemoMessage(), updateInputButtons()

### Community 13 - "Community 13"
Cohesion: 0.5
Nodes (2): puter.kv, saveBooking()

### Community 14 - "Community 14"
Cohesion: 0.5
Nodes (4): FD Advisor App Icon, FD Letter Monogram, Fixed Deposit Product Identity, Teal Trust-Centric Brand Palette

### Community 15 - "Community 15"
Cohesion: 0.5
Nodes (4): FD App Icon, Circular Badge Motif, FD Initials, Fixed Deposit Concept

### Community 16 - "Community 16"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Community 17"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Community 18"
Cohesion: 1.0
Nodes (1): Jargon Simplification

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (1): PWAHelper

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Community 23"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Community 24"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Community 25"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Community 26"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Community 27"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Community 28"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Community 29"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Community 30"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Community 31"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Community 32"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Community 33"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Community 34"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Community 35"
Cohesion: 1.0
Nodes (1): GOALS

### Community 36 - "Community 36"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "Community 38"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "Community 39"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "Community 40"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "Community 41"
Cohesion: 1.0
Nodes (1): chatHistory

### Community 42 - "Community 42"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "Community 43"
Cohesion: 1.0
Nodes (0): 

### Community 44 - "Community 44"
Cohesion: 1.0
Nodes (1): FESTIVALS

### Community 45 - "Community 45"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "Community 46"
Cohesion: 1.0
Nodes (0): 

### Community 47 - "Community 47"
Cohesion: 1.0
Nodes (0): 

### Community 48 - "Community 48"
Cohesion: 1.0
Nodes (0): 

### Community 49 - "Community 49"
Cohesion: 1.0
Nodes (1): LANGUAGE_META

### Community 50 - "Community 50"
Cohesion: 1.0
Nodes (1): STATE_LANGUAGE_MAP

### Community 51 - "Community 51"
Cohesion: 1.0
Nodes (0): 

### Community 52 - "Community 52"
Cohesion: 1.0
Nodes (0): 

### Community 53 - "Community 53"
Cohesion: 1.0
Nodes (1): PERSONAS

### Community 54 - "Community 54"
Cohesion: 1.0
Nodes (0): 

### Community 55 - "Community 55"
Cohesion: 1.0
Nodes (0): 

### Community 56 - "Community 56"
Cohesion: 1.0
Nodes (0): 

### Community 57 - "Community 57"
Cohesion: 1.0
Nodes (0): 

### Community 58 - "Community 58"
Cohesion: 1.0
Nodes (0): 

### Community 59 - "Community 59"
Cohesion: 1.0
Nodes (0): 

### Community 60 - "Community 60"
Cohesion: 1.0
Nodes (1): Multilingual Support

### Community 61 - "Community 61"
Cohesion: 1.0
Nodes (1): Persona-Based Advice

### Community 62 - "Community 62"
Cohesion: 1.0
Nodes (1): Cultural Intelligence

### Community 63 - "Community 63"
Cohesion: 1.0
Nodes (1): Streaming UI

### Community 64 - "Community 64"
Cohesion: 1.0
Nodes (1): Voice-First Interactions

### Community 65 - "Community 65"
Cohesion: 1.0
Nodes (1): Progressive Web App

### Community 66 - "Community 66"
Cohesion: 1.0
Nodes (1): Zero-Backend Architecture

## Knowledge Gaps
- **17 isolated node(s):** `languageInstructions`, `personaAnalogies`, `jargonExplanations`, `GOALS`, `BookingStorage` (+12 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 16`** (2 nodes): `puter.ai.speech2txt()`, `startVoiceInput()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (2 nodes): `puter.ai.txt2speech()`, `speakResponse()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (2 nodes): `Jargon Simplification`, `calculateFD()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (2 nodes): `service-worker.js`, `PWAHelper`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (1 nodes): `service-worker.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (1 nodes): `merge.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (1 nodes): `report.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (1 nodes): `visualize.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (1 nodes): `ai-engine.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (1 nodes): `cultural-engine.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (1 nodes): `fd-data.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (1 nodes): `persona-engine.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (1 nodes): `puter-init.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (1 nodes): `voice.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (1 nodes): `detectConfusion()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (1 nodes): `getGreeting()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (1 nodes): `selectGoal()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (1 nodes): `submitAmountStep()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (1 nodes): `renderTenorStep()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (1 nodes): `GOALS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (1 nodes): `addUserMessage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (1 nodes): `addAssistantMessage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (1 nodes): `createStreamingBubble()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (1 nodes): `toggleVoiceMode()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (1 nodes): `startVoiceCapture()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (1 nodes): `chatHistory`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (1 nodes): `renderComparison()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (1 nodes): `getFestivalAlert()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (1 nodes): `FESTIVALS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (1 nodes): `loadRates()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (1 nodes): `getComparison()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 47`** (1 nodes): `formatINR()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (1 nodes): `renderIndiaMap()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 49`** (1 nodes): `LANGUAGE_META`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 50`** (1 nodes): `STATE_LANGUAGE_MAP`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (1 nodes): `getPersona()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (1 nodes): `getPersonaContext()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 53`** (1 nodes): `PERSONAS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (1 nodes): `waitForPuter()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 55`** (1 nodes): `ensureAuth()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 56`** (1 nodes): `isSignedInSilent()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 57`** (1 nodes): `canInstall()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 58`** (1 nodes): `promptInstall()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 59`** (1 nodes): `cleanTextForSpeech()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 60`** (1 nodes): `Multilingual Support`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 61`** (1 nodes): `Persona-Based Advice`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 62`** (1 nodes): `Cultural Intelligence`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 63`** (1 nodes): `Streaming UI`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 64`** (1 nodes): `Voice-First Interactions`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 65`** (1 nodes): `Progressive Web App`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 66`** (1 nodes): `Zero-Backend Architecture`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `loadMyBookings()` connect `Community 5` to `Community 3`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Why does `getMyBookings()` connect `Community 3` to `Community 5`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Why does `confirmBookingStep()` connect `Community 0` to `Community 3`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **What connects `languageInstructions`, `personaAnalogies`, `jargonExplanations` to the rest of the system?**
  _17 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._