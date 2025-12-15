# Product Definition: Olden Era Calculator Suite

## What is it?

A web-based calculator and toolkit for **Heroes of Might and Magic: Olden Era** that helps players optimize hero builds, compare unit effectiveness, and understand game mechanics through interactive tools.

## What problem does it solve?

Players of Heroes of Might and Magic: Olden Era need to:
- **Plan hero builds** before committing resources in-game
- **Calculate actual combat effectiveness** accounting for hero stats, skills, and items
- **Compare balance changes** across game patches
- **Understand complex stat interactions** (how Attack/Defense affects damage, skill bonuses, item set effects)
- **Optimize army compositions** based on hero builds

Currently, players must:
- Manually test builds in-game (time-consuming)
- Use spreadsheets (error-prone, not shareable)
- Guess at optimal configurations
- Lack visibility into patch changes

## Who is it for?

### Primary Users
- **Competitive PvP players** - Need optimal builds for different strategies
- **Theorycrafters** - Want to explore mechanics and find meta builds
- **Campaign players** - Planning long-term hero development

### Secondary Users
- **Content creators** - Sharing build guides and strategies
- **New players** - Learning game mechanics through experimentation
- **Balance analysts** - Tracking changes across patches

## Core Features

### 1. Hero Builder (Priority 1)
**What**: Interactive character planner showing complete hero configuration
**Why**: Most requested feature, foundation for all calculations
**How**:
- Select hero from all factions
- Allocate stat points per level
- Choose skills and skill levels
- Equip items across 14 equipment slots
- Select spells
- Configure starting army

**Output**:
- Complete hero stat sheet
- Army combat effectiveness calculations
- Damage output vs. different defense values
- Effective HP with all bonuses applied

### 2. Combat Calculator (Priority 1)
**What**: Calculate actual damage and combat outcomes
**Why**: Core game mechanic, directly impacts all decisions
**How**:
- Input attacker stats (base + hero bonuses)
- Input defender stats
- Apply skill modifiers (Assault, Protection, etc.)
- Apply luck/morale probabilities
- Show damage ranges and expected values

**Output**:
- Min/max/average damage
- Probability distributions
- "Units killed" estimates
- Comparison: with/without specific bonuses

### 3. Version Comparison (Priority 2)
**What**: Compare stats across game versions
**Why**: Track balance changes, understand meta shifts
**How**:
- Select two game versions
- Choose unit/hero/item to compare
- Display side-by-side diff

**Output**:
- Highlighted changes (buffs/nerfs in green/red)
- Timeline of changes for specific entities
- Patch notes integration

### 4. Army Optimizer (Priority 3)
**What**: Suggest optimal army compositions
**Why**: Complement hero build planning
**How**:
- Input available units and quantities
- Specify constraints (gold budget, unit availability)
- Calculate total combat value with hero bonuses

**Output**:
- Recommended army composition
- Total combat power score
- Synergies with hero build

## Technical Architecture

### Data Pipeline
```
Game Installation (Steam)
    ↓ (Read version from manifest)
    ↓ (Extract Core.zip)
    ↓ (Parse JSON game data)
Database (versioned)
    ↓ (Query by version)
Calculators & UI
```

### Versioned Data Model
All game entities (heroes, units, items, skills, spells) are linked to a **GameVersion**:
- Build ID from Steam
- Last updated timestamp
- Enables historical tracking
- Allows version-specific calculations

### Stack
- **Backend**: Django 6.0 (Python 3.13)
  - Framework-agnostic `core` module for calculations
  - Easy future migration to FastAPI if needed
- **Database**: SQLite (dev), PostgreSQL (production)
- **Frontend**: Django templates (MVP), future SPA option
- **Data Source**: Game installation directory (auto-updates)

## User Workflows

### Workflow 1: Create Hero Build
1. User selects faction and hero
2. Sets target level (e.g., level 20)
3. Allocates stats (following in-game roll probabilities)
4. Chooses skills from available pool
5. Equips items (with set bonuses highlighted)
6. Learns spells
7. Configures starting army
8. **System calculates**:
   - Final hero stats
   - Army damage output
   - Effective HP
   - Special ability effects
9. User shares build via URL or exports

### Workflow 2: Calculate Combat Outcome
1. User inputs attacker unit (or selects from hero build)
2. Inputs defender unit
3. Specifies quantities
4. **System shows**:
   - Damage range per attack
   - Expected casualties per round
   - Battle duration estimate
   - Effect of morale/luck procs
5. User tweaks hero skills to see impact
6. Compares multiple scenarios

### Workflow 3: Track Patch Changes
1. User browses recent game versions
2. Selects version to view
3. Sees "What's Changed" summary
4. Filters by entity type (heroes/units/items)
5. Views detailed before/after comparisons
6. Exports change log

## Success Metrics

### Engagement
- Daily active users
- Average session duration
- Hero builds created per user
- Return rate (weekly)

### Utility
- Build sharing rate
- Calculation runs per session
- Version comparison usage
- Export/share actions

### Growth
- New user acquisition rate
- Social media mentions
- Content creator adoption
- Community contributions (data corrections, new calculators)

## Differentiation

### vs. olden.gg
- **Focus on calculations**: Show impact of choices, not just configuration
- **Version tracking**: Compare across patches
- **Combat outcomes**: Damage calculators, army effectiveness
- **Data-driven**: Automatic updates from game files

### vs. Spreadsheets
- **Interactive**: Live updates, visual feedback
- **Shareable**: URL-based builds
- **Accurate**: Auto-synced with game data
- **Accessible**: No Excel knowledge needed

## Future Enhancements

### Phase 2
- **Faction Laws Calculator** (similar to olden.gg)
- **Town Building Planner** (resource optimization)
- **Campaign Map Tools** (route planning)

### Phase 3
- **API for community tools**
- **User accounts** (save builds)
- **Build ratings/comments**
- **AI-powered recommendations** ("Best builds for this faction")

### Phase 4
- **Real-time PvP analysis** (via game integration or replay parsing)
- **Tournament bracket integration**
- **Clan/team build sharing**

## Launch Strategy

### MVP (Current Phase)
- Hero Builder (basic stats + equipment)
- Combat Calculator (damage formulas)
- Single active version (latest game patch)
- Simple Django templates UI

### Beta
- All calculators functional
- Version comparison working
- Community testing + feedback
- Polish UI/UX

### V1 Launch
- Public release
- Marketing to HoMM community (Reddit, Discord, Steam forums)
- Content creator partnerships
- SEO optimization

## Technical Constraints

### Must Have
- **Fast data updates**: Re-import in <5 minutes when game patches
- **Accurate calculations**: Match game engine exactly
- **Mobile-friendly**: Responsive design (many players browse on phone)
- **Shareable builds**: Persistent URLs

### Nice to Have
- **Offline mode**: PWA for mobile
- **Multi-language**: Support Russian, German, Chinese communities
- **Dark mode**: Preference for gaming community

## Open Questions

1. **Monetization**: Free with optional premium features? Ads? Donations?
2. **Hosting**: Where to deploy for best performance?
3. **Community moderation**: User-submitted builds/comments?
4. **Legal**: Permission needed from game developers?
5. **Data validation**: How to verify calculation accuracy vs. game engine?

## Key Assumptions

- Game will continue to receive balance patches
- Player base is active and engaged enough to use external tools
- Game data structure remains consistent across versions
- Steam manifest provides reliable version info
- Community wants more than just build planning (needs calculations)

## Risks

- **Game changes data format**: Requires parser updates
- **Low adoption**: Tool not valuable enough to attract users
- **Competition**: olden.gg or others add similar features
- **Calculation errors**: Loss of trust if numbers are wrong
- **Maintenance burden**: Keeping up with frequent patches

## Definition of Success

**6 months post-launch:**
- 1,000+ monthly active users
- 10,000+ hero builds created
- Featured in at least 3 content creator videos
- <1% reported calculation errors
- 80%+ mobile usability score
- Listed in top 5 Google results for "heroes olden era calculator"

**1 year:**
- 5,000+ monthly active users
- Integration or partnership with official game community
- Self-sustaining (covers hosting costs)
- Active community contributions
- Recognized as essential tool by competitive players
